import { useEffect, useRef, useState } from 'react'
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
  const history = useRef<HTMLDivElement>(null)
  const messages = selected ? threads[selected] : undefined
  useEffect(() => {
    const log = history.current
    if (!log) return
    const showLatest = () => { log.scrollTop = log.scrollHeight }
    showLatest()
    const observer = new ResizeObserver(showLatest)
    observer.observe(log)
    return () => observer.disconnect()
  }, [selected, messages?.length])
  const person = people.find(item => item.handle === selected)
  const draft = selected ? drafts[selected] ?? '' : ''
  if (person && selected) return <section className="conversation flex flex-col flex-1 min-h-0 [&_>_.demo-note]:shrink-0">
    <header className="conversation-header shrink-0 flex items-center gap-[12px] p-[16px] [border-bottom:1px_solid_var(--color-line)] [&_small]:block [&_small]:mt-[4px] [&_small]:text-muted [&_small]:text-[11px]"><button className="[font-family:inherit] icon-button inline-grid place-items-center [border:0] bg-transparent rounded-full shrink-0 w-[44px] h-[44px] text-blue [&:hover]:bg-[light-dark(#2466c20d,_#86b6f612)]" aria-label="Trở lại hộp thư" onClick={() => setSelected(null)}><Icon name="arrow" /></button><Avatar person={person} /><div><strong>{person.name}</strong><small className="text-xs">{person.handle}</small></div></header>
    <div ref={history} className="message-history flex flex-col flex-1 items-start gap-[22px] min-h-0 overflow-y-auto overscroll-contain p-[24px] max-[600px]:[padding:20px_18px]" role="log" aria-label={`Hội thoại với ${person.name}`}><p className="[margin:1em_0] conversation-date self-center text-muted text-[9px] tracking-[1px]">HÔM NAY · HỘI THOẠI MẪU</p>{threads[selected].map((message, index) => <div className={`message shrink-0 max-w-[82%] [&_p]:m-0 [&_p]:[padding:14px_16px] [&_p]:[border:1px_solid_var(--color-line)] [&_p]:rounded-[17px_17px_17px_3px] [&_p]:bg-paper [&_p]:text-[14px] [&_p]:leading-[1.6] [&_p]:whitespace-pre-wrap [&_p]:[overflow-wrap:anywhere] [&_small]:block [&_small]:[margin:7px_3px_0] [&_small]:text-[11px] [&_small]:text-muted [&.mine]:self-end [&.mine_p]:bg-[light-dark(#ffdbbb,_#493021)] [&.mine_p]:border-[light-dark(#e2b99a,_#805237)] [&.mine_p]:rounded-[17px_17px_3px_17px] [&.mine_small]:text-right ${message.mine ? 'mine' : ''}`} key={index}><p className="[margin:1em_0]">{message.copy}</p><small className="text-xs">{message.mine ? 'Bạn · Trong phiên này' : person.name}</small></div>)}</div>
    <form className="message-form shrink-0 flex items-center gap-[12px] [margin:16px_24px_0] p-[12px] [border:1px_solid_var(--color-line)] rounded-[17px] bg-card [&_textarea]:text-[14px] [&_textarea]:min-h-[50px] [&_textarea]:resize-none [&_.post-button]:w-[44px] [&_.post-button]:p-[8px] [&_.post-button]:shrink-0 max-[600px]:[&_textarea]:text-[16px] max-[600px]:mx-[18px]" onSubmit={event => { event.preventDefault(); if (draft.trim()) { onSend(selected, draft.trim()); setDrafts(current => ({ ...current, [selected]: '' })) } }}><textarea className="w-full min-h-[66px] resize-y border-0 bg-transparent text-[16px] leading-[1.6] placeholder:text-[light-dark(#8b8780,#a99f92)] [font-family:inherit]" aria-label="Nội dung tin nhắn" placeholder="Viết một lời nhắn…" maxLength={1000} rows={2} value={draft} onChange={event => setDrafts(current => ({ ...current, [selected]: event.target.value }))} /><button className="[font-family:inherit] post-button inline-flex items-center justify-center ml-auto min-h-[44px] [padding:8px_21px] [border:1.5px_solid_var(--color-edge)] rounded-[100px] bg-accent text-[#24221f] text-[14px] font-bold [&:hover:not(:disabled)]:bg-[#ff906a]" aria-label="Gửi tin nhắn" disabled={!draft.trim()}><Icon name="send" /></button></form>
    <p className="[margin:1em_0] demo-note m-[18px] text-center text-muted text-[10px] leading-[1.7]">Tin nhắn thử nghiệm, chưa gửi đến người dùng thật.</p>
  </section>
  const contacts = Object.entries(threads).filter(([handle]) => `${handle} ${people.find(item => item.handle === handle)?.name}`.toLocaleLowerCase('vi').includes(search.toLocaleLowerCase('vi')))
  return <>
    <div className="inbox-intro [padding:28px_24px] [&_h2]:[margin:10px_0_24px] [&_h2]:font-serif [&_h2]:text-[33px] [&_h2]:tracking-[-1px] max-[600px]:[padding:24px_18px]"><p className="[margin:1em_0] eyebrow text-[10px] font-bold tracking-[1.6px]">MỘT LỜI CHÀO, NHIỀU CÂU CHUYỆN.</p><h2 className="[margin:.83em_0] font-bold">Hộp thư của bạn.</h2><label className="search flex items-center gap-[10px] min-h-[44px] [padding:10px_14px] [border:1.5px_solid_var(--color-edge)] rounded-[100px] bg-card shadow-[3px_3px_0_#efcc62] [&:focus-within]:[outline:2px_solid_var(--color-muted)] [&:focus-within]:[outline-offset:3px] [&_input]:w-full [&_input]:[border:0] [&_input]:[outline:none] [&_input]:bg-transparent [&_input]:text-[12px] [&_svg]:w-[17px] [&_svg]:h-[17px] [&_kbd]:[padding:1px_5px] [&_kbd]:[border:1px_solid_var(--color-line)] [&_kbd]:rounded-[4px] [&_kbd]:text-muted max-[600px]:[&_input]:text-[16px]"><Icon name="search" /><input className="[font-family:inherit]" type="search" aria-label="Tìm cuộc trò chuyện" placeholder="Tìm cuộc trò chuyện" value={search} onChange={event => setSearch(event.target.value)} /></label></div>
    {contacts.map(([handle, messages]) => {
      const contact = people.find(item => item.handle === handle)!
      return <button className="[font-family:inherit] thread w-full flex items-center gap-[14px] [padding:23px_24px] [border:0] [border-top:1px_solid_var(--color-line)] bg-transparent text-left [&:hover]:bg-[#eddbb433] [&_>_div]:min-w-0 [&_>_div]:flex-1 [&_strong]:text-[14px] [&_p]:overflow-hidden [&_p]:text-ellipsis [&_p]:whitespace-nowrap [&_p]:text-[14px] [&_p]:text-muted [&_small]:text-[12px] [&_small]:text-muted" key={handle} onClick={() => setSelected(handle)}><Avatar person={contact} /><div><strong>{contact.name}</strong><p className="[margin:1em_0]">{messages.at(-1)?.copy}</p><small className="text-xs">{contact.handle}</small></div><span aria-hidden="true">↗</span></button>
    })}
    {!contacts.length && <p className="empty-state [padding:70px_28px] text-center [&_>_svg]:w-[36px] [&_>_svg]:h-[36px] [&_>_svg]:text-[#b6a17c] [&_h2]:font-serif [&_h2]:text-[25px] [&_p]:max-w-[310px] [&_p]:[margin:0_auto_22px] [&_p]:text-muted [&_p]:text-[13px] [&_p]:leading-[1.7]">Không tìm thấy cuộc trò chuyện.</p>}
    <p className="[margin:1em_0] demo-note m-[18px] text-center text-muted text-[10px] leading-[1.7]">Hội thoại minh họa · Chỉ lưu trong phiên đang mở.</p>
  </>
}
