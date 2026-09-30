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
  const hash = useSyncExternalStore(subscribe, () => window.location.hash)
  const [route = 'home', parameter = ''] = (hash.slice(1) || 'home').split('/')
  // ponytail: demo state lasts one tab session; replace with API persistence when the backend is connected.
  const [feed, setFeed] = useState(initialPosts)
  const [profile, setProfile] = useState(initialProfile)
  const [following, setFollowing] = useState<string[]>(['@mevietnam'])
  const [interactions, setInteractions] = useState<Record<PostAction, number[]>>({ like: [], save: [], repost: [] })
  const [followingTab, setFollowingTab] = useState(false)
  const [profileTab, setProfileTab] = useState('Bài đăng')
  const [query, setQuery] = useState(decodeQuery(parameter))
  const [topic, setTopic] = useState('Tất cả')
  const [unread, setUnread] = useState(true)
  const [threads, setThreads] = useState(initialThreads)
  const [notice, setNotice] = useState('')
  const dialog = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    setQuery(route === 'search' ? decodeQuery(parameter) : '')
    setTopic('Tất cả')
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [route, parameter])

  useEffect(() => {
    if (!notice) return
    const timer = window.setTimeout(() => setNotice(''), 4500)
    return () => window.clearTimeout(timer)
  }, [notice])

  const onFollow = (handle: string) => setFollowing(current => toggleItem(current, handle))
  const onAction = (id: number, action: PostAction) => setInteractions(current => ({ ...current, [action]: toggleItem(current[action], id) }))
  const onReply = (id: number, copy: string) => setFeed(current => current.map(post => post.id === id ? { ...post, replies: [...post.replies, copy] } : post))
  const ownPosts = feed.filter(post => post.author.handle === profile.handle || interactions.repost.includes(post.id))

  function publish(copy: string, image?: string) {
    setFeed(current => [{ id: Date.now(), author: profile, time: 'vừa xong', copy, image, topic: 'Đời sống', comments: 0, replies: [], reposts: 0, likes: 0 }, ...current])
    setFollowingTab(false)
    dialog.current?.close()
    window.location.hash = 'home'
    window.scrollTo({ top: 0, behavior: 'smooth' })
    setNotice('Đã thêm bài đăng vào bảng tin trong phiên này.')
  }

  function renderPosts(posts: Post[], empty = 'Chưa có câu chuyện nào ở đây.') {
    return posts.length ? <div className="post-list">{posts.map(post => <PostCard key={post.id} post={post.author.handle === profile.handle ? { ...post, author: profile } : post} liked={interactions.like.includes(post.id)} saved={interactions.save.includes(post.id)} reposted={interactions.repost.includes(post.id)} onAction={onAction} onReply={onReply} onNotice={setNotice} />)}<p className="feed-end">Bạn đã bắt kịp những câu chuyện mới nhất.<br /><span>Ghé lại sau, hoặc kể câu chuyện của riêng bạn.</span></p></div> : <section className="empty-state"><Icon name={route === 'bookmark' ? 'bookmark' : 'search'} /><h2>{empty}</h2><p>{route === 'search' ? 'Thử một từ khóa khác hoặc đổi chủ đề.' : 'Khám phá những người thú vị và lưu lại điều bạn yêu thích.'}</p>{route !== 'search' && <a className="follow" href="#search">Khám phá cộng đồng</a>}</section>
  }

  return <>
    <SiteLayout route={route} profile={profile} following={following} unread={unread} onFollow={onFollow} onCompose={() => dialog.current?.showModal()}>
      {route === 'home' && <FeedPage following={followingTab} onTab={setFollowingTab}><Composer person={profile} onPublish={publish} />{renderPosts(followingTab ? feed.filter(post => following.includes(post.author.handle) || post.author.handle === profile.handle) : feed, 'Bảng tin đang chờ những kết nối mới.')}</FeedPage>}
      {route === 'search' && <ExplorePage query={query} topic={topic} onQuery={setQuery} onTopic={setTopic} following={following} onFollow={onFollow}>{renderPosts(filterPosts(feed, query, topic), 'Không tìm thấy bài đăng.')}</ExplorePage>}
      {route === 'bookmark' && <><div className="collection-intro"><span className="collection-icon"><Icon name="bookmark" /></span><div><p className="eyebrow">GÓC LƯU GIỮ CỦA RIÊNG BẠN</p><h2>Để dành một chút hay.</h2><p>{interactions.save.length} bài đăng đã lưu · Chỉ mình bạn thấy</p></div></div>{renderPosts(feed.filter(post => interactions.save.includes(post.id)), 'Giữ lại những điều đáng nhớ.')}</>}
      {route === 'bell' && <NotificationsPage unread={unread} onRead={() => setUnread(false)} />}
      {route === 'mail' && <MessagesPage threads={threads} onSend={(handle, copy) => setThreads(current => ({ ...current, [handle]: [...current[handle], { copy, mine: true }] }))} />}
      {route === 'user' && <ProfilePage profile={profile} following={following.length} posts={ownPosts.length} liked={interactions.like.length} tab={profileTab} onTab={setProfileTab} onSave={value => { setProfile(value); setNotice('Đã cập nhật hồ sơ trong phiên này.') }}>{renderPosts(profileTab === 'Đã thích' ? feed.filter(post => interactions.like.includes(post.id)) : ownPosts, profileTab === 'Đã thích' ? 'Những điều bạn thích sẽ xuất hiện ở đây.' : 'Câu chuyện đầu tiên đang chờ bạn.')}</ProfilePage>}
      {route === 'post' && <><a className="back-link" href="#home"><Icon name="arrow" /> Trở lại bảng tin</a>{renderPosts(feed.filter(post => post.id === Number(parameter)), 'Bài đăng không còn trong phiên này.')}</>}
      {!['home', 'search', 'bookmark', 'bell', 'mail', 'user', 'post'].includes(route) && <section className="empty-state"><h2>Không tìm thấy trang.</h2><a className="follow" href="#home">Về trang chủ</a></section>}
    </SiteLayout>
    <dialog className="modal" ref={dialog} aria-labelledby="compose-title"><div className="modal-heading"><h2 id="compose-title">Một câu chuyện mới</h2><button className="icon-button" aria-label="Đóng bài đăng mới" onClick={() => dialog.current?.close()}><Icon name="close" /></button></div><Composer person={profile} onPublish={publish} /><p className="demo-note">Bài đăng thử nghiệm · Chỉ lưu trong phiên đang mở.</p></dialog>
    <div className={`toast ${notice ? 'visible' : ''}`} role="status">{notice && <><Icon name="check" />{notice}<button className="icon-button" aria-label="Đóng thông báo" onClick={() => setNotice('')}><Icon name="close" /></button></>}</div>
  </>
}
