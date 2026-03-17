import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

const indexHtml = readFileSync(resolve(process.cwd(), 'src/pages/index.html'), 'utf8')

describe('index.html', () => {
  it('has the basic desktop app structure', () => {
    expect(indexHtml).toContain('<!doctype html>')
    expect(indexHtml).toContain('<html lang="ko">')
    expect(indexHtml).toContain('<div id="app">')
    expect(indexHtml).toContain('<header>')
    expect(indexHtml).toContain('<main>')
    expect(indexHtml).toContain('<div id="desktop-root"></div>')
    expect(indexHtml).toContain('<nav aria-label="Taskbar">')
  })

  it('loads the TypeScript entry file', () => {
    expect(indexHtml).toContain('<script type="module" src="./index.ts"></script>')
  })
})
