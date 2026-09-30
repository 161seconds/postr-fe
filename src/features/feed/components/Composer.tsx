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

  return <form className="composer" aria-label="Tạo bài đăng" onSubmit={event => {
    event.preventDefault()
    if ((!draft.trim() && !image) || loading || draft.length > 280) return
    onPublish(draft.trim(), image)
    setDraft(''); setImage(undefined); setError(''); setEmojis(false)
  }}>
    <Avatar person={person} />
    <div>
      <label className="sr-only" htmlFor={id}>Nội dung bài đăng</label>
      <textarea id={id} maxLength={280} value={draft} onChange={event => setDraft(event.target.value)} placeholder="Có chuyện gì mới?" />
      {image && <div className="attachment"><img src={image} alt="Ảnh đính kèm bài đăng" /><button className="icon-button" type="button" aria-label="Xóa ảnh" onClick={() => setImage(undefined)}><Icon name="close" /></button></div>}
      <div className="audience"><Icon name="globe" /> Mọi người đều có thể trả lời</div>
      <input ref={input} type="file" className="sr-only" tabIndex={-1} accept="image/jpeg,image/png,image/webp,image/gif" aria-label="Chọn ảnh đính kèm" onChange={event => {
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
      {error && <p className="field-error" role="alert">{error}</p>}
      {emojis && <div className="emoji-picker" aria-label="Biểu cảm">{['😊', '❤️', '✨', '☕', '🌿', '👏'].map(emoji => <button type="button" aria-label={`Thêm ${emoji}`} disabled={draft.length + emoji.length > 280} key={emoji} onClick={() => { setDraft(value => value + emoji); setEmojis(false) }}>{emoji}</button>)}</div>}
      <div className="composer-tools">
        <button className="icon-button" type="button" aria-label="Thêm ảnh" onClick={() => input.current?.click()}><Icon name="image" /></button>
        <button className="icon-button" type="button" aria-label="Thêm biểu cảm" aria-expanded={emojis} onClick={() => setEmojis(!emojis)}><Icon name="smile" /></button>
        <small className={draft.length === 280 ? 'limit' : ''}>{loading ? 'Đang đọc ảnh…' : `${draft.length}/280`}</small>
        <button className="post-button" disabled={(!draft.trim() && !image) || loading}>Đăng</button>
      </div>
    </div>
  </form>
}
