import type { Person } from '@/shared/types/post'

export function Avatar({ person, large = false }: { person?: Person; large?: boolean }) {
  return <span aria-hidden="true" className={`avatar inline-grid flex-none place-items-center w-[42px] h-[42px] overflow-hidden [border:1.5px_solid_var(--color-edge)] rounded-full bg-[#427dbb] text-white font-serif text-[20px] font-black [&.orange]:bg-accent [&.orange]:text-[#24221f] [&.green]:bg-[#288064] [&.yellow]:bg-[#efcc62] [&.yellow]:text-[#24221f] [&.black]:bg-[#24221f] ${person?.tone ?? ''} ${large ? "avatar-large [&.avatar-large]:w-[80px] [&.avatar-large]:h-[80px] [&.avatar-large]:[border:5px_solid_var(--color-card)] [&.avatar-large]:shadow-[0_0_0_1px_var(--color-line)] [&.avatar-large]:text-[37px]" : ''}`}>{person?.initial ?? 'A'}</span>
}

export function Logo() {
  return <a className="brand inline-flex items-center gap-[10px] w-fit ml-[12px] font-serif text-[35px] font-black tracking-[-2px]" href="#home" aria-label="Postr - Trang chủ"><span className="brand-mark grid place-items-center w-[37px] h-[37px] [border:2px_solid_var(--color-edge)] rounded-[50%_50%_50%_10%] bg-accent text-[#24221f] shadow-[3px_3px_0_var(--color-shadow)] [font-family:'Trebuchet_MS',sans-serif] text-[23px] tracking-[0]">P</span><span>postr.</span></a>
}

export function Verified() {
  return <span className="verified inline-grid align-middle shrink-0 place-items-center w-[13px] h-[13px] rounded-full bg-blue text-card text-[9px]" aria-label="Đã xác minh">✓</span>
}
