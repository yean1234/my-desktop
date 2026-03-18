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
import {
  getSortedTodoItems,
  hasVisibleFolderItems,
  type DesktopState,
  type InternetTodoItem,
  type TodoSortMode,
} from '../../utils/desktopState'
import {
  formatCpuUsage,
  formatTemperature,
} from '../../utils/formatters'

type ShellActionHandler = () => void
type ShellInputHandler = (value: string) => void
type ShellTodoHandler = (todoId: number) => void
type ShellTodoSortHandler = (todoSortMode: TodoSortMode) => void

type DesktopShell = {
  render: (state: DesktopState) => void
  onOpenFolderClick: (handler: ShellActionHandler) => void
  onOpenInternetClick: (handler: ShellActionHandler) => void
  onCloseInternetClick: (handler: ShellActionHandler) => void
  onOpenInternetNameDialogClick: (handler: ShellActionHandler) => void
  onCancelInternetNameDialogClick: (handler: ShellActionHandler) => void
  onConfirmInternetNameInputClick: (handler: ShellActionHandler) => void
  onRejectInternetNameConfirmationClick: (handler: ShellActionHandler) => void
  onAcceptInternetNameConfirmationClick: (handler: ShellActionHandler) => void
  onInternetNameInput: (handler: ShellInputHandler) => void
  onOpenTodoComposerClick: (handler: ShellActionHandler) => void
  onCancelTodoComposerClick: (handler: ShellActionHandler) => void
  onAddTodoItem: (handler: ShellActionHandler) => void
  onCompleteTodoComposerClick: (handler: ShellActionHandler) => void
  onTodoDraftInput: (handler: ShellInputHandler) => void
  onCompleteTodoClick: (handler: ShellTodoHandler) => void
  onTodoSortChange: (handler: ShellTodoSortHandler) => void
  onOpenTodoResetDialogClick: (handler: ShellActionHandler) => void
  onRejectTodoResetClick: (handler: ShellActionHandler) => void
  onStopTodoResetClick: (handler: ShellActionHandler) => void
  onAcceptTodoResetClick: (handler: ShellActionHandler) => void
}

const isTodoSortMode = (value: string): value is TodoSortMode =>
  value === 'latest' || value === 'oldest' || value === 'alphabetical'

const internetExplorerIconMarkup = icon(faInternetExplorer, {
  classes: ['desktop-shell__shortcut-icon'],
}).html.join('')

export const createDesktopShell = (container: HTMLElement): DesktopShell => {
  let openFolderHandler: ShellActionHandler = () => {}
  let openInternetHandler: ShellActionHandler = () => {}
  let closeInternetHandler: ShellActionHandler = () => {}
  let openInternetNameDialogHandler: ShellActionHandler = () => {}
  let cancelInternetNameDialogHandler: ShellActionHandler = () => {}
  let confirmInternetNameInputHandler: ShellActionHandler = () => {}
  let rejectInternetNameConfirmationHandler: ShellActionHandler = () => {}
  let acceptInternetNameConfirmationHandler: ShellActionHandler = () => {}
  let internetNameInputHandler: ShellInputHandler = () => {}
  let openTodoComposerHandler: ShellActionHandler = () => {}
  let cancelTodoComposerHandler: ShellActionHandler = () => {}
  let addTodoItemHandler: ShellActionHandler = () => {}
  let completeTodoComposerHandler: ShellActionHandler = () => {}
  let todoDraftInputHandler: ShellInputHandler = () => {}
  let completeTodoHandler: ShellTodoHandler = () => {}
  let todoSortChangeHandler: ShellTodoSortHandler = () => {}
  let openTodoResetDialogHandler: ShellActionHandler = () => {}
  let rejectTodoResetHandler: ShellActionHandler = () => {}
  let stopTodoResetHandler: ShellActionHandler = () => {}
  let acceptTodoResetHandler: ShellActionHandler = () => {}
  let isInternetWindowClosing = false
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
        <section class="internet-launch-dialog" data-internet-launch-dialog hidden>
          <div class="internet-launch-dialog__panel">
            <p class="internet-launch-dialog__title">Internet Explorer를 여는 중...</p>
            <div
              class="internet-launch-dialog__track"
              data-internet-launch-track
              role="progressbar"
              aria-valuemin="0"
              aria-valuemax="100"
              aria-valuenow="0"
            >
              <div class="internet-launch-dialog__fill" data-internet-launch-fill></div>
            </div>
            <p class="internet-launch-dialog__value" data-internet-launch-value>0%</p>
          </div>
        </section>
        <article class="retro-window retro-window--internet" data-internet-window hidden>
          <header class="retro-window__titlebar retro-window__titlebar--internet">
            <span class="retro-window__title">my-desktop</span>
            <button
              class="retro-window__close-button"
              type="button"
              data-close-internet-window
              aria-label="Close internet window"
            >
              X
            </button>
          </header>
          <div class="internet-window__body">
            <p class="internet-window__eyebrow">WELCOME</p>
            <h2 class="internet-window__headline" data-internet-headline>어서오세요 환영합니다!</h2>
            <p class="internet-window__time-value" data-local-time-label>--</p>
            <div class="internet-window__action-row">
              <div class="internet-window__action-slot">
                <button class="internet-window__join-button" type="button" data-open-name-dialog-button>
                  이름 입력하기
                </button>
                <section class="internet-name-entry" data-name-entry-dialog hidden>
                  <input
                    class="internet-name-entry__input"
                    type="text"
                    maxlength="20"
                    data-name-input
                    placeholder="이름을 입력해주세요"
                  />
                  <div class="internet-name-entry__actions">
                    <button class="retro-button internet-name-entry__button" type="button" data-confirm-name-input-button>
                      확인
                    </button>
                    <button class="retro-button internet-name-entry__button" type="button" data-cancel-name-dialog-button>
                      취소
                    </button>
                  </div>
                </section>
              </div>
              <div class="internet-window__action-slot internet-window__action-slot--todo">
                <button class="internet-window__join-button internet-window__join-button--todo" type="button" data-open-todo-composer-button>
                  할 일 목록 작성하기
                </button>
                <section class="internet-todo-composer" data-todo-composer hidden>
                  <input
                    class="internet-todo-composer__input"
                    type="text"
                    maxlength="40"
                    data-todo-input
                    placeholder="할 일을 입력해주세요"
                  />
                  <div class="internet-todo-composer__actions">
                    <button class="retro-button internet-todo-composer__button" type="button" data-complete-todo-composer-button>
                      완료
                    </button>
                    <button class="retro-button internet-todo-composer__button" type="button" data-cancel-todo-composer-button>
                      취소
                    </button>
                  </div>
                </section>
              </div>
            </div>
            <section class="internet-todo-toolbar">
              <button class="retro-button internet-todo-reset-button" type="button" data-open-todo-reset-dialog-button>
                초기화
              </button>
            </section>
            <section class="internet-confirm-dialog" data-name-confirm-dialog hidden>
              <div class="internet-confirm-dialog__panel">
                <p class="internet-confirm-dialog__message">정말 이름을 바꾸시겠습니까?</p>
                <div class="internet-confirm-dialog__actions">
                  <button class="retro-button internet-confirm-dialog__button" type="button" data-reject-name-confirmation-button>
                    아니오
                  </button>
                  <button class="retro-button retro-button--primary internet-confirm-dialog__button" type="button" data-accept-name-confirmation-button>
                    예
                  </button>
                </div>
              </div>
            </section>
            <section class="internet-confirm-dialog internet-confirm-dialog--todo-reset" data-todo-reset-dialog hidden>
              <div class="internet-confirm-dialog__panel internet-confirm-dialog__panel--todo-reset">
                <p class="internet-confirm-dialog__message">정말 초기화하시겠습니까?</p>
                <div class="internet-confirm-dialog__actions internet-confirm-dialog__actions--triple">
                  <button class="retro-button retro-button--primary internet-confirm-dialog__button" type="button" data-accept-todo-reset-button>
                    예
                  </button>
                  <button class="retro-button internet-confirm-dialog__button" type="button" data-reject-todo-reset-button>
                    아니오
                  </button>
                  <button class="retro-button internet-confirm-dialog__button internet-confirm-dialog__button--stop" type="button" data-stop-todo-reset-button>
                    중지
                  </button>
                </div>
              </div>
            </section>
          </div>
          <section class="internet-todo-dock">
            <section class="internet-todo-stack" data-todo-list></section>
            <section class="internet-todo-sort-panel" data-todo-toolbar hidden>
              <div class="internet-sort-group" role="radiogroup" aria-label="할 일 목록 정렬방식">
                <label class="internet-sort-group__option">
                  <input
                    class="internet-sort-group__control"
                    type="radio"
                    name="internet-todo-sort"
                    value="latest"
                    data-todo-sort-input
                  />
                  <span>최신순</span>
                </label>
                <label class="internet-sort-group__option">
                  <input
                    class="internet-sort-group__control"
                    type="radio"
                    name="internet-todo-sort"
                    value="oldest"
                    data-todo-sort-input
                  />
                  <span>오래된 순</span>
                </label>
                <label class="internet-sort-group__option">
                  <input
                    class="internet-sort-group__control"
                    type="radio"
                    name="internet-todo-sort"
                    value="alphabetical"
                    data-todo-sort-input
                  />
                  <span>가나다순</span>
                </label>
              </div>
            </section>
          </section>
        </article>
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
  const openInternetButtonElement = container.querySelector<HTMLButtonElement>('[data-desktop-internet-icon]')
  const internetLaunchDialogElement = container.querySelector<HTMLElement>('[data-internet-launch-dialog]')
  const internetLaunchTrackElement = container.querySelector<HTMLElement>('[data-internet-launch-track]')
  const internetLaunchFillElement = container.querySelector<HTMLElement>('[data-internet-launch-fill]')
  const internetLaunchValueElement = container.querySelector<HTMLElement>('[data-internet-launch-value]')
  const closeInternetButtonElement = container.querySelector<HTMLButtonElement>('[data-close-internet-window]')
  const internetWindowElement = container.querySelector<HTMLElement>('[data-internet-window]')
  const internetHeadlineElement = container.querySelector<HTMLElement>('[data-internet-headline]')
  const localTimeLabelElement = container.querySelector<HTMLElement>('[data-local-time-label]')
  const openNameDialogButtonElement = container.querySelector<HTMLButtonElement>('[data-open-name-dialog-button]')
  const nameEntryDialogElement = container.querySelector<HTMLElement>('[data-name-entry-dialog]')
  const nameInputElement = container.querySelector<HTMLInputElement>('[data-name-input]')
  const cancelNameDialogButtonElement = container.querySelector<HTMLButtonElement>('[data-cancel-name-dialog-button]')
  const confirmNameInputButtonElement = container.querySelector<HTMLButtonElement>('[data-confirm-name-input-button]')
  const nameConfirmDialogElement = container.querySelector<HTMLElement>('[data-name-confirm-dialog]')
  const rejectNameConfirmationButtonElement = container.querySelector<HTMLButtonElement>('[data-reject-name-confirmation-button]')
  const acceptNameConfirmationButtonElement = container.querySelector<HTMLButtonElement>('[data-accept-name-confirmation-button]')
  const openTodoComposerButtonElement = container.querySelector<HTMLButtonElement>('[data-open-todo-composer-button]')
  const todoComposerElement = container.querySelector<HTMLElement>('[data-todo-composer]')
  const todoInputElement = container.querySelector<HTMLInputElement>('[data-todo-input]')
  const completeTodoComposerButtonElement = container.querySelector<HTMLButtonElement>('[data-complete-todo-composer-button]')
  const cancelTodoComposerButtonElement = container.querySelector<HTMLButtonElement>('[data-cancel-todo-composer-button]')
  const todoSortInputElements = container.querySelectorAll<HTMLInputElement>('[data-todo-sort-input]')
  const todoToolbarElement = container.querySelector<HTMLElement>('[data-todo-toolbar]')
  const openTodoResetDialogButtonElement = container.querySelector<HTMLButtonElement>('[data-open-todo-reset-dialog-button]')
  const todoResetDialogElement = container.querySelector<HTMLElement>('[data-todo-reset-dialog]')
  const acceptTodoResetButtonElement = container.querySelector<HTMLButtonElement>('[data-accept-todo-reset-button]')
  const rejectTodoResetButtonElement = container.querySelector<HTMLButtonElement>('[data-reject-todo-reset-button]')
  const stopTodoResetButtonElement = container.querySelector<HTMLButtonElement>('[data-stop-todo-reset-button]')
  const todoListElement = container.querySelector<HTMLElement>('[data-todo-list]')

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
    !openFolderButtonElement ||
    !openInternetButtonElement ||
    !internetLaunchDialogElement ||
    !internetLaunchTrackElement ||
    !internetLaunchFillElement ||
    !internetLaunchValueElement ||
    !closeInternetButtonElement ||
    !internetWindowElement ||
    !internetHeadlineElement ||
    !localTimeLabelElement ||
    !openNameDialogButtonElement ||
    !nameEntryDialogElement ||
    !nameInputElement ||
    !cancelNameDialogButtonElement ||
    !confirmNameInputButtonElement ||
    !nameConfirmDialogElement ||
    !rejectNameConfirmationButtonElement ||
    !acceptNameConfirmationButtonElement ||
    !openTodoComposerButtonElement ||
    !todoComposerElement ||
    !todoInputElement ||
    !completeTodoComposerButtonElement ||
    !cancelTodoComposerButtonElement ||
    todoSortInputElements.length !== 3 ||
    !todoToolbarElement ||
    !openTodoResetDialogButtonElement ||
    !todoResetDialogElement ||
    !acceptTodoResetButtonElement ||
    !rejectTodoResetButtonElement ||
    !stopTodoResetButtonElement ||
    !todoListElement
  ) {
    throw new Error('Desktop shell UI is missing required elements')
  }

  openFolderButtonElement.addEventListener('click', () => {
    openFolderHandler()
  })

  openInternetButtonElement.addEventListener('click', () => {
    openInternetHandler()
  })

  openNameDialogButtonElement.addEventListener('click', () => {
    openInternetNameDialogHandler()
  })

  nameInputElement.addEventListener('input', () => {
    internetNameInputHandler(nameInputElement.value)
  })

  nameInputElement.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' && nameInputElement.value.trim()) {
      confirmInternetNameInputHandler()
    }
  })

  cancelNameDialogButtonElement.addEventListener('click', () => {
    cancelInternetNameDialogHandler()
  })

  confirmNameInputButtonElement.addEventListener('click', () => {
    confirmInternetNameInputHandler()
  })

  openTodoComposerButtonElement.addEventListener('click', () => {
    openTodoComposerHandler()
  })

  todoInputElement.addEventListener('input', () => {
    todoDraftInputHandler(todoInputElement.value)
  })

  todoInputElement.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' && todoInputElement.value.trim()) {
      event.preventDefault()
      addTodoItemHandler()
    }
  })

  completeTodoComposerButtonElement.addEventListener('click', () => {
    completeTodoComposerHandler()
  })

  cancelTodoComposerButtonElement.addEventListener('click', () => {
    cancelTodoComposerHandler()
  })

  for (const todoSortInputElement of todoSortInputElements) {
    todoSortInputElement.addEventListener('change', () => {
      if (!todoSortInputElement.checked || !isTodoSortMode(todoSortInputElement.value)) {
        return
      }

      todoSortChangeHandler(todoSortInputElement.value)
    })
  }

  openTodoResetDialogButtonElement.addEventListener('click', () => {
    openTodoResetDialogHandler()
  })

  rejectTodoResetButtonElement.addEventListener('click', () => {
    rejectTodoResetHandler()
  })

  stopTodoResetButtonElement.addEventListener('click', () => {
    stopTodoResetHandler()
  })

  acceptTodoResetButtonElement.addEventListener('click', () => {
    acceptTodoResetHandler()
  })

  rejectNameConfirmationButtonElement.addEventListener('click', () => {
    rejectInternetNameConfirmationHandler()
  })

  acceptNameConfirmationButtonElement.addEventListener('click', () => {
    acceptInternetNameConfirmationHandler()
  })

  closeInternetButtonElement.addEventListener('click', () => {
    if (isInternetWindowClosing || internetWindowElement.hidden) {
      return
    }

    isInternetWindowClosing = true
    closeInternetButtonElement.disabled = true
    internetWindowElement.classList.add('retro-window--closing')

    window.setTimeout(() => {
      isInternetWindowClosing = false
      internetWindowElement.classList.remove('retro-window--closing')
      closeInternetButtonElement.disabled = false
      closeInternetHandler()
    }, 280)
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

  const createTodoBannerElement = (item: InternetTodoItem) => {
    const bannerElement = document.createElement('article')
    const labelElement = document.createElement('label')
    const checkboxElement = document.createElement('input')
    const textElement = document.createElement('span')

    bannerElement.className =
      item.status === 'removing'
        ? 'internet-todo-banner internet-todo-banner--removing'
        : 'internet-todo-banner'
    labelElement.className = 'internet-todo-banner__label'
    checkboxElement.className = 'internet-todo-banner__checkbox'
    checkboxElement.type = 'checkbox'
    checkboxElement.checked = item.status === 'removing'
    checkboxElement.disabled = item.status === 'removing'
    textElement.className = 'internet-todo-banner__text'
    textElement.textContent = item.text

    checkboxElement.addEventListener('change', () => {
      if (checkboxElement.checked) {
        completeTodoHandler(item.id)
      }
    })

    labelElement.append(checkboxElement, textElement)
    bannerElement.append(labelElement)

    return bannerElement
  }

  return {
    render(state) {
      cpuValueElement.textContent = formatCpuUsage(state.cpuUsagePercent)
      temperatureValueElement.textContent = formatTemperature(
        state.temperatureCelsius,
        state.temperatureStatus === 'error',
      )
      temperatureLabelElement.dataset.state = state.temperatureStatus
      openInternetButtonElement.disabled = state.internetLaunchActive
      internetLaunchDialogElement.hidden = !state.internetLaunchActive
      internetLaunchTrackElement.setAttribute('aria-valuenow', String(state.internetLaunchProgress))
      internetLaunchFillElement.style.width = `${state.internetLaunchProgress}%`
      internetLaunchValueElement.textContent = `${state.internetLaunchProgress}%`
      if (state.internetWindowOpen) {
        internetWindowElement.hidden = false
      } else if (!isInternetWindowClosing) {
        internetWindowElement.hidden = true
        internetWindowElement.classList.remove('retro-window--closing')
      }
      internetHeadlineElement.textContent = state.visitorName
        ? `${state.visitorName}님 환영합니다!`
        : '어서오세요 환영합니다!'
      openNameDialogButtonElement.hidden = state.internetDialogMode !== 'closed'
      nameEntryDialogElement.hidden = state.internetDialogMode !== 'input'
      nameConfirmDialogElement.hidden = state.internetDialogMode !== 'confirm'
      openTodoComposerButtonElement.hidden = state.todoComposerOpen
      todoComposerElement.hidden = !state.todoComposerOpen
      if (nameInputElement.value !== state.internetDraftName) {
        nameInputElement.value = state.internetDraftName
      }
      if (todoInputElement.value !== state.todoDraftText) {
        todoInputElement.value = state.todoDraftText
      }
      confirmNameInputButtonElement.disabled = state.internetDraftName.trim().length === 0
      localTimeLabelElement.textContent = state.localTimeLabel
      todoResetDialogElement.hidden = !state.todoResetDialogOpen
      todoToolbarElement.hidden = state.todoItems.length === 0
      for (const todoSortInputElement of todoSortInputElements) {
        todoSortInputElement.checked = todoSortInputElement.value === state.todoSortMode
      }
      todoListElement.replaceChildren(
        ...getSortedTodoItems(state).map((item) => createTodoBannerElement(item)),
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
    onOpenInternetClick(handler) {
      openInternetHandler = handler
    },
    onCloseInternetClick(handler) {
      closeInternetHandler = handler
    },
    onOpenInternetNameDialogClick(handler) {
      openInternetNameDialogHandler = handler
    },
    onCancelInternetNameDialogClick(handler) {
      cancelInternetNameDialogHandler = handler
    },
    onConfirmInternetNameInputClick(handler) {
      confirmInternetNameInputHandler = handler
    },
    onRejectInternetNameConfirmationClick(handler) {
      rejectInternetNameConfirmationHandler = handler
    },
    onAcceptInternetNameConfirmationClick(handler) {
      acceptInternetNameConfirmationHandler = handler
    },
    onInternetNameInput(handler) {
      internetNameInputHandler = handler
    },
    onOpenTodoComposerClick(handler) {
      openTodoComposerHandler = handler
    },
    onCancelTodoComposerClick(handler) {
      cancelTodoComposerHandler = handler
    },
    onAddTodoItem(handler) {
      addTodoItemHandler = handler
    },
    onCompleteTodoComposerClick(handler) {
      completeTodoComposerHandler = handler
    },
    onTodoDraftInput(handler) {
      todoDraftInputHandler = handler
    },
    onCompleteTodoClick(handler) {
      completeTodoHandler = handler
    },
    onTodoSortChange(handler) {
      todoSortChangeHandler = handler
    },
    onOpenTodoResetDialogClick(handler) {
      openTodoResetDialogHandler = handler
    },
    onRejectTodoResetClick(handler) {
      rejectTodoResetHandler = handler
    },
    onStopTodoResetClick(handler) {
      stopTodoResetHandler = handler
    },
    onAcceptTodoResetClick(handler) {
      acceptTodoResetHandler = handler
    },
  }
}
