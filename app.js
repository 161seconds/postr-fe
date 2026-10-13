import { templates, classes, people, trends } from './templates.js';
const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const escape = value => String(value ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const cl = name => name === 'w-full' ? 'w-full min-h-[66px] resize-y border-0 bg-transparent text-[16px] leading-[1.6] [font-family:inherit]' : classes[name] || name;
const icon = name => { const post = document.createElement('template'); post.innerHTML = templates.shell; return $(`[aria-label="${{ home: 'Trang chủ', search: 'Khám phá', bell: 'Thông báo', mail: 'Tin nhắn', bookmark: 'Đã lưu', user: 'Hồ sơ', pen: 'Đăng bài' }[name]}"] svg`, post.content)?.outerHTML || '<span aria-hidden="true">↗</span>'; };
const avatar = person => `<span aria-hidden="true" class="${cl('avatar')} ${escape(person.tone)}">${escape(person.initial)}</span>`;
const normalize = value => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/gi, 'd').toLocaleLowerCase('vi');
export const filterPosts = (posts, query = '', topic = 'Tất cả') => posts.filter(p => (topic === 'Tất cả' || p.topic === topic) && normalize(`${p.copy} ${p.quote || ''} ${p.author.name} ${p.author.handle}`).includes(normalize(query.trim())));
// Open /?check for the native browser self-check; no test framework or build step.
function selfCheck() {
    const posts = [{ id: 1, copy: 'Một góc Hội An #VietnamNow', topic: 'Đời sống', author: { name: 'Mê Việt Nam', handle: '@mevietnam' } }, { id: 2, copy: 'AI tạo sinh', quote: 'Đúng hơn', topic: 'Công nghệ', author: { name: 'Tech Daily', handle: '@techdaily' } }];
    const assert = (value, message) => { if (!value)
        throw new Error(`Frontend check: ${message}`); };
    assert(filterPosts(posts, ' HOI AN ')[0]?.id === 1, 'Vietnamese accents');
    assert(filterPosts(posts, 'dung hon')[0]?.id === 2, 'quote search');
    assert(filterPosts(posts, '@TECHDAILY')[0]?.id === 2, 'author search');
    assert(filterPosts(posts, 'AI', 'Đời sống').length === 0, 'topic filter');
    assert(filterPosts(posts, 'missing').length === 0, 'empty results');
    assert(escape('<img src=x onerror="alert(1)">').includes('&lt;img'), 'HTML escaping');
    assert(!templates.shell.includes('_next'), 'framework-free template');
    console.log('Frontend checks passed: accents, authors, quotes, topics, empty results, escaping.');
}
if (new URLSearchParams(location.search).has('check'))
    selfCheck();
let state, followingTab = false, profileTab = false, topic = 'Tất cả', selected = null, mentions = false, previousRoute = '', saves = Promise.resolve(), toastTimer;
let token = '';
try {
    token = sessionStorage.getItem('postr-token') || '';
}
catch { }
const drafts = new Map();
const imageDrafts = new Map();
const replying = new Set();
// shortcut: Moderation is page-local demo state; use admin endpoints for real moderation.
const hidden = {};
const owns = post => post.author.id ? post.author.id === state.profile.id : post.author.handle === state.profile.handle;
function profileHTML(html) { const p = state.profile; return html.replace(/__(NAME|HANDLE|BIO|LOCATION|INITIAL|FOLLOWING|COUNT|LIKED)__/g, (_, key) => escape({ NAME: p.name, HANDLE: p.handle, BIO: p.bio, LOCATION: p.location || 'Chưa cập nhật vị trí', INITIAL: p.initial, FOLLOWING: state.following.length, COUNT: state.feed.filter(post => owns(post) || state.interactions.repost.includes(post.id)).length, LIKED: state.interactions.like.length }[key])); }
function notice(copy) { const box = $('#toast'); box.className = `${cl('toast')} visible`; box.textContent = copy; clearTimeout(toastTimer); toastTimer = setTimeout(() => { box.className = cl('toast'); box.textContent = ''; }, 4500); }
async function request(path, method = 'GET', body) {
    const response = await fetch(path, { method, headers: { ...(body ? { 'Content-Type': 'application/json' } : {}), ...(token ? { Authorization: `Bearer ${token}` } : {}) }, ...(body ? { body: JSON.stringify(body) } : {}) });
    if (response.status === 401 && path === '/api/state' && token) {
        token = '';
        drafts.clear(); imageDrafts.clear(); replying.clear(); selected = null;
        try {
            sessionStorage.removeItem('postr-token');
        }
        catch { }
        return request(path);
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
    if (!response.ok)
        throw new Error(data?.message || data?.error?.message || 'Không lưu được thay đổi. Vui lòng thử lại.');
    return data;
}
function mutate(path, method = 'POST', body) { const next = saves.then(async () => { state = await request(path, method, body); render(); }); saves = next.catch(() => { }); return next.catch(error => { notice(error.message); throw error; }); }
function fire(path, method, body) { mutate(path, method, body).catch(() => { }); }
function route() { const [name = 'home', parameter = ''] = (location.hash.slice(1) || 'home').split('/'); let query = parameter; try {
    query = decodeURIComponent(parameter);
}
catch { } return { name, parameter, query }; }
function query(value) { history.replaceState(null, '', `#search/${encodeURIComponent(value)}`); render(); }
function postsHTML(posts, empty = 'Chưa có câu chuyện nào ở đây.') {
    if (!posts.length) {
        const name = route().name;
        return `<section class="${cl('empty-state')}">${icon(name === 'bookmark' ? 'bookmark' : 'search')}<h2 class="[margin:.83em_0] font-bold">${empty}</h2><p class="[margin:1em_0]">${name === 'search' ? 'Thử một từ khóa khác hoặc đổi chủ đề.' : 'Khám phá những người thú vị và lưu lại điều bạn yêu thích.'}</p>${name !== 'search' ? `<a class="${cl('follow')}" href="#search">Khám phá cộng đồng</a>` : ''}</section>`;
    }
    return `<div class="post-list">${posts.map(postHTML).join('')}<p class="${cl('feed-end')}">Bạn đã bắt kịp những câu chuyện mới nhất.<br><span>Ghé lại sau, hoặc kể câu chuyện của riêng bạn.</span></p></div>`;
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
    if (post.image && (/^data:image\/(jpeg|png|webp|gif);base64,/.test(post.image) || /^\/api\/v1\/media\/[a-f0-9]{32}$/.test(post.image)))
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
    if (!state)
        return;
    if (location.pathname.startsWith('/admin')) {
        renderAdmin();
        return;
    }
    const { name, parameter, query: search } = route();
    if (name !== previousRoute) {
        topic = 'Tất cả';
        selected = null;
        window.scrollTo(0, 0);
        previousRoute = name;
    }
    let content = '';
    if (name === 'home') {
        content = templates.home.replace('__COMPOSER__', profileHTML(templates.composer)).replace('__POSTS__', postsHTML(followingTab ? state.feed.filter(p => state.following.includes(p.author.handle) || owns(p)) : state.feed));
    }
    if (name === 'search')
        content = templates.search.replace('__POSTS__', postsHTML(filterPosts(state.feed, search, topic), 'Không tìm thấy bài đăng.'));
    if (name === 'bell')
        content = notificationsHTML();
    if (name === 'mail')
        content = templates.mail;
    if (name === 'user')
        content = profileHTML(templates.user).replace('__POSTS__', postsHTML(state.feed.filter(p => profileTab ? state.interactions.like.includes(p.id) : owns(p) || state.interactions.repost.includes(p.id))));
    if (name === 'post')
        content = `<a class="${cl('back-link')}" href="#home">${icon('home')} Trở lại bảng tin</a>` + postsHTML(state.feed.filter(p => p.id === Number(parameter)), 'Không tìm thấy bài đăng.');
    if (name === 'bookmark')
        content = `<div class="${cl('collection-intro')}"><span class="${cl('collection-icon')}">${icon('bookmark')}</span><div><p class="${cl('eyebrow')}">GÓC LƯU GIỮ CỦA RIÊNG BẠN</p><h2 class="[margin:.83em_0] font-bold">Để dành một chút hay.</h2><p class="[margin:1em_0]">${state.interactions.save.length} bài đăng đã lưu · Chỉ mình bạn thấy</p></div></div>` + postsHTML(state.feed.filter(p => state.interactions.save.includes(p.id)), 'Giữ lại những điều đáng nhớ.');
    if (!content)
        content = `<section class="${cl('empty-state')}"><h2>Không tìm thấy trang.</h2><a href="#home">Về trang chủ</a></section>`;
    $('#app').innerHTML = profileHTML(templates.shell).replace('__CONTENT__', content);
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
    $('.heading-actions').prepend(auth);
    $('.theme-toggle').onclick = () => { applyTheme(document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark'); };
    applyTheme(document.documentElement.dataset.theme || 'dark');
    $('.rightbar form').onsubmit = event => { event.preventDefault(); location.hash = `search/${encodeURIComponent($('input', event.currentTarget).value.trim())}`; };
    $$('.suggestion,.person-card').forEach(card => { const handle = $('small', card).textContent; const button = $('button', card); const active = state.following.includes(handle); button.classList.toggle('following', active); button.setAttribute('aria-pressed', active); button.textContent = active ? 'Đang theo dõi' : 'Theo dõi'; button.onclick = () => fire(`/api/following/${encodeURIComponent(handle)}`); });
    if (name === 'home') {
        setTabs(followingTab ? 1 : 0, index => { followingTab = index === 1; render(); });
        if (followingTab)
            $('.feed-intro')?.remove();
        setupComposer($('.composer'));
    }
    if (name === 'search') {
        const input = $('.explore-header input');
        input.value = search;
        input.oninput = () => { const start = input.selectionStart; query(input.value); const next = $('.explore-header input'); next.focus(); try {
            next.setSelectionRange(start, start);
        }
        catch { } };
        $$('.topic-filters button').forEach(button => { button.classList.toggle('selected', button.textContent === topic); button.setAttribute('aria-pressed', button.textContent === topic); button.onclick = () => { topic = button.textContent; render(); }; });
        if (search || topic !== 'Tất cả')
            $$('.explore-trends,.people-section').forEach(node => node.remove());
        $$('.explore-trends button').forEach((button, i) => button.onclick = () => query(trends[i].query));
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
        setTabs(profileTab ? 1 : 0, index => { profileTab = index === 1; render(); });
        const dialog = $('dialog');
        $('.profile-top button').onclick = () => dialog.showModal();
        $('button', dialog).onclick = () => dialog.close();
        $('form', dialog).onsubmit = async (event) => { event.preventDefault(); const data = Object.fromEntries(new FormData(event.currentTarget)); data.name = data.name.trim(); if (!data.name) {
            const input = $('[name=name]', dialog);
            input.setCustomValidity('Vui lòng nhập tên.');
            input.reportValidity();
            return;
        } try {
            await mutate('/api/profile', 'PUT', data);
            notice('Đã cập nhật hồ sơ.');
        }
        catch { } };
        $('[name=name]', dialog).oninput = event => event.target.setCustomValidity('');
    }
    setupPosts();
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
function setupPosts() { $$('.post').forEach(node => { const id = Number(node.dataset.id), post = state.feed.find(p => p.id === id); $$('.actions button', node).forEach(button => button.onclick = async () => { const action = button.dataset.action; if (['like', 'save', 'repost'].includes(action)) {
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
} replying.add(id); button.setAttribute('aria-expanded', true); $('.actions', node).insertAdjacentHTML('afterend', `<section class="${cl('replies')}" aria-label="Bình luận bài đăng">${post.replies.map((copy, index) => `<div class="${cl('reply')}">${avatar(post.replyAuthors?.[index] || state.profile)}<p><strong>${escape(post.replyAuthors?.[index]?.name || state.profile.name)}</strong><br>${escape(copy)}</p></div>`).join('')}<form class="${cl('reply-form')}"><input aria-label="Nội dung bình luận" placeholder="Viết bình luận…" maxlength="280" required><button class="${cl('icon-button')}" aria-label="Gửi bình luận">↗</button></form></section>`); replies = $('.replies', node); $('form', replies).onsubmit = async (event) => { event.preventDefault(); const copy = $('input', replies).value.trim(); if (copy)
    try {
        await mutate(`/api/posts/${id}/replies`, 'POST', { copy });
    }
    catch { } }; $('input', replies).focus(); }); if (replying.has(id)) $('[data-action=reply]', node).click(); }); }
function setupComposer(form) {
    if (!form) return;
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
            await mutate('/api/posts', 'POST', { copy: textarea.value.trim(), ...(image ? { image } : {}) });
            drafts.delete(key); imageDrafts.delete(key); $('#dialogs').replaceChildren(); followingTab = false;
            location.hash = 'home'; render(); notice('Đã thêm bài đăng vào bảng tin.');
        } catch { update(); }
    };
}
function compose() { const dialog = document.createElement('dialog'); dialog.className = cl('modal'); dialog.setAttribute('aria-labelledby', 'compose-title'); dialog.innerHTML = `<div class="${cl('modal-heading')}"><h2 id="compose-title">Một câu chuyện mới</h2><button class="${cl('icon-button')}" aria-label="Đóng bài đăng mới">×</button></div>${profileHTML(templates.composer)}<p class="${cl('demo-note')}">Bài đăng xuất hiện trong bảng tin.</p>`; $('#dialogs').replaceChildren(dialog); $('.modal-heading button', dialog).onclick = () => dialog.close(); setupComposer($('.composer', dialog)); dialog.showModal(); }
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
        $('.avatar', node).outerHTML = avatar({ initial: item.name[0].toUpperCase(), tone: '' });
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
    const contacts = [...people, ...(state.contacts || []).filter(person => !people.some(known => known.handle === person.handle))];
    if (selected) {
        const person = contacts.find(p => p.handle === selected);
        main.insertAdjacentHTML('beforeend', `<section class="${cl('conversation')}"><header class="${cl('conversation-header')}"><button class="${cl('icon-button')}" aria-label="Trở lại hộp thư">‹</button>${avatar(person)}<div><strong>${escape(person.name)}</strong><small>${escape(person.handle)}</small></div></header><div class="${cl('message-history')}" role="log" aria-label="Hội thoại với ${escape(person.name)}"><p class="${cl('conversation-date')}">HỘI THOẠI</p>${(state.threads[selected] || []).map(message => `<div class="${cl('message')} ${message.mine ? 'mine' : ''}"><p>${escape(message.copy)}</p><small>${message.mine ? 'Bạn · Đã lưu' : escape(person.name)}</small></div>`).join('')}</div><form class="${cl('message-form')}"><textarea class="${cl('w-full')}" aria-label="Nội dung tin nhắn" placeholder="Viết một lời nhắn…" maxlength="1000" rows="2" required></textarea><button class="${cl('post-button')}" aria-label="Gửi tin nhắn">↗</button></form><p class="${cl('demo-note')}">Tin nhắn chỉ hiển thị với người tham gia cuộc trò chuyện.</p></section>`);
        $$('.inbox-intro,.thread,.demo-note', main).filter(n => !n.closest('.conversation')).forEach(n => n.remove());
        $('.conversation-header button').onclick = () => { selected = null; render(); };
        const form = $('.message-form'), textarea = $('textarea', form);
        textarea.value = drafts.get(selected) || '';
        textarea.oninput = () => drafts.set(selected, textarea.value);
        form.onsubmit = async (event) => { event.preventDefault(); const handle = selected, copy = textarea.value.trim(); if (copy)
            try {
                await mutate(`/api/messages/${encodeURIComponent(handle)}`, 'POST', { copy });
                drafts.delete(handle);
                render();
            }
            catch { } };
        const log = $('.message-history');
        log.scrollTop = log.scrollHeight;
        return;
    }
    const prototype = $('.thread').cloneNode(true);
    for (const person of contacts.filter(person => !people.some(known => known.handle === person.handle))) {
        const node = prototype.cloneNode(true); $('.avatar', node).outerHTML = avatar(person);
        $('strong', node).textContent = person.name; $('small', node).textContent = person.handle;
        $('.inbox-intro').parentNode.append(node);
    }
    $$('.thread').forEach(button => { const handle = $('small', button).textContent; const messages = state.threads[handle] || []; $('p', button).textContent = messages.at(-1)?.copy || 'Chưa có tin nhắn'; button.onclick = () => { selected = handle; render(); }; });
    $('.inbox-intro input').oninput = event => { const search = normalize(event.target.value); $$('.thread').forEach(button => button.hidden = !normalize(button.textContent).includes(search)); };
}
async function login() { const dialog = document.createElement('dialog'); dialog.className = cl('modal'); dialog.setAttribute('aria-labelledby', 'auth-title'); dialog.innerHTML = `<div class="${cl('modal-heading')}"><h2 id="auth-title">Đăng nhập</h2><button class="${cl('icon-button')}" aria-label="Đóng đăng nhập">×</button></div><form class="${cl('profile-form')}"><label data-register hidden>Tên hiển thị<input name="displayName" maxlength="50"></label><label data-register hidden>Tên người dùng<input name="username" minlength="3" maxlength="30" pattern="[A-Za-z0-9_]+" autocomplete="username"></label><label>Email<input name="email" type="email" required maxlength="254" autocomplete="email"></label><label>Mật khẩu<input name="password" type="password" required minlength="8" maxlength="128" autocomplete="current-password"></label><p role="alert" class="text-accent"></p><button class="${cl('post-button')}" type="submit">Đăng nhập</button><button class="${cl('text-button')}" type="button" data-switch>Chưa có tài khoản? Đăng ký</button></form>`; $('#dialogs').replaceChildren(dialog); $('.modal-heading button', dialog).onclick = () => dialog.close(); let register = false; const form = $('form', dialog); $$('[data-register] input', dialog).forEach(input => input.disabled = true); $('[data-switch]', dialog).onclick = () => { register = !register; $$('[data-register]', dialog).forEach(label => { label.hidden = !register; $('input', label).required = register; $('input', label).disabled = !register; }); $('#auth-title').textContent = register ? 'Đăng ký' : 'Đăng nhập'; $('[type=submit]', form).textContent = register ? 'Đăng ký' : 'Đăng nhập'; $('[data-switch]', dialog).textContent = register ? 'Đã có tài khoản? Đăng nhập' : 'Chưa có tài khoản? Đăng ký'; $('[name=password]', form).autocomplete = register ? 'new-password' : 'current-password'; }; form.onsubmit = async (event) => { event.preventDefault(); const button = $('[type=submit]', form); button.disabled = true; try {
    const body = Object.fromEntries(new FormData(form));
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
    state = await request('/api/state');
    dialog.close();
    render();
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
    drafts.clear(); imageDrafts.clear(); replying.clear(); selected = null;
    try {
        sessionStorage.removeItem('postr-token');
    }
    catch { }
    state = await request('/api/state');
    render();
    notice('Đã đăng xuất.');
}
catch (error) {
    notice(error.message);
} }
function renderAdmin() {
    const posts = state.feed;
    $('#app').innerHTML = `<main class="mx-auto max-w-6xl px-4 py-8 sm:px-8"><header class="flex flex-wrap items-center justify-between gap-4 border-b border-line pb-6"><a href="/" class="font-serif text-3xl font-bold tracking-tight" aria-label="Postr - Trang chủ">postr<span class="text-accent">.admin</span></a><div class="flex items-center gap-4 text-sm"><span class="rounded-full border border-accent px-3 py-1 text-accent">DEMO</span><a href="/" class="text-blue underline underline-offset-4">Về bảng tin</a></div></header><div class="mb-8 mt-6 rounded-2xl border border-line bg-card p-4 text-sm text-muted">Bản demo quản trị. Dữ liệu lấy từ bảng tin demo; ẩn và khôi phục chỉ mô phỏng trên trang này, không thay đổi bảng tin hoặc dữ liệu backend. Tải lại trang sẽ đặt lại trạng thái kiểm duyệt.</div><p class="text-xs font-bold tracking-widest text-accent">KHÔNG GIAN QUẢN TRỊ</p><h1 class="mb-2 mt-2 font-serif text-3xl font-bold sm:text-4xl">Quản lý bài đăng</h1><p class="mb-6 text-sm text-muted">Theo dõi nội dung, tìm kiếm và thử quy trình kiểm duyệt.</p><section aria-label="Thống kê demo" class="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">${[['Tổng bài đăng', posts.length], ['Đang hiển thị', posts.length - Object.keys(hidden).length], ['Đã ẩn trong demo', Object.keys(hidden).length], ['Tác giả trong bảng tin', new Set(posts.map(p => p.author.handle)).size]].map(([label, count]) => `<div class="rounded-2xl border border-line bg-card p-5"><p class="text-xs text-muted">${label}</p><p class="mt-3 font-serif text-3xl font-bold">${count}</p></div>`).join('')}</section><section class="overflow-hidden rounded-2xl border border-line bg-card" aria-label="Danh sách bài đăng"><div class="flex flex-wrap items-end gap-4 border-b border-line p-5"><label class="grid min-w-0 flex-1 gap-2 text-sm font-bold">Tìm bài đăng<input type="search" placeholder="Nội dung, tên hoặc @tác giả…" class="min-h-11 w-full rounded-xl border border-line bg-paper px-4 font-normal"></label><label class="grid gap-2 text-sm font-bold">Trạng thái<select class="min-h-11 rounded-xl border border-line bg-paper px-3 font-normal"><option value="ALL">Tất cả</option><option value="ACTIVE">Đang hiển thị</option><option value="HIDDEN">Đã ẩn</option></select></label></div><p role="status" class="px-5 py-3 text-sm text-muted"></p><div class="overflow-x-auto" role="region" aria-label="Bảng kiểm duyệt bài đăng" tabindex="0"><table class="w-full min-w-[720px] text-left text-sm"><caption class="sr-only">Bài đăng và trạng thái kiểm duyệt mô phỏng</caption><thead class="border-y border-line bg-paper text-xs text-muted"><tr>${['Tác giả', 'Nội dung', 'Trạng thái', 'Thao tác'].map(label => `<th scope="col" class="p-5">${label}</th>`).join('')}</tr></thead><tbody></tbody></table></div></section></main>`;
    const update = () => { const visible = filterPosts(posts, $('input[type=search]').value).filter(p => $('select').value === 'ALL' || ($('select').value === 'HIDDEN' ? hidden[p.id] : !hidden[p.id])); $('[role=status]').textContent = `Tìm thấy ${visible.length} bài đăng.`; $('tbody').innerHTML = visible.map(p => `<tr class="border-b border-line last:border-0"><td class="p-5 align-top"><div class="flex items-center gap-3">${avatar(p.author)}<div><p class="whitespace-nowrap font-bold">${escape(p.author.name)}</p><p class="text-xs text-muted">${escape(p.author.handle)}</p></div></div></td><td class="max-w-md p-5 align-top"><p class="whitespace-pre-wrap break-words">${escape(p.copy || 'Bài đăng có ảnh')}</p><p class="mt-2 text-xs text-muted">${escape(p.topic)} · ${escape(p.time)} · ${p.likes} lượt thích</p>${hidden[p.id] ? `<p class="mt-3 break-words text-xs text-accent">Lý do: ${escape(hidden[p.id])}</p>` : ''}</td><td class="p-5 align-top"><span class="whitespace-nowrap rounded-full border px-3 py-1 text-xs ${hidden[p.id] ? 'border-accent text-accent' : 'border-green text-green'}">${hidden[p.id] ? 'Đã ẩn' : 'Hiển thị'}</span></td><td class="p-5 align-top"><button data-id="${p.id}" class="min-h-11 whitespace-nowrap rounded-full border border-edge px-4 font-bold hover:bg-paper" aria-label="${hidden[p.id] ? 'Khôi phục' : 'Ẩn'} bài của ${escape(p.author.name)}">${hidden[p.id] ? 'Khôi phục' : 'Ẩn bài'}</button></td></tr>`).join(''); $$('tbody button').forEach(button => button.onclick = () => { const id = Number(button.dataset.id); if (hidden[id]) {
        delete hidden[id];
        renderAdmin();
        notice('Đã khôi phục bài đăng trong demo.');
    }
    else
        moderate(id); }); };
    $('input[type=search]').oninput = update;
    $('select').onchange = update;
    update();
}
function moderate(id) { const post = state.feed.find(p => p.id === id), dialog = document.createElement('dialog'); dialog.className = 'm-auto w-[calc(100%_-_2rem)] max-w-lg rounded-2xl border border-edge bg-card p-6 text-ink backdrop:bg-black/60'; dialog.setAttribute('aria-labelledby', 'moderation-title'); dialog.innerHTML = `<form><h2 id="moderation-title" class="font-serif text-2xl font-bold">Ẩn bài đăng</h2><p class="mb-5 mt-2 text-sm text-muted">Bài của ${escape(post.author.name)}. Thao tác chỉ áp dụng trong demo.</p><label class="grid gap-2 text-sm font-bold">Lý do kiểm duyệt<textarea autofocus required minlength="5" maxlength="255" aria-describedby="reason-help reason-error" class="min-h-28 rounded-xl border border-line bg-paper p-3 font-normal" placeholder="Ví dụ: Nội dung spam hoặc quảng cáo lặp lại"></textarea></label><p id="reason-help" class="mt-2 text-xs text-muted">Từ 5–255 ký tự, không tính khoảng trắng đầu và cuối.</p><p id="reason-error" role="alert" class="mt-2 text-sm text-accent"></p><div class="mt-6 flex justify-end gap-3"><button type="button" class="min-h-11 rounded-full border border-edge px-5">Hủy</button><button type="submit" class="min-h-11 rounded-full bg-accent px-5 font-bold text-[#24221f]">Ẩn trong demo</button></div></form>`; $('#dialogs').replaceChildren(dialog); $('[type=button]', dialog).onclick = () => dialog.close(); $('form', dialog).onsubmit = event => { event.preventDefault(); const reason = $('textarea', dialog).value.trim(); if (reason.length < 5 || reason.length > 255) {
    $('#reason-error').textContent = 'Lý do phải từ 5–255 ký tự.';
    return;
} hidden[id] = reason; dialog.close(); renderAdmin(); notice('Đã ẩn bài đăng trong demo.'); }; dialog.showModal(); }
try {
    applyTheme(localStorage.getItem('postr-theme') === 'light' ? 'light' : 'dark');
}
catch {
    applyTheme('dark');
}
window.addEventListener('hashchange', render);
request('/api/state').then(data => { state = data; render(); }).catch(error => { $('#app').innerHTML = '<main class="min-h-dvh grid place-items-center p-6 text-center"><div><p>Không kết nối được Postr API.</p><button>Thử lại</button></div></main>'; $('button').onclick = () => location.reload(); notice(error.message); });
