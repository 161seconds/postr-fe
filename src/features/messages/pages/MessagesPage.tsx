import { useState } from 'react'
import Icon from '@/shared/components/Icon'
import { Avatar } from '@/shared/components/Identity'
import { people } from '@/features/feed/data/feed-content'

export type Message = { copy: string; mine: boolean }
export type Threads = Record<string, Message[]>
export const initialThreads: Threads = {
  '@linhtran': [{ copy: 'Chào An! Rất vui được kết nối với bạn ở đây.', mine: false }, { copy: 'Mình cũng vậy! Một nơi nhỏ cho những câu chuyện hay.', mine: true }, { copy: 'Cuối tuần chia sẻ thêm vài quán cà phê yêu thích nhé?', mine: false }],
  '@techdaily': [{ copy: 'Cảm ơn bạn đã quan tâm những câu chuyện công nghệ của Tech Daily!', mine: false }],
  '@mevietnam': [{ copy: 'Chào bạn, điểm đến tiếp theo trong danh sách của bạn là đâu?', mine: false }],
}

export default function MessagesPage({ threads, onSend }: { threads: Threads; onSend: (handle: string, copy: string) => void }) {
  const [selected, setSelected] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [drafts, setDrafts] = useState<Record<string, string>>({})
  const person = people.find(item => item.handle === selected)
  const draft = selected ? drafts[selected] ?? '' : ''
  if (person && selected) return <section className="conversation">
    <header className="conversation-header"><button className="icon-button" aria-label="Trở lại hộp thư" onClick={() => setSelected(null)}><Icon name="arrow" /></button><Avatar person={person} /><div><strong>{person.name}</strong><small>{person.handle}</small></div></header>
    <div className="message-history" role="log" aria-label={`Hội thoại với ${person.name}`}><p className="conversation-date">HÔM NAY · HỘI THOẠI MẪU</p>{threads[selected].map((message, index) => <div className={`message ${message.mine ? 'mine' : ''}`} key={index}><p>{message.copy}</p><small>{message.mine ? 'Bạn · Trong phiên này' : person.name}</small></div>)}</div>
    <form className="message-form" onSubmit={event => { event.preventDefault(); if (draft.trim()) { onSend(selected, draft.trim()); setDrafts(current => ({ ...current, [selected]: '' })) } }}><textarea aria-label="Nội dung tin nhắn" placeholder="Viết một lời nhắn…" maxLength={1000} rows={2} value={draft} onChange={event => setDrafts(current => ({ ...current, [selected]: event.target.value }))} /><button className="post-button" aria-label="Gửi tin nhắn" disabled={!draft.trim()}><Icon name="send" /></button></form>
    <p className="demo-note">Tin nhắn thử nghiệm, chưa gửi đến người dùng thật.</p>
  </section>
  const contacts = Object.entries(threads).filter(([handle]) => `${handle} ${people.find(item => item.handle === handle)?.name}`.toLocaleLowerCase('vi').includes(search.toLocaleLowerCase('vi')))
  return <>
    <div className="inbox-intro"><p className="eyebrow">MỘT LỜI CHÀO, NHIỀU CÂU CHUYỆN.</p><h2>Hộp thư của bạn.</h2><label className="search"><Icon name="search" /><input type="search" aria-label="Tìm cuộc trò chuyện" placeholder="Tìm cuộc trò chuyện" value={search} onChange={event => setSearch(event.target.value)} /></label></div>
    {contacts.map(([handle, messages]) => {
      const contact = people.find(item => item.handle === handle)!
      return <button className="thread" key={handle} onClick={() => setSelected(handle)}><Avatar person={contact} /><div><strong>{contact.name}</strong><p>{messages.at(-1)?.copy}</p><small>{contact.handle}</small></div><span aria-hidden="true">↗</span></button>
    })}
    {!contacts.length && <p className="empty-state">Không tìm thấy cuộc trò chuyện.</p>}
    <p className="demo-note">Hội thoại minh họa · Chỉ lưu trong phiên đang mở.</p>
  </>
}
