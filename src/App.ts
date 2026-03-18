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
  addDeceptiveTodoItem,
  advanceTodoResetProgress,
  advanceDeceptiveTodoResetProgress,
  cancelInternetNameDialog,
  cancelDeceptiveInternetNameDialog,
  cancelTodoComposer,
  cancelDeceptiveTodoComposer,
  cancelTodoResetProgress,
  cancelDeceptiveTodoResetProgress,
  closeTodoResetDialog,
  closeDeceptiveTodoResetDialog,
  closeInternetWindow,
  closeDeceptiveInternetWindow,
  confirmInternetName,
  confirmDeceptiveInternetName,
  createInitialDesktopState,
  dumpDesktopState,
  finishInternetLaunch,
  finishDeceptiveInternetLaunch,
  finishTodoItemRemoval,
  finishDeceptiveTodoItemRemoval,
  finishTodoComposer,
  finishDeceptiveTodoComposer,
  getDeceptiveTodoComposerIntent,
  getDeceptiveTodoResetIntent,
  openTodoResetDialog,
  openDeceptiveTodoResetDialog,
  openInternetNameDialog,
  openDeceptiveInternetNameDialog,
  openTodoComposer,
  openDeceptiveTodoComposer,
  startInternetLaunch,
  startDeceptiveInternetLaunch,
  startTodoResetProgress,
  startDeceptiveTodoResetProgress,
  startTodoItemRemoval,
  startDeceptiveTodoItemRemoval,
  rejectInternetNameConfirmation,
  rejectDeceptiveInternetNameConfirmation,
  requestInternetNameConfirmation,
  requestDeceptiveInternetNameConfirmation,
  syncLocalTime,
  type DesktopState,
  type TodoSortMode,
  stopTodoResetProgress,
  stopDeceptiveTodoResetProgress,
  updateInternetLaunchProgress,
  updateDeceptiveInternetLaunchProgress,
  updateTodoDraftText,
  updateDeceptiveTodoDraftText,
  updateTodoSortMode,
  updateDeceptiveTodoSortMode,
  updateInternetDraftName,
  updateDeceptiveInternetDraftName,
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
  let deceptiveInternetLaunchTimeoutIds: number[] = []
  let todoResetIntervalId = 0
  let deceptiveTodoResetIntervalId = 0

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

  const clearDeceptiveInternetLaunchTimeouts = () => {
    for (const timeoutId of deceptiveInternetLaunchTimeoutIds) {
      window.clearTimeout(timeoutId)
    }

    deceptiveInternetLaunchTimeoutIds = []
  }

  const clearTodoResetInterval = () => {
    if (todoResetIntervalId === 0) {
      return
    }

    window.clearInterval(todoResetIntervalId)
    todoResetIntervalId = 0
  }

  const clearDeceptiveTodoResetInterval = () => {
    if (deceptiveTodoResetIntervalId === 0) {
      return
    }

    window.clearInterval(deceptiveTodoResetIntervalId)
    deceptiveTodoResetIntervalId = 0
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

  const hasOpenOrLaunchingInternetWindow = () =>
    currentState.internetLaunchActive ||
    currentState.internetWindowOpen ||
    currentState.deceptiveInternetLaunchActive ||
    currentState.deceptiveInternetWindowOpen

  const showInternetWindow = () => {
    if (hasOpenOrLaunchingInternetWindow()) {
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

  const showDeceptiveInternetWindow = () => {
    if (hasOpenOrLaunchingInternetWindow()) {
      return
    }

    clearDeceptiveInternetLaunchTimeouts()
    updateState((state) => startDeceptiveInternetLaunch(state))

    deceptiveInternetLaunchTimeoutIds = [
      window.setTimeout(() => {
        updateState((state) => updateDeceptiveInternetLaunchProgress(state, 30))
      }, 180),
      window.setTimeout(() => {
        updateState((state) => updateDeceptiveInternetLaunchProgress(state, 70))
      }, 460),
      window.setTimeout(() => {
        updateState((state) => updateDeceptiveInternetLaunchProgress(state, 100))
      }, 760),
      window.setTimeout(() => {
        updateState((state) => finishDeceptiveInternetLaunch(state))
        clearDeceptiveInternetLaunchTimeouts()
      }, 980),
    ]
  }

  const hideInternetWindow = () => {
    clearInternetLaunchTimeouts()
    clearTodoResetInterval()
    updateState((state) => closeInternetWindow(state))
  }

  const hideDeceptiveInternetWindow = () => {
    clearDeceptiveInternetLaunchTimeouts()
    clearDeceptiveTodoResetInterval()
    updateState((state) => closeDeceptiveInternetWindow(state))
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

  const showDeceptiveInternetNameDialog = () => {
    updateState((state) => openDeceptiveInternetNameDialog(state))
  }

  const hideDeceptiveInternetNameDialog = () => {
    updateState((state) => cancelDeceptiveInternetNameDialog(state))
  }

  const updateDeceptiveInternetName = (name: string) => {
    updateState((state) => updateDeceptiveInternetDraftName(state, name))
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

  const showDeceptiveTodoComposer = () => {
    updateState((state) => openDeceptiveTodoComposer(state))
  }

  const hideDeceptiveTodoComposer = () => {
    updateState((state) => cancelDeceptiveTodoComposer(state))
  }

  const updateDeceptiveTodoDraft = (text: string) => {
    updateState((state) => updateDeceptiveTodoDraftText(state, text))
  }

  const saveDeceptiveTodoItem = () => {
    updateState((state) => addDeceptiveTodoItem(state))
  }

  const closeDeceptiveTodoComposer = () => {
    updateState((state) => finishDeceptiveTodoComposer(state))
  }

  const changeTodoSortMode = (todoSortMode: TodoSortMode) => {
    updateState((state) => updateTodoSortMode(state, todoSortMode))
  }

  const changeDeceptiveTodoSortMode = (todoSortMode: TodoSortMode) => {
    updateState((state) => updateDeceptiveTodoSortMode(state, todoSortMode))
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

  const showDeceptiveTodoResetDialog = () => {
    if (currentState.deceptiveTodoItems.length === 0) {
      return
    }

    updateState((state) => openDeceptiveTodoResetDialog(state))
  }

  const hideDeceptiveTodoResetDialog = () => {
    updateState((state) => closeDeceptiveTodoResetDialog(state))
  }

  const startTodoReset = () => {
    clearTodoResetInterval()
    updateState((state) => startTodoResetProgress(state))

    todoResetIntervalId = window.setInterval(() => {
      updateState((state) => advanceTodoResetProgress(state))

      if (currentState.todoResetDialogMode !== 'progress') {
        clearTodoResetInterval()
      }
    }, 1000)
  }

  const startDeceptiveTodoReset = () => {
    clearDeceptiveTodoResetInterval()
    updateState((state) => startDeceptiveTodoResetProgress(state))

    deceptiveTodoResetIntervalId = window.setInterval(() => {
      updateState((state) => advanceDeceptiveTodoResetProgress(state))

      if (currentState.deceptiveTodoResetDialogMode !== 'progress') {
        clearDeceptiveTodoResetInterval()
      }
    }, 1000)
  }

  const cancelWholeTodoReset = () => {
    clearTodoResetInterval()
    updateState((state) => cancelTodoResetProgress(state))
  }

  const cancelWholeDeceptiveTodoReset = () => {
    clearDeceptiveTodoResetInterval()
    updateState((state) => cancelDeceptiveTodoResetProgress(state))
  }

  const stopTodoReset = () => {
    clearTodoResetInterval()
    updateState((state) => stopTodoResetProgress(state))
  }

  const stopDeceptiveTodoReset = () => {
    clearDeceptiveTodoResetInterval()
    updateState((state) => stopDeceptiveTodoResetProgress(state))
  }

  const completeTodoItem = (todoId: number) => {
    updateState((state) => startTodoItemRemoval(state, todoId))

    window.setTimeout(() => {
      updateState((state) => finishTodoItemRemoval(state, todoId))
    }, 320)
  }

  const completeDeceptiveTodoItem = (todoId: number) => {
    updateState((state) => startDeceptiveTodoItemRemoval(state, todoId))

    window.setTimeout(() => {
      updateState((state) => finishDeceptiveTodoItemRemoval(state, todoId))
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

  const askDeceptiveInternetNameConfirmation = () => {
    updateState((state) => requestDeceptiveInternetNameConfirmation(state))
  }

  const declineDeceptiveInternetNameConfirmation = () => {
    updateState((state) => rejectDeceptiveInternetNameConfirmation(state))
  }

  const acceptDeceptiveInternetNameConfirmation = () => {
    updateState((state) => confirmDeceptiveInternetName(state))
  }

  const runDeceptiveTodoComposerButton = (button: 'complete' | 'cancel') => {
    const nextIntent = getDeceptiveTodoComposerIntent(button)

    if (nextIntent === 'finish') {
      closeDeceptiveTodoComposer()
      return
    }

    hideDeceptiveTodoComposer()
  }

  const runDeceptiveTodoResetButton = (button: 'accept' | 'reject') => {
    const nextIntent = getDeceptiveTodoResetIntent(button)

    if (nextIntent === 'accept') {
      startDeceptiveTodoReset()
      return
    }

    hideDeceptiveTodoResetDialog()
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

  shell.onOpenDeceptiveInternetClick(() => {
    showDeceptiveInternetWindow()
  })

  shell.onCloseInternetClick(() => {
    hideInternetWindow()
  })

  shell.onCloseDeceptiveInternetClick(() => {
    hideDeceptiveInternetWindow()
  })

  shell.onOpenInternetNameDialogClick(() => {
    showInternetNameDialog()
  })

  shell.onOpenDeceptiveInternetNameDialogClick(() => {
    showDeceptiveInternetNameDialog()
  })

  shell.onCancelInternetNameDialogClick(() => {
    hideInternetNameDialog()
  })

  shell.onCancelDeceptiveInternetNameDialogClick(() => {
    hideDeceptiveInternetNameDialog()
  })

  shell.onInternetNameInput((value) => {
    updateInternetName(value)
  })

  shell.onDeceptiveInternetNameInput((value) => {
    updateDeceptiveInternetName(value)
  })

  shell.onConfirmInternetNameInputClick(() => {
    askInternetNameConfirmation()
  })

  shell.onConfirmDeceptiveInternetNameInputClick(() => {
    askDeceptiveInternetNameConfirmation()
  })

  shell.onOpenTodoComposerClick(() => {
    showTodoComposer()
  })

  shell.onOpenDeceptiveTodoComposerClick(() => {
    showDeceptiveTodoComposer()
  })

  shell.onCancelTodoComposerClick(() => {
    hideTodoComposer()
  })

  shell.onCancelDeceptiveTodoComposerClick(() => {
    runDeceptiveTodoComposerButton('cancel')
  })

  shell.onTodoDraftInput((value) => {
    updateTodoDraft(value)
  })

  shell.onDeceptiveTodoDraftInput((value) => {
    updateDeceptiveTodoDraft(value)
  })

  shell.onAddTodoItem(() => {
    saveTodoItem()
  })

  shell.onAddDeceptiveTodoItem(() => {
    saveDeceptiveTodoItem()
  })

  shell.onCompleteTodoComposerClick(() => {
    closeTodoComposer()
  })

  shell.onCompleteDeceptiveTodoComposerClick(() => {
    runDeceptiveTodoComposerButton('complete')
  })

  shell.onCompleteTodoClick((todoId) => {
    completeTodoItem(todoId)
  })

  shell.onCompleteDeceptiveTodoClick((todoId) => {
    completeDeceptiveTodoItem(todoId)
  })

  shell.onTodoSortChange((todoSortMode) => {
    changeTodoSortMode(todoSortMode)
  })

  shell.onDeceptiveTodoSortChange((todoSortMode) => {
    changeDeceptiveTodoSortMode(todoSortMode)
  })

  shell.onOpenTodoResetDialogClick(() => {
    showTodoResetDialog()
  })

  shell.onOpenDeceptiveTodoResetDialogClick(() => {
    showDeceptiveTodoResetDialog()
  })

  shell.onRejectTodoResetClick(() => {
    hideTodoResetDialog()
  })

  shell.onRejectDeceptiveTodoResetClick(() => {
    runDeceptiveTodoResetButton('reject')
  })

  shell.onAcceptTodoResetClick(() => {
    startTodoReset()
  })

  shell.onAcceptDeceptiveTodoResetClick(() => {
    runDeceptiveTodoResetButton('accept')
  })

  shell.onCancelWholeTodoResetClick(() => {
    cancelWholeTodoReset()
  })

  shell.onCancelWholeDeceptiveTodoResetClick(() => {
    cancelWholeDeceptiveTodoReset()
  })

  shell.onStopTodoResetClick(() => {
    stopTodoReset()
  })

  shell.onStopDeceptiveTodoResetClick(() => {
    stopDeceptiveTodoReset()
  })

  shell.onRejectInternetNameConfirmationClick(() => {
    declineInternetNameConfirmation()
  })

  shell.onRejectDeceptiveInternetNameConfirmationClick(() => {
    declineDeceptiveInternetNameConfirmation()
  })

  shell.onAcceptInternetNameConfirmationClick(() => {
    acceptInternetNameConfirmation()
  })

  shell.onAcceptDeceptiveInternetNameConfirmationClick(() => {
    acceptDeceptiveInternetNameConfirmation()
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
