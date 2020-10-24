import { isValidUrl, setFaviconUrl, getDomainNameFromURL, renderToggle, toggleExtensionIcon } from '../utils/index';
import { Storage } from '../storage/index';
import { ErrorMessage, WEBSITE_SUGGESTIONS } from '../constants/index';

import '../../styles/global.css';
import '../../styles/options.css';
import '../../styles/toggle.css';

/**
 * Renders the blocked websites list.
 */
export async function renderBlockedWebsites(): Promise<void> {
  const template = (document.getElementById('template-blocked-websites') as HTMLTemplateElement).content;
  const ulElement = document.querySelector('[data-blocked-websites-ul]') as HTMLUListElement;

  // Clear the list so we can "re-render" the blocked websites data.
  ulElement.innerHTML = '';

  const websites: string[] = await Storage.getBlockedWebSites();
  const titleEl = document.querySelector('[data-blocked-websites-title]') as HTMLHeadElement;
  titleEl.style.display = websites.length > 0 ? 'block' : 'none';

  websites.forEach((website) => {
    const li = template.cloneNode(true) as HTMLLIElement;
    const name = li.querySelector('[data-blocked-websites-name]') as HTMLSpanElement;
    const favicon = li.querySelector('[data-blocked-websites-favicon]') as HTMLImageElement;

    favicon.src = setFaviconUrl(website);
    name.textContent = website;

    const deleteButton = li.querySelector('[data-blocked-websites-button]') as HTMLButtonElement;
    deleteButton.addEventListener('click', async () => {
      await Storage.removeFromBlockedWebSites(website);
      renderBlockedWebsites();
    });

    ulElement.appendChild(li);
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

/**
 * Renders the autocomplete component.
 */
function autocomplete(): void {
  let autocompleteVisible = false;
  let focusedListItemIndex: number | null = null;

  const inputEl = document.querySelector('[data-input]') as HTMLInputElement;
  const autocompleteEl = document.querySelector('[data-autocomplete]') as HTMLDivElement;
  const ulElement = document.querySelector('[data-autocomplete-ul]') as HTMLUListElement;
  const template = (document.getElementById('template-autocomplete') as HTMLTemplateElement).content;
  const submitButton = document.querySelector('[data-submit]') as HTMLButtonElement;

  function hideAutocomplete(): void {
    focusedListItemIndex = null;
    ulElement.innerHTML = '';
    inputEl.classList.remove('input-active');
    autocompleteEl.classList.remove('autocomplete-visible');
    autocompleteVisible = false;
  }

  // On input event listener.
  async function onInput(e: Event): Promise<void> {
    hideAutocomplete();
    // We need to get the blocked websites on every input change
    // since a user can delete a website from the blocked list by clicking on a trash icon.
    const blockedWebsites: string[] = await Storage.getBlockedWebSites();
    const value = (e.target as HTMLInputElement).value.toLocaleLowerCase();

    WEBSITE_SUGGESTIONS.map((website) => {
      // Check if the input value matches with the suggestions and it's not blocked already.
      if (website.substr(0, value.length) === value && !blockedWebsites.includes(website)) {
        autocompleteVisible = true;

        const li = template.cloneNode(true) as HTMLLIElement;
        const buttonEl = li.querySelector('[data-autocomplete-button]') as HTMLSpanElement;
        const faviconEl = li.querySelector('[data-autocomplete-favicon]') as HTMLImageElement;
        const nameEl = li.querySelector('[data-autocomplete-name]') as HTMLSpanElement;

        // Make visible the autocomplete container and fill the website's information into the template.
        inputEl.classList.add('input-active');
        autocompleteEl.classList.add('autocomplete-visible');
        faviconEl.src = setFaviconUrl(website);
        nameEl.textContent = website;

        buttonEl.addEventListener('click', async () => {
          // Fill the input with the website and simulate a click on the submit button.
          inputEl.value = website;
          submitButton.click();
          hideAutocomplete();
        });

        buttonEl.addEventListener('mouseover', (e) => {
          // Highlight the current button and update the focusedListItemIndex value with its index.
          const buttons = document.querySelectorAll('[data-autocomplete-button]');
          Array.from(buttons).map((b) => b.classList.remove('autocomplete-button-active'));
          buttonEl.classList.add('autocomplete-button-active');
          const index = Array.prototype.indexOf.call(buttons, e.target);
          focusedListItemIndex = index;
        });

        ulElement.appendChild(li);
      }
    });
  }

  // On key down event listener.
  function onKeyDown(e: KeyboardEvent): void {
    const buttons = document.querySelectorAll('[data-autocomplete-button]');
    const keys = ['ArrowDown', 'ArrowUp', 'Enter'];

    if (!keys.includes(e.key) && !buttons.length) {
      return;
    }

    if (e.key === 'ArrowDown') {
      if (focusedListItemIndex === null || focusedListItemIndex === buttons.length - 1) {
        focusedListItemIndex = 0;
      } else {
        focusedListItemIndex++;
      }
    }

    if (e.key === 'ArrowUp') {
      if (focusedListItemIndex === null) {
        return;
      }

      if (focusedListItemIndex === 0) {
        focusedListItemIndex = buttons.length - 1;
      } else {
        focusedListItemIndex--;
      }
    }

    if (focusedListItemIndex !== null) {
      Array.from(buttons).map((b) => b.classList.remove('autocomplete-button-active'));
      buttons[focusedListItemIndex].classList.add('autocomplete-button-active');
    }

    if (e.key === 'Enter' && focusedListItemIndex !== null) {
      const button = buttons[focusedListItemIndex] as HTMLButtonElement;
      inputEl.value = button.innerText.trim();
      hideAutocomplete();
    }
  }

  inputEl.addEventListener('input', onInput);
  inputEl.addEventListener('click', onInput);
  inputEl.addEventListener('keydown', onKeyDown);
  document.addEventListener('click', (e: Event) => {
    if (!autocompleteVisible) return;

    // Hide the autocomplete if a user clicked outside of the input.
    const target = e.target as HTMLElement;
    if (!inputEl.contains(target)) {
      hideAutocomplete();
    }
  });
}

renderFocusModeToggle();
listenToFormSubmission();
renderBlockedWebsites();
reRenderBlockedListOnTabActivation();
autocomplete();
