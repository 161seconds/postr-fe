# Postr Frontend

Giao diện mạng xã hội bằng React, TypeScript và Vite. Cấu trúc tham khảo từ `leo-landora-landing-page-fe`:

```text
src/
  app/                        Điều hướng và trạng thái phiên
  features/
    feed/{pages,components,data}/
    explore/pages/
    messages/pages/
    notifications/pages/
    profile/pages/
  shared/
    components/layout/        Bố cục dùng chung
    types/                    Kiểu dữ liệu
  index.css                   Giao diện và responsive
public/images/                Ảnh có sẵn tại máy
scripts/check-feed.mjs         Kiểm tra logic bảng tin
```

## Chạy

```sh
pnpm install
pnpm dev
pnpm test
pnpm build
```

Các trang dùng hash URL (`#home`, `#search`, `#bell`, `#mail`, `#bookmark`, `#user`, `#post/1`), hỗ trợ nút Back/Forward của trình duyệt, không cần cấu hình rewrite trên hosting tĩnh.

Đăng bài, ảnh đính kèm, bình luận, thích, đăng lại, lưu, theo dõi, sửa hồ sơ và hội thoại chạy bằng trạng thái React trong phiên đang mở. Tải lại trang sẽ trở về dữ liệu mẫu. Tin nhắn không được gửi đến người thật. Liên kết bài mẫu có thể mở lại; bài mới chỉ tồn tại trong phiên tạo bài. Chưa tích hợp backend, đăng nhập hoặc lưu trữ lâu dài.

Ảnh minh họa tải từ Unsplash: `photo-1528127269322-539801943592` và `photo-1516321318423-f06f85e504b3`.

Font Open Sans và Lora được phục vụ cục bộ; giấy phép nằm trong `public/fonts/`.
