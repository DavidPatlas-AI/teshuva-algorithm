// Service worker — handles cross-tab stats aggregation

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.set({
    allTime: {},
    weights: {},
    installedAt: Date.now()
  });
});

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.type === "GET_STATS") {
    chrome.storage.local.get(["allTime", "weights"], data => {
      sendResponse({ allTime: data.allTime || {}, weights: data.weights || {} });
    });
    return true;
  }

  if (msg.type === "RESET_STATS") {
    chrome.storage.local.set({ allTime: {}, weights: {} });
    sendResponse({ ok: true });
    return true;
  }
});
