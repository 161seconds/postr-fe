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
    <div className="section-toolbar flex flex-wrap items-center justify-between gap-[10px] [padding:16px_24px] text-[12px] [&_svg]:w-[15px] max-[600px]:[padding:14px_18px]"><p className="[margin:1em_0] muted text-muted">Những kết nối mới, ngay tại đây.</p><button className="[font-family:inherit] text-button inline-flex items-center gap-[6px] p-0 min-h-[30px] [border:0] bg-transparent text-[11px] font-bold [&:hover]:underline" disabled={!unread} onClick={onRead}><Icon name="check" /> {unread ? 'Đánh dấu đã đọc' : 'Đã đọc tất cả'}</button></div>
    <div className="tabs grid grid-cols-[1fr_1fr] [border-bottom:1px_solid_var(--color-line)]">{['Tất cả', 'Lượt nhắc đến'].map((label, index) => <button className={`[font-family:inherit] tab relative [padding:18px_8px] min-h-[52px] [border:0] bg-transparent text-muted font-bold text-[13px] [&:hover]:bg-[#e8dfd140] [&.active]:text-ink [&.active::after]:absolute [&.active::after]:bottom-[-1px] [&.active::after]:left-[50%] [&.active::after]:w-[64px] [&.active::after]:h-[3px] [&.active::after]:rounded-[3px] [&.active::after]:bg-accent [&.active::after]:content-[''] [&.active::after]:[transform:translateX(-50%)] max-[600px]:[padding:16px_8px] ${Number(mentions) === index ? 'active' : ''}`} key={label} aria-pressed={Number(mentions) === index} onClick={() => setMentions(index === 1)}>{label}</button>)}</div>
    <p className="section-label m-0 [padding:15px_24px] [border-block:1px_solid_var(--color-line)] text-[11px] font-bold [overflow-wrap:anywhere]">HÔM NAY <span className="muted text-muted">· Thông báo minh họa</span></p>
    {notifications.filter(item => !mentions || item.type === 'comment').map(item => <a className={`notification flex items-start gap-[16px] p-[24px] [border-bottom:1px_solid_var(--color-line)] text-[14px] leading-[1.6] [&.unread]:bg-[#eddbb422] [&:hover]:bg-[#eddbb444] [&_>_div]:flex-1 [&_>_.live-dot]:mt-[10px] [&_>_.live-dot]:bg-accent [&_.avatar]:w-[34px] [&_.avatar]:h-[34px] [&_.avatar]:text-[17px] [&_blockquote]:[margin:10px_0] [&_blockquote]:pl-[13px] [&_blockquote]:[border-left:2px_solid_#d1b887] [&_blockquote]:text-muted [&_small]:text-muted [&_small]:text-[12px] max-[600px]:[padding:22px_18px] max-[600px]:gap-[12px] ${unread ? 'unread' : ''}`} key={item.type} href={`#post/${item.post}`} onClick={onRead}><span className={`notification-type [&.heart]:text-[light-dark(#bd3350,_#ff8da5)] [&.comment]:text-blue [&.repost]:text-green ${item.type}`}><Icon name={item.type} /></span><div><Avatar person={item.person} /><p className="[margin:1em_0]"><strong>{item.person.name}</strong> {item.text}</p><blockquote>{item.copy}</blockquote><small className="text-xs">{item.time}</small></div>{unread && <span className="live-dot inline-block shrink-0 w-[6px] h-[6px] rounded-full bg-green" />}</a>)}
    <p className="feed-end m-0 [padding:32px_20px] text-muted text-center text-[11px] leading-[1.9] [&_span]:text-muted [&_span]:text-[12px]">Bạn đã xem hết thông báo.</p>
  </>
}
