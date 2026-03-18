/*
 * This file is for storing and dumping the desktop layout state.
 */
import type { LocalFolderItem } from '../service/localApiTypes'
import { formatCpuUsage, formatLocalTime, formatTemperature } from './formatters'

export type LoadStatus = 'idle' | 'loading' | 'ready' | 'error'
export type InternetDialogMode = 'closed' | 'input' | 'confirm'
export type InternetTodoItemStatus = 'active' | 'removing'
export type TodoSortMode = 'latest' | 'oldest' | 'alphabetical'
export type TodoResetDialogMode = 'closed' | 'confirm' | 'progress'
export type DeceptiveTodoComposerButton = 'complete' | 'cancel'
export type DeceptiveTodoComposerIntent = 'finish' | 'cancel'
export type DeceptiveTodoResetButton = 'accept' | 'reject'
export type DeceptiveTodoResetIntent = 'accept' | 'reject'

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
  deceptiveInternetLaunchActive: boolean
  deceptiveInternetLaunchProgress: number
  deceptiveInternetWindowOpen: boolean
  deceptiveInternetDialogMode: InternetDialogMode
  deceptiveInternetDraftName: string
  localTimeLabel: string
  nextTodoId: number
  todoComposerOpen: boolean
  todoDraftText: string
  todoItems: InternetTodoItem[]
  todoResetDialogMode: TodoResetDialogMode
  todoResetProgress: number
  todoResetSnapshotItems: InternetTodoItem[]
  todoResetSnapshotNextTodoId: number
  todoSortMode: TodoSortMode
  visitorName: string
  deceptiveNextTodoId: number
  deceptiveTodoComposerOpen: boolean
  deceptiveTodoDraftText: string
  deceptiveTodoItems: InternetTodoItem[]
  deceptiveTodoResetDialogMode: TodoResetDialogMode
  deceptiveTodoResetProgress: number
  deceptiveTodoResetSnapshotItems: InternetTodoItem[]
  deceptiveTodoResetSnapshotNextTodoId: number
  deceptiveTodoSortMode: TodoSortMode
  deceptiveVisitorName: string
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
  deceptiveInternetLaunchActive: false,
  deceptiveInternetLaunchProgress: 0,
  deceptiveInternetWindowOpen: false,
  deceptiveInternetDialogMode: 'closed',
  deceptiveInternetDraftName: '',
  localTimeLabel: formatLocalTime(now),
  nextTodoId: 1,
  todoComposerOpen: false,
  todoDraftText: '',
  todoItems: [],
  todoResetDialogMode: 'closed',
  todoResetProgress: 0,
  todoResetSnapshotItems: [],
  todoResetSnapshotNextTodoId: 1,
  todoSortMode: 'latest',
  visitorName: '',
  deceptiveNextTodoId: 1,
  deceptiveTodoComposerOpen: false,
  deceptiveTodoDraftText: '',
  deceptiveTodoItems: [],
  deceptiveTodoResetDialogMode: 'closed',
  deceptiveTodoResetProgress: 0,
  deceptiveTodoResetSnapshotItems: [],
  deceptiveTodoResetSnapshotNextTodoId: 1,
  deceptiveTodoSortMode: 'latest',
  deceptiveVisitorName: '',
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
  todoResetDialogMode: 'closed',
  todoResetProgress: 0,
  todoResetSnapshotItems: [],
  todoResetSnapshotNextTodoId: state.nextTodoId,
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

export const openDeceptiveInternetWindow = (
  state: DesktopState,
  now = new Date(),
): DesktopState => ({
  ...state,
  deceptiveInternetLaunchActive: false,
  deceptiveInternetLaunchProgress: 100,
  deceptiveInternetWindowOpen: true,
  localTimeLabel: formatLocalTime(now),
})

export const closeDeceptiveInternetWindow = (state: DesktopState): DesktopState => ({
  ...state,
  deceptiveInternetLaunchActive: false,
  deceptiveInternetLaunchProgress: 0,
  deceptiveInternetWindowOpen: false,
  deceptiveInternetDialogMode: 'closed',
  deceptiveInternetDraftName: state.deceptiveVisitorName,
  deceptiveTodoComposerOpen: false,
  deceptiveTodoDraftText: '',
  deceptiveTodoResetDialogMode: 'closed',
  deceptiveTodoResetProgress: 0,
  deceptiveTodoResetSnapshotItems: [],
  deceptiveTodoResetSnapshotNextTodoId: state.deceptiveNextTodoId,
})

export const startDeceptiveInternetLaunch = (state: DesktopState): DesktopState => ({
  ...state,
  deceptiveInternetLaunchActive: true,
  deceptiveInternetLaunchProgress: 0,
  deceptiveInternetWindowOpen: false,
})

export const updateDeceptiveInternetLaunchProgress = (
  state: DesktopState,
  progress: number,
): DesktopState => ({
  ...state,
  deceptiveInternetLaunchActive: true,
  deceptiveInternetLaunchProgress: Math.max(0, Math.min(100, progress)),
})

export const finishDeceptiveInternetLaunch = (
  state: DesktopState,
  now = new Date(),
): DesktopState =>
  openDeceptiveInternetWindow(
    {
      ...state,
      deceptiveInternetLaunchActive: false,
      deceptiveInternetLaunchProgress: 100,
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

export const openDeceptiveInternetNameDialog = (state: DesktopState): DesktopState => ({
  ...state,
  deceptiveInternetDialogMode: 'input',
  deceptiveInternetDraftName: state.deceptiveVisitorName,
})

export const updateDeceptiveInternetDraftName = (
  state: DesktopState,
  name: string,
): DesktopState => ({
  ...state,
  deceptiveInternetDraftName: name,
})

export const cancelDeceptiveInternetNameDialog = (state: DesktopState): DesktopState => ({
  ...state,
  deceptiveInternetDialogMode: 'closed',
  deceptiveInternetDraftName: state.deceptiveVisitorName,
})

export const requestDeceptiveInternetNameConfirmation = (state: DesktopState): DesktopState => {
  const trimmedName = state.deceptiveInternetDraftName.trim()

  if (!trimmedName) {
    return state
  }

  return {
    ...state,
    deceptiveInternetDialogMode: 'confirm',
    deceptiveInternetDraftName: trimmedName,
  }
}

export const rejectDeceptiveInternetNameConfirmation = (state: DesktopState): DesktopState => ({
  ...state,
  deceptiveInternetDialogMode: 'input',
})

export const confirmDeceptiveInternetName = (state: DesktopState): DesktopState => {
  const trimmedName = state.deceptiveInternetDraftName.trim()

  if (!trimmedName) {
    return state
  }

  return {
    ...state,
    deceptiveInternetDialogMode: 'closed',
    deceptiveInternetDraftName: trimmedName,
    deceptiveVisitorName: trimmedName,
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

export const openDeceptiveTodoComposer = (state: DesktopState): DesktopState => ({
  ...state,
  deceptiveTodoComposerOpen: true,
})

export const updateDeceptiveTodoDraftText = (
  state: DesktopState,
  text: string,
): DesktopState => ({
  ...state,
  deceptiveTodoDraftText: text,
})

export const cancelDeceptiveTodoComposer = (state: DesktopState): DesktopState => ({
  ...state,
  deceptiveTodoComposerOpen: false,
  deceptiveTodoDraftText: '',
})

export const updateDeceptiveTodoSortMode = (
  state: DesktopState,
  deceptiveTodoSortMode: TodoSortMode,
): DesktopState => ({
  ...state,
  deceptiveTodoSortMode,
})

export const addDeceptiveTodoItem = (state: DesktopState): DesktopState => {
  const trimmedText = state.deceptiveTodoDraftText.trim()

  if (!trimmedText) {
    return state
  }

  return {
    ...state,
    deceptiveNextTodoId: state.deceptiveNextTodoId + 1,
    deceptiveTodoDraftText: '',
    deceptiveTodoItems: [
      ...state.deceptiveTodoItems,
      {
        id: state.deceptiveNextTodoId,
        text: trimmedText,
        status: 'active',
      },
    ],
  }
}

export const finishDeceptiveTodoComposer = (state: DesktopState): DesktopState => {
  const nextState = addDeceptiveTodoItem(state)

  return {
    ...nextState,
    deceptiveTodoComposerOpen: false,
    deceptiveTodoDraftText: '',
  }
}

export const openTodoResetDialog = (state: DesktopState): DesktopState => ({
  ...state,
  todoResetDialogMode: 'confirm',
})

export const closeTodoResetDialog = (state: DesktopState): DesktopState => ({
  ...state,
  todoResetDialogMode: 'closed',
  todoResetProgress: 0,
  todoResetSnapshotItems: [],
  todoResetSnapshotNextTodoId: state.nextTodoId,
})

export const resetTodoItems = (state: DesktopState): DesktopState => ({
  ...state,
  nextTodoId: 1,
  todoComposerOpen: false,
  todoDraftText: '',
  todoItems: [],
  todoResetDialogMode: 'closed',
  todoResetProgress: 0,
  todoResetSnapshotItems: [],
  todoResetSnapshotNextTodoId: 1,
})

export const openDeceptiveTodoResetDialog = (state: DesktopState): DesktopState => ({
  ...state,
  deceptiveTodoResetDialogMode: 'confirm',
})

export const closeDeceptiveTodoResetDialog = (state: DesktopState): DesktopState => ({
  ...state,
  deceptiveTodoResetDialogMode: 'closed',
  deceptiveTodoResetProgress: 0,
  deceptiveTodoResetSnapshotItems: [],
  deceptiveTodoResetSnapshotNextTodoId: state.deceptiveNextTodoId,
})

export const startTodoResetProgress = (state: DesktopState): DesktopState => {
  if (state.todoItems.length === 0) {
    return state
  }

  return {
    ...state,
    todoResetDialogMode: 'progress',
    todoResetProgress: 0,
    todoResetSnapshotItems: state.todoItems.map((item) => ({ ...item })),
    todoResetSnapshotNextTodoId: state.nextTodoId,
  }
}

export const startDeceptiveTodoResetProgress = (state: DesktopState): DesktopState => {
  if (state.deceptiveTodoItems.length === 0) {
    return state
  }

  return {
    ...state,
    deceptiveTodoResetDialogMode: 'progress',
    deceptiveTodoResetProgress: 0,
    deceptiveTodoResetSnapshotItems: state.deceptiveTodoItems.map((item) => ({ ...item })),
    deceptiveTodoResetSnapshotNextTodoId: state.deceptiveNextTodoId,
  }
}

export const advanceTodoResetProgress = (state: DesktopState): DesktopState => {
  if (state.todoResetDialogMode !== 'progress') {
    return state
  }

  const nextItemToRemove = getSortedTodoItems(state)[0]

  if (!nextItemToRemove) {
    return {
      ...state,
      todoResetDialogMode: 'closed',
      todoResetProgress: 100,
      todoResetSnapshotItems: [],
      todoResetSnapshotNextTodoId: state.nextTodoId,
    }
  }

  const nextTodoItems = state.todoItems.filter((item) => item.id !== nextItemToRemove.id)
  const totalItemCount = state.todoResetSnapshotItems.length
  const deletedItemCount = totalItemCount - nextTodoItems.length
  const nextProgress =
    totalItemCount === 0 ? 100 : Math.round((deletedItemCount / totalItemCount) * 100)

  if (nextTodoItems.length === 0) {
    return {
      ...state,
      todoItems: [],
      todoResetDialogMode: 'closed',
      todoResetProgress: 100,
      todoResetSnapshotItems: [],
      todoResetSnapshotNextTodoId: state.nextTodoId,
    }
  }

  return {
    ...state,
    todoItems: nextTodoItems,
    todoResetProgress: nextProgress,
  }
}

export const advanceDeceptiveTodoResetProgress = (state: DesktopState): DesktopState => {
  if (state.deceptiveTodoResetDialogMode !== 'progress') {
    return state
  }

  const nextItemToRemove = getDeceptiveSortedTodoItems(state)[0]

  if (!nextItemToRemove) {
    return {
      ...state,
      deceptiveTodoResetDialogMode: 'closed',
      deceptiveTodoResetProgress: 100,
      deceptiveTodoResetSnapshotItems: [],
      deceptiveTodoResetSnapshotNextTodoId: state.deceptiveNextTodoId,
    }
  }

  const nextTodoItems = state.deceptiveTodoItems.filter(
    (item) => item.id !== nextItemToRemove.id,
  )
  const totalItemCount = state.deceptiveTodoResetSnapshotItems.length
  const deletedItemCount = totalItemCount - nextTodoItems.length
  const nextProgress =
    totalItemCount === 0 ? 100 : Math.round((deletedItemCount / totalItemCount) * 100)

  if (nextTodoItems.length === 0) {
    return {
      ...state,
      deceptiveTodoItems: [],
      deceptiveTodoResetDialogMode: 'closed',
      deceptiveTodoResetProgress: 100,
      deceptiveTodoResetSnapshotItems: [],
      deceptiveTodoResetSnapshotNextTodoId: state.deceptiveNextTodoId,
    }
  }

  return {
    ...state,
    deceptiveTodoItems: nextTodoItems,
    deceptiveTodoResetProgress: nextProgress,
  }
}

export const cancelTodoResetProgress = (state: DesktopState): DesktopState => {
  if (state.todoResetDialogMode !== 'progress') {
    return closeTodoResetDialog(state)
  }

  return {
    ...state,
    nextTodoId: state.todoResetSnapshotNextTodoId,
    todoItems: state.todoResetSnapshotItems.map((item) => ({ ...item })),
    todoResetDialogMode: 'closed',
    todoResetProgress: 0,
    todoResetSnapshotItems: [],
    todoResetSnapshotNextTodoId: state.todoResetSnapshotNextTodoId,
  }
}

export const cancelDeceptiveTodoResetProgress = (state: DesktopState): DesktopState => {
  if (state.deceptiveTodoResetDialogMode !== 'progress') {
    return closeDeceptiveTodoResetDialog(state)
  }

  return {
    ...state,
    deceptiveNextTodoId: state.deceptiveTodoResetSnapshotNextTodoId,
    deceptiveTodoItems: state.deceptiveTodoResetSnapshotItems.map((item) => ({ ...item })),
    deceptiveTodoResetDialogMode: 'closed',
    deceptiveTodoResetProgress: 0,
    deceptiveTodoResetSnapshotItems: [],
    deceptiveTodoResetSnapshotNextTodoId: state.deceptiveTodoResetSnapshotNextTodoId,
  }
}

export const stopTodoResetProgress = (state: DesktopState): DesktopState => ({
  ...state,
  todoResetDialogMode: 'closed',
  todoResetProgress: 0,
  todoResetSnapshotItems: [],
  todoResetSnapshotNextTodoId: state.nextTodoId,
})

export const stopDeceptiveTodoResetProgress = (state: DesktopState): DesktopState => ({
  ...state,
  deceptiveTodoResetDialogMode: 'closed',
  deceptiveTodoResetProgress: 0,
  deceptiveTodoResetSnapshotItems: [],
  deceptiveTodoResetSnapshotNextTodoId: state.deceptiveNextTodoId,
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

export const startDeceptiveTodoItemRemoval = (
  state: DesktopState,
  todoId: number,
): DesktopState => ({
  ...state,
  deceptiveTodoItems: state.deceptiveTodoItems.map((item) =>
    item.id === todoId && item.status === 'active'
      ? { ...item, status: 'removing' }
      : item,
  ),
})

export const finishDeceptiveTodoItemRemoval = (
  state: DesktopState,
  todoId: number,
): DesktopState => ({
  ...state,
  deceptiveTodoItems: state.deceptiveTodoItems.filter((item) => item.id !== todoId),
})

const sortTodoItems = (todoItems: InternetTodoItem[], todoSortMode: TodoSortMode) => {
  const sortedItems = [...todoItems]

  if (todoSortMode === 'latest') {
    return sortedItems.sort((leftItem, rightItem) => rightItem.id - leftItem.id)
  }

  if (todoSortMode === 'oldest') {
    return sortedItems.sort((leftItem, rightItem) => leftItem.id - rightItem.id)
  }

  return sortedItems.sort((leftItem, rightItem) => {
    const compareResult = leftItem.text.localeCompare(rightItem.text, 'ko-KR')

    return compareResult || leftItem.id - rightItem.id
  })
}

export const getDeceptiveTodoSortMode = (todoSortMode: TodoSortMode): TodoSortMode => {
  if (todoSortMode === 'latest') {
    return 'alphabetical'
  }

  if (todoSortMode === 'oldest') {
    return 'latest'
  }

  return 'oldest'
}

export const getDeceptiveTodoComposerIntent = (
  button: DeceptiveTodoComposerButton,
): DeceptiveTodoComposerIntent =>
  button === 'complete' ? 'cancel' : 'finish'

export const getDeceptiveTodoResetIntent = (
  button: DeceptiveTodoResetButton,
): DeceptiveTodoResetIntent =>
  button === 'accept' ? 'reject' : 'accept'

export const getSortedTodoItems = (state: Pick<DesktopState, 'todoItems' | 'todoSortMode'>) =>
  sortTodoItems(state.todoItems, state.todoSortMode)

export const getDeceptiveSortedTodoItems = (
  state: Pick<DesktopState, 'deceptiveTodoItems' | 'deceptiveTodoSortMode'>,
) => sortTodoItems(state.deceptiveTodoItems, getDeceptiveTodoSortMode(state.deceptiveTodoSortMode))

export const dumpDesktopState = (state: DesktopState) => {
  const visibleItems = state.folderItems
    .slice(0, 6)
    .map((item) => `${item.kind}:${item.name}`)
    .join(', ')
  const todoItems = state.todoItems
    .map((item) => `${item.status}:${item.text}`)
    .join(', ')
  const deceptiveTodoItems = state.deceptiveTodoItems
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
    `deceptiveInternetLaunch=${state.deceptiveInternetLaunchActive ? 'loading' : 'idle'}`,
    `deceptiveInternetLaunchProgress=${state.deceptiveInternetLaunchProgress}%`,
    `deceptiveInternetWindow=${state.deceptiveInternetWindowOpen ? 'open' : 'closed'}`,
    `deceptiveInternetDialog=${state.deceptiveInternetDialogMode}`,
    `deceptiveDraftName=${state.deceptiveInternetDraftName || '-'}`,
    `localTime=${state.localTimeLabel}`,
    `todoComposer=${state.todoComposerOpen ? 'open' : 'closed'}`,
    `todoDraft=${state.todoDraftText || '-'}`,
    `todoCount=${state.todoItems.length}`,
    `todoItems=${todoItems || '-'}`,
    `todoResetDialog=${state.todoResetDialogMode}`,
    `todoResetProgress=${state.todoResetProgress}%`,
    `todoSort=${state.todoSortMode}`,
    `visitorName=${state.visitorName || '-'}`,
    `deceptiveTodoComposer=${state.deceptiveTodoComposerOpen ? 'open' : 'closed'}`,
    `deceptiveTodoDraft=${state.deceptiveTodoDraftText || '-'}`,
    `deceptiveTodoCount=${state.deceptiveTodoItems.length}`,
    `deceptiveTodoItems=${deceptiveTodoItems || '-'}`,
    `deceptiveTodoResetDialog=${state.deceptiveTodoResetDialogMode}`,
    `deceptiveTodoResetProgress=${state.deceptiveTodoResetProgress}%`,
    `deceptiveTodoSort=${state.deceptiveTodoSortMode}`,
    `deceptiveVisitorName=${state.deceptiveVisitorName || '-'}`,
    `folder=${state.folderTitle}`,
    `path=${state.folderPath || '-'}`,
    `folderStatus=${state.folderStatus}`,
    `itemCount=${state.folderItems.length}`,
    `visibleItems=${visibleItems || '-'}`,
    `warning=${state.warningMessage || '-'}`,
  ].join('\n')
}
