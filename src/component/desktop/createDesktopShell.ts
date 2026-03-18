/*
 * This file is for rendering the retro desktop shell and the folder window.
 */
import { faInternetExplorer } from '@fortawesome/free-brands-svg-icons'
import { icon } from '@fortawesome/fontawesome-svg-core'
import folderIconOneUrl from '../../assets/icons/File1.png'
import folderIconTwoUrl from '../../assets/icons/File2.png'
import folderIconThreeUrl from '../../assets/icons/File3.png'
import imageIconUrl from '../../assets/icons/Image.png'
import type { LocalFolderItem } from '../../service/localApiTypes'
import { usesImageFileIcon } from '../../utils/imageFileIcon'
import { hasVisibleFolderItems, type DesktopState } from '../../utils/desktopState'
import {
  formatCpuUsage,
  formatTemperature,
} from '../../utils/formatters'

type ShellActionHandler = () => void

type DesktopShell = {
  render: (state: DesktopState) => void
  onOpenFolderClick: (handler: ShellActionHandler) => void
}

const internetExplorerIconMarkup = icon(faInternetExplorer, {
  classes: ['desktop-shell__shortcut-icon'],
}).html.join('')

export const createDesktopShell = (container: HTMLElement): DesktopShell => {
  let openFolderHandler: ShellActionHandler = () => {}
  const directoryIconUrls = [folderIconOneUrl, folderIconTwoUrl, folderIconThreeUrl]
  const directoryIconByName = new Map<string, string>()

  container.innerHTML = `
    <div class="desktop-shell">
      <header class="desktop-shell__chrome">
        <div class="desktop-shell__brand">Poot OS</div>
        <div class="desktop-shell__breadcrumbs"></div>
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
                <button class="retro-button retro-button--primary" type="button" data-open-folder-button>
                  Open folder
                </button>
                <div class="folder-window__menu-note"></div>
              </aside>
              <section class="folder-window__content">
                <div class="folder-window__meta">
                  <strong data-folder-status>Choose a folder to begin</strong>
                  <span data-folder-path>--</span>
                </div>
                <div class="folder-window__viewport folder-window__viewport--placeholder" data-folder-viewport></div>
                <div class="folder-window__footer">
                  <span data-folder-count></span>
                  <span data-folder-warning></span>
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
          <button
            class="desktop-shell__shortcut"
            type="button"
            data-desktop-internet-icon
            aria-label="Open Internet Explorer"
          >
            ${internetExplorerIconMarkup}
            <span class="desktop-shell__shortcut-label">Internet</span>
            <span class="desktop-shell__shortcut-label">Explorer</span>
          </button>
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
  const folderViewportElement = container.querySelector<HTMLElement>('[data-folder-viewport]')
  const folderCountElement = container.querySelector<HTMLElement>('[data-folder-count]')
  const folderWarningElement = container.querySelector<HTMLElement>('[data-folder-warning]')
  const summaryFolderElement = container.querySelector<HTMLElement>('[data-summary-folder]')
  const summaryStatusElement = container.querySelector<HTMLElement>('[data-summary-status]')
  const summaryPreviewElement = container.querySelector<HTMLElement>('[data-summary-preview]')
  const openFolderButtonElement = container.querySelector<HTMLButtonElement>('[data-open-folder-button]')

  if (
    !cpuValueElement ||
    !temperatureValueElement ||
    !temperatureLabelElement ||
    !folderTitleElement ||
    !folderStatusElement ||
    !folderPathElement ||
    !folderViewportElement ||
    !folderCountElement ||
    !folderWarningElement ||
    !summaryFolderElement ||
    !summaryStatusElement ||
    !summaryPreviewElement ||
    !openFolderButtonElement
  ) {
    throw new Error('Desktop shell UI is missing required elements')
  }

  openFolderButtonElement.addEventListener('click', () => {
    openFolderHandler()
  })

  const readDirectoryIconUrl = (itemName: string) => {
    const existingIconUrl = directoryIconByName.get(itemName)

    if (existingIconUrl) {
      return existingIconUrl
    }

    const nextIconUrl =
      directoryIconUrls[Math.floor(Math.random() * directoryIconUrls.length)] ?? directoryIconUrls[0]

    directoryIconByName.set(itemName, nextIconUrl)

    return nextIconUrl
  }

  const createFolderItemElement = (item: LocalFolderItem) => {
    const folderItemElement = document.createElement('article')
    const nameElement = document.createElement('strong')

    folderItemElement.className = `folder-entry folder-entry--${item.kind}`
    nameElement.className = 'folder-entry__name'
    nameElement.textContent = item.name

    if (item.kind === 'directory') {
      const imageElement = document.createElement('img')
      const iconUrl = readDirectoryIconUrl(item.name)

      imageElement.className = 'folder-entry__image'
      imageElement.src = iconUrl
      imageElement.alt = ''
      imageElement.draggable = false

      folderItemElement.append(imageElement)
    } else if (usesImageFileIcon(item.name)) {
      const imageElement = document.createElement('img')

      imageElement.className = 'folder-entry__image folder-entry__image--file'
      imageElement.src = imageIconUrl
      imageElement.alt = ''
      imageElement.draggable = false

      folderItemElement.append(imageElement)
    } else {
      const fileIconElement = document.createElement('span')

      fileIconElement.className = 'folder-entry__file-icon'
      fileIconElement.setAttribute('aria-hidden', 'true')

      folderItemElement.append(fileIconElement)
    }

    folderItemElement.append(nameElement)

    return folderItemElement
  }

  const createPlaceholderElement = (message: string) => {
    const placeholderElement = document.createElement('div')

    placeholderElement.className = 'folder-window__placeholder'
    placeholderElement.textContent = message

    return placeholderElement
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
      openFolderButtonElement.disabled = state.folderStatus === 'loading'
      openFolderButtonElement.textContent =
        state.folderStatus === 'loading' ? 'Opening...' : 'Open folder'
      folderStatusElement.textContent =
        state.folderStatus === 'idle'
          ? 'Choose a folder with Open folder'
          : state.folderStatus === 'loading'
            ? 'Waiting for the browser folder picker...'
            : state.folderStatus === 'error'
              ? 'Could not open the selected folder'
              : 'Folder window is live'
      folderPathElement.textContent = state.folderPath || 'Browser privacy hides the full local path'
      folderCountElement.textContent = ''
      folderWarningElement.textContent = state.warningMessage
      summaryFolderElement.textContent = state.folderTitle
      summaryStatusElement.textContent = state.folderStatus
      const showFolderItems = hasVisibleFolderItems(state)

      summaryPreviewElement.textContent =
        showFolderItems
          ? state.folderItems
              .slice(0, 4)
              .map((item) => item.name)
              .join(', ')
          : state.folderStatus === 'idle'
            ? 'No folder selected yet'
            : state.folderStatus === 'loading'
              ? 'Waiting for folder data...'
            : 'No items loaded yet'

      const folderChildren = showFolderItems
        ? state.folderItems
            .slice(0, 8)
            .map((item) => createFolderItemElement(item))
        : [
            createPlaceholderElement(
              state.folderStatus === 'idle'
                ? 'Open folder to choose a local directory'
                : state.folderStatus === 'loading'
                  ? 'Waiting for your folder selection...'
                  : state.folderStatus === 'error'
                    ? state.warningMessage || 'Folder access failed'
                    : 'This folder is empty',
            ),
          ]

      folderViewportElement.className =
        showFolderItems
          ? 'folder-window__viewport folder-window__viewport--icons'
          : 'folder-window__viewport folder-window__viewport--placeholder'
      folderViewportElement.replaceChildren(...folderChildren)
    },
    onOpenFolderClick(handler) {
      openFolderHandler = handler
    },
  }
}
