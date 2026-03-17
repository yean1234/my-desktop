/*
 * This file is for sharing local API types between the browser and the server.
 */
export type LocalFolderItemKind = 'directory' | 'file'

export type LocalFolderItem = {
  name: string
  kind: LocalFolderItemKind
}

export type LocalDesktopFolderResponse = {
  desktopPath: string
  folderName: string
  folderPath: string
  itemCount: number
  items: LocalFolderItem[]
  isDesktopRoot: boolean
  warningMessage: string
}

export type LocalSystemMetricsResponse = {
  cpuUsagePercent: number
}
