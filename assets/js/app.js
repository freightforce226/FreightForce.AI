// ============================================
// FREIGHTFORCE.AI — app.js (OPTIMISED)
// Removed: SMTP, EmailJS, duplicate handlers
// Active: Google Sheets via index.html script
// ============================================

$(document).ready(function() {

    // ── INIT ORDER ──────────────────────────────────────────────────────────
    initLoader();
    initAOS();
    initTabs();
    initCustomCursor();
    initMobileMenu();
    initScrollActiveNav();
    initSmoothScroll();
    initParticleBackground();
    initCardHover();
    initChatbot();

    // ── LOADER ───────────────────────────────────────────────────────────────
    function initLoader() {
        setTimeout(function() {
            $('#loader').addClass('fade-out');
            setTimeout(function() {
                $('#loader').css('display', 'none');
                $('#main-content').fadeIn(500);
            }, 500);
        }, 1500);
    }

    // ── AOS ───────────────────────────────────────────────────────────────────
    function initAOS() {
        AOS.init({
            duration: 500,
            once: true,
            mirror: false,
            offset: 80,
            easing: 'ease-out-cubic'
        });
    }

    // ── AI TABS ───────────────────────────────────────────────────────────────
    function initTabs() {
        $('.tab-premium').on('click', function() {
            const tabId = $(this).data('tab');
            $('.tab-premium').removeClass('active');
            $(this).addClass('active');
            $('.tab-pane-premium').removeClass('active');
            $('#tab-' + tabId + '-premium').addClass('active');

            // Re-run counters for newly visible tab
            setTimeout(animateCounters, 100);

            // Support tab: restart chat simulation
            if (tabId === 'support') {
                setTimeout(function() {
                    scrollChatToBottom();
                    $('.chat-messages').empty();
                    addAIMessage('Hello! I\'m Support AI. How can I help you?');
                    startChatSimulation();
                }, 300);
            }
        });

        // Start support demo if it's the active tab on load
        if ($('.tab-premium.active').data('tab') === 'support') {
            setTimeout(startChatSimulation, 1000);
        }
    }

    // ── ANIMATED COUNTERS (shared utility) ───────────────────────────────────
    function animateCounters() {
        $('.count-number').each(function() {
            const $el = $(this);
            const target = parseInt($el.data('count'));
            if (isNaN(target) || $el.hasClass('counted')) return;
            $el.addClass('counted');
            $({ n: 0 }).animate({ n: target }, {
                duration: 2000,
                easing: 'swing',
                step: function() { $el.text(Math.floor(this.n)); },
                complete: function() { $el.text(target); }
            });
        });
    }
    setTimeout(animateCounters, 500);

    // ── CUSTOM CURSOR (desktop only) ─────────────────────────────────────────
    function initCustomCursor() {
        if (window.innerWidth <= 768) {
            $('.cursor-dot, .cursor-outline').hide();
            return;
        }
        const $dot = $('.cursor-dot');
        const $outline = $('.cursor-outline');

        $(document).on('mousemove', function(e) {
            $dot.css({ top: e.clientY - 4, left: e.clientX - 4 });
            $outline.css({ top: e.clientY - 20, left: e.clientX - 20 });
        });

        $(document).on('mouseleave', function() {
            $dot.css('opacity', 0);
            $outline.css('opacity', 0);
        }).on('mouseenter', function() {
            $dot.css('opacity', 1);
            $outline.css('opacity', 1);
        });

        $('.btn, .problem-card, .employee-card, .plan-card, .tab-premium')
            .on('mouseenter', function() {
                $outline.css({ transform: 'scale(1.5)', borderColor: '#6366f1', backgroundColor: 'rgba(99,102,241,0.1)' });
            })
            .on('mouseleave', function() {
                $outline.css({ transform: 'scale(1)', borderColor: 'rgba(99,102,241,0.5)', backgroundColor: 'transparent' });
            });
    }

    // ── MOBILE MENU ───────────────────────────────────────────────────────────
    function initMobileMenu() {
        const $toggle = $('#menuToggle');
        const $collapse = $('#navbarNav');
        const $navbar = $('.navbar');

        if (!$toggle.length) return;

        $toggle.on('click', function(e) {
            e.stopPropagation();
            $(this).toggleClass('active');
            $collapse.toggleClass('show');
            $navbar.toggleClass('menu-open');
            $('body').css('overflow', $collapse.hasClass('show') ? 'hidden' : '');
        });

        $('.nav-link').on('click', closeMenu);

        $(document).on('click', function(e) {
            if ($collapse.hasClass('show') && !$(e.target).closest('.navbar').length) {
                closeMenu();
            }
        });

        function closeMenu() {
            $toggle.removeClass('active');
            $collapse.removeClass('show');
            $navbar.removeClass('menu-open');
            $('body').css('overflow', '');
        }
    }

    // ── ACTIVE NAV ON SCROLL ─────────────────────────────────────────────────
    function initScrollActiveNav() {
        const $sections = $('section');
        const $navLinks = $('.nav-link');
        const $navbar = $('.navbar');

        $(window).on('scroll.navActive', { passive: true }, function() {
            const scrollPos = $(window).scrollTop() + 150;
            let current = '';

            $sections.each(function() {
                const top = $(this).offset().top;
                const bottom = top + $(this).outerHeight();
                if (scrollPos >= top && scrollPos < bottom) current = $(this).attr('id');
            });

            $navLinks.removeClass('active');
            if (current) $navLinks.filter('[href="#' + current + '"]').addClass('active');

            if ($(window).scrollTop() > 50) {
                $navbar.addClass('navbar-scrolled');
            } else {
                $navbar.removeClass('navbar-scrolled');
            }
        });
    }

    // ── SMOOTH SCROLL ────────────────────────────────────────────────────────
    function initSmoothScroll() {
        $('a[href*="#"]:not([href="#"])').on('click', function(e) {
            const target = $(this.hash);
            if (!target.length) return;
            e.preventDefault();

            // Close mobile nav if open
            $('#menuToggle').removeClass('active');
            $('#navbarNav').removeClass('show');
            $('.navbar').removeClass('menu-open');
            $('body').css('overflow', '');

            $('html, body').animate({ scrollTop: target.offset().top - 80 }, 800, 'swing');
        });
    }

    // ── BACKGROUND PARTICLE CANVAS ───────────────────────────────────────────
    function initParticleBackground() {
        // Skip on mobile — saves CPU and improves FID
        if (window.innerWidth <= 768) return;

        const canvas = document.getElementById('particleCanvas');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        let particles = [];
        let animId = null;

        function resize() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }

        function build() {
            const count = Math.min(60, Math.floor(window.innerWidth / 20));
            particles = [];
            for (let i = 0; i < count; i++) {
                particles.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    radius: Math.random() * 2 + 1,
                    speedX: (Math.random() - 0.5) * 0.3,
                    speedY: (Math.random() - 0.5) * 0.3,
                    opacity: Math.random() * 0.2 + 0.05
                });
            }
        }

        function tick() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(function(p) {
                p.x += p.speedX;
                p.y += p.speedY;
                if (p.x < 0) p.x = canvas.width;
                if (p.x > canvas.width) p.x = 0;
                if (p.y < 0) p.y = canvas.height;
                if (p.y > canvas.height) p.y = 0;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(99,102,241,' + p.opacity + ')';
                ctx.fill();
            });
            animId = requestAnimationFrame(tick);
        }

        resize();
        build();
        tick();

        let resizeTimer;
        window.addEventListener('resize', function() {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(function() {
                if (animId) cancelAnimationFrame(animId);
                resize();
                build();
                tick();
            }, 150);
        });
    }

    // ── CARD HOVER ────────────────────────────────────────────────────────────
    function initCardHover() {
        $('.problem-card, .employee-card').hover(
            function() { $(this).css('transform', 'translateY(-5px)'); },
            function() { $(this).css('transform', 'translateY(0)'); }
        );
    }

    // ── SUPPORT TAB — CHAT SIMULATION ─────────────────────────────────────────
    const demoMessages = [
        { user: "Where is my shipment FREIGHT-001?", ai: "Your shipment is in transit from Mumbai — expected April 15, 2024. <a href='#'>Track live →</a>" },
        { user: "What's the estimated delivery time?", ai: "Expected delivery: April 15, 2024 by 6:00 PM local time." },
        { user: "Can I change the delivery address?", ai: "Yes! Please share the new address and I'll update it right away." }
    ];

    function scrollChatToBottom() {
        $('.chat-messages').each(function() { this.scrollTop = this.scrollHeight; });
    }

    function addUserMessage(text) {
        $('.chat-messages').append('<div class="message user"><div class="message-bubble">' + text + '</div><div class="message-time">Just now</div></div>');
        scrollChatToBottom();
    }

    function addAIMessage(text, typing) {
        const $chat = $('.chat-messages');
        if (typing) {
            $chat.append('<div class="message ai typing"><div class="message-bubble">Typing<span class="typing-dots"><span>.</span><span>.</span><span>.</span></span></div></div>');
        } else {
            $('.message.typing').remove();
            $chat.append('<div class="message ai"><div class="message-bubble">' + text + '</div><div class="message-time">Just now</div></div>');
        }
        scrollChatToBottom();
    }

    function startChatSimulation() {
        let index = 0;

        function next() {
            if (index >= demoMessages.length) return;
            const msg = demoMessages[index];
            addUserMessage(msg.user);
            setTimeout(function() {
                addAIMessage('', true);
                setTimeout(function() {
                    addAIMessage(msg.ai);
                    index++;
                    if (index < demoMessages.length) setTimeout(next, 3000);
                }, 1500);
            }, 500);
        }
        setTimeout(next, 2000);
    }

    // MutationObserver keeps the chat scrolled as new messages arrive
    const chatObserver = new MutationObserver(scrollChatToBottom);
    $('.chat-messages').each(function() {
        chatObserver.observe(this, { childList: true, subtree: true });
    });

});

// ============================================
// TYPING ANIMATION (runs before jQuery ready)
// ============================================
(function() {
    const words = ['Logistics Teams', 'Supply Chains', 'Global Trade', 'Freight Forwarders'];
    const el = document.getElementById('typed-text');
    let wordIdx = 0;
    let charIdx = 0;
    let deleting = false;

    function type() {
        if (!el) return;
        const word = words[wordIdx];
        if (deleting) {
            charIdx--;
        } else {
            charIdx++;
        }
        el.textContent = word.substring(0, charIdx);

        let delay = deleting ? 40 : 80 + Math.random() * 40;

        if (!deleting && charIdx === word.length) {
            delay = 2000;
            deleting = true;
        } else if (deleting && charIdx === 0) {
            deleting = false;
            wordIdx = (wordIdx + 1) % words.length;
            delay = 500;
        }
        setTimeout(type, delay);
    }

    document.addEventListener('DOMContentLoaded', function() {
        if (el) setTimeout(type, 500);
    });
}());

// ============================================
// HERO 3D PARTICLE SYSTEM
// ============================================
(function initHeroParticles() {
    // Skip on mobile — improves LCP & FID on small devices
    if (window.innerWidth <= 768) return;

    const canvas = document.getElementById('hero-particles-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let particles = [];
    let animId = null;
    let mouseX = 0;
    let mouseY = 0;

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    function build() {
        const count = Math.min(120, Math.floor(window.innerWidth / 12));
        particles = [];
        for (let i = 0; i < count; i++) {
            const r = Math.random() * 3 + 1.5;
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                radius: r,
                baseRadius: r,
                speedX: (Math.random() - 0.5) * 0.4,
                speedY: (Math.random() - 0.5) * 0.3,
                opacity: Math.random() * 0.4 + 0.2,
                pulse: Math.random() * 0.02 + 0.01,
                phase: Math.random() * Math.PI * 2
            });
        }
    }

    document.addEventListener('mousemove', function(e) {
        mouseX = e.clientX;
        mouseY = e.clientY;
    }, { passive: true });

    function tick() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const now = Date.now();

        particles.forEach(function(p) {
            p.x += p.speedX;
            p.y += p.speedY;

            if (p.x < -50) p.x = canvas.width + 50;
            if (p.x > canvas.width + 50) p.x = -50;
            if (p.y < -50) p.y = canvas.height + 50;
            if (p.y > canvas.height + 50) p.y = -50;

            // Repel from cursor
            const dx = p.x - mouseX;
            const dy = p.y - mouseY;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 100) {
                const angle = Math.atan2(dy, dx);
                const force = (100 - dist) / 100 * 1.5;
                p.x += Math.cos(angle) * force;
                p.y += Math.sin(angle) * force;
            }

            // Pulse
            const pulse = Math.sin(now * p.pulse + p.phase) * 0.3 + 0.7;
            const r = p.baseRadius * pulse;

            ctx.beginPath();
            ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(99,102,241,' + (p.opacity * pulse) + ')';
            ctx.fill();

            // Soft glow
            ctx.beginPath();
            ctx.arc(p.x, p.y, r * 1.5, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(99,102,241,' + (p.opacity * 0.2) + ')';
            ctx.fill();
        });

        // Connecting lines (O(n²) but capped at 120 particles)
        ctx.strokeStyle = 'rgba(99,102,241,0.1)';
        ctx.lineWidth = 0.8;
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                if (dx * dx + dy * dy < 14400) { // 120^2
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }

        animId = requestAnimationFrame(tick);
    }

    resize();
    build();
    setTimeout(function() { tick(); }, 100); // slight delay keeps loader crisp

    let resizeTimer;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function() {
            if (animId) cancelAnimationFrame(animId);
            resize();
            build();
            tick();
        }, 150);
    });
}());

// ============================================
// SLEEK STAT COUNTER (hero-stats-inline)
// ============================================
(function() {
    const target = document.querySelector('.hero-stats-inline');
    if (!target) return;

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (!entry.isIntersecting) return;
            observer.unobserve(entry.target);
            $(entry.target).find('.stat-number').each(function() {
                const $el = $(this);
                const goal = parseInt($el.data('count'));
                if (isNaN(goal) || $el.hasClass('counted')) return;
                $el.addClass('counted');
                $({ n: 0 }).animate({ n: goal }, {
                    duration: 2000,
                    easing: 'swing',
                    step: function() { $el.text(Math.floor(this.n)); },
                    complete: function() { $el.text(goal); }
                });
            });
        });
    }, { threshold: 0.3 });

    observer.observe(target);
}());

// ============================================
// SMART GUIDED CHATBOT
// ============================================

const chatFlow = {
    welcome: {
        message: "👋 Welcome! Please select an AI assistant to chat with:",
        type: 'model_selection',
        options: [
            { id: 'sales_ai', text: 'Sales AI — Get more clients', icon: 'fa-chart-line' },
            { id: 'ops_ai', text: 'Ops AI — Track shipments', icon: 'fa-ship' },
            { id: 'support_ai', text: 'Support AI — 24/7 help', icon: 'fa-headset' },
            { id: 'accounts_ai', text: 'Accounts AI — Payments', icon: 'fa-file-invoice-dollar' },
            { id: 'pricing_ai', text: 'Pricing AI — Smart quotes', icon: 'fa-tags' }
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
        message: "📦 **Ops AI** at your service! I automate:\n\n✅ Real-time shipment tracking\n✅ Port & customs alerts\n✅ ETD/ETA notifications\n✅ Multi-carrier updates\n\nWhat interests you?",
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
        message: "💰 **Accounts AI** here! I streamline:\n\n✅ Auto-invoicing\n✅ Payment reminders\n✅ Overdue follow-ups\n✅ Cash flow reports\n\nReduce delays by 60%!",
        aiModel: 'Accounts AI',
        options: [
            { id: 'accounts_invoicing', text: 'Auto-invoicing', icon: 'fa-question' },
            { id: 'pricing', text: 'View pricing', icon: 'fa-tag' },
            { id: 'book_demo', text: 'Book demo', icon: 'fa-calendar' }
        ]
    },
    pricing_ai: {
        message: "💲 **Pricing AI** — margin optimizer:\n\n✅ Dynamic quotes\n✅ Market rate analysis\n✅ Profit protection\n✅ Competitor intel\n\nGet 15% better margins!",
        aiModel: 'Pricing AI',
        options: [
            { id: 'pricing_quotes', text: 'How fast are quotes?', icon: 'fa-question' },
            { id: 'pricing', text: 'View pricing', icon: 'fa-tag' },
            { id: 'book_demo', text: 'Book demo', icon: 'fa-calendar' }
        ]
    },
    sales_lead_gen: {
        message: "I capture leads from:\n\n🌐 Website & chat\n📧 Email inquiries\n📱 WhatsApp\n📞 Calls\n📱 Social media\n\nInstant response — no 2-hour delays!",
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
        message: "I track 500+ carriers:\n\n🚢 Ocean (MSC, Maersk…)\n✈️ Air (Emirates, DHL…)\n🚛 Ground (FedEx, UPS…)\n📦 One dashboard\n\nUpdates every 15 minutes!",
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
        message: "💡 Our pricing:\n\n🚀 Starter: $299/mo (2 agents)\n⚡ Growth: $799/mo (All 5 agents) ⭐\n🏢 Enterprise: Custom\n\nAll plans: 7-day free trial!",
        options: [
            { id: 'growth_plan', text: 'Growth — $799/mo', icon: 'fa-bolt' },
            { id: 'starter_plan', text: 'Starter — $299/mo', icon: 'fa-rocket' },
            { id: 'book_demo', text: 'Free demo', icon: 'fa-calendar' }
        ]
    },
    growth_plan: {
        message: "⚡ **Growth Plan** includes:\n\n✅ All 5 AI agents\n✅ Unlimited chats\n✅ WhatsApp + Email + Web\n✅ Advanced analytics\n✅ API access\n\n**$799/month** — Start free trial!",
        options: [
            { id: 'book_demo', text: 'Start free trial', icon: 'fa-play' },
            { id: 'welcome', text: 'Chat with another AI', icon: 'fa-robot' }
        ]
    },
    starter_plan: {
        message: "🚀 **Starter Plan** includes:\n\n✅ Any 2 AI agents\n✅ 500 chats/month\n✅ Email & Web\n✅ Basic analytics\n\n**$299/month** — Perfect start!",
        options: [
            { id: 'book_demo', text: 'Start free trial', icon: 'fa-play' },
            { id: 'welcome', text: 'Compare plans', icon: 'fa-robot' }
        ]
    },
    accounts_invoicing: {
        message: "Auto-invoicing features:\n\n📄 PDF generation\n📧 Auto-email to clients\n⏰ Scheduled delivery\n💱 Multi-currency\n✓ ERP integration\n\nNo more manual invoicing!",
        options: [
            { id: 'pricing', text: 'View pricing', icon: 'fa-tag' },
            { id: 'book_demo', text: 'Book demo', icon: 'fa-calendar' }
        ]
    },
    pricing_quotes: {
        message: "Lightning fast quotes:\n\n⚡ Under 30 seconds\n📊 Real-time market rates\n🎯 98% accuracy\n💱 Multi-currency\n📧 Auto-email to clients\n\nNo more spreadsheet delays!",
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
    book_demo: {
        message: "🎯 Great! Share your details and our AI specialist will contact you within 24 hours!",
        action: 'showForm'
    }
};

// ── Chatbot State ─────────────────────────────────────────────────────────────
const chatbotState = {
    isOpen: false,
    currentStep: 'welcome',
    chatHistory: [],
    messageCount: 0,
    miniFormShown: false,
    userDetails: null,
    selectedAIModel: null
};

// ── Init ──────────────────────────────────────────────────────────────────────
function initChatbot() {
    const triggers = document.querySelectorAll('.trigger-chatbot');
    const closeBtn = document.getElementById('chatbot-close');
    const chatWindow = document.getElementById('chatbot-window');
    const toggleIcon = document.getElementById('chatbot-toggle');

    if (!chatWindow) return;

    function openChat() {
        chatbotState.isOpen = true;
        chatWindow.style.display = 'flex';
        setTimeout(function() { chatWindow.classList.add('open'); }, 10);
        if (toggleIcon) toggleIcon.classList.add('hidden');
        if (chatbotState.chatHistory.length === 0) {
            setTimeout(function() { displayBotMessage(chatFlow.welcome); }, 500);
        }
    }

    function closeChat() {
        chatbotState.isOpen = false;
        chatWindow.classList.remove('open');
        setTimeout(function() {
            if (!chatWindow.classList.contains('open')) chatWindow.style.display = 'none';
        }, 300);
        if (toggleIcon) toggleIcon.classList.remove('hidden');
    }

    triggers.forEach(function(btn) {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            openChat();
        });
    });

    if (closeBtn) {
        closeBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            closeChat();
        });
    }

    setupPhoneInputValidation();
    checkAutoOpen();
}

function checkAutoOpen() {
    if (localStorage.getItem('chatbot_visited')) return;
    setTimeout(function() {
        const win = document.getElementById('chatbot-window');
        const toggle = document.getElementById('chatbot-toggle');
        if (!win || !toggle) return;
        chatbotState.isOpen = true;
        win.style.display = 'flex';
        win.classList.add('open');
        toggle.classList.add('hidden');
        showQuickContactForm();
    }, 3000);
}

function setupPhoneInputValidation() {
    ['chatbotPhone', 'quickPhone', 'miniPhone'].forEach(function(id) {
        const el = document.getElementById(id);
        if (el) el.addEventListener('input', function() {
            this.value = this.value.replace(/\D/g, '').slice(0, 10);
        });
    });
}

// ── Quick contact form ────────────────────────────────────────────────────────
function showQuickContactForm() {
    const form = document.getElementById('quick-contact-form');
    const messages = document.getElementById('chatbot-messages');
    if (form) form.style.display = 'block';
    if (messages) messages.style.display = 'none';
}

function closeQuickForm() {
    const form = document.getElementById('quick-contact-form');
    const messages = document.getElementById('chatbot-messages');
    if (form) form.style.display = 'none';
    if (messages) messages.style.display = 'block';
    localStorage.setItem('chatbot_visited', 'true');
}
window.closeQuickForm = closeQuickForm;

function skipQuickForm() {
    closeQuickForm();
    setTimeout(function() { displayBotMessage(chatFlow.welcome); }, 300);
}
window.skipQuickForm = skipQuickForm;

// ── Mini form ─────────────────────────────────────────────────────────────────
function showMiniLeadForm() {
    const form = document.getElementById('mini-lead-form');
    if (form) {
        form.style.display = 'block';
        scrollToBottom();
    }
}

function closeMiniForm() {
    const form = document.getElementById('mini-lead-form');
    if (form) form.style.display = 'none';
    const current = chatFlow[chatbotState.currentStep];
    if (current && current.options) displayOptions(current.options);
}
window.closeMiniForm = closeMiniForm;

// ── Message rendering ─────────────────────────────────────────────────────────
function displayBotMessage(step) {
    const container = document.getElementById('chatbot-messages');
    if (!container) return;

    if (step.aiModel) chatbotState.selectedAIModel = step.aiModel;

    chatbotState.chatHistory.push({ type: 'bot', message: step.message });
    showTyping();

    setTimeout(function() {
        hideTyping();
        const div = document.createElement('div');
        div.className = 'chat-message bot';
        div.innerHTML =
            '<div class="message-avatar"><i class="fas fa-robot"></i></div>' +
            '<div class="message-content">' + formatMsg(step.message) +
            '<div class="message-time">' + timeNow() + '</div></div>';
        container.appendChild(div);
        scrollToBottom();

        if (step.options && step.options.length) displayOptions(step.options);
        if (step.action === 'showForm') setTimeout(showLeadForm, 500);
    }, 1000);
}

function displayUserMessage(text) {
    const container = document.getElementById('chatbot-messages');
    if (!container) return;
    chatbotState.chatHistory.push({ type: 'user', message: text });
    const div = document.createElement('div');
    div.className = 'chat-message user';
    div.innerHTML =
        '<div class="message-avatar"><i class="fas fa-user"></i></div>' +
        '<div class="message-content">' + text +
        '<div class="message-time">' + timeNow() + '</div></div>';
    container.appendChild(div);
    scrollToBottom();
}

function displayOptions(options) {
    const container = document.getElementById('chatbot-messages');
    if (!container) return;
    const wrap = document.createElement('div');
    wrap.className = 'chat-options';
    options.forEach(function(opt) {
        const btn = document.createElement('button');
        btn.className = 'chat-option-btn';
        btn.innerHTML = '<i class="fas ' + opt.icon + '"></i> ' + opt.text;
        btn.addEventListener('click', function() { handleOptionClick(opt.id, opt.text); });
        wrap.appendChild(btn);
    });
    container.appendChild(wrap);
    scrollToBottom();
}

function handleOptionClick(id, text) {
    document.querySelectorAll('.chat-option-btn').forEach(function(b) { b.disabled = true; });
    displayUserMessage(text);
    chatbotState.messageCount++;

    // Show mini form every 2nd message if not already shown
    if (chatbotState.messageCount % 2 === 0 && !chatbotState.miniFormShown && !chatbotState.userDetails) {
        setTimeout(showMiniLeadForm, 1000);
        return;
    }

    const next = chatFlow[id];
    if (next) {
        chatbotState.currentStep = id;
        setTimeout(function() { displayBotMessage(next); }, 800);
    }
}

// ── Lead form ─────────────────────────────────────────────────────────────────
function showLeadForm() {
    const form = document.getElementById('chatbot-form');
    if (form) {
        form.style.display = 'block';
        scrollToBottom();
    }
}

// ── Utilities ─────────────────────────────────────────────────────────────────
function formatMsg(msg) {
    return msg
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\n/g, '<br>');
}

function timeNow() {
    return new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
}

function showTyping() {
    const el = document.getElementById('chatbot-typing');
    if (el) {
        el.style.display = 'block';
        scrollToBottom();
    }
}

function hideTyping() {
    const el = document.getElementById('chatbot-typing');
    if (el) el.style.display = 'none';
}

function scrollToBottom() {
    const el = document.getElementById('chatbot-messages');
    if (el) el.scrollTop = el.scrollHeight;
}

function resetChatbot() {
    chatbotState.isOpen = false;
    chatbotState.currentStep = 'welcome';
    chatbotState.chatHistory = [];
    chatbotState.messageCount = 0;
    chatbotState.miniFormShown = false;

    const win = document.getElementById('chatbot-window');
    const tog = document.getElementById('chatbot-toggle');
    const msgs = document.getElementById('chatbot-messages');
    const form = document.getElementById('chatbot-form');
    const raw = document.getElementById('leadCaptureForm');

    if (win) win.classList.remove('open');
    if (tog) tog.classList.remove('hidden');
    if (msgs) msgs.innerHTML = '';
    if (form) form.style.display = 'none';
    if (raw) raw.reset();
}

// Success message shown after lead capture form submit
function showSuccessMessage() {
    const msgs = document.getElementById('chatbot-messages');
    const form = document.getElementById('chatbot-form');
    const nameEl = document.getElementById('chatbotName');

    if (form) form.style.display = 'none';

    const div = document.createElement('div');
    div.className = 'chat-success';
    div.innerHTML =
        '<i class="fas fa-check-circle"></i>' +
        '<h4>Thank You' + (nameEl ? ', ' + nameEl.value : '') + '!</h4>' +
        '<p>Our team will contact you within 24 hours.<br>Get ready to transform your freight operations! 🚀</p>';

    if (msgs) {
        msgs.appendChild(div);
        scrollToBottom();
    }
    setTimeout(resetChatbot, 5000);
}
window.showSuccessMessage = showSuccessMessage;