'use client'

import { useEffect, useRef, useState, useSyncExternalStore } from 'react'
import SiteLayout from '@/shared/components/layout/SiteLayout'
import Icon from '@/shared/components/Icon'
import FeedPage from '@/features/feed/pages/FeedPage'
import ExplorePage from '@/features/explore/pages/ExplorePage'
import NotificationsPage from '@/features/notifications/pages/NotificationsPage'
import MessagesPage, { initialThreads } from '@/features/messages/pages/MessagesPage'
import ProfilePage from '@/features/profile/pages/ProfilePage'
import Composer from '@/features/feed/components/Composer'
import PostCard from '@/features/feed/components/PostCard'
import { initialPosts, initialProfile } from '@/features/feed/data/feed-content'
import { filterPosts, toggleItem } from '@/features/feed/feed-model'
import type { Post, PostAction } from '@/shared/types/post'

function subscribe(callback: () => void) {
  window.addEventListener('hashchange', callback)
  return () => window.removeEventListener('hashchange', callback)
}

function decodeQuery(value: string) {
  try { return decodeURIComponent(value) } catch { return value }
}

export default function App() {
  const hash = useSyncExternalStore(subscribe, () => window.location.hash, () => '')
  const [route = 'home', parameter = ''] = (hash.slice(1) || 'home').split('/')
  // ponytail: demo state lasts one tab session; replace with API persistence when the backend is connected.
  const [feed, setFeed] = useState(initialPosts)
  const [profile, setProfile] = useState(initialProfile)
  const [following, setFollowing] = useState<string[]>(['@mevietnam'])
  const [interactions, setInteractions] = useState<Record<PostAction, number[]>>({ like: [], save: [], repost: [] })
  const [followingTab, setFollowingTab] = useState(false)
  const [profileTab, setProfileTab] = useState('Bài đăng')
  const query = route === 'search' ? decodeQuery(parameter) : ''
  const [topic, setTopic] = useState('Tất cả')
  const [previousRoute, setPreviousRoute] = useState(route)
  const [unread, setUnread] = useState(true)
  const [threads, setThreads] = useState(initialThreads)
  const [notice, setNotice] = useState('')
  const dialog = useRef<HTMLDialogElement>(null)

  if (route !== previousRoute) {
    setPreviousRoute(route)
    setTopic('Tất cả')
  }

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [route])

  useEffect(() => {
    if (!notice) return
    const timer = window.setTimeout(() => setNotice(''), 4500)
    return () => window.clearTimeout(timer)
  }, [notice])

  const onFollow = (handle: string) => setFollowing(current => toggleItem(current, handle))
  const onAction = (id: number, action: PostAction) => setInteractions(current => ({ ...current, [action]: toggleItem(current[action], id) }))
  const onReply = (id: number, copy: string) => setFeed(current => current.map(post => post.id === id ? { ...post, replies: [...post.replies, copy] } : post))
  const ownPosts = feed.filter(post => post.author.handle === profile.handle || interactions.repost.includes(post.id))

  function updateQuery(value: string) {
    window.history.replaceState(null, '', `#search/${encodeURIComponent(value)}`)
    window.dispatchEvent(new HashChangeEvent('hashchange'))
  }

  function publish(copy: string, image?: string) {
    setFeed(current => [{ id: Date.now(), author: profile, time: 'vừa xong', copy, image, topic: 'Đời sống', comments: 0, replies: [], reposts: 0, likes: 0 }, ...current])
    setFollowingTab(false)
    dialog.current?.close()
    window.location.hash = 'home'
    window.scrollTo({ top: 0, behavior: 'smooth' })
    setNotice('Đã thêm bài đăng vào bảng tin trong phiên này.')
  }

  function renderPosts(posts: Post[], empty = 'Chưa có câu chuyện nào ở đây.') {
    return posts.length ? <div className="post-list">{posts.map(post => <PostCard key={post.id} post={post.author.handle === profile.handle ? { ...post, author: profile } : post} liked={interactions.like.includes(post.id)} saved={interactions.save.includes(post.id)} reposted={interactions.repost.includes(post.id)} onAction={onAction} onReply={onReply} onNotice={setNotice} />)}<p className="feed-end m-0 [padding:32px_20px] text-muted text-center text-[11px] leading-[1.9] [&_span]:text-muted [&_span]:text-[12px]">Bạn đã bắt kịp những câu chuyện mới nhất.<br /><span>Ghé lại sau, hoặc kể câu chuyện của riêng bạn.</span></p></div> : <section className="empty-state [padding:70px_28px] text-center [&_>_svg]:w-[36px] [&_>_svg]:h-[36px] [&_>_svg]:text-[#b6a17c] [&_h2]:font-serif [&_h2]:text-[25px] [&_p]:max-w-[310px] [&_p]:[margin:0_auto_22px] [&_p]:text-muted [&_p]:text-[13px] [&_p]:leading-[1.7]"><Icon name={route === 'bookmark' ? 'bookmark' : 'search'} /><h2 className="[margin:.83em_0] font-bold">{empty}</h2><p className="[margin:1em_0]">{route === 'search' ? 'Thử một từ khóa khác hoặc đổi chủ đề.' : 'Khám phá những người thú vị và lưu lại điều bạn yêu thích.'}</p>{route !== 'search' && <a className="follow inline-flex items-center justify-center min-h-[40px] [padding:7px_11px] [border:1.5px_solid_var(--color-edge)] rounded-[100px] bg-transparent text-[12px] font-bold whitespace-nowrap [&:hover]:bg-[light-dark(#eee7dc,_#393229)] [&.following]:bg-ink [&.following]:text-card [&_svg]:w-[15px] [&_svg]:h-[15px]" href="#search">Khám phá cộng đồng</a>}</section>
  }

  return <>
    <SiteLayout route={route} profile={profile} following={following} unread={unread} onFollow={onFollow} onSearch={() => setTopic('Tất cả')} onCompose={() => dialog.current?.showModal()}>
      {route === 'home' && <FeedPage following={followingTab} onTab={setFollowingTab}><Composer person={profile} onPublish={publish} />{renderPosts(followingTab ? feed.filter(post => following.includes(post.author.handle) || post.author.handle === profile.handle) : feed, 'Bảng tin đang chờ những kết nối mới.')}</FeedPage>}
      {route === 'search' && <ExplorePage query={query} topic={topic} onQuery={updateQuery} onTopic={setTopic} following={following} onFollow={onFollow}>{renderPosts(filterPosts(feed, query, topic), 'Không tìm thấy bài đăng.')}</ExplorePage>}
      {route === 'bookmark' && <><div className="collection-intro [&_h2]:[margin:10px_0] [&_h2]:font-serif [&_h2]:text-[26px] [&_h2]:tracking-[-1px] flex items-center gap-[18px] [padding:28px_24px] [border-bottom:1px_solid_var(--color-line)] [&_p:last-child]:text-muted [&_p:last-child]:text-[11px] max-[600px]:[padding:24px_18px] max-[600px]:gap-[14px] max-[600px]:[&_h2]:text-[23px] max-[600px]:[&_.eyebrow]:text-[8px]"><span className="collection-icon grid place-items-center shrink-0 w-[53px] h-[63px] [border:1.5px_solid_var(--color-edge)] rounded-[13px] bg-[light-dark(#efcf8b,_#44351f)] [transform:rotate(-7deg)]"><Icon name="bookmark" /></span><div><p className="[margin:1em_0] eyebrow text-[10px] font-bold tracking-[1.6px]">GÓC LƯU GIỮ CỦA RIÊNG BẠN</p><h2 className="[margin:.83em_0] font-bold">Để dành một chút hay.</h2><p className="[margin:1em_0]">{interactions.save.length} bài đăng đã lưu · Chỉ mình bạn thấy</p></div></div>{renderPosts(feed.filter(post => interactions.save.includes(post.id)), 'Giữ lại những điều đáng nhớ.')}</>}
      {route === 'bell' && <NotificationsPage unread={unread} onRead={() => setUnread(false)} />}
      {route === 'mail' && <MessagesPage threads={threads} onSend={(handle, copy) => setThreads(current => ({ ...current, [handle]: [...current[handle], { copy, mine: true }] }))} />}
      {route === 'user' && <ProfilePage profile={profile} following={following.length} posts={ownPosts.length} liked={interactions.like.length} tab={profileTab} onTab={setProfileTab} onSave={value => { setProfile(value); setNotice('Đã cập nhật hồ sơ trong phiên này.') }}>{renderPosts(profileTab === 'Đã thích' ? feed.filter(post => interactions.like.includes(post.id)) : ownPosts, profileTab === 'Đã thích' ? 'Những điều bạn thích sẽ xuất hiện ở đây.' : 'Câu chuyện đầu tiên đang chờ bạn.')}</ProfilePage>}
      {route === 'post' && <><a className="back-link flex items-center gap-[10px] [padding:20px_24px] text-muted text-[12px] [border-bottom:1px_solid_var(--color-line)]" href="#home"><Icon name="arrow" /> Trở lại bảng tin</a>{renderPosts(feed.filter(post => post.id === Number(parameter)), 'Bài đăng không còn trong phiên này.')}</>}
      {!['home', 'search', 'bookmark', 'bell', 'mail', 'user', 'post'].includes(route) && <section className="empty-state [padding:70px_28px] text-center [&_>_svg]:w-[36px] [&_>_svg]:h-[36px] [&_>_svg]:text-[#b6a17c] [&_h2]:font-serif [&_h2]:text-[25px] [&_p]:max-w-[310px] [&_p]:[margin:0_auto_22px] [&_p]:text-muted [&_p]:text-[13px] [&_p]:leading-[1.7]"><h2 className="[margin:.83em_0] font-bold">Không tìm thấy trang.</h2><a className="follow inline-flex items-center justify-center min-h-[40px] [padding:7px_11px] [border:1.5px_solid_var(--color-edge)] rounded-[100px] bg-transparent text-[12px] font-bold whitespace-nowrap [&:hover]:bg-[light-dark(#eee7dc,_#393229)] [&.following]:bg-ink [&.following]:text-card [&_svg]:w-[15px] [&_svg]:h-[15px]" href="#home">Về trang chủ</a></section>}
    </SiteLayout>
    <dialog className="modal [width:min(550px,_calc(100%_-_28px))] [max-height:calc(100dvh_-_40px)] p-0 overflow-y-auto [border:1.5px_solid_var(--color-edge)] rounded-[20px] bg-card shadow-[8px_8px_0_light-dark(#24221f40,_#00000066)] text-ink [&::backdrop]:bg-[light-dark(#24221f66,_#00000099)] [&::backdrop]:[backdrop-filter:blur(4px)] [&_.composer]:[border:0] max-[600px]:[&_.composer]:[padding:18px_14px]" ref={dialog} aria-labelledby="compose-title"><div className="modal-heading flex justify-between items-center [padding:17px_22px] [border-bottom:1px_solid_var(--color-line)] [&_h2]:m-0 [&_h2]:font-serif [&_h2]:text-[22px] max-[600px]:p-[16px] max-[600px]:[&_h2]:text-[20px]"><h2 className="[margin:.83em_0] font-bold" id="compose-title">Một câu chuyện mới</h2><button className="[font-family:inherit] icon-button inline-grid place-items-center [border:0] bg-transparent rounded-full shrink-0 w-[44px] h-[44px] text-blue [&:hover]:bg-[light-dark(#2466c20d,_#86b6f612)]" aria-label="Đóng bài đăng mới" onClick={() => dialog.current?.close()}><Icon name="close" /></button></div><Composer person={profile} onPublish={publish} /><p className="[margin:1em_0] demo-note m-[18px] text-center text-muted text-[10px] leading-[1.7]">Bài đăng thử nghiệm · Chỉ lưu trong phiên đang mở.</p></dialog>
    <div className={`toast fixed z-[20] left-[50%] bottom-[24px] flex items-center gap-[10px] w-[max-content] [max-width:calc(100%_-_28px)] rounded-[13px] bg-ink text-card text-[12px] [opacity:0] pointer-events-none [transform:translate(-50%,_10px)] [transition:opacity_.2s,_transform_.2s] [&.visible]:[padding:10px_14px] [&.visible]:[opacity:1] [&.visible]:[transform:translate(-50%,_0)] [&.visible]:pointer-events-auto [&_.icon-button]:[color:inherit] max-[600px]:[bottom:calc(82px_+_env(safe-area-inset-bottom))] ${notice ? 'visible' : ''}`} role="status">{notice && <><Icon name="check" />{notice}<button className="[font-family:inherit] icon-button inline-grid place-items-center [border:0] bg-transparent rounded-full shrink-0 w-[44px] h-[44px] text-blue [&:hover]:bg-[light-dark(#2466c20d,_#86b6f612)]" aria-label="Đóng thông báo" onClick={() => setNotice('')}><Icon name="close" /></button></>}</div>
  </>
}
