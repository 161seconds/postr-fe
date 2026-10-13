# Postr frontend

Giao diện dùng HTML, CSS và JavaScript thuần. Flask trong `../postr-be` phục vụ frontend và API cùng nguồn; không cần Node.js, npm hoặc bước build.

- `index.html`: trang vào ứng dụng.
- `templates.js`: HTML của giao diện và dữ liệu giới thiệu cộng đồng.
- `app.js`: điều hướng bằng hash, thao tác bảng tin, hồ sơ, tin nhắn, đăng nhập và demo quản trị.
- `styles.css`: CSS tĩnh của giao diện hiện tại.
- `public/`: font, ảnh và favicon giữ nguyên.

Khởi động backend theo README trong `../postr-be`, rồi mở URL Flask. Các trang `/admin` và `/admin/posts` dùng cùng ứng dụng. Demo kiểm duyệt chỉ thay đổi trạng thái trên trang; tải lại sẽ đặt lại, không thay đổi dữ liệu backend.

Mở `/?check` để chạy kiểm tra JavaScript trong trình duyệt. Console phải có `Frontend checks passed`. Kiểm tra bao gồm tìm kiếm không dấu, tác giả, trích dẫn, chủ đề, kết quả rỗng và escape HTML.

Mở `/check.html` để kiểm tra màu và font ở chế độ sáng/tối, link admin trên desktop/điện thoại, bố cục không tràn ngang và hồi quy DOM: ảnh và nội dung draft giữ qua render; biểu cảm cập nhật trạng thái truy cập; thông báo và hội thoại từ database hiển thị đúng, escape HTML; draft, ảnh, tin nhắn và lựa chọn hội thoại không chuyển sang tài khoản khác sau đăng nhập hoặc đăng xuất. Các thao tác kiểm tra dùng API giả trong bộ nhớ.

Đăng nhập hoặc đăng ký bằng hộp thoại trên thanh tiêu đề. Token chỉ lưu trong `sessionStorage`; mật khẩu không lưu. Sau khi đăng nhập, các yêu cầu API gửi bearer token. Đăng xuất trả về phiên khách của trình duyệt. Bảng tin công khai dùng chung; hồ sơ, tương tác, thông báo và tin nhắn đọc/ghi các bảng SQLite theo người dùng. Cả `/api` và `/api/v1` dùng chung dữ liệu.

Các tệp `.env` và `.env.*` được Git bỏ qua, trừ `.env.example`. Cấu hình bí mật thuộc backend; không đặt khóa bí mật trong JavaScript.
