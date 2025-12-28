
// Custom Cursor
document.addEventListener('DOMContentLoaded', () => {
  // Only create custom cursor on non-touch devices
  if (!isTouchDevice()) {
    const cursor = document.createElement('div');
    cursor.className = 'cursor';
    document.body.appendChild(cursor);

    // Mouse move event with optimized performance
    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;

    // Track mouse position
    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    // Smooth cursor animation using requestAnimationFrame
    function animateCursor() {
      // Add easing for smoother movement
      cursorX += (mouseX - cursorX) * 0.15;
      cursorY += (mouseY - cursorY) * 0.15;

      cursor.style.left = cursorX + 'px';
      cursor.style.top = cursorY + 'px';

      requestAnimationFrame(animateCursor);
    }

    // Start the animation
    animateCursor();

    // Hover effect for interactive elements
    const interactiveElements = document.querySelectorAll('a, button, .btn, .skill-tag, .project-card, input, textarea');

    interactiveElements.forEach(element => {
      element.addEventListener('mouseenter', () => {
        cursor.classList.add('hover');
      });

      element.addEventListener('mouseleave', () => {
        cursor.classList.remove('hover');
      });
    });

    // Hide cursor when leaving window
    document.addEventListener('mouseleave', () => {
      cursor.style.opacity = '0';
    });

    document.addEventListener('mouseenter', () => {
      cursor.style.opacity = '1';
    });
  }
});

// Touch device detection
function isTouchDevice() {
  return ('ontouchstart' in window) ||
    (navigator.maxTouchPoints > 0) ||
    (navigator.msMaxTouchPoints > 0);
}

// Add touch-device class to body if touch device is detected
if (isTouchDevice()) {
  document.body.classList.add('touch-device');
}


// Mobile Navigation
const hamburger = document.querySelector('.hamburger');
const mobileNav = document.querySelector('.mobile-nav');
const mobileOverlay = document.querySelector('.mobile-nav-overlay');
const closeMenu = document.querySelector('.close-menu');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  mobileNav.classList.add('active');
  mobileOverlay.classList.add('active');
  document.body.style.overflow = 'hidden';
});

closeMenu.addEventListener('click', () => {
  hamburger.classList.remove('active');
  mobileNav.classList.remove('active');
  mobileOverlay.classList.remove('active');
  document.body.style.overflow = '';
});

mobileOverlay.addEventListener('click', () => {
  hamburger.classList.remove('active');
  mobileNav.classList.remove('active');
  mobileOverlay.classList.remove('active');
  document.body.style.overflow = '';
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();

    // Close mobile menu if open
    if (mobileNav.classList.contains('active')) {
      hamburger.classList.remove('active');
      mobileNav.classList.remove('active');
      mobileOverlay.classList.remove('active');
      document.body.style.overflow = '';
    }

    const targetId = this.getAttribute('href');
    const targetElement = document.querySelector(targetId);

    if (targetElement) {
      window.scrollTo({
        top: targetElement.offsetTop - 80,
        behavior: 'smooth'
      });
    }
  });
});

// Contact form functionality
document.getElementById('contactForm').addEventListener('submit', function (e) {
  e.preventDefault();

  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const message = document.getElementById('message').value;

  // Create email link with pre-filled content
  const mailtoLink = `mailto:omar.aalsharani@gmail.com?subject=Portfolio Contact: ${encodeURIComponent(name)}&body=${encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`)}`;

  // Open the email client
  window.location.href = mailtoLink;

  // Show notification
  const notification = document.getElementById('notification');
  notification.classList.add('show');

  // Hide notification after 3 seconds
  setTimeout(() => {
    notification.classList.remove('show');
  }, 3000);

  // Reset form
  this.reset();
});

// Add hover effect to skill tags
const skillTags = document.querySelectorAll('.skill-tag');
skillTags.forEach(tag => {
  tag.addEventListener('mouseenter', () => {
    tag.style.transform = 'translateY(-3px)';
  });

  tag.addEventListener('mouseleave', () => {
    tag.style.transform = '';
  });
});

// Add observer for section animations
const sections = document.querySelectorAll("section");
const sectionOptions = { threshold: 0.1 };

const sectionObserver = new IntersectionObserver((entries, obs) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible-section");
      obs.unobserve(entry.target);
    }
  });
}, sectionOptions);

sections.forEach(section => {
  section.classList.add("hidden-section");
  sectionObserver.observe(section);
});

// Add observer for underline animations
const underlines = document.querySelectorAll(".section-underline");
const underlineOptions = { threshold: 0.5 };

const underlineObserver = new IntersectionObserver((entries, obs) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("animate");
      obs.unobserve(entry.target);
    }
  });
}, underlineOptions);

underlines.forEach(underline => {
  underlineObserver.observe(underline);
});

// Add scroll-to-top for Personal Portfolio Website View Project button
const portfolioBtn = document.getElementById('portfolioViewProjectBtn');
if (portfolioBtn) {
  portfolioBtn.addEventListener('click', function (e) {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// ===== GSAP Full-Screen Project Showcase =====
(function initProjectShowcase() {
  const showcase = document.querySelector('.projects-showcase');
  const panels = document.querySelectorAll('.project-panel');
  const progressDots = document.querySelectorAll('.progress-dot');
  const progressContainer = document.getElementById('showcaseProgress');
  const scrollHint = document.getElementById('scrollHint');

  if (!showcase || panels.length === 0) return;

  const totalPanels = panels.length;
  let currentIndex = 0;

  // Calculate section boundaries
  function updatePanelVisibility() {
    const showcaseRect = showcase.getBoundingClientRect();
    const showcaseTop = showcaseRect.top;
    const showcaseHeight = showcaseRect.height;
    const viewportHeight = window.innerHeight;

    // Check if showcase is in view
    const isInView = showcaseTop < viewportHeight && (showcaseTop + showcaseHeight) > 0;

    if (isInView) {
      // Show progress and scroll hint
      progressContainer.classList.add('visible');

      // Calculate which panel should be active based on scroll position
      const scrollProgress = Math.max(0, -showcaseTop) / (showcaseHeight - viewportHeight);
      const panelIndex = Math.min(
        Math.floor(scrollProgress * totalPanels),
        totalPanels - 1
      );

      // Hide scroll hint after first panel
      if (panelIndex > 0) {
        scrollHint.classList.remove('visible');
      } else {
        scrollHint.classList.add('visible');
      }

      // Update active panel if changed
      if (panelIndex !== currentIndex && panelIndex >= 0 && panelIndex < totalPanels) {
        setActivePanel(panelIndex);
      }
    } else {
      progressContainer.classList.remove('visible');
      scrollHint.classList.remove('visible');
    }
  }

  function setActivePanel(index) {
    // Remove active from all panels
    panels.forEach((panel, i) => {
      if (i === index) {
        panel.classList.add('active');
      } else {
        panel.classList.remove('active');
      }
    });

    // Update progress dots
    progressDots.forEach((dot, i) => {
      if (i === index) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });

    currentIndex = index;
  }

  // Click handler for progress dots
  progressDots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      const showcaseRect = showcase.getBoundingClientRect();
      const showcaseTop = window.pageYOffset + showcaseRect.top;
      const showcaseScrollHeight = showcase.offsetHeight - window.innerHeight;
      const targetScroll = showcaseTop + (index / (totalPanels - 1)) * showcaseScrollHeight;

      window.scrollTo({
        top: targetScroll,
        behavior: 'smooth'
      });
    });
  });

  // Throttled scroll handler
  let ticking = false;
  function onScroll() {
    if (!ticking) {
      requestAnimationFrame(() => {
        updatePanelVisibility();
        ticking = false;
      });
      ticking = true;
    }
  }

  // Initialize
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', updatePanelVisibility);

  // Initial check
  updatePanelVisibility();

  // Set first panel as active initially
  setActivePanel(0);
})();
