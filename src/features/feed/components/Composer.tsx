/* eslint-disable @next/next/no-img-element -- User attachments are local data URLs, not optimizable server assets. */
import { useId, useRef, useState } from 'react'
import Icon from '@/shared/components/Icon'
import { Avatar } from '@/shared/components/Identity'
import type { Person } from '@/shared/types/post'

export default function Composer({ person, onPublish }: { person: Person; onPublish: (copy: string, image?: string) => void }) {
  const [draft, setDraft] = useState('')
  const [image, setImage] = useState<string>()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [emojis, setEmojis] = useState(false)
  const input = useRef<HTMLInputElement>(null)
  const reader = useRef<FileReader | null>(null)
  const id = useId()

  return <form className="composer grid grid-cols-[42px_minmax(0,_1fr)] gap-[13px] p-[24px] [border-bottom:7px_solid_var(--color-paper)] [&_textarea]:resize-none [&_textarea]:[padding:8px_0] max-[600px]:[padding:20px_16px] max-[600px]:grid-cols-[34px_minmax(0,_1fr)] max-[600px]:gap-[10px] max-[600px]:py-[16px] max-[600px]:[&_textarea]:min-h-[52px] max-[600px]:[&_.icon-button]:w-[40px] max-[600px]:[&_.post-button]:px-[16px] max-[600px]:[&_>_.avatar]:w-[34px] max-[600px]:[&_>_.avatar]:h-[34px] max-[600px]:[&_>_.avatar]:text-[17px]" aria-label="Tạo bài đăng" onSubmit={event => {
    event.preventDefault()
    if ((!draft.trim() && !image) || loading || draft.length > 280) return
    onPublish(draft.trim(), image)
    setDraft(''); setImage(undefined); setError(''); setEmojis(false)
  }}>
    <Avatar person={person} />
    <div>
      <label className="sr-only" htmlFor={id}>Nội dung bài đăng</label>
      <textarea className="w-full min-h-[66px] resize-y border-0 bg-transparent text-[16px] leading-[1.6] placeholder:text-[light-dark(#8b8780,#a99f92)] [font-family:inherit]" id={id} maxLength={280} value={draft} onChange={event => setDraft(event.target.value)} placeholder="Có chuyện gì mới?" />
      {image && <div className="attachment relative [margin:8px_0] [&_img]:w-full [&_img]:max-h-[220px] [&_img]:object-contain [&_img]:bg-paper [&_img]:rounded-[12px] [&_button]:absolute [&_button]:top-[5px] [&_button]:right-[5px] [&_button]:bg-card [&_button]:text-ink"><img src={image} alt="Ảnh đính kèm bài đăng" /><button className="[font-family:inherit] icon-button inline-grid place-items-center [border:0] bg-transparent rounded-full shrink-0 w-[44px] h-[44px] text-blue [&:hover]:bg-[light-dark(#2466c20d,_#86b6f612)]" type="button" aria-label="Xóa ảnh" onClick={() => setImage(undefined)}><Icon name="close" /></button></div>}
      <div className="audience flex items-center gap-[5px] [margin:4px_0_12px] text-blue text-[12px] [&_svg]:w-[13px] [&_svg]:h-[13px]"><Icon name="globe" /> Mọi người đều có thể trả lời</div>
      <input ref={input} type="file" className="[font-family:inherit] sr-only" tabIndex={-1} accept="image/jpeg,image/png,image/webp,image/gif" aria-label="Chọn ảnh đính kèm" onChange={event => {
        const file = event.target.files?.[0]
        event.target.value = ''
        if (!file) return
        if (!['image/jpeg', 'image/png', 'image/webp', 'image/gif'].includes(file.type) || file.size > 5 * 1024 * 1024) { setError('Chọn ảnh JPG, PNG, WebP hoặc GIF tối đa 5 MB.'); return }
        reader.current?.abort()
        const current = new FileReader()
        reader.current = current
        setLoading(true); setError('')
        current.onload = () => { setImage(String(current.result)); setLoading(false) }
        current.onerror = () => { setError('Không đọc được ảnh. Vui lòng chọn lại.'); setLoading(false) }
        current.readAsDataURL(file)
      }} />
      {error && <p className="[margin:1em_0] field-error text-[light-dark(#b33d2b,_#ff9785)] text-[12px]" role="alert">{error}</p>}
      {emojis && <div className="emoji-picker flex flex-wrap [padding:8px_0] [&_button]:w-[36px] [&_button]:h-[36px] [&_button]:[border:0] [&_button]:rounded-[8px] [&_button]:bg-transparent [&_button]:text-[21px] [&_button:hover]:bg-paper" aria-label="Biểu cảm">{['😊', '❤️', '✨', '☕', '🌿', '👏'].map(emoji => <button className="[font-family:inherit]" type="button" aria-label={`Thêm ${emoji}`} disabled={draft.length + emoji.length > 280} key={emoji} onClick={() => { setDraft(value => value + emoji); setEmojis(false) }}>{emoji}</button>)}</div>}
      <div className="composer-tools flex items-center gap-[3px] pt-[10px] [border-top:1px_solid_var(--color-line)] [&_small]:ml-[6px] [&_small]:text-muted [&_small]:text-[12px] [&_.limit]:text-[light-dark(#b33d2b,_#ff9785)] [&_.limit]:text-[12px]">
        <button className="[font-family:inherit] icon-button inline-grid place-items-center [border:0] bg-transparent rounded-full shrink-0 w-[44px] h-[44px] text-blue [&:hover]:bg-[light-dark(#2466c20d,_#86b6f612)]" type="button" aria-label="Thêm ảnh" onClick={() => input.current?.click()}><Icon name="image" /></button>
        <button className="[font-family:inherit] icon-button inline-grid place-items-center [border:0] bg-transparent rounded-full shrink-0 w-[44px] h-[44px] text-blue [&:hover]:bg-[light-dark(#2466c20d,_#86b6f612)]" type="button" aria-label="Thêm biểu cảm" aria-expanded={emojis} onClick={() => setEmojis(!emojis)}><Icon name="smile" /></button>
        <small className={draft.length === 280 ? 'limit' : ''}>{loading ? 'Đang đọc ảnh…' : `${draft.length}/280`}</small>
        <button className="[font-family:inherit] post-button inline-flex items-center justify-center ml-auto min-h-[44px] [padding:8px_21px] [border:1.5px_solid_var(--color-edge)] rounded-[100px] bg-accent text-[#24221f] text-[14px] font-bold [&:hover:not(:disabled)]:bg-[#ff906a]" disabled={(!draft.trim() && !image) || loading}>Đăng</button>
      </div>
    </div>
  </form>
}
