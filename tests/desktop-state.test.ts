import { describe, expect, it } from 'vitest'
import { createInitialDesktopState, dumpDesktopState } from '../src/utils/desktopState'

describe('desktop state dump', () => {
  it('includes the important desktop shell values', () => {
    const initialState = createInitialDesktopState('Project')
    const dump = dumpDesktopState({
      ...initialState,
      cpuUsagePercent: 38,
      temperatureCelsius: 12,
      temperatureStatus: 'ready',
      folderPath: '/home/test/Desktop/Project',
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
    expect(dump).toContain('path=/home/test/Desktop/Project')
    expect(dump).toContain('itemCount=2')
    expect(dump).toContain('visibleItems=file:alpha.txt, directory:notes')
  })
})
