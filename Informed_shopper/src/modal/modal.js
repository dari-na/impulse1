document.addEventListener('DOMContentLoaded', function () {

	const container = document.getElementById('modalContainer');

	const slideWrapper = document.createElement('div');
	slideWrapper.className = 'slide-wrapper';
	container.appendChild(slideWrapper);

	function postHeightToParent() {
		const height = slideWrapper.scrollHeight + 40;
		console.log("Slide height being sent:", height);
		window.parent.postMessage({action: 'resizeModal', height}, '*');
	}

	let resizeTimeout;
	window.addEventListener('resize', () => {
		clearTimeout(resizeTimeout);
		resizeTimeout = setTimeout(postHeightToParent, 150);
	});

	const slides = [
		`
		<div class="slide">
			<div class="icon-heading">
				<div class="icon-circle">❓</div>
				<h2>Let's reflect for a moment</h2>
			</div>
			<p>Taking a moment to think about your purchase<br>
				 can help you make choices you'll feel good<br>
				 about later.</p>

			<div class="card-section soft-purple">
				<div class="icon-heading space-between">
					<div class="icon-circle small">❗</div>
					<strong>Marketing Tactics Detected</strong>
				</div>
				<p class="subtle">We noticed some common marketing strategies that might be influencing your decision:</p>

				<div class="tag-box">
					<strong>🕒 Urgency</strong><br><span>Limited time offer ending soon</span>
				</div>
				<div class="tag-box">
					<strong>👥 Social Proof</strong><br><span>10 people bought in last hour</span>
				</div>
				<div class="tag-box faded">
					<strong>🏷️ Price Anchoring</strong><br><span>Original price shown as much higher</span>
				</div>
			</div>

			<div class="card-section">
				<p><strong>Why do you want to buy this item today?</strong></p>
				<p><strong>Were you previously planning on buying this?</strong></p>
			</div>

			<div class="progress-dots"></div>
			<button class="continue-btn">Continue</button>
		</div>
		`,
		`
		<div class="slide">
			<h2>Environmental Impact</h2>
			<p>Here's how this purchase affects your wallet and the planet:</p>

			<div class="card-section" style="background:#f0f5ff;">
				<strong>💧 Water Usage</strong><br>
				<span style="font-size: 1.5rem; font-weight: 600; color: #004fc4;">2100 L</span><br>
				That's about 14 days of drinking water.
			</div>

			<div class="card-section" style="background:#eefaf3;">
				<strong>🌿 Carbon Footprint</strong><br>
				<span style="font-size: 1.5rem; font-weight: 600; color: #067a46;">8 kg CO₂</span><br>
				Equivalent to driving 20 miles.
			</div>

			<div class="card-section" style="background:#fff7e6;">
				<strong>💰 Financial Impact</strong><br>
				<span style="font-size: 1.5rem; font-weight: 600; color: #b76e00;">$49.99</span><br>
				This month's impulse spending: $120.45
			</div>

			<div class="progress-dots"></div>
			<button class="continue-btn">Continue</button>
		</div>
		`,
		`
		<div class="slide">
			<div class="icon-heading">
				<div class="icon-circle">💡</div>
				<h2>Consider Alternatives</h2>
			</div>
			<p>Here are some other options you might consider:</p>

			<div class="card-section">
				<strong>♻️ Borrow or Rent</strong><br>
				Ask a friend or rent short-term instead of buying.
			</div>

			<div class="card-section">
				<strong>📅 Buy Secondhand</strong><br>
				Found 3 similar items nearby for 40% less.
			</div>

			<div class="card-section">
				<strong>⏰ Wait 24 Hours</strong><br>
				Sleep on it and revisit your decision tomorrow.
			</div>

			<div class="progress-dots"></div>
			<button class="continue-btn">Continue</button>
		</div>
		`,
		`
		<div class="slide">
			<div class="icon-heading">
				<div class="icon-circle">✅</div>
				<h2>What would you like to do?</h2>
			</div>
			<p>Make a mindful choice about this purchase:</p>
	
			<button class="card-section final-btn" data-choice="purchase">
				✅ <strong>Continue with purchase</strong><br>
				I’ve thought about it and still want to buy.
			</button>

			<button class="card-section final-btn" data-choice="skip">
				❌ <strong>Skip this purchase</strong><br>
				I’ve decided not to buy it right now.
			</button>

			<button class="card-section final-btn" data-choice="delay">
				⏳ <strong>Delay for 24 hours</strong><br>
				I want to wait and revisit this later.
			</button>

			<div class="progress-dots"></div>
		</div>
		`
	];

	function renderFinalSlide(choice) {
		let title = '';
		let message = '';
		let icon = '';
		let bgColor = '';
		let actionText = '';

		if (choice === 'skip') {
			icon = '❌';
			title = 'Purchase Skipped';
			message = 'Great choice! You\'ve saved money and reduced your environmental impact.';
			actionText = 'Nice!';
			bgColor = '#ffe9f1';
		} else if (choice === 'delay') {
			icon = '⏳';
			title = 'Purchase Delayed';
			message = 'Awesome. Giving yourself space to think is a great move.';
			actionText = 'Got it!';
			bgColor = '#fff8e1';
		} else {
			icon = '✅';
			title = 'Purchase Confirmed';
			message = 'Sounds good. Hope it brings you joy!';
			actionText = 'Thanks!';
			bgColor = '#e6f4ea';
		}

		const finalSlide = `
		<div class="slide" style="background: ${bgColor}; border-radius: 16px; padding: 2rem; align-items: center; text-align: center;">
			<div style="font-size: 3rem;">${icon}</div>
			<h2>${title}</h2>
			<p style="max-width: 300px; margin: 0 auto;">${message}</p>
			<button class="continue-btn finish-btn" style="margin-top: 2rem;">${actionText}</button>
		</div>
		`;

		const tempDiv = document.createElement('div');
		tempDiv.innerHTML = finalSlide.trim();
		const slideElement = tempDiv.firstElementChild;

		slideWrapper.innerHTML = '';
		slideWrapper.appendChild(slideElement);

		requestAnimationFrame(() => {
			setTimeout(postHeightToParent, 50);
		});

		slideElement.querySelector('.finish-btn').addEventListener('click', () => {
			if (choice === 'purchase') {
				window.parent.postMessage({ action: 'continueCheckout' }, '*');
			} else {
				window.parent.postMessage({ action: 'closeModal' }, '*');
			}
		});
	}

	let current = 0;

	function createProgressDots(currentIndex, total) {
		let dotsHTML = '';
		for (let i = 0; i < total; i++) {
			dotsHTML += `<div class="dot${i === currentIndex ? ' active' : ''}"></div>`;
		}
		return `<div class="progress-dots">${dotsHTML}</div>`;
	}

	function renderSlide(index) {
		const tempDiv = document.createElement('div');
		tempDiv.innerHTML = slides[index].trim();
		const slideElement = tempDiv.firstElementChild;

		const dotsContainer = slideElement.querySelector('.progress-dots');
		if (dotsContainer) {
			dotsContainer.outerHTML = createProgressDots(index, slides.length);
		}

		slideWrapper.innerHTML = '';
		slideWrapper.appendChild(slideElement);

		slideElement.classList.remove('slide');
		void slideElement.offsetWidth;
		slideElement.classList.add('slide');

		requestAnimationFrame(() => {
			setTimeout(postHeightToParent, 100);
		});
	}

	container.addEventListener('click', (e) => {
		if (e.target.classList.contains('continue-btn')) {
			if (current < slides.length - 1) {
				current++;
				renderSlide(current);
			} else {
				window.parent.postMessage({action: 'closeModal'}, '*');
			}
		}
		if (e.target.classList.contains('final-btn')) {
			const choice = e.target.dataset.choice;
			renderFinalSlide(choice);
		}
	});

	function closeModal() {
		console.log("⛔ closeModal called"); // Add this line
		const overlay = document.getElementById("purchase-impact-modal-overlay");
		if (overlay) {
			document.body.removeChild(overlay);
			document.body.style.overflow = "";
		}
	}

	renderSlide(current);
});
