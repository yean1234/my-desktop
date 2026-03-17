import { describe, expect, it } from 'vitest'
import {
  createInitialDesktopState,
  dumpDesktopState,
  hasVisibleFolderItems,
} from '../src/utils/desktopState'

describe('desktop state dump', () => {
  it('includes the important desktop shell values', () => {
    const initialState = createInitialDesktopState()
    const dump = dumpDesktopState({
      ...initialState,
      cpuUsagePercent: 38,
      temperatureCelsius: 12,
      temperatureStatus: 'ready',
      folderTitle: 'Project',
      folderPath: 'Selected in browser picker / Project',
      folderStatus: 'ready',
      folderItems: [
        { name: 'alpha.txt', kind: 'file' },
        { name: 'notes', kind: 'directory' },
      ],
    })

    expect(dump).toContain('desktop-layout')
    expect(dump).toContain('cpu=38%')
    expect(dump).toContain('temperature=12C')
    expect(dump).toContain('folder=Project')
    expect(dump).toContain('path=Selected in browser picker / Project')
    expect(dump).toContain('itemCount=2')
    expect(dump).toContain('visibleItems=file:alpha.txt, directory:notes')
  })

  it('starts with no selected folder and no visible items', () => {
    const dump = dumpDesktopState(createInitialDesktopState())

    expect(dump).toContain('folder=No folder selected')
    expect(dump).toContain('folderStatus=idle')
    expect(dump).toContain('visibleItems=-')
  })

  it('shows folder items only when the folder is ready', () => {
    expect(
      hasVisibleFolderItems({
        folderStatus: 'ready',
        folderItems: [{ name: 'notes', kind: 'directory' }],
      }),
    ).toBe(true)
  })

  it('hides previous folder items while a new folder is loading', () => {
    expect(
      hasVisibleFolderItems({
        folderStatus: 'loading',
        folderItems: [{ name: 'notes', kind: 'directory' }],
      }),
    ).toBe(false)
  })
})
