/*
 * This file is for creating the desktop app shell and wiring live data.
 */
import { createDesktopShell } from './component/desktop/createDesktopShell'
import { preferredDesktopFolderName } from './config/desktopFolder'
import { fetchDesktopFolder, fetchSystemMetrics } from './service/localApi'
import { fetchLocalTemperature } from './service/localWeather'
import {
  createInitialDesktopState,
  dumpDesktopState,
  type DesktopState,
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
  let currentState = createInitialDesktopState(preferredDesktopFolderName)

  const render = () => {
    shell.render(currentState)
    const desktopWindow = window as DesktopWindow

    desktopWindow.dumpDesktopState = () => dumpDesktopState(currentState)
  }

  const updateState = (updater: (state: DesktopState) => DesktopState) => {
    currentState = updater(currentState)
    render()
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

  const loadDesktopFolder = async () => {
    updateState((state) => ({
      ...state,
      folderStatus: 'loading',
      warningMessage: '',
    }))

    try {
      const folder = await fetchDesktopFolder(preferredDesktopFolderName)

      updateState((state) => ({
        ...state,
        folderTitle: folder.folderName,
        folderPath: folder.folderPath,
        folderStatus: 'ready',
        folderItems: folder.items,
        warningMessage: folder.warningMessage,
      }))
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Could not read the Desktop folder'

      updateState((state) => ({
        ...state,
        folderStatus: 'error',
        folderItems: [],
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

  shell.onRefreshClick(() => {
    void loadCpuUsage()
    void loadDesktopFolder()
  })

  shell.onRetryWeatherClick(() => {
    void loadLocalTemperature()
  })

  render()
  void loadCpuUsage()
  void loadDesktopFolder()
  void loadLocalTemperature()

  window.setInterval(() => {
    void loadCpuUsage()
  }, 1500)

  window.setInterval(() => {
    void loadDesktopFolder()
  }, 30000)

  window.setInterval(() => {
    void loadLocalTemperature()
  }, 15 * 60 * 1000)

  return {
    appElement,
    desktopRootElement,
  }
}
