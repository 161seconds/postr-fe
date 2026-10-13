# Postr frontend

Giao diện dùng HTML, CSS và JavaScript thuần. Flask trong `../postr-be` phục vụ frontend và API cùng nguồn; không cần Node.js, npm hoặc bước build.

- `index.html`: trang vào ứng dụng.
- `templates.js`: các khung HTML của giao diện.
- `app.js`: điều hướng bằng hash, thao tác bảng tin, hồ sơ, tin nhắn, đăng nhập và quản trị.
- `styles.css`: CSS tĩnh của giao diện hiện tại.
- `public/`: font, ảnh và favicon giữ nguyên.

Khởi động backend theo README trong `../postr-be`, rồi mở URL Flask. Khách đọc bảng tin, tìm kiếm và xem bình luận mà không cần đăng nhập. Đăng nhập để đăng bài, tương tác, theo dõi, xem dữ liệu cá nhân hoặc nhắn tin. Các trang `/admin` và `/admin/posts` chỉ cho tài khoản `ADMIN`: thống kê, tìm kiếm, phân trang và ẩn/khôi phục gọi API thật; trạng thái giữ qua tải lại trang. Tài khoản thường không thấy link quản trị.

Mở `/?check` để chạy kiểm tra JavaScript trong trình duyệt. Console phải có `Frontend checks passed`. Kiểm tra bao gồm tìm kiếm không dấu, tác giả, trích dẫn, chủ đề, kết quả rỗng và escape HTML.

Mở `/check.html` để kiểm tra màu/font, responsive, draft, biểu cảm, thông báo/hội thoại, escape HTML và tách dữ liệu giữa các tài khoản. Mở `/check.html?guest` để kiểm tra đọc bài không đăng nhập, thao tác được bảo vệ, căn giữa dialog và token hết hạn. Mở `/check.html?pagination` để kiểm tra cuộn tự tải đủ 100 bài, giữ vị trí cuộn và draft, dừng khi hết bài, thử lại sau lỗi mạng, tương tác, tìm kiếm, bộ lọc, liên kết bài và phản hồi đến muộn. Mở `/check.html?admin` để kiểm tra kiểm duyệt, bộ lọc, validation và đăng xuất. Các trang kiểm tra dùng fixture riêng trong bộ nhớ, không ghi dữ liệu backend.

Token chỉ lưu trong `sessionStorage`; mật khẩu không lưu trong trình duyệt. Các yêu cầu API gửi bearer token khi đã đăng nhập. Đăng xuất hoặc token hết hạn sẽ xóa dữ liệu cá nhân và draft, quay về chế độ xem công khai. Bảng tin dùng chung; hồ sơ, tương tác, thông báo và tin nhắn đọc/ghi SQLite theo người dùng. Danh sách tài khoản và hashtag lấy từ DB; dữ liệu trống hiển thị trạng thái trống. Cả `/api` và `/api/v1` dùng chung dữ liệu.

Bảng tin tự nối thêm 20 bài từ SQLite khi cuộn gần cuối, dừng khi hết bài. Nội dung đang soạn và vị trí cuộn được giữ khi tải thêm; lỗi tải thêm có nút Thử lại. Tìm kiếm, chủ đề, bài đã lưu và hồ sơ được lọc ở server trước khi phân trang. Tương tác làm mới các bài đã tải; đổi bộ lọc hoặc tài khoản tải lại từ đầu. Liên kết `#post/<id>` tải trực tiếp bài viết, kể cả khi bài đó không nằm ở trang đầu.

Các tệp `.env` và `.env.*` được Git bỏ qua, trừ `.env.example`. Cấu hình bí mật thuộc backend; không đặt khóa bí mật trong JavaScript.
