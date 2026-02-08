// ===== GSAP INITIALIZATION =====
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

// ===== CONFIGURATION =====
const config = {
  ease: "power3.out",
  duration: 1.2,
  stagger: 0.15
};

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function isTouchDevice() {
  return ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
}

// ===== CUSTOM CURSOR =====
if (!isTouchDevice() && !prefersReducedMotion) {
  const cursor = document.createElement('div');
  cursor.className = 'cursor';
  document.body.appendChild(cursor);

  let mouseX = 0, mouseY = 0;
  let cursorX = 0, cursorY = 0;
  const speed = 0.15;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  gsap.ticker.add(() => {
    cursorX += (mouseX - cursorX) * speed;
    cursorY += (mouseY - cursorY) * speed;
    cursor.style.left = cursorX + 'px';
    cursor.style.top = cursorY + 'px';
  });

  const interactiveElements = document.querySelectorAll(
    'a, button, .btn-primary, .btn-outline, .project-tile, .exp-card, .bento-card, .contact-row, .interest-item, .nav-link, input, textarea'
  );

  interactiveElements.forEach(el => {
    el.addEventListener('mouseenter', () => {
      gsap.to(cursor, { scale: 1.5, duration: 0.3, ease: "back.out(1.7)" });
      cursor.classList.add('hover');
    });
    el.addEventListener('mouseleave', () => {
      gsap.to(cursor, { scale: 1, duration: 0.3, ease: "power2.out" });
      cursor.classList.remove('hover');
    });

    // Magnetic effect
    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      gsap.to(el, { x: x * 0.08, y: y * 0.08, duration: 0.4, ease: "power2.out" });
    });
    el.addEventListener('mouseleave', () => {
      gsap.to(el, { x: 0, y: 0, duration: 0.5, ease: "elastic.out(1, 0.5)" });
    });
  });

  document.addEventListener('mouseleave', () => gsap.to(cursor, { opacity: 0, duration: 0.2 }));
  document.addEventListener('mouseenter', () => gsap.to(cursor, { opacity: 1, duration: 0.2 }));
}

if (isTouchDevice()) {
  document.body.classList.add('touch-device');
}

// ===== NAV SCROLL EFFECT =====
function initNavScroll() {
  const nav = document.querySelector('.nav-bar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  }, { passive: true });
}

// ===== MOBILE NAV =====
function initMobileNav() {
  const hamburger = document.getElementById('navHamburger');
  const mobileNav = document.getElementById('mobileNav');
  const overlay = document.getElementById('mobileOverlay');
  const closeBtn = document.getElementById('mobileNavClose');

  function open() {
    hamburger.classList.add('active');
    mobileNav.classList.add('active');
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';

    if (!prefersReducedMotion) {
      const links = mobileNav.querySelectorAll('.mobile-nav-links a');
      gsap.from(links, { opacity: 0, x: -20, stagger: 0.08, duration: 0.4, ease: "power2.out" });
    }
  }

  function close() {
    hamburger.classList.remove('active');
    mobileNav.classList.remove('active');
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  hamburger.addEventListener('click', open);
  closeBtn.addEventListener('click', close);
  overlay.addEventListener('click', close);

  // Close on link click
  mobileNav.querySelectorAll('a').forEach(a => a.addEventListener('click', close));
}

// ===== HERO ANIMATIONS =====
function initHero() {
  if (prefersReducedMotion) return;

  const tl = gsap.timeline({ defaults: { ease: config.ease } });

  tl.from('.hero-greeting', { opacity: 0, y: 20, duration: 0.6 })
    .from('.hero-name-heading', { opacity: 0, y: 40, duration: 0.8 }, '-=0.3')
    .from('.hero-role', { opacity: 0, y: 20, duration: 0.6 }, '-=0.4')
    .from('.hero-ctas', { opacity: 0, y: 20, duration: 0.6 }, '-=0.3')
    .from('.terminal-card', {
      opacity: 0, scale: 0.9, y: 30,
      duration: 0.8, ease: "back.out(1.4)"
    }, '-=0.5');

  // Terminal lines typing in
  const lines = document.querySelectorAll('.terminal-line');
  lines.forEach((line, i) => {
    tl.to(line, { opacity: 1, duration: 0.15 }, `-=${i === 0 ? 0 : 0.05}`)
      .from(line, { x: -10, duration: 0.3, ease: "power2.out" }, '<');
  });

  // Scroll hint
  gsap.from('[data-scroll-hint]', { opacity: 0, y: -10, duration: 0.6, delay: 2.5 });
}

// ===== SECTION HEADINGS =====
function initSectionHeadings() {
  document.querySelectorAll('[data-heading]').forEach(heading => {
    if (prefersReducedMotion) return;

    const line = heading.querySelector('.label-line');
    gsap.from(heading.children, {
      scrollTrigger: { trigger: heading, start: "top 85%", toggleActions: "play none none none" },
      opacity: 0, x: -20, stagger: 0.1, duration: 0.6, ease: config.ease
    });
    if (line) {
      gsap.from(line, {
        scrollTrigger: { trigger: heading, start: "top 85%", toggleActions: "play none none none" },
        scaleX: 0, transformOrigin: "left center", duration: 0.8, delay: 0.3, ease: "power2.out"
      });
    }
  });
}

// ===== BENTO GRID =====
function initBentoGrid() {
  if (prefersReducedMotion) return;

  const cards = document.querySelectorAll('[data-bento-card]');
  cards.forEach((card, i) => {
    gsap.from(card, {
      scrollTrigger: { trigger: card, start: "top 88%", toggleActions: "play none none none" },
      opacity: 0, y: 50, scale: 0.95,
      duration: 0.7, delay: i * 0.08,
      ease: "back.out(1.2)"
    });

    // 3D tilt on desktop
    if (!isTouchDevice()) {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        gsap.to(card, {
          rotationY: x * 8, rotationX: -y * 8,
          duration: 0.4, ease: "power2.out",
          transformPerspective: 800
        });
      });
      card.addEventListener('mouseleave', () => {
        gsap.to(card, {
          rotationX: 0, rotationY: 0,
          duration: 0.5, ease: "elastic.out(1, 0.5)"
        });
      });
    }
  });

  // Counter animation
  document.querySelectorAll('[data-count]').forEach(el => {
    const target = parseInt(el.getAttribute('data-count'));
    gsap.to(el, {
      scrollTrigger: { trigger: el, start: "top 85%", toggleActions: "play none none none" },
      textContent: target,
      duration: 1.5,
      snap: { textContent: 1 },
      ease: "power2.out"
    });
  });
}

// ===== EXPERIENCE HORIZONTAL SCROLL =====
function initExperienceScroll() {
  const track = document.querySelector('[data-exp-track]');
  const wrapper = document.querySelector('.experience-scroll-wrapper');
  if (!track || !wrapper) return;

  // GSAP-powered drag scroll
  if (!prefersReducedMotion) {
    const cards = document.querySelectorAll('[data-exp-card]');
    cards.forEach((card, i) => {
      gsap.from(card, {
        scrollTrigger: { trigger: wrapper, start: "top 80%", toggleActions: "play none none none" },
        opacity: 0, x: 60, rotation: 3,
        duration: 0.7, delay: i * 0.12,
        ease: "back.out(1.4)"
      });
    });
  }

  // Mouse drag to scroll
  let isDown = false, startX, scrollLeft;
  wrapper.addEventListener('mousedown', (e) => {
    isDown = true;
    wrapper.style.cursor = 'grabbing';
    startX = e.pageX - wrapper.offsetLeft;
    scrollLeft = wrapper.scrollLeft;
  });
  wrapper.addEventListener('mouseleave', () => { isDown = false; wrapper.style.cursor = ''; });
  wrapper.addEventListener('mouseup', () => { isDown = false; wrapper.style.cursor = ''; });
  wrapper.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - wrapper.offsetLeft;
    const walk = (x - startX) * 2;
    wrapper.scrollLeft = scrollLeft - walk;
  });
}

// ===== PROJECTS GRID =====
function initProjectsGrid() {
  if (prefersReducedMotion) return;

  const tiles = document.querySelectorAll('[data-project]');
  tiles.forEach((tile, i) => {
    gsap.from(tile, {
      scrollTrigger: { trigger: tile, start: "top 88%", toggleActions: "play none none none" },
      opacity: 0, y: 60, scale: 0.95,
      duration: 0.7, delay: i * 0.08,
      ease: "back.out(1.2)"
    });
  });
}

// ===== CONTACT =====
function initContact() {
  if (prefersReducedMotion) return;

  gsap.from('[data-contact-statement]', {
    scrollTrigger: { trigger: '[data-contact-statement]', start: "top 80%", toggleActions: "play none none none" },
    opacity: 0, y: 40, duration: 0.8, ease: config.ease
  });

  const rows = document.querySelectorAll('.contact-row');
  gsap.from(rows, {
    scrollTrigger: { trigger: '[data-contact-grid]', start: "top 80%", toggleActions: "play none none none" },
    opacity: 0, x: -30, stagger: 0.1, duration: 0.6, ease: config.ease
  });

  const formEls = document.querySelectorAll('.contact-form input, .contact-form textarea, .contact-form button');
  gsap.from(formEls, {
    scrollTrigger: { trigger: '.contact-form', start: "top 85%", toggleActions: "play none none none" },
    opacity: 0, y: 20, stagger: 0.08, duration: 0.5, delay: 0.2, ease: config.ease
  });

  // Focus glow
  document.querySelectorAll('.contact-form input, .contact-form textarea').forEach(input => {
    input.addEventListener('focus', () => {
      gsap.to(input, { scale: 1.02, boxShadow: "0 0 20px rgba(0,187,119,0.15)", duration: 0.3 });
    });
    input.addEventListener('blur', () => {
      gsap.to(input, { scale: 1, boxShadow: "none", duration: 0.3 });
    });
  });
}

// ===== SMOOTH SCROLLING =====
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      if (targetId === '#') {
        gsap.to(window, { scrollTo: 0, duration: 1.2, ease: "power2.inOut" });
        return;
      }
      const target = document.querySelector(targetId);
      if (target) {
        gsap.to(window, {
          scrollTo: { y: target.offsetTop - 80, autoKill: false },
          duration: 1, ease: "power2.inOut"
        });
      }
    });
  });
}

// ===== CONTACT FORM =====
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;

    const mailtoLink = `mailto:omar.aalsharani@gmail.com?subject=Portfolio Contact: ${encodeURIComponent(name)}&body=${encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`)}`;
    window.location.href = mailtoLink;

    const notification = document.getElementById('notification');
    if (!prefersReducedMotion) {
      gsap.fromTo(notification,
        { opacity: 0, y: 20, scale: 0.8 },
        {
          opacity: 1, y: 0, scale: 1,
          duration: 0.5, ease: "back.out(1.7)",
          onComplete: () => {
            gsap.to(notification, {
              opacity: 0, y: 20,
              delay: 2.5, duration: 0.3, ease: "power2.in"
            });
          }
        }
      );
    } else {
      notification.style.opacity = '1';
      setTimeout(() => { notification.style.opacity = '0'; }, 3000);
    }

    this.reset();
  });
}

// ===== PORTFOLIO TILE =====
function initPortfolioTile() {
  const tile = document.getElementById('portfolioTile');
  if (tile) {
    tile.addEventListener('click', (e) => {
      e.preventDefault();
      gsap.to(window, { scrollTo: 0, duration: 1.5, ease: "power2.inOut" });
    });
  }
}

// ===== MARQUEE PAUSE ON HOVER =====
function initMarquee() {
  const marquee = document.querySelector('.marquee-content');
  if (!marquee) return;

  const track = marquee.closest('.marquee-track');
  if (track) {
    track.addEventListener('mouseenter', () => { marquee.style.animationPlayState = 'paused'; });
    track.addEventListener('mouseleave', () => { marquee.style.animationPlayState = 'running'; });
  }
}

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
  initNavScroll();
  initMobileNav();
  initHero();
  initSectionHeadings();
  initBentoGrid();
  initExperienceScroll();
  initProjectsGrid();
  initContact();
  initSmoothScroll();
  initContactForm();
  initPortfolioTile();
  initMarquee();

  console.log('🚀 Narrative Bento portfolio initialized!');
});
