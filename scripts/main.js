// Custom cursor effect
const cursor = document.querySelector(".cursor");
const cursorFollower = document.querySelector(".cursor-follower");

document.addEventListener("mousemove", (e) => {
	cursor.style.left = e.clientX + "px";
	cursor.style.top = e.clientY + "px";

	setTimeout(() => {
		cursorFollower.style.left = e.clientX + "px";
		cursorFollower.style.top = e.clientY + "px";
	}, 100);
});

// Interactive elements effect
const interactiveElements = document.querySelectorAll(
	"a, button, .project-card, .skill-badge"
);

interactiveElements.forEach((el) => {
	el.addEventListener("mouseenter", () => {
		cursor.style.transform = "translate(-50%, -50%) scale(1.5)";
		cursor.style.background = "rgba(59, 130, 246, 0.8)";
		cursorFollower.style.transform = "translate(-50%, -50%) scale(0.5)";
		cursorFollower.style.borderColor = "rgba(59, 130, 246, 0.8)";
	});

	el.addEventListener("mouseleave", () => {
		cursor.style.transform = "translate(-50%, -50%) scale(1)";
		cursor.style.background = "rgba(59, 130, 246, 0.5)";
		cursorFollower.style.transform = "translate(-50%, -50%) scale(1)";
		cursorFollower.style.borderColor = "rgba(59, 130, 246, 0.3)";
	});
});

// Navbar visibility logic
const mainNav = document.getElementById("main-nav");
let lastScrollPosition = 0;
let isTopPage = true;

// Handle nav visibility based on scroll/hover
function handleNavVisibility() {
	const currentScroll = window.pageYOffset;

	// Check if we're on top page (home section)
	isTopPage = currentScroll < window.innerHeight;

	if (isTopPage) {
		mainNav.classList.remove("hidden");
		return;
	}

	// On other pages, show nav when mouse is near top
	const mouseNearTop = mouseY < 100;
	const scrollingUp = currentScroll < lastScrollPosition;

	if (mouseNearTop || scrollingUp) {
		mainNav.classList.remove("hidden");
	} else {
		mainNav.classList.add("hidden");
	}

	lastScrollPosition = currentScroll;
}

let mouseY = 0;
document.addEventListener("mousemove", (e) => {
	mouseY = e.clientY;
	throttledHandleNavVisibility();
});

document.addEventListener("scroll", throttledHandleNavVisibility);

window.addEventListener("load", () => {
	// Initial check
	handleNavVisibility();
	// Smoother transition for show/hide
	mainNav.style.transition =
		"transform 0.4s cubic-bezier(0.25, 0.8, 0.25, 1), opacity 0.4s ease";
});

// Smoother mouse tracking near top
function throttle(callback, delay) {
	let lastCall = 0;
	return function () {
		const now = new Date().getTime();
		if (now - lastCall < delay) return;
		lastCall = now;
		callback.apply(this, arguments);
	};
}

const throttledHandleNavVisibility = throttle(handleNavVisibility, 50);

// Simple fade-in animation on scroll
document.addEventListener("DOMContentLoaded", function () {
	const fadeElements = document.querySelectorAll(".fade-in");

	const fadeInOnScroll = function () {
		fadeElements.forEach((element) => {
			const elementTop = element.getBoundingClientRect().top;
			const windowHeight = window.innerHeight;

			if (elementTop < windowHeight - 100) {
				element.style.opacity = "1";
				element.style.transform = "translateY(0)";
			}
		});
	};

	// Set initial state
	fadeElements.forEach((element) => {
		element.style.opacity = "0";
		element.style.transform = "translateY(20px)";
		element.style.transition = "opacity 0.6s ease, transform 0.6s ease";
	});

	// Check on load
	fadeInOnScroll();

	// Check on scroll
	window.addEventListener("scroll", fadeInOnScroll);

	// Smooth scrolling for navigation
	document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
		anchor.addEventListener("click", function (e) {
			e.preventDefault();

			document.querySelector(this.getAttribute("href")).scrollIntoView({
				behavior: "smooth",
			});
		});
	});
});
