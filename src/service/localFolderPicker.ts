/*
 * This file is for opening a local folder with the browser picker.
 */
import type { LocalFolderItem, LocalFolderItemKind } from './localApiTypes'

type DirectoryPickerWindow = Window & {
  showDirectoryPicker?: () => Promise<FileSystemDirectoryHandle>
}

type BrowserFolderEntry = {
  name: string
  kind: LocalFolderItemKind
}

export type PickedLocalFolder = {
  folderName: string
  locationLabel: string
  items: LocalFolderItem[]
  warningMessage: string
}

export const sortPickedFolderItems = (items: LocalFolderItem[]) =>
  [...items].sort((leftItem, rightItem) => {
    if (leftItem.kind !== rightItem.kind) {
      return leftItem.kind === 'directory' ? -1 : 1
    }

    return leftItem.name.localeCompare(rightItem.name, 'ko')
  })

export const createPickerLocationLabel = (folderName: string) =>
  `Selected in browser picker / ${folderName}`

export const isFolderPickerAbortError = (error: unknown) =>
  typeof error === 'object' &&
  error !== null &&
  'name' in error &&
  error.name === 'AbortError'

const readDirectoryEntries = async (directoryHandle: FileSystemDirectoryHandle) => {
  const entries: BrowserFolderEntry[] = []

  for await (const entry of directoryHandle.values()) {
    entries.push({
      name: entry.name,
      kind: entry.kind,
    })
  }

  return sortPickedFolderItems(entries)
}

export const pickLocalFolder = async (): Promise<PickedLocalFolder> => {
  const pickerWindow = window as DirectoryPickerWindow

  if (!pickerWindow.showDirectoryPicker) {
    throw new Error('This browser does not support local folder picking. Use Chrome or Edge.')
  }

  const directoryHandle = await pickerWindow.showDirectoryPicker()
  const items = await readDirectoryEntries(directoryHandle)

  return {
    folderName: directoryHandle.name,
    locationLabel: createPickerLocationLabel(directoryHandle.name),
    items,
    warningMessage: 'The browser hides the full local path for privacy',
  }
}
