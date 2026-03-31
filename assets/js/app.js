// ============================================
// FREIGHTFORCE.AI - MAIN JS (CLEAN)
// ============================================

$(document).ready(function () {

	// ========== LOADER ==========
	setTimeout(function () {
		$('#loader').addClass('fade-out');
		setTimeout(function () {
			$('#loader').css('display', 'none');
			$('#main-content').fadeIn(500);
		}, 500);
	}, 1500);

	// ========== AOS INIT ==========
	AOS.init({
		duration: 500,
		once: true,
		mirror: false,
		offset: 80,
		easing: 'ease-out-cubic'
	});

	// ========== AI TABS ==========
	$('.tab-premium').on('click', function () {
		const tabId = $(this).data('tab');
		$('.tab-premium').removeClass('active');
		$(this).addClass('active');
		$('.tab-pane-premium').removeClass('active');
		$(`#tab-${tabId}-premium`).addClass('active');

		// Reset counters
		setTimeout(() => {
			$('.count-number').removeClass('counted');
			animateCounters();
		}, 100);
	});

	// ========== ANIMATED COUNTERS ==========
	function animateCounters() {
		$('.count-number').each(function () {
			const $this = $(this);
			const countTo = parseInt($this.data('count'));
			if (!isNaN(countTo) && !$this.hasClass('counted')) {
				$this.addClass('counted');
				$({ countNum: 0 }).animate({
					countNum: countTo
				}, {
					duration: 2000,
					easing: 'swing',
					step: function () { $this.text(Math.floor(this.countNum)); },
					complete: function () { $this.text(countTo); }
				});
			}
		});
	}
	setTimeout(() => { animateCounters(); }, 500);

	// ========== CUSTOM CURSOR (Desktop Only) ==========
	if (window.innerWidth > 768) {
		const cursorDot = $('.cursor-dot');
		const cursorOutline = $('.cursor-outline');
		$(document).on('mousemove', function (e) {
			cursorDot.css({ top: e.clientY - 4, left: e.clientX - 4 });
			cursorOutline.css({ top: e.clientY - 20, left: e.clientX - 20 });
		});
		$('.btn, .problem-card, .employee-card, .plan-card, .tab-premium').on('mouseenter', function () {
			cursorOutline.css({ transform: 'scale(1.5)', borderColor: '#6366f1', backgroundColor: 'rgba(99, 102, 241, 0.1)' });
		}).on('mouseleave', function () {
			cursorOutline.css({ transform: 'scale(1)', borderColor: 'rgba(99, 102, 241, 0.5)', backgroundColor: 'transparent' });
		});
		$(document).on('mouseleave', function () { cursorDot.css('opacity', 0); cursorOutline.css('opacity', 0); })
			.on('mouseenter', function () { cursorDot.css('opacity', 1); cursorOutline.css('opacity', 1); });
	} else {
		$('.cursor-dot, .cursor-outline').hide();
	}

	// ========== PRICING TOGGLE ==========
	const toggle = $('#pricingToggle');
	if (toggle.length) {
		toggle.on('change', function () {
			if ($(this).is(':checked')) {
				$('.monthly-price').hide(); $('.yearly-price').show();
				$('.toggle-label.monthly').css('color', '#a3a3a3'); $('.toggle-label.yearly').css('color', '#6366f1');
			} else {
				$('.monthly-price').show(); $('.yearly-price').hide();
				$('.toggle-label.monthly').css('color', '#6366f1'); $('.toggle-label.yearly').css('color', '#a3a3a3');
			}
		});
	}

	// ========== MOBILE MENU ==========
	const menuToggle = $('#menuToggle');
	const navbarCollapse = $('#navbarNav');
	const navbar = $('.navbar');
	if (menuToggle.length) {
		menuToggle.on('click', function (e) {
			e.stopPropagation();
			$(this).toggleClass('active');
			navbarCollapse.toggleClass('show');
			navbar.toggleClass('menu-open');
			$('body').css('overflow', navbarCollapse.hasClass('show') ? 'hidden' : '');
		});
		$('.nav-link').on('click', function () {
			menuToggle.removeClass('active'); navbarCollapse.removeClass('show'); navbar.removeClass('menu-open'); $('body').css('overflow', '');
		});
		$(document).on('click', function (e) {
			if (navbarCollapse.hasClass('show') && !$(e.target).closest('.navbar').length) {
				menuToggle.removeClass('active'); navbarCollapse.removeClass('show'); navbar.removeClass('menu-open'); $('body').css('overflow', '');
			}
		});
	}

	// ========== ACTIVE MENU ON SCROLL ==========
	const sections = $('section');
	const navLinks = $('.nav-link');
	$(window).on('scroll', function () {
		let current = '';
		const scrollPos = $(window).scrollTop() + 150;
		sections.each(function () {
			const sectionTop = $(this).offset().top, sectionBottom = sectionTop + $(this).outerHeight();
			if (scrollPos >= sectionTop && scrollPos < sectionBottom) current = $(this).attr('id');
		});
		navLinks.removeClass('active');
		if (current) $(`.nav-link[href="#${current}"]`).addClass('active');
		$(window).scrollTop() > 50 ? $('.navbar').addClass('navbar-scrolled') : $('.navbar').removeClass('navbar-scrolled');
	});

	// ========== SMOOTH SCROLL ==========
	$('a[href*="#"]:not([href="#"])').on('click', function (e) {
		e.preventDefault();
		const target = $(this.hash);
		if (target.length) {
			if (navbarCollapse.hasClass('show')) { menuToggle.removeClass('active'); navbarCollapse.removeClass('show'); navbar.removeClass('menu-open'); $('body').css('overflow', ''); }
			$('html, body').animate({ scrollTop: target.offset().top - 80 }, 800, 'swing');
		}
	});

	// ========== LEAD FORM ==========
	$('#leadForm').on('submit', function (e) {
		e.preventDefault();
		const name = $('#leadName').val(), email = $('#leadEmail').val(), phone = $('#leadPhone').val(), company = $('#leadCompany').val(), plan = $('#leadPlan').val();
		if (!name || !email || !phone) { alert('Please fill in all required fields'); return; }
		const lead = { name, email, phone, company, plan, timestamp: new Date().toISOString(), source: 'FreightForce.AI Landing Page' };
		let leads = localStorage.getItem('freightforce_leads'); leads = leads ? JSON.parse(leads) : []; leads.push(lead); localStorage.setItem('freightforce_leads', JSON.stringify(leads));
		$('#leadForm').hide(); $('#successMessage').fadeIn(); $('#leadForm')[0].reset();
		setTimeout(() => { $('#successMessage').fadeOut(); $('#leadForm').fadeIn(); }, 5000);
	});

	// ========== NEWSLETTER ==========
	$('#newsletterForm').on('submit', function (e) {
		e.preventDefault();
		const email = $(this).find('input[type="email"]').val();
		if (email) {
			let subscribers = localStorage.getItem('freightforce_subscribers'); subscribers = subscribers ? JSON.parse(subscribers) : [];
			if (!subscribers.includes(email)) {
				subscribers.push(email); localStorage.setItem('freightforce_subscribers', JSON.stringify(subscribers));
				$(this).hide(); $(this).siblings('.newsletter-success').fadeIn();
				setTimeout(() => { $(this).siblings('.newsletter-success').fadeOut(); $(this).show(); $(this).find('input').val(''); }, 3000);
			} else { alert('You are already subscribed!'); }
		}
	});

	// ========== PARTICLE BACKGROUND ==========
	const canvas = document.getElementById('particleCanvas');
	if (canvas && window.innerWidth > 768) {
		const ctx = canvas.getContext('2d'); let particles = []; let animationId = null;
		function resizeCanvas() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
		function createParticles() {
			const particleCount = Math.min(60, Math.floor(window.innerWidth / 20)); particles = [];
			for (let i = 0; i < particleCount; i++) particles.push({ x: Math.random() * canvas.width, y: Math.random() * canvas.height, radius: Math.random() * 2 + 1, speedX: (Math.random() - 0.5) * 0.3, speedY: (Math.random() - 0.5) * 0.3, opacity: Math.random() * 0.2 + 0.05 });
		}
		function animateParticles() {
			if (!ctx) return; ctx.clearRect(0, 0, canvas.width, canvas.height);
			particles.forEach(p => { p.x += p.speedX; p.y += p.speedY; if (p.x < 0) p.x = canvas.width; if (p.x > canvas.width) p.x = 0; if (p.y < 0) p.y = canvas.height; if (p.y > canvas.height) p.y = 0; ctx.beginPath(); ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2); ctx.fillStyle = `rgba(99, 102, 241, ${p.opacity})`; ctx.fill(); });
			animationId = requestAnimationFrame(animateParticles);
		}
		resizeCanvas(); createParticles(); animateParticles();
		let resizeTimeout; window.addEventListener('resize', () => { clearTimeout(resizeTimeout); resizeTimeout = setTimeout(() => { if (animationId) cancelAnimationFrame(animationId); resizeCanvas(); createParticles(); animateParticles(); }, 150); });
	}

	// ========== CARD HOVER ==========
	$('.problem-card, .employee-card').hover(function () { $(this).css('transform', 'translateY(-5px)'); }, function () { $(this).css('transform', 'translateY(0)'); });

});

// ========== SMOOTH TYPING ANIMATION ==========
const words = ['Logistics Teams', 'Supply Chains', 'Global Trade', 'Freight Forwarders'];
let wordIndex = 0;
let charIndex = 0;
let isDeleting = false;
const typedTextElement = document.getElementById('typed-text');

function typeEffect() {
	if (!typedTextElement) return;
	const currentWord = words[wordIndex];
	if (isDeleting) {
		charIndex--;
	} else {
		charIndex++;
	}

	typedTextElement.textContent = currentWord.substring(0, charIndex);
	let typeSpeed = isDeleting ? 40 : 80;

	if (!isDeleting) {
		typeSpeed += Math.random() * 40;
	}

	if (!isDeleting && charIndex === currentWord.length) {
		typeSpeed = 2000;
		isDeleting = true;
	}
	else if (isDeleting && charIndex === 0) {
		isDeleting = false;
		wordIndex = (wordIndex + 1) % words.length;
		typeSpeed = 500;
	}

	setTimeout(typeEffect, typeSpeed);
}

document.addEventListener('DOMContentLoaded', () => {
	if (typedTextElement) setTimeout(typeEffect, 500);
});

// ========== CHAT AUTO-SCROLL ==========
function scrollChatToBottom() { $('.chat-messages').each(function () { this.scrollTop = this.scrollHeight; }); }
const chatObserver = new MutationObserver(scrollChatToBottom);
$('.chat-messages').each(function () { chatObserver.observe(this, { childList: true, subtree: true }); });
setTimeout(scrollChatToBottom, 500);

let chatInterval;
const demoMessages = [
	{ user: "Where is my shipment FREIGHT-001?", ai: "Your shipment is currently in transit from Mumbai and expected to arrive on April 15, 2024. <a href='#'>Track live →</a>" },
	{ user: "What's the estimated delivery time?", ai: "The estimated delivery is April 15, 2024 by 6:00 PM local time." },
	{ user: "Can I change the delivery address?", ai: "Yes, you can request address change. Please share the new address." }
];

function addUserMessage(text) { $('.chat-messages').append(`<div class="message user"><div class="message-bubble">${text}</div><div class="message-time">Just now</div></div>`); scrollChatToBottom(); }
function addAIMessage(text, isTyping = false) {
	const $chat = $('.chat-messages');
	if (isTyping) { $chat.append(`<div class="message ai typing"><div class="message-bubble">Typing<span class="typing-dots"><span>.</span><span>.</span><span>.</span></span></div></div>`); }
	else { $('.message.typing').remove(); $chat.append(`<div class="message ai"><div class="message-bubble">${text}</div><div class="message-time">Just now</div></div>`); }
	scrollChatToBottom();
}
function startChatSimulation() { if (chatInterval) clearInterval(chatInterval); let index = 0; function simulateNext() { if (index >= demoMessages.length) return; const msg = demoMessages[index]; addUserMessage(msg.user); setTimeout(() => { addAIMessage('', true); setTimeout(() => { addAIMessage(msg.ai); index++; if (index < demoMessages.length) setTimeout(simulateNext, 3000); }, 1500); }, 500); } setTimeout(simulateNext, 2000); }
$('.tab-premium').on('click', function () { if ($(this).data('tab') === 'support') { setTimeout(() => { scrollChatToBottom(); $('.chat-messages').empty(); addAIMessage("Hello! I'm Support AI. How can I help you?"); startChatSimulation(); }, 300); } });
if ($('.tab-premium.active').data('tab') === 'support') { setTimeout(startChatSimulation, 1000); }

// ========== 3D PARTICLE SYSTEM FOR HERO SECTION ==========
function initHeroParticles() {
	const canvas = document.getElementById('hero-particles-canvas');
	if (!canvas) return;

	const ctx = canvas.getContext('2d');
	let particles = [];
	let animationId = null;
	let mouseX = 0, mouseY = 0;

	function resizeCanvas() {
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;
	}

	function createParticles() {
		const particleCount = Math.min(120, Math.floor(window.innerWidth / 12));
		particles = [];
		for (let i = 0; i < particleCount; i++) {
			particles.push({
				x: Math.random() * canvas.width,
				y: Math.random() * canvas.height,
				radius: Math.random() * 3 + 1.5,
				originalRadius: Math.random() * 3 + 1.5,
				speedX: (Math.random() - 0.5) * 0.4,
				speedY: (Math.random() - 0.5) * 0.3,
				opacity: Math.random() * 0.4 + 0.2,
				color: `hsl(${Math.random() * 60 + 240}, 70%, 60%)`,
				pulseSpeed: Math.random() * 0.02 + 0.01,
				pulsePhase: Math.random() * Math.PI * 2
			});
		}
	}

	// Mouse move effect
	document.addEventListener('mousemove', (e) => {
		mouseX = e.clientX;
		mouseY = e.clientY;
	});

	function animateParticles() {
		if (!ctx) return;
		ctx.clearRect(0, 0, canvas.width, canvas.height);

		particles.forEach(p => {
			// Update position
			p.x += p.speedX;
			p.y += p.speedY;

			// Wrap around edges
			if (p.x < -50) p.x = canvas.width + 50;
			if (p.x > canvas.width + 50) p.x = -50;
			if (p.y < -50) p.y = canvas.height + 50;
			if (p.y > canvas.height + 50) p.y = -50;

			// Mouse interaction - particles move away from cursor
			const dx = p.x - mouseX;
			const dy = p.y - mouseY;
			const dist = Math.sqrt(dx * dx + dy * dy);
			if (dist < 100) {
				const angle = Math.atan2(dy, dx);
				const force = (100 - dist) / 100 * 1.5;
				p.x += Math.cos(angle) * force;
				p.y += Math.sin(angle) * force;
			}

			// Pulsing effect
			const pulse = Math.sin(Date.now() * p.pulseSpeed + p.pulsePhase) * 0.3 + 0.7;
			const currentRadius = p.originalRadius * pulse;

			// Draw particle
			ctx.beginPath();
			ctx.arc(p.x, p.y, currentRadius, 0, Math.PI * 2);
			ctx.fillStyle = `rgba(99, 102, 241, ${p.opacity * pulse})`;
			ctx.fill();

			// Glow effect
			ctx.beginPath();
			ctx.arc(p.x, p.y, currentRadius * 1.5, 0, Math.PI * 2);
			ctx.fillStyle = `rgba(99, 102, 241, ${p.opacity * 0.2})`;
			ctx.fill();
		});

		// Draw connecting lines between nearby particles
		ctx.beginPath();
		ctx.strokeStyle = 'rgba(99, 102, 241, 0.1)';
		ctx.lineWidth = 0.8;
		for (let i = 0; i < particles.length; i++) {
			for (let j = i + 1; j < particles.length; j++) {
				const dx = particles[i].x - particles[j].x;
				const dy = particles[i].y - particles[j].y;
				const dist = Math.sqrt(dx * dx + dy * dy);
				if (dist < 120) {
					ctx.beginPath();
					ctx.moveTo(particles[i].x, particles[i].y);
					ctx.lineTo(particles[j].x, particles[j].y);
					ctx.stroke();
				}
			}
		}

		animationId = requestAnimationFrame(animateParticles);
	}

	resizeCanvas();
	createParticles();
	animateParticles();

	window.addEventListener('resize', () => {
		if (animationId) cancelAnimationFrame(animationId);
		resizeCanvas();
		createParticles();
		animateParticles();
	});
}

// Initialize hero particles
if (document.getElementById('hero-particles-canvas')) {
	setTimeout(initHeroParticles, 100);
}

// ========== STAT COUNTER ANIMATION ==========
function animateStats() {
	$('.hero-stats .stat-number').each(function () {
		const $this = $(this);
		const countTo = parseInt($this.data('count'));

		if (!isNaN(countTo) && !$this.hasClass('counted')) {
			$this.addClass('counted');
			$({ countNum: 0 }).animate({
				countNum: countTo
			}, {
				duration: 2000,
				easing: 'swing',
				step: function () {
					$this.text(Math.floor(this.countNum));
				},
				complete: function () {
					$this.text(countTo);
				}
			});
		}
	});
}

// Run stats animation when hero comes into view
const heroObserver = new IntersectionObserver((entries) => {
	entries.forEach(entry => {
		if (entry.isIntersecting) {
			animateStats();
			heroObserver.unobserve(entry.target);
		}
	});
});

if (document.querySelector('.hero-stats')) {
	heroObserver.observe(document.querySelector('.hero-stats'));
}
// ========== STAT CARD COUNTER ANIMATION (Sleek Cards) ==========
function animateSleekStats() {
	$('.hero-stats-inline .stat-number').each(function () {
		const $this = $(this);
		const countTo = parseInt($this.data('count'));

		if (!isNaN(countTo) && !$this.hasClass('counted')) {
			$this.addClass('counted');
			$({ countNum: 0 }).animate({
				countNum: countTo
			}, {
				duration: 2000,
				easing: 'swing',
				step: function () {
					$this.text(Math.floor(this.countNum));
				},
				complete: function () {
					$this.text(countTo);
				}
			});
		}
	});
}

// Run stats animation when hero comes into view
const sleekStatsObserver = new IntersectionObserver((entries) => {
	entries.forEach(entry => {
		if (entry.isIntersecting) {
			animateSleekStats();
			sleekStatsObserver.unobserve(entry.target);
		}
	});
});

if (document.querySelector('.hero-stats-inline')) {
	sleekStatsObserver.observe(document.querySelector('.hero-stats-inline'));
}

// ============================================
// SMART GUIDED CHATBOT
// ============================================

// ============================================
// EMAIL CONFIGURATION - SETUP INSTRUCTIONS BELOW
// ============================================

/*
========================================
GMAIL APP PASSWORD SETUP GUIDE
========================================

STEP 1: Generate Gmail App Password
1. Go to your Google Account: https://myaccount.google.com
2. Click on "Security" in the left sidebar
3. Under "Signing in to Google", click on "2-Step Verification" (must be enabled)
4. Scroll down and click on "App passwords"
5. Select "Mail" as the app and "Other (Custom name)" as the device
6. Type "FreightForce Chatbot" and click "Generate"
7. COPY THE 16-CHARACTER PASSWORD (looks like: abcd efgh ijkl mnop)

STEP 2: Update Configuration Below
- Replace YOUR_GMAIL_ADDRESS with your Gmail address
- Replace YOUR_APP_PASSWORD with the 16-character password (remove spaces)
- Replace YOUR_REPLY_TO_EMAIL with where you want to receive leads

STEP 3: Choose Email Method
- METHOD 1: EmailJS (Recommended for production)
- METHOD 2: Gmail SMTP (Direct, simpler setup)
*/

// ============================================
// EMAIL CONFIGURATION - EDIT THESE VALUES
// ============================================

const EMAIL_CONFIG = {
	// === METHOD 1: EMAILJS CONFIGURATION ===
	// Get these from https://dashboard.emailjs.com/
	EMAILJS_SERVICE_ID: 'YOUR_SERVICE_ID',      // Replace with your EmailJS Service ID
	EMAILJS_TEMPLATE_ID: 'YOUR_TEMPLATE_ID',    // Replace with your EmailJS Template ID
	EMAILJS_PUBLIC_KEY: 'YOUR_PUBLIC_KEY',      // Replace with your EmailJS Public Key
	
	// === METHOD 2: GMAIL SMTP CONFIGURATION ===
	// Use Gmail App Password (NOT your regular Gmail password)
	GMAIL_ADDRESS: 'YOUR_GMAIL@gmail.com',       // Replace with your Gmail address
	GMAIL_APP_PASSWORD: 'YOUR_APP_PASSWORD',     // Replace with 16-char App Password (no spaces)
	
	// === WHERE TO SEND LEADS ===
	REPLY_TO_EMAIL: 'admin@freightforce.ai',     // Replace with your email to receive leads
	
	// === SELECT METHOD ===
	// 'emailjs' or 'smtp'
	METHOD: 'smtp'  // Change to 'emailjs' if you prefer EmailJS
};

// ============================================
// EMAILJS CONFIGURATION (Legacy - kept for compatibility)
// ============================================
const EMAILJS_CONFIG = {
	SERVICE_ID: EMAIL_CONFIG.EMAILJS_SERVICE_ID,
	TEMPLATE_ID: EMAIL_CONFIG.EMAILJS_TEMPLATE_ID,
	PUBLIC_KEY: EMAIL_CONFIG.EMAILJS_PUBLIC_KEY
};
// ============================================
// CHATBOT CONVERSATION FLOW
// ============================================

const chatFlow = {
	welcome: {
		message: "👋 Welcome! Please select an AI assistant to chat with:",
		type: 'model_selection',
		options: [
			{ id: 'sales_ai', text: 'Sales AI - Get more clients', icon: 'fa-chart-line' },
			{ id: 'ops_ai', text: 'Ops AI - Track shipments', icon: 'fa-ship' },
			{ id: 'support_ai', text: 'Support AI - 24/7 help', icon: 'fa-headset' },
			{ id: 'accounts_ai', text: 'Accounts AI - Payments', icon: 'fa-file-invoice-dollar' },
			{ id: 'pricing_ai', text: 'Pricing AI - Smart quotes', icon: 'fa-tags' }
		]
	},
	sales_ai: {
		message: "📞 **Sales AI** here! I can help you:\n\n✅ Capture leads from any channel\n✅ Send instant follow-ups\n✅ Qualify prospects automatically\n✅ Book meetings 24/7\n\nWhat would you like to know?",
		aiModel: 'Sales AI',
		options: [
			{ id: 'sales_lead_gen', text: 'How do you generate leads?', icon: 'fa-question' },
			{ id: 'sales_followup', text: 'Auto follow-ups', icon: 'fa-redo' },
			{ id: 'pricing', text: 'View pricing', icon: 'fa-tag' },
			{ id: 'book_demo', text: 'Book demo', icon: 'fa-calendar' }
		]
	},
	ops_ai: {
		message: "� **Ops AI** at your service! I automate operations:\n\n✅ Real-time shipment tracking\n✅ Port & customs alerts\n✅ ETD/ETA notifications\n✅ Multi-carrier updates\n\nWhat interests you?",
		aiModel: 'Ops AI',
		options: [
			{ id: 'ops_tracking', text: 'How tracking works', icon: 'fa-question' },
			{ id: 'ops_alerts', text: 'Alert types', icon: 'fa-bell' },
			{ id: 'pricing', text: 'View pricing', icon: 'fa-tag' },
			{ id: 'book_demo', text: 'Book demo', icon: 'fa-calendar' }
		]
	},
	support_ai: {
		message: "💬 **Support AI** ready! I provide:\n\n✅ 24/7 customer service\n✅ Instant freight answers\n✅ 50+ languages\n✅ Smart escalation\n\n< 5 sec response time!",
		aiModel: 'Support AI',
		options: [
			{ id: 'support_features', text: 'What can you answer?', icon: 'fa-question' },
			{ id: 'pricing', text: 'View pricing', icon: 'fa-tag' },
			{ id: 'book_demo', text: 'Book demo', icon: 'fa-calendar' }
		]
	},
	accounts_ai: {
		message: "� **Accounts AI** here! I streamline:\n\n✅ Auto-invoicing\n✅ Payment reminders\n✅ Overdue follow-ups\n✅ Cash flow reports\n\nReduce delays by 60%!",
		aiModel: 'Accounts AI',
		options: [
			{ id: 'accounts_invoicing', text: 'Auto-invoicing', icon: 'fa-question' },
			{ id: 'pricing', text: 'View pricing', icon: 'fa-tag' },
			{ id: 'book_demo', text: 'Book demo', icon: 'fa-calendar' }
		]
	},
	pricing_ai: {
		message: "💲 **Pricing AI** - margin optimizer:\n\n✅ Dynamic quotes\n✅ Market rate analysis\n✅ Profit protection\n✅ Competitor intel\n\nGet 15% better margins!",
		aiModel: 'Pricing AI',
		options: [
			{ id: 'pricing_quotes', text: 'How fast are quotes?', icon: 'fa-question' },
			{ id: 'pricing', text: 'View pricing', icon: 'fa-tag' },
			{ id: 'book_demo', text: 'Book demo', icon: 'fa-calendar' }
		]
	},
	sales_lead_gen: {
		message: "I capture leads from:\n\n🌐 Website & chat\n📧 Email inquiries\n📱 WhatsApp\n📞 Calls\n📱 Social media\n\nInstant response - no 2-hour delays!",
		options: [
			{ id: 'pricing', text: 'View pricing', icon: 'fa-tag' },
			{ id: 'book_demo', text: 'Book demo', icon: 'fa-calendar' }
		]
	},
	sales_followup: {
		message: "My follow-up sequence:\n\n📧 Immediate acknowledgment\n⏰ Day 1: Value proposition\n⏰ Day 3: Case study\n⏰ Day 7: Special offer\n⏰ Day 14: Check-in\n\nYou get qualified meetings automatically!",
		options: [
			{ id: 'pricing', text: 'View pricing', icon: 'fa-tag' },
			{ id: 'book_demo', text: 'Book demo', icon: 'fa-calendar-check' }
		]
	},
	ops_tracking: {
		message: "I track 500+ carriers:\n\n🚢 Ocean (MSC, Maersk...)\n✈️ Air (Emirates, DHL...)\n🚛 Ground (FedEx, UPS...)\n📦 One dashboard\n\nUpdates every 15 minutes!",
		options: [
			{ id: 'pricing', text: 'View pricing', icon: 'fa-tag' },
			{ id: 'book_demo', text: 'See live demo', icon: 'fa-play' }
		]
	},
	ops_alerts: {
		message: "Smart alerts:\n\n⚠️ ETD/ETA changes\n⚠️ Port congestion\n⚠️ Customs holds\n⚠️ Container roll-overs\n⚠️ Demurrage warnings\n\nClients know before they ask!",
		options: [
			{ id: 'pricing', text: 'View pricing', icon: 'fa-tag' },
			{ id: 'book_demo', text: 'Book demo', icon: 'fa-calendar' }
		]
	},
	pricing: {
		message: "� Our pricing:\n\n🚀 Starter: $299/mo (2 agents)\n⚡ Growth: $799/mo (All 5 agents) ⭐\n🏢 Enterprise: Custom\n\nAll plans: 7-day free trial!",
		options: [
			{ id: 'growth_plan', text: 'Growth - $799/mo', icon: 'fa-bolt' },
			{ id: 'starter_plan', text: 'Starter - $299/mo', icon: 'fa-rocket' },
			{ id: 'book_demo', text: 'Free demo', icon: 'fa-calendar' }
		]
	},
	growth_plan: {
		message: "⚡ **Growth Plan** includes:\n\n✅ All 5 AI agents\n✅ Unlimited chats\n✅ WhatsApp + Email + Web\n✅ Advanced analytics\n✅ API access\n\n**$799/month** - Start free trial!",
		options: [
			{ id: 'book_demo', text: 'Start free trial', icon: 'fa-play' },
			{ id: 'welcome', text: 'Chat with another AI', icon: 'fa-robot' }
		]
	},
	starter_plan: {
		message: "🚀 **Starter Plan** includes:\n\n✅ Any 2 AI agents\n✅ 500 chats/month\n✅ Email & Web\n✅ Basic analytics\n\n**$299/month** - Perfect start!",
		options: [
			{ id: 'book_demo', text: 'Start free trial', icon: 'fa-play' },
			{ id: 'welcome', text: 'Compare plans', icon: 'fa-robot' }
		]
	},
	accounts_invoicing: {
		message: "Auto-invoicing features:\n\n📄 PDF generation\n📧 Auto-email to clients\n⏰ Scheduled delivery\n💱 Multi-currency\n✓ Integration with your ERP\n\nNo more manual invoicing!",
		options: [
			{ id: 'pricing', text: 'View pricing', icon: 'fa-tag' },
			{ id: 'book_demo', text: 'Book demo', icon: 'fa-calendar' }
		]
	},
	pricing_quotes: {
		message: "Lightning fast quotes:\n\n⚡ Under 30 seconds\n� Real-time market rates\n� 98% accuracy\n� Multi-currency support\n📧 Auto-email to clients\n\nNo more spreadsheet delays!",
		options: [
			{ id: 'pricing', text: 'View pricing', icon: 'fa-tag' },
			{ id: 'book_demo', text: 'Book demo', icon: 'fa-calendar' }
		]
	},
	support_features: {
		message: "I can instantly answer:\n\n📦 Shipment status queries\n💰 Pricing questions\n📄 Documentation help\n🚢 Routing inquiries\n⏰ Transit time estimates\n\nAnd escalate complex issues to your team!",
		options: [
			{ id: 'pricing', text: 'View pricing', icon: 'fa-tag' },
			{ id: 'book_demo', text: 'Book demo', icon: 'fa-calendar' }
		]
	},
	// Final lead capture
	book_demo: {
		message: "🎯 Great! Share your details and our AI specialist will contact you within 24 hours!",
		action: 'showForm'
	}
};

// ============================================
// CHATBOT STATE
// ============================================

const chatbotState = {
	isOpen: false,
	currentStep: 'welcome',
	chatHistory: [],
	userAnswers: {},
	messageCount: 0,
	miniFormShown: false,
	userDetails: null,
	selectedAIModel: null
};
// ============================================
// CHATBOT INITIALIZATION
// ============================================

function initChatbot() {
	const toggle = document.getElementById('chatbot-toggle');
	const close = document.getElementById('chatbot-close');
	const window_ = document.getElementById('chatbot-window');
	const form = document.getElementById('leadCaptureForm');
	const quickForm = document.getElementById('quickContactForm');
	const miniForm = document.getElementById('miniLeadForm');
	const heroChatBtn = document.getElementById('chatbot-form');

	if (!toggle || !window_) return;

	// Setup quick contact form
	if (quickForm) {
		quickForm.addEventListener('submit', handleQuickFormSubmit);
		const quickPhone = document.getElementById('quickPhone');
		if (quickPhone) {
			quickPhone.addEventListener('input', function() {
				this.value = this.value.replace(/\D/g, '').slice(0, 10);
			});
		}
	}

	// Setup mini lead form
	if (miniForm) {
		miniForm.addEventListener('submit', handleMiniFormSubmit);
		const miniPhone = document.getElementById('miniPhone');
		if (miniPhone) {
			miniPhone.addEventListener('input', function() {
				this.value = this.value.replace(/\D/g, '').slice(0, 10);
			});
		}
	}

	// Hero section "Chat With Bot" button click handler
	if (heroChatBtn) {
		heroChatBtn.addEventListener('click', (e) => {
			e.preventDefault();
			// Open chatbot
			chatbotState.isOpen = true;
			window_.classList.add('open');
			toggle.classList.add('hidden');
			
			// Start conversation if first time opening
			if (chatbotState.chatHistory.length === 0) {
				setTimeout(() => {
					displayBotMessage(chatFlow.welcome);
				}, 500);
			}
			
			// Scroll to chatbot window
			window_.scrollIntoView({ behavior: 'smooth', block: 'center' });
		});
	}

	// Toggle chat window
	toggle.addEventListener('click', () => {
		chatbotState.isOpen = !chatbotState.isOpen;
		window_.classList.toggle('open', chatbotState.isOpen);
		toggle.classList.toggle('hidden', chatbotState.isOpen);

		// Start conversation if first time opening
		if (chatbotState.isOpen && chatbotState.chatHistory.length === 0) {
			setTimeout(() => {
				displayBotMessage(chatFlow.welcome);
			}, 500);
		}
	});

	// Close chat window
	if (close) {
		close.addEventListener('click', () => {
			chatbotState.isOpen = false;
			window_.classList.remove('open');
			toggle.classList.remove('hidden');
		});
	}

	// Handle main form submission
	if (form) {
		form.addEventListener('submit', handleFormSubmit);
	}

	// Setup phone inputs with validation
	setupPhoneInputs();

	// Close on click outside
	document.addEventListener('click', (e) => {
		if (chatbotState.isOpen &&
			!window_.contains(e.target) &&
			!toggle.contains(e.target)) {
			chatbotState.isOpen = false;
			window_.classList.remove('open');
			toggle.classList.remove('hidden');
		}
	});

	// Auto-open for new visitors after 3 seconds
	checkAndAutoOpen();
}

// Check if visitor is new and auto-open chat
function checkAndAutoOpen() {
	const hasVisited = localStorage.getItem('chatbot_visited');
	if (!hasVisited) {
		// New visitor - show after delay
		setTimeout(() => {
			const toggle = document.getElementById('chatbot-toggle');
			const window_ = document.getElementById('chatbot-window');
			if (toggle && window_) {
				chatbotState.isOpen = true;
				window_.classList.add('open');
				toggle.classList.add('hidden');
				// Show quick contact form immediately
				showQuickContactForm();
			}
		}, 3000);
	}
}

// Setup all phone input validation
function setupPhoneInputs() {
	const phoneInputs = ['chatbotPhone', 'quickPhone', 'miniPhone'];
	phoneInputs.forEach(id => {
		const input = document.getElementById(id);
		if (input) {
			input.addEventListener('input', function() {
				this.value = this.value.replace(/\D/g, '').slice(0, 10);
			});
		}
	});
}

// Show quick contact form for new visitors
function showQuickContactForm() {
	const quickForm = document.getElementById('quick-contact-form');
	const messagesContainer = document.getElementById('chatbot-messages');
	if (quickForm) {
		quickForm.style.display = 'block';
		if (messagesContainer) {
			messagesContainer.style.display = 'none';
		}
	}
}

// Close quick contact form
function closeQuickForm() {
	const quickForm = document.getElementById('quick-contact-form');
	const messagesContainer = document.getElementById('chatbot-messages');
	if (quickForm) {
		quickForm.style.display = 'none';
	}
	if (messagesContainer) {
		messagesContainer.style.display = 'block';
	}
	localStorage.setItem('chatbot_visited', 'true');
}

// Skip quick form and start chat
function skipQuickForm() {
	closeQuickForm();
	localStorage.setItem('chatbot_visited', 'true');
	setTimeout(() => {
		displayBotMessage(chatFlow.welcome);
	}, 300);
}

// Handle quick contact form submission
function handleQuickFormSubmit(e) {
	e.preventDefault();
	
	const name = document.getElementById('quickName').value.trim();
	const countryCode = document.getElementById('quickCountryCode').value;
	const phone = document.getElementById('quickPhone').value.trim();
	const email = document.getElementById('quickEmail').value.trim();
	
	if (!name || !phone || !email) {
		alert('Please fill in all fields');
		return;
	}
	
	// Save user details
	chatbotState.userDetails = {
		name: name,
		countryCode: countryCode,
		phone: phone,
		email: email,
		timestamp: new Date().toISOString()
	};
	
	// Send email
	const fullPhone = countryCode + phone;
	const chatHistory = 'New visitor submitted Contact Us form';
	
	// Show loading
	const submitBtn = e.target.querySelector('.btn-submit');
	if (submitBtn) {
		submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
		submitBtn.disabled = true;
	}
	
	// Send and continue
	if (EMAIL_CONFIG.METHOD === 'smtp') {
		sendEmailViaSMTP(name, email, fullPhone, chatHistory, 'Contact Us Form');
	} else {
		sendEmailViaEmailJS(name, email, fullPhone, chatHistory, 'Contact Us Form');
	}
	
	localStorage.setItem('chatbot_visited', 'true');
	closeQuickForm();
	
	// Show welcome message
	setTimeout(() => {
		displayBotMessage({
			message: `Thank you ${name}! Our team will contact you shortly. Meanwhile, feel free to chat with any of our AI assistants!`,
			options: chatFlow.welcome.options
		});
	}, 500);
}

// ============================================
// CHAT MESSAGE FUNCTIONS
// ============================================

function displayBotMessage(flowStep) {
	const messagesContainer = document.getElementById('chatbot-messages');
	if (!messagesContainer) return;

	// Track AI model selection
	if (flowStep.aiModel) {
		chatbotState.selectedAIModel = flowStep.aiModel;
	}

	// Add to history
	chatbotState.chatHistory.push({
		type: 'bot',
		message: flowStep.message,
		timestamp: new Date().toISOString()
	});

	// Show typing indicator
	showTypingIndicator();

	// Delay for natural feel
	setTimeout(() => {
		hideTypingIndicator();

		// Create message element
		const messageDiv = document.createElement('div');
		messageDiv.className = 'chat-message bot';
		messageDiv.innerHTML = `
			<div class="message-avatar"><i class="fas fa-robot"></i></div>
			<div class="message-content">
				${formatMessage(flowStep.message)}
				<div class="message-time">${getCurrentTime()}</div>
			</div>
		`;

		messagesContainer.appendChild(messageDiv);
		scrollToBottom();

		// Show options if available
		if (flowStep.options && flowStep.options.length > 0) {
			displayOptions(flowStep.options);
		}

		// Show form if action is showForm
		if (flowStep.action === 'showForm') {
			setTimeout(() => {
				showLeadForm();
			}, 500);
		}
	}, 1000);
}

function displayUserMessage(text) {
	const messagesContainer = document.getElementById('chatbot-messages');
	if (!messagesContainer) return;

	// Add to history
	chatbotState.chatHistory.push({
		type: 'user',
		message: text,
		timestamp: new Date().toISOString()
	});

	const messageDiv = document.createElement('div');
	messageDiv.className = 'chat-message user';
	messageDiv.innerHTML = `
		<div class="message-avatar"><i class="fas fa-user"></i></div>
		<div class="message-content">
			${text}
			<div class="message-time">${getCurrentTime()}</div>
		</div>
	`;

	messagesContainer.appendChild(messageDiv);
	scrollToBottom();
}

function displayOptions(options) {
	const messagesContainer = document.getElementById('chatbot-messages');
	if (!messagesContainer) return;

	const optionsDiv = document.createElement('div');
	optionsDiv.className = 'chat-options';

	options.forEach(option => {
		const btn = document.createElement('button');
		btn.className = 'chat-option-btn';
		btn.innerHTML = `<i class="fas ${option.icon}"></i> ${option.text}`;
		btn.addEventListener('click', () => handleOptionClick(option.id, option.text));
		optionsDiv.appendChild(btn);
	});

	messagesContainer.appendChild(optionsDiv);
	scrollToBottom();
}

function handleOptionClick(optionId, optionText) {
	// Disable all option buttons
	document.querySelectorAll('.chat-option-btn').forEach(btn => {
		btn.disabled = true;
	});

	// Show user selection
	displayUserMessage(optionText);

	// Increment message count
	chatbotState.messageCount++;

	// Check if we should show mini form (every 2nd message, unless already shown)
	if (chatbotState.messageCount % 2 === 0 && !chatbotState.miniFormShown && !chatbotState.userDetails) {
		setTimeout(() => {
			showMiniLeadForm();
		}, 1000);
		return;
	}

	// Get next step
	const nextStep = chatFlow[optionId];
	if (nextStep) {
		chatbotState.currentStep = optionId;
		setTimeout(() => {
			displayBotMessage(nextStep);
		}, 800);
	}
}

function showMiniLeadForm() {
	const miniForm = document.getElementById('mini-lead-form');
	if (miniForm) {
		miniForm.style.display = 'block';
		scrollToBottom();
	}
}

function closeMiniForm() {
	const miniForm = document.getElementById('mini-lead-form');
	if (miniForm) {
		miniForm.style.display = 'none';
	}
	// Continue chat from current step
	const currentFlow = chatFlow[chatbotState.currentStep];
	if (currentFlow && currentFlow.options && currentFlow.options.length > 0) {
		displayOptions(currentFlow.options);
	}
}

function handleMiniFormSubmit(e) {
	e.preventDefault();
	
	const name = document.getElementById('miniName').value.trim();
	const countryCode = document.getElementById('miniCountryCode').value;
	const phone = document.getElementById('miniPhone').value.trim();
	const email = document.getElementById('miniEmail').value.trim();
	
	if (!name || !phone || !email) {
		alert('Please fill in all fields');
		return;
	}
	
	// Save user details
	chatbotState.userDetails = {
		name: name,
		countryCode: countryCode,
		phone: phone,
		email: email
	};
	chatbotState.miniFormShown = true;
	
	// Close form and continue
	const miniForm = document.getElementById('mini-lead-form');
	if (miniForm) miniForm.style.display = 'none';
	
	// Show thank you message
	displayBotMessage({
		message: `Thank you ${name}! Your details are saved. How else can I help you today?`,
		options: chatFlow[chatbotState.currentStep]?.options || chatFlow.welcome.options
	});
}

function formatMessage(message) {
	// Convert markdown-style formatting to HTML
	return message
		.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
		.replace(/\n/g, '<br>');
}

function getCurrentTime() {
	const now = new Date();
	return now.toLocaleTimeString('en-US', {
		hour: 'numeric',
		minute: '2-digit',
		hour12: true
	});
}

function showTypingIndicator() {
	const typingDiv = document.getElementById('chatbot-typing');
	if (typingDiv) {
		typingDiv.style.display = 'block';
		scrollToBottom();
	}
}

function hideTypingIndicator() {
	const typingDiv = document.getElementById('chatbot-typing');
	if (typingDiv) {
		typingDiv.style.display = 'none';
	}
}

function scrollToBottom() {
	const messagesContainer = document.getElementById('chatbot-messages');
	if (messagesContainer) {
		messagesContainer.scrollTop = messagesContainer.scrollHeight;
	}
}

function showLeadForm() {
	const formDiv = document.getElementById('chatbot-form');
	const typingDiv = document.getElementById('chatbot-typing');
	if (formDiv) {
		formDiv.style.display = 'block';
		if (typingDiv) typingDiv.style.display = 'none';
		scrollToBottom();
	}
}

// ============================================
// FORM VALIDATION & SUBMISSION
// ============================================

function validateEmail() {
	const emailInput = document.getElementById('chatbotEmail');
	const errorMsg = document.getElementById('emailError');
	const email = emailInput.value.trim();

	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

	if (email && !emailRegex.test(email)) {
		errorMsg.textContent = 'Please enter a valid email address';
		return false;
	} else {
		errorMsg.textContent = '';
		return true;
	}
}

function validatePhone() {
	const phoneInput = document.getElementById('chatbotPhone');
	const errorMsg = document.getElementById('phoneError');
	const phone = phoneInput.value.trim();

	const phoneRegex = /^\d{10}$/;

	if (phone && !phoneRegex.test(phone)) {
		errorMsg.textContent = 'Please enter exactly 10 digits';
		return false;
	} else {
		errorMsg.textContent = '';
		return true;
	}
}

function handleFormSubmit(e) {
	e.preventDefault();

	// Validate inputs
	const isEmailValid = validateEmail();
	const isPhoneValid = validatePhone();

	if (!isEmailValid || !isPhoneValid) {
		return;
	}

	const name = document.getElementById('chatbotName').value.trim();
	const countryCode = document.getElementById('chatbotCountryCode').value;
	const phone = document.getElementById('chatbotPhone').value.trim();
	const email = document.getElementById('chatbotEmail').value.trim();

	if (!name || !phone || !email) {
		alert('Please fill in all fields');
		return;
	}
	
	// Full phone with country code
	const fullPhone = countryCode + phone;

	// Collect chat history for email
	const chatHistoryText = chatbotState.chatHistory.map(msg => {
		return `${msg.type === 'bot' ? 'AI' : 'User'}: ${msg.message.replace(/<[^>]*>/g, '')}`;
	}).join('\n');

	// Show loading state
	const submitBtn = document.querySelector('.chatbot-submit');
	if (submitBtn) {
		submitBtn.disabled = true;
		submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
	}

	// Send email based on selected method
	if (EMAIL_CONFIG.METHOD === 'smtp') {
		sendEmailViaSMTP(name, email, fullPhone, chatHistoryText);
	} else {
		sendEmailViaEmailJS(name, email, fullPhone, chatHistoryText);
	}
}

// ============================================
// EMAIL SENDING FUNCTIONS
// ============================================

function sendEmailViaSMTP(name, userEmail, phone, chatHistory, source = 'Chatbot Lead Form') {
	// Check if configuration is set
	if (EMAIL_CONFIG.GMAIL_ADDRESS === 'YOUR_GMAIL@gmail.com' || 
	    EMAIL_CONFIG.GMAIL_APP_PASSWORD === 'YOUR_APP_PASSWORD') {
		console.warn('Gmail SMTP not configured. Saving to localStorage only.');
		saveLeadToLocalStorage(name, userEmail, phone, chatHistory);
		showSuccessMessage();
		alert('Lead saved locally. Please configure Gmail SMTP settings in app.js');
		return;
	}

	// Build email body
	const emailBody = `
New Lead from FreightForce.AI Chatbot

Source: ${source}
AI Model: ${chatbotState.selectedAIModel || 'Not selected'}
Name: ${name}
Email: ${userEmail}
Phone: ${phone}
Timestamp: ${new Date().toLocaleString()}
User Interest: ${chatbotState.currentStep}

Chat History:
${chatHistory}

---
This email was sent from FreightForce.AI website chatbot.
	`;

	// Send via SMTP.js
	Email.send({
		Host: "smtp.gmail.com",
		Username: EMAIL_CONFIG.GMAIL_ADDRESS,
		Password: EMAIL_CONFIG.GMAIL_APP_PASSWORD,
		To: EMAIL_CONFIG.REPLY_TO_EMAIL,
		From: EMAIL_CONFIG.GMAIL_ADDRESS,
		Subject: `New Lead: ${name} - FreightForce.AI (${source})`,
		Body: emailBody,
		ReplyTo: userEmail
	}).then(function(message) {
		console.log('Email sent via SMTP:', message);
		showSuccessMessage();
		saveLeadToLocalStorage(name, userEmail, phone, chatHistory);
	}).catch(function(error) {
		console.error('SMTP email failed:', error);
		// Save locally even if email fails
		saveLeadToLocalStorage(name, userEmail, phone, chatHistory);
		showSuccessMessage();
		alert('Thank you! Your information has been saved. Our team will contact you soon.');
	});
}

function sendEmailViaEmailJS(name, userEmail, phone, chatHistory, source = 'Chatbot Lead Form') {
	if (typeof emailjs === 'undefined') {
		console.warn('EmailJS not loaded. Saving to localStorage only.');
		saveLeadToLocalStorage(name, userEmail, phone, chatHistory);
		showSuccessMessage();
		return;
	}

	// Check if configuration is set
	if (EMAIL_CONFIG.EMAILJS_SERVICE_ID === 'YOUR_SERVICE_ID' || 
	    EMAIL_CONFIG.EMAILJS_TEMPLATE_ID === 'YOUR_TEMPLATE_ID' ||
	    EMAIL_CONFIG.EMAILJS_PUBLIC_KEY === 'YOUR_PUBLIC_KEY') {
		console.warn('EmailJS not configured. Saving to localStorage only.');
		saveLeadToLocalStorage(name, userEmail, phone, chatHistory);
		showSuccessMessage();
		alert('Lead saved locally. Please configure EmailJS settings in app.js');
		return;
	}

	emailjs.init(EMAILJS_CONFIG.PUBLIC_KEY);

	const templateParams = {
		from_name: name,
		from_email: userEmail,
		from_phone: phone,
		chat_history: chatHistory,
		user_interest: chatbotState.currentStep,
		timestamp: new Date().toLocaleString(),
		source: source,
		ai_model: chatbotState.selectedAIModel || 'Not selected'
	};

	emailjs.send(
		EMAILJS_CONFIG.SERVICE_ID,
		EMAILJS_CONFIG.TEMPLATE_ID,
		templateParams
	)
	.then(function(response) {
		console.log('Email sent via EmailJS:', response);
		showSuccessMessage();
		saveLeadToLocalStorage(name, userEmail, phone, chatHistory);
	})
	.catch(function(error) {
		console.error('EmailJS failed:', error);
		saveLeadToLocalStorage(name, userEmail, phone, chatHistory);
		showSuccessMessage();
		alert('Thank you! Your information has been saved. Our team will contact you soon.');
	});
}

function saveLeadToLocalStorage(name, email, phone, chatHistory) {
	const leadData = {
		name: name,
		email: email,
		phone: phone,
		chatHistory: chatHistory,
		timestamp: new Date().toISOString(),
		source: 'Chatbot',
		status: 'New Lead'
	};

	// Get existing leads or initialize empty array
	let leads = JSON.parse(localStorage.getItem('chatbot_leads') || '[]');
	leads.push(leadData);
	localStorage.setItem('chatbot_leads', JSON.stringify(leads));
}

function showSuccessMessage() {
	const messagesContainer = document.getElementById('chatbot-messages');
	const formDiv = document.getElementById('chatbot-form');

	if (formDiv) {
		formDiv.style.display = 'none';
	}

	const successDiv = document.createElement('div');
	successDiv.className = 'chat-success';
	successDiv.innerHTML = `
		<i class="fas fa-check-circle"></i>
		<h4>Thank You, ${document.getElementById('chatbotName').value}!</h4>
		<p>Our team will contact you within 24 hours.<br>Get ready to transform your freight operations with AI! 🚀</p>
	`;

	messagesContainer.appendChild(successDiv);
	scrollToBottom();

	// Reset after delay
	setTimeout(() => {
		resetChatbot();
	}, 5000);
}

function resetChatbot() {
	chatbotState.isOpen = false;
	chatbotState.currentStep = 'welcome';
	chatbotState.chatHistory = [];
	chatbotState.userAnswers = {};

	const window_ = document.getElementById('chatbot-window');
	const toggle = document.getElementById('chatbot-toggle');
	const messagesContainer = document.getElementById('chatbot-messages');
	const formDiv = document.getElementById('chatbot-form');
	const form = document.getElementById('leadCaptureForm');

	if (window_) window_.classList.remove('open');
	if (toggle) toggle.classList.remove('hidden');
	if (messagesContainer) messagesContainer.innerHTML = '';
	if (formDiv) formDiv.style.display = 'none';
	if (form) form.reset();
}

// Initialize chatbot when DOM is ready
document.addEventListener('DOMContentLoaded', initChatbot);