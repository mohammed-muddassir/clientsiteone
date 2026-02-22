// Moon Graphics — Interactions & Animations

document.addEventListener('DOMContentLoaded', () => {

    // ---- Theme Toggle ----
    const themeToggle = document.getElementById('themeToggle');
    const root = document.documentElement;

    // Check for saved theme preference or default to dark
    const savedTheme = localStorage.getItem('mg-theme') || 'dark';
    root.setAttribute('data-theme', savedTheme);

    themeToggle.addEventListener('click', () => {
        const current = root.getAttribute('data-theme');
        const next = current === 'dark' ? 'light' : 'dark';
        root.setAttribute('data-theme', next);
        localStorage.setItem('mg-theme', next);
    });

    // ---- Navbar scroll effect ----
    const navbar = document.querySelector('.navbar');
    const handleNavScroll = () => {
        navbar.classList.toggle('scrolled', window.scrollY > 50);
    };
    window.addEventListener('scroll', handleNavScroll);
    handleNavScroll();

    // ---- Mobile menu toggle ----
    const hamburger = document.querySelector('.nav-hamburger');
    const navLinks = document.querySelector('.nav-links');

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('open');
        document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
    });

    // Close mobile menu when a link is clicked
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinks.classList.remove('open');
            document.body.style.overflow = '';
        });
    });

    // ---- Active nav link on scroll ----
    const sections = document.querySelectorAll('.section[id]');
    const navItems = document.querySelectorAll('.nav-links a[href^="#"]');

    const highlightNav = () => {
        const scrollY = window.scrollY + 120;
        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');

            if (scrollY >= top && scrollY < top + height) {
                navItems.forEach(a => a.classList.remove('active'));
                const activeLink = document.querySelector(`.nav-links a[href="#${id}"]`);
                if (activeLink) activeLink.classList.add('active');
            }
        });
    };
    window.addEventListener('scroll', highlightNav);

    // ---- Scroll Reveal (Intersection Observer) ----
    const revealElements = document.querySelectorAll('.reveal');

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));

    // ---- Animated counter for stats ----
    const statNumbers = document.querySelectorAll('.stat-number[data-target]');
    let statsCounted = false;

    const animateCounters = () => {
        statNumbers.forEach(stat => {
            const target = parseInt(stat.getAttribute('data-target'));
            const suffix = stat.getAttribute('data-suffix') || '';
            const duration = 2000;
            const startTime = performance.now();

            const updateCounter = (currentTime) => {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const ease = 1 - Math.pow(1 - progress, 3);
                const current = Math.round(target * ease);
                stat.textContent = current + suffix;
                if (progress < 1) {
                    requestAnimationFrame(updateCounter);
                }
            };
            requestAnimationFrame(updateCounter);
        });
    };

    const statsSection = document.querySelector('.hero-stats');
    if (statsSection) {
        const statsObserver = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && !statsCounted) {
                statsCounted = true;
                animateCounters();
                statsObserver.unobserve(statsSection);
            }
        }, { threshold: 0.5 });
        statsObserver.observe(statsSection);
    }

    // ---- Contact form interactions ----
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const btn = contactForm.querySelector('.btn-primary');
            const originalText = btn.innerHTML;

            const inputs = contactForm.querySelectorAll('input[required], textarea[required]');
            let valid = true;
            inputs.forEach(input => {
                if (!input.value.trim()) {
                    valid = false;
                    input.style.borderColor = '#E63946';
                    setTimeout(() => { input.style.borderColor = ''; }, 2000);
                }
            });

            if (!valid) return;

            btn.innerHTML = '✓ Message Sent!';
            btn.style.background = 'linear-gradient(135deg, #10b981, #059669)';

            setTimeout(() => {
                btn.innerHTML = originalText;
                btn.style.background = '';
                contactForm.reset();
            }, 3000);
        });
    }

    // ---- Smooth scroll for anchor links ----
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const targetEl = document.querySelector(targetId);
            if (targetEl) {
                const offset = navbar.offsetHeight + 20;
                const top = targetEl.getBoundingClientRect().top + window.scrollY - offset;
                window.scrollTo({ top, behavior: 'smooth' });
            }
        });
    });

    // ---- Parallax effect on hero orbs ----
    const orbs = document.querySelectorAll('.hero-orb');
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        orbs.forEach((orb, i) => {
            const speed = i === 0 ? 0.3 : 0.2;
            orb.style.transform = `translateY(${scrollY * speed}px)`;
        });
    });

});
