import { existsSync, statSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

const srcPath = resolve(process.cwd(), 'src')
const expectedDirectories = [
  'component',
  'assets',
  'hooks',
  'pages',
  'constants',
  'config',
  'styles',
  'service',
  'utils',
  'contexts',
]

describe('src structure', () => {
  it('has the standard source directories', () => {
    for (const directoryName of expectedDirectories) {
      const directoryPath = resolve(srcPath, directoryName)

      expect(existsSync(directoryPath)).toBe(true)
      expect(statSync(directoryPath).isDirectory()).toBe(true)
    }
  })

  it('keeps App.ts and index.ts at the src root', () => {
    expect(existsSync(resolve(srcPath, 'App.ts'))).toBe(true)
    expect(existsSync(resolve(srcPath, 'index.ts'))).toBe(true)
    expect(existsSync(resolve(srcPath, 'main.ts'))).toBe(false)
  })

  it('stores the HTML entry inside src/pages', () => {
    expect(existsSync(resolve(srcPath, 'pages/index.html'))).toBe(true)
    expect(existsSync(resolve(srcPath, 'pages/index.ts'))).toBe(true)
    expect(existsSync(resolve(process.cwd(), 'index.html'))).toBe(false)
  })

  it('keeps desktop shell files in the expected folders', () => {
    expect(existsSync(resolve(srcPath, 'component/desktop/createDesktopShell.ts'))).toBe(true)
    expect(existsSync(resolve(srcPath, 'styles/desktop-shell.css'))).toBe(true)
    expect(existsSync(resolve(srcPath, 'service/localApi.ts'))).toBe(true)
    expect(existsSync(resolve(srcPath, 'service/localDesktopServer.ts'))).toBe(true)
    expect(existsSync(resolve(srcPath, 'utils/desktopState.ts'))).toBe(true)
  })
})
