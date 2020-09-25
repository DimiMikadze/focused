/**
 * Gets the focusMode boolean from Storage.
 */
export const getFocusMode = (): Promise<boolean> => {
  return new Promise((resolve) => {
    return chrome.storage.sync.get('focusMode', (result) => {
      // Set focusMode to true initially.
      if (typeof result.focusMode === 'undefined' || result.focusMode === null) {
        return resolve(true);
      }

      return resolve(result.focusMode);
    });
  });
};

/**
 * Saves the focusMode boolean in Storage.
 */
export const saveFocusMode = (mode: boolean): Promise<void> => {
  return new Promise((resolve) => {
    return chrome.storage.sync.set({ focusMode: mode }, () => {
      resolve();
    });
  });
};
