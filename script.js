// ==================== INITIALIZATION ==================== 
document.addEventListener('DOMContentLoaded', function() {
    initializeParticles();
    initializeScrollAnimations();
    initializeFormHandler();
    initializeGlitchEffect();
});

// ==================== PARTICLES BACKGROUND ==================== 
function initializeParticles() {
    const canvas = document.createElement('canvas');
    canvas.id = 'particle-canvas';
    canvas.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: -1;
    `;
    document.body.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];
    const particleCount = 50;

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.vx = (Math.random() - 0.5) * 1;
            this.vy = (Math.random() - 0.5) * 1;
            this.radius = Math.random() * 1.5;
            this.opacity = Math.random() * 0.5 + 0.2;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
            if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
        }

        draw() {
            ctx.fillStyle = `rgba(0, 255, 0, ${this.opacity})`;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }

    function drawConnections() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 150) {
                    const opacity = 0.2 * (1 - distance / 150);
                    ctx.strokeStyle = `rgba(0, 255, 0, ${opacity})`;
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });

        drawConnections();
        requestAnimationFrame(animate);
    }

    animate();

    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
}

// ==================== SCROLL ANIMATIONS ==================== 
function initializeScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'fadeIn 0.6s ease-in-out';
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.project-card').forEach(card => {
        observer.observe(card);
    });

    // Parallax effect on scroll
    window.addEventListener('scroll', () => {
        const scrollPosition = window.scrollY;
        const hero = document.querySelector('.hero');
        if (hero) {
            hero.style.backgroundPosition = `0 ${scrollPosition * 0.5}px`;
        }
    });
}

// ==================== FORM HANDLER ==================== 
function initializeFormHandler() {
    const form = document.getElementById('contactForm');
    
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;

            // Validation
            if (name.trim() === '' || email.trim() === '' || message.trim() === '') {
                showNotification('Tous les champs sont requis !', 'error');
                return;
            }

            if (!isValidEmail(email)) {
                showNotification('Veuillez entrer un email valide', 'error');
                return;
            }

            // Simulate form submission
            form.style.opacity = '0.5';
            const submitBtn = form.querySelector('.retro-btn');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'ENVOI EN COURS...';
            submitBtn.disabled = true;

            setTimeout(() => {
                showNotification('Message reçu ! Merci de rejoindre NYX', 'success');
                form.reset();
                form.style.opacity = '1';
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }, 1500);
        });
    }
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 2rem;
        border: 2px solid ${type === 'success' ? '#00ff00' : '#ff0000'};
        background: ${type === 'success' ? 'rgba(0, 255, 0, 0.1)' : 'rgba(255, 0, 0, 0.1)'};
        color: ${type === 'success' ? '#00ff00' : '#ff0000'};
        font-family: 'Courier New', monospace;
        z-index: 10000;
        box-shadow: 0 0 20px ${type === 'success' ? 'rgba(0, 255, 0, 0.5)' : 'rgba(255, 0, 0, 0.5)'};
        animation: slideIn 0.5s ease;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOut 0.5s ease';
        setTimeout(() => notification.remove(), 500);
    }, 3000);
}

// ==================== GLITCH EFFECT ==================== 
function initializeGlitchEffect() {
    // Random glitch effect for text
    const glitchElements = document.querySelectorAll('.neon-text, .section-title');
    
    setInterval(() => {
        glitchElements.forEach(el => {
            if (Math.random() < 0.05) { // 5% chance every interval
                el.style.textShadow = `
                    2px 2px #ff00ff,
                    -2px -2px #00ffff,
                    0 0 20px rgba(255, 0, 0, 0.5)
                `;
                
                setTimeout(() => {
                    el.style.textShadow = '';
                }, 100);
            }
        });
    }, 200);

    // Add some digital rain effect occasionally
    if (Math.random() < 0.3) {
        createDigitalRain();
    }
}

function createDigitalRain() {
    const rainInterval = setInterval(() => {
        if (Math.random() < 0.02) {
            const character = String.fromCharCode(33 + Math.floor(Math.random() * 93));
            const rainDrop = document.createElement('div');
            rainDrop.textContent = character;
            rainDrop.style.cssText = `
                position: fixed;
                left: ${Math.random() * window.innerWidth}px;
                top: -20px;
                color: rgba(0, 255, 0, 0.5);
                font-size: 1.5rem;
                font-family: 'Courier New', monospace;
                pointer-events: none;
                z-index: 1;
                text-shadow: 0 0 10px rgba(0, 255, 0, 0.5);
                animation: fall ${Math.random() * 3 + 2}s linear;
            `;
            document.body.appendChild(rainDrop);

            setTimeout(() => rainDrop.remove(), 5000);
        }
    }, 100);

    // Stop after 10 seconds
    setTimeout(() => clearInterval(rainInterval), 10000);
}

// Add CSS animation for falling text
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }

    @keyframes fall {
        to {
            transform: translateY(${window.innerHeight}px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// ==================== SMOOTH SCROLL ACTIVE LINK ==================== 
function highlightActiveLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a');

    window.addEventListener('scroll', () => {
        let current = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (scrollY >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.style.color = 'var(--color-primary)';
            link.style.textShadow = 'none';
            if (link.getAttribute('href').slice(1) === current) {
                link.style.color = 'var(--color-accent)';
                link.style.textShadow = '0 0 10px var(--color-accent)';
            }
        });
    });
}

highlightActiveLink();

// ==================== SURPRISE BUTTON ==================== 
function initializeSurpriseButton() {
    const surpriseBtn = document.getElementById('surpriseBtn');
    
    if (surpriseBtn) {
        surpriseBtn.addEventListener('click', function() {
            if (window.location.pathname.includes('foss.html')) {
                showNotification('Vous êtes déjà dans la liberté', 'success');
                return;
            }
            
            window.location.href = 'foss.html';
        });

        surpriseBtn.addEventListener('mouseenter', function() {
            this.title = 'Découvre le monde du logiciel libre';
        });
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    initializeSurpriseButton();
});

// ==================== KEYBOARD SHORTCUTS ==================== 
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        const notification = document.querySelector('[style*="position: fixed"]');
        if (notification) {
            notification.remove();
        }
    }

    // Easter egg: Konami code-ish shortcut
    if (e.key === '~') {
        console.log('%c[ BIENVENUE DANS LA MATRICE ]', 'color: #00ff00; font-size: 20px; text-shadow: 0 0 10px #00ff00;');
        console.log('%cNYX - La rébellion continue...', 'color: #ff00ff; font-size: 14px;');
    }

    // Easter egg: 'F' for FOSS
    if (e.key.toLowerCase() === 'f' && e.ctrlKey) {
        e.preventDefault();
        const btn = document.getElementById('surpriseBtn');
        if (btn) btn.click();
    }
});

// ==================== LOADER SIMULATION ==================== 
window.addEventListener('load', () => {
    // Could add a loading screen here
    console.log('NYX HACKATHON SYSTEM - FULLY INITIALIZED');
});
