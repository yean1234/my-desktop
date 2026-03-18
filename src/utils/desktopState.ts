/*
 * This file is for storing and dumping the desktop layout state.
 */
import type { LocalFolderItem } from '../service/localApiTypes'
import { formatCpuUsage, formatLocalTime, formatTemperature } from './formatters'

export type LoadStatus = 'idle' | 'loading' | 'ready' | 'error'
export type InternetDialogMode = 'closed' | 'input' | 'confirm'
export type InternetTodoItemStatus = 'active' | 'removing'
export type TodoSortMode = 'latest' | 'oldest' | 'alphabetical'

export type InternetTodoItem = {
  id: number
  text: string
  status: InternetTodoItemStatus
}

export type DesktopState = {
  cpuUsagePercent: number | null
  temperatureCelsius: number | null
  temperatureStatus: LoadStatus
  internetLaunchActive: boolean
  internetLaunchProgress: number
  internetWindowOpen: boolean
  internetDialogMode: InternetDialogMode
  internetDraftName: string
  localTimeLabel: string
  nextTodoId: number
  todoComposerOpen: boolean
  todoDraftText: string
  todoItems: InternetTodoItem[]
  todoResetDialogOpen: boolean
  todoSortMode: TodoSortMode
  visitorName: string
  folderTitle: string
  folderPath: string
  folderStatus: LoadStatus
  folderItems: LocalFolderItem[]
  warningMessage: string
}

type FolderViewportState = Pick<DesktopState, 'folderItems' | 'folderStatus'>

export const createInitialDesktopState = (now = new Date()): DesktopState => ({
  cpuUsagePercent: null,
  temperatureCelsius: null,
  temperatureStatus: 'idle',
  internetLaunchActive: false,
  internetLaunchProgress: 0,
  internetWindowOpen: false,
  internetDialogMode: 'closed',
  internetDraftName: '',
  localTimeLabel: formatLocalTime(now),
  nextTodoId: 1,
  todoComposerOpen: false,
  todoDraftText: '',
  todoItems: [],
  todoResetDialogOpen: false,
  todoSortMode: 'latest',
  visitorName: '',
  folderTitle: 'No folder selected',
  folderPath: '',
  folderStatus: 'idle',
  folderItems: [],
  warningMessage: '',
})

export const hasVisibleFolderItems = (state: FolderViewportState) =>
  state.folderStatus === 'ready' && state.folderItems.length > 0

export const openInternetWindow = (state: DesktopState, now = new Date()): DesktopState => ({
  ...state,
  internetLaunchActive: false,
  internetLaunchProgress: 100,
  internetWindowOpen: true,
  localTimeLabel: formatLocalTime(now),
})

export const closeInternetWindow = (state: DesktopState): DesktopState => ({
  ...state,
  internetLaunchActive: false,
  internetLaunchProgress: 0,
  internetWindowOpen: false,
  internetDialogMode: 'closed',
  internetDraftName: state.visitorName,
  todoComposerOpen: false,
  todoDraftText: '',
  todoResetDialogOpen: false,
})

export const startInternetLaunch = (state: DesktopState): DesktopState => ({
  ...state,
  internetLaunchActive: true,
  internetLaunchProgress: 0,
  internetWindowOpen: false,
})

export const updateInternetLaunchProgress = (
  state: DesktopState,
  progress: number,
): DesktopState => ({
  ...state,
  internetLaunchActive: true,
  internetLaunchProgress: Math.max(0, Math.min(100, progress)),
})

export const finishInternetLaunch = (
  state: DesktopState,
  now = new Date(),
): DesktopState =>
  openInternetWindow(
    {
      ...state,
      internetLaunchActive: false,
      internetLaunchProgress: 100,
    },
    now,
  )

export const syncLocalTime = (state: DesktopState, now = new Date()): DesktopState => ({
  ...state,
  localTimeLabel: formatLocalTime(now),
})

export const openInternetNameDialog = (state: DesktopState): DesktopState => ({
  ...state,
  internetDialogMode: 'input',
  internetDraftName: state.visitorName,
})

export const updateInternetDraftName = (state: DesktopState, name: string): DesktopState => ({
  ...state,
  internetDraftName: name,
})

export const cancelInternetNameDialog = (state: DesktopState): DesktopState => ({
  ...state,
  internetDialogMode: 'closed',
  internetDraftName: state.visitorName,
})

export const requestInternetNameConfirmation = (state: DesktopState): DesktopState => {
  const trimmedName = state.internetDraftName.trim()

  if (!trimmedName) {
    return state
  }

  return {
    ...state,
    internetDialogMode: 'confirm',
    internetDraftName: trimmedName,
  }
}

export const rejectInternetNameConfirmation = (state: DesktopState): DesktopState => ({
  ...state,
  internetDialogMode: 'input',
})

export const confirmInternetName = (state: DesktopState): DesktopState => {
  const trimmedName = state.internetDraftName.trim()

  if (!trimmedName) {
    return state
  }

  return {
    ...state,
    internetDialogMode: 'closed',
    internetDraftName: trimmedName,
    visitorName: trimmedName,
  }
}

export const openTodoComposer = (state: DesktopState): DesktopState => ({
  ...state,
  todoComposerOpen: true,
})

export const updateTodoDraftText = (state: DesktopState, text: string): DesktopState => ({
  ...state,
  todoDraftText: text,
})

export const cancelTodoComposer = (state: DesktopState): DesktopState => ({
  ...state,
  todoComposerOpen: false,
  todoDraftText: '',
})

export const updateTodoSortMode = (
  state: DesktopState,
  todoSortMode: TodoSortMode,
): DesktopState => ({
  ...state,
  todoSortMode,
})

export const addTodoItem = (state: DesktopState): DesktopState => {
  const trimmedText = state.todoDraftText.trim()

  if (!trimmedText) {
    return state
  }

  return {
    ...state,
    nextTodoId: state.nextTodoId + 1,
    todoDraftText: '',
    todoItems: [
      ...state.todoItems,
      {
        id: state.nextTodoId,
        text: trimmedText,
        status: 'active',
      },
    ],
  }
}

export const finishTodoComposer = (state: DesktopState): DesktopState => {
  const nextState = addTodoItem(state)

  return {
    ...nextState,
    todoComposerOpen: false,
    todoDraftText: '',
  }
}

export const openTodoResetDialog = (state: DesktopState): DesktopState => ({
  ...state,
  todoResetDialogOpen: true,
})

export const closeTodoResetDialog = (state: DesktopState): DesktopState => ({
  ...state,
  todoResetDialogOpen: false,
})

export const resetTodoItems = (state: DesktopState): DesktopState => ({
  ...state,
  nextTodoId: 1,
  todoComposerOpen: false,
  todoDraftText: '',
  todoItems: [],
  todoResetDialogOpen: false,
})

export const startTodoItemRemoval = (state: DesktopState, todoId: number): DesktopState => ({
  ...state,
  todoItems: state.todoItems.map((item) =>
    item.id === todoId && item.status === 'active'
      ? { ...item, status: 'removing' }
      : item,
  ),
})

export const finishTodoItemRemoval = (state: DesktopState, todoId: number): DesktopState => ({
  ...state,
  todoItems: state.todoItems.filter((item) => item.id !== todoId),
})

export const getSortedTodoItems = (state: Pick<DesktopState, 'todoItems' | 'todoSortMode'>) => {
  const sortedItems = [...state.todoItems]

  if (state.todoSortMode === 'latest') {
    return sortedItems.sort((leftItem, rightItem) => rightItem.id - leftItem.id)
  }

  if (state.todoSortMode === 'oldest') {
    return sortedItems.sort((leftItem, rightItem) => leftItem.id - rightItem.id)
  }

  return sortedItems.sort((leftItem, rightItem) => {
    const compareResult = leftItem.text.localeCompare(rightItem.text, 'ko-KR')

    return compareResult || leftItem.id - rightItem.id
  })
}

export const dumpDesktopState = (state: DesktopState) => {
  const visibleItems = state.folderItems
    .slice(0, 6)
    .map((item) => `${item.kind}:${item.name}`)
    .join(', ')
  const todoItems = state.todoItems
    .map((item) => `${item.status}:${item.text}`)
    .join(', ')

  return [
    'desktop-layout',
    `cpu=${formatCpuUsage(state.cpuUsagePercent)}`,
    `temperature=${formatTemperature(
      state.temperatureCelsius,
      state.temperatureStatus === 'error',
    )}`,
    `temperatureStatus=${state.temperatureStatus}`,
    `internetLaunch=${state.internetLaunchActive ? 'loading' : 'idle'}`,
    `internetLaunchProgress=${state.internetLaunchProgress}%`,
    `internetWindow=${state.internetWindowOpen ? 'open' : 'closed'}`,
    `internetDialog=${state.internetDialogMode}`,
    `draftName=${state.internetDraftName || '-'}`,
    `localTime=${state.localTimeLabel}`,
    `todoComposer=${state.todoComposerOpen ? 'open' : 'closed'}`,
    `todoDraft=${state.todoDraftText || '-'}`,
    `todoCount=${state.todoItems.length}`,
    `todoItems=${todoItems || '-'}`,
    `todoResetDialog=${state.todoResetDialogOpen ? 'open' : 'closed'}`,
    `todoSort=${state.todoSortMode}`,
    `visitorName=${state.visitorName || '-'}`,
    `folder=${state.folderTitle}`,
    `path=${state.folderPath || '-'}`,
    `folderStatus=${state.folderStatus}`,
    `itemCount=${state.folderItems.length}`,
    `visibleItems=${visibleItems || '-'}`,
    `warning=${state.warningMessage || '-'}`,
  ].join('\n')
}
