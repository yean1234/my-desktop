/*
 * This file is for rendering the retro desktop shell and the folder window.
 */
import type { DesktopState } from '../../utils/desktopState'
import {
  createFolderItemBadge,
  formatCpuUsage,
  formatFolderItemCount,
  formatTemperature,
} from '../../utils/formatters'

type ShellActionHandler = () => void

type DesktopShell = {
  render: (state: DesktopState) => void
  onRefreshClick: (handler: ShellActionHandler) => void
  onRetryWeatherClick: (handler: ShellActionHandler) => void
}

export const createDesktopShell = (container: HTMLElement): DesktopShell => {
  let refreshHandler: ShellActionHandler = () => {}
  let retryWeatherHandler: ShellActionHandler = () => {}

  container.innerHTML = `
    <div class="desktop-shell">
      <header class="desktop-shell__chrome">
        <div class="desktop-shell__brand">Poot OS</div>
        <div class="desktop-shell__breadcrumbs">
          <span class="desktop-shell__crumb">Folder</span>
          <span class="desktop-shell__crumb">Folder</span>
          <span class="desktop-shell__crumb">Disk</span>
        </div>
        <div class="desktop-shell__stats">
          <span>CPU: <strong data-cpu-value>--</strong></span>
          <span data-temperature-label>Temp: <strong data-temperature-value>--</strong></span>
        </div>
      </header>
      <div class="desktop-shell__workspace">
        <section class="desktop-shell__left-stage">
          <article class="retro-window retro-window--folder">
            <header class="retro-window__titlebar">
              <span class="retro-window__title" data-folder-title>Desktop</span>
              <div class="retro-window__controls" aria-hidden="true">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </header>
            <div class="retro-window__body retro-window__body--folder">
              <aside class="folder-window__menu">
                <button class="retro-button" type="button" data-refresh-button>Refresh</button>
                <button class="retro-button" type="button" data-weather-button>Weather</button>
                <div class="folder-window__menu-note">
                  Local Desktop folder
                </div>
              </aside>
              <section class="folder-window__content">
                <div class="folder-window__meta">
                  <strong data-folder-status>Reading local Desktop folder...</strong>
                  <span data-folder-path>--</span>
                </div>
                <div class="folder-window__grid" data-folder-grid></div>
                <div class="folder-window__footer">
                  <span data-folder-count>0 items</span>
                  <span data-folder-warning>--</span>
                </div>
              </section>
            </div>
          </article>
          <article class="retro-window retro-window--summary">
            <header class="retro-window__titlebar retro-window__titlebar--muted">
              <span class="retro-window__title">Desktop Notes</span>
              <div class="retro-window__controls" aria-hidden="true">
                <span></span>
                <span></span>
              </div>
            </header>
            <div class="summary-panel">
              <p class="summary-panel__headline">Left/right split stays close to the reference layout.</p>
              <dl class="summary-panel__facts">
                <div>
                  <dt>Open folder</dt>
                  <dd data-summary-folder>Desktop</dd>
                </div>
                <div>
                  <dt>Folder status</dt>
                  <dd data-summary-status>Loading</dd>
                </div>
                <div>
                  <dt>Visible preview</dt>
                  <dd data-summary-preview>Waiting for folder data...</dd>
                </div>
              </dl>
            </div>
          </article>
        </section>
        <aside class="desktop-shell__right-rail">
          <div class="desktop-shell__right-badges">
            <div class="rail-card rail-card--drive">Project</div>
            <div class="rail-card rail-card--disk">Disk</div>
            <div class="rail-card rail-card--drive">HD1</div>
          </div>
          <div class="desktop-shell__right-label">FILE</div>
          <div class="rail-blank-panel">
            <p>No GUI window here.</p>
            <p>This column keeps the reference rhythm.</p>
          </div>
          <div class="desktop-shell__trash">
            <div class="desktop-shell__trash-icon"></div>
            <span>Garbage</span>
          </div>
        </aside>
      </div>
    </div>
  `

  const cpuValueElement = container.querySelector<HTMLElement>('[data-cpu-value]')
  const temperatureValueElement = container.querySelector<HTMLElement>('[data-temperature-value]')
  const temperatureLabelElement = container.querySelector<HTMLElement>('[data-temperature-label]')
  const folderTitleElement = container.querySelector<HTMLElement>('[data-folder-title]')
  const folderStatusElement = container.querySelector<HTMLElement>('[data-folder-status]')
  const folderPathElement = container.querySelector<HTMLElement>('[data-folder-path]')
  const folderGridElement = container.querySelector<HTMLElement>('[data-folder-grid]')
  const folderCountElement = container.querySelector<HTMLElement>('[data-folder-count]')
  const folderWarningElement = container.querySelector<HTMLElement>('[data-folder-warning]')
  const summaryFolderElement = container.querySelector<HTMLElement>('[data-summary-folder]')
  const summaryStatusElement = container.querySelector<HTMLElement>('[data-summary-status]')
  const summaryPreviewElement = container.querySelector<HTMLElement>('[data-summary-preview]')
  const refreshButtonElement = container.querySelector<HTMLButtonElement>('[data-refresh-button]')
  const weatherButtonElement = container.querySelector<HTMLButtonElement>('[data-weather-button]')

  if (
    !cpuValueElement ||
    !temperatureValueElement ||
    !temperatureLabelElement ||
    !folderTitleElement ||
    !folderStatusElement ||
    !folderPathElement ||
    !folderGridElement ||
    !folderCountElement ||
    !folderWarningElement ||
    !summaryFolderElement ||
    !summaryStatusElement ||
    !summaryPreviewElement ||
    !refreshButtonElement ||
    !weatherButtonElement
  ) {
    throw new Error('Desktop shell UI is missing required elements')
  }

  refreshButtonElement.addEventListener('click', () => {
    refreshHandler()
  })

  weatherButtonElement.addEventListener('click', () => {
    retryWeatherHandler()
  })

  const createFolderItemElement = (itemName: string, itemKind: 'directory' | 'file') => {
    const folderItemElement = document.createElement('article')

    folderItemElement.className = `folder-item folder-item--${itemKind}`
    folderItemElement.innerHTML = `
      <div class="folder-item__icon" aria-hidden="true">
        <span>${createFolderItemBadge({ name: itemName, kind: itemKind })}</span>
      </div>
      <strong class="folder-item__name">${itemName}</strong>
    `

    return folderItemElement
  }

  return {
    render(state) {
      cpuValueElement.textContent = formatCpuUsage(state.cpuUsagePercent)
      temperatureValueElement.textContent = formatTemperature(
        state.temperatureCelsius,
        state.temperatureStatus === 'error',
      )
      temperatureLabelElement.dataset.state = state.temperatureStatus
      folderTitleElement.textContent = state.folderTitle
      folderStatusElement.textContent =
        state.folderStatus === 'loading'
          ? 'Reading local Desktop folder...'
          : state.folderStatus === 'error'
            ? 'Could not open the Desktop folder'
            : 'Folder window is live'
      folderPathElement.textContent = state.folderPath || 'Waiting for the Desktop path...'
      folderCountElement.textContent = formatFolderItemCount(state.folderItems.length)
      folderWarningElement.textContent = state.warningMessage || 'Live local folder view'
      summaryFolderElement.textContent = state.folderTitle
      summaryStatusElement.textContent = state.folderStatus
      summaryPreviewElement.textContent =
        state.folderItems.length > 0
          ? state.folderItems
              .slice(0, 4)
              .map((item) => item.name)
              .join(', ')
          : 'No items loaded yet'

      folderGridElement.replaceChildren(
        ...state.folderItems
          .slice(0, 8)
          .map((item) => createFolderItemElement(item.name, item.kind)),
      )
    },
    onRefreshClick(handler) {
      refreshHandler = handler
    },
    onRetryWeatherClick(handler) {
      retryWeatherHandler = handler
    },
  }
}
