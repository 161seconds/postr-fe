import assert from 'node:assert/strict'
import { moderatePost } from '../src/features/admin/moderation.ts'
import { filterPosts } from '../src/features/feed/feed-model.ts'

const original = {}
const hidden = moderatePost(original, 1, '  Nội dung spam  ')
assert.deepEqual(original, {})
assert.deepEqual(hidden, { 1: 'Nội dung spam' })
assert.deepEqual(moderatePost(hidden, 2, 'Bài spam khác'), { 1: 'Nội dung spam', 2: 'Bài spam khác' })
assert.deepEqual(moderatePost({ ...hidden, 2: 'Bài spam khác' }, 1, null), { 2: 'Bài spam khác' })
assert.deepEqual(moderatePost(hidden, 1, null), {})
assert.deepEqual(hidden, { 1: 'Nội dung spam' })
for (const reason of ['', '     ', 'abcd', 'x'.repeat(256)]) {
  assert.throws(() => moderatePost(original, 1, reason), /5–255/)
}
for (const length of [5, 255]) assert.equal(moderatePost(original, 1, 'x'.repeat(length))[1].length, length)
const posts = [{ id: 1, copy: 'Cà phê', topic: 'Đời sống', author: { name: 'An', handle: '@an' } }]
assert.equal(filterPosts(posts, 'ca phe').length, 1)
assert.equal(filterPosts(posts, '@an').length, 1)
assert.equal(filterPosts(posts, 'missing').length, 0)
console.log('Admin checks passed: hide, restore, immutable state, reason limits, search.')
