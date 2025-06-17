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
                // Adjusted offset for better scrolling to sections with titles
                const offsetPosition = elementPosition - headerOffset - 40; // Increased padding
                
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
            if (e.target === overlay) { // Only close if clicking the overlay itself, not the image
                overlay.classList.remove('active');
            }
        });
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                overlay.classList.remove('active');
            }
        });
    }

    // Advanced Typewriter Effect for Hero Title
    const typewriterElement = document.getElementById('typewriter');
    const typewriterCursor = document.getElementById('typewriter-cursor');
    const phrases = ["Anudip Saha", "ML Engineer", "Web Developer", "Innovator"];
    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 150;
    let deletingSpeed = 80;
    let pauseTime = 1500;

    function typeWriter() {
        const currentPhrase = phrases[phraseIndex];

        if (isDeleting) {
            typewriterElement.textContent = currentPhrase.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typewriterElement.textContent = currentPhrase.substring(0, charIndex + 1);
            charIndex++;
        }

        let currentSpeed = isDeleting ? deletingSpeed : typingSpeed;

        if (!isDeleting && charIndex === currentPhrase.length) {
            currentSpeed = pauseTime;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
            currentSpeed = 500; // Pause before typing next phrase
        }

        setTimeout(typeWriter, currentSpeed);
    }

    if (typewriterElement) {
        typeWriter();
    }


    // Navbar shrink and style change on scroll
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) { // Adjust scroll threshold as needed
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Parallax effect for hero background (Re-evaluate if background image is now on section directly)
    // If you apply background to .hero-section directly, this might not be needed or needs adjustment.
    // const heroBackground = document.querySelector('.hero-background-parallax');
    // if (heroBackground) {
    //     window.addEventListener('scroll', function() {
    //         const scrollPosition = window.pageYOffset;
    //         heroBackground.style.transform = 'translateY(' + scrollPosition * 0.5 + 'px)'; // Adjust speed
    //     });
    // }

    // Card Tilt Effect on Hover (using JavaScript for precise control)
    // This function will apply a subtle 3D tilt effect to elements with the 'tilt-card' class.
    function initTiltCards() {
        const cards = document.querySelectorAll('.tilt-card');

        cards.forEach(card => {
            const tiltMax = 15; // Max tilt in degrees
            const rect = card.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;

            card.addEventListener('mousemove', (e) => {
                const mouseX = e.clientX - centerX;
                const mouseY = e.clientY - centerY;

                const rotateX = (mouseY / rect.height) * tiltMax;
                const rotateY = -(mouseX / rect.width) * tiltMax;

                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.03)`;
                card.style.boxShadow = '0 15px 30px rgba(0, 0, 0, 0.6)'; // Enhanced shadow on hover
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)';
                card.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.4)'; // Reset shadow to normal
            });
        });
    }
    // Call tilt function after DOM is loaded
    initTiltCards();


    // Scroll-Triggered Reveal Animations
    const observerOptions = {
        root: null, // viewport
        rootMargin: '0px',
        threshold: 0.1 // 10% of element visible
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                if (entry.target.classList.contains('section-heading')) {
                    const innerSpan = entry.target.querySelector('.section-heading-inner');
                    if (innerSpan) {
                         // Apply animation directly
                        innerSpan.style.transform = 'translateY(0)';
                        innerSpan.style.opacity = '1';
                        innerSpan.style.transitionDelay = '0.1s'; // Slight delay for heading
                    }
                } else {
                    entry.target.classList.add('is-visible');
                }
                observer.unobserve(entry.target); // Unobserve once visible
            }
        });
    }, observerOptions);

    document.querySelectorAll('.animate-on-scroll').forEach(el => {
        observer.observe(el);
    });

    document.querySelectorAll('.section-heading').forEach(el => {
        observer.observe(el);
    });


    // Active navigation link highlighting on scroll
    const sections = document.querySelectorAll('section');
    const navLi = document.querySelectorAll('.nav-links li a');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            // Adjust to account for fixed navbar
            if (pageYOffset >= sectionTop - navbar.offsetHeight - 50) {
                current = section.getAttribute('id');
            }
        });

        navLi.forEach(a => {
            a.classList.remove('active');
            if (a.getAttribute('href').includes(current)) {
                a.classList.add('active');
            }
        });
    });


    // Dark Mode Toggle
    const toggleBtn = document.getElementById('darkModeToggle');
    if (toggleBtn) {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const savedMode = localStorage.getItem('theme');

      // Set initial theme based on localStorage or system preference
      if (savedMode === 'dark' || (!savedMode && prefersDark)) {
        document.body.classList.add('dark-mode');
        toggleBtn.textContent = '☀️'; // Sun icon for dark mode
      } else {
        // If no saved mode or prefers light, ensure light mode styles are active or default
        // For Netflix UI, we assume dark mode is default, so light mode will revert to this.
        document.body.classList.remove('dark-mode');
        toggleBtn.textContent = '🌙'; // Moon icon for light mode
      }

      toggleBtn.addEventListener('click', function() {
        document.body.classList.toggle('dark-mode');
        const isDark = document.body.classList.contains('dark-mode');
        toggleBtn.textContent = isDark ? '☀️' : '🌙';
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
      });
    }

    // Existing blog post related functions - assuming they are external or for future use
    // If you are not using a blog, these can be removed or left as stubs.
    function renderPosts() { /* ... existing code ... */ }
    function reactToPost(postId, emoji) { /* ... existing code ... */ }
    window.toggleComments = function(postId) { /* ... existing code ... */ }
    window.submitComment = function(e, postId) { /* ... existing code ... */ }
    // Ensure these elements are hidden if the blog functionality isn't active
    const uploadForm = document.querySelector('.upload-form');
    const adminUploadForm = document.getElementById('adminUploadForm');
    const blogManagerCard = document.getElementById('blogManagerCard');
    const adminLoginForm = document.getElementById('adminLoginForm');

    if (adminUploadForm) adminUploadForm.style.display = 'none';
    if (blogManagerCard) blogManagerCard.style.display = 'none';
    // You might also hide uploadForm and adminLoginForm if they are for blog management
    // if (uploadForm) uploadForm.style.display = 'none';
    // if (adminLoginForm) adminLoginForm.style.display = 'none';
});
