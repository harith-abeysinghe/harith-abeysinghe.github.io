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
