import animateIllustration from './animateIllustration';
import renderSiteInfo from './renderSiteInfo';
import getCurrentSiteStatus from './getCurrentSiteStatus';
import attachListenersToFooter from './footerEventListeners';
import refreshOptionsPageIfOpen from './refreshOptionsPageIfOpen';
import { renderToggle, toggleExtensionIcon } from '../utils/index';
import { Storage } from '../storage/index';
import { Events } from '../constants/index';

import '../../styles/global.css';
import '../../styles/popup.css';
import '../../styles/toggle.css';

/**
 * Initializes scripts for the extensions popup.
 */
async function popup(): Promise<void> {
  let focusMode: boolean = await Storage.getFocusMode();
  const { siteStatus, siteName, tabId, url } = await getCurrentSiteStatus();

  // Toggles the focus mode and triggers required changes (animation/re-rendering)
  async function toggleFocusMode(): Promise<void> {
    focusMode = !focusMode;
    Storage.saveFocusMode(focusMode);
    animateIllustration(focusMode);
    renderSiteInfo(focusMode, siteStatus, siteName, tabId, url);
    await toggleExtensionIcon(focusMode);

    const blockedSites: string[] = await Storage.getBlockedWebSites();
    if (blockedSites.includes(siteName)) {
      chrome.runtime.sendMessage({
        event: Events.FOCUS_MODE_CHANGED,
        mode: focusMode,
        tabId,
        url,
      });
    }
    refreshOptionsPageIfOpen();
  }

  renderToggle(focusMode, toggleFocusMode, 'data-header');

  animateIllustration(focusMode);

  renderSiteInfo(focusMode, siteStatus, siteName, tabId, url);

  attachListenersToFooter();
}

popup();
