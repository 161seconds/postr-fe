import type { ReactNode } from 'react'
import Icon from '@/shared/components/Icon'

export default function FeedPage({ following, onTab, children }: { following: boolean; onTab: (following: boolean) => void; children: ReactNode }) {
  return <>
    <div className="tabs grid grid-cols-[1fr_1fr] [border-bottom:1px_solid_var(--color-line)]" aria-label="Bộ lọc bảng tin">{['Dành cho bạn', 'Đang theo dõi'].map((label, index) => <button className={`[font-family:inherit] tab relative [padding:18px_8px] min-h-[52px] [border:0] bg-transparent text-muted font-bold text-[13px] [&:hover]:bg-[#e8dfd140] [&.active]:text-ink [&.active::after]:absolute [&.active::after]:bottom-[-1px] [&.active::after]:left-[50%] [&.active::after]:w-[64px] [&.active::after]:h-[3px] [&.active::after]:rounded-[3px] [&.active::after]:bg-accent [&.active::after]:content-[''] [&.active::after]:[transform:translateX(-50%)] max-[600px]:[padding:16px_8px] ${Number(following) === index ? 'active' : ''}`} aria-pressed={Number(following) === index} onClick={() => onTab(index === 1)} key={label}>{label}{index === 0 && <span className="tab-spark text-[light-dark(#cd552f,_#ff936e)]" aria-hidden="true"> ✳</span>}</button>)}</div>
    {!following && <div className="feed-intro relative [padding:20px_24px_0] [&_>_span]:flex [&_>_span]:items-center [&_>_span]:gap-[7px] [&_>_span]:text-[8px] [&_>_span]:tracking-[1.1px] [&_>_span]:text-muted [&_p]:[margin:7px_0_0] [&_p]:font-serif [&_p]:text-[18px] [&_>_svg]:absolute [&_>_svg]:right-[24px] [&_>_svg]:top-[29px] [&_>_svg]:text-[#aba08f] max-[600px]:hidden"><span><span className="live-dot inline-block shrink-0 w-[6px] h-[6px] rounded-full bg-green" /> BẢNG TIN CỦA BẠN</span><p className="[margin:1em_0]">Những câu chuyện đáng dừng lại.</p><Icon name="globe" /></div>}
    {children}
  </>
}
