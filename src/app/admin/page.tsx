'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { Avatar } from '@/shared/components/Identity'
import { filterPosts } from '@/features/feed/feed-model'
import { moderatePost } from '@/features/admin/moderation'
import type { Post } from '@/shared/types/post'

export default function AdminPage() {
  const [posts, setPosts] = useState<Post[] | null>(null)
  const [error, setError] = useState('')
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState('ALL')
  // ponytail: moderation is local to this demo page; use authenticated admin endpoints for real moderation.
  const [hidden, setHidden] = useState<Record<number, string>>({})
  const [selected, setSelected] = useState<Post>()
  const [reason, setReason] = useState('')
  const [formError, setFormError] = useState('')
  const [notice, setNotice] = useState('')
  const dialog = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const controller = new AbortController()
    fetch('/api/state', { signal: controller.signal }).then(async response => {
      if (!response.ok) throw new Error('Không tải được dữ liệu demo. Kiểm tra backend cổng 5000.')
      const state = await response.json()
      if (!Array.isArray(state.feed)) throw new Error('Dữ liệu bảng tin không hợp lệ.')
      setPosts(state.feed)
    }).catch(error => { if (!controller.signal.aborted) setError(error.message) })
    return () => controller.abort()
  }, [])

  const hiddenCount = posts?.filter(post => hidden[post.id]).length ?? 0
  const visible = filterPosts(posts ?? [], query).filter(post => status === 'ALL' || (status === 'HIDDEN' ? !!hidden[post.id] : !hidden[post.id]))

  function openModeration(post: Post) {
    setSelected(post)
    setReason('')
    setFormError('')
    dialog.current?.showModal()
  }

  return <main className="mx-auto max-w-6xl px-4 py-8 sm:px-8">
    <header className="flex flex-wrap items-center justify-between gap-4 border-b border-line pb-6">
      <Link href="/" className="font-serif text-3xl font-bold tracking-tight" aria-label="Postr - Trang chủ">postr<span className="text-accent">.admin</span></Link>
      <div className="flex items-center gap-4 text-sm"><span className="rounded-full border border-accent px-3 py-1 text-accent">DEMO</span><Link href="/" className="text-blue underline underline-offset-4">Về bảng tin</Link></div>
    </header>
    <div className="mb-8 mt-6 rounded-2xl border border-line bg-card p-4 text-sm text-muted">
      Bản demo quản trị. Dữ liệu lấy từ bảng tin demo; ẩn và khôi phục chỉ mô phỏng trên trang này, không thay đổi bảng tin hoặc dữ liệu backend. Tải lại trang sẽ đặt lại trạng thái kiểm duyệt.
    </div>
    <p className="text-xs font-bold tracking-widest text-accent">KHÔNG GIAN QUẢN TRỊ</p>
    <h1 className="mb-2 mt-2 font-serif text-3xl font-bold sm:text-4xl">Quản lý bài đăng</h1>
    <p className="mb-6 text-sm text-muted">Theo dõi nội dung, tìm kiếm và thử quy trình kiểm duyệt.</p>
    {error ? <div role="alert" className="rounded-2xl border border-accent bg-card p-6"><p>{error}</p><button type="button" className="mt-4 min-h-11 rounded-full border border-edge px-5" onClick={() => window.location.reload()}>Thử lại</button></div> : posts === null ? <p role="status" className="py-12 text-muted">Đang tải dữ liệu demo…</p> : <>
      <section aria-label="Thống kê demo" className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[
          ['Tổng bài đăng', posts.length],
          ['Đang hiển thị', posts.length - hiddenCount],
          ['Đã ẩn trong demo', hiddenCount],
          ['Tác giả trong bảng tin', new Set(posts.map(post => post.author.handle)).size],
        ].map(([label, count]) => <div key={label} className="rounded-2xl border border-line bg-card p-5"><p className="text-xs text-muted">{label}</p><p className="mt-3 font-serif text-3xl font-bold">{count}</p></div>)}
      </section>
      <section className="overflow-hidden rounded-2xl border border-line bg-card" aria-label="Danh sách bài đăng">
        <div className="flex flex-wrap items-end gap-4 border-b border-line p-5">
          <label className="grid min-w-0 flex-1 gap-2 text-sm font-bold">Tìm bài đăng
            <input type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder="Nội dung, tên hoặc @tác giả…" className="min-h-11 w-full rounded-xl border border-line bg-paper px-4 font-normal" />
          </label>
          <label className="grid gap-2 text-sm font-bold">Trạng thái
            <select value={status} onChange={event => setStatus(event.target.value)} className="min-h-11 rounded-xl border border-line bg-paper px-3 font-normal"><option value="ALL">Tất cả</option><option value="ACTIVE">Đang hiển thị</option><option value="HIDDEN">Đã ẩn</option></select>
          </label>
        </div>
        <p role="status" className="px-5 py-3 text-sm text-muted">Tìm thấy {visible.length} bài đăng.{notice && (' ' + notice)}</p>
        <div className="overflow-x-auto" role="region" aria-label="Bảng kiểm duyệt bài đăng" tabIndex={0}>
          <table className="w-full min-w-[720px] text-left text-sm">
            <caption className="sr-only">Bài đăng và trạng thái kiểm duyệt mô phỏng</caption>
            <thead className="border-y border-line bg-paper text-xs text-muted"><tr><th scope="col" className="p-5">Tác giả</th><th scope="col" className="p-5">Nội dung</th><th scope="col" className="p-5">Trạng thái</th><th scope="col" className="p-5">Thao tác</th></tr></thead>
            <tbody>{visible.map(post => <tr key={post.id} className="border-b border-line last:border-0">
              <td className="p-5 align-top"><div className="flex items-center gap-3"><Avatar person={post.author} /><div><p className="whitespace-nowrap font-bold">{post.author.name}</p><p className="text-xs text-muted">{post.author.handle}</p></div></div></td>
              <td className="max-w-md p-5 align-top"><p className="whitespace-pre-wrap break-words">{post.copy || 'Bài đăng có ảnh'}</p><p className="mt-2 text-xs text-muted">{post.topic} · {post.time} · {post.likes} lượt thích</p>{hidden[post.id] && <p className="mt-3 break-words text-xs text-accent">Lý do: {hidden[post.id]}</p>}</td>
              <td className="p-5 align-top"><span className={'whitespace-nowrap rounded-full border px-3 py-1 text-xs ' + (hidden[post.id] ? 'border-accent text-accent' : 'border-green text-green')}>{hidden[post.id] ? 'Đã ẩn' : 'Hiển thị'}</span></td>
              <td className="p-5 align-top"><button type="button" className="min-h-11 whitespace-nowrap rounded-full border border-edge px-4 font-bold hover:bg-paper" aria-label={(hidden[post.id] ? 'Khôi phục' : 'Ẩn') + ' bài của ' + post.author.name} onClick={() => {
                if (hidden[post.id]) { setHidden(current => moderatePost(current, post.id, null)); setNotice('Đã khôi phục bài đăng trong demo.') }
                else openModeration(post)
              }}>{hidden[post.id] ? 'Khôi phục' : 'Ẩn bài'}</button></td>
            </tr>)}</tbody>
          </table>
        </div>
        {!visible.length && <p className="p-10 text-center text-muted">Không có bài đăng phù hợp. Thử từ khóa hoặc trạng thái khác.</p>}
      </section>
    </>}
    <dialog ref={dialog} aria-labelledby="moderation-title" className="m-auto w-[calc(100%_-_2rem)] max-w-lg rounded-2xl border border-edge bg-card p-6 text-ink backdrop:bg-black/60">
      <form onSubmit={event => {
        event.preventDefault()
        if (!selected) return
        try {
          setHidden(moderatePost(hidden, selected.id, reason))
          setNotice('Đã ẩn bài đăng trong demo.')
          dialog.current?.close()
        } catch (error) { setFormError(error instanceof Error ? error.message : 'Không thể ẩn bài đăng.') }
      }}>
        <h2 id="moderation-title" className="font-serif text-2xl font-bold">Ẩn bài đăng</h2>
        <p className="mb-5 mt-2 text-sm text-muted">Bài của {selected?.author.name}. Thao tác chỉ áp dụng trong demo.</p>
        <label className="grid gap-2 text-sm font-bold">Lý do kiểm duyệt
          <textarea autoFocus required minLength={5} maxLength={255} value={reason} onChange={event => setReason(event.target.value)} aria-describedby="reason-help reason-error" className="min-h-28 rounded-xl border border-line bg-paper p-3 font-normal" placeholder="Ví dụ: Nội dung spam hoặc quảng cáo lặp lại" />
        </label>
        <p id="reason-help" className="mt-2 text-xs text-muted">Từ 5–255 ký tự, không tính khoảng trắng đầu và cuối.</p>
        <p id="reason-error" role="alert" className="mt-2 text-sm text-accent">{formError}</p>
        <div className="mt-6 flex justify-end gap-3"><button type="button" className="min-h-11 rounded-full border border-edge px-5" onClick={() => dialog.current?.close()}>Hủy</button><button type="submit" className="min-h-11 rounded-full bg-accent px-5 font-bold text-[#24221f]">Ẩn trong demo</button></div>
      </form>
    </dialog>
  </main>
}
