import type { ReactNode } from 'react'
import Icon from '@/shared/components/Icon'
import { Avatar } from '@/shared/components/Identity'
import { people, trends } from '@/features/feed/data/feed-content'

export default function ExplorePage({ query, topic, onQuery, onTopic, following, onFollow, children }: {
  query: string; topic: string; onQuery: (value: string) => void; onTopic: (value: string) => void
  following: string[]; onFollow: (handle: string) => void; children: ReactNode
}) {
  return <>
    <section className="explore-header"><p className="eyebrow">CÓ GÌ MỚI NGOÀI KIA?</p><h2>Mở rộng góc nhìn.</h2><label className="search"><Icon name="search" /><input type="search" autoComplete="off" value={query} onChange={event => onQuery(event.target.value)} placeholder="Tìm câu chuyện, tên hoặc hashtag" aria-label="Tìm câu chuyện" /></label></section>
    <div className="topic-filters" aria-label="Chủ đề">{['Tất cả', 'Đời sống', 'Công nghệ', 'Thiết kế', 'Âm nhạc', 'Thể thao'].map(label => <button key={label} className={topic === label ? 'selected' : ''} aria-pressed={topic === label} onClick={() => onTopic(label)}>{label}</button>)}</div>
    {!query && topic === 'Tất cả' && <>
      <div className="explore-trends">{trends.slice(0, 2).map((trend, index) => <button key={trend.title} onClick={() => onQuery(trend.query)}><span>0{index + 1} / ĐƯỢC QUAN TÂM</span><strong>{trend.title}</strong><small>{trend.count} ↗</small></button>)}</div>
      <section className="people-section"><h3>Những người kể chuyện</h3><div className="people-grid">{people.slice(0, 3).map(person => <div className="person-card" key={person.handle}><Avatar person={person} /><strong>{person.name}</strong><small>{person.handle}</small><button className={`follow ${following.includes(person.handle) ? 'following' : ''}`} aria-pressed={following.includes(person.handle)} onClick={() => onFollow(person.handle)}>{following.includes(person.handle) ? 'Đang theo dõi' : 'Theo dõi'}</button></div>)}</div></section>
    </>}
    <h3 className="section-label">{query ? `Kết quả cho “${query}”` : 'Câu chuyện nổi bật'}</h3>{children}
  </>
}
