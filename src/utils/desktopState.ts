/*
 * This file is for storing and dumping the desktop layout state.
 */
import type { LocalFolderItem } from '../service/localApiTypes'
import { formatCpuUsage, formatTemperature } from './formatters'

export type LoadStatus = 'idle' | 'loading' | 'ready' | 'error'

export type DesktopState = {
  cpuUsagePercent: number | null
  temperatureCelsius: number | null
  temperatureStatus: LoadStatus
  folderTitle: string
  folderPath: string
  folderStatus: LoadStatus
  folderItems: LocalFolderItem[]
  warningMessage: string
}

export const createInitialDesktopState = (preferredFolderName: string): DesktopState => ({
  cpuUsagePercent: null,
  temperatureCelsius: null,
  temperatureStatus: 'idle',
  folderTitle: preferredFolderName || 'Desktop',
  folderPath: '',
  folderStatus: 'loading',
  folderItems: [],
  warningMessage: '',
})

export const dumpDesktopState = (state: DesktopState) => {
  const visibleItems = state.folderItems
    .slice(0, 6)
    .map((item) => `${item.kind}:${item.name}`)
    .join(', ')

  return [
    'desktop-layout',
    `cpu=${formatCpuUsage(state.cpuUsagePercent)}`,
    `temperature=${formatTemperature(
      state.temperatureCelsius,
      state.temperatureStatus === 'error',
    )}`,
    `temperatureStatus=${state.temperatureStatus}`,
    `folder=${state.folderTitle}`,
    `path=${state.folderPath || '-'}`,
    `folderStatus=${state.folderStatus}`,
    `itemCount=${state.folderItems.length}`,
    `visibleItems=${visibleItems || '-'}`,
    `warning=${state.warningMessage || '-'}`,
  ].join('\n')
}
