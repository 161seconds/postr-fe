import type { Post } from '../../shared/types/post.ts'

export const toggleItem = <T,>(items: T[], id: T): T[] => items.includes(id) ? items.filter(item => item !== id) : [...items, id]

const normalize = (value: string) => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D').toLocaleLowerCase('vi')

export function filterPosts(posts: Post[], query = '', topic = 'Tất cả') {
  const search = normalize(query.trim())
  return posts.filter(post => (topic === 'Tất cả' || post.topic === topic) && normalize(`${post.copy} ${post.quote ?? ''} ${post.author.name} ${post.author.handle}`).includes(search))
}
