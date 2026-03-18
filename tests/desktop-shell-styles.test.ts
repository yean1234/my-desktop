import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

const shellStyles = readFileSync(
  resolve(process.cwd(), 'src/styles/desktop-shell.css'),
  'utf8',
)

describe('desktop shell styles', () => {
  it('shows the internet window as a fullscreen layer', () => {
    expect(shellStyles).toMatch(
      /\.retro-window--internet\s*\{[\s\S]*position:\s*fixed;[\s\S]*inset:\s*0;[\s\S]*min-height:\s*100vh;[\s\S]*grid-template-rows:\s*auto 1fr;/,
    )
  })

  it('keeps the internet window hidden until it is opened', () => {
    expect(shellStyles).toMatch(
      /\[data-internet-window\]\[hidden\]\s*\{[\s\S]*display:\s*none !important;/,
    )
  })

  it('shows a retro progress dialog before the internet window opens', () => {
    expect(shellStyles).toMatch(
      /\.internet-launch-dialog\s*\{[\s\S]*position:\s*fixed;[\s\S]*z-index:\s*11;[\s\S]*place-items:\s*center;/,
    )
    expect(shellStyles).toMatch(
      /\.internet-launch-dialog__track\s*\{[\s\S]*height:\s*24px;[\s\S]*border:\s*2px solid #53608c;/,
    )
    expect(shellStyles).toMatch(
      /\.internet-launch-dialog__fill\s*\{[\s\S]*background:[\s\S]*#ff89bf[\s\S]*#7cbeff[\s\S]*transition:\s*width 180ms steps\(6, end\);/,
    )
  })

  it('animates the internet window downward when it closes', () => {
    expect(shellStyles).toMatch(
      /\.retro-window--internet\.retro-window--closing\s*\{[\s\S]*animation:\s*internet-window-slide-out 280ms/,
    )
    expect(shellStyles).toMatch(
      /@keyframes internet-window-slide-out\s*\{[\s\S]*transform:\s*translateY\(100%\);/,
    )
  })

  it('centers the internet window body content', () => {
    expect(shellStyles).toMatch(
      /\.internet-window__body\s*\{[\s\S]*align-content:\s*center;[\s\S]*justify-items:\s*center;[\s\S]*text-align:\s*center;/,
    )
  })

  it('shows the local time without a badge background', () => {
    expect(shellStyles).toMatch(
      /\.internet-window__time-value\s*\{[\s\S]*font-size:\s*clamp\(32px, 5vw, 64px\);[\s\S]*background:\s*transparent;[\s\S]*border:\s*0;[\s\S]*box-shadow:\s*none;/,
    )
  })

  it('shows an inline retro name entry form inside the internet window', () => {
    expect(shellStyles).toMatch(
      /\.internet-name-entry\s*\{[\s\S]*width:\s*100%;[\s\S]*display:\s*grid;[\s\S]*gap:\s*10px;/,
    )
    expect(shellStyles).toMatch(
      /\.internet-name-entry__input\s*\{[\s\S]*min-height:\s*44px;[\s\S]*border:\s*2px solid #707ca6;[\s\S]*background:\s*#fffefc;/,
    )
    expect(shellStyles).toMatch(
      /\.internet-name-entry__button:disabled\s*\{[\s\S]*cursor:\s*not-allowed;/,
    )
  })

  it('shows a retro confirmation modal for the name change', () => {
    expect(shellStyles).toMatch(
      /\[data-name-entry-dialog\]\[hidden\],[\s\S]*\[data-name-confirm-dialog\]\[hidden\],[\s\S]*\[data-todo-composer\]\[hidden\],[\s\S]*\[data-todo-reset-toolbar\]\[hidden\],[\s\S]*\[data-todo-toolbar\]\[hidden\],[\s\S]*\[data-internet-launch-dialog\]\[hidden\],[\s\S]*\[data-todo-reset-confirm-panel\]\[hidden\],[\s\S]*\[data-todo-reset-progress-panel\]\[hidden\],[\s\S]*\[data-todo-reset-dialog\]\[hidden\]\s*\{[\s\S]*display:\s*none !important;/,
    )
    expect(shellStyles).toMatch(
      /\.internet-confirm-dialog\s*\{[\s\S]*position:\s*fixed;[\s\S]*place-items:\s*center;[\s\S]*background:\s*rgba\(68, 72, 123, 0.38\);/,
    )
    expect(shellStyles).toMatch(
      /\.internet-confirm-dialog__panel\s*\{[\s\S]*width:\s*min\(100%, 360px\);[\s\S]*display:\s*grid;[\s\S]*border:\s*2px solid #465279;/,
    )
  })

  it('shows the todo composer in the action row and the todo stack at the bottom right', () => {
    expect(shellStyles).toMatch(
      /\.internet-window__action-row\s*\{[\s\S]*display:\s*flex;[\s\S]*flex-wrap:\s*wrap;[\s\S]*gap:\s*14px;/,
    )
    expect(shellStyles).toMatch(
      /\.internet-window__action-slot--todo\s*\{[\s\S]*width:\s*min\(100%, 468px\);/,
    )
    expect(shellStyles).toMatch(
      /\.internet-window__join-button--todo\s*\{[\s\S]*width:\s*min\(100%, 320px\);/,
    )
    expect(shellStyles).toMatch(
      /\.internet-todo-composer\s*\{[\s\S]*grid-template-columns:\s*minmax\(0, 1fr\) auto auto;[\s\S]*align-items:\s*center;[\s\S]*gap:\s*8px;/,
    )
    expect(shellStyles).toMatch(
      /\.internet-todo-composer__input\s*\{[\s\S]*min-height:\s*44px;[\s\S]*border:\s*2px solid #6083b6;[\s\S]*background:\s*rgba\(249, 252, 255, 0.96\);/,
    )
    expect(shellStyles).toMatch(
      /\.internet-todo-composer__button\s*\{[\s\S]*min-width:\s*80px;[\s\S]*min-height:\s*40px;/,
    )
    expect(shellStyles).toMatch(
      /\.internet-todo-toolbar\s*\{[\s\S]*width:\s*100%;[\s\S]*display:\s*flex;[\s\S]*justify-content:\s*center;/,
    )
    expect(shellStyles).toMatch(
      /\.internet-sort-group\s*\{[\s\S]*padding:\s*0;[\s\S]*display:\s*flex;[\s\S]*flex-wrap:\s*wrap;[\s\S]*justify-content:\s*center;/,
    )
    expect(shellStyles).toMatch(
      /\.internet-todo-reset-button\s*\{[\s\S]*min-width:\s*120px;[\s\S]*font-weight:\s*700;/,
    )
    expect(shellStyles).toMatch(
      /\.internet-todo-dock\s*\{[\s\S]*position:\s*fixed;[\s\S]*right:\s*24px;[\s\S]*bottom:\s*24px;[\s\S]*display:\s*grid;/,
    )
    expect(shellStyles).toMatch(
      /\.internet-todo-stack\s*\{[\s\S]*display:\s*flex;[\s\S]*flex-direction:\s*column-reverse;[\s\S]*align-items:\s*stretch;[\s\S]*max-height:\s*min\(180px, 22vh\);[\s\S]*overflow-y:\s*auto;/,
    )
  })

  it('shows a retro progress reset dialog for the todo list', () => {
    expect(shellStyles).toMatch(
      /\.internet-confirm-dialog__panel--todo-reset-progress\s*\{[\s\S]*width:\s*min\(100%, 420px\);/,
    )
    expect(shellStyles).toMatch(
      /\.internet-reset-progress\s*\{[\s\S]*height:\s*24px;[\s\S]*border:\s*2px solid #53608c;/,
    )
    expect(shellStyles).toMatch(
      /\.internet-reset-progress__fill\s*\{[\s\S]*background:[\s\S]*#ff89bf[\s\S]*#7cbeff[\s\S]*transition:\s*width 220ms steps\(6, end\);/,
    )
    expect(shellStyles).toMatch(
      /\.internet-confirm-dialog__button--stop\s*\{[\s\S]*background:\s*linear-gradient\(180deg, #b66484 0%, #7e3956 100%\);/,
    )
    expect(shellStyles).toMatch(
      /\.internet-confirm-dialog__button--stop:hover\s*\{[\s\S]*background:\s*linear-gradient\(180deg, #b66484 0%, #7e3956 100%\);/,
    )
  })

  it('animates todo banners to the left when they are checked', () => {
    expect(shellStyles).toMatch(
      /\.internet-todo-banner--removing\s*\{[\s\S]*animation:\s*internet-todo-dismiss 320ms/,
    )
    expect(shellStyles).toMatch(
      /@keyframes internet-todo-dismiss\s*\{[\s\S]*transform:\s*translateX\(-120%\);/,
    )
  })
})
