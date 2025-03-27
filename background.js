let timedDomains = {};
let manualBlockedDomains = [];

// Load blocklists from storage
async function loadDomains() {
  const data = await browser.storage.local.get(["timedDomains", "manualBlockedDomains"]);
  timedDomains = data.timedDomains || {};
  manualBlockedDomains = data.manualBlockedDomains || [];
  console.log("Loaded domains:", { timedDomains, manualBlockedDomains });
}

// Save blocklists to storage
async function saveDomains() {
  await browser.storage.local.set({ timedDomains, manualBlockedDomains });
  console.log("Saved domains:", { timedDomains, manualBlockedDomains });
}

// Timer logic to decrement remaining time for timed domains
function updateTimers() {
  setInterval(() => {
    for (const domain in timedDomains) {
      timedDomains[domain].remainingTime--;
      if (timedDomains[domain].remainingTime <= 0) {
        console.log(`Time expired for: ${domain}`);
        delete timedDomains[domain];
      }
    }
    saveDomains();
  }, 60000); // Decrement every minute
}

// Blocking logic
function blockRequest(details) {
  const urlObj = new URL(details.url);
  const domain = urlObj.hostname.replace(/^www\./, "");

  if (
    manualBlockedDomains.includes(domain) ||
    (timedDomains[domain] && timedDomains[domain].remainingTime > 0)
  ) {
    console.log(`Blocked: ${details.url}`);
    return { redirectUrl: browser.runtime.getURL("blocked.html") };
  }
}

// Listener for blocklist updates
browser.runtime.onMessage.addListener(async (message) => {
  if (message.command === "addToBlocklist") {
    const domain = message.domain.replace(/^www\./, "");
    if (!manualBlockedDomains.includes(domain)) {
      manualBlockedDomains.push(domain);
    }
    await saveDomains();
  } else if (message.command === "addTimedBlocklist") {
    const domain = message.domain.replace(/^www\./, "");
    timedDomains[domain] = { originalTime: message.timeLimit, remainingTime: message.timeLimit };
    await saveDomains();
  } else if (message.command === "removeFromBlocklist") {
    const domain = message.domain.replace(/^www\./, "");
    manualBlockedDomains = manualBlockedDomains.filter((d) => d !== domain);
    delete timedDomains[domain]; // Also remove from timedDomains
    await saveDomains();
  } else if (message.command === "getBlocklists") {
    return { manualBlockedDomains, timedDomains };
  }
});

// Listener to block requests
browser.webRequest.onBeforeRequest.addListener(
  blockRequest,
  { urls: ["<all_urls>"] },
  ["blocking"]
);

// Initialize blocklist and timers
loadDomains();
updateTimers();
