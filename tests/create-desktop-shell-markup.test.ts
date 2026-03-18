import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

const shellSource = readFileSync(
  resolve(process.cwd(), 'src/component/desktop/createDesktopShell.ts'),
  'utf8',
)

describe('createDesktopShell markup', () => {
  it('renders the internet explorer shortcut in the right rail', () => {
    expect(shellSource).toContain('<aside class="desktop-shell__right-rail">')
    expect(shellSource).toContain('data-desktop-internet-icon')
    expect(shellSource).toContain('class="desktop-shell__shortcut"')
    expect(shellSource).toContain('desktop-shell__shortcut-icon')
    expect(shellSource).toContain('desktop-shell__shortcut-label')
    expect(shellSource).toContain('faInternetExplorer')
    expect(shellSource).not.toContain('rail-browser-launcher')
    expect(shellSource).not.toContain('rail-blank-panel')
    expect(shellSource).not.toContain('rail-card--disk')
    expect(shellSource).not.toContain('rail-card--drive')
  })
})
