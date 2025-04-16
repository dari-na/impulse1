// src/modal/modal.js
document.addEventListener('DOMContentLoaded', function() {
    // Screen templates
    const screens = {
      impact: `
        <div class="header">
          <h2>Environmental Impact</h2>
        </div>
        <p>Here's how this purchase affects your wallet and the planet:</p>
        
        <div class="impact-data">
          <div class="impact-item water">
            <div class="icon water-icon"></div>
            <h3>Water Usage</h3>
            <div class="impact-value">2100 L</div>
            <p>That's about 14 days of drinking water</p>
          </div>
          
          <div class="impact-item carbon">
            <div class="icon carbon-icon"></div>
            <h3>Carbon Footprint</h3>
            <div class="impact-value">8 kg CO<sub>2</sub></div>
            <p>Equivalent to driving 20 miles</p>
          </div>
        </div>
        
        <div class="financial-impact">
          <div class="icon money-icon"></div>
          <h3>Financial Impact</h3>
          <div class="price">$49.99</div>
          <p>This month's impulse spending: $120.45</p>
        </div>
        
        <div class="navigation">
          <div class="progress-dots">
            <span class="dot"></span>
            <span class="dot active"></span>
            <span class="dot"></span>
            <span class="dot"></span>
          </div>
          <button id="impactContinueBtn" class="continue-btn">Continue</button>
        </div>
      `,
      
      alternatives: `
        <div class="header">
          <h2>Consider Alternatives</h2>
        </div>
        <p>Here are some other options that might work for you:</p>
        
        <div class="alternative-option">
          <div class="icon borrow-icon"></div>
          <div class="option-content">
            <h3>Borrow or Rent</h3>
            <p>Check if you can borrow this item from friends or rent it for a short time</p>
          </div>
        </div>
        
        <div class="alternative-option">
          <div class="icon secondhand-icon"></div>
          <div class="option-content">
            <h3>Buy Secondhand</h3>
            <p>We found 3 similar secondhand options nearby for 40% less</p>
            <button class="view-options-btn">View options</button>
          </div>
        </div>
        
        <div class="alternative-option">
          <div class="icon wait-icon"></div>
          <div class="option-content">
            <h3>Wait 24 Hours</h3>
            <p>Sleep on it and see if you still want to make this purchase tomorrow</p>
          </div>
        </div>
        
        <div class="navigation">
          <div class="progress-dots">
            <span class="dot"></span>
            <span class="dot"></span>
            <span class="dot active"></span>
            <span class="dot"></span>
          </div>
          <button id="alternativesContinueBtn" class="continue-btn">Continue</button>
        </div>
      `,
      
      decision: `
        <div class="header">
          <h2>What would you like to do?</h2>
        </div>
        <p>Make a decision about this purchase:</p>
        
        <div class="decision-options">
          <label class="decision-option">
            <input type="radio" name="decision" value="continue">
            <div class="option-content">
              <div class="icon continue-icon"></div>
              <div class="text">
                <h3>Continue with purchase</h3>
                <p>I've thought about it and I want to buy this</p>
              </div>
            </div>
          </label>
          
          <label class="decision-option">
            <input type="radio" name="decision" value="skip" checked>
            <div class="option-content">
              <div class="icon skip-icon"></div>
              <div class="text">
                <h3>Skip this purchase</h3>
                <p>I've decided not to buy this item</p>
              </div>
            </div>
          </label>
          
          <label class="decision-option">
            <input type="radio" name="decision" value="delay">
            <div class="option-content">
              <div class="icon delay-icon"></div>
              <div class="text">
                <h3>Delay for 24 hours</h3>
                <p>Remind me about this tomorrow</p>
              </div>
            </div>
          </label>
        </div>
        
        <div class="navigation">
          <div class="progress-dots">
            <span class="dot"></span>
            <span class="dot"></span>
            <span class="dot"></span>
            <span class="dot active"></span>
          </div>
          <button id="decisionContinueBtn" class="continue-btn">Continue</button>
        </div>
      `,
      
      result: `
        <div class="result-container">
          <button class="close-btn">×</button>
          <div class="result-content">
            <h2>Purchase Skipped</h2>
            <p>Great choice! You've saved money and reduced your environmental impact.</p>
            
            <div class="streak-info">
              <h3>Your Mindful Shopping Streak</h3>
              <div class="streak-bar">
                <div class="streak-progress" style="width: 30%;"></div>
              </div>
              <div class="streak-stats">
                <p>Current streak: <strong>3 skips</strong></p>
                <p>Best streak: <strong>7 skips</strong></p>
              </div>
              <div class="achievement">
                <div class="achievement-icon"></div>
                <p>Achievement Unlocked!</p>
              </div>
            </div>
            
            <button id="startOverBtn" class="start-over-btn">Start Over</button>
          </div>
        </div>
      `
    };
  
    // Initialize current screen index
    let currentScreenIndex = 0;
    const screenOrder = ['reflectionScreen', 'impact', 'alternatives', 'decision', 'result'];
    
    // Set up event listeners for the first screen
    document.getElementById('reflectionContinueBtn').addEventListener('click', function() {
      showNextScreen();
    });
    
    // Function to show the next screen
    function showNextScreen() {
      const container = document.getElementById('modalContainer');
      const currentScreen = document.querySelector('.screen.active');
      
      // Move to next screen index
      currentScreenIndex++;
      
      if (currentScreenIndex >= screenOrder.length) {
        // We're at the end, close the modal
        window.close();
        return;
      }
      
      // Create the new screen
      const nextScreenName = screenOrder[currentScreenIndex];
      const nextScreenHTML = screens[nextScreenName];
      
      // Create and append new screen
      const nextScreen = document.createElement('div');
      nextScreen.className = 'screen';
      nextScreen.innerHTML = nextScreenHTML;
      container.appendChild(nextScreen);
      
      // Animate transition
      currentScreen.classList.add('exit');
      setTimeout(() => {
        currentScreen.classList.remove('active');
        nextScreen.classList.add('active');
        
        // Add event listeners for new screen
        setScreenEventListeners(nextScreenName);
        
        // Remove old screen after animation
        setTimeout(() => {
          container.removeChild(currentScreen);
        }, 500);
      }, 300);
    }
    
    // Function to add event listeners based on current screen
    function setScreenEventListeners(screenName) {
        if (screenName === 'impact') {
          document.getElementById('impactContinueBtn').addEventListener('click', showNextScreen);
        } else if (screenName === 'alternatives') {
          document.getElementById('alternativesContinueBtn').addEventListener('click', showNextScreen);
          
          // Add view options functionality if needed
          const viewOptionsBtn = document.querySelector('.view-options-btn');
          if (viewOptionsBtn) {
            viewOptionsBtn.addEventListener('click', function() {
              // Open a new tab with secondhand options
              window.open('https://www.ebay.com/sch/i.html?_nkw=your+item+here', '_blank');
            });
          }
        } else if (screenName === 'decision') {
          document.getElementById('decisionContinueBtn').addEventListener('click', function() {
            // Get the selected decision
            const selectedDecision = document.querySelector('input[name="decision"]:checked').value;
            
            // Store the decision
            chrome.storage.local.get(['decisions'], function(result) {
              const decisions = result.decisions || [];
              decisions.push({
                decision: selectedDecision,
                timestamp: Date.now(),
                // You can add more data like product, price, etc. here
              });
              
              chrome.storage.local.set({ decisions: decisions }, function() {
                // Update streak if decision is to skip
                if (selectedDecision === 'skip') {
                  updateStreak();
                } else if (selectedDecision === 'continue') {
                  // Send message to parent page to continue with checkout
                  window.parent.postMessage({ action: "continueCheckout" }, '*');
                } else if (selectedDecision === 'delay') {
                  // Set a reminder
                  chrome.alarms.create('purchaseReminder', {
                    delayInMinutes: 24 * 60 // 24 hours
                  });
                  
                  // Close the modal
                  window.parent.postMessage({ action: "closeModal" }, '*');
                }
                
                // Show result screen
                showNextScreen();
              });
            });
          });
        } else if (screenName === 'result') {
          // Close button functionality
          document.querySelector('.close-btn').addEventListener('click', function() {
            window.parent.postMessage({ action: "closeModal" }, '*');
          });
          
          // Start over button
          document.getElementById('startOverBtn').addEventListener('click', function() {
            // Reset to first screen
            window.location.reload();
          });
        }
      }
    
    // Function to update the user's skip streak
    function updateStreak() {
      chrome.storage.local.get(['streak', 'bestStreak'], function(result) {
        let currentStreak = (result.streak || 0) + 1;
        let bestStreak = result.bestStreak || 0;
        
        if (currentStreak > bestStreak) {
          bestStreak = currentStreak;
        }
        
        chrome.storage.local.set({
          streak: currentStreak,
          bestStreak: bestStreak
        }, function() {
          // Update UI if we're on the result screen
          const streakCurrentEl = document.querySelector('.streak-stats strong:first-child');
          const streakBestEl = document.querySelector('.streak-stats strong:last-child');
          
          if (streakCurrentEl && streakBestEl) {
            streakCurrentEl.textContent = `${currentStreak} skips`;
            streakBestEl.textContent = `${bestStreak} skips`;
          }
        });
      });
    }
    
    const addGlobalCloseButton = function() {
        const closeButton = document.createElement('button');
        closeButton.innerHTML = '×';
        closeButton.className = 'global-close-btn';
        closeButton.style.position = 'absolute';
        closeButton.style.top = '10px';
        closeButton.style.right = '10px';
        closeButton.style.background = 'none';
        closeButton.style.border = 'none';
        closeButton.style.fontSize = '24px';
        closeButton.style.color = '#999';
        closeButton.style.cursor = 'pointer';
        closeButton.style.zIndex = '1000';
        
        closeButton.addEventListener('click', function() {
          window.parent.postMessage({ action: "closeModal" }, '*');
        });
        
        document.body.appendChild(closeButton);
      };

    // Send a message to proceed with checkout
    window.parent.postMessage({ action: 'continueCheckout' }, '*');

    // Send a message to close the modal
    window.parent.postMessage({ action: 'closeModal' }, '*');
  });