document.addEventListener("DOMContentLoaded", () => {
    const shortcutList = document.getElementById("shortcut-list");
    const searchInput = document.getElementById("search");
    const nameInput = document.getElementById("shortcut-name");
    const urlInput = document.getElementById("shortcut-url");
    const addShortcutButton = document.getElementById("add-shortcut");
  
    // Focus on search bar
    searchInput.focus();
  
    // Load saved shortcuts
    function loadShortcuts() {
      chrome.storage.local.get("shortcuts", (data) => {
        const shortcuts = data.shortcuts || [];
        renderShortcuts(shortcuts);
      });
    }
  
    // Render shortcuts in the UI
    function renderShortcuts(shortcuts) {
      shortcutList.innerHTML = "";
      if (shortcuts.length === 0) {
        shortcutList.style.display = "none";
        searchInput.style.display = "none";
        return;
      } else {
        shortcutList.style.display = "block"; // Show if there are shortcuts
        searchInput.style.display = "block";
      }
      shortcuts.forEach((shortcut, index) => {
        const shortcutItem = document.createElement("div");
        shortcutItem.className = "shortcut-item";
  
        // Make entire tile clickable to open the URL
        shortcutItem.addEventListener("click", () => {
          window.open(shortcut.url, "_blank");
        });
  
        shortcutItem.innerHTML = `
          <div class="shortcut-info">
              <img src="https://www.google.com/s2/favicons?domain=${shortcut.url}" class="shortcut-icon">
              <div class="shortcut-title">${shortcut.name}</div>
          </div>
          <div class="shortcut-actions">
              <button class="copy-btn" data-url="${shortcut.url}">🔗</button>
              <button class="delete-btn" data-index="${index}">🗑</button>
          </div>
        `;
  
        shortcutList.appendChild(shortcutItem);
      });
  
      // Copy URL to clipboard
      document.querySelectorAll(".copy-btn").forEach((btn) => {
        btn.addEventListener("click", (e) => {
          e.stopPropagation();
          const url = e.target.dataset.url;
          navigator.clipboard.writeText(url).then(() => {
            const originalText = e.target.textContent;
            e.target.textContent = "✔ Copied!";
            setTimeout(() => (e.target.textContent = originalText), 1000);
          });
        });
      });
      
  
      // Delete shortcut
      document.querySelectorAll(".delete-btn").forEach((btn) => {
        btn.addEventListener("click", (e) => {
          e.stopPropagation(); // Prevent tile click
          const index = parseInt(e.target.dataset.index);
          deleteShortcut(index);
        });
      });
    }
  
    // Add shortcut
    addShortcutButton.addEventListener("click", () => {
      const name = nameInput.value.trim();
      const url = urlInput.value.trim();
  
      if (!name || !url) {
        alert("Please enter both name and URL.");
        return;
      }
  
      chrome.storage.local.get("shortcuts", (data) => {
        let shortcuts = data.shortcuts || [];
  
        // Check for duplicate name
        if (shortcuts.some((s) => s.name.toLowerCase() === name.toLowerCase())) {
          alert("Shortcut with this name already exists.");
          return;
        }
  
        shortcuts.push({ name, url });
  
        chrome.storage.local.set({ shortcuts }, () => {
          loadShortcuts();
          nameInput.value = "";
          urlInput.value = "";
        });
      });
    });
  
    // Delete shortcut
    function deleteShortcut(index) {
      chrome.storage.local.get("shortcuts", (data) => {
        let shortcuts = data.shortcuts || [];
        shortcuts.splice(index, 1);
        chrome.storage.local.set({ shortcuts }, loadShortcuts);
      });
    }
  
    // Search shortcuts
    searchInput.addEventListener("input", (e) => {
      const query = e.target.value.toLowerCase();
      chrome.storage.local.get("shortcuts", (data) => {
        const filteredShortcuts = (data.shortcuts || []).filter((shortcut) =>
          shortcut.name.toLowerCase().includes(query)
        );
        renderShortcuts(filteredShortcuts);
      });
    });
  
    // Initial load
    loadShortcuts();
  });
  


