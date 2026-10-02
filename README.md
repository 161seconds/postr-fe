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

Chạy `dotnet run --project Postr.API --urls http://localhost:5000` trong `postr-be`, sau đó chạy `pnpm dev`. Frontend mở tại `http://localhost:3000`. Nếu backend dùng URL khác, đặt `POSTR_API_URL` trước khi khởi động Next.js. Production dùng `pnpm build` rồi `pnpm start`.

Component React dùng class Tailwind cho bố cục, responsive và trạng thái; không có stylesheet CSS riêng cho component. Dark mode là mặc định; nút sáng/tối lưu lựa chọn trong localStorage. Scrollbar đổi màu theo theme.

Trang quản trị demo tại http://localhost:3000/admin (hoặc /admin/posts), có liên kết "Admin demo" trên bảng tin. Trang hiển thị thống kê bài đăng và tác giả trong bảng tin demo, tìm kiếm, lọc trạng thái, ẩn bài kèm lý do 5–255 ký tự và khôi phục. Kiểm duyệt chỉ mô phỏng trong bộ nhớ trang, không cập nhật backend hoặc bảng tin người dùng; tải lại trang sẽ đặt lại trạng thái. Đây không phải cổng quản trị production và không cấp quyền Admin. Quản trị thật cần đăng nhập, phân quyền Admin ở backend và kết nối API quản trị.

Next.js phục vụ trang gốc; các màn hình tiếp tục dùng hash URL (`#home`, `#search`, `#bell`, `#mail`, `#bookmark`, `#user`, `#post/1`), hỗ trợ Back/Forward và giữ trạng thái phiên khi chuyển màn hình.

Đăng bài, ảnh đính kèm, bình luận, thích, đăng lại, lưu, theo dõi, sửa hồ sơ và hội thoại được lưu qua API C# theo cookie trình duyệt. Tải lại trang giữ dữ liệu. Tin nhắn vẫn là hội thoại mẫu, không gửi đến người thật. Chưa có đăng nhập hoặc đồng bộ giữa nhiều trình duyệt.

Ảnh minh họa tải từ Unsplash: `photo-1528127269322-539801943592` và `photo-1516321318423-f06f85e504b3`.

Font Open Sans và Lora được phục vụ cục bộ; giấy phép nằm trong `public/fonts/`.
