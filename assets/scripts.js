document.addEventListener('DOMContentLoaded', function() {
    // Smooth Scroll for Navigation Links
    const navLinks = document.querySelectorAll('nav a[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerOffset = document.getElementById('navbar').offsetHeight;
                const elementPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
                const offsetPosition = elementPosition - headerOffset - 20;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Instagram-like profile logo zoom
    const logo = document.getElementById('profileLogo');
    const overlay = document.getElementById('profileOverlay');
    if (logo && overlay) {
        logo.addEventListener('click', function(e) {
            e.preventDefault();
            overlay.classList.add('active');
        });
        overlay.addEventListener('click', function(e) {
            if (e.target === overlay) {
                overlay.classList.remove('active');
            }
        });
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                overlay.classList.remove('active');
            }
        });
    }

    // Advanced Typewriter Animation
    const phrases = [
        "Hi, I'm Anudip Saha!",
        "Aspiring ML Engineer",
        "Crafting intelligent systems.",
        "Building seamless web experiences."
    ];
    const typeTarget = document.getElementById("typewriter");
    const cursor = document.getElementById("typewriter-cursor");
    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    const typingSpeed = 70;
    const deletingSpeed = 40;
    const pauseBeforeDelete = 1500;
    const pauseBeforeType = 500;

    function typeWriterEffect() {
        if (!typeTarget || !cursor) return;

        const currentPhrase = phrases[phraseIndex];

        if (isDeleting) {
            typeTarget.textContent = currentPhrase.substring(0, charIndex - 1);
            charIndex--;
            if (charIndex === 0) {
                isDeleting = false;
                phraseIndex = (phraseIndex + 1) % phrases.length;
                setTimeout(typeWriterEffect, pauseBeforeType);
            } else {
                setTimeout(typeWriterEffect, deletingSpeed);
            }
        } else {
            typeTarget.textContent = currentPhrase.substring(0, charIndex + 1);
            charIndex++;
            if (charIndex === currentPhrase.length) {
                isDeleting = true;
                if (cursor) cursor.style.animation = "blink 1s steps(1) infinite";
                setTimeout(typeWriterEffect, pauseBeforeDelete);
            } else {
                if (cursor) cursor.style.animation = "none";
                setTimeout(typeWriterEffect, typingSpeed);
            }
        }
    }
    if (typeTarget) typeWriterEffect();

    // Navbar Shrink/Style Change on Scroll
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // --- NEW: Parallax Effect for Hero Background ---
    const heroSection = document.getElementById('hero-section');
    const heroBgParallax = document.querySelector('.hero-background-parallax'); // Make sure this class exists on an inner element in HTML
    if (heroSection && heroBgParallax) {
        window.addEventListener('scroll', () => {
            const scrollY = window.pageYOffset;
            // Adjust this multiplier for more or less parallax effect
            heroBgParallax.style.transform = `translateY(${scrollY * 0.3}px)`;
        });
    }

    // --- NEW: Card Tilt Effect on Hover ---
    const tiltCards = document.querySelectorAll('.tilt-card');

    tiltCards.forEach(card => {
        const rect = card.getBoundingClientRect(); // Get initial position
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        card.addEventListener('mousemove', (e) => {
            const x = e.clientX - centerX;
            const y = e.clientY - centerY;

            // Adjust these multipliers for more or less tilt
            const rotateX = (y / rect.height) * -10; // Max 10 degrees tilt
            const rotateY = (x / rect.width) * 10;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)';
        });
    });


    // --- MODIFIED: Scroll-Triggered Section Animations & Active Nav Link ---
    // Now also includes dynamic heading reveal
    const sections = document.querySelectorAll('section');
    // Also target elements with 'animate-on-scroll' class
    const animateElements = document.querySelectorAll('.animate-on-scroll');
    const sectionHeadings = document.querySelectorAll('.section-heading-inner'); // Target the span inside h2/h3

    const options = {
        root: null, // viewport
        rootMargin: '0px',
        threshold: 0.2 // Trigger when 20% of the section is visible
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Apply general animation to section itself (if needed)
                entry.target.classList.add('is-visible');

                // Animate section headings
                const headingInner = entry.target.querySelector('.section-heading-inner');
                if (headingInner) {
                    headingInner.classList.add('is-visible'); // Trigger specific heading animation
                }

                // Animate individual elements within the section
                entry.target.querySelectorAll('.animate-on-scroll').forEach(el => {
                    el.classList.add('is-visible');
                });

                // For active navigation link
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${entry.target.id}`) {
                        link.classList.add('active');
                    }
                });
            } else {
                // Optional: remove class if section goes out of view, for repeated animations
                // entry.target.classList.remove('is-visible');
                // const headingInner = entry.target.querySelector('.section-heading-inner');
                // if (headingInner) headingInner.classList.remove('is-visible');
                // entry.target.querySelectorAll('.animate-on-scroll').forEach(el => {
                //     el.classList.remove('is-visible');
                // });
            }
        });
    }, options);

    sections.forEach(section => {
        observer.observe(section);
    });

    // Dark Mode Toggle
    const toggleBtn = document.getElementById('darkModeToggle');
    if (toggleBtn) {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const savedMode = localStorage.getItem('theme');
      if (savedMode === 'dark' || (!savedMode && prefersDark)) {
        document.body.classList.add('dark-mode');
        toggleBtn.textContent = '☀️';
      } else {
        toggleBtn.textContent = '🌙';
      }
      toggleBtn.addEventListener('click', function() {
        document.body.classList.toggle('dark-mode');
        const isDark = document.body.classList.contains('dark-mode');
        toggleBtn.textContent = isDark ? '☀️' : '🌙';
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
      });
    }

    // Existing blog post related functions - assuming they are external or for future use
    // If you are not using a blog, these can be removed.
    function renderPosts() { /* ... existing code ... */ }
    function reactToPost(postId, emoji) { /* ... existing code ... */ }
    window.toggleComments = function(postId) { /* ... existing code ... */ }
    window.submitComment = function(e, postId) { /* ... existing code ... */ }
    const uploadForm = document.querySelector('.upload-form'); /* ... existing code ... */
    const adminUploadForm = document.getElementById('adminUploadForm'); /* ... existing code ... */
    const blogManagerCard = document.getElementById('blogManagerCard'); /* ... existing code ... */
    const adminLoginForm = document.getElementById('adminLoginForm'); /* ... existing code ... */
    if (adminUploadForm) adminUploadForm.style.display = 'none';
    if (blogManagerCard) blogManagerCard.style.display = 'none';
});
