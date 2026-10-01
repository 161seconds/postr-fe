const icons = {
  sun: <><circle cx="12" cy="12" r="4" /><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5" /></>,
  moon: <path d="M20.5 13A9 9 0 0 1 11 3.5 9 9 0 1 0 20.5 13Z" />,
  home: <path d="m3 11 9-8 9 8v9a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1z" />,
  search: <><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></>,
  bell: <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4" />,
  mail: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></>,
  bookmark: <path d="M6 3h12v18l-6-4-6 4z" />,
  user: <><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></>,
  image: <><rect x="3" y="4" width="18" height="16" rx="2" /><circle cx="9" cy="10" r="2" /><path d="m21 15-5-5L5 20" /></>,
  smile: <><circle cx="12" cy="12" r="9" /><path d="M8 14s1.5 2 4 2 4-2 4-2M9 9h.01M15 9h.01" /></>,
  comment: <path d="M21 12a8 8 0 0 1-9 8 9 9 0 0 1-4-1l-5 2 2-5a9 9 0 1 1 16-4z" />,
  repost: <path d="m17 2 4 4-4 4M3 11V9a3 3 0 0 1 3-3h15M7 22l-4-4 4-4m14-1v2a3 3 0 0 1-3 3H3" />,
  heart: <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8z" />,
  share: <><path d="M12 16V3m-5 5 5-5 5 5M5 12v8h14v-8" /></>,
  close: <path d="m6 6 12 12M6 18 18 6" />,
  arrow: <path d="M19 12H5m7-7-7 7 7 7" />,
  pen: <><path d="m16 3 5 5L9 20l-6 1 1-6ZM14 5l5 5" /></>,
  globe: <><circle cx="12" cy="12" r="9" /><ellipse cx="12" cy="12" rx="4" ry="9" /><path d="M3 12h18" /></>,
  pin: <><path d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 0 1 14 0Z" /><circle cx="12" cy="10" r="2" /></>,
  send: <path d="m21 3-7 18-4-7-7-4 18-7ZM10 14 21 3" />,
  check: <path d="m5 12 4 4L19 6" />,
}

export type IconName = keyof typeof icons
export default function Icon({ name }: { name: IconName }) {
  return <svg className="size-[21px] shrink-0 fill-none stroke-current [stroke-width:1.7]" aria-hidden="true" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">{icons[name]}</svg>
}
