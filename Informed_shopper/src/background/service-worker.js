chrome.sidePanel
  .setOptions({
    enabled: true,
    path: "src/sidepanel/sidepanel.html"
  })
  .then(() => {
    console.log("Side panel configured successfully");
  })
  .catch(err => {
    console.warn("Side panel configuration failed:", err);
  });

chrome.action.onClicked.addListener(async (tab) => {
  try {
    // First try the proper side panel opening
    await chrome.sidePanel.open({ windowId: tab.windowId });
    
    // Verify if side panel actually opened
    const config = await chrome.sidePanel.getOptions({ windowId: tab.windowId });
    if (!config.enabled) {
      throw new Error("Side panel not enabled");
    }
  } catch (error) {
    console.warn("Standard side panel failed, using fallback:", error);
    // Only open fallback if side panel failed
    chrome.windows.create({
      url: chrome.runtime.getURL("src/sidepanel/sidepanel.html"),
      type: "popup",
      width: 400,
      height: 600,
      left: screen.width - 420  // Position it near the right edge
    });
  }
});

// Handle messages from content scripts for showing the modal
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === "showModal") {
    // Get dimensions from the request if available, otherwise use defaults
    const modalWidth = 500;
    const modalHeight = 600;
    
    // Use screen dimensions from the sender tab if available
    let screenWidth, screenHeight;
    
    if (request.screenWidth && request.screenHeight) {
      // Use dimensions sent from content script
      screenWidth = request.screenWidth;
      screenHeight = request.screenHeight;
    } else {
      // Fallback to global screen object
      screenWidth = screen.width || 1366; // Default if screen.width is undefined
      screenHeight = screen.height || 768; // Default if screen.height is undefined
    }
    
    // Calculate centered position
    const left = Math.max(0, Math.round((screenWidth - modalWidth) / 2));
    const top = Math.max(0, Math.round((screenHeight - modalHeight) / 2));
    
    // Create a new popup window for the modal
    chrome.windows.create({
      url: chrome.runtime.getURL("src/modal/modal.html"),
      type: "popup",
      width: modalWidth,
      height: modalHeight,
      left: left,
      top: top,
      focused: true // Ensure the modal gets focus
    }, (window) => {
      if (chrome.runtime.lastError) {
        console.error("Error creating modal window:", chrome.runtime.lastError);
      } else {
        console.log("Modal window created successfully:", window.id);
      }
    });
  }
});

// Handle alarms for reminders
chrome.alarms.onAlarm.addListener(function(alarm) {
  if (alarm.name === "purchaseReminder") {
    chrome.notifications.create({
      type: "basic",
      iconUrl: "/icons/eco-bag128.png", // Make sure this points to your actual icon
      title: "Purchase Reminder",
      message: "You wanted to reconsider a purchase. Open the extension to continue shopping or skip.",
      buttons: [
        { title: "Open" }
      ]
    });
  }
});

// Handle notification button clicks
chrome.notifications.onButtonClicked.addListener(function(notificationId, buttonIndex) {
  if (buttonIndex === 0) {
    // Open the popup
    chrome.action.openPopup();
  }
});