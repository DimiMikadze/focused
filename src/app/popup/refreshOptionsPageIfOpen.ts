/**
 * Refreshes the options page if open, to make sure the focus mode matches between the popup and options page.
 */
async function refreshOptionsPageIfOpen(): Promise<void> {
  const extensionId = chrome.runtime.id;
  const optionsPage = 'options.html';

  const tabs = await chrome.tabs.query({});
  tabs.forEach((tab) => {
    if (tab.url && tab.id && tab.url.includes(extensionId) && tab.url.includes(optionsPage)) {
      chrome.tabs.reload(tab.id);
    }
  });
}

export default refreshOptionsPageIfOpen;
