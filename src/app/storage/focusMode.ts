/**
 * Gets the focusMode boolean from Storage.
 */
export const getFocusMode = async (): Promise<boolean> => {
  const result = await chrome.storage.sync.get('focusMode');
  // Set focusMode to true initially.
  if (typeof result.focusMode === 'undefined' || result.focusMode === null) {
    return true;
  }
  return result.focusMode;
};

/**
 * Saves the focusMode boolean in Storage.
 */
export const saveFocusMode = async (mode: boolean): Promise<void> => {
  await chrome.storage.sync.set({ focusMode: mode });
};
