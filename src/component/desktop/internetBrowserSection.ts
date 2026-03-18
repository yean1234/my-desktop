/*
 * This file is for building and binding reusable internet browser sections.
 */
import type {
  InternetDialogMode,
  InternetTodoItem,
  TodoResetDialogMode,
  TodoSortMode,
} from '../../utils/desktopState'

export type BrowserVariant = 'default' | 'deceptive'

export type BrowserSectionHandlers = {
  onOpenClick: () => void
  onCloseClick: () => void
  onOpenNameDialogClick: () => void
  onCancelNameDialogClick: () => void
  onConfirmNameInputClick: () => void
  onRejectNameConfirmationClick: () => void
  onAcceptNameConfirmationClick: () => void
  onNameInput: (value: string) => void
  onOpenTodoComposerClick: () => void
  onCancelTodoComposerClick: () => void
  onAddTodoItem: () => void
  onCompleteTodoComposerClick: () => void
  onTodoDraftInput: (value: string) => void
  onCompleteTodoClick: (todoId: number) => void
  onTodoSortChange: (todoSortMode: TodoSortMode) => void
  onOpenTodoResetDialogClick: () => void
  onRejectTodoResetClick: () => void
  onCancelWholeTodoResetClick: () => void
  onStopTodoResetClick: () => void
  onAcceptTodoResetClick: () => void
}

export type BrowserSectionElements = {
  shortcutButtonElement: HTMLButtonElement
  launchDialogElement: HTMLElement
  launchTrackElement: HTMLElement
  launchFillElement: HTMLElement
  launchValueElement: HTMLElement
  closeWindowButtonElement: HTMLButtonElement
  windowElement: HTMLElement
  headlineElement: HTMLElement
  localTimeLabelElement: HTMLElement
  openNameDialogButtonElement: HTMLButtonElement
  nameEntryDialogElement: HTMLElement
  nameInputElement: HTMLInputElement
  cancelNameDialogButtonElement: HTMLButtonElement
  confirmNameInputButtonElement: HTMLButtonElement
  nameConfirmDialogElement: HTMLElement
  rejectNameConfirmationButtonElement: HTMLButtonElement
  acceptNameConfirmationButtonElement: HTMLButtonElement
  openTodoComposerButtonElement: HTMLButtonElement
  todoComposerElement: HTMLElement
  todoInputElement: HTMLInputElement
  completeTodoComposerButtonElement: HTMLButtonElement
  cancelTodoComposerButtonElement: HTMLButtonElement
  todoSortInputElements: NodeListOf<HTMLInputElement>
  todoResetToolbarElement: HTMLElement
  todoToolbarElement: HTMLElement
  openTodoResetDialogButtonElement: HTMLButtonElement
  todoResetDialogElement: HTMLElement
  todoResetConfirmPanelElement: HTMLElement
  todoResetProgressPanelElement: HTMLElement
  todoResetProgressTrackElement: HTMLElement
  todoResetProgressFillElement: HTMLElement
  todoResetProgressValueElement: HTMLElement
  acceptTodoResetButtonElement: HTMLButtonElement
  rejectTodoResetButtonElement: HTMLButtonElement
  cancelWholeTodoResetButtonElement: HTMLButtonElement
  stopTodoResetButtonElement: HTMLButtonElement
  todoListElement: HTMLElement
  isWindowClosing: boolean
}

export type BrowserRenderState = {
  launchDisabled: boolean
  launchActive: boolean
  launchProgress: number
  windowOpen: boolean
  headline: string
  dialogMode: InternetDialogMode
  draftName: string
  localTimeLabel: string
  todoComposerOpen: boolean
  todoDraftText: string
  sortedTodoItems: InternetTodoItem[]
  todoResetDialogMode: TodoResetDialogMode
  todoResetProgress: number
  todoSortMode: TodoSortMode
}

const isTodoSortMode = (value: string): value is TodoSortMode =>
  value === 'latest' || value === 'oldest' || value === 'alphabetical'

const createDataAttribute = (variant: BrowserVariant, name: string) =>
  variant === 'default'
    ? `data-${name}`
    : name === 'close-internet-window'
      ? 'data-close-deceptive-internet-window'
      : `data-deceptive-${name}`

const createDataSelector = (variant: BrowserVariant, name: string) =>
  `[${createDataAttribute(variant, name)}]`

const createShortcutAriaLabel = (variant: BrowserVariant) =>
  variant === 'default' ? 'Open Internet Explorer' : 'Open deceptive Internet Explorer'

const createCloseButtonAriaLabel = (variant: BrowserVariant) =>
  variant === 'default' ? 'Close internet window' : 'Close deceptive internet window'

const createTodoSortInputName = (variant: BrowserVariant) =>
  variant === 'default' ? 'internet-todo-sort' : 'deceptive-internet-todo-sort'

const queryRequiredElement = <T extends Element>(container: ParentNode, selector: string) => {
  const element = container.querySelector<T>(selector)

  if (!element) {
    throw new Error('Desktop shell UI is missing required elements')
  }

  return element
}

const createTodoBannerElement = (
  item: InternetTodoItem,
  onCompleteTodoClick: (todoId: number) => void,
) => {
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
      onCompleteTodoClick(item.id)
    }
  })

  labelElement.append(checkboxElement, textElement)
  bannerElement.append(labelElement)

  return bannerElement
}

export const createBrowserSectionHandlers = (): BrowserSectionHandlers => ({
  onOpenClick: () => {},
  onCloseClick: () => {},
  onOpenNameDialogClick: () => {},
  onCancelNameDialogClick: () => {},
  onConfirmNameInputClick: () => {},
  onRejectNameConfirmationClick: () => {},
  onAcceptNameConfirmationClick: () => {},
  onNameInput: () => {},
  onOpenTodoComposerClick: () => {},
  onCancelTodoComposerClick: () => {},
  onAddTodoItem: () => {},
  onCompleteTodoComposerClick: () => {},
  onTodoDraftInput: () => {},
  onCompleteTodoClick: () => {},
  onTodoSortChange: () => {},
  onOpenTodoResetDialogClick: () => {},
  onRejectTodoResetClick: () => {},
  onCancelWholeTodoResetClick: () => {},
  onStopTodoResetClick: () => {},
  onAcceptTodoResetClick: () => {},
})

export const createBrowserShortcutMarkup = (
  variant: BrowserVariant,
  iconMarkup: string,
) => `
  <button
    class="desktop-shell__shortcut"
    type="button"
    ${createDataAttribute(variant, 'desktop-internet-icon')}
    aria-label="${createShortcutAriaLabel(variant)}"
  >
    ${iconMarkup}
    <span class="desktop-shell__shortcut-label">Internet</span>
    <span class="desktop-shell__shortcut-label">Explorer</span>
  </button>
`

export const createBrowserLaunchDialogMarkup = (variant: BrowserVariant) => `
  <section class="internet-launch-dialog" ${createDataAttribute(variant, 'internet-launch-dialog')} hidden>
    <div class="internet-launch-dialog__panel">
      <p class="internet-launch-dialog__title">Internet Explorer를 여는 중...</p>
      <div
        class="internet-launch-dialog__track"
        ${createDataAttribute(variant, 'internet-launch-track')}
        role="progressbar"
        aria-valuemin="0"
        aria-valuemax="100"
        aria-valuenow="0"
      >
        <div class="internet-launch-dialog__fill" ${createDataAttribute(variant, 'internet-launch-fill')}></div>
      </div>
      <p class="internet-launch-dialog__value" ${createDataAttribute(variant, 'internet-launch-value')}>0%</p>
    </div>
  </section>
`

export const createBrowserWindowMarkup = (variant: BrowserVariant) => `
  <article class="retro-window retro-window--internet" ${createDataAttribute(variant, 'internet-window')} hidden>
    <header class="retro-window__titlebar retro-window__titlebar--internet">
      <span class="retro-window__title">my-desktop</span>
      <button
        class="retro-window__close-button"
        type="button"
        ${createDataAttribute(variant, 'close-internet-window')}
        aria-label="${createCloseButtonAriaLabel(variant)}"
      >
        X
      </button>
    </header>
    <div class="internet-window__body">
      <p class="internet-window__eyebrow">WELCOME</p>
      <h2 class="internet-window__headline" ${createDataAttribute(variant, 'internet-headline')}>어서오세요 환영합니다!</h2>
      <p class="internet-window__time-value" ${createDataAttribute(variant, 'local-time-label')}>--</p>
      <div class="internet-window__action-row">
        <div class="internet-window__action-slot">
          <button class="internet-window__join-button" type="button" ${createDataAttribute(variant, 'open-name-dialog-button')}>
            이름 입력하기
          </button>
          <section class="internet-name-entry" ${createDataAttribute(variant, 'name-entry-dialog')} hidden>
            <input
              class="internet-name-entry__input"
              type="text"
              maxlength="20"
              ${createDataAttribute(variant, 'name-input')}
              placeholder="이름을 입력해주세요"
            />
            <div class="internet-name-entry__actions">
              <button class="retro-button internet-name-entry__button" type="button" ${createDataAttribute(variant, 'confirm-name-input-button')}>
                확인
              </button>
              <button class="retro-button internet-name-entry__button" type="button" ${createDataAttribute(variant, 'cancel-name-dialog-button')}>
                취소
              </button>
            </div>
          </section>
        </div>
        <div class="internet-window__action-slot internet-window__action-slot--todo">
          <button class="internet-window__join-button internet-window__join-button--todo" type="button" ${createDataAttribute(variant, 'open-todo-composer-button')}>
            할 일 목록 작성하기
          </button>
          <section class="internet-todo-composer" ${createDataAttribute(variant, 'todo-composer')} hidden>
            <input
              class="internet-todo-composer__input"
              type="text"
              maxlength="40"
              ${createDataAttribute(variant, 'todo-input')}
              placeholder="할 일을 입력해주세요"
            />
            <div class="internet-todo-composer__actions">
              <button class="retro-button internet-todo-composer__button" type="button" ${createDataAttribute(variant, 'complete-todo-composer-button')}>
                완료
              </button>
              <button class="retro-button internet-todo-composer__button" type="button" ${createDataAttribute(variant, 'cancel-todo-composer-button')}>
                취소
              </button>
            </div>
          </section>
        </div>
      </div>
      <section class="internet-todo-toolbar" ${createDataAttribute(variant, 'todo-reset-toolbar')} hidden>
        <button class="retro-button internet-todo-reset-button" type="button" ${createDataAttribute(variant, 'open-todo-reset-dialog-button')}>
          초기화
        </button>
      </section>
      <section class="internet-confirm-dialog" ${createDataAttribute(variant, 'name-confirm-dialog')} hidden>
        <div class="internet-confirm-dialog__panel">
          <p class="internet-confirm-dialog__message">정말 이름을 바꾸시겠습니까?</p>
          <div class="internet-confirm-dialog__actions">
            <button class="retro-button internet-confirm-dialog__button" type="button" ${createDataAttribute(variant, 'reject-name-confirmation-button')}>
              아니오
            </button>
            <button class="retro-button retro-button--primary internet-confirm-dialog__button" type="button" ${createDataAttribute(variant, 'accept-name-confirmation-button')}>
              예
            </button>
          </div>
        </div>
      </section>
      <section class="internet-confirm-dialog internet-confirm-dialog--todo-reset" ${createDataAttribute(variant, 'todo-reset-dialog')} hidden>
        <div class="internet-confirm-dialog__panel internet-confirm-dialog__panel--todo-reset" ${createDataAttribute(variant, 'todo-reset-confirm-panel')}>
          <p class="internet-confirm-dialog__message">정말 초기화하시겠습니까?</p>
          <div class="internet-confirm-dialog__actions">
            <button class="retro-button retro-button--primary internet-confirm-dialog__button" type="button" ${createDataAttribute(variant, 'accept-todo-reset-button')}>
              예
            </button>
            <button class="retro-button internet-confirm-dialog__button" type="button" ${createDataAttribute(variant, 'reject-todo-reset-button')}>
              아니오
            </button>
          </div>
        </div>
        <div class="internet-confirm-dialog__panel internet-confirm-dialog__panel--todo-reset-progress" ${createDataAttribute(variant, 'todo-reset-progress-panel')} hidden>
          <p class="internet-confirm-dialog__message">초기화가 진행 중입니다</p>
          <div
            class="internet-reset-progress"
            ${createDataAttribute(variant, 'todo-reset-progress-track')}
            role="progressbar"
            aria-valuemin="0"
            aria-valuemax="100"
            aria-valuenow="0"
          >
            <div class="internet-reset-progress__fill" ${createDataAttribute(variant, 'todo-reset-progress-fill')}></div>
          </div>
          <p class="internet-reset-progress__value" ${createDataAttribute(variant, 'todo-reset-progress-value')}>0%</p>
          <div class="internet-confirm-dialog__actions">
            <button class="retro-button internet-confirm-dialog__button" type="button" ${createDataAttribute(variant, 'cancel-whole-todo-reset-button')}>
              전체 취소
            </button>
            <button class="retro-button internet-confirm-dialog__button internet-confirm-dialog__button--stop" type="button" ${createDataAttribute(variant, 'stop-todo-reset-button')}>
              중단
            </button>
          </div>
        </div>
      </section>
    </div>
    <section class="internet-todo-dock">
      <section class="internet-todo-stack" ${createDataAttribute(variant, 'todo-list')}></section>
      <section class="internet-todo-sort-panel" ${createDataAttribute(variant, 'todo-toolbar')} hidden>
        <div class="internet-sort-group" role="radiogroup" aria-label="할 일 목록 정렬방식">
          <label class="internet-sort-group__option">
            <input
              class="internet-sort-group__control"
              type="radio"
              name="${createTodoSortInputName(variant)}"
              value="latest"
              ${createDataAttribute(variant, 'todo-sort-input')}
            />
            <span>최신순</span>
          </label>
          <label class="internet-sort-group__option">
            <input
              class="internet-sort-group__control"
              type="radio"
              name="${createTodoSortInputName(variant)}"
              value="oldest"
              ${createDataAttribute(variant, 'todo-sort-input')}
            />
            <span>오래된 순</span>
          </label>
          <label class="internet-sort-group__option">
            <input
              class="internet-sort-group__control"
              type="radio"
              name="${createTodoSortInputName(variant)}"
              value="alphabetical"
              ${createDataAttribute(variant, 'todo-sort-input')}
            />
            <span>가나다순</span>
          </label>
        </div>
      </section>
    </section>
  </article>
`

export const bindBrowserSection = (
  container: HTMLElement,
  variant: BrowserVariant,
  handlers: BrowserSectionHandlers,
): BrowserSectionElements => {
  const todoSortInputElements = container.querySelectorAll<HTMLInputElement>(
    createDataSelector(variant, 'todo-sort-input'),
  )

  if (todoSortInputElements.length !== 3) {
    throw new Error('Desktop shell UI is missing required elements')
  }

  const elements: BrowserSectionElements = {
    shortcutButtonElement: queryRequiredElement<HTMLButtonElement>(
      container,
      createDataSelector(variant, 'desktop-internet-icon'),
    ),
    launchDialogElement: queryRequiredElement<HTMLElement>(
      container,
      createDataSelector(variant, 'internet-launch-dialog'),
    ),
    launchTrackElement: queryRequiredElement<HTMLElement>(
      container,
      createDataSelector(variant, 'internet-launch-track'),
    ),
    launchFillElement: queryRequiredElement<HTMLElement>(
      container,
      createDataSelector(variant, 'internet-launch-fill'),
    ),
    launchValueElement: queryRequiredElement<HTMLElement>(
      container,
      createDataSelector(variant, 'internet-launch-value'),
    ),
    closeWindowButtonElement: queryRequiredElement<HTMLButtonElement>(
      container,
      createDataSelector(variant, 'close-internet-window'),
    ),
    windowElement: queryRequiredElement<HTMLElement>(
      container,
      createDataSelector(variant, 'internet-window'),
    ),
    headlineElement: queryRequiredElement<HTMLElement>(
      container,
      createDataSelector(variant, 'internet-headline'),
    ),
    localTimeLabelElement: queryRequiredElement<HTMLElement>(
      container,
      createDataSelector(variant, 'local-time-label'),
    ),
    openNameDialogButtonElement: queryRequiredElement<HTMLButtonElement>(
      container,
      createDataSelector(variant, 'open-name-dialog-button'),
    ),
    nameEntryDialogElement: queryRequiredElement<HTMLElement>(
      container,
      createDataSelector(variant, 'name-entry-dialog'),
    ),
    nameInputElement: queryRequiredElement<HTMLInputElement>(
      container,
      createDataSelector(variant, 'name-input'),
    ),
    cancelNameDialogButtonElement: queryRequiredElement<HTMLButtonElement>(
      container,
      createDataSelector(variant, 'cancel-name-dialog-button'),
    ),
    confirmNameInputButtonElement: queryRequiredElement<HTMLButtonElement>(
      container,
      createDataSelector(variant, 'confirm-name-input-button'),
    ),
    nameConfirmDialogElement: queryRequiredElement<HTMLElement>(
      container,
      createDataSelector(variant, 'name-confirm-dialog'),
    ),
    rejectNameConfirmationButtonElement: queryRequiredElement<HTMLButtonElement>(
      container,
      createDataSelector(variant, 'reject-name-confirmation-button'),
    ),
    acceptNameConfirmationButtonElement: queryRequiredElement<HTMLButtonElement>(
      container,
      createDataSelector(variant, 'accept-name-confirmation-button'),
    ),
    openTodoComposerButtonElement: queryRequiredElement<HTMLButtonElement>(
      container,
      createDataSelector(variant, 'open-todo-composer-button'),
    ),
    todoComposerElement: queryRequiredElement<HTMLElement>(
      container,
      createDataSelector(variant, 'todo-composer'),
    ),
    todoInputElement: queryRequiredElement<HTMLInputElement>(
      container,
      createDataSelector(variant, 'todo-input'),
    ),
    completeTodoComposerButtonElement: queryRequiredElement<HTMLButtonElement>(
      container,
      createDataSelector(variant, 'complete-todo-composer-button'),
    ),
    cancelTodoComposerButtonElement: queryRequiredElement<HTMLButtonElement>(
      container,
      createDataSelector(variant, 'cancel-todo-composer-button'),
    ),
    todoSortInputElements,
    todoResetToolbarElement: queryRequiredElement<HTMLElement>(
      container,
      createDataSelector(variant, 'todo-reset-toolbar'),
    ),
    todoToolbarElement: queryRequiredElement<HTMLElement>(
      container,
      createDataSelector(variant, 'todo-toolbar'),
    ),
    openTodoResetDialogButtonElement: queryRequiredElement<HTMLButtonElement>(
      container,
      createDataSelector(variant, 'open-todo-reset-dialog-button'),
    ),
    todoResetDialogElement: queryRequiredElement<HTMLElement>(
      container,
      createDataSelector(variant, 'todo-reset-dialog'),
    ),
    todoResetConfirmPanelElement: queryRequiredElement<HTMLElement>(
      container,
      createDataSelector(variant, 'todo-reset-confirm-panel'),
    ),
    todoResetProgressPanelElement: queryRequiredElement<HTMLElement>(
      container,
      createDataSelector(variant, 'todo-reset-progress-panel'),
    ),
    todoResetProgressTrackElement: queryRequiredElement<HTMLElement>(
      container,
      createDataSelector(variant, 'todo-reset-progress-track'),
    ),
    todoResetProgressFillElement: queryRequiredElement<HTMLElement>(
      container,
      createDataSelector(variant, 'todo-reset-progress-fill'),
    ),
    todoResetProgressValueElement: queryRequiredElement<HTMLElement>(
      container,
      createDataSelector(variant, 'todo-reset-progress-value'),
    ),
    acceptTodoResetButtonElement: queryRequiredElement<HTMLButtonElement>(
      container,
      createDataSelector(variant, 'accept-todo-reset-button'),
    ),
    rejectTodoResetButtonElement: queryRequiredElement<HTMLButtonElement>(
      container,
      createDataSelector(variant, 'reject-todo-reset-button'),
    ),
    cancelWholeTodoResetButtonElement: queryRequiredElement<HTMLButtonElement>(
      container,
      createDataSelector(variant, 'cancel-whole-todo-reset-button'),
    ),
    stopTodoResetButtonElement: queryRequiredElement<HTMLButtonElement>(
      container,
      createDataSelector(variant, 'stop-todo-reset-button'),
    ),
    todoListElement: queryRequiredElement<HTMLElement>(
      container,
      createDataSelector(variant, 'todo-list'),
    ),
    isWindowClosing: false,
  }

  elements.shortcutButtonElement.addEventListener('click', () => {
    handlers.onOpenClick()
  })

  elements.openNameDialogButtonElement.addEventListener('click', () => {
    handlers.onOpenNameDialogClick()
  })

  elements.nameInputElement.addEventListener('input', () => {
    handlers.onNameInput(elements.nameInputElement.value)
  })

  elements.nameInputElement.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' && elements.nameInputElement.value.trim()) {
      handlers.onConfirmNameInputClick()
    }
  })

  elements.cancelNameDialogButtonElement.addEventListener('click', () => {
    handlers.onCancelNameDialogClick()
  })

  elements.confirmNameInputButtonElement.addEventListener('click', () => {
    handlers.onConfirmNameInputClick()
  })

  elements.openTodoComposerButtonElement.addEventListener('click', () => {
    handlers.onOpenTodoComposerClick()
  })

  elements.todoInputElement.addEventListener('input', () => {
    handlers.onTodoDraftInput(elements.todoInputElement.value)
  })

  elements.todoInputElement.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' && elements.todoInputElement.value.trim()) {
      event.preventDefault()
      handlers.onAddTodoItem()
    }
  })

  elements.completeTodoComposerButtonElement.addEventListener('click', () => {
    handlers.onCompleteTodoComposerClick()
  })

  elements.cancelTodoComposerButtonElement.addEventListener('click', () => {
    handlers.onCancelTodoComposerClick()
  })

  for (const todoSortInputElement of elements.todoSortInputElements) {
    todoSortInputElement.addEventListener('change', () => {
      if (!todoSortInputElement.checked || !isTodoSortMode(todoSortInputElement.value)) {
        return
      }

      handlers.onTodoSortChange(todoSortInputElement.value)
    })
  }

  elements.openTodoResetDialogButtonElement.addEventListener('click', () => {
    handlers.onOpenTodoResetDialogClick()
  })

  elements.rejectTodoResetButtonElement.addEventListener('click', () => {
    handlers.onRejectTodoResetClick()
  })

  elements.cancelWholeTodoResetButtonElement.addEventListener('click', () => {
    handlers.onCancelWholeTodoResetClick()
  })

  elements.stopTodoResetButtonElement.addEventListener('click', () => {
    handlers.onStopTodoResetClick()
  })

  elements.acceptTodoResetButtonElement.addEventListener('click', () => {
    handlers.onAcceptTodoResetClick()
  })

  elements.rejectNameConfirmationButtonElement.addEventListener('click', () => {
    handlers.onRejectNameConfirmationClick()
  })

  elements.acceptNameConfirmationButtonElement.addEventListener('click', () => {
    handlers.onAcceptNameConfirmationClick()
  })

  elements.closeWindowButtonElement.addEventListener('click', () => {
    if (elements.isWindowClosing || elements.windowElement.hidden) {
      return
    }

    elements.isWindowClosing = true
    elements.closeWindowButtonElement.disabled = true
    elements.windowElement.classList.add('retro-window--closing')

    window.setTimeout(() => {
      elements.isWindowClosing = false
      elements.windowElement.classList.remove('retro-window--closing')
      elements.closeWindowButtonElement.disabled = false
      handlers.onCloseClick()
    }, 280)
  })

  return elements
}

export const renderBrowserSection = (
  elements: BrowserSectionElements,
  state: BrowserRenderState,
  onCompleteTodoClick: (todoId: number) => void,
) => {
  elements.shortcutButtonElement.disabled = state.launchDisabled
  elements.launchDialogElement.hidden = !state.launchActive
  elements.launchTrackElement.setAttribute('aria-valuenow', String(state.launchProgress))
  elements.launchFillElement.style.width = `${state.launchProgress}%`
  elements.launchValueElement.textContent = `${state.launchProgress}%`

  if (state.windowOpen) {
    elements.windowElement.hidden = false
  } else if (!elements.isWindowClosing) {
    elements.windowElement.hidden = true
    elements.windowElement.classList.remove('retro-window--closing')
  }

  elements.headlineElement.textContent = state.headline
  elements.openNameDialogButtonElement.hidden = state.dialogMode !== 'closed'
  elements.nameEntryDialogElement.hidden = state.dialogMode !== 'input'
  elements.nameConfirmDialogElement.hidden = state.dialogMode !== 'confirm'
  elements.openTodoComposerButtonElement.hidden = state.todoComposerOpen
  elements.todoComposerElement.hidden = !state.todoComposerOpen

  if (elements.nameInputElement.value !== state.draftName) {
    elements.nameInputElement.value = state.draftName
  }

  if (elements.todoInputElement.value !== state.todoDraftText) {
    elements.todoInputElement.value = state.todoDraftText
  }

  elements.confirmNameInputButtonElement.disabled = state.draftName.trim().length === 0
  elements.localTimeLabelElement.textContent = state.localTimeLabel
  elements.todoResetDialogElement.hidden = state.todoResetDialogMode === 'closed'
  elements.todoResetConfirmPanelElement.hidden = state.todoResetDialogMode !== 'confirm'
  elements.todoResetProgressPanelElement.hidden = state.todoResetDialogMode !== 'progress'
  elements.todoResetProgressTrackElement.setAttribute(
    'aria-valuenow',
    String(state.todoResetProgress),
  )
  elements.todoResetProgressFillElement.style.width = `${state.todoResetProgress}%`
  elements.todoResetProgressValueElement.textContent = `${state.todoResetProgress}%`
  elements.todoResetToolbarElement.hidden =
    !state.todoComposerOpen &&
    state.sortedTodoItems.length === 0 &&
    state.todoResetDialogMode === 'closed'
  elements.todoToolbarElement.hidden = state.sortedTodoItems.length === 0

  for (const todoSortInputElement of elements.todoSortInputElements) {
    todoSortInputElement.checked = todoSortInputElement.value === state.todoSortMode
  }

  elements.todoListElement.replaceChildren(
    ...state.sortedTodoItems.map((item) =>
      createTodoBannerElement(item, onCompleteTodoClick),
    ),
  )
}
