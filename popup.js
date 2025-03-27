const blocklistUl = document.getElementById("blocklist");
const domainInput = document.getElementById("domainInput");
const timeInput = document.getElementById("timeInput");
const addButton = document.getElementById("addButton");

// Load blocklist from background
async function loadBlocklist() {
  const data = await browser.runtime.sendMessage({ command: "getBlocklists" });
  const manualBlockedDomains = data.manualBlockedDomains || [];
  const timedDomains = data.timedDomains || {};

  const fullBlocklist = [...manualBlockedDomains, ...Object.keys(timedDomains)];
  updateBlocklistUI(fullBlocklist, manualBlockedDomains, timedDomains, blocklistUl);
}

// Update blocklist UI
function updateBlocklistUI(blocklist, manualBlockedDomains, timedDomains, listElement) {
  listElement.innerHTML = "";
  blocklist.forEach((domain) => {
    const li = document.createElement("li");

    li.textContent = domain;

    if (timedDomains[domain]) {
      const timer = document.createElement("span");
      timer.className = "timer";
      timer.textContent = ` - ${timedDomains[domain].remainingTime} mins left`;
      li.appendChild(timer);
    }

    const removeBtn = document.createElement("button");
    removeBtn.textContent = "Remove";
    removeBtn.classList.add("remove-btn");
    removeBtn.addEventListener("click", () => removeFromBlocklist(domain));

    li.appendChild(removeBtn);
    listElement.appendChild(li);
  });
}

// Add domain
addButton.addEventListener("click", () => {
  const domain = domainInput.value.trim();
  const time = parseInt(timeInput.value.trim(), 10) || 0;

  if (domain) {
    if (time > 0) {
      browser.runtime.sendMessage({ command: "addTimedBlocklist", domain, timeLimit: time });
    } else {
      browser.runtime.sendMessage({ command: "addToBlocklist", domain });
    }
    domainInput.value = "";
    timeInput.value = "";
    loadBlocklist();
  }
});

// Remove domain
function removeFromBlocklist(domain) {
  browser.runtime.sendMessage({ command: "removeFromBlocklist", domain });
  loadBlocklist();
}

// Load blocklist on popup open
loadBlocklist();
