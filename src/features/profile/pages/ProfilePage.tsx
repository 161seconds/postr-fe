import { useRef, type ReactNode } from 'react'
import Icon from '@/shared/components/Icon'
import { Avatar } from '@/shared/components/Identity'
import type { Profile } from '@/shared/types/post'

export default function ProfilePage({ profile, following, posts, liked, tab, onTab, onSave, children }: {
  profile: Profile; following: number; posts: number; liked: number; tab: string
  onTab: (tab: string) => void; onSave: (profile: Profile) => void; children: ReactNode
}) {
  const dialog = useRef<HTMLDialogElement>(null)
  return <>
    <div className="profile-cover"><span>Ở đây, mình là mình.</span><span aria-hidden="true">✳</span></div>
    <section className="profile-details"><div className="profile-top"><Avatar person={profile} large /><button className="follow" onClick={() => dialog.current?.showModal()}>Chỉnh sửa hồ sơ</button></div><h2>{profile.name}</h2><p className="muted">{profile.handle}</p><p className="profile-bio">{profile.bio}</p><p className="profile-location"><Icon name="pin" />{profile.location || 'Chưa cập nhật vị trí'}<span>Tham gia tháng 10, 2026</span></p><div className="profile-stats"><span><strong>{posts}</strong> bài đăng</span><span><strong>{following}</strong> đang theo dõi</span><span><strong>{liked}</strong> lượt thích đã gửi</span></div></section>
    <div className="tabs">{['Bài đăng', 'Đã thích'].map(label => <button key={label} className={`tab ${tab === label ? 'active' : ''}`} aria-pressed={tab === label} onClick={() => onTab(label)}>{label}</button>)}</div>
    {children}
    <dialog ref={dialog} className="modal" aria-labelledby="edit-profile-title" onClose={event => { event.currentTarget.querySelector('form')?.reset(); event.currentTarget.querySelector('input')?.setCustomValidity('') }}><div className="modal-heading"><h2 id="edit-profile-title">Chỉnh sửa hồ sơ</h2><button className="icon-button" aria-label="Đóng chỉnh sửa hồ sơ" onClick={() => dialog.current?.close()}><Icon name="close" /></button></div><form className="profile-form" key={profile.name + profile.bio + profile.location} onSubmit={event => {
      event.preventDefault()
      const data = new FormData(event.currentTarget)
      const name = String(data.get('name') ?? '').trim()
      if (!name) { const input = event.currentTarget.elements.namedItem('name') as HTMLInputElement; input.setCustomValidity('Vui lòng nhập tên.'); input.reportValidity(); return }
      onSave({ ...profile, name, initial: Array.from(name)[0].toUpperCase(), bio: String(data.get('bio') ?? '').trim(), location: String(data.get('location') ?? '').trim() })
      dialog.current?.close()
    }}><label>Tên hiển thị<input name="name" defaultValue={profile.name} required maxLength={50} onInput={event => event.currentTarget.setCustomValidity('')} /></label><label>Giới thiệu<textarea name="bio" defaultValue={profile.bio} maxLength={160} /></label><label>Vị trí<input name="location" defaultValue={profile.location} maxLength={80} /></label><button className="post-button">Lưu thay đổi</button></form></dialog>
  </>
}
