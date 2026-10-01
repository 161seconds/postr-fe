import type { Metadata } from 'next'
import localFont from 'next/font/local'
import './globals.css'

const sans = localFont({
  src: [
    { path: '../../public/fonts/OpenSans-Regular.ttf', weight: '400' },
    { path: '../../public/fonts/OpenSans-Bold.ttf', weight: '700 900' },
  ],
  variable: '--font-postr-sans',
})
const serif = localFont({ src: '../../public/fonts/Lora-Bold.ttf', weight: '400 900', variable: '--font-postr-serif' })

export const metadata: Metadata = {
  title: 'Postr - Tin tức đang diễn ra',
  description: 'Postr - mạng xã hội chia sẻ tin tức và trạng thái ngắn.',
  icons: { icon: '/favicon.svg' },
}

const themeScript = `
  try {
    if (localStorage.getItem('postr-theme') === 'light') {
      document.documentElement.dataset.theme = 'light';
      document.querySelector('meta[name="theme-color"]').content = '#f5f0e8';
    }
  } catch { /* Keep dark mode when storage is unavailable. */ }
`

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="vi" data-theme="dark" suppressHydrationWarning className={`${sans.variable} ${serif.variable} bg-paper font-sans text-ink [color-scheme:dark] [font-synthesis:none] data-[theme=light]:[color-scheme:light] [scrollbar-width:thin] [scrollbar-color:light-dark(#9a8872,#887661)_light-dark(#f5f0e8,#171614)]`}>
    <head>
      <meta name="theme-color" content="#171614" suppressHydrationWarning />
      <script dangerouslySetInnerHTML={{ __html: themeScript }} />
    </head>
    <body className="m-0 leading-[normal] [background:radial-gradient(ellipse_at_0_0,#ff70480d,transparent_35%),repeating-linear-gradient(90deg,transparent_0_35px,light-dark(#24221f03,#f1eae003)_35px_36px)] has-[dialog[open]]:overflow-hidden selection:bg-[light-dark(#ffd1ae,#744331)] [&_*]:[scrollbar-width:thin] [&_::-webkit-scrollbar]:w-[10px] [&_::-webkit-scrollbar]:h-[10px] [&_::-webkit-scrollbar-track]:bg-paper [&_::-webkit-scrollbar-corner]:bg-paper [&_::-webkit-scrollbar-thumb]:rounded-[10px] [&_::-webkit-scrollbar-thumb]:bg-scrollbar [&_::-webkit-scrollbar-thumb]:[border:2px_solid_var(--color-paper)] [&_::-webkit-scrollbar-thumb:hover]:bg-scrollbar-hover [&_*]:[scrollbar-color:light-dark(#9a8872,#887661)_light-dark(#f5f0e8,#171614)] [&_button]:cursor-pointer [&_button:disabled]:cursor-not-allowed [&_button:disabled]:opacity-45 [&_button]:touch-manipulation [&_a]:touch-manipulation [&_:focus-visible]:outline-2 [&_:focus-visible]:outline-blue [&_:focus-visible]:outline-offset-4 [&_input]:min-w-0 [&_textarea]:min-w-0 motion-reduce:[&_*]:animate-none motion-reduce:[&_*]:transition-none">
      {children}
    </body>
  </html>
}
