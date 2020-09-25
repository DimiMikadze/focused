import { setFaviconUrl } from '../utils/index';
import { Storage } from '../storage/index';
import { SiteStatus, SiteMessage } from '../constants/index';

/**
 * Renders the site information based on focus mode and the current URL.
 */
export default function renderSiteInfo(
  focusMode: boolean,
  status: SiteStatus,
  siteName: string,
  tabId: number,
  url: string
): void {
  const nameFaviconContainerEl = document.querySelector('[data-siteinfo-container]') as HTMLDivElement;
  const nameEl = document.querySelector('[data-siteinfo-name]') as HTMLDivElement;
  const faviconEl = document.querySelector('[data-siteinfo-favicon]') as HTMLDivElement;
  const buttonEl = document.querySelector('[data-siteinfo-button]') as HTMLButtonElement;
  const messagesEl = document.querySelector('[data-siteinfo-messages]') as HTMLDivElement;

  function setSiteInfoVisibility(visibility: boolean): void {
    if (visibility) {
      return nameFaviconContainerEl.classList.add('siteinfo-container-visible');
    }
    return nameFaviconContainerEl.classList.remove('siteinfo-container-visible');
  }

  function setBlockButtonVisibility(visibility: boolean): void {
    if (visibility) {
      return buttonEl.classList.add('siteinfo-button-visible');
    }
    return buttonEl.classList.remove('siteinfo-button-visible');
  }

  function setMessage(message: string): void {
    messagesEl.innerText = message;
  }

  function setSiteName(): void {
    nameEl.innerText = siteName;
  }

  function setSiteFavicon(siteName: string): void {
    faviconEl.style.backgroundImage = `url(${setFaviconUrl(siteName)})`;
  }

  async function blockCurrentSite(): Promise<void> {
    await Storage.addToBlockedWebSites(siteName);
    chrome.tabs.update(tabId, { url: `blocked.html?site=${url}` });
    window.close();
  }

  if (buttonEl) {
    buttonEl.addEventListener('click', blockCurrentSite);
  }

  if (!focusMode) {
    setSiteInfoVisibility(false);
    setBlockButtonVisibility(false);
    setMessage(SiteMessage.FOCUS_MODE_OFF);
    return;
  }

  function unAvailableForBlocking(): void {
    setSiteInfoVisibility(false);
    setBlockButtonVisibility(false);
    setMessage(SiteMessage.UNAVAILABLE_FOR_BLOCKING);
  }

  function alreadyBlocked(): void {
    setSiteInfoVisibility(true);
    setBlockButtonVisibility(false);
    setMessage(SiteMessage.ALREADY_BLOCKED);
    setSiteName();
    setSiteFavicon(siteName);
  }

  function availableForBlocking(): void {
    setSiteInfoVisibility(true);
    setBlockButtonVisibility(true);
    setMessage(SiteMessage.AVAILABLE_FOR_BLOCKING);
    setSiteName();
    setSiteFavicon(siteName);
  }

  switch (status) {
    case SiteStatus.UNAVAILABLE_FOR_BLOCKING:
      unAvailableForBlocking();
      break;
    case SiteStatus.ALREADY_BLOCKED:
      alreadyBlocked();
      break;
    case SiteStatus.AVAILABLE_FOR_BLOCKING:
      availableForBlocking();
      break;
    default:
      return;
  }
}
