# Postr Frontend

Giao diện mạng xã hội bằng Next.js App Router, React, TypeScript và Tailwind CSS 4, cùng stack với `leo-landora-landing-page-fe`.

```text
src/
  app/                        Next.js layout, page và trạng thái phiên
    globals.css               Import Tailwind, token màu/font, animation
  features/
    feed/{pages,components,data}/
    explore/pages/
    messages/pages/
    notifications/pages/
    profile/pages/
  shared/
    components/layout/        Bố cục dùng chung
    types/                    Kiểu dữ liệu
public/images/                Ảnh có sẵn tại máy
scripts/check-feed.mjs         Kiểm tra logic bảng tin
scripts/check-theme.mjs        Kiểm tra theme mặc định và lưu lựa chọn
scripts/check-setup.mjs        Kiểm tra cấu hình Next.js/Tailwind
```

## Chạy

```sh
pnpm install
pnpm dev
pnpm lint
pnpm test
pnpm build
pnpm start
```

`pnpm dev` mở tại `http://localhost:3000`. Production dùng `pnpm build` rồi `pnpm start`.

Component React dùng class Tailwind cho bố cục, responsive và trạng thái; không có stylesheet CSS riêng cho component. Dark mode là mặc định; nút sáng/tối lưu lựa chọn trong localStorage. Scrollbar đổi màu theo theme.

Next.js phục vụ trang gốc; các màn hình tiếp tục dùng hash URL (`#home`, `#search`, `#bell`, `#mail`, `#bookmark`, `#user`, `#post/1`), hỗ trợ Back/Forward và giữ trạng thái phiên khi chuyển màn hình.

Đăng bài, ảnh đính kèm, bình luận, thích, đăng lại, lưu, theo dõi, sửa hồ sơ và hội thoại chạy bằng trạng thái React trong phiên đang mở. Tải lại trang sẽ trở về dữ liệu mẫu. Tin nhắn không được gửi đến người thật. Liên kết bài mẫu có thể mở lại; bài mới chỉ tồn tại trong phiên tạo bài. Chưa tích hợp backend, đăng nhập hoặc lưu trữ lâu dài.

Ảnh minh họa tải từ Unsplash: `photo-1528127269322-539801943592` và `photo-1516321318423-f06f85e504b3`.

Font Open Sans và Lora được phục vụ cục bộ; giấy phép nằm trong `public/fonts/`.
