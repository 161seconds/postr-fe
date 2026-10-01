/* eslint-disable @next/next/no-img-element -- User attachments are local data URLs, not optimizable server assets. */
import { useState } from 'react'
import Icon from '@/shared/components/Icon'
import { Avatar, Verified } from '@/shared/components/Identity'
import type { Post, PostAction } from '@/shared/types/post'

export type PostCardProps = {
  post: Post
  liked: boolean
  saved: boolean
  reposted: boolean
  onAction: (id: number, action: PostAction) => void
  onReply: (id: number, copy: string) => void
  onNotice: (message: string) => void
}

export default function PostCard({ post, liked, saved, reposted, onAction, onReply, onNotice }: PostCardProps) {
  const [replying, setReplying] = useState(false)
  const [reply, setReply] = useState('')

  async function share() {
    const url = `${window.location.href.split('#')[0]}#post/${post.id}`
    try {
      if (navigator.share) await navigator.share({ title: `Bài đăng của ${post.author.name}`, text: post.copy, url })
      else { await navigator.clipboard.writeText(url); onNotice('Đã sao chép liên kết bài đăng.') }
    } catch (error) {
      if (!(error instanceof DOMException && error.name === 'AbortError')) onNotice('Không thể sao chép. Mở bài đăng rồi sao chép địa chỉ trên trình duyệt.')
    }
  }

  return <article className="post grid grid-cols-[42px_minmax(0,_1fr)] gap-[12px] p-[23px] [border-bottom:1px_solid_var(--color-line)] animate-reveal [&:nth-child(2)]:[animation-delay:50ms] [&:nth-child(3)]:[animation-delay:100ms] max-[600px]:[padding:20px_16px] max-[600px]:grid-cols-[34px_minmax(0,_1fr)] max-[600px]:gap-[10px] max-[600px]:[&_>_.avatar]:w-[34px] max-[600px]:[&_>_.avatar]:h-[34px] max-[600px]:[&_>_.avatar]:text-[17px]" id={`post-${post.id}`}>
    <Avatar person={post.author} />
    <div>
      <div className="post-head flex items-center flex-wrap gap-[5px] min-w-0 text-muted text-[12px] max-[600px]:text-[12px]"><span className="post-name text-ink font-bold text-[14px] [overflow-wrap:anywhere] max-[600px]:text-[14px]">{post.author.name}</span>{post.author.verified && <Verified />}<span className="handle overflow-hidden text-ellipsis whitespace-nowrap max-w-[140px] max-[600px]:max-w-[97px]">{post.author.handle}</span><a className="post-time inline-flex items-center min-h-[24px] ml-auto text-[12px] whitespace-nowrap [&:hover]:underline max-[600px]:text-[11px]" href={`#post/${post.id}`} aria-label={`Mở bài đăng của ${post.author.name}`}>· {post.time}</a></div>
      <p className="post-copy [margin:9px_0_13px] text-[15px] leading-[1.7] whitespace-pre-wrap [overflow-wrap:anywhere] max-[600px]:text-[15px]">{post.copy.split(/(#[\p{L}\p{N}_]+)/u).map((part, index) => part.startsWith('#') ? <a key={index} className="hashtag [&:hover]:underline text-blue" href={`#search/${encodeURIComponent(part)}`}>{part}</a> : part)}</p>
      {post.media === 'city' && <div className="media relative min-h-[264px] overflow-hidden [border:1.5px_solid_var(--color-edge)] rounded-[15px] bg-cover bg-center bg-[#c7b895] max-[600px]:min-h-[220px]   media-city [background-image:linear-gradient(180deg,_transparent_35%,_#000b),_url('/images/vietnam.jpg')]" role="img" aria-label="Khung cảnh Việt Nam"><div className="media-caption absolute [inset:auto_17px_17px] text-white [&_small]:inline-block [&_small]:mb-[9px] [&_small]:[padding:4px_7px] [&_small]:bg-[#efcc62] [&_small]:text-[#24221f] [&_small]:text-[8px] [&_small]:font-bold [&_small]:tracking-[1px] [&_small]:uppercase [&_h3]:max-w-[320px] [&_h3]:m-0 [&_h3]:font-serif [&_h3]:text-[23px] [&_h3]:leading-[1.1] [&_h3]:tracking-[-.5px] max-[600px]:[&_h3]:text-[22px]"><small className="text-xs">Điểm đến hôm nay</small><h3 className="[margin:1em_0] font-bold">Những nơi chốn khiến mình muốn đi chậm lại.</h3></div></div>}
      {post.media === 'tech' && <div className="media relative min-h-[264px] overflow-hidden [border:1.5px_solid_var(--color-edge)] rounded-[15px] bg-cover bg-center bg-[#c7b895] max-[600px]:min-h-[220px]   media-tech [&.media-tech]:min-h-[225px] [&.media-tech]:[background-image:linear-gradient(110deg,_#176bff15,_#ff5c3515),_url('/images/workspace.jpg')] max-[600px]:[&.media-tech]:min-h-[185px]" role="img" aria-label="Không gian làm việc sáng tạo" />}
      {post.image && <img className="post-image block max-h-[450px] w-full object-contain [border:1px_solid_var(--color-line)] rounded-[15px] bg-paper" src={post.image} alt="Ảnh do tác giả đính kèm" />}
      {post.quote && <div className="quote-card relative overflow-hidden p-[22px] [border:1.5px_solid_var(--color-edge)] rounded-[15px] bg-[light-dark(#f2d780,_#443922)] [&_small]:text-[9px] [&_small]:tracking-[1.5px] [&_p]:relative [&_p]:z-[1] [&_p]:[margin:20px_0] [&_p]:font-serif [&_p]:text-[22px] [&_p]:leading-[1.4] [&_>_span]:absolute [&_>_span]:bottom-[-45px] [&_>_span]:right-[-20px] [&_>_span]:text-[170px] [&_>_span]:text-[#c9a44c50] max-[600px]:p-[18px] max-[600px]:[&_p]:text-[21px]"><small className="text-xs">POSTR NOTE {String(post.id).padStart(3, '0')}</small><p className="[margin:1em_0]">{post.quote}</p><span aria-hidden="true">✳</span></div>}
      <div className="actions flex items-center justify-between gap-[3px] mt-[10px] text-muted">
        <button className={`[font-family:inherit] action inline-grid place-items-center [border:0] bg-transparent rounded-[20px] grid-flow-col gap-[6px] min-w-[34px] min-h-[44px] p-[6px] text-[12px] [&_svg]:w-[19px] [&_svg]:h-[19px] [&:hover]:text-blue [&:hover]:bg-[light-dark(#2466c20a,_#86b6f610)] [&.liked]:text-[light-dark(#bd3350,_#ff8da5)] [&.liked_svg]:[fill:light-dark(#bd335020,_#ff8da520)] [&.saved]:text-blue [&.reposted]:text-green max-[600px]:gap-[4px] max-[600px]:[padding:5px_3px] max-[600px]:text-[11px] max-[600px]:[&_svg]:w-[18px] max-[600px]:[&_svg]:h-[18px] ${replying ? 'saved' : ''}`} aria-label="Bình luận" aria-expanded={replying} onClick={() => setReplying(!replying)}><Icon name="comment" /><span>{post.comments + post.replies.length}</span></button>
        <button className={`[font-family:inherit] action inline-grid place-items-center [border:0] bg-transparent rounded-[20px] grid-flow-col gap-[6px] min-w-[34px] min-h-[44px] p-[6px] text-[12px] [&_svg]:w-[19px] [&_svg]:h-[19px] [&:hover]:text-blue [&:hover]:bg-[light-dark(#2466c20a,_#86b6f610)] [&.liked]:text-[light-dark(#bd3350,_#ff8da5)] [&.liked_svg]:[fill:light-dark(#bd335020,_#ff8da520)] [&.saved]:text-blue [&.reposted]:text-green max-[600px]:gap-[4px] max-[600px]:[padding:5px_3px] max-[600px]:text-[11px] max-[600px]:[&_svg]:w-[18px] max-[600px]:[&_svg]:h-[18px] ${reposted ? 'reposted' : ''}`} aria-label="Đăng lại" aria-pressed={reposted} onClick={() => onAction(post.id, 'repost')}><Icon name="repost" /><span>{post.reposts + Number(reposted)}</span></button>
        <button className={`[font-family:inherit] action inline-grid place-items-center [border:0] bg-transparent rounded-[20px] grid-flow-col gap-[6px] min-w-[34px] min-h-[44px] p-[6px] text-[12px] [&_svg]:w-[19px] [&_svg]:h-[19px] [&:hover]:text-blue [&:hover]:bg-[light-dark(#2466c20a,_#86b6f610)] [&.liked]:text-[light-dark(#bd3350,_#ff8da5)] [&.liked_svg]:[fill:light-dark(#bd335020,_#ff8da520)] [&.saved]:text-blue [&.reposted]:text-green max-[600px]:gap-[4px] max-[600px]:[padding:5px_3px] max-[600px]:text-[11px] max-[600px]:[&_svg]:w-[18px] max-[600px]:[&_svg]:h-[18px] ${liked ? 'liked' : ''}`} aria-label="Thích" aria-pressed={liked} onClick={() => onAction(post.id, 'like')}><Icon name="heart" /><span>{(post.likes + Number(liked)).toLocaleString('vi-VN')}</span></button>
        <button className={`[font-family:inherit] action inline-grid place-items-center [border:0] bg-transparent rounded-[20px] grid-flow-col gap-[6px] min-w-[34px] min-h-[44px] p-[6px] text-[12px] [&_svg]:w-[19px] [&_svg]:h-[19px] [&:hover]:text-blue [&:hover]:bg-[light-dark(#2466c20a,_#86b6f610)] [&.liked]:text-[light-dark(#bd3350,_#ff8da5)] [&.liked_svg]:[fill:light-dark(#bd335020,_#ff8da520)] [&.saved]:text-blue [&.reposted]:text-green max-[600px]:gap-[4px] max-[600px]:[padding:5px_3px] max-[600px]:text-[11px] max-[600px]:[&_svg]:w-[18px] max-[600px]:[&_svg]:h-[18px] ${saved ? 'saved' : ''}`} aria-label="Lưu" aria-pressed={saved} onClick={() => onAction(post.id, 'save')}><Icon name="bookmark" /></button>
        <button className="[font-family:inherit] action inline-grid place-items-center [border:0] bg-transparent rounded-[20px] grid-flow-col gap-[6px] min-w-[34px] min-h-[44px] p-[6px] text-[12px] [&_svg]:w-[19px] [&_svg]:h-[19px] [&:hover]:text-blue [&:hover]:bg-[light-dark(#2466c20a,_#86b6f610)] [&.liked]:text-[light-dark(#bd3350,_#ff8da5)] [&.liked_svg]:[fill:light-dark(#bd335020,_#ff8da520)] [&.saved]:text-blue [&.reposted]:text-green max-[600px]:gap-[4px] max-[600px]:[padding:5px_3px] max-[600px]:text-[11px] max-[600px]:[&_svg]:w-[18px] max-[600px]:[&_svg]:h-[18px]" aria-label="Chia sẻ" onClick={share}><Icon name="share" /></button>
      </div>
      {replying && <section className="replies mt-[10px] pt-[12px] [border-top:1px_solid_var(--color-line)] text-[12px]" aria-label="Bình luận bài đăng">
        {post.replies.length === 0 && <p className="[margin:1em_0] muted text-muted">Chia sẻ góc nhìn của bạn.</p>}
        {post.replies.map((copy, index) => <div className="reply flex items-start gap-[10px] [&_.avatar]:w-[27px] [&_.avatar]:h-[27px] [&_.avatar]:text-[13px] [&_p]:mt-0 [&_p]:leading-[1.7] [&_p]:[overflow-wrap:anywhere]" key={index}><Avatar /><p className="[margin:1em_0]"><strong>Bạn</strong><br />{copy}</p></div>)}
        <form className="reply-form flex items-center [border:1px_solid_var(--color-line)] rounded-[24px] pl-[12px] [&_input]:w-full [&_input]:[border:0] [&_input]:bg-transparent [&_input]:[padding:10px_0] [&_input]:text-[13px] max-[600px]:[&_input]:text-[16px]" onSubmit={event => { event.preventDefault(); if (reply.trim()) { onReply(post.id, reply.trim()); setReply('') } }}><input className="[font-family:inherit]" aria-label="Nội dung bình luận" placeholder="Viết bình luận…" value={reply} maxLength={280} onChange={event => setReply(event.target.value)} required /><button className="[font-family:inherit] icon-button inline-grid place-items-center [border:0] bg-transparent rounded-full shrink-0 w-[44px] h-[44px] text-blue [&:hover]:bg-[light-dark(#2466c20d,_#86b6f612)]" aria-label="Gửi bình luận" disabled={!reply.trim()}><Icon name="send" /></button></form>
      </section>}
    </div>
  </article>
}
