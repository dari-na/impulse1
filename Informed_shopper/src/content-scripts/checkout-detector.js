// src/content-scripts/checkout-detector.js
function detectCheckoutButtons() {
  console.log('🟢 detectCheckoutButtons running...');

  const checkoutSelectors = [
    'a.submitBtn', // ✅ Shein's Checkout Now button
    'input[name="proceedToRetailCheckout"]',
    'input[value*="Proceed to checkout"]',
    'a[href*="checkout"]',
    'button[id*="checkout"]',
    'a[id*="checkout"]',
    'button[class*="checkout"]',
    'a[class*="checkout"]',
  ];

  const selector = checkoutSelectors.join(', ');
  const checkoutButtons = document.querySelectorAll(selector);

  console.log("🛒 Found potential checkout buttons:", checkoutButtons);

  checkoutButtons.forEach(button => {
    // Avoid double-binding
    if (button.dataset.listenerAttached === "true") return;

    button.dataset.listenerAttached = "true";

    button.addEventListener("click", function(event) {
      console.log("🟠 Checkout button clicked:", button);

      event.preventDefault();
      event.stopPropagation();

      injectModal();

      sessionStorage.setItem('originalCheckoutUrl', button.href || document.location.href);

      window.addEventListener('message', function modalMessageHandler(event) {
        if (event.data.action === 'continueCheckout') {
          const originalUrl = sessionStorage.getItem('originalCheckoutUrl');
          if (originalUrl) {
            window.location.href = originalUrl;
          }
          window.removeEventListener('message', modalMessageHandler);
        } else if (event.data.action === 'closeModal') {
          console.log('❌ User closed the modal.');
          window.removeEventListener('message', modalMessageHandler);
        }
      });
    });
  });
}
  
  // Function to inject the modal overlay into the page
  function injectModal() {
    // First check if modal already exists
    if (document.getElementById('purchase-impact-modal-overlay')) {
      return;
    }
    
    // Create iframe to load modal content
    const iframe = document.createElement('iframe');
    iframe.src = chrome.runtime.getURL('src/sidepanel/sidepanel.html?autoStart=true');
    iframe.id = 'purchase-impact-modal-content';
    iframe.style.width = '500px';
    iframe.style.height = '600px';
    iframe.style.border = 'none';
    iframe.style.borderRadius = '12px';
    iframe.style.boxShadow = '0 4px 20px rgba(0,0,0,0.3)';
    
    // Create overlay div
    const overlay = document.createElement('div');
    overlay.id = 'purchase-impact-modal-overlay';
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.backgroundColor = 'rgba(0,0,0,0.5)';
    overlay.style.display = 'flex';
    overlay.style.justifyContent = 'center';
    overlay.style.alignItems = 'center';
    overlay.style.zIndex = '999999';
    
    // Add iframe to overlay
    overlay.appendChild(iframe);
    
    // Add overlay to page
    document.body.appendChild(overlay);
    
    // Add event listener to close modal when clicking outside
    overlay.addEventListener('click', function(event) {
      if (event.target === overlay) {
        closeModal();
      }
    });
    
    // Prevent scrolling on the body while modal is open
    document.body.style.overflow = 'hidden';
  }
  
  // Function to close the modal
  function closeModal() {
    const overlay = document.getElementById('purchase-impact-modal-overlay');
    if (overlay) {
      document.body.removeChild(overlay);
      document.body.style.overflow = '';
    }
  }
  
  // Listen for messages from the modal iframe
  checkoutButtons.forEach(button => {    
      button.addEventListener('click', function(event) {
        event.preventDefault();
        event.stopPropagation();
    
        injectModal();
    
        sessionStorage.setItem('originalCheckoutUrl', button.href || document.location.href);
  
      // Store the intended checkout URL
      sessionStorage.setItem('originalCheckoutUrl', button.href || document.location.href);
  
      // Ask background script to open popup
      chrome.runtime.sendMessage({ action: "showModal" });
    });
  });
  
  // Run detector when page loads and also periodically to catch dynamically added buttons
  document.addEventListener('DOMContentLoaded', detectCheckoutButtons);
  // Check every 2 seconds for new buttons (for dynamic sites)
  setInterval(detectCheckoutButtons, 2000);