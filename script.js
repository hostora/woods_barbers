// Performance optimized JavaScript for Woods Barbers website
(function () {
    'use strict';

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Throttle function for performance
    function throttle(func, limit) {
        let inThrottle;
        return function () {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        }
    }

    // Debounce function
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // DOM elements
    const navbar = document.getElementById('navbar');
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');


    // Navbar scroll effect
    function handleNavbarScroll() {
        if (!navbar) return;

        const scrolled = window.pageYOffset > 50;
        navbar.classList.toggle('scrolled', scrolled);
    }

    // Parallax effect for hero section
    function handleParallax() {
        if (prefersReducedMotion) return;

        const scrolled = window.pageYOffset;
        const parallaxLayers = document.querySelectorAll('.hero-parallax-layer');

        parallaxLayers.forEach((layer, index) => {
            const speed = (index + 1) * 0.5;
            const yPos = -(scrolled * speed);
            layer.style.transform = `translate3d(0, ${yPos}px, 0)`;
        });
    }

    // Intersection Observer for reveal animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                // Add staggered delay for multiple elements
                const delay = Array.from(entry.target.parentNode.children).indexOf(entry.target) * 100;
                entry.target.style.transitionDelay = `${delay}ms`;
                revealObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Initialize reveal animations
    function initRevealAnimations() {
        const revealElements = document.querySelectorAll('.reveal-up');
        revealElements.forEach(el => {
            revealObserver.observe(el);
        });
    }

    // 3D Tilt effect for cards (disabled on touch devices and reduced motion)
    function init3DTilt() {
        if (prefersReducedMotion || 'ontouchstart' in window) return;

        const tiltElements = document.querySelectorAll('[data-tilt]');

        tiltElements.forEach(element => {
            element.addEventListener('mouseenter', () => {
                element.style.transition = 'transform 0.1s ease-out';
            });

            element.addEventListener('mousemove', (e) => {
                const rect = element.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                const centerX = rect.width / 2;
                const centerY = rect.height / 2;

                const rotateX = (y - centerY) / centerY * -10;
                const rotateY = (x - centerX) / centerX * 10;

                element.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
            });

            element.addEventListener('mouseleave', () => {
                element.style.transition = 'transform 0.3s ease';
                element.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)';
            });
        });
    }

    // Mobile menu toggle
    function initMobileMenu() {
        if (!mobileMenuToggle || !navLinks) return;

        mobileMenuToggle.addEventListener('click', () => {
            const isExpanded = mobileMenuToggle.getAttribute('aria-expanded') === 'true';
            mobileMenuToggle.setAttribute('aria-expanded', !isExpanded);
            navLinks.classList.toggle('mobile-open');

            // Animate hamburger menu
            const spans = mobileMenuToggle.querySelectorAll('span');
            spans.forEach((span, index) => {
                if (!isExpanded) {
                    if (index === 0) span.style.transform = 'rotate(45deg) translate(5px, 5px)';
                    if (index === 1) span.style.opacity = '0';
                    if (index === 2) span.style.transform = 'rotate(-45deg) translate(7px, -6px)';
                } else {
                    span.style.transform = '';
                    span.style.opacity = '';
                }
            });
        });

        // Close mobile menu when clicking on links
        const mobileNavLinks = navLinks.querySelectorAll('.nav-link');
        mobileNavLinks.forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('mobile-open');
                mobileMenuToggle.setAttribute('aria-expanded', 'false');
                const spans = mobileMenuToggle.querySelectorAll('span');
                spans.forEach(span => {
                    span.style.transform = '';
                    span.style.opacity = '';
                });
            });
        });
    }



    // Smooth scrolling for anchor links
    function initSmoothScrolling() {
        const anchorLinks = document.querySelectorAll('a[href^="#"]');

        anchorLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const targetId = link.getAttribute('href');
                const targetElement = document.querySelector(targetId);

                if (targetElement) {
                    e.preventDefault();
                    const offsetTop = targetElement.offsetTop - 80; // Account for fixed navbar

                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    // CTA button micro-interaction
    function initCTAInteractions() {
        const ctaButtons = document.querySelectorAll('.cta-button, .btn-primary');

        ctaButtons.forEach(button => {
            button.addEventListener('mouseenter', () => {
                if (!prefersReducedMotion) {
                    button.style.transform = 'translateY(-2px) scale(1.02)';
                }
            });

            button.addEventListener('mouseleave', () => {
                button.style.transform = '';
            });

            button.addEventListener('mousedown', () => {
                if (!prefersReducedMotion) {
                    button.style.transform = 'translateY(0) scale(0.98)';
                }
            });

            button.addEventListener('mouseup', () => {
                if (!prefersReducedMotion) {
                    button.style.transform = 'translateY(-2px) scale(1.02)';
                }
            });
        });
    }

    // Performance monitoring
    function initPerformanceOptimizations() {
        // Preload critical resources
        const preloadLink = document.createElement('link');
        preloadLink.rel = 'preload';
        preloadLink.as = 'image';
        preloadLink.href = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMSIgaGVpZ2h0PSIxIiB2aWV3Qm94PSIwIDAgMSAxIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9InRyYW5zcGFyZW50Ii8+PC9zdmc+';
        document.head.appendChild(preloadLink);

        // Optimize images loading
        const images = document.querySelectorAll('img');
        images.forEach(img => {
            img.loading = 'lazy';
            img.decoding = 'async';
        });
    }

    // Scroll event handler with RAF optimization
    let ticking = false;
    function handleScroll() {
        if (!ticking) {
            requestAnimationFrame(() => {
                handleNavbarScroll();
                handleParallax();
                ticking = false;
            });
            ticking = true;
        }
    }

    // Initialize all functionality
    function init() {
        // Wait for DOM to be fully loaded
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', init);
            return;
        }

        // Initialize all features
        initRevealAnimations();
        init3DTilt();
        initMobileMenu();

        initSmoothScrolling();
        initCTAInteractions();
        initPerformanceOptimizations();

        // Add scroll listener with throttling
        window.addEventListener('scroll', throttle(handleScroll, 16), { passive: true });

        // Handle resize events
        window.addEventListener('resize', debounce(() => {
            // Recalculate any size-dependent features
            handleNavbarScroll();
        }, 250));

        // Initial calls
        handleNavbarScroll();

        // Add loaded class to body for CSS transitions
        document.body.classList.add('loaded');
    }

    // Start initialization
    init();

    // Handle page visibility changes for performance
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            // Pause animations when page is not visible
            document.body.classList.add('page-hidden');
        } else {
            document.body.classList.remove('page-hidden');
        }
    });

    // Error handling
    window.addEventListener('error', (e) => {
        console.warn('Woods Barbers website error:', e.error);
    });

})();
