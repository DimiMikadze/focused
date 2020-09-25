/**
 * Attaches Click event listeners to footer buttons.
 */
function attachListenersToFooter(): void {
  const blockedListButton = document.querySelector('[data-footer-blocked-list-button]') as HTMLButtonElement;
  blockedListButton.addEventListener('click', () => chrome.tabs.create({ url: 'options.html' }));
}

export default attachListenersToFooter;
