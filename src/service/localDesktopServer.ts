/*
 * This file is for serving local CPU data and Desktop folder data to the app.
 */
import { existsSync, readFileSync } from 'node:fs'
import { readdir } from 'node:fs/promises'
import type { IncomingMessage, ServerResponse } from 'node:http'
import { homedir, cpus } from 'node:os'
import { basename, join } from 'node:path'
import type { Plugin } from 'vite'
import { desktopDirectoryOverride } from '../config/desktopFolder'
import type {
  LocalDesktopFolderResponse,
  LocalFolderItem,
  LocalSystemMetricsResponse,
} from './localApiTypes'

type CpuSnapshot = {
  idle: number
  total: number
}

type FolderTarget = {
  folderName: string
  useDesktopRoot: boolean
  warningMessage: string
}

type DirectoryRoot = {
  path: string
  warningMessage: string
}

type NextFunction = (error?: Error) => void

const readCpuSnapshot = (): CpuSnapshot => {
  const cpuTimes = cpus()

  return cpuTimes.reduce(
    (snapshot, cpuInfo) => {
      const {
        idle,
        irq,
        nice,
        sys,
        user,
      } = cpuInfo.times

      return {
        idle: snapshot.idle + idle,
        total: snapshot.total + idle + irq + nice + sys + user,
      }
    },
    {
      idle: 0,
      total: 0,
    },
  )
}

const createCpuUsageSampler = () => {
  let previousSnapshot = readCpuSnapshot()
  let currentCpuUsagePercent = 0

  const updateSnapshot = () => {
    const nextSnapshot = readCpuSnapshot()
    const totalDiff = nextSnapshot.total - previousSnapshot.total
    const idleDiff = nextSnapshot.idle - previousSnapshot.idle

    if (totalDiff > 0) {
      currentCpuUsagePercent = Math.round((1 - idleDiff / totalDiff) * 100)
    }

    previousSnapshot = nextSnapshot
  }

  updateSnapshot()

  const timer = setInterval(updateSnapshot, 1000)

  timer.unref?.()

  return () => currentCpuUsagePercent
}

const expandHomeToken = (pathValue: string) =>
  pathValue
    .replace(/\$\{HOME\}/g, homedir())
    .replace(/\$HOME/g, homedir())

const readXdgDesktopDirectory = () => {
  const userDirectoryFilePath = join(homedir(), '.config', 'user-dirs.dirs')

  if (!existsSync(userDirectoryFilePath)) {
    return ''
  }

  const fileContent = readFileSync(userDirectoryFilePath, 'utf8')
  const desktopLine = fileContent
    .split('\n')
    .find((line) => line.startsWith('XDG_DESKTOP_DIR='))

  if (!desktopLine) {
    return ''
  }

  const rawPathValue = desktopLine.split('=').slice(1).join('=').trim()
  const normalizedPathValue = rawPathValue.replace(/^"/, '').replace(/"$/, '')

  return expandHomeToken(normalizedPathValue)
}

const mergeWarnings = (...messages: string[]) =>
  messages.filter((message) => message.trim()).join(' / ')

const readDirectoryOverride = () => {
  const trimmedOverride = desktopDirectoryOverride.trim()

  return trimmedOverride && existsSync(trimmedOverride) ? trimmedOverride : ''
}

const readDesktopDirectoryRoot = (): DirectoryRoot => {
  const desktopCandidates = [
    readDirectoryOverride(),
    readXdgDesktopDirectory(),
    join(homedir(), 'Desktop'),
    join(homedir(), '바탕화면'),
  ]

  const resolvedPath = desktopCandidates.find((candidate) => candidate && existsSync(candidate))

  if (resolvedPath) {
    return {
      path: resolvedPath,
      warningMessage: '',
    }
  }

  return {
    path: homedir(),
    warningMessage: 'Desktop directory was not found, showing the home directory instead',
  }
}

export const resolveDesktopDirectory = () => readDesktopDirectoryRoot().path

export const sortFolderItems = (items: LocalFolderItem[]) =>
  [...items].sort((leftItem, rightItem) => {
    if (leftItem.kind !== rightItem.kind) {
      return leftItem.kind === 'directory' ? -1 : 1
    }

    return leftItem.name.localeCompare(rightItem.name, 'ko')
  })

export const resolveFolderTarget = (
  requestedFolderName: string,
  directoryNames: string[],
  desktopDisplayName = 'Desktop',
): FolderTarget => {
  const sortedDirectoryNames = [...directoryNames].sort((leftName, rightName) =>
    leftName.localeCompare(rightName, 'ko')
  )

  if (!requestedFolderName) {
    return sortedDirectoryNames[0]
      ? {
          folderName: sortedDirectoryNames[0],
          useDesktopRoot: false,
          warningMessage: '',
        }
      : {
          folderName: desktopDisplayName,
          useDesktopRoot: true,
          warningMessage: '',
        }
  }

  const exactMatch = sortedDirectoryNames.find((directoryName) => directoryName === requestedFolderName)

  if (exactMatch) {
    return {
      folderName: exactMatch,
      useDesktopRoot: false,
      warningMessage: '',
    }
  }

  const insensitiveMatch = sortedDirectoryNames.find(
    (directoryName) => directoryName.toLowerCase() === requestedFolderName.toLowerCase(),
  )

  if (insensitiveMatch) {
    return {
      folderName: insensitiveMatch,
      useDesktopRoot: false,
      warningMessage: '',
    }
  }

  return {
    folderName: desktopDisplayName,
    useDesktopRoot: true,
    warningMessage: `Could not find "${requestedFolderName}" on Desktop`,
  }
}

const readFolderItems = async (directoryPath: string) => {
  const entries = await readdir(directoryPath, {
    withFileTypes: true,
  })

  return sortFolderItems(
    entries.map((entry) => ({
      name: entry.name,
      kind: entry.isDirectory() ? 'directory' : 'file',
    })),
  )
}

const sendJsonResponse = (
  response: ServerResponse,
  statusCode: number,
  payload: LocalDesktopFolderResponse | LocalSystemMetricsResponse | { message: string },
) => {
  response.statusCode = statusCode
  response.setHeader('Content-Type', 'application/json; charset=utf-8')
  response.end(JSON.stringify(payload))
}

const createLocalApiMiddleware = () => {
  const getCpuUsagePercent = createCpuUsageSampler()

  return async (request: IncomingMessage, response: ServerResponse, next: NextFunction) => {
    if (!request.url) {
      next()
      return
    }

    const requestUrl = new URL(request.url, 'http://localhost')

    if (requestUrl.pathname === '/api/system/metrics') {
      sendJsonResponse(response, 200, {
        cpuUsagePercent: getCpuUsagePercent(),
      })
      return
    }

    if (requestUrl.pathname !== '/api/desktop/folder') {
      next()
      return
    }

    try {
      const desktopRoot = readDesktopDirectoryRoot()
      const desktopPath = desktopRoot.path
      const desktopEntries = await readdir(desktopPath, {
        withFileTypes: true,
      })
      const directoryNames = desktopEntries
        .filter((entry) => entry.isDirectory())
        .map((entry) => entry.name)
      const requestedFolderName = requestUrl.searchParams.get('folder')?.trim() ?? ''
      const folderTarget = resolveFolderTarget(
        requestedFolderName,
        directoryNames,
        basename(desktopPath),
      )
      const folderPath = folderTarget.useDesktopRoot
        ? desktopPath
        : join(desktopPath, folderTarget.folderName)
      const items = await readFolderItems(folderPath)

      sendJsonResponse(response, 200, {
        desktopPath,
        folderName: folderTarget.folderName,
        folderPath,
        itemCount: items.length,
        items,
        isDesktopRoot: folderTarget.useDesktopRoot,
        warningMessage: mergeWarnings(
          desktopRoot.warningMessage,
          folderTarget.warningMessage,
        ),
      })
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Could not read local Desktop data'

      sendJsonResponse(response, 500, {
        message: errorMessage,
      })
    }
  }
}

export const createLocalApiPlugin = (): Plugin => {
  const middleware = createLocalApiMiddleware()

  return {
    name: 'local-desktop-api',
    configureServer(server) {
      server.middlewares.use((request, response, next) => {
        void middleware(request, response, next)
      })
    },
    configurePreviewServer(server) {
      server.middlewares.use((request, response, next) => {
        void middleware(request, response, next)
      })
    },
  }
}
