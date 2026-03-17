import { describe, expect, it } from 'vitest'
import {
  createPickerLocationLabel,
  sortPickedFolderItems,
} from '../src/service/localFolderPicker'

describe('local folder picker helpers', () => {
  it('creates a browser picker location label', () => {
    expect(createPickerLocationLabel('Project')).toBe('Selected in browser picker / Project')
  })

  it('sorts directories before files for retro display', () => {
    expect(
      sortPickedFolderItems([
        { name: 'zeta.txt', kind: 'file' },
        { name: 'alpha', kind: 'directory' },
        { name: 'beta', kind: 'directory' },
      ]),
    ).toEqual([
      { name: 'alpha', kind: 'directory' },
      { name: 'beta', kind: 'directory' },
      { name: 'zeta.txt', kind: 'file' },
    ])
  })
})
