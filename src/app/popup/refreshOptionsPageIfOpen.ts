/**
 * Refreshes the options page if open, to make sure the focus mode matches between the popup and options page.
 */
function refreshOptionsPageIfOpen(): void {
  const extensionId = chrome.runtime.id;
  const optionsPage = 'options.html';

  chrome.tabs.query({}, (tabs) => {
    tabs.forEach((tab) => {
      if (tab.url && tab.id && tab.url.includes(extensionId) && tab.url.includes(optionsPage)) {
        chrome.tabs.reload(tab.id);
      }
    });
  });
}

export default refreshOptionsPageIfOpen;
