// Mobile Menu Toggle
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const navLinks = document.querySelector('.nav-links');

if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        mobileMenuBtn.classList.toggle('active');
    });
}

// Smooth Scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Intersection Observer for Animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all cards
document.querySelectorAll('.testimonial-card, .feature-card, .product-card').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(card);
});

// Navbar Scroll Effect
let lastScroll = 0;
const nav = document.querySelector('.nav');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 100) {
        nav.style.background = 'rgba(10, 10, 15, 0.98)';
        nav.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.3)';
    } else {
        nav.style.background = 'rgba(10, 10, 15, 0.95)';
        nav.style.boxShadow = 'none';
    }

    lastScroll = currentScroll;
});

// Add to Cart Animation (only for buttons, not links)
document.querySelectorAll('.btn-product').forEach(btn => {
    btn.addEventListener('click', function (e) {
        // Only prevent default and show animation for actual buttons, not links
        if (this.tagName === 'BUTTON' || !this.getAttribute('href')) {
            e.preventDefault();

            // Create ripple effect
            const ripple = document.createElement('span');
            ripple.style.position = 'absolute';
            ripple.style.width = '20px';
            ripple.style.height = '20px';
            ripple.style.background = 'rgba(255, 255, 255, 0.5)';
            ripple.style.borderRadius = '50%';
            ripple.style.transform = 'scale(0)';
            ripple.style.animation = 'ripple 0.6s ease-out';

            const rect = this.getBoundingClientRect();
            ripple.style.left = (e.clientX - rect.left) + 'px';
            ripple.style.top = (e.clientY - rect.top) + 'px';

            this.style.position = 'relative';
            this.appendChild(ripple);

            setTimeout(() => ripple.remove(), 600);

            // Change button text temporarily
            const originalText = this.textContent;
            this.textContent = 'Added! ✓';
            this.style.background = 'linear-gradient(135deg, #00F0A0 0%, #00D9FF 100%)';

            setTimeout(() => {
                this.textContent = originalText;
                this.style.background = '';
            }, 2000);
        }
        // If it's a link with href, let it navigate normally (don't prevent default)
    });
});

// Add ripple animation
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// CTA Button Actions
document.querySelectorAll('.btn-primary, .btn-secondary').forEach(btn => {
    btn.addEventListener('click', function (e) {
        if (!this.getAttribute('href') || this.getAttribute('href') === '#') {
            e.preventDefault();
            // Scroll to shop section
            const shopSection = document.querySelector('#shop');
            if (shopSection) {
                shopSection.scrollIntoView({ behavior: 'smooth' });
            }
        }
    });
});

// Parallax effect for hero background
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const heroBg = document.querySelector('.hero-bg');
    if (heroBg) {
        heroBg.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
});

// Dynamic gradient animation
const heroImageCard = document.querySelector('.hero-image-card');
if (heroImageCard) {
    let hue = 0;
    setInterval(() => {
        hue = (hue + 1) % 360;
        heroImageCard.style.setProperty('--dynamic-hue', hue);
    }, 50);
}

console.log('🔥 DIXX Co. - Built Different. Feels Different. 🔥');
