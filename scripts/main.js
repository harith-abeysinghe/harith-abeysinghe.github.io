(() => {
	"use strict";

	const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
	const $ = (sel, root = document) => root.querySelector(sel);
	const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

	/* ---------- nav: scrolled state, active section, mobile menu ---------- */
	const nav = $("#nav");
	const navLinks = $("#navLinks");
	const navToggle = $("#navToggle");

	const onScroll = () => nav.classList.toggle("scrolled", window.scrollY > 10);
	window.addEventListener("scroll", onScroll, { passive: true });
	onScroll();

	navToggle.addEventListener("click", () => {
		const open = navLinks.classList.toggle("open");
		navToggle.setAttribute("aria-expanded", String(open));
	});
	$$("a", navLinks).forEach((a) =>
		a.addEventListener("click", () => {
			navLinks.classList.remove("open");
			navToggle.setAttribute("aria-expanded", "false");
		})
	);

	const sectionLinks = new Map($$("a", navLinks).map((a) => [a.getAttribute("href").slice(1), a]));
	const spy = new IntersectionObserver(
		(entries) => {
			entries.forEach((e) => {
				const link = sectionLinks.get(e.target.id);
				if (link && e.isIntersecting) {
					sectionLinks.forEach((l) => l.classList.remove("active"));
					link.classList.add("active");
				}
			});
		},
		{ rootMargin: "-45% 0px -50% 0px" }
	);
	sectionLinks.forEach((_, id) => {
		const el = document.getElementById(id);
		if (el) spy.observe(el);
	});

	/* ---------- reveal on scroll ---------- */
	const revealer = new IntersectionObserver(
		(entries) => {
			entries.forEach((e) => {
				if (e.isIntersecting) {
					e.target.classList.add("in");
					revealer.unobserve(e.target);
				}
			});
		},
		{ threshold: 0.12 }
	);
	$$(".reveal").forEach((el, i) => {
		el.style.transitionDelay = `${(i % 4) * 70}ms`;
		revealer.observe(el);
	});

	/* ---------- hero: rotating role text ---------- */
	const typedEl = $("#typed");
	const roles = [
		"event-driven systems",
		"Kafka & Flink pipelines",
		"Spring Boot microservices",
		"change data capture",
		"cloud-native platforms",
	];
	if (!reduceMotion && typedEl) {
		let r = 0, i = roles[0].length, deleting = true;
		const tick = () => {
			const word = roles[r];
			if (deleting) {
				i--;
				if (i === 0) { deleting = false; r = (r + 1) % roles.length; }
			} else {
				i++;
				if (i === roles[r].length) { deleting = true; typedEl.textContent = roles[r]; return setTimeout(tick, 2200); }
			}
			typedEl.textContent = (deleting ? word : roles[r]).slice(0, i);
			setTimeout(tick, deleting ? 35 : 70);
		};
		setTimeout(tick, 2600);
	}

	/* ---------- hero: career replayed as a Kafka topic ---------- */
	const events = [
		{ type: "EnrolledIn", degree: "BSc Computer Engineering", uni: "University of Peradeniya" },
		{ type: "AwardWon", event: "IEEE Innovation Nation", place: 3, project: "ARCombat" },
		{ type: "InternshipStarted", company: "GTN Technologies", stack: "Spring Boot · GraphQL" },
		{ type: "ResearchCompleted", topic: "Latency-aware K8s scaling" },
		{ type: "Graduated", gpa: 3.95 },
		{ type: "RoleStarted", company: "ISA", title: "Software Engineer" },
		{ type: "ProjectShipped", name: "Debezium CDC pipeline" },
		{ type: "ProjectShipped", name: "Flink Academy" },
		{ type: "NowLearning", topic: "Kafka Streams internals" },
	];
	const esc = (s) => String(s).replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" })[c]);
	const renderEvent = (ev, offset) => {
		const body = Object.entries(ev)
			.map(([k, v]) => `<span class="k">"${esc(k)}"</span>:` + (typeof v === "number" ? `<span class="n">${v}</span>` : `<span class="s">"${esc(v)}"</span>`))
			.join(", ");
		return `<span class="term-line"><span class="meta">p${offset % 3}@${offset} </span>{${body}}</span>`;
	};
	const termLines = $("#termLines");
	if (termLines) {
		if (reduceMotion) {
			termLines.innerHTML = events.map(renderEvent).join("");
		} else {
			let k = 0;
			const push = () => {
				if (k < events.length) {
					termLines.insertAdjacentHTML("beforeend", renderEvent(events[k], k));
					termLines.parentElement.scrollTop = termLines.parentElement.scrollHeight;
					k++;
					setTimeout(push, 650 + Math.random() * 500);
				} else {
					termLines.insertAdjacentHTML("beforeend", `<span class="term-line"><span class="meta">… caught up · lag 0 · waiting for the next event</span></span>`);
				}
			};
			setTimeout(push, 900);
		}
	}

	/* ---------- hero: event-stream canvas (producers → partitions → consumers) ---------- */
	const canvas = $("#streamCanvas");
	if (canvas && canvas.getContext) {
		const ctx = canvas.getContext("2d");
		const colors = ["#22d3ee", "#34d399", "#fbbf24", "#a78bfa"];
		let w = 0, h = 0, dpr = 1, lanes = [], particles = [], raf = 0, visible = true;

		const resize = () => {
			dpr = Math.min(window.devicePixelRatio || 1, 2);
			w = canvas.clientWidth; h = canvas.clientHeight;
			canvas.width = w * dpr; canvas.height = h * dpr;
			ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
			const count = Math.max(6, Math.floor(h / 70));
			lanes = Array.from({ length: count }, (_, i) => ({ y: ((i + 0.5) * h) / count, speed: 0.6 + Math.random() * 1.2 }));
			particles = [];
			for (let i = 0; i < count * 4; i++) particles.push(spawn(Math.random() * w));
			draw(0);
		};
		const spawn = (x = -20) => {
			const lane = lanes[Math.floor(Math.random() * lanes.length)];
			return { x, lane, len: 18 + Math.random() * 46, color: colors[Math.floor(Math.random() * colors.length)], v: lane.speed * (0.7 + Math.random() * 0.8) };
		};
		const draw = (t) => {
			ctx.clearRect(0, 0, w, h);
			// partition lanes with offset ticks
			lanes.forEach((lane, i) => {
				ctx.strokeStyle = "rgba(38,56,86,0.55)";
				ctx.lineWidth = 1;
				ctx.beginPath(); ctx.moveTo(0, lane.y); ctx.lineTo(w, lane.y); ctx.stroke();
				ctx.fillStyle = "rgba(38,56,86,0.7)";
				const shift = reduceMotion ? 0 : (t * 0.02 * lane.speed) % 60;
				for (let x = -shift; x < w; x += 60) ctx.fillRect(x, lane.y - 3, 1, 6);
				ctx.fillStyle = "rgba(91,107,133,0.9)";
				ctx.font = "11px JetBrains Mono, monospace";
				ctx.fillText(`partition-${i}`, w - 96, lane.y - 8);
			});
			// events
			particles.forEach((p) => {
				const grad = ctx.createLinearGradient(p.x - p.len, 0, p.x, 0);
				grad.addColorStop(0, "transparent");
				grad.addColorStop(1, p.color);
				ctx.strokeStyle = grad;
				ctx.lineWidth = 2;
				ctx.beginPath(); ctx.moveTo(p.x - p.len, p.lane.y); ctx.lineTo(p.x, p.lane.y); ctx.stroke();
				ctx.fillStyle = p.color;
				ctx.shadowColor = p.color; ctx.shadowBlur = 10;
				ctx.beginPath(); ctx.arc(p.x, p.lane.y, 2.6, 0, Math.PI * 2); ctx.fill();
				ctx.shadowBlur = 0;
			});
		};
		const loop = (t) => {
			if (!visible) { raf = 0; return; }
			particles.forEach((p, i) => {
				p.x += p.v;
				if (p.x - p.len > w) particles[i] = spawn();
			});
			draw(t);
			raf = requestAnimationFrame(loop);
		};
		window.addEventListener("resize", resize);
		resize();
		if (!reduceMotion) {
			new IntersectionObserver(([e]) => {
				visible = e.isIntersecting;
				if (visible && !raf) raf = requestAnimationFrame(loop);
			}).observe(canvas);
			document.addEventListener("visibilitychange", () => {
				visible = !document.hidden;
				if (visible && !raf) raf = requestAnimationFrame(loop);
			});
		}
	}

	/* ---------- footer year ---------- */
	const year = $("#year");
	if (year) year.textContent = new Date().getFullYear();
})();
