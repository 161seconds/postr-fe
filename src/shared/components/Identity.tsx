import type { Person } from '@/shared/types/post'

export function Avatar({ person, large = false }: { person?: Person; large?: boolean }) {
  return <span aria-hidden="true" className={`avatar ${person?.tone ?? ''} ${large ? 'avatar-large' : ''}`}>{person?.initial ?? 'A'}</span>
}

export function Logo() {
  return <a className="brand" href="#home" aria-label="Postr - Trang chủ"><span className="brand-mark">P</span><span>postr.</span></a>
}

export function Verified() {
  return <span className="verified" aria-label="Đã xác minh">✓</span>
}
