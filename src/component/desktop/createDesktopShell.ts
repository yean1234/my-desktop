/*
 * This file is for assembling the desktop shell and wiring shared UI sections.
 */
import { faInternetExplorer } from '@fortawesome/free-brands-svg-icons'
import { icon } from '@fortawesome/fontawesome-svg-core'
import folderIconOneUrl from '../../assets/icons/File1.png'
import folderIconTwoUrl from '../../assets/icons/File2.png'
import folderIconThreeUrl from '../../assets/icons/File3.png'
import imageIconUrl from '../../assets/icons/Image.png'
import type { LocalFolderItem } from '../../service/localApiTypes'
import { usesImageFileIcon } from '../../utils/imageFileIcon'
import {
  getDeceptiveSortedTodoItems,
  getSortedTodoItems,
  hasVisibleFolderItems,
  type DesktopState,
  type TodoSortMode,
} from '../../utils/desktopState'
import { formatCpuUsage, formatTemperature } from '../../utils/formatters'
import { createDesktopShellMarkup } from './desktopShellMarkup'
import {
  bindBrowserSection,
  createBrowserSectionHandlers,
  renderBrowserSection,
} from './internetBrowserSection'

type ShellActionHandler = () => void
type ShellInputHandler = (value: string) => void
type ShellTodoHandler = (todoId: number) => void
type ShellTodoSortHandler = (todoSortMode: TodoSortMode) => void

type DesktopShell = {
  render: (state: DesktopState) => void
  onOpenFolderClick: (handler: ShellActionHandler) => void
  onOpenInternetClick: (handler: ShellActionHandler) => void
  onOpenDeceptiveInternetClick: (handler: ShellActionHandler) => void
  onCloseInternetClick: (handler: ShellActionHandler) => void
  onCloseDeceptiveInternetClick: (handler: ShellActionHandler) => void
  onOpenInternetNameDialogClick: (handler: ShellActionHandler) => void
  onOpenDeceptiveInternetNameDialogClick: (handler: ShellActionHandler) => void
  onCancelInternetNameDialogClick: (handler: ShellActionHandler) => void
  onCancelDeceptiveInternetNameDialogClick: (handler: ShellActionHandler) => void
  onConfirmInternetNameInputClick: (handler: ShellActionHandler) => void
  onConfirmDeceptiveInternetNameInputClick: (handler: ShellActionHandler) => void
  onRejectInternetNameConfirmationClick: (handler: ShellActionHandler) => void
  onRejectDeceptiveInternetNameConfirmationClick: (handler: ShellActionHandler) => void
  onAcceptInternetNameConfirmationClick: (handler: ShellActionHandler) => void
  onAcceptDeceptiveInternetNameConfirmationClick: (handler: ShellActionHandler) => void
  onInternetNameInput: (handler: ShellInputHandler) => void
  onDeceptiveInternetNameInput: (handler: ShellInputHandler) => void
  onOpenTodoComposerClick: (handler: ShellActionHandler) => void
  onOpenDeceptiveTodoComposerClick: (handler: ShellActionHandler) => void
  onCancelTodoComposerClick: (handler: ShellActionHandler) => void
  onCancelDeceptiveTodoComposerClick: (handler: ShellActionHandler) => void
  onAddTodoItem: (handler: ShellActionHandler) => void
  onAddDeceptiveTodoItem: (handler: ShellActionHandler) => void
  onCompleteTodoComposerClick: (handler: ShellActionHandler) => void
  onCompleteDeceptiveTodoComposerClick: (handler: ShellActionHandler) => void
  onTodoDraftInput: (handler: ShellInputHandler) => void
  onDeceptiveTodoDraftInput: (handler: ShellInputHandler) => void
  onCompleteTodoClick: (handler: ShellTodoHandler) => void
  onCompleteDeceptiveTodoClick: (handler: ShellTodoHandler) => void
  onTodoSortChange: (handler: ShellTodoSortHandler) => void
  onDeceptiveTodoSortChange: (handler: ShellTodoSortHandler) => void
  onOpenTodoResetDialogClick: (handler: ShellActionHandler) => void
  onOpenDeceptiveTodoResetDialogClick: (handler: ShellActionHandler) => void
  onRejectTodoResetClick: (handler: ShellActionHandler) => void
  onRejectDeceptiveTodoResetClick: (handler: ShellActionHandler) => void
  onCancelWholeTodoResetClick: (handler: ShellActionHandler) => void
  onCancelWholeDeceptiveTodoResetClick: (handler: ShellActionHandler) => void
  onStopTodoResetClick: (handler: ShellActionHandler) => void
  onStopDeceptiveTodoResetClick: (handler: ShellActionHandler) => void
  onAcceptTodoResetClick: (handler: ShellActionHandler) => void
  onAcceptDeceptiveTodoResetClick: (handler: ShellActionHandler) => void
}

const internetExplorerIconMarkup = icon(faInternetExplorer, {
  classes: ['desktop-shell__shortcut-icon'],
}).html.join('')

const deceptiveInternetExplorerIconMarkup = icon(faInternetExplorer, {
  classes: ['desktop-shell__shortcut-icon', 'desktop-shell__shortcut-icon--deceptive'],
}).html.join('')

const queryRequiredElement = <T extends Element>(container: ParentNode, selector: string) => {
  const element = container.querySelector<T>(selector)

  if (!element) {
    throw new Error('Desktop shell UI is missing required elements')
  }

  return element
}

const createVisitorHeadline = (visitorName: string) =>
  visitorName ? `${visitorName}님 환영합니다!` : '어서오세요 환영합니다!'

export const createDesktopShell = (container: HTMLElement): DesktopShell => {
  let openFolderHandler: ShellActionHandler = () => {}
  const internetBrowserHandlers = createBrowserSectionHandlers()
  const deceptiveInternetBrowserHandlers = createBrowserSectionHandlers()
  const directoryIconUrls = [folderIconOneUrl, folderIconTwoUrl, folderIconThreeUrl]
  const directoryIconByName = new Map<string, string>()

  container.innerHTML = createDesktopShellMarkup({
    internetExplorerIconMarkup,
    deceptiveInternetExplorerIconMarkup,
  })

  const cpuValueElement = queryRequiredElement<HTMLElement>(container, '[data-cpu-value]')
  const temperatureValueElement = queryRequiredElement<HTMLElement>(
    container,
    '[data-temperature-value]',
  )
  const temperatureLabelElement = queryRequiredElement<HTMLElement>(
    container,
    '[data-temperature-label]',
  )
  const folderTitleElement = queryRequiredElement<HTMLElement>(container, '[data-folder-title]')
  const folderStatusElement = queryRequiredElement<HTMLElement>(container, '[data-folder-status]')
  const folderPathElement = queryRequiredElement<HTMLElement>(container, '[data-folder-path]')
  const folderViewportElement = queryRequiredElement<HTMLElement>(
    container,
    '[data-folder-viewport]',
  )
  const folderCountElement = queryRequiredElement<HTMLElement>(container, '[data-folder-count]')
  const folderWarningElement = queryRequiredElement<HTMLElement>(
    container,
    '[data-folder-warning]',
  )
  const summaryFolderElement = queryRequiredElement<HTMLElement>(container, '[data-summary-folder]')
  const summaryStatusElement = queryRequiredElement<HTMLElement>(container, '[data-summary-status]')
  const summaryPreviewElement = queryRequiredElement<HTMLElement>(
    container,
    '[data-summary-preview]',
  )
  const openFolderButtonElement = queryRequiredElement<HTMLButtonElement>(
    container,
    '[data-open-folder-button]',
  )
  const internetBrowserElements = bindBrowserSection(
    container,
    'default',
    internetBrowserHandlers,
  )
  const deceptiveInternetBrowserElements = bindBrowserSection(
    container,
    'deceptive',
    deceptiveInternetBrowserHandlers,
  )

  openFolderButtonElement.addEventListener('click', () => {
    openFolderHandler()
  })

  const readDirectoryIconUrl = (itemName: string) => {
    const existingIconUrl = directoryIconByName.get(itemName)

    if (existingIconUrl) {
      return existingIconUrl
    }

    const nextIconUrl =
      directoryIconUrls[Math.floor(Math.random() * directoryIconUrls.length)] ??
      directoryIconUrls[0]

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

      const isAnyInternetLaunchActive =
        state.internetLaunchActive || state.deceptiveInternetLaunchActive

      renderBrowserSection(
        internetBrowserElements,
        {
          launchDisabled: isAnyInternetLaunchActive,
          launchActive: state.internetLaunchActive,
          launchProgress: state.internetLaunchProgress,
          windowOpen: state.internetWindowOpen,
          headline: createVisitorHeadline(state.visitorName),
          dialogMode: state.internetDialogMode,
          draftName: state.internetDraftName,
          localTimeLabel: state.localTimeLabel,
          todoComposerOpen: state.todoComposerOpen,
          todoDraftText: state.todoDraftText,
          sortedTodoItems: getSortedTodoItems(state),
          todoResetDialogMode: state.todoResetDialogMode,
          todoResetProgress: state.todoResetProgress,
          todoSortMode: state.todoSortMode,
        },
        internetBrowserHandlers.onCompleteTodoClick,
      )

      renderBrowserSection(
        deceptiveInternetBrowserElements,
        {
          launchDisabled: isAnyInternetLaunchActive,
          launchActive: state.deceptiveInternetLaunchActive,
          launchProgress: state.deceptiveInternetLaunchProgress,
          windowOpen: state.deceptiveInternetWindowOpen,
          headline: createVisitorHeadline(state.deceptiveVisitorName),
          dialogMode: state.deceptiveInternetDialogMode,
          draftName: state.deceptiveInternetDraftName,
          localTimeLabel: state.localTimeLabel,
          todoComposerOpen: state.deceptiveTodoComposerOpen,
          todoDraftText: state.deceptiveTodoDraftText,
          sortedTodoItems: getDeceptiveSortedTodoItems(state),
          todoResetDialogMode: state.deceptiveTodoResetDialogMode,
          todoResetProgress: state.deceptiveTodoResetProgress,
          todoSortMode: state.deceptiveTodoSortMode,
        },
        deceptiveInternetBrowserHandlers.onCompleteTodoClick,
      )

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
        ? state.folderItems.slice(0, 8).map((item) => createFolderItemElement(item))
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
    onOpenInternetClick(handler) {
      internetBrowserHandlers.onOpenClick = handler
    },
    onOpenDeceptiveInternetClick(handler) {
      deceptiveInternetBrowserHandlers.onOpenClick = handler
    },
    onCloseInternetClick(handler) {
      internetBrowserHandlers.onCloseClick = handler
    },
    onCloseDeceptiveInternetClick(handler) {
      deceptiveInternetBrowserHandlers.onCloseClick = handler
    },
    onOpenInternetNameDialogClick(handler) {
      internetBrowserHandlers.onOpenNameDialogClick = handler
    },
    onOpenDeceptiveInternetNameDialogClick(handler) {
      deceptiveInternetBrowserHandlers.onOpenNameDialogClick = handler
    },
    onCancelInternetNameDialogClick(handler) {
      internetBrowserHandlers.onCancelNameDialogClick = handler
    },
    onCancelDeceptiveInternetNameDialogClick(handler) {
      deceptiveInternetBrowserHandlers.onCancelNameDialogClick = handler
    },
    onConfirmInternetNameInputClick(handler) {
      internetBrowserHandlers.onConfirmNameInputClick = handler
    },
    onConfirmDeceptiveInternetNameInputClick(handler) {
      deceptiveInternetBrowserHandlers.onConfirmNameInputClick = handler
    },
    onRejectInternetNameConfirmationClick(handler) {
      internetBrowserHandlers.onRejectNameConfirmationClick = handler
    },
    onRejectDeceptiveInternetNameConfirmationClick(handler) {
      deceptiveInternetBrowserHandlers.onRejectNameConfirmationClick = handler
    },
    onAcceptInternetNameConfirmationClick(handler) {
      internetBrowserHandlers.onAcceptNameConfirmationClick = handler
    },
    onAcceptDeceptiveInternetNameConfirmationClick(handler) {
      deceptiveInternetBrowserHandlers.onAcceptNameConfirmationClick = handler
    },
    onInternetNameInput(handler) {
      internetBrowserHandlers.onNameInput = handler
    },
    onDeceptiveInternetNameInput(handler) {
      deceptiveInternetBrowserHandlers.onNameInput = handler
    },
    onOpenTodoComposerClick(handler) {
      internetBrowserHandlers.onOpenTodoComposerClick = handler
    },
    onOpenDeceptiveTodoComposerClick(handler) {
      deceptiveInternetBrowserHandlers.onOpenTodoComposerClick = handler
    },
    onCancelTodoComposerClick(handler) {
      internetBrowserHandlers.onCancelTodoComposerClick = handler
    },
    onCancelDeceptiveTodoComposerClick(handler) {
      deceptiveInternetBrowserHandlers.onCancelTodoComposerClick = handler
    },
    onAddTodoItem(handler) {
      internetBrowserHandlers.onAddTodoItem = handler
    },
    onAddDeceptiveTodoItem(handler) {
      deceptiveInternetBrowserHandlers.onAddTodoItem = handler
    },
    onCompleteTodoComposerClick(handler) {
      internetBrowserHandlers.onCompleteTodoComposerClick = handler
    },
    onCompleteDeceptiveTodoComposerClick(handler) {
      deceptiveInternetBrowserHandlers.onCompleteTodoComposerClick = handler
    },
    onTodoDraftInput(handler) {
      internetBrowserHandlers.onTodoDraftInput = handler
    },
    onDeceptiveTodoDraftInput(handler) {
      deceptiveInternetBrowserHandlers.onTodoDraftInput = handler
    },
    onCompleteTodoClick(handler) {
      internetBrowserHandlers.onCompleteTodoClick = handler
    },
    onCompleteDeceptiveTodoClick(handler) {
      deceptiveInternetBrowserHandlers.onCompleteTodoClick = handler
    },
    onTodoSortChange(handler) {
      internetBrowserHandlers.onTodoSortChange = handler
    },
    onDeceptiveTodoSortChange(handler) {
      deceptiveInternetBrowserHandlers.onTodoSortChange = handler
    },
    onOpenTodoResetDialogClick(handler) {
      internetBrowserHandlers.onOpenTodoResetDialogClick = handler
    },
    onOpenDeceptiveTodoResetDialogClick(handler) {
      deceptiveInternetBrowserHandlers.onOpenTodoResetDialogClick = handler
    },
    onRejectTodoResetClick(handler) {
      internetBrowserHandlers.onRejectTodoResetClick = handler
    },
    onRejectDeceptiveTodoResetClick(handler) {
      deceptiveInternetBrowserHandlers.onRejectTodoResetClick = handler
    },
    onCancelWholeTodoResetClick(handler) {
      internetBrowserHandlers.onCancelWholeTodoResetClick = handler
    },
    onCancelWholeDeceptiveTodoResetClick(handler) {
      deceptiveInternetBrowserHandlers.onCancelWholeTodoResetClick = handler
    },
    onStopTodoResetClick(handler) {
      internetBrowserHandlers.onStopTodoResetClick = handler
    },
    onStopDeceptiveTodoResetClick(handler) {
      deceptiveInternetBrowserHandlers.onStopTodoResetClick = handler
    },
    onAcceptTodoResetClick(handler) {
      internetBrowserHandlers.onAcceptTodoResetClick = handler
    },
    onAcceptDeceptiveTodoResetClick(handler) {
      deceptiveInternetBrowserHandlers.onAcceptTodoResetClick = handler
    },
  }
}
