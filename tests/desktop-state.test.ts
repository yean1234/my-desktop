import { describe, expect, it } from 'vitest'
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
  getDeceptiveSortedTodoItems,
  getDeceptiveTodoComposerIntent,
  getDeceptiveTodoResetIntent,
  getDeceptiveTodoSortMode,
  getSortedTodoItems,
  hasVisibleFolderItems,
  openInternetNameDialog,
  openDeceptiveInternetNameDialog,
  openInternetWindow,
  openDeceptiveInternetWindow,
  openTodoComposer,
  openDeceptiveTodoComposer,
  openTodoResetDialog,
  openDeceptiveTodoResetDialog,
  rejectInternetNameConfirmation,
  rejectDeceptiveInternetNameConfirmation,
  requestInternetNameConfirmation,
  requestDeceptiveInternetNameConfirmation,
  startInternetLaunch,
  startDeceptiveInternetLaunch,
  startTodoResetProgress,
  startDeceptiveTodoResetProgress,
  startTodoItemRemoval,
  startDeceptiveTodoItemRemoval,
  stopTodoResetProgress,
  stopDeceptiveTodoResetProgress,
  syncLocalTime,
  updateInternetLaunchProgress,
  updateDeceptiveInternetLaunchProgress,
  updateTodoDraftText,
  updateDeceptiveTodoDraftText,
  updateTodoSortMode,
  updateDeceptiveTodoSortMode,
  updateInternetDraftName,
  updateDeceptiveInternetDraftName,
} from '../src/utils/desktopState'

describe('desktop state dump', () => {
  it('includes the important desktop shell values', () => {
    const initialState = createInitialDesktopState(new Date(2026, 2, 19, 9, 8, 7))
    const dump = dumpDesktopState({
      ...initialState,
      cpuUsagePercent: 38,
      temperatureCelsius: 12,
      temperatureStatus: 'ready',
      internetLaunchActive: true,
      internetLaunchProgress: 70,
      internetWindowOpen: true,
      internetDialogMode: 'confirm',
      internetDraftName: 'Yyeon',
      localTimeLabel: '09:08:07',
      todoComposerOpen: true,
      todoDraftText: '회의 준비하기',
      todoItems: [
        { id: 1, text: '메일 보내기', status: 'active' },
        { id: 2, text: '장보기', status: 'removing' },
      ],
      todoResetDialogMode: 'progress',
      todoResetProgress: 50,
      todoResetSnapshotItems: [
        { id: 1, text: '메일 보내기', status: 'active' },
        { id: 2, text: '장보기', status: 'active' },
      ],
      todoResetSnapshotNextTodoId: 3,
      todoSortMode: 'alphabetical',
      visitorName: 'Yyeon',
      folderTitle: 'Project',
      folderPath: 'Selected in browser picker / Project',
      folderStatus: 'ready',
      folderItems: [
        { name: 'alpha.txt', kind: 'file' },
        { name: 'notes', kind: 'directory' },
      ],
    })

    expect(dump).toContain('desktop-layout')
    expect(dump).toContain('cpu=38%')
    expect(dump).toContain('temperature=12C')
    expect(dump).toContain('internetLaunch=loading')
    expect(dump).toContain('internetLaunchProgress=70%')
    expect(dump).toContain('internetWindow=open')
    expect(dump).toContain('internetDialog=confirm')
    expect(dump).toContain('draftName=Yyeon')
    expect(dump).toContain('deceptiveInternetLaunch=idle')
    expect(dump).toContain('deceptiveInternetWindow=closed')
    expect(dump).toContain('deceptiveDraftName=-')
    expect(dump).toContain('localTime=09:08:07')
    expect(dump).toContain('todoComposer=open')
    expect(dump).toContain('todoDraft=회의 준비하기')
    expect(dump).toContain('todoCount=2')
    expect(dump).toContain('todoItems=active:메일 보내기, removing:장보기')
    expect(dump).toContain('todoResetDialog=progress')
    expect(dump).toContain('todoResetProgress=50%')
    expect(dump).toContain('todoSort=alphabetical')
    expect(dump).toContain('visitorName=Yyeon')
    expect(dump).toContain('deceptiveTodoComposer=closed')
    expect(dump).toContain('deceptiveTodoCount=0')
    expect(dump).toContain('deceptiveTodoSort=latest')
    expect(dump).toContain('deceptiveVisitorName=-')
    expect(dump).toContain('folder=Project')
    expect(dump).toContain('path=Selected in browser picker / Project')
    expect(dump).toContain('itemCount=2')
    expect(dump).toContain('visibleItems=file:alpha.txt, directory:notes')
  })

  it('starts with no selected folder and no visible items', () => {
    const dump = dumpDesktopState(createInitialDesktopState(new Date(2026, 2, 19, 9, 8, 7)))

    expect(dump).toContain('folder=No folder selected')
    expect(dump).toContain('folderStatus=idle')
    expect(dump).toContain('internetLaunch=idle')
    expect(dump).toContain('internetLaunchProgress=0%')
    expect(dump).toContain('internetWindow=closed')
    expect(dump).toContain('internetDialog=closed')
    expect(dump).toContain('draftName=-')
    expect(dump).toContain('deceptiveInternetLaunch=idle')
    expect(dump).toContain('deceptiveInternetWindow=closed')
    expect(dump).toContain('deceptiveInternetDialog=closed')
    expect(dump).toContain('deceptiveDraftName=-')
    expect(dump).toContain('localTime=09:08:07')
    expect(dump).toContain('todoComposer=closed')
    expect(dump).toContain('todoDraft=-')
    expect(dump).toContain('todoCount=0')
    expect(dump).toContain('todoItems=-')
    expect(dump).toContain('todoResetDialog=closed')
    expect(dump).toContain('todoResetProgress=0%')
    expect(dump).toContain('todoSort=latest')
    expect(dump).toContain('visitorName=-')
    expect(dump).toContain('deceptiveTodoComposer=closed')
    expect(dump).toContain('deceptiveTodoDraft=-')
    expect(dump).toContain('deceptiveTodoCount=0')
    expect(dump).toContain('deceptiveTodoItems=-')
    expect(dump).toContain('deceptiveTodoResetDialog=closed')
    expect(dump).toContain('deceptiveTodoResetProgress=0%')
    expect(dump).toContain('deceptiveTodoSort=latest')
    expect(dump).toContain('deceptiveVisitorName=-')
    expect(dump).toContain('visibleItems=-')
  })

  it('starts the internet launch at 0 percent before the window opens', () => {
    const nextState = startInternetLaunch(createInitialDesktopState(new Date(2026, 2, 19, 9, 8, 7)))

    expect(nextState.internetLaunchActive).toBe(true)
    expect(nextState.internetLaunchProgress).toBe(0)
    expect(nextState.internetWindowOpen).toBe(false)
  })

  it('updates the internet launch progress in steps', () => {
    const nextState = updateInternetLaunchProgress(
      startInternetLaunch(createInitialDesktopState(new Date(2026, 2, 19, 9, 8, 7))),
      70,
    )

    expect(nextState.internetLaunchActive).toBe(true)
    expect(nextState.internetLaunchProgress).toBe(70)
  })

  it('finishes the internet launch and opens the internet window', () => {
    const nextState = finishInternetLaunch(
      updateInternetLaunchProgress(
        startInternetLaunch(createInitialDesktopState(new Date(2026, 2, 19, 9, 8, 7))),
        100,
      ),
      new Date(2026, 2, 19, 10, 11, 12),
    )

    expect(nextState.internetLaunchActive).toBe(false)
    expect(nextState.internetLaunchProgress).toBe(100)
    expect(nextState.internetWindowOpen).toBe(true)
    expect(nextState.localTimeLabel).toBe('10:11:12')
  })

  it('opens the internet window and refreshes the local time', () => {
    const initialState = createInitialDesktopState(new Date(2026, 2, 19, 9, 8, 7))
    const nextState = openInternetWindow(initialState, new Date(2026, 2, 19, 10, 11, 12))

    expect(nextState.internetWindowOpen).toBe(true)
    expect(nextState.localTimeLabel).toBe('10:11:12')
  })

  it('closes the internet window without clearing the clock label', () => {
    const openState = openInternetWindow(
      createInitialDesktopState(new Date(2026, 2, 19, 9, 8, 7)),
      new Date(2026, 2, 19, 10, 11, 12),
    )
    const nextState = closeInternetWindow(openState)

    expect(nextState.internetWindowOpen).toBe(false)
    expect(nextState.internetDialogMode).toBe('closed')
    expect(nextState.localTimeLabel).toBe('10:11:12')
  })

  it('starts and finishes the deceptive internet launch separately', () => {
    const nextState = finishDeceptiveInternetLaunch(
      updateDeceptiveInternetLaunchProgress(
        startDeceptiveInternetLaunch(createInitialDesktopState(new Date(2026, 2, 19, 9, 8, 7))),
        100,
      ),
      new Date(2026, 2, 19, 10, 11, 12),
    )

    expect(nextState.deceptiveInternetLaunchActive).toBe(false)
    expect(nextState.deceptiveInternetLaunchProgress).toBe(100)
    expect(nextState.deceptiveInternetWindowOpen).toBe(true)
    expect(nextState.localTimeLabel).toBe('10:11:12')
  })

  it('closes the deceptive internet window without clearing the clock label', () => {
    const openState = openDeceptiveInternetWindow(
      createInitialDesktopState(new Date(2026, 2, 19, 9, 8, 7)),
      new Date(2026, 2, 19, 10, 11, 12),
    )
    const nextState = closeDeceptiveInternetWindow(openState)

    expect(nextState.deceptiveInternetWindowOpen).toBe(false)
    expect(nextState.deceptiveInternetDialogMode).toBe('closed')
    expect(nextState.localTimeLabel).toBe('10:11:12')
  })

  it('syncs the local time label while keeping the rest of the state', () => {
    const initialState = createInitialDesktopState(new Date(2026, 2, 19, 9, 8, 7))
    const nextState = syncLocalTime(initialState, new Date(2026, 2, 19, 21, 22, 23))

    expect(nextState.internetWindowOpen).toBe(false)
    expect(nextState.localTimeLabel).toBe('21:22:23')
    expect(nextState.folderTitle).toBe('No folder selected')
  })

  it('opens the name dialog with the saved visitor name as draft', () => {
    const state = openInternetNameDialog({
      ...createInitialDesktopState(new Date(2026, 2, 19, 9, 8, 7)),
      visitorName: 'Yyeon',
    })

    expect(state.internetDialogMode).toBe('input')
    expect(state.internetDraftName).toBe('Yyeon')
  })

  it('moves from the inline input flow to the confirmation dialog', () => {
    const inputState = updateInternetDraftName(
      openInternetNameDialog(createInitialDesktopState(new Date(2026, 2, 19, 9, 8, 7))),
      '  Yyeon  ',
    )
    const confirmState = requestInternetNameConfirmation(inputState)

    expect(confirmState.internetDialogMode).toBe('confirm')
    expect(confirmState.internetDraftName).toBe('Yyeon')
  })

  it('keeps the input dialog open when the submitted name is empty', () => {
    const inputState = openInternetNameDialog(createInitialDesktopState(new Date(2026, 2, 19, 9, 8, 7)))
    const nextState = requestInternetNameConfirmation(inputState)

    expect(nextState.internetDialogMode).toBe('input')
    expect(nextState.visitorName).toBe('')
  })

  it('returns to the input flow when the confirmation is rejected', () => {
    const confirmState = requestInternetNameConfirmation(
      updateInternetDraftName(
        openInternetNameDialog(createInitialDesktopState(new Date(2026, 2, 19, 9, 8, 7))),
        'Yyeon',
      ),
    )
    const nextState = rejectInternetNameConfirmation(confirmState)

    expect(nextState.internetDialogMode).toBe('input')
    expect(nextState.internetDraftName).toBe('Yyeon')
  })

  it('saves the visitor name when the confirmation is accepted', () => {
    const confirmedState = confirmInternetName(
      requestInternetNameConfirmation(
        updateInternetDraftName(
          openInternetNameDialog(createInitialDesktopState(new Date(2026, 2, 19, 9, 8, 7))),
          'Yyeon',
        ),
      ),
    )

    expect(confirmedState.internetDialogMode).toBe('closed')
    expect(confirmedState.internetDraftName).toBe('Yyeon')
    expect(confirmedState.visitorName).toBe('Yyeon')
  })

  it('cancels the name dialog and restores the saved visitor name in the draft', () => {
    const cancelledState = cancelInternetNameDialog(
      updateInternetDraftName(
        openInternetNameDialog({
          ...createInitialDesktopState(new Date(2026, 2, 19, 9, 8, 7)),
          visitorName: 'Yyeon',
        }),
        'Other name',
      ),
    )

    expect(cancelledState.internetDialogMode).toBe('closed')
    expect(cancelledState.internetDraftName).toBe('Yyeon')
  })

  it('saves the deceptive visitor name through its own confirmation flow', () => {
    const confirmedState = confirmDeceptiveInternetName(
      requestDeceptiveInternetNameConfirmation(
        updateDeceptiveInternetDraftName(
          openDeceptiveInternetNameDialog(createInitialDesktopState(new Date(2026, 2, 19, 9, 8, 7))),
          '  Trickster  ',
        ),
      ),
    )

    expect(confirmedState.deceptiveInternetDialogMode).toBe('closed')
    expect(confirmedState.deceptiveInternetDraftName).toBe('Trickster')
    expect(confirmedState.deceptiveVisitorName).toBe('Trickster')
  })

  it('cancels the deceptive name dialog and restores the saved deceptive visitor name', () => {
    const cancelledState = cancelDeceptiveInternetNameDialog(
      updateDeceptiveInternetDraftName(
        openDeceptiveInternetNameDialog({
          ...createInitialDesktopState(new Date(2026, 2, 19, 9, 8, 7)),
          deceptiveVisitorName: 'Clone',
        }),
        'Other name',
      ),
    )

    expect(cancelledState.deceptiveInternetDialogMode).toBe('closed')
    expect(cancelledState.deceptiveInternetDraftName).toBe('Clone')
  })

  it('opens the todo composer without hiding the existing visitor name', () => {
    const state = openTodoComposer({
      ...createInitialDesktopState(new Date(2026, 2, 19, 9, 8, 7)),
      visitorName: 'Yyeon',
    })

    expect(state.todoComposerOpen).toBe(true)
    expect(state.visitorName).toBe('Yyeon')
  })

  it('updates the todo sort mode', () => {
    const nextState = updateTodoSortMode(
      createInitialDesktopState(new Date(2026, 2, 19, 9, 8, 7)),
      'oldest',
    )

    expect(nextState.todoSortMode).toBe('oldest')
  })

  it('adds a todo item and keeps the composer open for the next entry', () => {
    const inputState = updateTodoDraftText(
      openTodoComposer(createInitialDesktopState(new Date(2026, 2, 19, 9, 8, 7))),
      '  우유 사기  ',
    )
    const nextState = addTodoItem(inputState)

    expect(nextState.todoComposerOpen).toBe(true)
    expect(nextState.todoDraftText).toBe('')
    expect(nextState.todoItems).toEqual([
      { id: 1, text: '우유 사기', status: 'active' },
    ])
  })

  it('keeps adding todo items while the composer stays open', () => {
    const firstInputState = updateTodoDraftText(
      openTodoComposer(createInitialDesktopState(new Date(2026, 2, 19, 9, 8, 7))),
      '메일 보내기',
    )
    const firstAddedState = addTodoItem(firstInputState)
    const secondInputState = updateTodoDraftText(firstAddedState, '회의 준비하기')
    const nextState = addTodoItem(secondInputState)

    expect(nextState.todoComposerOpen).toBe(true)
    expect(nextState.todoDraftText).toBe('')
    expect(nextState.todoItems).toEqual([
      { id: 1, text: '메일 보내기', status: 'active' },
      { id: 2, text: '회의 준비하기', status: 'active' },
    ])
  })

  it('finishes the todo composer and closes it after saving the current draft', () => {
    const nextState = finishTodoComposer(
      updateTodoDraftText(
        openTodoComposer(createInitialDesktopState(new Date(2026, 2, 19, 9, 8, 7))),
        '회의 준비하기',
      ),
    )

    expect(nextState.todoComposerOpen).toBe(false)
    expect(nextState.todoDraftText).toBe('')
    expect(nextState.todoItems).toEqual([
      { id: 1, text: '회의 준비하기', status: 'active' },
    ])
  })

  it('sorts todo items by latest, oldest, and 가나다순', () => {
    const baseState = {
      ...createInitialDesktopState(new Date(2026, 2, 19, 9, 8, 7)),
      todoItems: [
        { id: 1, text: '바나나 사기', status: 'active' as const },
        { id: 2, text: '가방 정리', status: 'active' as const },
        { id: 3, text: '회의 준비', status: 'active' as const },
      ],
    }

    expect(getSortedTodoItems(baseState).map((item) => item.id)).toEqual([3, 2, 1])
    expect(
      getSortedTodoItems({
        ...baseState,
        todoSortMode: 'oldest',
      }).map((item) => item.id),
    ).toEqual([1, 2, 3])
    expect(
      getSortedTodoItems({
        ...baseState,
        todoSortMode: 'alphabetical',
      }).map((item) => item.text),
    ).toEqual(['가방 정리', '바나나 사기', '회의 준비'])
  })

  it('maps the deceptive sort labels to different actual sort orders', () => {
    expect(getDeceptiveTodoSortMode('latest')).toBe('alphabetical')
    expect(getDeceptiveTodoSortMode('oldest')).toBe('latest')
    expect(getDeceptiveTodoSortMode('alphabetical')).toBe('oldest')
  })

  it('sorts deceptive todo items in the deceptive order instead of the selected label order', () => {
    const baseState = {
      ...createInitialDesktopState(new Date(2026, 2, 19, 9, 8, 7)),
      deceptiveTodoItems: [
        { id: 1, text: '바나나 사기', status: 'active' as const },
        { id: 2, text: '가방 정리', status: 'active' as const },
        { id: 3, text: '회의 준비', status: 'active' as const },
      ],
    }

    expect(getDeceptiveSortedTodoItems(baseState).map((item) => item.text)).toEqual([
      '가방 정리',
      '바나나 사기',
      '회의 준비',
    ])
    expect(
      getDeceptiveSortedTodoItems({
        ...baseState,
        deceptiveTodoSortMode: 'oldest',
      }).map((item) => item.id),
    ).toEqual([3, 2, 1])
    expect(
      getDeceptiveSortedTodoItems({
        ...baseState,
        deceptiveTodoSortMode: 'alphabetical',
      }).map((item) => item.id),
    ).toEqual([1, 2, 3])
  })

  it('adds a deceptive todo item and keeps the deceptive composer open for the next entry', () => {
    const inputState = updateDeceptiveTodoDraftText(
      openDeceptiveTodoComposer(createInitialDesktopState(new Date(2026, 2, 19, 9, 8, 7))),
      '  함정 설치  ',
    )
    const nextState = addDeceptiveTodoItem(inputState)

    expect(nextState.deceptiveTodoComposerOpen).toBe(true)
    expect(nextState.deceptiveTodoDraftText).toBe('')
    expect(nextState.deceptiveTodoItems).toEqual([
      { id: 1, text: '함정 설치', status: 'active' },
    ])
  })

  it('finishes the deceptive todo composer and closes it after saving the current draft', () => {
    const nextState = finishDeceptiveTodoComposer(
      updateDeceptiveTodoDraftText(
        openDeceptiveTodoComposer(createInitialDesktopState(new Date(2026, 2, 19, 9, 8, 7))),
        '속이기',
      ),
    )

    expect(nextState.deceptiveTodoComposerOpen).toBe(false)
    expect(nextState.deceptiveTodoDraftText).toBe('')
    expect(nextState.deceptiveTodoItems).toEqual([
      { id: 1, text: '속이기', status: 'active' },
    ])
  })

  it('maps deceptive todo composer buttons to the opposite intent', () => {
    expect(getDeceptiveTodoComposerIntent('complete')).toBe('cancel')
    expect(getDeceptiveTodoComposerIntent('cancel')).toBe('finish')
  })

  it('cancels the todo composer and restores the button state', () => {
    const nextState = cancelTodoComposer(
      updateTodoDraftText(
        openTodoComposer(createInitialDesktopState(new Date(2026, 2, 19, 9, 8, 7))),
        '초안',
      ),
    )

    expect(nextState.todoComposerOpen).toBe(false)
    expect(nextState.todoDraftText).toBe('')
  })

  it('opens and closes the todo reset dialog without clearing items', () => {
    const openState = openTodoResetDialog({
      ...createInitialDesktopState(new Date(2026, 2, 19, 9, 8, 7)),
      todoItems: [{ id: 1, text: '장보기', status: 'active' }],
    })
    const closedState = closeTodoResetDialog(openState)

    expect(openState.todoResetDialogMode).toBe('confirm')
    expect(closedState.todoResetDialogMode).toBe('closed')
    expect(closedState.todoItems).toEqual([{ id: 1, text: '장보기', status: 'active' }])
  })

  it('opens and closes the deceptive todo reset dialog without clearing items', () => {
    const openState = openDeceptiveTodoResetDialog({
      ...createInitialDesktopState(new Date(2026, 2, 19, 9, 8, 7)),
      deceptiveTodoItems: [{ id: 1, text: '장보기', status: 'active' }],
    })
    const closedState = closeDeceptiveTodoResetDialog(openState)

    expect(openState.deceptiveTodoResetDialogMode).toBe('confirm')
    expect(closedState.deceptiveTodoResetDialogMode).toBe('closed')
    expect(closedState.deceptiveTodoItems).toEqual([{ id: 1, text: '장보기', status: 'active' }])
  })

  it('starts the todo reset progress with a snapshot of the current list', () => {
    const nextState = startTodoResetProgress({
      ...createInitialDesktopState(new Date(2026, 2, 19, 9, 8, 7)),
      nextTodoId: 4,
      todoItems: [
        { id: 1, text: '장보기', status: 'active' },
        { id: 2, text: '메일 보내기', status: 'active' },
      ],
      todoResetDialogMode: 'confirm',
    })

    expect(nextState.todoResetDialogMode).toBe('progress')
    expect(nextState.todoResetProgress).toBe(0)
    expect(nextState.todoResetSnapshotItems).toEqual([
      { id: 1, text: '장보기', status: 'active' },
      { id: 2, text: '메일 보내기', status: 'active' },
    ])
    expect(nextState.todoResetSnapshotNextTodoId).toBe(4)
  })

  it('starts the deceptive todo reset progress with a snapshot of the current list', () => {
    const nextState = startDeceptiveTodoResetProgress({
      ...createInitialDesktopState(new Date(2026, 2, 19, 9, 8, 7)),
      deceptiveNextTodoId: 4,
      deceptiveTodoItems: [
        { id: 1, text: '장보기', status: 'active' },
        { id: 2, text: '메일 보내기', status: 'active' },
      ],
      deceptiveTodoResetDialogMode: 'confirm',
    })

    expect(nextState.deceptiveTodoResetDialogMode).toBe('progress')
    expect(nextState.deceptiveTodoResetProgress).toBe(0)
    expect(nextState.deceptiveTodoResetSnapshotItems).toEqual([
      { id: 1, text: '장보기', status: 'active' },
      { id: 2, text: '메일 보내기', status: 'active' },
    ])
    expect(nextState.deceptiveTodoResetSnapshotNextTodoId).toBe(4)
  })

  it('removes one todo item per progress tick', () => {
    const nextState = advanceTodoResetProgress({
      ...createInitialDesktopState(new Date(2026, 2, 19, 9, 8, 7)),
      nextTodoId: 3,
      todoItems: [
        { id: 1, text: '장보기', status: 'active' },
        { id: 2, text: '메일 보내기', status: 'active' },
      ],
      todoResetDialogMode: 'progress',
      todoResetSnapshotItems: [
        { id: 1, text: '장보기', status: 'active' },
        { id: 2, text: '메일 보내기', status: 'active' },
      ],
      todoResetSnapshotNextTodoId: 3,
    })

    expect(nextState.todoItems).toEqual([{ id: 1, text: '장보기', status: 'active' }])
    expect(nextState.todoResetDialogMode).toBe('progress')
    expect(nextState.todoResetProgress).toBe(50)
  })

  it('removes deceptive todo items in the deceptive displayed order', () => {
    const nextState = advanceDeceptiveTodoResetProgress({
      ...createInitialDesktopState(new Date(2026, 2, 19, 9, 8, 7)),
      deceptiveNextTodoId: 4,
      deceptiveTodoItems: [
        { id: 1, text: '바나나 사기', status: 'active' },
        { id: 2, text: '가방 정리', status: 'active' },
        { id: 3, text: '회의 준비', status: 'active' },
      ],
      deceptiveTodoResetDialogMode: 'progress',
      deceptiveTodoResetSnapshotItems: [
        { id: 1, text: '바나나 사기', status: 'active' },
        { id: 2, text: '가방 정리', status: 'active' },
        { id: 3, text: '회의 준비', status: 'active' },
      ],
      deceptiveTodoResetSnapshotNextTodoId: 4,
      deceptiveTodoSortMode: 'latest',
    })

    expect(nextState.deceptiveTodoItems.map((item) => item.text)).toEqual([
      '바나나 사기',
      '회의 준비',
    ])
    expect(nextState.deceptiveTodoResetDialogMode).toBe('progress')
    expect(nextState.deceptiveTodoResetProgress).toBe(33)
  })

  it('restores the full todo list when the whole reset is cancelled', () => {
    const nextState = cancelTodoResetProgress({
      ...createInitialDesktopState(new Date(2026, 2, 19, 9, 8, 7)),
      nextTodoId: 5,
      todoItems: [{ id: 2, text: '메일 보내기', status: 'active' }],
      todoResetDialogMode: 'progress',
      todoResetProgress: 50,
      todoResetSnapshotItems: [
        { id: 1, text: '장보기', status: 'active' },
        { id: 2, text: '메일 보내기', status: 'active' },
      ],
      todoResetSnapshotNextTodoId: 3,
    })

    expect(nextState.nextTodoId).toBe(3)
    expect(nextState.todoItems).toEqual([
      { id: 1, text: '장보기', status: 'active' },
      { id: 2, text: '메일 보내기', status: 'active' },
    ])
    expect(nextState.todoResetDialogMode).toBe('closed')
    expect(nextState.todoResetProgress).toBe(0)
  })

  it('restores the deceptive todo list when the whole deceptive reset is cancelled', () => {
    const nextState = cancelDeceptiveTodoResetProgress({
      ...createInitialDesktopState(new Date(2026, 2, 19, 9, 8, 7)),
      deceptiveNextTodoId: 5,
      deceptiveTodoItems: [{ id: 2, text: '메일 보내기', status: 'active' }],
      deceptiveTodoResetDialogMode: 'progress',
      deceptiveTodoResetProgress: 50,
      deceptiveTodoResetSnapshotItems: [
        { id: 1, text: '장보기', status: 'active' },
        { id: 2, text: '메일 보내기', status: 'active' },
      ],
      deceptiveTodoResetSnapshotNextTodoId: 3,
    })

    expect(nextState.deceptiveNextTodoId).toBe(3)
    expect(nextState.deceptiveTodoItems).toEqual([
      { id: 1, text: '장보기', status: 'active' },
      { id: 2, text: '메일 보내기', status: 'active' },
    ])
    expect(nextState.deceptiveTodoResetDialogMode).toBe('closed')
    expect(nextState.deceptiveTodoResetProgress).toBe(0)
  })

  it('stops the reset and keeps already deleted items deleted', () => {
    const nextState = stopTodoResetProgress({
      ...createInitialDesktopState(new Date(2026, 2, 19, 9, 8, 7)),
      nextTodoId: 3,
      todoItems: [{ id: 2, text: '메일 보내기', status: 'active' }],
      todoResetDialogMode: 'progress',
      todoResetProgress: 50,
      todoResetSnapshotItems: [
        { id: 1, text: '장보기', status: 'active' },
        { id: 2, text: '메일 보내기', status: 'active' },
      ],
      todoResetSnapshotNextTodoId: 3,
    })

    expect(nextState.todoItems).toEqual([{ id: 2, text: '메일 보내기', status: 'active' }])
    expect(nextState.todoResetDialogMode).toBe('closed')
    expect(nextState.todoResetProgress).toBe(0)
  })

  it('stops the deceptive reset and keeps already deleted items deleted', () => {
    const nextState = stopDeceptiveTodoResetProgress({
      ...createInitialDesktopState(new Date(2026, 2, 19, 9, 8, 7)),
      deceptiveNextTodoId: 3,
      deceptiveTodoItems: [{ id: 2, text: '메일 보내기', status: 'active' }],
      deceptiveTodoResetDialogMode: 'progress',
      deceptiveTodoResetProgress: 50,
      deceptiveTodoResetSnapshotItems: [
        { id: 1, text: '장보기', status: 'active' },
        { id: 2, text: '메일 보내기', status: 'active' },
      ],
      deceptiveTodoResetSnapshotNextTodoId: 3,
    })

    expect(nextState.deceptiveTodoItems).toEqual([{ id: 2, text: '메일 보내기', status: 'active' }])
    expect(nextState.deceptiveTodoResetDialogMode).toBe('closed')
    expect(nextState.deceptiveTodoResetProgress).toBe(0)
  })

  it('maps deceptive reset buttons to the opposite reset intent', () => {
    expect(getDeceptiveTodoResetIntent('accept')).toBe('reject')
    expect(getDeceptiveTodoResetIntent('reject')).toBe('accept')
  })

  it('marks a todo item as removing before the dismiss animation completes', () => {
    const nextState = startTodoItemRemoval(
      {
        ...createInitialDesktopState(new Date(2026, 2, 19, 9, 8, 7)),
        todoItems: [{ id: 3, text: '장보기', status: 'active' }],
      },
      3,
    )

    expect(nextState.todoItems).toEqual([{ id: 3, text: '장보기', status: 'removing' }])
  })

  it('removes a todo item after the dismiss animation finishes', () => {
    const nextState = finishTodoItemRemoval(
      {
        ...createInitialDesktopState(new Date(2026, 2, 19, 9, 8, 7)),
        todoItems: [{ id: 3, text: '장보기', status: 'removing' }],
      },
      3,
    )

    expect(nextState.todoItems).toEqual([])
  })

  it('removes a deceptive todo item after the dismiss animation finishes', () => {
    const nextState = finishDeceptiveTodoItemRemoval(
      {
        ...createInitialDesktopState(new Date(2026, 2, 19, 9, 8, 7)),
        deceptiveTodoItems: [{ id: 3, text: '장보기', status: 'removing' }],
      },
      3,
    )

    expect(nextState.deceptiveTodoItems).toEqual([])
  })

  it('shows folder items only when the folder is ready', () => {
    expect(
      hasVisibleFolderItems({
        folderStatus: 'ready',
        folderItems: [{ name: 'notes', kind: 'directory' }],
      }),
    ).toBe(true)
  })

  it('hides previous folder items while a new folder is loading', () => {
    expect(
      hasVisibleFolderItems({
        folderStatus: 'loading',
        folderItems: [{ name: 'notes', kind: 'directory' }],
      }),
    ).toBe(false)
  })
})
