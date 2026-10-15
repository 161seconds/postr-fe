import { templates, classes } from './templates.js';
const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const escape = value => String(value ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const cl = name => name === 'w-full' ? 'w-full min-h-[66px] resize-y border-0 bg-transparent text-[16px] leading-[1.6] [font-family:inherit]' : classes[name] || name;
const icon = name => { const post = document.createElement('template'); post.innerHTML = templates.shell; return $(`[aria-label="${{ home: 'Trang chủ', search: 'Khám phá', bell: 'Thông báo', mail: 'Tin nhắn', bookmark: 'Đã lưu', user: 'Hồ sơ', pen: 'Đăng bài' }[name]}"] svg`, post.content)?.outerHTML || '<span aria-hidden="true">↗</span>'; };
const mediaURL = value => typeof value === 'string' && (/^data:image\/(jpeg|png|webp|gif);base64,/.test(value) || /^\/api\/v1\/media\/[a-f0-9]{32}$/.test(value));
const avatarContent = person => mediaURL(person?.avatarUrl) ? `<img src="${escape(person.avatarUrl)}" alt="">` : escape(person?.initial);
const avatar = person => `<span aria-hidden="true" class="${cl('avatar')} ${escape(person?.tone)}">${avatarContent(person)}</span>`;
const normalize = value => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/gi, 'd').toLocaleLowerCase('vi');
// Open /?check for the native browser self-check; no test framework or build step.
function selfCheck() {
    const assert = (value, message) => { if (!value)
        throw new Error(`Frontend check: ${message}`); };
    assert(normalize('Hội An ĐÚNG') === 'hoi an dung', 'Vietnamese inbox search');
    assert(escape('<img src=x onerror="alert(1)">').includes('&lt;img'), 'HTML escaping');
    assert(!templates.shell.includes('_next'), 'framework-free template');
    console.log('Frontend checks passed: inbox search, escaping, framework-free template.');
}
if (new URLSearchParams(location.search).has('check'))
    selfCheck();
let state, followingTab = false, profileTab = 0, topic = 'Tất cả', selected = null, mentions = false, previousRoute = '', saves = Promise.resolve(), toastTimer;
let token = '';
try {
    token = sessionStorage.getItem('postr-token') || '';
}
catch { }
const drafts = new Map();
const imageDrafts = new Map();
const replying = new Set();
const pendingReplies = new Set();
const pendingMessages = new Set();
let chatSocket, chatToken = '', chatRetry, chatVersion = 0;
let adminPage = 1, adminSearch = '', adminStatus = 'ALL', adminPosts = [];
let feedPage = 1, stateVersion = 0, feedLoading = false, feedContext = '';
const feedObserver = new IntersectionObserver(entries => {
    if (entries.some(entry => entry.isIntersecting && entry.target.isConnected)) refreshState(true);
}, { rootMargin: '400px 0px' });
const owns = post => !!state.profile && (post.author.id ? post.author.id === state.profile.id : post.author.handle === state.profile.handle);
function profileHTML(html) { const p = state.profile || {}; return html.replace(/__(NAME|HANDLE|BIO|LOCATION|INITIAL|FOLLOWING|COUNT|LIKED)__/g, (_, key) => escape({ NAME: p.name, HANDLE: p.handle, BIO: p.bio, LOCATION: p.location || 'Chưa cập nhật vị trí', INITIAL: p.initial, FOLLOWING: state.following.length, COUNT: p.postCount ?? state.feed.filter(post => owns(post) || state.interactions.repost.includes(post.id)).length, LIKED: state.interactions.like.length }[key])); }
function notice(copy) { const box = $('#toast'); box.className = `${cl('toast')} visible`; box.textContent = copy; clearTimeout(toastTimer); toastTimer = setTimeout(() => { box.className = cl('toast'); box.textContent = ''; }, 4500); }
async function request(path, method = 'GET', body) {
    const sessionToken = token;
    const multipart = body instanceof FormData;
    const response = await fetch(path, { method, headers: { ...(body && !multipart ? { 'Content-Type': 'application/json' } : {}), ...(sessionToken ? { Authorization: `Bearer ${sessionToken}` } : {}) }, ...(body ? { body: multipart ? body : JSON.stringify(body) } : {}) });
    if (response.status === 401 && sessionToken && sessionToken === token && !path.startsWith('/api/v1/auth/')) {
        token = '';
        connectChat();
        state = null;
        drafts.clear(); imageDrafts.clear(); replying.clear(); selected = null; followingTab = false; feedPage = 1;
        try {
            sessionStorage.removeItem('postr-token');
        }
        catch { }
        $('#app').replaceChildren(); $('#dialogs').replaceChildren();
        await refreshState();
    }
    let data;
    if (response.status !== 204) {
        try {
            data = await response.json();
        }
        catch {
            throw new Error('Phản hồi API không hợp lệ.');
        }
    }
    if (!response.ok) {
        const messages = {INVALID_CREDENTIALS:'Tên đăng nhập hoặc mật khẩu không đúng.',ACCOUNT_EXISTS:'Tên đăng nhập hoặc email đã được sử dụng.',UNAUTHORIZED:'Vui lòng đăng nhập.',FORBIDDEN:'Bạn không có quyền thực hiện thao tác này.',INVALID_MEDIA:'Ảnh không hợp lệ. Chọn JPG, PNG, WebP hoặc GIF tối đa 5 MB.',INVALID_MESSAGE:'Tin nhắn không hợp lệ hoặc vượt quá 2.000 ký tự.',INVALID_PROFILE:'Thông tin hồ sơ hoặc ảnh không hợp lệ.',POST_INVALID:'Bài đăng phải có nội dung hoặc ảnh, nội dung tối đa 280 ký tự.',POST_NOT_FOUND:'Bài đăng không còn tồn tại hoặc bạn không có quyền thay đổi.'};
        const error = new Error(messages[data?.code] || data?.message || data?.error?.message || data?.code || 'Không lưu được thay đổi. Vui lòng thử lại.');
        error.status = response.status;
        throw error;
    }
    return data;
}
async function refreshState(append = false) {
    const marker = append ? $('[data-feed-more]') : null;
    if (append && (feedLoading || !marker || feedPage >= state.pagination?.totalPages)) return;
    feedObserver.disconnect();
    feedLoading = true;
    const {name, parameter, query: search} = route();
    if (name !== previousRoute) topic = 'Tất cả';
    let view = name === 'home' ? (followingTab ? 'following' : 'home') : name === 'user' ? ['user', 'reposted', 'liked', 'bookmark'][profileTab] : ['search', 'bookmark', 'post'].includes(name) ? name : 'home';
    if (!token && ['following', 'user', 'reposted', 'liked', 'bookmark'].includes(view)) view = 'home';
    const params = new URLSearchParams({view});
    if (view === 'search') { params.set('q', search); params.set('topic', topic); }
    if (view === 'post') params.set('postId', parameter);
    const context = [location.hash, params.toString(), token].join('|');
    if (context !== feedContext) { feedPage = 1; feedContext = context; window.scrollTo(0, 0); }
    const version = ++stateVersion, sessionToken = token;
    const pages = append ? [feedPage + 1] : Array.from({length:feedPage}, (_, index) => index + 1);
    if (marker) marker.textContent = 'Đang tải thêm bài…';
    try {
        const results = await Promise.all(pages.map(page => request('/api/state?' + params + '&page=' + page)));
        if (version !== stateVersion || sessionToken !== token) return;
        const data = results.at(-1), existing = new Set(append ? state.feed.map(post => post.id) : []);
        const posts = append ? data.feed.filter(post => !existing.has(post.id)) : results.flatMap(result => result.feed);
        state = {...data, feed:[...new Map((append ? [...state.feed, ...posts] : posts).map(post => [post.id, post])).values()]};
        feedPage = data.pagination?.page || 1;
        feedLoading = false;
        if (!append) { render(); return; }
        const batch = document.createElement('div');
        batch.innerHTML = posts.map(postHTML).join('');
        setupPosts(batch);
        marker.before(...batch.childNodes);
        marker.outerHTML = feedEndHTML();
        observeFeed();
    } catch (error) {
        if (version !== stateVersion || sessionToken !== token) return;
        feedLoading = false;
        if (!append) throw error;
        marker.innerHTML = `${escape(error.message)}<br><button class="${cl('follow')}">Thử lại</button>`;
        $('button', marker).onclick = () => refreshState(true);
    }
}
function observeFeed() {
    feedObserver.disconnect();
    const marker = $('[data-feed-more]');
    if (marker && !feedLoading && feedPage < state.pagination?.totalPages) feedObserver.observe(marker);
}
function feedEndHTML() {
    return `<p class="${cl('feed-end')}" data-feed-more role="status">${feedPage < state.pagination?.totalPages ? 'Cuộn xuống để xem thêm bài.' : 'Bạn đã bắt kịp những câu chuyện mới nhất.<br><span>Ghé lại sau, hoặc kể câu chuyện của riêng bạn.</span>'}</p>`;
}
function requireLogin() { if (state.profile) return true; login(); return false; }
function mutate(path, method = 'POST', body) {
    if (!requireLogin()) return Promise.reject(new Error('Vui lòng đăng nhập.'));
    const sessionToken = token;
    const next = saves.then(async () => {
        if (sessionToken !== token) throw new Error('Phiên đăng nhập đã thay đổi.');
        await request(path, method, body);
        if (sessionToken !== token) throw new Error('Phiên đăng nhập đã thay đổi.');
        if (path === '/api/posts') { feedPage = 1; followingTab = false; }
        try { await refreshState(); return true; }
        catch (error) { notice(`Đã lưu thay đổi. Chưa tải lại được dữ liệu: ${error.message}`); return false; }
    });
    saves = next.catch(() => { });
    return next.catch(error => { notice(error.message); throw error; });
}
function fire(path, method, body) { mutate(path, method, body).catch(() => { }); }
function connectChat() {
    if (chatToken === token && (chatSocket || chatRetry)) return;
    clearTimeout(chatRetry); chatRetry = null;
    if (chatSocket) { chatSocket.onclose = null; chatSocket.close(); }
    chatSocket = null; chatToken = token;
    if (!token || !state?.profile) return;
    const sessionToken = token;
    const url = new URL('/hubs/chat', location.href); url.protocol = location.protocol === 'https:' ? 'wss:' : 'ws:'; url.searchParams.set('access_token', sessionToken);
    const socket = chatSocket = new WebSocket(url);
    socket.onopen = () => socket.send(JSON.stringify({protocol:'json',version:1}) + '\x1e');
    socket.onmessage = event => {
        if (socket !== chatSocket || token !== sessionToken) return;
        try {
            for (const raw of event.data.split('\x1e').filter(Boolean)) {
                const frame = JSON.parse(raw);
                if (frame.error || frame.type === 7) { socket.close(); return; }
                if (frame.type === undefined || ['ReceiveMessage','MessageSent'].includes(frame.target)) refreshChat();
            }
        } catch { socket.close(); }
    };
    socket.onclose = () => { if (socket === chatSocket && token === sessionToken) { chatSocket = null; chatRetry = setTimeout(() => { chatRetry = null; connectChat(); }, 2000); } };
}
async function refreshChat() {
    const sessionToken = token, version = ++chatVersion;
    try {
        const data = await request('/api/state?view=home');
        if (sessionToken !== token || version !== chatVersion || !state?.profile) return;
        state.threads = data.threads; state.contacts = data.contacts;
        if (route().name !== 'mail' || location.pathname.startsWith('/admin')) return;
        const input = $('.message-form textarea'), focused = input === document.activeElement, start = input?.selectionStart, end = input?.selectionEnd;
        const log = $('.message-history'), scroll = log?.scrollTop, atBottom = !log || log.scrollHeight - log.scrollTop - log.clientHeight < 60;
        render();
        if (!atBottom && $('.message-history')) $('.message-history').scrollTop = scroll;
        if (focused && $('.message-form textarea')) { const next = $('.message-form textarea'); next.focus({preventScroll:true}); next.setSelectionRange(start, end); }
    } catch (error) {
        if (sessionToken === token && error.status !== 401) {
            notice('Chưa tải được tin nhắn mới. Đang thử lại.');
            setTimeout(() => { if (sessionToken === token) refreshChat(); }, 2000);
        }
    }
}
function route() { const [name = 'home', parameter = ''] = (location.hash.slice(1) || 'home').split('/'); let query = parameter; try {
    query = decodeURIComponent(parameter);
}
catch { } return { name, parameter, query }; }
function query(value) { history.replaceState(null, '', `#search/${encodeURIComponent(value)}`); feedPage = 1; return refreshState().catch(error => notice(error.message)); }
function postsHTML(posts, empty = 'Chưa có câu chuyện nào ở đây.') {
    if (!posts.length) {
        const name = route().name;
        return `<section class="${cl('empty-state')}">${icon(name === 'bookmark' ? 'bookmark' : 'search')}<h2 class="[margin:.83em_0] font-bold">${empty}</h2><p class="[margin:1em_0]">${name === 'search' ? 'Thử một từ khóa khác hoặc đổi chủ đề.' : 'Khám phá những người thú vị và lưu lại điều bạn yêu thích.'}</p>${name !== 'search' ? `<a class="${cl('follow')}" href="#search">Khám phá cộng đồng</a>` : ''}</section>`;
    }
    return `<div class="post-list">${posts.map(postHTML).join('')}${feedEndHTML()}</div>`;
}
function populateCommunity() {
    for (const selector of ['.suggestion', '.person-card']) {
        const sample = $(selector);
        if (!sample) continue;
        const parent = sample.parentNode, prototype = sample.cloneNode(true);
        $$(selector).forEach(node => node.remove());
        for (const person of (state.people || []).slice(0, selector === '.suggestion' ? 3 : 100)) {
            const node = prototype.cloneNode(true);
            $('.avatar', node).outerHTML = avatar(person);
            $('strong', node).textContent = person.name;
            $('strong', node).title = person.name;
            $('small', node).textContent = person.handle;
            $('button', node).setAttribute('aria-label', `Theo dõi ${person.name}`);
            parent.insertBefore(node, $('.side-more', parent));
        }
        if (!(state.people || []).length) parent.insertAdjacentHTML('beforeend', `<p class="${cl('demo-note')}">Chưa có tài khoản khác.</p>`);
    }
    const sample = $('.trend'), parent = sample.parentNode;
    $$('.trend').forEach(node => node.remove());
    (state.trends || []).forEach((item, index) => {
        const node = sample.cloneNode(true);
        node.href = `#search/${encodeURIComponent(item.query)}`;
        $('.trend-rank', node).textContent = String(index + 1).padStart(2, '0');
        $('strong', node).textContent = item.title;
        const labels = $$('small', node); labels[0].textContent = 'Hashtag trên Postr'; labels[1].textContent = `${item.count} bài đăng`;
        parent.append(node);
    });
    if (!(state.trends || []).length) parent.insertAdjacentHTML('beforeend', `<p class="${cl('demo-note')}">Chưa có hashtag.</p>`);
    const explore = $('.explore-trends');
    if (explore) {
        const prototype = $('button', explore).cloneNode(true); explore.replaceChildren();
        (state.trends || []).slice(0, 2).forEach((item, index) => {
            const node = prototype.cloneNode(true);
            $('span', node).textContent = `${index + 1} / HASHTAG TRÊN POSTR`;
            $('strong', node).textContent = item.title; $('small', node).textContent = `${item.count} bài đăng`;
            node.onclick = () => query(item.query); explore.append(node);
        });
    }
    $('.side-footer').textContent = '© 2026 Postr. Tin tức theo cách của bạn.';
}
function postHTML(post) {
    const holder = document.createElement('template');
    holder.innerHTML = profileHTML(templates.post);
    const node = holder.content.firstElementChild;
    node.id = `post-${post.id}`;
    node.dataset.id = post.id;
    const author = owns(post) ? state.profile : post.author;
    $('.avatar', node).outerHTML = avatar(author);
    $('.post-name', node).textContent = author.name;
    $('.handle', node).textContent = author.handle;
    if (author.verified)
        $('.post-name', node).insertAdjacentHTML('afterend', `<span class="${cl('verified')}" aria-label="Đã xác minh">✓</span>`);
    const link = $('.post-time', node);
    link.href = `#post/${post.id}`;
    link.textContent = `· ${post.time}`;
    link.setAttribute('aria-label', `Mở bài đăng của ${author.name}`);
    if (owns(post)) {
        const id = Number(post.id);
        $('.post-head', node).insertAdjacentHTML('beforeend', `<button type="button" class="post-menu-trigger" popovertarget="post-menu-${id}" aria-label="Tùy chọn bài đăng" style="anchor-name:--post-menu-${id}">⋯</button><div id="post-menu-${id}" class="post-menu" popover style="position-anchor:--post-menu-${id}"><button type="button" data-edit-post>Sửa bài đăng</button><button type="button" data-delete-post>Xóa bài đăng</button></div>`);
    }
    $('.post-copy', node).innerHTML = post.copy.split(/(#[\p{L}\p{N}_]+)/u).map(part => part.startsWith('#') ? `<a class="${cl('hashtag')}" href="#search/${encodeURIComponent(part)}">${escape(part)}</a>` : escape(part)).join('');
    const quote = $('.quote-card', node);
    if (post.quote) {
        $('small', quote).textContent = `POSTR NOTE ${String(post.id).padStart(3, '0')}`;
        $('p', quote).textContent = post.quote;
    }
    else
        quote.remove();
    let media = '';
    if (post.media === 'city')
        media = `<div class="${cl('media-city')}" role="img" aria-label="Khung cảnh Việt Nam"><div class="${cl('media-caption')}"><small>Điểm đến hôm nay</small><h3>Những nơi chốn khiến mình muốn đi chậm lại.</h3></div></div>`;
    if (post.media === 'tech')
        media = `<div class="${cl('media-tech')}" role="img" aria-label="Không gian làm việc sáng tạo"></div>`;
    if (mediaURL(post.image))
        media += `<img class="${cl('post-image')}" src="${escape(post.image)}" alt="Ảnh do tác giả đính kèm">`;
    $('.post-copy', node).insertAdjacentHTML('afterend', media);
    const actions = $$('.actions button', node);
    const names = ['reply', 'repost', 'like', 'save', 'share'];
    actions.forEach((button, i) => { const action = names[i]; button.dataset.action = action; button.disabled = false; if (['repost', 'like', 'save'].includes(action)) {
        const active = state.interactions[action].includes(post.id);
        button.setAttribute('aria-pressed', active);
        button.classList.toggle({ repost: 'reposted', like: 'liked', save: 'saved' }[action], active);
    } });
    $('span', actions[0]).textContent = post.comments + post.replies.length;
    $('span', actions[1]).textContent = post.reposts + Number(state.interactions.repost.includes(post.id));
    $('span', actions[2]).textContent = (post.likes + Number(state.interactions.like.includes(post.id))).toLocaleString('vi');
    return node.outerHTML;
}
function render() {
    feedObserver.disconnect();
    if (!state) {
        return;
    }
    connectChat();
    if (location.pathname.startsWith('/admin')) {
        renderAdmin();
        return;
    }
    const { name, parameter, query: search } = route();
    const privatePage = !state.profile && ['bell', 'mail', 'user', 'bookmark'].includes(name);
    if (name !== previousRoute) {
        topic = 'Tất cả';
        selected = null;
        window.scrollTo(0, 0);
        previousRoute = name;
    }
    let content = '';
    if (name === 'home') {
        content = templates.home.replace('__COMPOSER__', state.profile ? profileHTML(templates.composer) : '').replace('__POSTS__', postsHTML(state.feed));
    }
    if (name === 'search')
        content = templates.search.replace('__POSTS__', postsHTML(state.feed, 'Không tìm thấy bài đăng.'));
    if (!privatePage && name === 'bell')
        content = notificationsHTML();
    if (!privatePage && name === 'mail')
        content = templates.mail;
    if (!privatePage && name === 'user')
        content = profileHTML(templates.user).replace('__POSTS__', postsHTML(state.feed));
    if (name === 'post')
        content = `<a class="${cl('back-link')}" href="#home">${icon('home')} Trở lại bảng tin</a>` + postsHTML(state.feed, 'Không tìm thấy bài đăng.');
    if (!privatePage && name === 'bookmark')
        content = `<div class="${cl('collection-intro')}"><span class="${cl('collection-icon')}">${icon('bookmark')}</span><div><p class="${cl('eyebrow')}">GÓC LƯU GIỮ CỦA RIÊNG BẠN</p><h2 class="[margin:.83em_0] font-bold">Để dành một chút hay.</h2><p class="[margin:1em_0]">${state.pagination?.totalRecords ?? state.interactions.save.length} bài đăng đã lưu · Chỉ mình bạn thấy</p></div></div>` + postsHTML(state.feed, 'Giữ lại những điều đáng nhớ.');
    if (privatePage)
        content = `<section class="${cl('empty-state')}"><h2>Đăng nhập để dùng chức năng này.</h2><p>Bạn vẫn có thể đọc bài viết trên bảng tin.</p><button class="${cl('post-button')}" data-login>Đăng nhập / Đăng ký</button></section>`;
    if (!content)
        content = `<section class="${cl('empty-state')}"><h2>Không tìm thấy trang.</h2><a href="#home">Về trang chủ</a></section>`;
    $('#app').innerHTML = profileHTML(templates.shell).replace('__CONTENT__', content);
    if (state.profile) $$('.profile-mini .avatar,.mobile-header-actions .avatar,.composer .avatar,.profile-top .avatar').forEach(node => node.innerHTML = avatarContent(state.profile));
    if (name === 'user' && mediaURL(state.profile?.bannerUrl)) $('.profile-cover').innerHTML = `<img src="${escape(state.profile.bannerUrl)}" alt="Ảnh bìa hồ sơ" class="profile-banner">`;
    $('.shell').classList.toggle('home-shell', name === 'home');
    populateCommunity();
    if (state.profile?.role !== 'ADMIN') $$('.admin-link,.admin-mobile').forEach(link => link.remove());
    if (!state.profile) $$('.profile-mini,.mobile-header-actions [href="#user"]').forEach(link => link.remove());
    const labels = { home: 'Trang chủ', search: 'Khám phá', bell: 'Thông báo', mail: 'Tin nhắn', bookmark: 'Đã lưu', user: 'Hồ sơ', post: 'Bài đăng' };
    $('.page-heading h1').textContent = labels[name] || 'Trang chủ';
    $$('.nav-link,.mobile-nav a').forEach(link => { const active = link.hash === `#${name}`; link.classList.toggle('active', active); active ? link.setAttribute('aria-current', 'page') : link.removeAttribute('aria-current'); });
    if (!state.unread)
        $$('.notification-dot').forEach(dot => dot.remove());
    $('[href="#main-content"]').onclick = event => { event.preventDefault(); $('#main-content').focus(); };
    $$('[aria-label="Đăng bài"],.daily-note button').forEach(button => button.onclick = compose);
    const auth = document.createElement('button');
    auth.className = cl('follow');
    auth.textContent = token ? 'Đăng xuất' : 'Đăng nhập';
    auth.onclick = token ? logout : login;
    if (!state.profile) auth.setAttribute('data-login', '');
    $('.heading-actions').prepend(auth);
    $$('[data-login]').forEach(button => button.onclick = login);
    $('.theme-toggle').onclick = () => { applyTheme(document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark'); };
    applyTheme(document.documentElement.dataset.theme || 'dark');
    $('.rightbar form').onsubmit = event => { event.preventDefault(); location.hash = `search/${encodeURIComponent($('input', event.currentTarget).value.trim())}`; };
    $$('.suggestion,.person-card').forEach(card => { const handle = $('small', card).textContent; const button = $('button', card); const active = state.following.includes(handle); button.classList.toggle('following', active); button.setAttribute('aria-pressed', active); button.textContent = active ? 'Đang theo dõi' : 'Theo dõi'; button.onclick = () => fire(`/api/following/${encodeURIComponent(handle)}`); });
    if (privatePage) return;
    if (name === 'home') {
        setTabs(followingTab ? 1 : 0, index => { if (index === 1 && !requireLogin()) return; followingTab = index === 1; feedPage = 1; refreshState().catch(error => notice(error.message)); });
        if (followingTab)
            $('.feed-intro')?.remove();
        setupComposer($('.composer'));
    }
    if (name === 'search') {
        const input = $('.explore-header input');
        input.value = search;
        input.oninput = async () => { const start = input.selectionStart, value = input.value; await query(value); if (route().query !== value) return; const next = $('.explore-header input'); next?.focus(); try {
            next.setSelectionRange(start, start);
        }
        catch { } };
        $$('.topic-filters button').forEach(button => { button.classList.toggle('selected', button.textContent === topic); button.setAttribute('aria-pressed', button.textContent === topic); button.onclick = () => { topic = button.textContent; feedPage = 1; refreshState().catch(error => notice(error.message)); }; });
        if (search || topic !== 'Tất cả')
            $$('.explore-trends,.people-section').forEach(node => node.remove());
        $('.section-label').textContent = search ? `Kết quả cho “${search}”` : 'Câu chuyện nổi bật';
    }
    if (name === 'bell') {
        setTabs(mentions ? 1 : 0, index => { mentions = index === 1; render(); });
        const read = $('.section-toolbar button');
        read.disabled = !state.unread;
        read.onclick = () => fire('/api/notifications/read', 'PUT');
        if (!state.unread) {
            read.textContent = 'Đã đọc tất cả';
            $$('.notification').forEach(node => { node.classList.remove('unread'); $('.live-dot', node)?.remove(); });
        }
        $$('.notification').forEach(node => node.onclick = () => fire('/api/notifications/read', 'PUT'));
    }
    if (name === 'mail')
        setupMail();
    if (name === 'user') {
        const tabs = $('.profile-tabs'), prototype = $('button', tabs);
        tabs.replaceChildren(...['Bài đăng', 'Đăng lại', 'Đã thích', 'Đã lưu'].map(label => { const button = prototype.cloneNode(true); button.textContent = label; return button; }));
        setTabs(profileTab, index => { profileTab = index; feedPage = 1; refreshState().catch(error => notice(error.message)); });
        const dialog = $('dialog');
        $('.profile-top button').onclick = () => dialog.showModal();
        const form = $('form', dialog), submit = $('.post-button', form), images = {avatarUrl:state.profile.avatarUrl ?? null,bannerUrl:state.profile.bannerUrl ?? null};
        $('[name=location]', form).defaultValue = state.profile.location || '';
        const previews = new Map();
        $$('[data-profile-image]', form).forEach(input => {
            const name = input.dataset.profileImage, preview = $(`[data-image-preview=${name}]`, form);
            const original = images[name + 'Url'];
            if (mediaURL(original)) { preview.src = original; preview.hidden = false; }
            input.onchange = () => {
                const file = input.files[0]; if (!file) return;
                if (!['image/jpeg','image/png','image/webp','image/gif'].includes(file.type) || !file.size || file.size > 5 * 1024 * 1024) { input.value = ''; notice('Chọn ảnh JPG, PNG, WebP hoặc GIF tối đa 5 MB.'); return; }
                if (previews.has(name)) URL.revokeObjectURL(previews.get(name));
                const url = URL.createObjectURL(file); previews.set(name, url); preview.src = url; preview.hidden = false;
            };
        });
        const resetPhotos = () => {
            previews.forEach(url => URL.revokeObjectURL(url)); previews.clear();
            $$('[data-profile-image]', form).forEach(input => {
                input.value = ''; const preview = $(`[data-image-preview=${input.dataset.profileImage}]`, form), url = images[input.dataset.profileImage + 'Url'];
                preview.hidden = !mediaURL(url); if (mediaURL(url)) preview.src = url; else preview.removeAttribute('src');
            });
        };
        const closeProfile = () => { form.reset(); $('[name=name]', form).setCustomValidity(''); resetPhotos(); dialog.close(); };
        $('.modal-heading button', dialog).onclick = closeProfile;
        $('[data-profile-cancel]', form).onclick = closeProfile;
        dialog.addEventListener('cancel', closeProfile);
        dialog.addEventListener('close', () => { if (!dialog.open) resetPhotos(); });
        form.onsubmit = async (event) => { event.preventDefault(); if (submit.disabled) return; const data = Object.fromEntries(new FormData(form)); data.name = data.name.trim(); if (!data.name) {
            const input = $('[name=name]', dialog);
            input.setCustomValidity('Vui lòng nhập tên.');
            input.reportValidity();
            return;
        } submit.disabled = true; $$('input,textarea', form).forEach(input => input.disabled = true); const sessionToken = token;
        try {
            for (const input of $$('[data-profile-image]', form)) {
                if (!input.files[0]) continue;
                const upload = new FormData(); upload.set('file', input.files[0]);
                const result = await request('/api/v1/media', 'POST', upload);
                if (sessionToken !== token || !form.isConnected) return;
                images[input.dataset.profileImage + 'Url'] = result.url; input.value = '';
            }
            if (await mutate('/api/profile', 'PUT', {...data,...images})) { dialog.close(); notice('Đã cập nhật hồ sơ.'); }
            else dialog.close();
        }
        catch (error) { notice(error.message); }
        finally { submit.disabled = false; $$('input,textarea', form).forEach(input => input.disabled = false); } };
        $('[name=name]', dialog).oninput = event => event.target.setCustomValidity('');
    }
    setupPosts();
    observeFeed();
}
function setTabs(index, onTab) { $$('.tabs button').forEach((button, i) => { button.classList.toggle('active', i === index); button.setAttribute('aria-pressed', i === index); button.onclick = () => onTab(i); }); }
function applyTheme(theme) { document.documentElement.dataset.theme = theme; $('meta[name=theme-color]').content = theme === 'dark' ? '#171614' : '#f5f0e8'; try {
    localStorage.setItem('postr-theme', theme);
}
catch { } const button = $('.theme-toggle'); if (button) {
    button.setAttribute('aria-pressed', theme === 'dark');
    button.title = theme === 'dark' ? 'Chuyển sang chế độ sáng' : 'Chuyển sang chế độ tối';
    button.innerHTML = theme === 'dark' ? templates.sun : templates.moon;
} }
function setupPosts(root = document) { $$('.post', root).forEach(node => { const id = Number(node.dataset.id), post = state.feed.find(p => p.id === id);
    if (owns(post)) {
        $('[data-edit-post]', node).onclick = () => { $('[popover]', node).hidePopover(); editPost(post); };
        $('[data-delete-post]', node).onclick = async event => {
            $('[popover]', node).hidePopover();
            if (!confirm('Xóa bài đăng này? Bài sẽ không còn hiển thị trong bảng tin.')) return;
            const button = event.currentTarget; button.disabled = true;
            try {
                const refreshed = await mutate(`/api/posts/${id}`, 'DELETE');
                drafts.delete(id); replying.delete(id);
                if (!refreshed) { state.feed = state.feed.filter(item => item.id !== id); render(); }
                if (route().name === 'post') location.hash = 'home';
                if (refreshed) notice('Đã xóa bài đăng.');
            } catch { button.disabled = false; }
        };
    }
    $$('.actions button', node).forEach(button => button.onclick = async () => { const action = button.dataset.action; if (['like', 'save', 'repost'].includes(action)) {
    fire(`/api/posts/${id}/actions/${action}`);
    return;
} if (action === 'share') {
    const url = `${location.href.split('#')[0]}#post/${id}`;
    try {
        if (navigator.share)
            await navigator.share({ title: `Bài đăng của ${post.author.name}`, text: post.copy, url });
        else {
            await navigator.clipboard.writeText(url);
            notice('Đã sao chép liên kết bài đăng.');
        }
    }
    catch (error) {
        if (error.name !== 'AbortError')
            notice('Không thể sao chép. Mở bài đăng rồi sao chép địa chỉ trên trình duyệt.');
    }
    return;
} let replies = $('.replies', node); if (replies) {
    replies.remove();
    replying.delete(id);
    button.setAttribute('aria-expanded', false);
    return;
} replying.add(id); button.setAttribute('aria-expanded', true); $('.actions', node).insertAdjacentHTML('afterend', `<section class="${cl('replies')}" aria-label="Bình luận bài đăng">${post.replies.map((copy, index) => `<div class="${cl('reply')}">${avatar(post.replyAuthors?.[index] || post.author)}<p><strong>${escape(post.replyAuthors?.[index]?.name || post.author.name)}</strong><br>${escape(copy)}</p></div>`).join('')}${state.profile ? `<form class="${cl('reply-form')}"><input aria-label="Nội dung bình luận" placeholder="Viết bình luận…" maxlength="280" required><button class="${cl('icon-button')}" aria-label="Gửi bình luận">↗</button></form>` : `<button class="${cl('follow')}" data-login>Đăng nhập để bình luận</button>`}</section>`); replies = $('.replies', node); const form = $('form', replies); if (!form) { $('[data-login]', replies).onclick = login; return; }
    const input = $('input', form), submit = $('button', form);
    input.value = drafts.get(id) || '';
    input.oninput = () => drafts.set(id, input.value);
    input.disabled = submit.disabled = pendingReplies.has(id);
    form.onsubmit = async event => {
        event.preventDefault();
        const copy = input.value.trim();
        if (!copy || pendingReplies.has(id)) return;
        pendingReplies.add(id); input.disabled = submit.disabled = true;
        try {
            await mutate(`/api/posts/${id}/replies`, 'POST', { copy });
            drafts.delete(id);
        } catch { }
        finally { pendingReplies.delete(id); render(); }
    };
    input.focus(); }); if (replying.has(id)) $('[data-action=reply]', node).click(); }); }
function setupComposer(form) {
    if (!form) return;
    $('.avatar', form).innerHTML = avatarContent(state.profile);
    const key = form.closest('dialog') ? 'modal' : 'home';
    const textarea = $('textarea', form), file = $('[type=file]', form), counter = $('small', form), submit = $('.post-button', form), emojiButton = $('[aria-label="Thêm biểu cảm"]', form);
    textarea.id = `${key}-draft`;
    $('label', form).htmlFor = textarea.id;
    textarea.value = drafts.get(key) || '';
    let image = imageDrafts.get(key), loading = false, reader;
    const sessionToken = token;
    const update = () => {
        counter.textContent = loading ? 'Đang xử lý…' : `${textarea.value.length}/280`;
        submit.disabled = loading || (!textarea.value.trim() && !image);
        drafts.set(key, textarea.value);
    };
    const preview = () => {
        $('.attachment', form)?.remove();
        if (!image) return;
        textarea.insertAdjacentHTML('afterend', `<div class="${cl('attachment')}"><img src="${escape(image)}" alt="Ảnh đính kèm bài đăng"><button type="button" class="${cl('icon-button')}" aria-label="Xóa ảnh">×</button></div>`);
        $('.attachment button', form).onclick = () => { image = undefined; imageDrafts.delete(key); preview(); update(); };
    };
    textarea.oninput = update;
    update(); preview();
    $('[aria-label="Thêm ảnh"]', form).onclick = () => file.click();
    emojiButton.onclick = () => {
        const picker = $('.emoji-picker', form);
        emojiButton.setAttribute('aria-expanded', !picker);
        if (picker) { picker.remove(); return; }
        $('.composer-tools', form).insertAdjacentHTML('beforebegin', `<div class="${cl('emoji-picker')}" aria-label="Biểu cảm">${['😊', '❤️', '✨', '☕', '🌿', '👏'].map(emoji => `<button type="button" aria-label="Thêm ${emoji}" ${textarea.value.length + emoji.length > 280 ? 'disabled' : ''}>${emoji}</button>`).join('')}</div>`);
        $$('.emoji-picker button', form).forEach(button => button.onclick = () => {
            if (textarea.value.length + button.textContent.length <= 280) textarea.value += button.textContent;
            $('.emoji-picker', form).remove(); emojiButton.setAttribute('aria-expanded', false); update();
        });
    };
    file.onchange = () => {
        const attachment = file.files[0]; file.value = '';
        if (!attachment) return;
        if (!['image/jpeg', 'image/png', 'image/webp', 'image/gif'].includes(attachment.type) || attachment.size > 5 * 1024 * 1024) { notice('Chọn ảnh JPG, PNG, WebP hoặc GIF tối đa 5 MB.'); return; }
        reader?.abort(); reader = new FileReader(); loading = true; update();
        reader.onerror = () => { loading = false; notice('Không đọc được ảnh. Vui lòng chọn lại.'); update(); };
        reader.onload = () => {
            if (token !== sessionToken) return;
            image = reader.result; imageDrafts.set(key, image); loading = false; preview(); update();
            if (!form.isConnected && key === 'home') render();
        };
        reader.readAsDataURL(attachment);
    };
    form.onsubmit = async event => {
        event.preventDefault();
        if ((!textarea.value.trim() && !image) || textarea.value.length > 280 || submit.disabled) return;
        submit.disabled = true;
        try {
            const refreshed = await mutate('/api/posts', 'POST', { copy: textarea.value.trim(), ...(image ? { image } : {}) });
            drafts.delete(key); imageDrafts.delete(key); $('#dialogs').replaceChildren(); followingTab = false;
            if (route().name === 'home') render(); else location.hash = 'home';
            if (refreshed) notice('Đã thêm bài đăng vào bảng tin.');
        } catch { update(); }
    };
}
function compose() { if (!requireLogin()) return; const dialog = document.createElement('dialog'); dialog.className = cl('modal'); dialog.setAttribute('aria-labelledby', 'compose-title'); dialog.innerHTML = `<div class="${cl('modal-heading')}"><h2 id="compose-title">Một câu chuyện mới</h2><button class="${cl('icon-button')}" aria-label="Đóng bài đăng mới">×</button></div>${profileHTML(templates.composer)}<p class="${cl('demo-note')}">Bài đăng xuất hiện trong bảng tin.</p>`; $('#dialogs').replaceChildren(dialog); $('.modal-heading button', dialog).onclick = () => dialog.close(); setupComposer($('.composer', dialog)); dialog.showModal(); }
function editPost(post) {
    if (!owns(post)) return;
    const dialog = document.createElement('dialog'); dialog.className = cl('modal'); dialog.setAttribute('aria-labelledby', 'edit-post-title');
    dialog.innerHTML = `<div class="${cl('modal-heading')}"><h2 id="edit-post-title">Sửa bài đăng</h2><button type="button" class="${cl('icon-button')}" aria-label="Đóng sửa bài đăng">×</button></div><form class="${cl('profile-form')}"><label>Nội dung bài đăng<textarea autofocus name="copy" maxlength="280" rows="5">${escape(post.copy)}</textarea></label><small class="text-muted" role="status"></small><button class="${cl('post-button')}" type="submit">Lưu thay đổi</button></form>`;
    $('#dialogs').replaceChildren(dialog); $('.modal-heading button', dialog).onclick = () => dialog.close();
    const input = $('textarea', dialog), submit = $('[type=submit]', dialog), counter = $('small', dialog);
    const update = () => { input.disabled = false; counter.textContent = `${input.value.length}/280`; submit.disabled = input.value.length > 280 || (!input.value.trim() && !post.image && !post.quote && !post.media); };
    input.oninput = update; update();
    $('form', dialog).onsubmit = async event => {
        event.preventDefault(); if (submit.disabled) return; submit.disabled = input.disabled = true;
        try {
            const copy = input.value.trim(), refreshed = await mutate(`/api/posts/${post.id}`, 'PUT', {copy});
            dialog.close();
            if (!refreshed) { const current = state.feed.find(item => item.id === post.id); if (current) current.copy = copy; render(); }
            if (refreshed) notice('Đã cập nhật bài đăng.');
        } catch { update(); }
    };
    dialog.showModal();
}
function notificationsHTML() {
    const holder = document.createElement('template'); holder.innerHTML = templates.bell;
    const prototype = $('.notification', holder.content).cloneNode(true);
    $$('.notification', holder.content).forEach(node => node.remove());
    $('.section-label', holder.content).textContent = 'THÔNG BÁO CỦA BẠN';
    const items = (state.notifications || []).filter(item => !mentions || ['COMMENT', 'MENTION'].includes(item.type));
    const end = $('.feed-end', holder.content);
    for (const item of items) {
        const node = prototype.cloneNode(true);
        node.href = item.postId ? `#post/${item.postId}` : '#bell';
        node.classList.toggle('unread', !item.read);
        if (item.read) $('.live-dot', node)?.remove();
        $('.avatar', node).outerHTML = avatar({ initial: item.name[0].toUpperCase(), tone: '', avatarUrl: item.avatarUrl });
        const verbs = {LIKE:'thích bài đăng của bạn.',REPOST:'đăng lại bài đăng của bạn.',COMMENT:'bình luận bài đăng của bạn.',MENTION:'nhắc đến bạn.',FOLLOW:'theo dõi bạn.'};
        $('p', node).innerHTML = `<strong>${escape(item.name)}</strong> ${escape(verbs[item.type] || 'gửi thông báo cho bạn.')}`;
        if (item.copy) $('blockquote', node).textContent = item.copy; else $('blockquote', node).remove();
        $('small', node).textContent = new Date(item.createdAt).toLocaleString('vi');
        end.before(node);
    }
    if (!items.length) end.textContent = 'Chưa có thông báo mới.';
    return holder.innerHTML;
}
function setupMail() {
    const main = $('#main-content');
    const contacts = [...(state.contacts || []), ...(state.people || []).filter(person => !(state.contacts || []).some(known => known.handle === person.handle))];
    if (selected) {
        const person = contacts.find(p => p.handle === selected);
        main.insertAdjacentHTML('beforeend', `<section class="${cl('conversation')}"><header class="${cl('conversation-header')}"><button class="${cl('icon-button')}" aria-label="Trở lại hộp thư">‹</button>${avatar(person)}<div><strong>${escape(person.name)}</strong><small>${escape(person.handle)}</small></div></header><div class="${cl('message-history')}" role="log" aria-label="Hội thoại với ${escape(person.name)}"><p class="${cl('conversation-date')}">HỘI THOẠI</p>${(state.threads[selected] || []).map(message => `<div class="${cl('message')} ${message.mine ? 'mine' : ''}"><p>${escape(message.copy)}</p><small>${message.mine ? 'Bạn · Đã lưu' : escape(person.name)}</small></div>`).join('')}</div><form class="${cl('message-form')}"><textarea class="${cl('w-full')}" aria-label="Nội dung tin nhắn" placeholder="Viết một lời nhắn…" maxlength="2000" rows="2" required></textarea><button class="${cl('post-button')}" aria-label="Gửi tin nhắn">↗</button></form><p class="${cl('demo-note')}">Mỗi tin nhắn tối đa 2.000 ký tự, chỉ hiển thị với người tham gia cuộc trò chuyện.</p></section>`);
        $$('.inbox-intro,.thread,.demo-note', main).filter(n => !n.closest('.conversation')).forEach(n => n.remove());
        $('.conversation-header button').onclick = () => { selected = null; render(); };
        const form = $('.message-form'), textarea = $('textarea', form), submit = $('button', form);
        submit.disabled = pendingMessages.has(selected);
        textarea.value = drafts.get(selected) || '';
        textarea.oninput = () => drafts.set(selected, textarea.value);
        form.onsubmit = async (event) => { event.preventDefault(); const handle = selected, copy = textarea.value.trim(); if (!copy || pendingMessages.has(handle)) return;
            pendingMessages.add(handle); submit.disabled = true;
            try {
                await mutate(`/api/messages/${encodeURIComponent(handle)}`, 'POST', { copy });
                if (drafts.get(handle)?.trim() === copy) drafts.delete(handle);
                render();
            }
            catch { }
            finally { pendingMessages.delete(handle); const current = $('.message-form button'); if (current) current.disabled = pendingMessages.has(selected); } };
        const log = $('.message-history');
        log.scrollTop = log.scrollHeight;
        return;
    }
    const prototype = $('.thread').cloneNode(true);
    $$('.thread,.demo-note', main).forEach(node => node.remove());
    for (const person of contacts) {
        const node = prototype.cloneNode(true); $('.avatar', node).outerHTML = avatar(person);
        $('strong', node).textContent = person.name; $('small', node).textContent = person.handle;
        $('.inbox-intro').parentNode.append(node);
    }
    if (!contacts.length) main.insertAdjacentHTML('beforeend', `<p class="${cl('demo-note')}">Chưa có tài khoản khác để nhắn tin.</p>`);
    $$('.thread').forEach(button => { const handle = $('small', button).textContent; const messages = state.threads[handle] || []; $('p', button).textContent = messages.at(-1)?.copy || 'Chưa có tin nhắn'; button.onclick = () => { selected = handle; render(); }; });
    $('.inbox-intro input').oninput = event => { const search = normalize(event.target.value); $$('.thread').forEach(button => button.hidden = !normalize(button.textContent).includes(search)); };
}
async function login() {
    const dialog = document.createElement('dialog'); dialog.className = cl('modal') + ' auth-dialog'; dialog.setAttribute('aria-labelledby', 'auth-title'); dialog.setAttribute('aria-describedby', 'auth-description');
    const eye = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/><path class="password-slash" d="m3 3 18 18"/></svg>';
    const nameDemo = `<div class="auth-name-demo">${avatar({ initial: 'M', tone: '' })}<div><strong class="auth-demo-name">Minh Anh</strong><span class="auth-demo-handle">@minh_anh</span></div></div>`;
    dialog.innerHTML = `<div class="auth-layout">
        <aside class="auth-story" aria-hidden="true">
            <span class="auth-wordmark">postr.</span>
            <div><p class="auth-story-title">Chuyện nhỏ.<br> Kết nối lớn.</p><p class="auth-story-copy">Một góc nhỏ cho những điều bạn muốn kể.</p></div>
            <svg class="auth-art" viewBox="0 0 280 240" fill="none">
                <ellipse cx="140" cy="120" rx="132" ry="80" transform="rotate(-30 140 120)" stroke="#24221f" stroke-opacity=".25"/>
                <ellipse cx="140" cy="120" rx="132" ry="80" transform="rotate(30 140 120)" stroke="#24221f" stroke-opacity=".25"/>
                <g transform="rotate(-8 140 120)"><path d="M62 53h156a15 15 0 0 1 15 15v97a15 15 0 0 1-15 15H103l-32 24v-24h-9a15 15 0 0 1-15-15V68a15 15 0 0 1 15-15Z" fill="#fff3df" stroke="#24221f" stroke-width="1.5"/><text x="67" y="142" fill="#24221f" font-family="serif" font-size="106">“</text><path d="M140 110h60m-60 15h44m-44 15h52" stroke="#24221f" stroke-opacity=".35" stroke-width="3" stroke-linecap="round"/></g>
                <g transform="rotate(10 220 174)"><path d="M191 149h53a10 10 0 0 1 10 10v28a10 10 0 0 1-10 10h-7v12l-17-12h-29a10 10 0 0 1-10-10v-28a10 10 0 0 1 10-10Z" fill="#24221f"/><circle cx="201" cy="173" r="3" fill="#fff3df"/><circle cx="217" cy="173" r="3" fill="#fff3df"/><circle cx="233" cy="173" r="3" fill="#fff3df"/></g>
                <circle cx="41" cy="83" r="8" fill="#24221f"/><path d="m238 28 3 12 12 3-12 3-3 12-3-12-12-3 12-3Z" fill="#24221f"/>
            </svg>
            <p class="auth-story-footer">Viết. Chia sẻ. Tìm thấy nhau.</p>
        </aside>
        <section class="auth-content"><div class="${cl('modal-heading')}"><div><p class="auth-eyebrow">Góc nhỏ của bạn</p><h2 id="auth-title">Đăng nhập</h2><p id="auth-description">Tiếp tục những câu chuyện của bạn.</p></div><button type="button" class="${cl('icon-button')}" aria-label="Đóng đăng nhập">×</button></div><form class="auth-form">
            <div id="auth-display-field" class="auth-name-field" data-register hidden>
                <div class="auth-name-label"><label for="auth-display-name">Tên hiển thị</label><button type="button" class="auth-name-help" popovertarget="auth-display-example" aria-label="Xem ví dụ tên hiển thị" aria-describedby="auth-display-example">Xem ví dụ</button></div>
                <input id="auth-display-name" name="displayName" maxlength="50" autocomplete="name" placeholder="Ví dụ: Minh Anh" aria-describedby="auth-display-hint">
                <p id="auth-display-hint" class="auth-name-hint">Tên trên hồ sơ và bài viết. Có thể trùng.</p>
                <div id="auth-display-example" class="auth-name-example auth-example-display" popover role="tooltip"><p class="auth-example-heading">Ví dụ tên hiển thị trên hồ sơ</p>${nameDemo}<p><strong>Minh Anh</strong> là tên mọi người thấy. Có thể có dấu và khoảng trắng.</p></div>
            </div>
            <div id="auth-username-field" class="auth-name-field" data-register hidden>
                <div class="auth-name-label"><label for="auth-username">Tên tài khoản</label><button type="button" class="auth-name-help" popovertarget="auth-username-example" aria-label="Xem ví dụ tên tài khoản" aria-describedby="auth-username-example">Xem ví dụ</button></div>
                <input id="auth-username" name="username" minlength="3" maxlength="30" pattern="[A-Za-z0-9_]+" title="3–30 ký tự: chữ không dấu, số hoặc dấu gạch dưới (_). Không nhập @." autocomplete="username" placeholder="Ví dụ: minh_anh" aria-describedby="auth-username-hint">
                <p id="auth-username-hint" class="auth-name-hint">Tên duy nhất để đăng nhập. Không nhập @.</p>
                <div id="auth-username-example" class="auth-name-example auth-example-username" popover role="tooltip"><p class="auth-example-heading">Ví dụ tên tài khoản trên hồ sơ</p>${nameDemo}<p><strong>minh_anh</strong> là tên tài khoản. Chỉ dùng chữ không dấu, số hoặc dấu gạch dưới (_); không nhập @.</p></div>
            </div>
            <label><span data-login-label>Tên tài khoản hoặc email</span><input name="email" type="text" required maxlength="254" autocomplete="username" placeholder="Tên tài khoản hoặc email" autofocus></label><div class="auth-password"><label for="auth-password">Mật khẩu</label><div class="password-input"><input id="auth-password" name="password" type="password" required minlength="8" maxlength="128" autocomplete="current-password" placeholder="Nhập mật khẩu của bạn"><button type="button" class="password-toggle" data-password-toggle="mật khẩu" aria-controls="auth-password" aria-label="Hiện mật khẩu" aria-pressed="false">${eye}</button></div></div><div class="auth-password" data-register hidden><label for="auth-confirm-password">Nhập lại mật khẩu</label><div class="password-input"><input id="auth-confirm-password" name="confirmPassword" type="password" minlength="8" maxlength="128" autocomplete="new-password" placeholder="Nhập lại mật khẩu của bạn"><button type="button" class="password-toggle" data-password-toggle="mật khẩu nhập lại" aria-controls="auth-confirm-password" aria-label="Hiện mật khẩu nhập lại" aria-pressed="false">${eye}</button></div></div><p role="alert"></p><button class="${cl('post-button')}" type="submit">Đăng nhập</button></form><p class="auth-switch"><span data-switch-copy>Chưa có tài khoản?</span> <button type="button" data-switch>Đăng ký</button></p></section>
    </div>`;
    $('#dialogs').replaceChildren(dialog); $('.modal-heading button', dialog).onclick = () => dialog.close();
    let register = false; const form = $('form', dialog); $$('[data-register] input', dialog).forEach(input => input.disabled = true);
    $$('.auth-name-field', form).forEach(field => {
        const preview = $('[popover]', field), button = $('[popovertarget]', field);
        field.onpointerenter = event => { if (event.pointerType === 'mouse') preview.showPopover(); };
        field.onpointerleave = () => { if (document.activeElement !== button) preview.hidePopover(); };
        button.onfocus = () => { if (button.matches(':focus-visible')) preview.showPopover(); };
        button.onblur = () => { if (!field.matches(':hover')) preview.hidePopover(); };
    });
    dialog.addEventListener('close', () => $('[popover]:popover-open', dialog)?.hidePopover());
    const password = $('[name=password]', form), confirmation = $('[name=confirmPassword]', form);
    const validatePasswords = () => confirmation.setCustomValidity(register && confirmation.value !== password.value ? 'Mật khẩu nhập lại không khớp.' : '');
    password.oninput = confirmation.oninput = validatePasswords;
    $$('[data-password-toggle]', form).forEach(button => button.onclick = () => {
        const input = $('#' + button.getAttribute('aria-controls'), form), visible = input.type === 'password';
        input.type = visible ? 'text' : 'password';
        button.setAttribute('aria-pressed', visible);
        button.setAttribute('aria-label', `${visible ? 'Ẩn' : 'Hiện'} ${button.dataset.passwordToggle}`);
    });
    $('[data-switch]', dialog).onclick = () => {
        $('[popover]:popover-open', dialog)?.hidePopover();
        register = !register;
        $$('[data-register]', dialog).forEach(label => { label.hidden = !register; $('input', label).required = register; $('input', label).disabled = !register; });
        $('#auth-title').textContent = register ? 'Đăng ký' : 'Đăng nhập'; $('[type=submit]', form).textContent = register ? 'Đăng ký' : 'Đăng nhập';
        $('#auth-description', dialog).textContent = register ? 'Một tài khoản, nhiều câu chuyện mới.' : 'Tiếp tục những câu chuyện của bạn.';
        $('[data-switch-copy]', dialog).textContent = register ? 'Đã có tài khoản?' : 'Chưa có tài khoản?';
        $('[data-switch]', dialog).textContent = register ? 'Đăng nhập' : 'Đăng ký';
        $('[role=alert]', form).textContent = '';
        confirmation.value = ''; validatePasswords();
        $$('[data-password-toggle][aria-pressed=true]', form).forEach(button => button.click());
        $('[name=password]', form).autocomplete = register ? 'new-password' : 'current-password';
        $('[data-login-label]', dialog).textContent = register ? 'Email' : 'Tên tài khoản hoặc email';
        const email = $('[name=email]', dialog); email.type = register ? 'email' : 'text'; email.autocomplete = register ? 'email' : 'username';
        email.placeholder = register ? 'ban@example.com' : 'Tên tài khoản hoặc email';
        $(register ? '[name=displayName]' : '[name=email]', form).focus();
    };
    form.onsubmit = async (event) => { event.preventDefault(); validatePasswords(); if (!form.reportValidity()) return; const button = $('[type=submit]', form); button.disabled = true; try {
    const body = Object.fromEntries(new FormData(form));
    delete body.confirmPassword;
    if (!register) {
        delete body.displayName;
        delete body.username;
        body.login = body.email;
        delete body.email;
    }
    await saves;
    const result = await request(`/api/v1/auth/${register ? 'register' : 'login'}`, 'POST', body);
    token = result.accessToken;
    drafts.clear(); imageDrafts.clear(); replying.clear(); selected = null;
    try {
        sessionStorage.setItem('postr-token', token);
    }
    catch { }
    feedPage = 1; await refreshState();
    dialog.close();
    notice(register ? 'Đã tạo tài khoản.' : 'Đã đăng nhập.');
}
catch (error) {
    $('[role=alert]', form).textContent = error.message;
}
finally {
    button.disabled = false;
} }; dialog.showModal(); }
async function logout() { try {
    await saves;
    await request('/api/v1/auth/logout', 'POST');
    token = '';
    connectChat();
    drafts.clear(); imageDrafts.clear(); replying.clear(); selected = null;
    try {
        sessionStorage.removeItem('postr-token');
    }
    catch { }
    state = null; followingTab = false; feedPage = 1;
    $('#app').replaceChildren(); $('#dialogs').replaceChildren();
    await refreshState();
    notice('Đã đăng xuất.');
}
catch (error) {
    notice(error.message);
} }
function renderAuth() {
    $('#dialogs').replaceChildren();
    $('#app').innerHTML = `<main class="auth-page"><section class="rounded-2xl border border-line bg-card p-6"><h1 class="font-serif text-3xl font-bold">postr.</h1><p class="mb-6 mt-2 text-sm text-muted">Đăng nhập để dùng chức năng quản trị.</p><button class="${cl('post-button')}" data-login>Đăng nhập / Đăng ký</button><p><a href="/">Về bảng tin</a></p></section></main>`;
    $('[data-login]').onclick = login;
}
async function renderAdmin() {
    if (!state.profile) { renderAuth(); return; }
    if (state.profile.role !== 'ADMIN') {
        $('#app').innerHTML = '<main class="min-h-dvh grid place-items-center p-6 text-center"><div><h1>Bạn không có quyền quản trị.</h1><a href="/">Về bảng tin</a></div></main>';
        return;
    }
    $('#app').innerHTML = `<main class="admin-page"><header class="flex flex-wrap items-center justify-between gap-4 border-b border-line pb-6"><a href="/" class="font-serif text-3xl font-bold tracking-tight" aria-label="Postr - Trang chủ">postr<span class="text-accent">.admin</span></a><div class="flex items-center gap-4 text-sm"><a href="/" class="text-blue underline underline-offset-4">Về bảng tin</a><button class="${cl('follow')}" data-logout>Đăng xuất</button></div></header><p class="mt-6 text-xs font-bold tracking-widest text-accent">KHÔNG GIAN QUẢN TRỊ</p><h1 class="mb-2 mt-2 font-serif text-3xl font-bold sm:text-4xl">Quản lý bài đăng</h1><p class="mb-6 text-sm text-muted">Theo dõi nội dung, tìm kiếm và kiểm duyệt.</p><section data-counts aria-label="Thống kê" class="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4"></section><section class="overflow-hidden rounded-2xl border border-line bg-card" aria-label="Danh sách bài đăng"><form data-filter class="flex flex-wrap items-end gap-4 border-b border-line p-5"><label class="grid min-w-0 flex-1 gap-2 text-sm font-bold">Tìm bài đăng<input type="search" maxlength="100" placeholder="Nội dung hoặc tên đăng nhập…" class="min-h-11 w-full rounded-xl border border-line bg-paper px-4 font-normal"></label><label class="grid gap-2 text-sm font-bold">Trạng thái<select class="min-h-11 rounded-xl border border-line bg-paper px-3 font-normal"><option value="ALL">Tất cả</option><option value="ACTIVE">Đang hiển thị</option><option value="HIDDEN">Đã ẩn</option></select></label><button class="${cl('follow')}">Tìm kiếm</button></form><p data-admin-result role="status" class="px-5 py-3 text-sm text-muted"></p><div class="overflow-x-auto" role="region" aria-label="Bảng kiểm duyệt bài đăng" tabindex="0"><table class="w-full min-w-[720px] text-left text-sm"><caption class="sr-only">Bài đăng và trạng thái kiểm duyệt</caption><thead class="border-y border-line bg-paper text-xs text-muted"><tr>${['Tác giả', 'Nội dung', 'Trạng thái', 'Thao tác'].map(label => `<th scope="col" class="p-5">${label}</th>`).join('')}</tr></thead><tbody></tbody></table></div><div class="flex items-center justify-between gap-4 p-5"><button class="${cl('follow')}" data-previous>Trang trước</button><span data-page></span><button class="${cl('follow')}" data-next>Trang sau</button></div></section></main>`;
    $('[data-logout]').onclick = logout;
    const search = $('input[type=search]'), filter = $('select');
    search.value = adminSearch; filter.value = adminStatus;
    let version = 0;
    const load = async () => {
        const currentVersion = ++version, currentToken = token, resultNode = $('[data-admin-result]');
        resultNode.textContent = 'Đang tải…';
        try {
            const [counts, page] = await Promise.all([request('/api/v1/admin/dashboard'), request(`/api/v1/admin/posts?page=${adminPage}&status=${adminStatus}&search=${encodeURIComponent(adminSearch)}`)]);
            if (currentVersion !== version || token !== currentToken || !resultNode.isConnected) return;
            adminPosts = page.data;
            $('[data-counts]').innerHTML = [['Tổng bài đăng', counts.totalPosts], ['Đang hiển thị', counts.activePosts], ['Đã ẩn', counts.hiddenPosts], ['Tài khoản', counts.totalUsers]].map(([label, count]) => `<div class="rounded-2xl border border-line bg-card p-5"><p class="text-xs text-muted">${label}</p><p class="mt-3 font-serif text-3xl font-bold">${count}</p></div>`).join('');
            resultNode.textContent = `Tìm thấy ${page.totalRecords} bài đăng.`;
            $('tbody').innerHTML = page.data.map(post => `<tr class="border-b border-line last:border-0"><td class="p-5 align-top"><p class="font-bold">${escape(post.author.displayName)}</p><p class="text-xs text-muted">@${escape(post.author.username)}</p></td><td class="max-w-md p-5 align-top"><p class="whitespace-pre-wrap break-words">${escape(post.content || 'Bài đăng có ảnh')}</p><p class="mt-2 text-xs text-muted">${escape(new Date(post.createdAt).toLocaleString('vi'))} · ${post.stats.likes} lượt thích</p>${post.moderationReason ? `<p class="mt-3 break-words text-xs text-accent">Lý do: ${escape(post.moderationReason)}</p>` : ''}</td><td class="p-5 align-top"><span class="whitespace-nowrap rounded-full border px-3 py-1 text-xs ${post.status === 'HIDDEN' ? 'border-accent text-accent' : 'border-green text-green'}">${post.status === 'HIDDEN' ? 'Đã ẩn' : post.status === 'DELETED' ? 'Đã xóa' : 'Hiển thị'}</span></td><td class="p-5 align-top">${post.status === 'DELETED' ? '' : `<button data-id="${post.id}" class="min-h-11 whitespace-nowrap rounded-full border border-edge px-4 font-bold hover:bg-paper">${post.status === 'HIDDEN' ? 'Khôi phục' : 'Ẩn bài'}</button>`}</td></tr>`).join('');
            $('[data-page]').textContent = `Trang ${page.page} / ${Math.max(1, page.totalPages)}`;
            $('[data-previous]').disabled = page.page <= 1; $('[data-next]').disabled = page.page >= page.totalPages;
            $$('tbody button').forEach(button => button.onclick = async () => {
                const post = adminPosts.find(item => item.id === button.dataset.id);
                if (post.status !== 'HIDDEN') { moderate(post); return; }
                button.disabled = true;
                try { await request(`/api/v1/admin/posts/${post.id}/status`, 'PATCH', {status:'ACTIVE'}); await load(); notice('Đã khôi phục bài đăng.'); }
                catch (error) { notice(error.message); button.disabled = false; }
            });
        } catch (error) {
            if (currentVersion === version && resultNode.isConnected) resultNode.textContent = error.message;
        }
    };
    $('[data-filter]').onsubmit = event => { event.preventDefault(); adminSearch = search.value.trim(); adminStatus = filter.value; adminPage = 1; load(); };
    filter.onchange = () => { adminStatus = filter.value; adminPage = 1; load(); };
    $('[data-previous]').onclick = () => { adminPage--; load(); };
    $('[data-next]').onclick = () => { adminPage++; load(); };
    await load();
}
function moderate(post) {
    const dialog = document.createElement('dialog'); dialog.className = cl('modal') + ' admin-dialog';
    dialog.setAttribute('aria-labelledby', 'moderation-title');
    dialog.innerHTML = `<form><h2 id="moderation-title" class="font-serif text-2xl font-bold">Ẩn bài đăng</h2><p class="mb-5 mt-2 text-sm text-muted">Bài của ${escape(post.author.displayName)}.</p><label class="grid gap-2 text-sm font-bold">Lý do kiểm duyệt<textarea autofocus required minlength="5" maxlength="255" aria-describedby="reason-help reason-error" class="min-h-28 rounded-xl border border-line bg-paper p-3 font-normal"></textarea></label><p id="reason-help" class="mt-2 text-xs text-muted">Từ 5–255 ký tự, không tính khoảng trắng đầu và cuối.</p><p id="reason-error" role="alert" class="mt-2 text-sm text-accent"></p><div class="mt-6 flex justify-end gap-3"><button type="button" class="min-h-11 rounded-full border border-edge px-5">Hủy</button><button type="submit" class="min-h-11 rounded-full bg-accent px-5 font-bold text-[#24221f]">Ẩn bài</button></div></form>`;
    $('#dialogs').replaceChildren(dialog); $('[type=button]', dialog).onclick = () => dialog.close();
    $('form', dialog).onsubmit = async event => {
        event.preventDefault(); const reason = $('textarea', dialog).value.trim(), button = $('[type=submit]', dialog);
        if (reason.length < 5 || reason.length > 255) { $('#reason-error').textContent = 'Lý do phải từ 5–255 ký tự.'; return; }
        button.disabled = true;
        try { await request(`/api/v1/admin/posts/${post.id}/status`, 'PATCH', {status:'HIDDEN',reason}); dialog.close(); await renderAdmin(); notice('Đã ẩn bài đăng.'); }
        catch (error) { $('#reason-error', dialog).textContent = error.message; button.disabled = false; }
    };
    dialog.showModal();
}
try {
    applyTheme(localStorage.getItem('postr-theme') === 'light' ? 'light' : 'dark');
}
catch {
    applyTheme('dark');
}
window.addEventListener('hashchange', () => { feedPage = 1; refreshState().catch(error => notice(error.message)); });
refreshState().catch(error => { if (error.status === 401) return; $('#app').innerHTML = '<main class="min-h-dvh grid place-items-center p-6 text-center"><div><p>Không kết nối được Postr API.</p><button>Thử lại</button></div></main>'; $('button').onclick = () => location.reload(); notice(error.message); });
