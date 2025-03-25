// clipboard

document.addEventListener("keydown", function (event) {
    if (event.altKey && event.code === "KeyC") {
        chrome.runtime.sendMessage({ action: "open_alt_c_popup" });
    }
});

document.addEventListener("DOMContentLoaded", () => {
    loadClipboardItems();
    document.getElementById("search").addEventListener("input", searchClipboard);
});

let editingId = null;

document.getElementById("copy-btn").addEventListener("click", function () {
    const titleInput = document.getElementById("clipboard-title").value.trim();
    const textInput = document.getElementById("clipboard-text").value.trim();

    if (textInput) {
        const title = titleInput || textInput.split(" ")[0];
        if (editingId === null) {
            saveClipboardItem(title, textInput);
        } else {
            updateClipboardItem(editingId, title, textInput);
        }
        document.getElementById("clipboard-title").value = "";
        document.getElementById("clipboard-text").value = "";
        document.getElementById("copy-btn").textContent = "Add";
        editingId = null;
    }
});

function generateId() {
    return Date.now().toString();
}

function saveClipboardItem(title, text) {
    chrome.storage.local.get({ clipboardItems: [] }, function (data) {
        const items = data.clipboardItems;
        const newItem = { id: generateId(), title, text };
        items.push(newItem);
        chrome.storage.local.set({ clipboardItems: items }, loadClipboardItems);
    });
}

function updateClipboardItem(id, title, text) {
    chrome.storage.local.get({ clipboardItems: [] }, function (data) {
        let items = data.clipboardItems.map(item =>
            item.id === id ? { ...item, title, text } : item
        );
        chrome.storage.local.set({ clipboardItems: items }, function () {
            loadClipboardItems();
            document.getElementById("copy-btn").textContent = "Add";
            editingId = null;
        });
    });
}

function loadClipboardItems(searchQuery = "") {
    chrome.storage.local.get({ clipboardItems: [] }, function (data) {
        const container = document.getElementById("clipboard-contents");
        container.innerHTML = "";

        data.clipboardItems
            .filter(item => item.title.toLowerCase().includes(searchQuery.toLowerCase()))
            .forEach((item) => {
                const itemDiv = document.createElement("div");
                itemDiv.classList.add("clipboard-item");

                itemDiv.innerHTML = `
                    <div class="clipboard-title">${item.title}</div>
                    <div class="clipboard-text">${item.text}</div>
                    <div class="clipboard-buttons">
                        <button class="copy-btn">📋</button>
                        <button class="edit-btn">✏️</button>
                        <button class="delete-btn"></button>
                    </div>
                `;

                const copyBtn = itemDiv.querySelector(".copy-btn");

                copyBtn.addEventListener("click", () => {
                    navigator.clipboard.writeText(item.text).then(() => {
                        copyBtn.textContent = "Copied!";
                        setTimeout(() => {
                            copyBtn.textContent = "📋";
                        }, 2000);
                    });
                });

                itemDiv.querySelector(".edit-btn").addEventListener("click", () => {
                    document.getElementById("clipboard-title").value = item.title;
                    document.getElementById("clipboard-text").value = item.text;
                    document.getElementById("copy-btn").textContent = "Update";
                    editingId = item.id;
                });

                itemDiv.querySelector(".delete-btn").addEventListener("click", () => {
                    deleteClipboardItem(item.id);
                });

                container.appendChild(itemDiv);
            });
    });
}

function deleteClipboardItem(id) {
    chrome.storage.local.get({ clipboardItems: [] }, function (data) {
        const updatedItems = data.clipboardItems.filter(item => item.id !== id);
        chrome.storage.local.set({ clipboardItems: updatedItems }, loadClipboardItems);
    });
}

function searchClipboard() {
    const query = document.getElementById("search").value.trim();
    loadClipboardItems(query);
}
