import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'
import { createDesktopShellMarkup } from '../src/component/desktop/desktopShellMarkup'
import {
  createBrowserLaunchDialogMarkup,
  createBrowserWindowMarkup,
} from '../src/component/desktop/internetBrowserSection'

const createDesktopShellSource = readFileSync(
  resolve(process.cwd(), 'src/component/desktop/createDesktopShell.ts'),
  'utf8',
)

const shellMarkup = createDesktopShellMarkup({
  internetExplorerIconMarkup: '<svg class="desktop-shell__shortcut-icon"></svg>',
  deceptiveInternetExplorerIconMarkup:
    '<svg class="desktop-shell__shortcut-icon desktop-shell__shortcut-icon--deceptive"></svg>',
})

const browserMarkup = [
  createBrowserLaunchDialogMarkup('default'),
  createBrowserWindowMarkup('default'),
  createBrowserLaunchDialogMarkup('deceptive'),
  createBrowserWindowMarkup('deceptive'),
].join('\n')

const shellSource = [createDesktopShellSource, shellMarkup, browserMarkup].join('\n')

describe('createDesktopShell markup', () => {
  it('renders the internet explorer shortcut in the right rail', () => {
    expect(shellSource).toContain('<aside class="desktop-shell__right-rail">')
    expect(shellSource).toContain('data-desktop-internet-icon')
    expect(shellSource).toContain('data-deceptive-desktop-internet-icon')
    expect(shellSource).toContain('class="desktop-shell__shortcut"')
    expect(shellSource).toContain('desktop-shell__shortcut-icon')
    expect(shellSource).toContain('desktop-shell__shortcut-icon--deceptive')
    expect(shellSource).toContain('desktop-shell__shortcut-label')
    expect(shellSource).toContain('faInternetExplorer')
    expect(shellSource).not.toContain('rail-browser-launcher')
    expect(shellSource).not.toContain('rail-blank-panel')
    expect(shellSource).not.toContain('rail-card--disk')
    expect(shellSource).not.toContain('rail-card--drive')
  })

  it('renders the retro internet window content', () => {
    expect(shellSource).toContain('data-internet-launch-dialog')
    expect(shellSource).toContain('Internet Explorer를 여는 중...')
    expect(shellSource).toContain('data-internet-launch-track')
    expect(shellSource).toContain('data-internet-launch-fill')
    expect(shellSource).toContain('data-internet-launch-value')
    expect(shellSource).toContain('data-internet-window hidden')
    expect(shellSource).toContain('data-close-internet-window')
    expect(shellSource).toContain('my-desktop')
    expect(shellSource).toContain('data-internet-headline')
    expect(shellSource).toContain('어서오세요 환영합니다!')
    expect(shellSource).toContain('data-local-time-label')
    expect(shellSource).toContain('이름 입력하기')
    expect(shellSource).toContain('data-open-name-dialog-button')
    expect(shellSource).toContain('data-name-entry-dialog')
    expect(shellSource).toContain('data-name-input')
    expect(shellSource).toContain('placeholder="이름을 입력해주세요"')
    expect(shellSource).toContain('data-confirm-name-input-button')
    expect(shellSource).toContain('data-cancel-name-dialog-button')
    expect(shellSource).toContain('data-name-confirm-dialog')
    expect(shellSource).toContain('정말 이름을 바꾸시겠습니까?')
    expect(shellSource).toContain('data-reject-name-confirmation-button')
    expect(shellSource).toContain('data-accept-name-confirmation-button')
    expect(shellSource).toContain('할 일 목록 작성하기')
    expect(shellSource).toContain('data-open-todo-composer-button')
    expect(shellSource).toContain('data-todo-composer')
    expect(shellSource).toContain('data-todo-input')
    expect(shellSource).toContain('placeholder="할 일을 입력해주세요"')
    expect(shellSource).toContain('data-complete-todo-composer-button')
    expect(shellSource).toContain('data-cancel-todo-composer-button')
    expect(shellSource).toContain('완료')
    expect(shellSource).toContain('data-todo-sort-input')
    expect(shellSource).toContain('최신순')
    expect(shellSource).toContain('오래된 순')
    expect(shellSource).toContain('가나다순')
    expect(shellSource).toContain('data-todo-toolbar hidden')
    expect(shellSource).toContain('data-todo-reset-toolbar hidden')
    expect(shellSource).toContain('data-open-todo-reset-dialog-button')
    expect(shellSource).toContain('초기화')
    expect(shellSource).toContain('data-todo-reset-dialog')
    expect(shellSource).toContain('data-todo-reset-confirm-panel')
    expect(shellSource).toContain('정말 초기화하시겠습니까?')
    expect(shellSource).toContain('data-accept-todo-reset-button')
    expect(shellSource).toContain('data-reject-todo-reset-button')
    expect(shellSource).toContain('data-todo-reset-progress-panel')
    expect(shellSource).toContain('초기화가 진행 중입니다')
    expect(shellSource).toContain('data-todo-reset-progress-track')
    expect(shellSource).toContain('data-todo-reset-progress-fill')
    expect(shellSource).toContain('data-todo-reset-progress-value')
    expect(shellSource).toContain('data-cancel-whole-todo-reset-button')
    expect(shellSource).toContain('전체 취소')
    expect(shellSource).toContain('data-stop-todo-reset-button')
    expect(shellSource).toContain('중단')
    expect(shellSource).toContain('data-todo-list')
    expect(shellSource).toContain('data-deceptive-internet-launch-dialog')
    expect(shellSource).toContain('data-deceptive-internet-launch-track')
    expect(shellSource).toContain('data-deceptive-internet-launch-fill')
    expect(shellSource).toContain('data-deceptive-internet-launch-value')
    expect(shellSource).toContain('data-deceptive-internet-window hidden')
    expect(shellSource).toContain('data-close-deceptive-internet-window')
    expect(shellSource).toContain('data-deceptive-internet-headline')
    expect(shellSource).toContain('data-deceptive-local-time-label')
    expect(shellSource).toContain('data-deceptive-open-name-dialog-button')
    expect(shellSource).toContain('data-deceptive-name-entry-dialog')
    expect(shellSource).toContain('data-deceptive-name-input')
    expect(shellSource).toContain('data-deceptive-confirm-name-input-button')
    expect(shellSource).toContain('data-deceptive-cancel-name-dialog-button')
    expect(shellSource).toContain('data-deceptive-name-confirm-dialog')
    expect(shellSource).toContain('data-deceptive-reject-name-confirmation-button')
    expect(shellSource).toContain('data-deceptive-accept-name-confirmation-button')
    expect(shellSource).toContain('data-deceptive-open-todo-composer-button')
    expect(shellSource).toContain('data-deceptive-todo-composer')
    expect(shellSource).toContain('data-deceptive-todo-input')
    expect(shellSource).toContain('data-deceptive-complete-todo-composer-button')
    expect(shellSource).toContain('data-deceptive-cancel-todo-composer-button')
    expect(shellSource).toContain('data-deceptive-todo-sort-input')
    expect(shellSource).toContain('name="deceptive-internet-todo-sort"')
    expect(shellSource).toContain('data-deceptive-todo-toolbar hidden')
    expect(shellSource).toContain('data-deceptive-todo-reset-toolbar hidden')
    expect(shellSource).toContain('data-deceptive-open-todo-reset-dialog-button')
    expect(shellSource).toContain('data-deceptive-todo-reset-dialog')
    expect(shellSource).toContain('data-deceptive-todo-reset-confirm-panel')
    expect(shellSource).toContain('data-deceptive-accept-todo-reset-button')
    expect(shellSource).toContain('data-deceptive-reject-todo-reset-button')
    expect(shellSource).toContain('data-deceptive-todo-reset-progress-panel')
    expect(shellSource).toContain('data-deceptive-todo-reset-progress-track')
    expect(shellSource).toContain('data-deceptive-todo-reset-progress-fill')
    expect(shellSource).toContain('data-deceptive-todo-reset-progress-value')
    expect(shellSource).toContain('data-deceptive-cancel-whole-todo-reset-button')
    expect(shellSource).toContain('data-deceptive-stop-todo-reset-button')
    expect(shellSource).toContain('data-deceptive-todo-list')
    expect(shellSource).not.toContain('현재 로컬 시간')
    expect(shellSource).not.toContain('회원 가입하기')
  })
})
