window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    if (!preloader) return;
    if (sessionStorage.getItem('nox_visited')) {
        preloader.classList.add('hide');
    } else {
        sessionStorage.setItem('nox_visited', '1');
        setTimeout(() => preloader.classList.add('hide'), 2000);
    }
});

const canvas = document.getElementById('particles');
const ctx = canvas.getContext('2d');
let particles = [];
let mouse = { x: -500, y: -500 };

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
        this.speedX = (Math.random() - 0.5) * 0.4;
        this.speedY = (Math.random() - 0.5) * 0.4;
        this.opacity = Math.random() * 0.5 + 0.1;
    }
    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        const dx = this.x - mouse.x;
        const dy = this.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 150) {
            this.x += dx / dist * 1.5;
            this.y += dy / dist * 1.5;
        }
        if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) this.reset();
    }
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 26, 26, ${this.opacity})`;
        ctx.fill();
    }
}

for (let i = 0; i < 80; i++) particles.push(new Particle());

function drawLines() {
    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 140) {
                ctx.beginPath();
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.strokeStyle = `rgba(255, 26, 26, ${0.06 * (1 - dist / 140)})`;
                ctx.lineWidth = 0.5;
                ctx.stroke();
            }
        }
    }
}

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => { p.update(); p.draw(); });
    drawLines();
    requestAnimationFrame(animateParticles);
}
animateParticles();

const cursorFollow = document.getElementById('cursorFollow');
document.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    cursorFollow.style.left = e.clientX + 'px';
    cursorFollow.style.top = e.clientY + 'px';
});

const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
    const scrollPos = window.scrollY + 250;
    document.querySelectorAll('.section, .hero, .stats-section').forEach(sec => {
        const id = sec.getAttribute('id');
        if (!id) return;
        if (scrollPos >= sec.offsetTop && scrollPos < sec.offsetTop + sec.offsetHeight) {
            document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
            const active = document.querySelector(`.nav-link[href="#${id}"]`);
            if (active) active.classList.add('active');
        }
    });
});

const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');
if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('open');
        navLinks.classList.toggle('open');
    });
    navLinks.querySelectorAll('.nav-link').forEach(l => l.addEventListener('click', () => {
        hamburger.classList.remove('open');
        navLinks.classList.remove('open');
    }));
}

const animEls = document.querySelectorAll('.anim');
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const delay = entry.target.dataset.delay || 0;
            setTimeout(() => entry.target.classList.add('show'), parseInt(delay));
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
animEls.forEach(el => observer.observe(el));

const statEls = document.querySelectorAll('.stat-val[data-count]');
const statObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const target = parseInt(entry.target.dataset.count);
            let current = 0;
            const step = target / 50;
            const timer = setInterval(() => {
                current += step;
                if (current >= target) { current = target; clearInterval(timer); }
                entry.target.textContent = Math.floor(current);
            }, 30);
            statObs.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });
statEls.forEach(el => statObs.observe(el));

document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
        e.preventDefault();
        const t = document.querySelector(a.getAttribute('href'));
        if (t) t.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
});

document.querySelectorAll('.s-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const r = card.getBoundingClientRect();
        card.style.setProperty('--mx', ((e.clientX - r.left) / r.width * 100) + '%');
        card.style.setProperty('--my', ((e.clientY - r.top) / r.height * 100) + '%');
    });
});

document.querySelectorAll('.s-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        card.style.transform = `translateY(-6px) perspective(800px) rotateX(${-y * 8}deg) rotateY(${x * 8}deg)`;
    });
    card.addEventListener('mouseleave', () => {
        card.style.transform = '';
    });
});

const logoShowcase = document.querySelector('.logo-showcase');
if (logoShowcase) {
    window.addEventListener('scroll', () => {
        const rate = window.scrollY * 0.25;
        logoShowcase.style.transform = `translateY(${rate}px)`;
    });
}

const codeEl = document.querySelector('.code-content code');
if (codeEl) {
    const html = codeEl.innerHTML;
    const codeObs = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                codeEl.innerHTML = '';
                let i = 0, inTag = false, buf = '';
                function type() {
                    if (i >= html.length) return;
                    const c = html[i];
                    if (c === '<') inTag = true;
                    if (inTag) {
                        buf += c;
                        if (c === '>') { inTag = false; codeEl.innerHTML += buf; buf = ''; }
                        i++; type();
                    } else {
                        codeEl.innerHTML += c;
                        i++;
                        setTimeout(type, 12);
                    }
                }
                type();
                codeObs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });
    codeObs.observe(codeEl);
}

const backToTop = document.getElementById('backToTop');
if (backToTop) {
    window.addEventListener('scroll', () => {
        backToTop.classList.toggle('visible', window.scrollY > 600);
    });
    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// ===== FAQ ACCORDION =====
document.querySelectorAll('.faq-q').forEach(question => {
    question.addEventListener('click', () => {
        const item = question.parentElement;
        const isOpen = item.classList.contains('open');
        
        // Close all other items
        document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
        
        // Toggle current item
        if (!isOpen) item.classList.add('open');
    });
});
