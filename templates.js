// Static HTML from the original UI; no framework runtime.
export const templates = {
shell: `
<a href="/admin" class="admin-mobile">Quản trị</a>
<a href="#main-content" class="skip-link fixed left-[16px] top-[-80px] z-[30] p-[15px] bg-card [border:2px_solid_var(--color-edge)] [&amp;:focus]:top-[16px]">Đến nội dung chính</a>
<div class="shell grid grid-cols-[220px_minmax(0,_600px)_310px] gap-[28px] [width:min(1186px,_calc(100%_-_48px))] [margin:0_auto] max-[1130px]:grid-cols-[74px_minmax(0,_600px)_280px] max-[1130px]:[width:calc(100%_-_40px)] max-[1130px]:gap-[22px] max-[880px]:grid-cols-[74px_minmax(0,_620px)] max-[880px]:[width:min(730px,_100%)] max-[880px]:gap-[16px] max-[600px]:block max-[600px]:w-full">
<aside class="rail sticky top-0 h-dvh [padding:32px_6px_24px_0] flex flex-col overflow-y-auto [scrollbar-width:none]! [&amp;::-webkit-scrollbar]:hidden max-[1130px]:items-center max-[1130px]:[&amp;_.brand]:ml-0 max-[1130px]:[&amp;_.brand_&gt;_span:last-child]:hidden max-[600px]:hidden" aria-label="Điều hướng chính">
<a class="brand inline-flex items-center gap-[10px] w-fit ml-[12px] font-serif text-[35px] font-black tracking-[-2px]" href="#home" aria-label="Postr - Trang chủ">
<span class="brand-mark grid place-items-center w-[37px] h-[37px] [border:2px_solid_var(--color-edge)] rounded-[50%_50%_50%_10%] bg-accent text-[#24221f] shadow-[3px_3px_0_var(--color-shadow)] [font-family:&#x27;Trebuchet_MS&#x27;,sans-serif] text-[23px] tracking-[0]">P</span>
<span>postr.</span>
</a>
<p class="rail-caption [margin:16px_0_30px_12px] text-[8px] tracking-[1.1px] text-muted max-[1130px]:hidden">MỖI GÓC NHÌN, MỘT CÂU CHUYỆN.</p>
<nav class="nav grid gap-[7px] max-[1130px]:mt-[35px]">
<a class="nav-link relative flex items-center gap-[15px] min-h-[51px] [padding:12px_16px] [border:1.5px_solid_transparent] rounded-[100px] text-[15px] font-bold [transition:background_.15s] [&amp;:hover]:bg-[light-dark(#fffdf880,_#ffffff09)] [&amp;.active]:border-edge [&amp;.active]:bg-card [&amp;.active]:shadow-[3px_3px_0_light-dark(#e8dfd1,_#0c0b0a)] [&amp;.active::after]:w-[7px] [&amp;.active::after]:h-[7px] [&amp;.active::after]:ml-auto [&amp;.active::after]:rounded-full [&amp;.active::after]:bg-accent [&amp;.active::after]:content-[&#x27;&#x27;] max-[1130px]:[&amp;_&gt;_span:last-child]:hidden max-[1130px]:justify-center max-[1130px]:w-[50px] max-[1130px]:h-[50px] max-[1130px]:p-0 max-[1130px]:[&amp;.active::after]:absolute max-[1130px]:[&amp;.active::after]:right-[5px] max-[1130px]:[&amp;.active::after]:bottom-[8px] max-[1130px]:[&amp;.active::after]:w-[5px] max-[1130px]:[&amp;.active::after]:h-[5px] active" href="#home" aria-label="Trang chủ" aria-current="page">
<span class="nav-icon relative flex">
<svg class="size-[21px] shrink-0 fill-none stroke-current [stroke-width:1.7]" aria-hidden="true" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round">
<path d="m3 11 9-8 9 8v9a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1z">
</path>
</svg>
</span>
<span>Trang chủ</span>
</a>
<a class="nav-link relative flex items-center gap-[15px] min-h-[51px] [padding:12px_16px] [border:1.5px_solid_transparent] rounded-[100px] text-[15px] font-bold [transition:background_.15s] [&amp;:hover]:bg-[light-dark(#fffdf880,_#ffffff09)] [&amp;.active]:border-edge [&amp;.active]:bg-card [&amp;.active]:shadow-[3px_3px_0_light-dark(#e8dfd1,_#0c0b0a)] [&amp;.active::after]:w-[7px] [&amp;.active::after]:h-[7px] [&amp;.active::after]:ml-auto [&amp;.active::after]:rounded-full [&amp;.active::after]:bg-accent [&amp;.active::after]:content-[&#x27;&#x27;] max-[1130px]:[&amp;_&gt;_span:last-child]:hidden max-[1130px]:justify-center max-[1130px]:w-[50px] max-[1130px]:h-[50px] max-[1130px]:p-0 max-[1130px]:[&amp;.active::after]:absolute max-[1130px]:[&amp;.active::after]:right-[5px] max-[1130px]:[&amp;.active::after]:bottom-[8px] max-[1130px]:[&amp;.active::after]:w-[5px] max-[1130px]:[&amp;.active::after]:h-[5px] " href="#search" aria-label="Khám phá">
<span class="nav-icon relative flex">
<svg class="size-[21px] shrink-0 fill-none stroke-current [stroke-width:1.7]" aria-hidden="true" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round">
<circle cx="11" cy="11" r="7">
</circle>
<path d="m20 20-4-4">
</path>
</svg>
</span>
<span>Khám phá</span>
</a>
<a class="nav-link relative flex items-center gap-[15px] min-h-[51px] [padding:12px_16px] [border:1.5px_solid_transparent] rounded-[100px] text-[15px] font-bold [transition:background_.15s] [&amp;:hover]:bg-[light-dark(#fffdf880,_#ffffff09)] [&amp;.active]:border-edge [&amp;.active]:bg-card [&amp;.active]:shadow-[3px_3px_0_light-dark(#e8dfd1,_#0c0b0a)] [&amp;.active::after]:w-[7px] [&amp;.active::after]:h-[7px] [&amp;.active::after]:ml-auto [&amp;.active::after]:rounded-full [&amp;.active::after]:bg-accent [&amp;.active::after]:content-[&#x27;&#x27;] max-[1130px]:[&amp;_&gt;_span:last-child]:hidden max-[1130px]:justify-center max-[1130px]:w-[50px] max-[1130px]:h-[50px] max-[1130px]:p-0 max-[1130px]:[&amp;.active::after]:absolute max-[1130px]:[&amp;.active::after]:right-[5px] max-[1130px]:[&amp;.active::after]:bottom-[8px] max-[1130px]:[&amp;.active::after]:w-[5px] max-[1130px]:[&amp;.active::after]:h-[5px] " href="#bell" aria-label="Thông báo">
<span class="nav-icon relative flex">
<svg class="size-[21px] shrink-0 fill-none stroke-current [stroke-width:1.7]" aria-hidden="true" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round">
<path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4">
</path>
</svg>
<i class="notification-dot absolute top-0 right-[-1px] h-[7px] w-[7px] bg-accent [border:1px_solid_var(--color-paper)] rounded-full">
</i>
</span>
<span>Thông báo</span>
</a>
<a class="nav-link relative flex items-center gap-[15px] min-h-[51px] [padding:12px_16px] [border:1.5px_solid_transparent] rounded-[100px] text-[15px] font-bold [transition:background_.15s] [&amp;:hover]:bg-[light-dark(#fffdf880,_#ffffff09)] [&amp;.active]:border-edge [&amp;.active]:bg-card [&amp;.active]:shadow-[3px_3px_0_light-dark(#e8dfd1,_#0c0b0a)] [&amp;.active::after]:w-[7px] [&amp;.active::after]:h-[7px] [&amp;.active::after]:ml-auto [&amp;.active::after]:rounded-full [&amp;.active::after]:bg-accent [&amp;.active::after]:content-[&#x27;&#x27;] max-[1130px]:[&amp;_&gt;_span:last-child]:hidden max-[1130px]:justify-center max-[1130px]:w-[50px] max-[1130px]:h-[50px] max-[1130px]:p-0 max-[1130px]:[&amp;.active::after]:absolute max-[1130px]:[&amp;.active::after]:right-[5px] max-[1130px]:[&amp;.active::after]:bottom-[8px] max-[1130px]:[&amp;.active::after]:w-[5px] max-[1130px]:[&amp;.active::after]:h-[5px] " href="#mail" aria-label="Tin nhắn">
<span class="nav-icon relative flex">
<svg class="size-[21px] shrink-0 fill-none stroke-current [stroke-width:1.7]" aria-hidden="true" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round">
<rect x="3" y="5" width="18" height="14" rx="2">
</rect>
<path d="m3 7 9 6 9-6">
</path>
</svg>
</span>
<span>Tin nhắn</span>
</a>
<a class="nav-link relative flex items-center gap-[15px] min-h-[51px] [padding:12px_16px] [border:1.5px_solid_transparent] rounded-[100px] text-[15px] font-bold [transition:background_.15s] [&amp;:hover]:bg-[light-dark(#fffdf880,_#ffffff09)] [&amp;.active]:border-edge [&amp;.active]:bg-card [&amp;.active]:shadow-[3px_3px_0_light-dark(#e8dfd1,_#0c0b0a)] [&amp;.active::after]:w-[7px] [&amp;.active::after]:h-[7px] [&amp;.active::after]:ml-auto [&amp;.active::after]:rounded-full [&amp;.active::after]:bg-accent [&amp;.active::after]:content-[&#x27;&#x27;] max-[1130px]:[&amp;_&gt;_span:last-child]:hidden max-[1130px]:justify-center max-[1130px]:w-[50px] max-[1130px]:h-[50px] max-[1130px]:p-0 max-[1130px]:[&amp;.active::after]:absolute max-[1130px]:[&amp;.active::after]:right-[5px] max-[1130px]:[&amp;.active::after]:bottom-[8px] max-[1130px]:[&amp;.active::after]:w-[5px] max-[1130px]:[&amp;.active::after]:h-[5px] " href="#bookmark" aria-label="Đã lưu">
<span class="nav-icon relative flex">
<svg class="size-[21px] shrink-0 fill-none stroke-current [stroke-width:1.7]" aria-hidden="true" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round">
<path d="M6 3h12v18l-6-4-6 4z">
</path>
</svg>
</span>
<span>Đã lưu</span>
</a>
<a class="nav-link relative flex items-center gap-[15px] min-h-[51px] [padding:12px_16px] [border:1.5px_solid_transparent] rounded-[100px] text-[15px] font-bold [transition:background_.15s] [&amp;:hover]:bg-[light-dark(#fffdf880,_#ffffff09)] [&amp;.active]:border-edge [&amp;.active]:bg-card [&amp;.active]:shadow-[3px_3px_0_light-dark(#e8dfd1,_#0c0b0a)] [&amp;.active::after]:w-[7px] [&amp;.active::after]:h-[7px] [&amp;.active::after]:ml-auto [&amp;.active::after]:rounded-full [&amp;.active::after]:bg-accent [&amp;.active::after]:content-[&#x27;&#x27;] max-[1130px]:[&amp;_&gt;_span:last-child]:hidden max-[1130px]:justify-center max-[1130px]:w-[50px] max-[1130px]:h-[50px] max-[1130px]:p-0 max-[1130px]:[&amp;.active::after]:absolute max-[1130px]:[&amp;.active::after]:right-[5px] max-[1130px]:[&amp;.active::after]:bottom-[8px] max-[1130px]:[&amp;.active::after]:w-[5px] max-[1130px]:[&amp;.active::after]:h-[5px] " href="#user" aria-label="Hồ sơ">
<span class="nav-icon relative flex">
<svg class="size-[21px] shrink-0 fill-none stroke-current [stroke-width:1.7]" aria-hidden="true" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round">
<circle cx="12" cy="8" r="4">
</circle>
<path d="M4 21a8 8 0 0 1 16 0">
</path>
</svg>
</span>
<span>Hồ sơ</span>
</a>
</nav>
<button class="[font-family:inherit] primary flex items-center justify-center gap-[12px] w-full min-h-[49px] mt-[27px] [padding:12px_20px] [border:1.5px_solid_var(--color-edge)] rounded-[100px] bg-ink text-card shadow-[4px_4px_0_var(--color-accent)] font-bold [&amp;:hover]:bg-[light-dark(#444039,_#d7cbbb)] max-[1130px]:[&amp;_&gt;_span]:hidden max-[1130px]:w-[50px] max-[1130px]:h-[50px] max-[1130px]:p-0" aria-label="Đăng bài">
<svg class="size-[21px] shrink-0 fill-none stroke-current [stroke-width:1.7]" aria-hidden="true" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round">
<path d="m16 3 5 5L9 20l-6 1 1-6ZM14 5l5 5">
</path>
</svg>
<span>Đăng bài</span>
</button>
<a href="/admin" class="admin-link">Quản trị</a>
<div class="rail-note flex items-center gap-[8px] [margin:26px_9px] text-[10px] text-muted max-[1130px]:hidden">
<span class="live-dot inline-block shrink-0 w-[6px] h-[6px] rounded-full bg-green">
</span> Một chút kết nối mỗi ngày.</div>
<a class="profile-mini flex items-center gap-[10px] mt-auto p-[12px] [border:1px_solid_var(--color-line)] rounded-[16px] bg-[light-dark(#fffdf87a,_#211f1c99)] text-[13px] [&amp;_&gt;_div]:overflow-hidden [&amp;_&gt;_div]:text-ellipsis [&amp;_strong]:whitespace-nowrap [&amp;_small]:text-muted [&amp;_small]:text-[11px] [&amp;_&gt;_svg]:w-[16px] [&amp;_&gt;_svg]:ml-auto [&amp;_&gt;_svg]:[transform:rotate(180deg)] max-[1130px]:[&amp;_&gt;_div]:hidden max-[1130px]:[&amp;_&gt;_svg]:hidden max-[1130px]:p-[4px] max-[1130px]:[border:0] max-[1130px]:bg-transparent" href="#user" aria-label="Hồ sơ của bạn">
<span aria-hidden="true" class="avatar inline-grid flex-none place-items-center w-[42px] h-[42px] overflow-hidden [border:1.5px_solid_var(--color-edge)] rounded-full bg-[#427dbb] text-white font-serif text-[20px] font-black [&amp;.orange]:bg-accent [&amp;.orange]:text-[#24221f] [&amp;.green]:bg-[#288064] [&amp;.yellow]:bg-[#efcc62] [&amp;.yellow]:text-[#24221f] [&amp;.black]:bg-[#24221f]  ">__INITIAL__</span>
<div>
<strong>__NAME__</strong>
<br/>
<small class="text-xs">__HANDLE__</small>
</div>
<svg class="size-[21px] shrink-0 fill-none stroke-current [stroke-width:1.7]" aria-hidden="true" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round">
<path d="M19 12H5m7-7-7 7 7 7">
</path>
</svg>
</a>
</aside>
<main class="main-surface min-w-0 min-h-dvh [border-inline:1px_solid_var(--color-line)] bg-[light-dark(#fffdf8b8,_#1d1b18d9)] [&amp;:has(.conversation)]:flex [&amp;:has(.conversation)]:flex-col [&amp;:has(.conversation)]:h-dvh [&amp;:has(.conversation)_.topbar]:shrink-0 max-[600px]:min-h-dvh max-[600px]:[border:0] max-[600px]:pb-[85px]" id="main-content" tabindex="-1">
<header class="topbar sticky z-[5] top-0 [border-bottom:1px_solid_var(--color-line)] bg-[light-dark(#f9f5edf0,_#1b1917f0)] [backdrop-filter:blur(16px)]">
<div class="mobile-brand hidden max-[600px]:flex max-[600px]:items-center max-[600px]:justify-between max-[600px]:[padding:8px_16px_0] max-[600px]:[&amp;_.brand]:m-0 max-[600px]:[&amp;_.brand]:text-[28px] max-[600px]:[&amp;_.brand-mark]:w-[30px] max-[600px]:[&amp;_.brand-mark]:h-[30px] max-[600px]:[&amp;_.brand-mark]:text-[18px] max-[600px]:[&amp;_.avatar]:w-[32px] max-[600px]:[&amp;_.avatar]:h-[32px] max-[600px]:[&amp;_.avatar]:text-[16px]">
<a class="brand inline-flex items-center gap-[10px] w-fit ml-[12px] font-serif text-[35px] font-black tracking-[-2px]" href="#home" aria-label="Postr - Trang chủ">
<span class="brand-mark grid place-items-center w-[37px] h-[37px] [border:2px_solid_var(--color-edge)] rounded-[50%_50%_50%_10%] bg-accent text-[#24221f] shadow-[3px_3px_0_var(--color-shadow)] [font-family:&#x27;Trebuchet_MS&#x27;,sans-serif] text-[23px] tracking-[0]">P</span>
<span>postr.</span>
</a>
<div class="mobile-header-actions max-[600px]:flex max-[600px]:items-center max-[600px]:gap-[8px] max-[600px]:[&amp;_&gt;_a]:grid max-[600px]:[&amp;_&gt;_a]:place-items-center max-[600px]:[&amp;_&gt;_a]:w-[44px] max-[600px]:[&amp;_&gt;_a]:h-[44px]">
<button class="[font-family:inherit] icon-button inline-grid place-items-center [border:0] bg-transparent rounded-full shrink-0 w-[44px] h-[44px] text-blue [&amp;:hover]:bg-[light-dark(#2466c20d,_#86b6f612)]   compose-trigger max-[600px]:[&amp;.compose-trigger]:[border:1px_solid_var(--color-edge)] max-[600px]:[&amp;.compose-trigger]:bg-accent max-[600px]:[&amp;.compose-trigger]:text-[#24221f] max-[600px]:[&amp;:hover]:bg-[#ff906a]" aria-label="Đăng bài">
<svg class="size-[21px] shrink-0 fill-none stroke-current [stroke-width:1.7]" aria-hidden="true" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round">
<path d="m16 3 5 5L9 20l-6 1 1-6ZM14 5l5 5">
</path>
</svg>
</button>
<a href="#user" aria-label="Hồ sơ của bạn">
<span aria-hidden="true" class="avatar inline-grid flex-none place-items-center w-[42px] h-[42px] overflow-hidden [border:1.5px_solid_var(--color-edge)] rounded-full bg-[#427dbb] text-white font-serif text-[20px] font-black [&amp;.orange]:bg-accent [&amp;.orange]:text-[#24221f] [&amp;.green]:bg-[#288064] [&amp;.yellow]:bg-[#efcc62] [&amp;.yellow]:text-[#24221f] [&amp;.black]:bg-[#24221f]  ">__INITIAL__</span>
</a>
</div>
</div>
<div class="page-heading flex items-center justify-between gap-[16px] min-h-[88px] [padding:20px_24px] [&amp;_small]:text-[8px] [&amp;_small]:text-muted [&amp;_small]:tracking-[1.8px] [&amp;_h1]:[margin:5px_0_0] [&amp;_h1]:text-[23px] [&amp;_h1]:font-serif [&amp;_h1]:tracking-[-.8px] max-[600px]:min-h-[43px] max-[600px]:[padding:3px_18px_12px] max-[600px]:[&amp;_small]:hidden max-[600px]:[&amp;_h1]:text-[21px]">
<div>
<small class="text-xs">KHÔNG GIAN CỦA BẠN</small>
<h1 class="[margin:.67em_0] font-bold">Trang chủ</h1>
</div>
<div class="heading-actions flex items-center gap-[12px]">
<span class="edition text-[9px] text-muted tracking-[1px] max-[600px]:hidden">POSTR / 01</span>
<button type="button" class="[font-family:inherit] icon-button inline-grid place-items-center [border:0] bg-transparent rounded-full shrink-0 w-[44px] h-[44px] text-blue [&amp;:hover]:bg-[light-dark(#2466c20d,_#86b6f612)]   theme-toggle [&amp;.theme-toggle]:text-ink [&amp;.theme-toggle]:[border:1px_solid_var(--color-line)] [&amp;.theme-toggle]:bg-card" aria-label="Chế độ tối" aria-pressed="true" title="Chuyển sang chế độ sáng">
<svg class="size-[21px] shrink-0 fill-none stroke-current [stroke-width:1.7]" aria-hidden="true" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round">
<circle cx="12" cy="12" r="4">
</circle>
<path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5">
</path>
</svg>
</button>
</div>
</div>
</header>__CONTENT__</main>
<aside class="rightbar [padding:30px_0] max-[880px]:hidden" aria-label="Khám phá cộng đồng">
<form class="search flex items-center gap-[10px] min-h-[44px] [padding:10px_14px] [border:1.5px_solid_var(--color-edge)] rounded-[100px] bg-card shadow-[3px_3px_0_#efcc62] [&amp;:focus-within]:[outline:2px_solid_var(--color-muted)] [&amp;:focus-within]:[outline-offset:3px] [&amp;_input]:w-full [&amp;_input]:[border:0] [&amp;_input]:[outline:none] [&amp;_input]:bg-transparent [&amp;_input]:text-[12px] [&amp;_svg]:w-[17px] [&amp;_svg]:h-[17px] [&amp;_kbd]:[padding:1px_5px] [&amp;_kbd]:[border:1px_solid_var(--color-line)] [&amp;_kbd]:rounded-[4px] [&amp;_kbd]:text-muted max-[600px]:[&amp;_input]:text-[16px]" role="search">
<svg class="size-[21px] shrink-0 fill-none stroke-current [stroke-width:1.7]" aria-hidden="true" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round">
<circle cx="11" cy="11" r="7">
</circle>
<path d="m20 20-4-4">
</path>
</svg>
<input class="[font-family:inherit]" type="search" placeholder="Tìm trên Postr" aria-label="Tìm trên Postr" value=""/>
<kbd aria-hidden="true">↵</kbd>
</form>
<section class="daily-note relative isolate overflow-hidden mt-[24px] p-[22px] [border:1.5px_solid_var(--color-edge)] rounded-[18px] bg-[light-dark(#eedcae,_#393122)] [&amp;_&gt;_small]:text-[8px] [&amp;_&gt;_small]:tracking-[1.3px] [&amp;_h2]:[margin:14px_0_10px] [&amp;_h2]:font-serif [&amp;_h2]:text-[30px] [&amp;_h2]:leading-[1.05] [&amp;_h2]:tracking-[-1px] [&amp;_p]:max-w-[200px] [&amp;_p]:[margin:0_0_17px] [&amp;_p]:text-[11px] [&amp;_p]:leading-[1.65]">
<small class="text-xs">CHUYỆN NHỎ HÔM NAY</small>
<h2 class="[margin:.83em_0] font-bold">Thế giới rộng.<br/>Kết nối gần.</h2>
<p class="[margin:1em_0]">Một ý tưởng hay có thể bắt đầu từ câu chuyện của bạn.</p>
<button class="[font-family:inherit] text-button inline-flex items-center gap-[6px] p-0 min-h-[30px] [border:0] bg-transparent text-[11px] font-bold [&amp;:hover]:underline">Kể chuyện của bạn <span aria-hidden="true">↗</span>
</button>
<span class="note-star absolute z-[-1] right-[-24px] top-[10px] text-[#cf9a4080] text-[150px] leading-[1]" aria-hidden="true">✳</span>
</section>
<section class="side-card mt-[23px] overflow-hidden [border:1.5px_solid_var(--color-edge)] rounded-[18px] bg-card shadow-[4px_4px_0_var(--color-shadow)]">
<h2 class="font-bold side-title flex items-center justify-between m-0 [padding:18px_17px] font-serif text-[19px] tracking-[-.5px]">Đang diễn ra <span class="live-dot inline-block shrink-0 w-[6px] h-[6px] rounded-full bg-green">
</span>
</h2>
<a class="trend flex items-start gap-[10px] [padding:13px_16px] [border-top:1px_solid_var(--color-line)] [&amp;:hover]:bg-[light-dark(#fff5e6,_#2d2821)] [&amp;_&gt;_span:last-child]:ml-auto [&amp;_&gt;_span:last-child]:text-[#a59886] [&amp;_&gt;_span:last-child]:text-[14px] [&amp;_small]:text-muted [&amp;_small]:text-[11px] [&amp;_strong]:block [&amp;_strong]:[margin:4px_0] [&amp;_strong]:text-[14px]" href="#search/%23ChaoThangMoi">
<span class="trend-rank mt-[2px] text-[#b1a38d] text-[10px]">01</span>
<div>
<small class="text-xs">Xu hướng tại Việt Nam</small>
<strong>#ChaoThangMoi</strong>
<small class="text-xs">18,2K bài đăng</small>
</div>
<span aria-hidden="true">↗</span>
</a>
</section>
<section class="side-card mt-[23px] overflow-hidden [border:1.5px_solid_var(--color-edge)] rounded-[18px] bg-card shadow-[4px_4px_0_var(--color-shadow)]">
<h2 class="font-bold side-title flex items-center justify-between m-0 [padding:18px_17px] font-serif text-[19px] tracking-[-.5px]">Có thể bạn biết</h2>
<div class="suggestion [&amp;_small]:text-muted [&amp;_small]:text-[11px] grid grid-cols-[33px_minmax(0,_1fr)_auto] items-center gap-[8px] [padding:13px_14px] [border-top:1px_solid_var(--color-line)] [&amp;_.avatar]:w-[33px] [&amp;_.avatar]:h-[33px] [&amp;_.avatar]:text-[16px] [&amp;_strong]:block [&amp;_strong]:overflow-hidden [&amp;_strong]:text-ellipsis [&amp;_strong]:whitespace-nowrap [&amp;_strong]:text-[12px] [&amp;_.verified]:w-[11px] [&amp;_.verified]:h-[11px] [&amp;_.verified]:text-[8px] max-[1130px]:px-[10px] max-[1130px]:gap-[6px]">
<span aria-hidden="true" class="avatar inline-grid flex-none place-items-center w-[42px] h-[42px] overflow-hidden [border:1.5px_solid_var(--color-edge)] rounded-full bg-[#427dbb] text-white font-serif text-[20px] font-black [&amp;.orange]:bg-accent [&amp;.orange]:text-[#24221f] [&amp;.green]:bg-[#288064] [&amp;.yellow]:bg-[#efcc62] [&amp;.yellow]:text-[#24221f] [&amp;.black]:bg-[#24221f] orange ">M</span>
<div>
<strong title="Mê Việt Nam">Mê Việt Nam <span class="verified inline-grid align-middle shrink-0 place-items-center w-[13px] h-[13px] rounded-full bg-blue text-card text-[9px]" aria-label="Đã xác minh">✓</span>
</strong>
<small class="text-xs">@mevietnam</small>
</div>
<button class="[font-family:inherit] follow inline-flex items-center justify-center min-h-[40px] [padding:7px_11px] [border:1.5px_solid_var(--color-edge)] rounded-[100px] bg-transparent text-[12px] font-bold whitespace-nowrap [&amp;:hover]:bg-[light-dark(#eee7dc,_#393229)] [&amp;.following]:bg-ink [&amp;.following]:text-card [&amp;_svg]:w-[15px] [&amp;_svg]:h-[15px] " aria-label="Theo dõi Mê Việt Nam" aria-pressed="false">Theo dõi</button>
</div>
<a class="side-more flex justify-between [border-top:1px_solid_var(--color-line)] [padding:13px_17px] text-blue text-[11px]" href="#search">Khám phá thêm <span aria-hidden="true">↗</span>
</a>
</section>
<p class="side-footer [margin:25px_8px] text-muted text-[11px] leading-[1.9]">© 2026 Postr. Tin tức theo cách của bạn.</p>
</aside>
</div>
<nav class="mobile-nav hidden max-[600px]:fixed max-[600px]:z-[10] max-[600px]:[inset:auto_0_0] max-[600px]:grid max-[600px]:grid-cols-[repeat(6,_1fr)] max-[600px]:[padding:8px_4px_max(8px,_env(safe-area-inset-bottom))] max-[600px]:[border-top:1px_solid_var(--color-edge)] max-[600px]:bg-[light-dark(#f8f3eaf5,_#1b1917f5)] max-[600px]:[backdrop-filter:blur(16px)] max-[600px]:[&amp;_a]:flex max-[600px]:[&amp;_a]:min-w-0 max-[600px]:[&amp;_a]:flex-col max-[600px]:[&amp;_a]:items-center max-[600px]:[&amp;_a]:justify-center max-[600px]:[&amp;_a]:gap-[6px] max-[600px]:[&amp;_a]:min-h-[43px] max-[600px]:[&amp;_a]:text-muted max-[600px]:[&amp;_a_&gt;_span:last-child]:text-[10px] max-[600px]:[&amp;_a_&gt;_span:last-child]:whitespace-nowrap max-[600px]:[&amp;_a.active]:text-[light-dark(#b94221,_#ff936e)] max-[600px]:[&amp;_a.active]:font-bold" aria-label="Điều hướng di động">
<a class="active" href="#home" aria-label="Trang chủ" aria-current="page">
<span class="nav-icon relative flex">
<svg class="size-[21px] shrink-0 fill-none stroke-current [stroke-width:1.7]" aria-hidden="true" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round">
<path d="m3 11 9-8 9 8v9a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1z">
</path>
</svg>
</span>
<span>Trang chủ</span>
</a>
<a class="" href="#search" aria-label="Khám phá">
<span class="nav-icon relative flex">
<svg class="size-[21px] shrink-0 fill-none stroke-current [stroke-width:1.7]" aria-hidden="true" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round">
<circle cx="11" cy="11" r="7">
</circle>
<path d="m20 20-4-4">
</path>
</svg>
</span>
<span>Khám phá</span>
</a>
<a class="" href="#bell" aria-label="Thông báo">
<span class="nav-icon relative flex">
<svg class="size-[21px] shrink-0 fill-none stroke-current [stroke-width:1.7]" aria-hidden="true" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round">
<path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4">
</path>
</svg>
<i class="notification-dot absolute top-0 right-[-1px] h-[7px] w-[7px] bg-accent [border:1px_solid_var(--color-paper)] rounded-full">
</i>
</span>
<span>Thông báo</span>
</a>
<a class="" href="#mail" aria-label="Tin nhắn">
<span class="nav-icon relative flex">
<svg class="size-[21px] shrink-0 fill-none stroke-current [stroke-width:1.7]" aria-hidden="true" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round">
<rect x="3" y="5" width="18" height="14" rx="2">
</rect>
<path d="m3 7 9 6 9-6">
</path>
</svg>
</span>
<span>Tin nhắn</span>
</a>
<a class="" href="#bookmark" aria-label="Đã lưu">
<span class="nav-icon relative flex">
<svg class="size-[21px] shrink-0 fill-none stroke-current [stroke-width:1.7]" aria-hidden="true" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round">
<path d="M6 3h12v18l-6-4-6 4z">
</path>
</svg>
</span>
<span>Đã lưu</span>
</a>
<a class="" href="#user" aria-label="Hồ sơ">
<span class="nav-icon relative flex">
<svg class="size-[21px] shrink-0 fill-none stroke-current [stroke-width:1.7]" aria-hidden="true" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round">
<circle cx="12" cy="8" r="4">
</circle>
<path d="M4 21a8 8 0 0 1 16 0">
</path>
</svg>
</span>
<span>Hồ sơ</span>
</a>
</nav>`,
home: `
<div class="tabs grid grid-cols-[1fr_1fr] [border-bottom:1px_solid_var(--color-line)]" aria-label="Bộ lọc bảng tin">
<button class="[font-family:inherit] tab relative [padding:18px_8px] min-h-[52px] [border:0] bg-transparent text-muted font-bold text-[13px] [&amp;:hover]:bg-[#e8dfd140] [&amp;.active]:text-ink [&amp;.active::after]:absolute [&amp;.active::after]:bottom-[-1px] [&amp;.active::after]:left-[50%] [&amp;.active::after]:w-[64px] [&amp;.active::after]:h-[3px] [&amp;.active::after]:rounded-[3px] [&amp;.active::after]:bg-accent [&amp;.active::after]:content-[&#x27;&#x27;] [&amp;.active::after]:[transform:translateX(-50%)] max-[600px]:[padding:16px_8px] active" aria-pressed="true">Dành cho bạn<span class="tab-spark text-[light-dark(#cd552f,_#ff936e)]" aria-hidden="true"> ✳</span>
</button>
<button class="[font-family:inherit] tab relative [padding:18px_8px] min-h-[52px] [border:0] bg-transparent text-muted font-bold text-[13px] [&amp;:hover]:bg-[#e8dfd140] [&amp;.active]:text-ink [&amp;.active::after]:absolute [&amp;.active::after]:bottom-[-1px] [&amp;.active::after]:left-[50%] [&amp;.active::after]:w-[64px] [&amp;.active::after]:h-[3px] [&amp;.active::after]:rounded-[3px] [&amp;.active::after]:bg-accent [&amp;.active::after]:content-[&#x27;&#x27;] [&amp;.active::after]:[transform:translateX(-50%)] max-[600px]:[padding:16px_8px] " aria-pressed="false">Đang theo dõi</button>
</div>
<div class="feed-intro relative [padding:20px_24px_0] [&amp;_&gt;_span]:flex [&amp;_&gt;_span]:items-center [&amp;_&gt;_span]:gap-[7px] [&amp;_&gt;_span]:text-[8px] [&amp;_&gt;_span]:tracking-[1.1px] [&amp;_&gt;_span]:text-muted [&amp;_p]:[margin:7px_0_0] [&amp;_p]:font-serif [&amp;_p]:text-[18px] [&amp;_&gt;_svg]:absolute [&amp;_&gt;_svg]:right-[24px] [&amp;_&gt;_svg]:top-[29px] [&amp;_&gt;_svg]:text-[#aba08f] max-[600px]:hidden">
<span>
<span class="live-dot inline-block shrink-0 w-[6px] h-[6px] rounded-full bg-green">
</span> BẢNG TIN CỦA BẠN</span>
<p class="[margin:1em_0]">Những câu chuyện đáng dừng lại.</p>
<svg class="size-[21px] shrink-0 fill-none stroke-current [stroke-width:1.7]" aria-hidden="true" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round">
<circle cx="12" cy="12" r="9">
</circle>
<ellipse cx="12" cy="12" rx="4" ry="9">
</ellipse>
<path d="M3 12h18">
</path>
</svg>
</div>__COMPOSER____POSTS__`,
search: `
<section class="explore-header [padding:28px_24px] [&amp;_h2]:[margin:10px_0_24px] [&amp;_h2]:font-serif [&amp;_h2]:text-[33px] [&amp;_h2]:tracking-[-1px] max-[600px]:[padding:24px_18px]">
<p class="[margin:1em_0] eyebrow text-[10px] font-bold tracking-[1.6px]">CÓ GÌ MỚI NGOÀI KIA?</p>
<h2 class="[margin:.83em_0] font-bold">Mở rộng góc nhìn.</h2>
<label class="search flex items-center gap-[10px] min-h-[44px] [padding:10px_14px] [border:1.5px_solid_var(--color-edge)] rounded-[100px] bg-card shadow-[3px_3px_0_#efcc62] [&amp;:focus-within]:[outline:2px_solid_var(--color-muted)] [&amp;:focus-within]:[outline-offset:3px] [&amp;_input]:w-full [&amp;_input]:[border:0] [&amp;_input]:[outline:none] [&amp;_input]:bg-transparent [&amp;_input]:text-[12px] [&amp;_svg]:w-[17px] [&amp;_svg]:h-[17px] [&amp;_kbd]:[padding:1px_5px] [&amp;_kbd]:[border:1px_solid_var(--color-line)] [&amp;_kbd]:rounded-[4px] [&amp;_kbd]:text-muted max-[600px]:[&amp;_input]:text-[16px]">
<svg class="size-[21px] shrink-0 fill-none stroke-current [stroke-width:1.7]" aria-hidden="true" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round">
<circle cx="11" cy="11" r="7">
</circle>
<path d="m20 20-4-4">
</path>
</svg>
<input class="[font-family:inherit]" type="search" autoComplete="off" placeholder="Tìm câu chuyện, tên hoặc hashtag" aria-label="Tìm câu chuyện" value=""/>
</label>
</section>
<div class="topic-filters flex gap-[7px] overflow-x-auto [padding:0_24px_20px] [&amp;_button]:shrink-0 [&amp;_button]:min-h-[40px] [&amp;_button]:[padding:9px_13px] [&amp;_button]:[border:1px_solid_var(--color-line)] [&amp;_button]:rounded-[20px] [&amp;_button]:bg-transparent [&amp;_button]:text-[12px] [&amp;_button.selected]:bg-ink [&amp;_button.selected]:border-edge [&amp;_button.selected]:text-card max-[600px]:px-[18px]" aria-label="Chủ đề">
<button class="selected" aria-pressed="true">Tất cả</button>
<button class="" aria-pressed="false">Đời sống</button>
<button class="" aria-pressed="false">Công nghệ</button>
<button class="" aria-pressed="false">Thiết kế</button>
<button class="" aria-pressed="false">Âm nhạc</button>
<button class="" aria-pressed="false">Thể thao</button>
</div>
<div class="explore-trends grid grid-cols-[1fr_1fr] gap-[13px] [padding:0_24px_24px] [&amp;_button]:min-w-0 [&amp;_button]:[border:1.5px_solid_var(--color-edge)] [&amp;_button]:rounded-[14px] [&amp;_button]:[padding:19px_15px] [&amp;_button]:text-left [&amp;_button]:bg-[light-dark(#efcf8b,_#44351f)] [&amp;_button_+_button]:bg-[light-dark(#dce5d7,_#293b30)] [&amp;_span]:block [&amp;_span]:text-[8px] [&amp;_span]:tracking-[.8px] [&amp;_strong]:block [&amp;_strong]:[margin:21px_0_9px] [&amp;_strong]:font-serif [&amp;_strong]:text-[23px] [&amp;_strong]:[overflow-wrap:anywhere] [&amp;_small]:text-[10px] max-[600px]:px-[18px] max-[600px]:gap-[10px] max-[600px]:[&amp;_strong]:text-[21px]">
<button class="[font-family:inherit]">
<span>01 / ĐƯỢC QUAN TÂM</span>
<strong>#ChaoThangMoi</strong>
<small class="text-xs">18,2K bài đăng ↗</small>
</button>
</div>
<section class="people-section [padding:0_24px_24px] [&amp;_h3]:font-serif [&amp;_h3]:text-[19px] max-[600px]:px-[18px]">
<h3 class="[margin:1em_0] font-bold">Những người kể chuyện</h3>
<div class="people-grid grid grid-cols-[repeat(3,_minmax(0,_1fr))] gap-[10px] max-[600px]:flex max-[600px]:overflow-x-auto max-[600px]:pb-[4px]">
<div class="person-card flex flex-col items-center gap-[9px] [padding:17px_8px] [border:1px_solid_var(--color-line)] rounded-[13px] bg-card text-center [&amp;_strong]:text-[13px] [&amp;_small]:text-[11px] [&amp;_small]:text-muted [&amp;_.follow]:mt-auto max-[600px]:[flex:0_0_142px] max-[600px]:[&amp;_.follow]:px-[10px]">
<span aria-hidden="true" class="avatar inline-grid flex-none place-items-center w-[42px] h-[42px] overflow-hidden [border:1.5px_solid_var(--color-edge)] rounded-full bg-[#427dbb] text-white font-serif text-[20px] font-black [&amp;.orange]:bg-accent [&amp;.orange]:text-[#24221f] [&amp;.green]:bg-[#288064] [&amp;.yellow]:bg-[#efcc62] [&amp;.yellow]:text-[#24221f] [&amp;.black]:bg-[#24221f] orange ">M</span>
<strong>Mê Việt Nam</strong>
<small class="text-xs">@mevietnam</small>
<button class="[font-family:inherit] follow inline-flex items-center justify-center min-h-[40px] [padding:7px_11px] [border:1.5px_solid_var(--color-edge)] rounded-[100px] bg-transparent text-[12px] font-bold whitespace-nowrap [&amp;:hover]:bg-[light-dark(#eee7dc,_#393229)] [&amp;.following]:bg-ink [&amp;.following]:text-card [&amp;_svg]:w-[15px] [&amp;_svg]:h-[15px] " aria-pressed="false">Theo dõi</button>
</div>
</div>
</section>
<h3 class="section-label m-0 [padding:15px_24px] [border-block:1px_solid_var(--color-line)] text-[11px] font-bold [overflow-wrap:anywhere]">Câu chuyện nổi bật</h3>__POSTS__`,
bell: `
<div class="section-toolbar flex flex-wrap items-center justify-between gap-[10px] [padding:16px_24px] text-[12px] [&amp;_svg]:w-[15px] max-[600px]:[padding:14px_18px]">
<p class="[margin:1em_0] muted text-muted">Những kết nối mới, ngay tại đây.</p>
<button class="[font-family:inherit] text-button inline-flex items-center gap-[6px] p-0 min-h-[30px] [border:0] bg-transparent text-[11px] font-bold [&amp;:hover]:underline">
<svg class="size-[21px] shrink-0 fill-none stroke-current [stroke-width:1.7]" aria-hidden="true" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round">
<path d="m5 12 4 4L19 6">
</path>
</svg> Đánh dấu đã đọc</button>
</div>
<div class="tabs grid grid-cols-[1fr_1fr] [border-bottom:1px_solid_var(--color-line)]">
<button class="[font-family:inherit] tab relative [padding:18px_8px] min-h-[52px] [border:0] bg-transparent text-muted font-bold text-[13px] [&amp;:hover]:bg-[#e8dfd140] [&amp;.active]:text-ink [&amp;.active::after]:absolute [&amp;.active::after]:bottom-[-1px] [&amp;.active::after]:left-[50%] [&amp;.active::after]:w-[64px] [&amp;.active::after]:h-[3px] [&amp;.active::after]:rounded-[3px] [&amp;.active::after]:bg-accent [&amp;.active::after]:content-[&#x27;&#x27;] [&amp;.active::after]:[transform:translateX(-50%)] max-[600px]:[padding:16px_8px] active" aria-pressed="true">Tất cả</button>
<button class="[font-family:inherit] tab relative [padding:18px_8px] min-h-[52px] [border:0] bg-transparent text-muted font-bold text-[13px] [&amp;:hover]:bg-[#e8dfd140] [&amp;.active]:text-ink [&amp;.active::after]:absolute [&amp;.active::after]:bottom-[-1px] [&amp;.active::after]:left-[50%] [&amp;.active::after]:w-[64px] [&amp;.active::after]:h-[3px] [&amp;.active::after]:rounded-[3px] [&amp;.active::after]:bg-accent [&amp;.active::after]:content-[&#x27;&#x27;] [&amp;.active::after]:[transform:translateX(-50%)] max-[600px]:[padding:16px_8px] " aria-pressed="false">Lượt nhắc đến</button>
</div>
<p class="section-label m-0 [padding:15px_24px] [border-block:1px_solid_var(--color-line)] text-[11px] font-bold [overflow-wrap:anywhere]">HÔM NAY <span class="muted text-muted">· Thông báo minh họa</span>
</p>
<a class="notification flex items-start gap-[16px] p-[24px] [border-bottom:1px_solid_var(--color-line)] text-[14px] leading-[1.6] [&amp;.unread]:bg-[#eddbb422] [&amp;:hover]:bg-[#eddbb444] [&amp;_&gt;_div]:flex-1 [&amp;_&gt;_.live-dot]:mt-[10px] [&amp;_&gt;_.live-dot]:bg-accent [&amp;_.avatar]:w-[34px] [&amp;_.avatar]:h-[34px] [&amp;_.avatar]:text-[17px] [&amp;_blockquote]:[margin:10px_0] [&amp;_blockquote]:pl-[13px] [&amp;_blockquote]:[border-left:2px_solid_#d1b887] [&amp;_blockquote]:text-muted [&amp;_small]:text-muted [&amp;_small]:text-[12px] max-[600px]:[padding:22px_18px] max-[600px]:gap-[12px] unread" href="#post/3">
<span class="notification-type [&amp;.heart]:text-[light-dark(#bd3350,_#ff8da5)] [&amp;.comment]:text-blue [&amp;.repost]:text-green heart">
<svg class="size-[21px] shrink-0 fill-none stroke-current [stroke-width:1.7]" aria-hidden="true" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round">
<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8z">
</path>
</svg>
</span>
<div>
<span aria-hidden="true" class="avatar inline-grid flex-none place-items-center w-[42px] h-[42px] overflow-hidden [border:1.5px_solid_var(--color-edge)] rounded-full bg-[#427dbb] text-white font-serif text-[20px] font-black [&amp;.orange]:bg-accent [&amp;.orange]:text-[#24221f] [&amp;.green]:bg-[#288064] [&amp;.yellow]:bg-[#efcc62] [&amp;.yellow]:text-[#24221f] [&amp;.black]:bg-[#24221f] green ">L</span>
<p class="[margin:1em_0]">
<strong>Linh Trần</strong> thích câu chuyện bạn chia sẻ.</p>
<blockquote>Một lời nhắc nhỏ cho hôm nay.</blockquote>
<small class="text-xs">5 phút trước</small>
</div>
<span class="live-dot inline-block shrink-0 w-[6px] h-[6px] rounded-full bg-green">
</span>
</a>
<p class="feed-end m-0 [padding:32px_20px] text-muted text-center text-[11px] leading-[1.9] [&amp;_span]:text-muted [&amp;_span]:text-[12px]">Bạn đã xem hết thông báo.</p>`,
mail: `
<div class="inbox-intro [padding:28px_24px] [&amp;_h2]:[margin:10px_0_24px] [&amp;_h2]:font-serif [&amp;_h2]:text-[33px] [&amp;_h2]:tracking-[-1px] max-[600px]:[padding:24px_18px]">
<p class="[margin:1em_0] eyebrow text-[10px] font-bold tracking-[1.6px]">MỘT LỜI CHÀO, NHIỀU CÂU CHUYỆN.</p>
<h2 class="[margin:.83em_0] font-bold">Hộp thư của bạn.</h2>
<label class="search flex items-center gap-[10px] min-h-[44px] [padding:10px_14px] [border:1.5px_solid_var(--color-edge)] rounded-[100px] bg-card shadow-[3px_3px_0_#efcc62] [&amp;:focus-within]:[outline:2px_solid_var(--color-muted)] [&amp;:focus-within]:[outline-offset:3px] [&amp;_input]:w-full [&amp;_input]:[border:0] [&amp;_input]:[outline:none] [&amp;_input]:bg-transparent [&amp;_input]:text-[12px] [&amp;_svg]:w-[17px] [&amp;_svg]:h-[17px] [&amp;_kbd]:[padding:1px_5px] [&amp;_kbd]:[border:1px_solid_var(--color-line)] [&amp;_kbd]:rounded-[4px] [&amp;_kbd]:text-muted max-[600px]:[&amp;_input]:text-[16px]">
<svg class="size-[21px] shrink-0 fill-none stroke-current [stroke-width:1.7]" aria-hidden="true" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round">
<circle cx="11" cy="11" r="7">
</circle>
<path d="m20 20-4-4">
</path>
</svg>
<input class="[font-family:inherit]" type="search" aria-label="Tìm cuộc trò chuyện" placeholder="Tìm cuộc trò chuyện" value=""/>
</label>
</div>
<button class="[font-family:inherit] thread w-full flex items-center gap-[14px] [padding:23px_24px] [border:0] [border-top:1px_solid_var(--color-line)] bg-transparent text-left [&amp;:hover]:bg-[#eddbb433] [&amp;_&gt;_div]:min-w-0 [&amp;_&gt;_div]:flex-1 [&amp;_strong]:text-[14px] [&amp;_p]:overflow-hidden [&amp;_p]:text-ellipsis [&amp;_p]:whitespace-nowrap [&amp;_p]:text-[14px] [&amp;_p]:text-muted [&amp;_small]:text-[12px] [&amp;_small]:text-muted">
<span aria-hidden="true" class="avatar inline-grid flex-none place-items-center w-[42px] h-[42px] overflow-hidden [border:1.5px_solid_var(--color-edge)] rounded-full bg-[#427dbb] text-white font-serif text-[20px] font-black [&amp;.orange]:bg-accent [&amp;.orange]:text-[#24221f] [&amp;.green]:bg-[#288064] [&amp;.yellow]:bg-[#efcc62] [&amp;.yellow]:text-[#24221f] [&amp;.black]:bg-[#24221f] orange ">M</span>
<div>
<strong>Mê Việt Nam</strong>
<p class="[margin:1em_0]">__MESSAGE__</p>
<small class="text-xs">@mevietnam</small>
</div>
<span aria-hidden="true">↗</span>
</button>
<p class="[margin:1em_0] demo-note m-[18px] text-center text-muted text-[10px] leading-[1.7]">Tin nhắn chỉ hiển thị với người tham gia cuộc trò chuyện.</p>`,
user: `
<div class="profile-cover flex items-center justify-between h-[165px] overflow-hidden p-[24px] [background:repeating-linear-gradient(-35deg,_transparent_0_25px,_#b4812c12_25px_26px),_light-dark(#eedcae,_#393122)] [&amp;_&gt;_span:first-child]:font-serif [&amp;_&gt;_span:first-child]:text-[28px] [&amp;_&gt;_span:first-child]:italic [&amp;_&gt;_span:first-child]:tracking-[-1px] [&amp;_&gt;_span:last-child]:text-[180px] [&amp;_&gt;_span:last-child]:leading-[1] [&amp;_&gt;_span:last-child]:text-accent [&amp;_&gt;_span:last-child]:[transform:rotate(10deg)] max-[600px]:h-[148px] max-[600px]:p-[18px] max-[600px]:[&amp;_&gt;_span:first-child]:text-[24px] max-[600px]:[&amp;_&gt;_span:last-child]:text-[150px]">
<span>Ở đây, mình là mình.</span>
<span aria-hidden="true">✳</span>
</div>
<section class="profile-details [padding:0_24px_24px] [&amp;_h2]:[margin:20px_0_5px] [&amp;_h2]:font-serif [&amp;_h2]:text-[27px] [&amp;_h2]:[overflow-wrap:anywhere] [&amp;_&gt;_.muted]:text-[12px] [&amp;_&gt;_.muted]:m-0 max-[600px]:px-[18px]">
<div class="profile-top flex justify-between items-end mt-[-34px] relative [&amp;_.follow]:mb-[5px] [&amp;_.follow]:bg-card">
<span aria-hidden="true" class="avatar inline-grid flex-none place-items-center w-[42px] h-[42px] overflow-hidden [border:1.5px_solid_var(--color-edge)] rounded-full bg-[#427dbb] text-white font-serif text-[20px] font-black [&amp;.orange]:bg-accent [&amp;.orange]:text-[#24221f] [&amp;.green]:bg-[#288064] [&amp;.yellow]:bg-[#efcc62] [&amp;.yellow]:text-[#24221f] [&amp;.black]:bg-[#24221f]  avatar-large [&amp;.avatar-large]:w-[80px] [&amp;.avatar-large]:h-[80px] [&amp;.avatar-large]:[border:5px_solid_var(--color-card)] [&amp;.avatar-large]:shadow-[0_0_0_1px_var(--color-line)] [&amp;.avatar-large]:text-[37px]">__INITIAL__</span>
<button class="[font-family:inherit] follow inline-flex items-center justify-center min-h-[40px] [padding:7px_11px] [border:1.5px_solid_var(--color-edge)] rounded-[100px] bg-transparent text-[12px] font-bold whitespace-nowrap [&amp;:hover]:bg-[light-dark(#eee7dc,_#393229)] [&amp;.following]:bg-ink [&amp;.following]:text-card [&amp;_svg]:w-[15px] [&amp;_svg]:h-[15px]">Chỉnh sửa hồ sơ</button>
</div>
<h2 class="[margin:.83em_0] font-bold">__NAME__</h2>
<p class="[margin:1em_0] muted text-muted">__HANDLE__</p>
<p class="[margin:1em_0] profile-bio text-[13px] leading-[1.7] whitespace-pre-wrap [overflow-wrap:anywhere]">__BIO__</p>
<p class="[margin:1em_0] profile-location flex items-center flex-wrap gap-[7px] text-[11px] text-muted [overflow-wrap:anywhere] [&amp;_svg]:w-[14px] [&amp;_svg]:h-[14px] [&amp;_&gt;_span]:ml-[7px]">
<svg class="size-[21px] shrink-0 fill-none stroke-current [stroke-width:1.7]" aria-hidden="true" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round">
<path d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 0 1 14 0Z">
</path>
<circle cx="12" cy="10" r="2">
</circle>
</svg>__LOCATION__<span>Tham gia tháng 10, 2026</span>
</p>
<div class="profile-stats flex flex-wrap gap-[17px] mt-[22px] text-[11px] text-muted [&amp;_strong]:text-ink">
<span>
<strong>__COUNT__</strong> bài đăng</span>
<span>
<strong>__FOLLOWING__</strong> đang theo dõi</span>
<span>
<strong>__LIKED__</strong> lượt thích đã gửi</span>
</div>
</section>
<div class="tabs grid grid-cols-[1fr_1fr] [border-bottom:1px_solid_var(--color-line)]">
<button class="[font-family:inherit] tab relative [padding:18px_8px] min-h-[52px] [border:0] bg-transparent text-muted font-bold text-[13px] [&amp;:hover]:bg-[#e8dfd140] [&amp;.active]:text-ink [&amp;.active::after]:absolute [&amp;.active::after]:bottom-[-1px] [&amp;.active::after]:left-[50%] [&amp;.active::after]:w-[64px] [&amp;.active::after]:h-[3px] [&amp;.active::after]:rounded-[3px] [&amp;.active::after]:bg-accent [&amp;.active::after]:content-[&#x27;&#x27;] [&amp;.active::after]:[transform:translateX(-50%)] max-[600px]:[padding:16px_8px] active" aria-pressed="true">Bài đăng</button>
<button class="[font-family:inherit] tab relative [padding:18px_8px] min-h-[52px] [border:0] bg-transparent text-muted font-bold text-[13px] [&amp;:hover]:bg-[#e8dfd140] [&amp;.active]:text-ink [&amp;.active::after]:absolute [&amp;.active::after]:bottom-[-1px] [&amp;.active::after]:left-[50%] [&amp;.active::after]:w-[64px] [&amp;.active::after]:h-[3px] [&amp;.active::after]:rounded-[3px] [&amp;.active::after]:bg-accent [&amp;.active::after]:content-[&#x27;&#x27;] [&amp;.active::after]:[transform:translateX(-50%)] max-[600px]:[padding:16px_8px] " aria-pressed="false">Đã thích</button>
</div>__POSTS__<dialog class="modal [width:min(550px,_calc(100%_-_28px))] [max-height:calc(100dvh_-_40px)] p-0 overflow-y-auto [border:1.5px_solid_var(--color-edge)] rounded-[20px] bg-card shadow-[8px_8px_0_light-dark(#24221f40,_#00000066)] text-ink [&amp;::backdrop]:bg-[light-dark(#24221f66,_#00000099)] [&amp;::backdrop]:[backdrop-filter:blur(4px)] [&amp;_.composer]:[border:0] max-[600px]:[&amp;_.composer]:[padding:18px_14px]" aria-labelledby="edit-profile-title">
<div class="modal-heading flex justify-between items-center [padding:17px_22px] [border-bottom:1px_solid_var(--color-line)] [&amp;_h2]:m-0 [&amp;_h2]:font-serif [&amp;_h2]:text-[22px] max-[600px]:p-[16px] max-[600px]:[&amp;_h2]:text-[20px]">
<h2 class="[margin:.83em_0] font-bold" id="edit-profile-title">Chỉnh sửa hồ sơ</h2>
<button class="[font-family:inherit] icon-button inline-grid place-items-center [border:0] bg-transparent rounded-full shrink-0 w-[44px] h-[44px] text-blue [&amp;:hover]:bg-[light-dark(#2466c20d,_#86b6f612)]" aria-label="Đóng chỉnh sửa hồ sơ">
<svg class="size-[21px] shrink-0 fill-none stroke-current [stroke-width:1.7]" aria-hidden="true" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round">
<path d="m6 6 12 12M6 18 18 6">
</path>
</svg>
</button>
</div>
<form class="profile-form grid gap-[20px] p-[24px] [&amp;_label]:grid [&amp;_label]:gap-[8px] [&amp;_label]:text-[12px] [&amp;_label]:font-bold [&amp;_input]:p-[12px] [&amp;_input]:[border:1px_solid_var(--color-line)] [&amp;_input]:rounded-[9px] [&amp;_input]:bg-paper [&amp;_input]:text-[14px] [&amp;_textarea]:p-[12px] [&amp;_textarea]:[border:1px_solid_var(--color-line)] [&amp;_textarea]:rounded-[9px] [&amp;_textarea]:bg-paper [&amp;_textarea]:text-[14px] [&amp;_.post-button]:w-fit max-[600px]:[&amp;_input]:text-[16px] max-[600px]:[&amp;_textarea]:text-[16px]">
<label>Tên hiển thị<input class="[font-family:inherit]" required="" maxLength="50" name="name" value="__NAME__"/>
</label>
<label>Giới thiệu<textarea class="w-full min-h-[66px] resize-y border-0 bg-transparent text-[16px] leading-[1.6] placeholder:text-[light-dark(#8b8780,#a99f92)] [font-family:inherit]" name="bio" maxLength="160">__BIO__</textarea>
</label>
<label>Vị trí<input class="[font-family:inherit]" maxLength="80" name="location" value="__LOCATION__"/>
</label>
<button class="[font-family:inherit] post-button inline-flex items-center justify-center ml-auto min-h-[44px] [padding:8px_21px] [border:1.5px_solid_var(--color-edge)] rounded-[100px] bg-accent text-[#24221f] text-[14px] font-bold [&amp;:hover:not(:disabled)]:bg-[#ff906a]">Lưu thay đổi</button>
</form>
</dialog>`,
composer: `
<form class="composer grid grid-cols-[42px_minmax(0,_1fr)] gap-[13px] p-[24px] [border-bottom:7px_solid_var(--color-paper)] [&amp;_textarea]:resize-none [&amp;_textarea]:[padding:8px_0] max-[600px]:[padding:20px_16px] max-[600px]:grid-cols-[34px_minmax(0,_1fr)] max-[600px]:gap-[10px] max-[600px]:py-[16px] max-[600px]:[&amp;_textarea]:min-h-[52px] max-[600px]:[&amp;_.icon-button]:w-[40px] max-[600px]:[&amp;_.post-button]:px-[16px] max-[600px]:[&amp;_&gt;_.avatar]:w-[34px] max-[600px]:[&amp;_&gt;_.avatar]:h-[34px] max-[600px]:[&amp;_&gt;_.avatar]:text-[17px]" aria-label="Tạo bài đăng">
<span aria-hidden="true" class="avatar inline-grid flex-none place-items-center w-[42px] h-[42px] overflow-hidden [border:1.5px_solid_var(--color-edge)] rounded-full bg-[#427dbb] text-white font-serif text-[20px] font-black [&amp;.orange]:bg-accent [&amp;.orange]:text-[#24221f] [&amp;.green]:bg-[#288064] [&amp;.yellow]:bg-[#efcc62] [&amp;.yellow]:text-[#24221f] [&amp;.black]:bg-[#24221f]  ">__INITIAL__</span>
<div>
<label class="sr-only" for="_R_0_">Nội dung bài đăng</label>
<textarea class="w-full min-h-[66px] resize-y border-0 bg-transparent text-[16px] leading-[1.6] placeholder:text-[light-dark(#8b8780,#a99f92)] [font-family:inherit]" id="_R_0_" maxLength="280" placeholder="Có chuyện gì mới?">
</textarea>
<div class="audience flex items-center gap-[5px] [margin:4px_0_12px] text-blue text-[12px] [&amp;_svg]:w-[13px] [&amp;_svg]:h-[13px]">
<svg class="size-[21px] shrink-0 fill-none stroke-current [stroke-width:1.7]" aria-hidden="true" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round">
<circle cx="12" cy="12" r="9">
</circle>
<ellipse cx="12" cy="12" rx="4" ry="9">
</ellipse>
<path d="M3 12h18">
</path>
</svg> Bài viết công khai</div>
<input type="file" class="[font-family:inherit] sr-only" tabindex="-1" accept="image/jpeg,image/png,image/webp,image/gif" aria-label="Chọn ảnh đính kèm"/>
<div class="composer-tools flex items-center gap-[3px] pt-[10px] [border-top:1px_solid_var(--color-line)] [&amp;_small]:ml-[6px] [&amp;_small]:text-muted [&amp;_small]:text-[12px] [&amp;_.limit]:text-[light-dark(#b33d2b,_#ff9785)] [&amp;_.limit]:text-[12px]">
<button class="[font-family:inherit] icon-button inline-grid place-items-center [border:0] bg-transparent rounded-full shrink-0 w-[44px] h-[44px] text-blue [&amp;:hover]:bg-[light-dark(#2466c20d,_#86b6f612)]" type="button" aria-label="Thêm ảnh">
<svg class="size-[21px] shrink-0 fill-none stroke-current [stroke-width:1.7]" aria-hidden="true" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round">
<rect x="3" y="4" width="18" height="16" rx="2">
</rect>
<circle cx="9" cy="10" r="2">
</circle>
<path d="m21 15-5-5L5 20">
</path>
</svg>
</button>
<button class="[font-family:inherit] icon-button inline-grid place-items-center [border:0] bg-transparent rounded-full shrink-0 w-[44px] h-[44px] text-blue [&amp;:hover]:bg-[light-dark(#2466c20d,_#86b6f612)]" type="button" aria-label="Thêm biểu cảm" aria-expanded="false">
<svg class="size-[21px] shrink-0 fill-none stroke-current [stroke-width:1.7]" aria-hidden="true" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round">
<circle cx="12" cy="12" r="9">
</circle>
<path d="M8 14s1.5 2 4 2 4-2 4-2M9 9h.01M15 9h.01">
</path>
</svg>
</button>
<small class="">0/280</small>
<button class="[font-family:inherit] post-button inline-flex items-center justify-center ml-auto min-h-[44px] [padding:8px_21px] [border:1.5px_solid_var(--color-edge)] rounded-[100px] bg-accent text-[#24221f] text-[14px] font-bold [&amp;:hover:not(:disabled)]:bg-[#ff906a]" disabled="">Đăng</button>
</div>
</div>
</form>`,
post: `
<article class="post grid grid-cols-[42px_minmax(0,_1fr)] gap-[12px] p-[23px] [border-bottom:1px_solid_var(--color-line)] animate-reveal [&amp;:nth-child(2)]:[animation-delay:50ms] [&amp;:nth-child(3)]:[animation-delay:100ms] max-[600px]:[padding:20px_16px] max-[600px]:grid-cols-[34px_minmax(0,_1fr)] max-[600px]:gap-[10px] max-[600px]:[&amp;_&gt;_.avatar]:w-[34px] max-[600px]:[&amp;_&gt;_.avatar]:h-[34px] max-[600px]:[&amp;_&gt;_.avatar]:text-[17px]" id="post-999999">
<span aria-hidden="true" class="avatar inline-grid flex-none place-items-center w-[42px] h-[42px] overflow-hidden [border:1.5px_solid_var(--color-edge)] rounded-full bg-[#427dbb] text-white font-serif text-[20px] font-black [&amp;.orange]:bg-accent [&amp;.orange]:text-[#24221f] [&amp;.green]:bg-[#288064] [&amp;.yellow]:bg-[#efcc62] [&amp;.yellow]:text-[#24221f] [&amp;.black]:bg-[#24221f]  ">__INITIAL__</span>
<div>
<div class="post-head flex items-center flex-wrap gap-[5px] min-w-0 text-muted text-[12px] max-[600px]:text-[12px]">
<span class="post-name text-ink font-bold text-[14px] [overflow-wrap:anywhere] max-[600px]:text-[14px]">__NAME__</span>
<span class="handle overflow-hidden text-ellipsis whitespace-nowrap max-w-[140px] max-[600px]:max-w-[97px]">__HANDLE__</span>
<a class="post-time inline-flex items-center min-h-[24px] ml-auto text-[12px] whitespace-nowrap [&amp;:hover]:underline max-[600px]:text-[11px]" href="#post/999999" aria-label="Mở bài đăng của __NAME__">· __TIME__</a>
</div>
<p class="post-copy [margin:9px_0_13px] text-[15px] leading-[1.7] whitespace-pre-wrap [overflow-wrap:anywhere] max-[600px]:text-[15px]">__COPY__</p>
<div class="quote-card relative overflow-hidden p-[22px] [border:1.5px_solid_var(--color-edge)] rounded-[15px] bg-[light-dark(#f2d780,_#443922)] [&amp;_small]:text-[9px] [&amp;_small]:tracking-[1.5px] [&amp;_p]:relative [&amp;_p]:z-[1] [&amp;_p]:[margin:20px_0] [&amp;_p]:font-serif [&amp;_p]:text-[22px] [&amp;_p]:leading-[1.4] [&amp;_&gt;_span]:absolute [&amp;_&gt;_span]:bottom-[-45px] [&amp;_&gt;_span]:right-[-20px] [&amp;_&gt;_span]:text-[170px] [&amp;_&gt;_span]:text-[#c9a44c50] max-[600px]:p-[18px] max-[600px]:[&amp;_p]:text-[21px]">
<small class="text-xs">POSTR NOTE 999999</small>
<p class="[margin:1em_0]">__QUOTE__</p>
<span aria-hidden="true">✳</span>
</div>
<div class="actions flex items-center justify-between gap-[3px] mt-[10px] text-muted">
<button class="[font-family:inherit] action inline-grid place-items-center [border:0] bg-transparent rounded-[20px] grid-flow-col gap-[6px] min-w-[34px] min-h-[44px] p-[6px] text-[12px] [&amp;_svg]:w-[19px] [&amp;_svg]:h-[19px] [&amp;:hover]:text-blue [&amp;:hover]:bg-[light-dark(#2466c20a,_#86b6f610)] [&amp;.liked]:text-[light-dark(#bd3350,_#ff8da5)] [&amp;.liked_svg]:[fill:light-dark(#bd335020,_#ff8da520)] [&amp;.saved]:text-blue [&amp;.reposted]:text-green max-[600px]:gap-[4px] max-[600px]:[padding:5px_3px] max-[600px]:text-[11px] max-[600px]:[&amp;_svg]:w-[18px] max-[600px]:[&amp;_svg]:h-[18px] " aria-label="Bình luận" aria-expanded="false">
<svg class="size-[21px] shrink-0 fill-none stroke-current [stroke-width:1.7]" aria-hidden="true" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round">
<path d="M21 12a8 8 0 0 1-9 8 9 9 0 0 1-4-1l-5 2 2-5a9 9 0 1 1 16-4z">
</path>
</svg>
<span>0</span>
</button>
<button class="[font-family:inherit] action inline-grid place-items-center [border:0] bg-transparent rounded-[20px] grid-flow-col gap-[6px] min-w-[34px] min-h-[44px] p-[6px] text-[12px] [&amp;_svg]:w-[19px] [&amp;_svg]:h-[19px] [&amp;:hover]:text-blue [&amp;:hover]:bg-[light-dark(#2466c20a,_#86b6f610)] [&amp;.liked]:text-[light-dark(#bd3350,_#ff8da5)] [&amp;.liked_svg]:[fill:light-dark(#bd335020,_#ff8da520)] [&amp;.saved]:text-blue [&amp;.reposted]:text-green max-[600px]:gap-[4px] max-[600px]:[padding:5px_3px] max-[600px]:text-[11px] max-[600px]:[&amp;_svg]:w-[18px] max-[600px]:[&amp;_svg]:h-[18px] " aria-label="Đăng lại" aria-pressed="false">
<svg class="size-[21px] shrink-0 fill-none stroke-current [stroke-width:1.7]" aria-hidden="true" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round">
<path d="m17 2 4 4-4 4M3 11V9a3 3 0 0 1 3-3h15M7 22l-4-4 4-4m14-1v2a3 3 0 0 1-3 3H3">
</path>
</svg>
<span>0</span>
</button>
<button class="[font-family:inherit] action inline-grid place-items-center [border:0] bg-transparent rounded-[20px] grid-flow-col gap-[6px] min-w-[34px] min-h-[44px] p-[6px] text-[12px] [&amp;_svg]:w-[19px] [&amp;_svg]:h-[19px] [&amp;:hover]:text-blue [&amp;:hover]:bg-[light-dark(#2466c20a,_#86b6f610)] [&amp;.liked]:text-[light-dark(#bd3350,_#ff8da5)] [&amp;.liked_svg]:[fill:light-dark(#bd335020,_#ff8da520)] [&amp;.saved]:text-blue [&amp;.reposted]:text-green max-[600px]:gap-[4px] max-[600px]:[padding:5px_3px] max-[600px]:text-[11px] max-[600px]:[&amp;_svg]:w-[18px] max-[600px]:[&amp;_svg]:h-[18px] " aria-label="Thích" aria-pressed="false">
<svg class="size-[21px] shrink-0 fill-none stroke-current [stroke-width:1.7]" aria-hidden="true" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round">
<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8z">
</path>
</svg>
<span>0</span>
</button>
<button class="[font-family:inherit] action inline-grid place-items-center [border:0] bg-transparent rounded-[20px] grid-flow-col gap-[6px] min-w-[34px] min-h-[44px] p-[6px] text-[12px] [&amp;_svg]:w-[19px] [&amp;_svg]:h-[19px] [&amp;:hover]:text-blue [&amp;:hover]:bg-[light-dark(#2466c20a,_#86b6f610)] [&amp;.liked]:text-[light-dark(#bd3350,_#ff8da5)] [&amp;.liked_svg]:[fill:light-dark(#bd335020,_#ff8da520)] [&amp;.saved]:text-blue [&amp;.reposted]:text-green max-[600px]:gap-[4px] max-[600px]:[padding:5px_3px] max-[600px]:text-[11px] max-[600px]:[&amp;_svg]:w-[18px] max-[600px]:[&amp;_svg]:h-[18px] " aria-label="Lưu" aria-pressed="false">
<svg class="size-[21px] shrink-0 fill-none stroke-current [stroke-width:1.7]" aria-hidden="true" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round">
<path d="M6 3h12v18l-6-4-6 4z">
</path>
</svg>
</button>
<button class="[font-family:inherit] action inline-grid place-items-center [border:0] bg-transparent rounded-[20px] grid-flow-col gap-[6px] min-w-[34px] min-h-[44px] p-[6px] text-[12px] [&amp;_svg]:w-[19px] [&amp;_svg]:h-[19px] [&amp;:hover]:text-blue [&amp;:hover]:bg-[light-dark(#2466c20a,_#86b6f610)] [&amp;.liked]:text-[light-dark(#bd3350,_#ff8da5)] [&amp;.liked_svg]:[fill:light-dark(#bd335020,_#ff8da520)] [&amp;.saved]:text-blue [&amp;.reposted]:text-green max-[600px]:gap-[4px] max-[600px]:[padding:5px_3px] max-[600px]:text-[11px] max-[600px]:[&amp;_svg]:w-[18px] max-[600px]:[&amp;_svg]:h-[18px]" aria-label="Chia sẻ">
<svg class="size-[21px] shrink-0 fill-none stroke-current [stroke-width:1.7]" aria-hidden="true" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round">
<path d="M12 16V3m-5 5 5-5 5 5M5 12v8h14v-8">
</path>
</svg>
</button>
</div>
</div>
</article>`,
sun: `
<svg class="size-[21px] shrink-0 fill-none stroke-current [stroke-width:1.7]" aria-hidden="true" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round">
<circle cx="12" cy="12" r="4">
</circle>
<path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5">
</path>
</svg>`,
moon: `
<svg class="size-[21px] shrink-0 fill-none stroke-current [stroke-width:1.7]" aria-hidden="true" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round">
<path d="M20.5 13A9 9 0 0 1 11 3.5 9 9 0 1 0 20.5 13Z">
</path>
</svg>`
};
export const classes = {
  "avatar": "avatar inline-grid flex-none place-items-center w-[42px] h-[42px] overflow-hidden [border:1.5px_solid_var(--color-edge)] rounded-full bg-[#427dbb] text-white font-serif text-[20px] font-black [&.orange]:bg-accent [&.orange]:text-[#24221f] [&.green]:bg-[#288064] [&.yellow]:bg-[#efcc62] [&.yellow]:text-[#24221f] [&.black]:bg-[#24221f]",
  "toast": "toast fixed z-[20] left-[50%] bottom-[24px] flex items-center gap-[10px] w-[max-content] [max-width:calc(100%_-_28px)] rounded-[13px] bg-ink text-card text-[12px] [opacity:0] pointer-events-none [transform:translate(-50%,_10px)] [transition:opacity_.2s,_transform_.2s] [&.visible]:[padding:10px_14px] [&.visible]:[opacity:1] [&.visible]:[transform:translate(-50%,_0)] [&.visible]:pointer-events-auto [&_.icon-button]:[color:inherit] max-[600px]:[bottom:calc(82px_+_env(safe-area-inset-bottom))]",
  "empty-state": "empty-state [padding:70px_28px] text-center [&_>_svg]:w-[36px] [&_>_svg]:h-[36px] [&_>_svg]:text-[#b6a17c] [&_h2]:font-serif [&_h2]:text-[25px] [&_p]:max-w-[310px] [&_p]:[margin:0_auto_22px] [&_p]:text-muted [&_p]:text-[13px] [&_p]:leading-[1.7]",
  "feed-end": "feed-end m-0 [padding:32px_20px] text-muted text-center text-[11px] leading-[1.9] [&_span]:text-muted [&_span]:text-[12px]",
  "verified": "verified inline-grid align-middle shrink-0 place-items-center w-[13px] h-[13px] rounded-full bg-blue text-card text-[9px]",
  "hashtag": "hashtag [&:hover]:underline text-blue",
  "media-city": "media relative min-h-[264px] overflow-hidden [border:1.5px_solid_var(--color-edge)] rounded-[15px] bg-cover bg-center bg-[#c7b895] max-[600px]:min-h-[220px]   media-city [background-image:linear-gradient(180deg,_transparent_35%,_#000b),_url('/images/vietnam.jpg')]",
  "media-caption": "media-caption absolute [inset:auto_17px_17px] text-white [&_small]:inline-block [&_small]:mb-[9px] [&_small]:[padding:4px_7px] [&_small]:bg-[#efcc62] [&_small]:text-[#24221f] [&_small]:text-[8px] [&_small]:font-bold [&_small]:tracking-[1px] [&_small]:uppercase [&_h3]:max-w-[320px] [&_h3]:m-0 [&_h3]:font-serif [&_h3]:text-[23px] [&_h3]:leading-[1.1] [&_h3]:tracking-[-.5px] max-[600px]:[&_h3]:text-[22px]",
  "media-tech": "media relative min-h-[264px] overflow-hidden [border:1.5px_solid_var(--color-edge)] rounded-[15px] bg-cover bg-center bg-[#c7b895] max-[600px]:min-h-[220px]   media-tech [&.media-tech]:min-h-[225px] [&.media-tech]:[background-image:linear-gradient(110deg,_#176bff15,_#ff5c3515),_url('/images/workspace.jpg')] max-[600px]:[&.media-tech]:min-h-[185px]",
  "post-image": "post-image block max-h-[450px] w-full object-contain [border:1px_solid_var(--color-line)] rounded-[15px] bg-paper",
  "back-link": "back-link flex items-center gap-[10px] [padding:20px_24px] text-muted text-[12px] [border-bottom:1px_solid_var(--color-line)]",
  "collection-intro": "collection-intro [&_h2]:[margin:10px_0] [&_h2]:font-serif [&_h2]:text-[26px] [&_h2]:tracking-[-1px] flex items-center gap-[18px] [padding:28px_24px] [border-bottom:1px_solid_var(--color-line)] [&_p:last-child]:text-muted [&_p:last-child]:text-[11px] max-[600px]:[padding:24px_18px] max-[600px]:gap-[14px] max-[600px]:[&_h2]:text-[23px] max-[600px]:[&_.eyebrow]:text-[8px]",
  "collection-icon": "collection-icon grid place-items-center shrink-0 w-[53px] h-[63px] [border:1.5px_solid_var(--color-edge)] rounded-[13px] bg-[light-dark(#efcf8b,_#44351f)] [transform:rotate(-7deg)]",
  "eyebrow": "[margin:1em_0] eyebrow text-[10px] font-bold tracking-[1.6px]",
  "follow": "follow inline-flex items-center justify-center min-h-[40px] [padding:7px_11px] [border:1.5px_solid_var(--color-edge)] rounded-[100px] bg-transparent text-[12px] font-bold whitespace-nowrap [&:hover]:bg-[light-dark(#eee7dc,_#393229)] [&.following]:bg-ink [&.following]:text-card [&_svg]:w-[15px] [&_svg]:h-[15px]",
  "replies": "replies mt-[10px] pt-[12px] [border-top:1px_solid_var(--color-line)] text-[12px]",
  "reply": "reply flex items-start gap-[10px] [&_.avatar]:w-[27px] [&_.avatar]:h-[27px] [&_.avatar]:text-[13px] [&_p]:mt-0 [&_p]:leading-[1.7] [&_p]:[overflow-wrap:anywhere]",
  "reply-form": "reply-form flex items-center [border:1px_solid_var(--color-line)] rounded-[24px] pl-[12px] [&_input]:w-full [&_input]:[border:0] [&_input]:bg-transparent [&_input]:[padding:10px_0] [&_input]:text-[13px] max-[600px]:[&_input]:text-[16px]",
  "icon-button": "[font-family:inherit] icon-button inline-grid place-items-center [border:0] bg-transparent rounded-full shrink-0 w-[44px] h-[44px] text-blue [&:hover]:bg-[light-dark(#2466c20d,_#86b6f612)]",
  "emoji-picker": "emoji-picker flex flex-wrap [padding:8px_0] [&_button]:w-[36px] [&_button]:h-[36px] [&_button]:[border:0] [&_button]:rounded-[8px] [&_button]:bg-transparent [&_button]:text-[21px] [&_button:hover]:bg-paper",
  "attachment": "attachment relative [margin:8px_0] [&_img]:w-full [&_img]:max-h-[220px] [&_img]:object-contain [&_img]:bg-paper [&_img]:rounded-[12px] [&_button]:absolute [&_button]:top-[5px] [&_button]:right-[5px] [&_button]:bg-card [&_button]:text-ink",
  "modal": "modal [width:min(550px,_calc(100%_-_28px))] [max-height:calc(100dvh_-_40px)] p-0 overflow-y-auto [border:1.5px_solid_var(--color-edge)] rounded-[20px] bg-card shadow-[8px_8px_0_light-dark(#24221f40,_#00000066)] text-ink [&::backdrop]:bg-[light-dark(#24221f66,_#00000099)] [&::backdrop]:[backdrop-filter:blur(4px)] [&_.composer]:[border:0] max-[600px]:[&_.composer]:[padding:18px_14px]",
  "modal-heading": "modal-heading flex justify-between items-center [padding:17px_22px] [border-bottom:1px_solid_var(--color-line)] [&_h2]:m-0 [&_h2]:font-serif [&_h2]:text-[22px] max-[600px]:p-[16px] max-[600px]:[&_h2]:text-[20px]",
  "demo-note": "[margin:1em_0] demo-note m-[18px] text-center text-muted text-[10px] leading-[1.7]",
  "conversation": "conversation flex flex-col flex-1 min-h-0 [&_>_.demo-note]:shrink-0",
  "conversation-header": "conversation-header shrink-0 flex items-center gap-[12px] p-[16px] [border-bottom:1px_solid_var(--color-line)] [&_small]:block [&_small]:mt-[4px] [&_small]:text-muted [&_small]:text-[11px]",
  "message-history": "message-history flex flex-col flex-1 items-start gap-[22px] min-h-0 overflow-y-auto overscroll-contain p-[24px] max-[600px]:[padding:20px_18px]",
  "conversation-date": "[margin:1em_0] conversation-date self-center text-muted text-[9px] tracking-[1px]",
  "message": "message shrink-0 max-w-[82%] [&_p]:m-0 [&_p]:[padding:14px_16px] [&_p]:[border:1px_solid_var(--color-line)] [&_p]:rounded-[17px_17px_17px_3px] [&_p]:bg-paper [&_p]:text-[14px] [&_p]:leading-[1.6] [&_p]:whitespace-pre-wrap [&_p]:[overflow-wrap:anywhere] [&_small]:block [&_small]:[margin:7px_3px_0] [&_small]:text-[11px] [&_small]:text-muted [&.mine]:self-end [&.mine_p]:bg-[light-dark(#ffdbbb,_#493021)] [&.mine_p]:border-[light-dark(#e2b99a,_#805237)] [&.mine_p]:rounded-[17px_17px_3px_17px] [&.mine_small]:text-right",
  "message-form": "message-form shrink-0 flex items-center gap-[12px] [margin:16px_24px_0] p-[12px] [border:1px_solid_var(--color-line)] rounded-[17px] bg-card [&_textarea]:text-[14px] [&_textarea]:min-h-[50px] [&_textarea]:resize-none [&_.post-button]:w-[44px] [&_.post-button]:p-[8px] [&_.post-button]:shrink-0 max-[600px]:[&_textarea]:text-[16px] max-[600px]:mx-[18px]",
  "post-button": "[font-family:inherit] post-button inline-flex items-center justify-center ml-auto min-h-[44px] [padding:8px_21px] [border:1.5px_solid_var(--color-edge)] rounded-[100px] bg-accent text-[#24221f] text-[14px] font-bold [&:hover:not(:disabled)]:bg-[#ff906a]",
  "profile-form": "profile-form grid gap-[20px] p-[24px] [&_label]:grid [&_label]:gap-[8px] [&_label]:text-[12px] [&_label]:font-bold [&_input]:p-[12px] [&_input]:[border:1px_solid_var(--color-line)] [&_input]:rounded-[9px] [&_input]:bg-paper [&_input]:text-[14px] [&_textarea]:p-[12px] [&_textarea]:[border:1px_solid_var(--color-line)] [&_textarea]:rounded-[9px] [&_textarea]:bg-paper [&_textarea]:text-[14px] [&_.post-button]:w-fit max-[600px]:[&_input]:text-[16px] max-[600px]:[&_textarea]:text-[16px]",
  "text-button": "[font-family:inherit] text-button inline-flex items-center gap-[6px] p-0 min-h-[30px] [border:0] bg-transparent text-[11px] font-bold [&:hover]:underline"
};
