import { getBlockedWebSites, addToBlockedWebSites, removeFromBlockedWebSites } from './blockedWebsites';
import { getFocusMode, saveFocusMode } from './focusMode';

export const Storage = {
  getBlockedWebSites,
  addToBlockedWebSites,
  removeFromBlockedWebSites,
  getFocusMode,
  saveFocusMode,
};
