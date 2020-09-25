import { isValidUrl, setFaviconUrl, getDomainNameFromURL, renderToggle, toggleExtensionIcon } from '../utils/index';
import { Storage } from '../storage/index';
import { ErrorMessage } from '../constants/index';

import '../../styles/global.css';
import '../../styles/options.css';
import '../../styles/toggle.css';

/**
 * Renders the blocked websites list.
 */
export async function renderBlockedWebsites(): Promise<void> {
  const listElement = document.getElementById('blocked-sites-list') as HTMLUListElement;
  const listItemTemplate = (document.getElementById('template-list-item') as HTMLTemplateElement).content;

  // Clear the list so we can "re-render" the blocked websites data.
  listElement.innerHTML = '';

  const websites: string[] = await Storage.getBlockedWebSites();

  const listTitleEl = document.querySelector('[data-list-title]') as HTMLHeadElement;
  listTitleEl.style.display = websites.length > 0 ? 'block' : 'none';

  websites.forEach((website) => {
    const li = listItemTemplate.cloneNode(true) as HTMLLIElement;
    const title = li.querySelector('span') as HTMLSpanElement;
    const listFavicon = li.querySelector('img') as HTMLImageElement;

    listFavicon.src = setFaviconUrl(website);

    title.textContent = website;

    const deleteButton = li.querySelector('button') as HTMLButtonElement;
    deleteButton.addEventListener('click', async () => {
      await Storage.removeFromBlockedWebSites(website);
      renderBlockedWebsites();
    });

    listElement.appendChild(li);
  });
}

/**
 * Re-renders the blocked websites list on options page activation.
 *
 * We need to re-render the list on the options tab activation since
 * the site can be added to the blocked list also from the extensions popup.
 */
function reRenderBlockedListOnTabActivation(): void {
  chrome.tabs.onActivated.addListener(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
      const tab = tabs[0];
      if (!tab.url || !tab.id) {
        return false;
      }

      const extensionId = chrome.runtime.id;
      const optionsPage = 'options.html';
      const isOptionsPage = tab.url.includes(extensionId) && tab.url.includes(optionsPage);

      if (isOptionsPage) {
        renderBlockedWebsites();
      }
    });
  });
}

/**
 * Submits the add site to the blocked list form.
 */
function listenToFormSubmission(): void {
  const form = document.querySelector('[data-form]') as HTMLFormElement;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const notificationEl = document.querySelector('[data-notifications]') as HTMLParagraphElement;
    const inputEl = document.querySelector('[data-input]') as HTMLInputElement;
    const value = inputEl.value.toLocaleLowerCase();

    if (!value) {
      inputEl.classList.add('input-error');
      notificationEl.innerHTML = ErrorMessage.INVALID_URL;
      return;
    }

    const domainName = getDomainNameFromURL(value);
    const blockedList: string[] = await Storage.getBlockedWebSites();
    const isAlreadyBlocked = blockedList.includes(domainName);
    if (isAlreadyBlocked) {
      inputEl.classList.add('input-error');
      notificationEl.innerHTML = `<b>${value}</b> ${ErrorMessage.ALREADY_BLOCKED}`;
      return;
    }

    if (!isValidUrl(value)) {
      inputEl.classList.add('input-error');
      notificationEl.innerHTML = ErrorMessage.INVALID_URL;
      return;
    }

    inputEl.value = '';
    inputEl.classList.remove('input-error');
    notificationEl.innerHTML = '';
    await Storage.addToBlockedWebSites(domainName);
    renderBlockedWebsites();
  });
}

/**
 * Renders the toggle component that switches the focus mode.
 */
async function renderFocusModeToggle(): Promise<void> {
  let focusMode: boolean = await Storage.getFocusMode();

  const logoEl = document.querySelector('[data-logo]') as HTMLHeadingElement;
  function addColorToLogo(): void {
    if (focusMode) {
      logoEl.classList.remove('logo-off');
      logoEl.classList.add('logo-on');
    } else {
      logoEl.classList.remove('logo-on');
      logoEl.classList.add('logo-off');
    }
  }

  addColorToLogo();
  function toggleFocusMode(): void {
    focusMode = !focusMode;
    addColorToLogo();
    Storage.saveFocusMode(focusMode);
    toggleExtensionIcon(focusMode);
  }

  renderToggle(focusMode, toggleFocusMode, 'data-heading');
}

renderFocusModeToggle();
listenToFormSubmission();
renderBlockedWebsites();
reRenderBlockedListOnTabActivation();
