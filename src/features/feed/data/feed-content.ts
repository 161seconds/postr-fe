import type { Person, Post, Profile } from '@/shared/types/post'

export const initialProfile: Profile = {
  initial: 'A', tone: '', name: 'An Nguyễn', handle: '@annguyen',
  bio: 'Ghi lại những điều nhỏ xíu. Yêu thiết kế, cà phê và những câu chuyện đáng được kể.', location: 'Hồ Chí Minh, Việt Nam',
}

export const people: Person[] = [
  { initial: 'M', tone: 'orange', name: 'Mê Việt Nam', handle: '@mevietnam', verified: true },
  { initial: 'T', tone: 'black', name: 'Tech Daily', handle: '@techdaily', verified: true },
  { initial: 'L', tone: 'green', name: 'Linh Trần', handle: '@linhtran' },
  { initial: 'N', tone: 'yellow', name: 'Nhà Có Hai Người', handle: '@nhacohai' },
  { initial: 'D', tone: 'black', name: 'Design Notes', handle: '@designnotes', verified: true },
]

export const initialPosts: Post[] = [
  { id: 1, author: people[0], time: '12 phút', copy: 'Một góc Hạ Long trong buổi chiều yên ả. Núi xanh, nước biếc và những con thuyền chậm rãi qua vịnh. #VietnamNow', topic: 'Đời sống', media: 'city', comments: 48, replies: [], reposts: 126, likes: 2400 },
  { id: 2, author: people[1], time: '38 phút', copy: 'AI không thay thế người làm sáng tạo. Người biết dùng AI sẽ thay thế người không dùng. Câu hỏi thật sự: bạn đang dùng nó để làm gì? #AI', topic: 'Công nghệ', media: 'tech', comments: 93, replies: [], reposts: 207, likes: 1800 },
  { id: 3, author: people[2], time: '1 giờ', copy: 'Một lời nhắc nhỏ cho hôm nay: #ChaoThangMoi', topic: 'Đời sống', quote: '“Không cần phải chạy nhanh hơn tất cả mọi người. Chỉ cần đừng đứng yên trước phiên bản cũ của mình.”', comments: 12, replies: [], reposts: 54, likes: 688 },
  { id: 4, author: people[4], time: '2 giờ', copy: 'Thiết kế tốt bắt đầu từ việc lắng nghe. Trước khi thêm một chi tiết, thử hỏi: người dùng có thực sự cần nó không?', topic: 'Thiết kế', quote: 'Ít hơn một chút. Đúng hơn rất nhiều.', comments: 8, replies: [], reposts: 32, likes: 256 },
  { id: 5, author: people[3], time: '3 giờ', copy: 'Playlist cuối tuần đã sẵn sàng. Một chút nhạc indie, một tách cà phê, một buổi chiều không vội. Bạn đang nghe bài gì? #IndieViet', topic: 'Âm nhạc', comments: 21, replies: [], reposts: 9, likes: 142 },
  { id: 6, author: people[0], time: '4 giờ', copy: 'Một tối cùng bạn bè cổ vũ U23 Việt Nam. Thắng hay thua, những khoảnh khắc ngồi cạnh nhau vẫn đáng nhớ nhất.', topic: 'Thể thao', comments: 17, replies: [], reposts: 24, likes: 320 },
]

export const trends = [
  { type: 'Xu hướng tại Việt Nam', title: '#ChaoThangMoi', count: '18,2K bài đăng', query: '#ChaoThangMoi' },
  { type: 'Công nghệ · Nổi bật', title: 'AI tạo sinh', count: '9.584 bài đăng', query: 'AI' },
  { type: 'Thể thao · Được quan tâm', title: 'U23 Việt Nam', count: '25,1K bài đăng', query: 'U23' },
  { type: 'Âm nhạc · Xu hướng', title: '#IndieViet', count: '4.620 bài đăng', query: '#IndieViet' },
]
