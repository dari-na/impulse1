// src/content-scripts/checkout-detector.js
function detectCheckoutButtons() {
  console.log('detectCheckoutButtons is running');
    // Common checkout button selectors for popular retail sites
    const checkoutSelectors = [
      // Amazon
      'input[name="proceedToRetailCheckout"]',
      'input[value*="Proceed to checkout"]',
      'a[href*="checkout"]',
      // General selectors that might work across sites
      'button[id*="checkout"]',
      'a[id*="checkout"]',
      'button[class*="checkout"]',
      'a[class*="checkout"]',
      // Add more selectors as needed
    ];
  
    // Combine selectors and find matching elements
    const selector = checkoutSelectors.join(', ');
    const checkoutButtons = document.querySelectorAll(selector);
    
    // Add click listeners to all potential checkout buttons
    checkoutButtons.forEach(button => {
      button.addEventListener('click', function(event) {
        // Prevent default action temporarily
        event.preventDefault();
        event.stopPropagation();

        // Inject modal directly into the page
        injectModal();

        // Store the original click event's URL or fallback to the current page URL
        sessionStorage.setItem('originalCheckoutUrl', button.href || document.location.href);

        // Listen for user decision from the modal
        window.addEventListener('message', function modalMessageHandler(event) {
          if (event.data.action === 'continueCheckout') {
            // Allow navigation to the original checkout URL
            const originalUrl = sessionStorage.getItem('originalCheckoutUrl');
            if (originalUrl) {
              window.location.href = originalUrl;
            }
            // Remove the event listener after handling
            window.removeEventListener('message', modalMessageHandler);
          } else if (event.data.action === 'closeModal') {
            // User closed the modal without proceeding
            console.log('User chose not to proceed with checkout.');
            // Remove the event listener after handling
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
    iframe.src = chrome.runtime.getURL('src/modal/modal.html');
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
  window.addEventListener('message', function(event) {
    // Make sure the message is from our extension
    if (event.origin !== window.location.origin) {
      return;
    }
    
    const data = event.data;
    
    if (data.action === 'closeModal') {
      closeModal();
    } else if (data.action === 'continueCheckout') {
      closeModal();
      const originalUrl = sessionStorage.getItem('originalCheckoutUrl');
      if (originalUrl) {
        window.location.href = originalUrl;
      }
    }
  });
  
  // Run detector when page loads and also periodically to catch dynamically added buttons
  document.addEventListener('DOMContentLoaded', detectCheckoutButtons);
  // Check every 2 seconds for new buttons (for dynamic sites)
  setInterval(detectCheckoutButtons, 2000);