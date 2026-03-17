import { describe, expect, it } from 'vitest'
import {
  resolveFolderTarget,
  sortFolderItems,
} from '../src/service/localDesktopServer'

describe('local desktop server helpers', () => {
  it('opens the first Desktop folder when no folder is configured', () => {
    const target = resolveFolderTarget('', ['Project', 'Archive'], 'Desktop')

    expect(target.folderName).toBe('Archive')
    expect(target.useDesktopRoot).toBe(false)
    expect(target.warningMessage).toBe('')
  })

  it('falls back to Desktop root when the requested folder is missing', () => {
    const target = resolveFolderTarget('Missing', ['Project'], 'Desktop')

    expect(target.folderName).toBe('Desktop')
    expect(target.useDesktopRoot).toBe(true)
    expect(target.warningMessage).toContain('Missing')
  })

  it('sorts directories before files', () => {
    const sortedItems = sortFolderItems([
      { name: 'zeta.txt', kind: 'file' },
      { name: 'alpha', kind: 'directory' },
      { name: 'beta.txt', kind: 'file' },
    ])

    expect(sortedItems).toEqual([
      { name: 'alpha', kind: 'directory' },
      { name: 'beta.txt', kind: 'file' },
      { name: 'zeta.txt', kind: 'file' },
    ])
  })
})
