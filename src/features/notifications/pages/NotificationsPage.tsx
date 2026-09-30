import { useState } from 'react'
import Icon from '@/shared/components/Icon'
import { Avatar } from '@/shared/components/Identity'
import { people } from '@/features/feed/data/feed-content'

const notifications = [
  { person: people[2], type: 'heart' as const, text: 'thích câu chuyện bạn chia sẻ.', time: '5 phút trước', copy: 'Một lời nhắc nhỏ cho hôm nay.', post: 3 },
  { person: people[0], type: 'comment' as const, text: 'nhắc đến bạn trong một bình luận.', time: '20 phút trước', copy: '@annguyen Một góc Việt Nam thật đẹp, bạn nhỉ?', post: 1 },
  { person: people[1], type: 'repost' as const, text: 'đăng lại một câu chuyện bạn quan tâm.', time: '1 giờ trước', copy: 'AI và người làm sáng tạo.', post: 2 },
]

export default function NotificationsPage({ unread, onRead }: { unread: boolean; onRead: () => void }) {
  const [mentions, setMentions] = useState(false)
  return <>
    <div className="section-toolbar"><p className="muted">Những kết nối mới, ngay tại đây.</p><button className="text-button" disabled={!unread} onClick={onRead}><Icon name="check" /> {unread ? 'Đánh dấu đã đọc' : 'Đã đọc tất cả'}</button></div>
    <div className="tabs">{['Tất cả', 'Lượt nhắc đến'].map((label, index) => <button className={`tab ${Number(mentions) === index ? 'active' : ''}`} key={label} aria-pressed={Number(mentions) === index} onClick={() => setMentions(index === 1)}>{label}</button>)}</div>
    <p className="section-label">HÔM NAY <span className="muted">· Thông báo minh họa</span></p>
    {notifications.filter(item => !mentions || item.type === 'comment').map(item => <a className={`notification ${unread ? 'unread' : ''}`} key={item.type} href={`#post/${item.post}`} onClick={onRead}><span className={`notification-type ${item.type}`}><Icon name={item.type} /></span><div><Avatar person={item.person} /><p><strong>{item.person.name}</strong> {item.text}</p><blockquote>{item.copy}</blockquote><small>{item.time}</small></div>{unread && <span className="live-dot" />}</a>)}
    <p className="feed-end">Bạn đã xem hết thông báo.</p>
  </>
}
