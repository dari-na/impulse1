document.addEventListener("DOMContentLoaded", () => {
  const viewDashboard = document.getElementById("view-dashboard");
  const viewReflection = document.getElementById("view-reflection");
  const modalContainer = document.getElementById("modalContainer");

  document.addEventListener("DOMContentLoaded", () => {
    const urlParams = new URLSearchParams(window.location.search);
    const autoStart = urlParams.get("autoStart");

    if (autoStart === "true") {
      startReflectionFlow(); // ← this kicks off the slides automatically
    }
  });

  function startReflectionFlow() {
    const screens = {
      dashboard: `
          <div class="screen active">
            <div class="header">
              <div class="logo">🛍️ Mindful Shopping</div>
              <div class="nav-buttons">
                <button class="settings-btn">⚙️ Settings</button>
                <button class="dashboard-btn">📊 Dashboard</button>
              </div>
            </div>
      
            <h2>Your Impact Dashboard</h2>
            <p class="subtitle">Track your progress toward more sustainable consumption habits</p>
      
            <div class="stats-grid">
              <div class="stat-card purple">
                <h3>Money Saved</h3>
                <p class="value">$349.95</p>
                <p class="description">From skipped impulse purchases</p>
              </div>
              <div class="stat-card green">
                <h3>CO₂ Reduced</h3>
                <p class="value">45 kg</p>
                <p class="description">Equivalent to planting 2 trees</p>
              </div>
              <div class="stat-card blue">
                <h3>Water Saved</h3>
                <p class="value">12000 L</p>
                <p class="description">Equivalent to 80 showers</p>
              </div>
              <div class="stat-card yellow">
                <h3>Purchases Skipped</h3>
                <p class="value">7</p>
                <p class="description">In the last 30 days</p>
              </div>
            </div>
      
            <div class="insights">
              <p>Shopping Insights</p>
              <div class="progress-bar">
                <div class="progress-fill" style="width: 70%;"></div>
              </div>
              <p class="progress-label">70% of considered purchases were skipped <span class="success">Great progress!</span></p>
            </div>
      
            <div class="tip-box">
              <p class="tip-title">Sustainable Shopping Tip</p>
              <p class="tip-text">
                Try the “one in, one out” rule: For every new item you bring home, donate or recycle something you no longer use.
              </p>
              <a href="#" class="more-tips">Get more tips</a>
            </div>
      
            <div class="cta">
              <button id="dashboardContinueBtn" class="continue-btn">Start Reflection</button>
            </div>
          </div>
        `,
      impact: `
        <div class="screen active">
          <h2>Environmental Impact</h2>
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
              <div class="impact-value">8 kg CO₂</div>
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
        </div>
      `,
      alternatives: `
        <div class="screen active">
          <h2>Consider Alternatives</h2>
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
        </div>
      `,
      decision: `
        <div class="screen active">
          <h2>What would you like to do?</h2>
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
        </div>
      `,
      result: `
        <div class="screen active">
          <div class="result-content">
            <div class="icon skip-icon" style="margin: auto; width: 48px; height: 48px;"></div>
            <h2>Purchase Skipped</h2>
            <p>Great choice! You've saved money and reduced your environmental impact.</p>
            <div class="streak-info">
              <h3>Your Mindful Shopping Streak</h3>
              <div class="streak-bar">
                <div class="streak-progress" style="width: 40%;"></div>
              </div>
              <div class="streak-stats">
                <p>Current streak: <strong>3 skips</strong></p>
                <p>Best streak: <strong>7 skips</strong></p>
              </div>
              <p class="achievement">🏆 <strong>Achievement Unlocked!</strong></p>
            </div>
            <button id="startOverBtn" class="continue-btn">Great!</button>
          </div>
        </div>
      `,
    };

    const screenOrder = [
      "dashboard",
      "impact",
      "alternatives",
      "decision",
      "result",
    ];
    let currentScreenIndex = 0;
    const container = document.getElementById("modalContainer");

    // Start with first screen
    container.innerHTML = screens[screenOrder[currentScreenIndex]];
    setScreenEventListeners(screenOrder[currentScreenIndex]);

    function showNextScreen() {
      const currentScreen = container.querySelector(".screen.active");
      currentScreenIndex++;

      if (currentScreenIndex >= screenOrder.length) {
        // Done — go back to dashboard
        document.getElementById("view-reflection").classList.remove("active");
        document.getElementById("view-dashboard").classList.add("active");
        return;
      }

      const nextScreenName = screenOrder[currentScreenIndex];
      const nextScreenHTML = screens[nextScreenName];

      const nextScreen = document.createElement("div");
      nextScreen.className = "screen";
      nextScreen.innerHTML = nextScreenHTML;

      container.appendChild(nextScreen);
      currentScreen.classList.add("exit");

      setTimeout(() => {
        currentScreen.classList.remove("active");
        nextScreen.classList.add("active");
        setScreenEventListeners(nextScreenName);
        setTimeout(() => {
          container.removeChild(currentScreen);
        }, 300);
      }, 100);
    }

    function setScreenEventListeners(screenName) {
      if (screenName === "dashboard") {
        document
          .getElementById("dashboardContinueBtn")
          ?.addEventListener("click", showNextScreen);
      } else if (screenName === "impact") {
        document
          .getElementById("impactContinueBtn")
          ?.addEventListener("click", showNextScreen);
      } else if (screenName === "alternatives") {
        document
          .getElementById("alternativesContinueBtn")
          ?.addEventListener("click", showNextScreen);
      } else if (screenName === "decision") {
        document
          .getElementById("decisionContinueBtn")
          ?.addEventListener("click", () => {
            const decision =
              document.querySelector('input[name="decision"]:checked')?.value ||
              "skip";
            if (decision === "delay") {
              chrome.alarms.create("purchaseReminder", {
                delayInMinutes: 24 * 60,
              });
            }
            showNextScreen();
          });
      } else if (screenName === "result") {
        document
          .getElementById("startOverBtn")
          ?.addEventListener("click", () => {
            // Reset to the beginning
            currentScreenIndex = 0;
            const container = document.getElementById("modalContainer");
            container.innerHTML = screens[screenOrder[0]];
            setScreenEventListeners(screenOrder[0]);
          });
      }
    }
  }
});
