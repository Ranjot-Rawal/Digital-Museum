// ============================================
// CHRONICLE NEXUS - UPGRADED MUSEUM
// ============================================

// ─── PARTICLE SYSTEM ───
const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');
let particles = [];
let mouseX = 0, mouseY = 0;

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

class Particle {
    constructor() {
        this.reset();
    }

    reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 0.5;
        this.speedX = (Math.random() - 0.5) * 0.3;
        this.speedY = (Math.random() - 0.5) * 0.3;
        this.opacity = Math.random() * 0.5 + 0.2;
        this.fadeDir = Math.random() > 0.5 ? 0.005 : -0.005;
        this.color = Math.random() > 0.5 ? '212, 175, 55' : '180, 140, 30';
    }

    update() {
        // Mouse attraction
        const dx = mouseX - this.x;
        const dy = mouseY - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 200) {
            this.x += dx * 0.001;
            this.y += dy * 0.001;
        }

        this.x += this.speedX;
        this.y += this.speedY;
        this.opacity += this.fadeDir;

        if (this.opacity >= 0.7 || this.opacity <= 0.1) this.fadeDir = -this.fadeDir;
        if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
            this.reset();
        }
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${this.color}, ${this.opacity})`;
        ctx.shadowBlur = 8;
        ctx.shadowColor = `rgba(${this.color}, 0.3)`;
        ctx.fill();
        ctx.shadowBlur = 0;
    }
}

// Create particles
for (let i = 0; i < 100; i++) {
    particles.push(new Particle());
}

// Mouse tracking
document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

// Draw connecting lines between nearby particles
function drawConnections() {
    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < 100) {
                ctx.beginPath();
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.strokeStyle = `rgba(212, 175, 55, ${0.1 * (1 - dist / 100)})`;
                ctx.lineWidth = 0.5;
                ctx.stroke();
            }
        }
    }
}

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => { p.update(); p.draw(); });
    drawConnections();
    requestAnimationFrame(animateParticles);
}
animateParticles();

// ─── THEME TOGGLE ───
const themeToggle = document.getElementById('themeToggle');
const body = document.body;
const icon = themeToggle.querySelector('i');

// Check saved theme
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'light') {
    body.classList.add('light-mode');
    icon.classList.remove('fa-moon');
    icon.classList.add('fa-sun');
}

themeToggle.addEventListener('click', () => {
    body.classList.toggle('light-mode');
    const isLight = body.classList.contains('light-mode');

    if (isLight) {
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
        localStorage.setItem('theme', 'light');
    } else {
        icon.classList.remove('fa-sun');
        icon.classList.add('fa-moon');
        localStorage.setItem('theme', 'dark');
    }
});

// ─── SEARCH FUNCTIONALITY ───
const searchBtn = document.getElementById('searchBtn');
const searchOverlay = document.getElementById('searchOverlay');
const searchClose = document.getElementById('searchClose');
const searchInput = document.getElementById('searchInput');
const searchResults = document.getElementById('searchResults');

// Museum content database
const museumData = [
    { title: 'Indus Valley Civilization', category: 'Ancient India', desc: 'One of the worlds earliest urban civilizations', url: 'CONTENT/indus-valley.html' },
    { title: 'Maurya Empire', category: 'Ancient India', desc: 'Founded by Chandragupta Maurya', url: 'CONTENT/maurya-empire.html' },
    { title: 'Mughal Empire', category: 'Ancient India', desc: 'One of Indias greatest imperial dynasties', url: 'CONTENT/mughal-empire.html' },
    { title: 'Mahatma Gandhi', category: 'Freedom Fighters', desc: 'Leader of Indias Freedom Movement', url: 'CONTENT/mahatma-gandhi.html' },
    { title: 'Bhagat Singh', category: 'Freedom Fighters', desc: 'The Fearless Freedom Fighter', url: 'CONTENT/bhagat-singh.html' },
    { title: 'Subhas Chandra Bose', category: 'Freedom Fighters', desc: 'Architect of the Indian National Army', url: 'CONTENT/subhas-chandra-bose.html' },
    { title: 'Apollo 11', category: 'Space Museum', desc: 'First Moon Landing Mission', url: 'CONTENT/apollo-11.html' },
    { title: 'James Webb Telescope', category: 'Space Museum', desc: 'Largest Telescope ever built', url: 'CONTENT/james-webb.html' },
    { title: 'Mars Missions', category: 'Space Museum', desc: 'Exploring the Red Planet', url: 'CONTENT/mars.html' },
    { title: 'International Space Station', category: 'Space Museum', desc: 'Humanitys outpost in space', url: 'CONTENT/iss.html' },
    { title: 'Ancient Pottery', category: 'Gallery', desc: 'Artifacts of Human Creativity', url: 'CONTENT/ancient-pottery.html' },
    { title: 'Historic Coins', category: 'Gallery', desc: 'Coins that Witnessed History', url: 'CONTENT/historic-coins.html' },
    { title: 'Famous Paintings', category: 'Gallery', desc: 'Stories of Color and Canvas', url: 'CONTENT/famous-paintings.html' },
    { title: 'Taj Mahal', category: 'Ancient India', desc: 'Built by Mughal Emperor Shah Jahan', url: '#' },
    { title: 'Red Fort', category: 'Ancient India', desc: 'UNESCO World Heritage Site', url: '#' },
    { title: 'Chandrayaan-3', category: 'Space Museum', desc: 'ISROs Moon mission 2023', url: '#' },
    { title: 'Mangalyaan', category: 'Space Museum', desc: 'Indias first Mars mission', url: '#' },
    { title: 'Rani Lakshmibai', category: 'Freedom Fighters', desc: 'Queen of Jhansi', url: '#' },
];

searchBtn.addEventListener('click', () => {
    searchOverlay.classList.add('active');
    searchInput.focus();
});

searchClose.addEventListener('click', () => {
    searchOverlay.classList.remove('active');
    searchInput.value = '';
    searchResults.innerHTML = '';
});

searchInput.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase().trim();
    searchResults.innerHTML = '';

    if (query.length < 2) return;

    const results = museumData.filter(item => 
        item.title.toLowerCase().includes(query) || 
        item.category.toLowerCase().includes(query) ||
        item.desc.toLowerCase().includes(query)
    );

    results.forEach(item => {
        const div = document.createElement('div');
        div.className = 'search-result-item';
        div.innerHTML = `
            <h4>${item.title}</h4>
            <p>${item.category} — ${item.desc}</p>
        `;
        div.addEventListener('click', () => {
            window.location.href = item.url;
        });
        searchResults.appendChild(div);
    });

    if (results.length === 0) {
        searchResults.innerHTML = '<div class="search-result-item"><p style="color: var(--text-muted); text-align: center;">No results found</p></div>';
    }
});

// Close search on Escape
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        searchOverlay.classList.remove('active');
    }
});

// ─── PROGRESS BAR ───
const progressBar = document.getElementById('progressBar');
const progressText = document.getElementById('progressText');

function updateProgress() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = (scrollTop / docHeight) * 100;
    progressBar.style.width = progress + '%';
    progressText.textContent = Math.round(progress) + '% Explored';
}

window.addEventListener('scroll', updateProgress);

// ─── STATS COUNTER ANIMATION ───
const statNumbers = document.querySelectorAll('.stat-num');
let statsAnimated = false;

function animateStats() {
    if (statsAnimated) return;

    const statsSection = document.querySelector('.stats-bar');
    const rect = statsSection.getBoundingClientRect();

    if (rect.top < window.innerHeight && rect.bottom > 0) {
        statsAnimated = true;

        statNumbers.forEach(num => {
            const target = parseInt(num.dataset.target);
            const duration = 2000;
            const increment = target / (duration / 16);
            let current = 0;

            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    current = target;
                    clearInterval(timer);
                }
                num.textContent = Math.floor(current);
            }, 16);
        });
    }
}

window.addEventListener('scroll', animateStats);

// ─── ACHIEVEMENT SYSTEM ───
const achievements = {
    visitor: { id: 'ach-visitor', name: 'First Visit', condition: () => true },
    explorer: { id: 'ach-explorer', name: 'Explorer', condition: () => getVisitedCount() >= 5 },
    scholar: { id: 'ach-scholar', name: 'Scholar', condition: () => getReadCount() >= 10 },
    historian: { id: 'ach-historian', name: 'Historian', condition: () => getVisitedCount() >= 15 },
};

function getVisitedCount() {
    const visited = JSON.parse(localStorage.getItem('visitedExhibits') || '[]');
    return visited.length;
}

function getReadCount() {
    const read = JSON.parse(localStorage.getItem('readDescriptions') || '[]');
    return read.length;
}

function checkAchievements() {
    Object.values(achievements).forEach(ach => {
        const card = document.getElementById(ach.id);
        if (card && ach.condition()) {
            card.classList.remove('locked');
            card.classList.add('unlocked');
        }
    });
}

// Mark first visit
if (!localStorage.getItem('firstVisit')) {
    localStorage.setItem('firstVisit', 'true');
    localStorage.setItem('visitedExhibits', JSON.stringify(['home']));
}

checkAchievements();

// ─── MUSIC BUTTON (placeholder) ───
const musicBtn = document.getElementById('musicBtn');
let musicPlaying = false;

musicBtn.addEventListener('click', () => {
    musicPlaying = !musicPlaying;
    musicBtn.innerHTML = musicPlaying ? '<i class="fas fa-volume-up"></i>' : '<i class="fas fa-music"></i>';
    // Note: Actual audio implementation would go here
    // For now, just toggle the icon
});

// ─── NAVBAR SCROLL EFFECT ───
const navbar = document.querySelector('nav');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.style.padding = '10px 5%';
        navbar.style.background = 'rgba(10, 10, 10, 0.95)';
    } else {
        navbar.style.padding = '15px 5%';
        navbar.style.background = 'rgba(10, 10, 10, 0.9)';
    }
});

// ─── SMOOTH SCROLL ───
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// ─── SCROLL REVEAL ───
const revealElements = document.querySelectorAll('.category-card, .timeline-item, .achievement-card, .stat-item');

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, { threshold: 0.1 });

revealElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'all 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
    revealObserver.observe(el);
});

// ─── TIMELINE INTERACTION ───
document.querySelectorAll('.timeline-item').forEach(item => {
    item.addEventListener('click', () => {
        document.querySelectorAll('.timeline-item').forEach(i => i.classList.remove('active'));
        item.classList.add('active');
    });
});

console.log('Chronicle Nexus loaded successfully!');