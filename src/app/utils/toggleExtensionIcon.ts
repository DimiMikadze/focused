/**
 * Toggles the extension's icons based on focus mode.
 */
export async function toggleExtensionIcon(focusMode: boolean): Promise<void> {
  await chrome.action.setIcon({
    path: {
      '16': `./static/icon16${focusMode ? '' : '-off'}.png`,
      '32': `./static/icon32${focusMode ? '' : '-off'}.png`,
      '48': `./static/icon48${focusMode ? '' : '-off'}.png`,
      '128': `./static/icon128${focusMode ? '' : '-off'}.png`,
    },
  });
}
