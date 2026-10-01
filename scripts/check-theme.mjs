import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { runInNewContext } from 'node:vm'

const html = readFileSync(new URL('../src/app/layout.tsx', import.meta.url), 'utf8')
const script = html.match(/const themeScript = `([\s\S]*?)`/)[1]

for (const saved of [null, 'dark', 'light', 'invalid', 'blocked']) {
  const root = { dataset: { theme: html.match(/data-theme="([^"]+)"/)[1] } }
  const meta = { content: html.match(/name="theme-color" content="([^"]+)"/)[1] }
  runInNewContext(script, {
    document: { documentElement: root, querySelector: () => meta },
    localStorage: { getItem(key) {
      assert.equal(key, 'postr-theme')
      if (saved === 'blocked') throw new Error('Storage unavailable')
      return saved
    } },
  })
  assert.equal(root.dataset.theme, saved === 'light' ? 'light' : 'dark')
  assert.equal(meta.content, saved === 'light' ? '#f5f0e8' : '#171614')
}
console.log('Theme checks passed: dark default, saved preference, invalid and blocked storage.')
