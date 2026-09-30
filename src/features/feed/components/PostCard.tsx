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

  return <article className="post" id={`post-${post.id}`}>
    <Avatar person={post.author} />
    <div>
      <div className="post-head"><span className="post-name">{post.author.name}</span>{post.author.verified && <Verified />}<span className="handle">{post.author.handle}</span><a className="post-time" href={`#post/${post.id}`} aria-label={`Mở bài đăng của ${post.author.name}`}>· {post.time}</a></div>
      <p className="post-copy">{post.copy.split(/(#[\p{L}\p{N}_]+)/u).map((part, index) => part.startsWith('#') ? <a key={index} className="hashtag" href={`#search/${encodeURIComponent(part)}`}>{part}</a> : part)}</p>
      {post.media === 'city' && <div className="media media-city" role="img" aria-label="Khung cảnh Việt Nam"><div className="media-caption"><small>Điểm đến hôm nay</small><h3>Những nơi chốn khiến mình muốn đi chậm lại.</h3></div></div>}
      {post.media === 'tech' && <div className="media media-tech" role="img" aria-label="Không gian làm việc sáng tạo" />}
      {post.image && <img className="post-image" src={post.image} alt="Ảnh do tác giả đính kèm" />}
      {post.quote && <div className="quote-card"><small>POSTR NOTE {String(post.id).padStart(3, '0')}</small><p>{post.quote}</p><span aria-hidden="true">✳</span></div>}
      <div className="actions">
        <button className={`action ${replying ? 'saved' : ''}`} aria-label="Bình luận" aria-expanded={replying} onClick={() => setReplying(!replying)}><Icon name="comment" /><span>{post.comments + post.replies.length}</span></button>
        <button className={`action ${reposted ? 'reposted' : ''}`} aria-label="Đăng lại" aria-pressed={reposted} onClick={() => onAction(post.id, 'repost')}><Icon name="repost" /><span>{post.reposts + Number(reposted)}</span></button>
        <button className={`action ${liked ? 'liked' : ''}`} aria-label="Thích" aria-pressed={liked} onClick={() => onAction(post.id, 'like')}><Icon name="heart" /><span>{(post.likes + Number(liked)).toLocaleString('vi-VN')}</span></button>
        <button className={`action ${saved ? 'saved' : ''}`} aria-label="Lưu" aria-pressed={saved} onClick={() => onAction(post.id, 'save')}><Icon name="bookmark" /></button>
        <button className="action" aria-label="Chia sẻ" onClick={share}><Icon name="share" /></button>
      </div>
      {replying && <section className="replies" aria-label="Bình luận bài đăng">
        {post.replies.length === 0 && <p className="muted">Chia sẻ góc nhìn của bạn.</p>}
        {post.replies.map((copy, index) => <div className="reply" key={index}><Avatar /><p><strong>Bạn</strong><br />{copy}</p></div>)}
        <form className="reply-form" onSubmit={event => { event.preventDefault(); if (reply.trim()) { onReply(post.id, reply.trim()); setReply('') } }}><input aria-label="Nội dung bình luận" placeholder="Viết bình luận…" value={reply} maxLength={280} onChange={event => setReply(event.target.value)} required /><button className="icon-button" aria-label="Gửi bình luận" disabled={!reply.trim()}><Icon name="send" /></button></form>
      </section>}
    </div>
  </article>
}
