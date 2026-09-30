import type { ReactNode } from 'react'
import Icon from '@/shared/components/Icon'

export default function FeedPage({ following, onTab, children }: { following: boolean; onTab: (following: boolean) => void; children: ReactNode }) {
  return <>
    <div className="tabs" aria-label="Bộ lọc bảng tin">{['Dành cho bạn', 'Đang theo dõi'].map((label, index) => <button className={`tab ${Number(following) === index ? 'active' : ''}`} aria-pressed={Number(following) === index} onClick={() => onTab(index === 1)} key={label}>{label}{index === 0 && <span className="tab-spark" aria-hidden="true"> ✳</span>}</button>)}</div>
    {!following && <div className="feed-intro"><span><span className="live-dot" /> BẢNG TIN CỦA BẠN</span><p>Những câu chuyện đáng dừng lại.</p><Icon name="globe" /></div>}
    {children}
  </>
}
