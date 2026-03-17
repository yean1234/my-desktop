/*
 * This file is for creating the desktop app shell.
 */
export const createApp = () => {
  const appElement = document.querySelector<HTMLDivElement>('#app')
  const desktopRootElement = document.querySelector<HTMLDivElement>('#desktop-root')

  if (!appElement || !desktopRootElement) {
    throw new Error('Basic desktop HTML structure is missing')
  }

  return {
    appElement,
    desktopRootElement,
  }
}
