import type { Person, Profile } from '@/shared/types/post'

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

export const trends = [
  { type: 'Xu hướng tại Việt Nam', title: '#ChaoThangMoi', count: '18,2K bài đăng', query: '#ChaoThangMoi' },
  { type: 'Công nghệ · Nổi bật', title: 'AI tạo sinh', count: '9.584 bài đăng', query: 'AI' },
  { type: 'Thể thao · Được quan tâm', title: 'U23 Việt Nam', count: '25,1K bài đăng', query: 'U23' },
  { type: 'Âm nhạc · Xu hướng', title: '#IndieViet', count: '4.620 bài đăng', query: '#IndieViet' },
]
