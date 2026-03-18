/*
 * This file is for formatting retro desktop labels and summaries.
 */
import type { LocalFolderItem } from '../service/localApiTypes'

export const formatCpuUsage = (cpuUsagePercent: number | null) =>
  typeof cpuUsagePercent === 'number' ? `${Math.round(cpuUsagePercent)}%` : '--'

export const formatTemperature = (
  temperatureCelsius: number | null,
  hasError = false,
) => {
  if (typeof temperatureCelsius === 'number') {
    return `${Math.round(temperatureCelsius)}C`
  }

  return hasError ? 'N/A' : '--'
}

const padTimeNumber = (value: number) => String(value).padStart(2, '0')

export const formatLocalTime = (date: Date) =>
  `${padTimeNumber(date.getHours())}:${padTimeNumber(date.getMinutes())}:${padTimeNumber(date.getSeconds())}`

export const formatFolderItemCount = (itemCount: number) =>
  `${itemCount} item${itemCount === 1 ? '' : 's'}`

const readExtensionLabel = (fileName: string) => {
  const fileNameParts = fileName.split('.')
  const extension = fileNameParts[fileNameParts.length - 1]

  if (fileNameParts.length <= 1 || !extension) {
    return 'FILE'
  }

  return extension.slice(0, 4).toUpperCase()
}

export const createFolderItemBadge = (item: LocalFolderItem) =>
  item.kind === 'directory' ? 'DIR' : readExtensionLabel(item.name)
