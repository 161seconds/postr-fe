import assert from 'node:assert/strict'
import { filterPosts, toggleItem } from '../src/features/feed/feed-model.ts'

const posts = [
  { id: 1, copy: 'Một góc Hội An #VietnamNow', topic: 'Đời sống', author: { name: 'Mê Việt Nam', handle: '@mevietnam' } },
  { id: 2, copy: 'AI tạo sinh', quote: 'Đúng hơn rất nhiều', topic: 'Công nghệ', author: { name: 'Tech Daily', handle: '@techdaily' } },
]
const ids = result => result.map(post => post.id)
assert.deepEqual(ids(filterPosts(posts, '  HOI AN  ')), [1])
assert.deepEqual(ids(filterPosts(posts, 'dung hon')), [2])
assert.deepEqual(ids(filterPosts(posts, '@TECHDAILY')), [2])
assert.deepEqual(ids(filterPosts(posts, '#VietnamNow')), [1])
assert.deepEqual(filterPosts(posts, 'AI', 'Đời sống'), [])
assert.deepEqual(ids(filterPosts(posts, '', 'Công nghệ')), [2])
assert.deepEqual(filterPosts(posts, 'missing'), [])
assert.deepEqual(filterPosts(posts, ' '), posts)
const original = [1, 2]
assert.deepEqual(toggleItem(original, 1), [2])
assert.deepEqual(toggleItem(original, 3), [1, 2, 3])
assert.deepEqual(toggleItem(toggleItem(original, 3), 3), original)
assert.deepEqual(original, [1, 2])
console.log('Feed checks passed: search, accents, topics, reversible interactions.')
