import assert from 'node:assert/strict'
import { existsSync, readFileSync } from 'node:fs'

const read = path => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8')
const packageJson = JSON.parse(read('package.json'))
assert.equal(packageJson.scripts.dev, 'next dev')
assert.equal(packageJson.scripts.build, 'next build')
assert.ok(packageJson.dependencies.next)
assert.ok(packageJson.devDependencies.tailwindcss)
assert.match(read('src/app/globals.css'), /@import ['"]tailwindcss['"];/)
assert.match(read('src/app/layout.tsx'), /data-theme="dark"/)
assert.match(read('src/app/page.tsx'), /<App\s*\/>/)
assert.equal(existsSync(new URL('../vite.config.ts', import.meta.url)), false)
assert.equal(existsSync(new URL('../src/index.css', import.meta.url)), false)
console.log('Setup checks passed: Next.js, Tailwind, dark default, no legacy Vite or component CSS.')
