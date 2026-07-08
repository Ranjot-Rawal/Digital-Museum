// ============================================
// CHRONICLE NEXUS — Interactive Experience
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    initPreloader();
    initCustomCursor();
    initNavigation();
    initScrollReveal();
    initParticles();
    initStatsCounter();
    initTimelineProgress();
    initMapPins();
    initSmoothScroll();
});

// ============================================
// PRELOADER
// ============================================
function initPreloader() {
    const preloader = document.querySelector('.preloader');
    if (!preloader) return;

    setTimeout(() => {
        preloader.classList.add('hidden');
        setTimeout(() => {
            preloader.style.display = 'none';
        }, 800);
    }, 2500);
}

// ============================================
// CUSTOM CURSOR
// ============================================
function initCustomCursor() {
    const dot = document.querySelector('.cursor-dot');
    const outline = document.querySelector('.cursor-outline');

    if (!dot || !outline || window.matchMedia('(max-width: 768px)').matches) return;

    let mouseX = 0, mouseY = 0;
    let dotX = 0, dotY = 0;
    let outlineX = 0, outlineY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    function animateCursor() {
        dotX += (mouseX - dotX) * 0.2;
        dotY += (mouseY - dotY) * 0.2;
        outlineX += (mouseX - outlineX) * 0.1;
        outlineY += (mouseY - outlineY) * 0.1;

        dot.style.left = dotX + 'px';
        dot.style.top = dotY + 'px';
        outline.style.left = outlineX + 'px';
        outline.style.top = outlineY + 'px';

        requestAnimationFrame(animateCursor);
    }
    animateCursor();

    // Hover effects
    const hoverElements = document.querySelectorAll('a, button, .collection-card, .timeline-card, .nav-toggle');
    hoverElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            outline.style.width = '60px';
            outline.style.height = '60px';
            outline.style.borderColor = '#d4af37';
            outline.style.opacity = '0.8';
        });
        el.addEventListener('mouseleave', () => {
            outline.style.width = '36px';
            outline.style.height = '36px';
            outline.style.borderColor = '#d4af37';
            outline.style.opacity = '0.5';
        });
    });
}

// ============================================
// NAVIGATION
// ============================================
function initNavigation() {
    const nav = document.querySelector('.main-nav');
    const toggle = document.querySelector('.nav-toggle');
    const links = document.querySelector('.nav-links');
    const navLinks = document.querySelectorAll('.nav-link');

    // Scroll effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    });

    // Mobile toggle
    if (toggle) {
        toggle.addEventListener('click', () => {
            links.classList.toggle('active');
            toggle.classList.toggle('active');
        });
    }

    // Active link on scroll
    const sections = document.querySelectorAll('section[id]');
    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 200;
            if (scrollY >= sectionTop) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + current) {
                link.classList.add('active');
            }
        });
    });
}

// ============================================
// SCROLL REVEAL
// ============================================
function initScrollReveal() {
    const revealElements = document.querySelectorAll('[data-reveal]');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('revealed');
                }, index * 100);
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => observer.observe(el));
}

// ============================================
// PARTICLES
// ============================================
function initParticles() {
    const container = document.getElementById('particles');
    if (!container) return;

    const particleCount = 30;

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.cssText = `
            position: absolute;
            width: ${Math.random() * 3 + 1}px;
            height: ${Math.random() * 3 + 1}px;
            background: rgba(212, 175, 55, ${Math.random() * 0.5 + 0.1});
            border-radius: 50%;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            animation: float ${Math.random() * 10 + 10}s linear infinite;
            animation-delay: ${Math.random() * 5}s;
            pointer-events: none;
        `;
        container.appendChild(particle);
    }

    // Add keyframes dynamically
    const style = document.createElement('style');
    style.textContent = `
        @keyframes float {
            0%, 100% { transform: translateY(0) translateX(0); opacity: 0; }
            10% { opacity: 1; }
            90% { opacity: 1; }
            100% { transform: translateY(-100vh) translateX(${Math.random() * 100 - 50}px); opacity: 0; }
        }
    `;
    document.head.appendChild(style);
}

// ============================================
// STATS COUNTER
// ============================================
function initStatsCounter() {
    const statItems = document.querySelectorAll('.stat-item');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                const target = parseInt(entry.target.dataset.count);
                const numberEl = entry.target.querySelector('.stat-number');
                animateCounter(numberEl, target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    statItems.forEach(item => observer.observe(item));
}

function animateCounter(element, target) {
    let current = 0;
    const increment = target / 60;
    const duration = 2000;
    const stepTime = duration / 60;

    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        element.textContent = Math.floor(current);
    }, stepTime);
}

// ============================================
// TIMELINE PROGRESS
// ============================================
function initTimelineProgress() {
    const timelineSection = document.querySelector('.timeline-section');
    const progress = document.querySelector('.timeline-progress');
    const timelineItems = document.querySelectorAll('.timeline-item');

    if (!timelineSection || !progress) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                timelineItems.forEach((item, index) => {
                    setTimeout(() => {
                        item.classList.add('visible');
                    }, index * 200);
                });
            }
        });
    }, { threshold: 0.2 });

    observer.observe(timelineSection);

    window.addEventListener('scroll', () => {
        const rect = timelineSection.getBoundingClientRect();
        const sectionHeight = timelineSection.offsetHeight;
        const scrolled = Math.max(0, -rect.top + window.innerHeight * 0.3);
        const progressPercent = Math.min(100, (scrolled / sectionHeight) * 100);

        if (progress) {
            progress.style.height = progressPercent + '%';
        }
    });
}

// ============================================
// MAP PINS
// ============================================
function initMapPins() {
    const pins = document.querySelectorAll('.map-pin');
    const tooltip = document.querySelector('.map-tooltip');

    if (!tooltip) return;

    pins.forEach(pin => {
        pin.addEventListener('mouseenter', (e) => {
            const info = pin.dataset.info;
            tooltip.textContent = info;
            tooltip.classList.add('visible');
        });

        pin.addEventListener('mousemove', (e) => {
            tooltip.style.left = (e.clientX + 15) + 'px';
            tooltip.style.top = (e.clientY - 40) + 'px';
        });

        pin.addEventListener('mouseleave', () => {
            tooltip.classList.remove('visible');
        });
    });
}

// ============================================
// SMOOTH SCROLL
// ============================================
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offset = 80;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - offset;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ============================================
// PARALLAX EFFECT (subtle)
// ============================================
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const parallaxElements = document.querySelectorAll('.hero-bg-layer.layer-1');

    parallaxElements.forEach(el => {
        el.style.transform = `translateY(${scrolled * 0.3}px) scale(1.1)`;
    });
});