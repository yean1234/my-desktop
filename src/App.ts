/*
 * This file is for creating the desktop app shell and wiring live data.
 */
import { createDesktopShell } from './component/desktop/createDesktopShell'
import { fetchSystemMetrics } from './service/localApi'
import {
  isFolderPickerAbortError,
  pickLocalFolder,
} from './service/localFolderPicker'
import { fetchLocalTemperature } from './service/localWeather'
import {
  addTodoItem,
  cancelInternetNameDialog,
  cancelTodoComposer,
  closeTodoResetDialog,
  closeInternetWindow,
  confirmInternetName,
  createInitialDesktopState,
  dumpDesktopState,
  finishInternetLaunch,
  finishTodoItemRemoval,
  finishTodoComposer,
  openTodoResetDialog,
  openInternetNameDialog,
  openTodoComposer,
  resetTodoItems,
  startInternetLaunch,
  startTodoItemRemoval,
  rejectInternetNameConfirmation,
  requestInternetNameConfirmation,
  syncLocalTime,
  type DesktopState,
  type TodoSortMode,
  updateInternetLaunchProgress,
  updateTodoDraftText,
  updateTodoSortMode,
  updateInternetDraftName,
} from './utils/desktopState'

type DesktopWindow = Window & {
  dumpDesktopState?: () => string
}

export const createApp = () => {
  const appElement = document.querySelector<HTMLDivElement>('#app')
  const desktopRootElement = document.querySelector<HTMLDivElement>('#desktop-root')

  if (!appElement || !desktopRootElement) {
    throw new Error('Basic desktop HTML structure is missing')
  }

  const shell = createDesktopShell(desktopRootElement)
  let currentState = createInitialDesktopState()
  let internetLaunchTimeoutIds: number[] = []

  const render = () => {
    shell.render(currentState)
    const desktopWindow = window as DesktopWindow

    desktopWindow.dumpDesktopState = () => dumpDesktopState(currentState)
  }

  const updateState = (updater: (state: DesktopState) => DesktopState) => {
    currentState = updater(currentState)
    render()
  }

  const clearInternetLaunchTimeouts = () => {
    for (const timeoutId of internetLaunchTimeoutIds) {
      window.clearTimeout(timeoutId)
    }

    internetLaunchTimeoutIds = []
  }

  const loadCpuUsage = async () => {
    try {
      const metrics = await fetchSystemMetrics()

      updateState((state) => ({
        ...state,
        cpuUsagePercent: metrics.cpuUsagePercent,
      }))
    } catch {
      updateState((state) => ({
        ...state,
        cpuUsagePercent: null,
      }))
    }
  }

  const openFolderPicker = async () => {
    updateState((state) => ({
      ...state,
      folderStatus: 'loading',
      warningMessage: '',
    }))

    try {
      const folder = await pickLocalFolder()

      updateState((state) => ({
        ...state,
        folderTitle: folder.folderName,
        folderPath: folder.locationLabel,
        folderStatus: 'ready',
        folderItems: folder.items,
        warningMessage: folder.warningMessage,
      }))
    } catch (error) {
      if (isFolderPickerAbortError(error)) {
        updateState((state) => ({
          ...state,
          folderStatus: state.folderItems.length > 0 ? 'ready' : 'idle',
        }))

        return
      }

      const errorMessage =
        error instanceof Error ? error.message : 'Could not read the selected folder'

      updateState((state) => ({
        ...state,
        folderStatus: 'error',
        warningMessage: errorMessage,
      }))
    }
  }

  const loadLocalTemperature = async () => {
    updateState((state) => ({
      ...state,
      temperatureStatus: 'loading',
    }))

    try {
      const temperatureCelsius = await fetchLocalTemperature()

      updateState((state) => ({
        ...state,
        temperatureCelsius,
        temperatureStatus: 'ready',
      }))
    } catch {
      updateState((state) => ({
        ...state,
        temperatureCelsius: null,
        temperatureStatus: 'error',
      }))
    }
  }

  const showInternetWindow = () => {
    if (currentState.internetLaunchActive || currentState.internetWindowOpen) {
      return
    }

    clearInternetLaunchTimeouts()
    updateState((state) => startInternetLaunch(state))

    internetLaunchTimeoutIds = [
      window.setTimeout(() => {
        updateState((state) => updateInternetLaunchProgress(state, 30))
      }, 180),
      window.setTimeout(() => {
        updateState((state) => updateInternetLaunchProgress(state, 70))
      }, 460),
      window.setTimeout(() => {
        updateState((state) => updateInternetLaunchProgress(state, 100))
      }, 760),
      window.setTimeout(() => {
        updateState((state) => finishInternetLaunch(state))
        clearInternetLaunchTimeouts()
      }, 980),
    ]
  }

  const hideInternetWindow = () => {
    clearInternetLaunchTimeouts()
    updateState((state) => closeInternetWindow(state))
  }

  const showInternetNameDialog = () => {
    updateState((state) => openInternetNameDialog(state))
  }

  const hideInternetNameDialog = () => {
    updateState((state) => cancelInternetNameDialog(state))
  }

  const updateInternetName = (name: string) => {
    updateState((state) => updateInternetDraftName(state, name))
  }

  const showTodoComposer = () => {
    updateState((state) => openTodoComposer(state))
  }

  const hideTodoComposer = () => {
    updateState((state) => cancelTodoComposer(state))
  }

  const updateTodoDraft = (text: string) => {
    updateState((state) => updateTodoDraftText(state, text))
  }

  const saveTodoItem = () => {
    updateState((state) => addTodoItem(state))
  }

  const closeTodoComposer = () => {
    updateState((state) => finishTodoComposer(state))
  }

  const changeTodoSortMode = (todoSortMode: TodoSortMode) => {
    updateState((state) => updateTodoSortMode(state, todoSortMode))
  }

  const showTodoResetDialog = () => {
    if (currentState.todoItems.length === 0) {
      return
    }

    updateState((state) => openTodoResetDialog(state))
  }

  const hideTodoResetDialog = () => {
    updateState((state) => closeTodoResetDialog(state))
  }

  const clearTodoItems = () => {
    updateState((state) => resetTodoItems(state))
  }

  const completeTodoItem = (todoId: number) => {
    updateState((state) => startTodoItemRemoval(state, todoId))

    window.setTimeout(() => {
      updateState((state) => finishTodoItemRemoval(state, todoId))
    }, 320)
  }

  const askInternetNameConfirmation = () => {
    updateState((state) => requestInternetNameConfirmation(state))
  }

  const declineInternetNameConfirmation = () => {
    updateState((state) => rejectInternetNameConfirmation(state))
  }

  const acceptInternetNameConfirmation = () => {
    updateState((state) => confirmInternetName(state))
  }

  const refreshLocalTime = () => {
    updateState((state) => syncLocalTime(state))
  }

  shell.onOpenFolderClick(() => {
    void openFolderPicker()
  })

  shell.onOpenInternetClick(() => {
    showInternetWindow()
  })

  shell.onCloseInternetClick(() => {
    hideInternetWindow()
  })

  shell.onOpenInternetNameDialogClick(() => {
    showInternetNameDialog()
  })

  shell.onCancelInternetNameDialogClick(() => {
    hideInternetNameDialog()
  })

  shell.onInternetNameInput((value) => {
    updateInternetName(value)
  })

  shell.onConfirmInternetNameInputClick(() => {
    askInternetNameConfirmation()
  })

  shell.onOpenTodoComposerClick(() => {
    showTodoComposer()
  })

  shell.onCancelTodoComposerClick(() => {
    hideTodoComposer()
  })

  shell.onTodoDraftInput((value) => {
    updateTodoDraft(value)
  })

  shell.onAddTodoItem(() => {
    saveTodoItem()
  })

  shell.onCompleteTodoComposerClick(() => {
    closeTodoComposer()
  })

  shell.onCompleteTodoClick((todoId) => {
    completeTodoItem(todoId)
  })

  shell.onTodoSortChange((todoSortMode) => {
    changeTodoSortMode(todoSortMode)
  })

  shell.onOpenTodoResetDialogClick(() => {
    showTodoResetDialog()
  })

  shell.onRejectTodoResetClick(() => {
    hideTodoResetDialog()
  })

  shell.onStopTodoResetClick(() => {
    hideTodoResetDialog()
  })

  shell.onAcceptTodoResetClick(() => {
    clearTodoItems()
  })

  shell.onRejectInternetNameConfirmationClick(() => {
    declineInternetNameConfirmation()
  })

  shell.onAcceptInternetNameConfirmationClick(() => {
    acceptInternetNameConfirmation()
  })

  render()
  void loadCpuUsage()
  void loadLocalTemperature()

  window.setInterval(() => {
    void loadCpuUsage()
  }, 1500)

  window.setInterval(() => {
    void loadLocalTemperature()
  }, 15 * 60 * 1000)

  window.setInterval(() => {
    refreshLocalTime()
  }, 1000)

  return {
    appElement,
    desktopRootElement,
  }
}
