/*
 * This file is for composing the desktop shell HTML from smaller sections.
 */
import {
  createBrowserLaunchDialogMarkup,
  createBrowserShortcutMarkup,
  createBrowserWindowMarkup,
} from './internetBrowserSection'

type DesktopShellMarkupOptions = {
  internetExplorerIconMarkup: string
  deceptiveInternetExplorerIconMarkup: string
}

export const createDesktopShellMarkup = ({
  internetExplorerIconMarkup,
  deceptiveInternetExplorerIconMarkup,
}: DesktopShellMarkupOptions) => `
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
        ${createBrowserShortcutMarkup('default', internetExplorerIconMarkup)}
        ${createBrowserShortcutMarkup('deceptive', deceptiveInternetExplorerIconMarkup)}
      </aside>
      ${createBrowserLaunchDialogMarkup('default')}
      ${createBrowserWindowMarkup('default')}
      ${createBrowserLaunchDialogMarkup('deceptive')}
      ${createBrowserWindowMarkup('deceptive')}
    </div>
  </div>
`
