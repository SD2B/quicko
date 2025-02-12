chrome.runtime.onInstalled.addListener(() => {
  console.log("Quicko Extension Installed!");
});

// Open the popup when the shortcut is pressed
chrome.commands.onCommand.addListener((command) => {
  if (command === "open-quicko") {
      chrome.action.openPopup();
  }
});
