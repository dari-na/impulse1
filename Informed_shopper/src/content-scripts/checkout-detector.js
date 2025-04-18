// src/content-scripts/checkout-detector.js

function detectCheckoutButtons() {
	console.log("detectCheckoutButtons is running");
	const checkoutSelectors = [
		'input[name="proceedToRetailCheckout"]',
		'input[value*="Proceed to checkout"]',
		'a[href*="checkout"]',
		'button[id*="checkout"]',
		'a[id*="checkout"]',
		'button[class*="checkout"]',
		'a[class*="checkout"]',
		"button.j-cart-check",
	];

	const selector = checkoutSelectors.join(", ");
	const checkoutButtons = document.querySelectorAll(selector);

	checkoutButtons.forEach((button) => {
		button.addEventListener("click", function (event) {
			event.preventDefault();
			event.stopPropagation();
			injectModal();
			sessionStorage.setItem("originalCheckoutUrl", document.location.href);
		});
	});
}

function injectModal() {
	if (document.getElementById("purchase-impact-modal-overlay")) {
		return;
	}

	const iframe = document.createElement("iframe");
	iframe.src = `chrome-extension://${chrome.runtime.id}/src/modal/modal.html`;
	iframe.id = "purchase-impact-modal-content";
	iframe.style.width = "480px";
	iframe.style.height = "auto";
	iframe.style.maxHeight = "95vh";
	iframe.style.border = "none";
	iframe.style.borderRadius = "20px";
	iframe.style.boxShadow = "0 16px 40px rgba(0,0,0,0.2)";
	iframe.style.overflow = "hidden";
	iframe.style.transition = "height 0.2s ease";
	iframe.setAttribute("scrolling", "no");

	const overlay = document.createElement("div");
	overlay.id = "purchase-impact-modal-overlay";
	overlay.style.position = "fixed";
	overlay.style.top = "0";
	overlay.style.left = "0";
	overlay.style.width = "100%";
	overlay.style.height = "100%";
	overlay.style.backgroundColor = "rgba(0,0,0,0.5)";
	overlay.style.display = "flex";
	overlay.style.justifyContent = "center";
	overlay.style.alignItems = "center";
	overlay.style.zIndex = "999999";

	overlay.appendChild(iframe);
	document.body.appendChild(overlay);

	overlay.addEventListener("click", function (event) {
		if (event.target === overlay) {
			closeModal();
		}
	});

	document.body.style.overflow = "hidden";
}

function closeModal() {
	console.log("⛔ closeModal called");
	const overlay = document.getElementById("purchase-impact-modal-overlay");
	if (overlay) {
		document.body.removeChild(overlay);
		document.body.style.overflow = "";
	}
}

// 🔁 Listen for messages once, globally
window.addEventListener("message", function (event) {
	console.log("📨 Message received:", event.data);

	if (event.data.action === "resizeModal") {
		const iframe = document.getElementById("purchase-impact-modal-content");
		if (iframe) {
			iframe.style.height = event.data.height + "px";
		}
	} else if (event.data.action === "closeModal") {
		console.log("User chose to close the modal.");
		closeModal();
	} else if (event.data.action === "continueCheckout") {
		const originalUrl = sessionStorage.getItem("originalCheckoutUrl");
		if (originalUrl) {
			window.location.href = originalUrl;
		}
	}
});

document.addEventListener("DOMContentLoaded", detectCheckoutButtons);
setInterval(detectCheckoutButtons, 2000);

setTimeout(() => {
	console.log("🧪 Manual test: Injecting modal...");
	injectModal();
}, 2000);
