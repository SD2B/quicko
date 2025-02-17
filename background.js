chrome.runtime.onInstalled.addListener(() => {
  console.log("Quicko Extension Installed!");
});

// Function to change the action popup and open it
function openDynamicPopup(popupFile) {
  chrome.action.setPopup({ popup: popupFile }, () => {
    chrome.action.openPopup();
  });
}

// Open the popup when the shortcut is pressed
chrome.commands.onCommand.addListener((command) => {
  if (command === "open-quicko") {
    openDynamicPopup("popup.html");
  } else if (command === "open-clipboard") {
    openDynamicPopup("clipboard_popup.html");
  }
});
