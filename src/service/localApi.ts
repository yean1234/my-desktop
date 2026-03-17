/*
 * This file is for fetching local CPU and Desktop folder data from the server.
 */
import type {
  LocalDesktopFolderResponse,
  LocalSystemMetricsResponse,
} from './localApiTypes'

const readJsonResponse = async <T>(response: Response) => {
  const payload = (await response.json()) as T | { message?: string }

  if (!response.ok) {
    const errorMessage =
      typeof payload === 'object' &&
      payload !== null &&
      'message' in payload &&
      typeof payload.message === 'string'
        ? payload.message
        : 'Request failed'

    throw new Error(errorMessage)
  }

  return payload as T
}

export const fetchSystemMetrics = async () => {
  const response = await fetch('/api/system/metrics')

  return readJsonResponse<LocalSystemMetricsResponse>(response)
}

export const fetchDesktopFolder = async (folderName: string) => {
  const requestUrl = new URL('/api/desktop/folder', window.location.origin)

  if (folderName.trim()) {
    requestUrl.searchParams.set('folder', folderName.trim())
  }

  const response = await fetch(requestUrl)

  return readJsonResponse<LocalDesktopFolderResponse>(response)
}
