// clipboard

document.addEventListener("keydown", function (event) {
    if (event.altKey && event.code === "KeyC") {
        chrome.runtime.sendMessage({ action: "open_alt_c_popup" });
    }
});