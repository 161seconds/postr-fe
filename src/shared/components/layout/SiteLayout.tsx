import { useState, type ReactNode } from 'react'
import Icon, { type IconName } from '../Icon'
import { Avatar, Logo, Verified } from '../Identity'
import { people, trends } from '@/features/feed/data/feed-content'
import type { Profile } from '@/shared/types/post'

const navigation: { id: string; label: string; icon: IconName }[] = [
  { id: 'home', label: 'Trang chủ', icon: 'home' },
  { id: 'search', label: 'Khám phá', icon: 'search' },
  { id: 'bell', label: 'Thông báo', icon: 'bell' },
  { id: 'mail', label: 'Tin nhắn', icon: 'mail' },
  { id: 'bookmark', label: 'Đã lưu', icon: 'bookmark' },
  { id: 'user', label: 'Hồ sơ', icon: 'user' },
]

export default function SiteLayout({ route, profile, following, unread, onFollow, onCompose, children }: {
  route: string; profile: Profile; following: string[]; unread: boolean
  onFollow: (handle: string) => void; onCompose: () => void; children: ReactNode
}) {
  const [search, setSearch] = useState('')
  const active = navigation.find(item => item.id === route) ?? navigation[0]
  return <>
    <a href="#main-content" className="skip-link" onClick={event => { event.preventDefault(); document.getElementById('main-content')?.focus() }}>Đến nội dung chính</a>
    <div className="shell">
      <aside className="rail" aria-label="Điều hướng chính">
        <Logo /><p className="rail-caption">MỖI GÓC NHÌN, MỘT CÂU CHUYỆN.</p>
        <nav className="nav">{navigation.map(item => <a className={`nav-link ${active.id === item.id ? 'active' : ''}`} href={`#${item.id}`} key={item.id} aria-label={item.label} aria-current={active.id === item.id ? 'page' : undefined}><span className="nav-icon"><Icon name={item.icon} />{item.id === 'bell' && unread && <i className="notification-dot" />}</span><span>{item.label}</span></a>)}</nav>
        <button className="primary" aria-label="Đăng bài" onClick={onCompose}><Icon name="pen" /><span>Đăng bài</span></button>
        <div className="rail-note"><span className="live-dot" /> Một chút kết nối mỗi ngày.</div>
        <a className="profile-mini" href="#user" aria-label="Hồ sơ của bạn"><Avatar person={profile} /><div><strong>{profile.name}</strong><br /><small>{profile.handle}</small></div><Icon name="arrow" /></a>
      </aside>
      <main id="main-content" tabIndex={-1}>
        <header className="topbar"><div className="mobile-brand"><Logo /><a href="#user" aria-label="Hồ sơ của bạn"><Avatar person={profile} /></a></div><div className="page-heading"><div><small>KHÔNG GIAN CỦA BẠN</small><h1>{route === 'post' ? 'Bài đăng' : active.label}</h1></div><span className="edition">POSTR / 01</span></div></header>
        {children}
      </main>
      <aside className="rightbar" aria-label="Khám phá cộng đồng">
        <form className="search" role="search" onSubmit={event => { event.preventDefault(); window.location.hash = `search/${encodeURIComponent(search.trim())}` }}><Icon name="search" /><input type="search" value={search} onChange={event => setSearch(event.target.value)} placeholder="Tìm trên Postr" aria-label="Tìm trên Postr" /><kbd aria-hidden="true">↵</kbd></form>
        <section className="daily-note"><small>CHUYỆN NHỎ HÔM NAY</small><h2>Thế giới rộng.<br />Kết nối gần.</h2><p>Một ý tưởng hay có thể bắt đầu từ câu chuyện của bạn.</p><button className="text-button" onClick={onCompose}>Kể chuyện của bạn <span aria-hidden="true">↗</span></button><span className="note-star" aria-hidden="true">✳</span></section>
        <section className="side-card"><h2 className="side-title">Đang diễn ra <span className="live-dot" /></h2>{trends.map((trend, index) => <a className="trend" href={`#search/${encodeURIComponent(trend.query)}`} key={trend.title}><span className="trend-rank">0{index + 1}</span><div><small>{trend.type}</small><strong>{trend.title}</strong><small>{trend.count}</small></div><span aria-hidden="true">↗</span></a>)}</section>
        <section className="side-card"><h2 className="side-title">Có thể bạn biết</h2>{people.slice(0, 3).map(person => <div className="suggestion" key={person.handle}><Avatar person={person} /><div><strong title={person.name}>{person.name} {person.verified && <Verified />}</strong><small>{person.handle}</small></div><button className={`follow ${following.includes(person.handle) ? 'following' : ''}`} aria-label={`${following.includes(person.handle) ? 'Bỏ theo dõi' : 'Theo dõi'} ${person.name}`} aria-pressed={following.includes(person.handle)} onClick={() => onFollow(person.handle)}>{following.includes(person.handle) ? <Icon name="check" /> : 'Theo dõi'}</button></div>)}<a className="side-more" href="#search">Khám phá thêm <span aria-hidden="true">↗</span></a></section>
        <p className="side-footer">Bản trải nghiệm · Dữ liệu mẫu<br />Thao tác được giữ trong phiên đang mở.<br />© 2026 Postr. Tin tức theo cách của bạn.</p>
      </aside>
    </div>
    <nav className="mobile-nav" aria-label="Điều hướng di động">{navigation.map(item => <a key={item.id} className={active.id === item.id ? 'active' : ''} href={`#${item.id}`} aria-label={item.label} aria-current={active.id === item.id ? 'page' : undefined}><Icon name={item.icon} /><span>{item.label}</span></a>)}</nav>
    <button className="mobile-compose" aria-label="Đăng bài" onClick={onCompose}><Icon name="pen" /></button>
  </>
}
