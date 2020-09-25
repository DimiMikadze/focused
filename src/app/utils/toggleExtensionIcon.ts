/**
 * Toggles the extension's icons based on focus mode.
 */
export function toggleExtensionIcon(focusMode: boolean): Promise<void> {
  return new Promise((resolve) => {
    chrome.browserAction.setIcon(
      {
        path: {
          '16': `./static/icon16${focusMode ? '' : '-off'}.png`,
          '32': `./static/icon32${focusMode ? '' : '-off'}.png`,
          '48': `./static/icon48${focusMode ? '' : '-off'}.png`,
          '128': `./static/icon128${focusMode ? '' : '-off'}.png`,
        },
      },
      () => {
        resolve();
      }
    );
  });
}
