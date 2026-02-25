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
    'a, button, .btn-primary, .btn-outline, .project-tile, .exp-card, .bento-card, .interest-item, .nav-link, input, textarea'
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
  initLanguage();

  console.log('🚀 Narrative Bento portfolio initialized!');
});
// ===== LANGUAGE / i18n SYSTEM =====
const translations = {
  en: {
    'nav-about': 'About',
    'nav-journey': 'Journey',
    'nav-work': 'Work',
    'nav-contact': 'Contact',
    'hero-greeting': "Hello, I'm",
    'hero-name': 'Omar<br><span class="text-green">Alshahrani</span>',
    'hero-role': 'Software Engineer &amp;<br>AI &amp; Solution Architecture Enthusiast',
    'hero-explore': 'Explore',
    'hero-hello': 'Say Hello',
    'scroll': 'Scroll',
    'section-about': 'About Me',
    'bento-title': 'Software Engineer with a<br>passion for <span class="text-green">Solution Architecture</span>',
    'bento-text-1': "I'm an ambitious Software Engineering Student with skills and experience in Data Science, Web development, and IT consulting. As a creative problem-solver, I'm committed to continuous learning and leveraging emerging technologies to drive innovation and exceed business objectives.",
    'bento-text-2': 'Currently pursuing my B.Sc. in Software Engineering at King Fahd University of Petroleum and Minerals, focusing on software requirements, design, construction, and intelligent decision support systems.',
    'stat-projects': 'Projects',
    'stat-industries': 'Industries',
    'stat-university': 'University',
    'badge-current': 'Currently',
    'card-researcher': 'Researcher @ SDAIA-KFUPM JRC-AI',
    'card-researcher-desc': 'Undergraduate researcher at the SDAIA-KFUPM Joint Research Center for Artificial Intelligence since January 2026.',
    'badge-interests': 'Interests',
    'interest-ai': 'AI/ML',
    'interest-analytics': 'Analytics',
    'interest-fullstack': 'Full-Stack',
    'interest-arch': 'Solution Architecture',
    'quote': 'Leverage emerging technologies to drive innovation and exceed expectations.',
    'section-journey': 'My Journey',
    'exp1-date': 'Jan 2026 \u2014 Present',
    'exp1-role': 'Undergraduate Researcher',
    'exp1-company': 'SDAIA-KFUPM Joint Research Center for AI',
    'exp1-desc': 'Conducting research at the SDAIA-KFUPM Joint Research Center for Artificial Intelligence (JRC-AI), working on cutting-edge AI research initiatives.',
    'exp2-date': 'Jun 2025 \u2014 Aug 2025',
    'exp2-role': 'Software Engineer Intern',
    'exp2-company': 'Halliburton \u2014 Singapore',
    'exp2-desc': 'Designed the GUI for Well Integrity Monitoring. Implemented ML models to classify downhole leakage types. Integrated data pipelines and wrote tests for harsh-condition reliability.',
    'exp3-date': 'Nov 2024 \u2014 Apr 2025',
    'exp3-role': 'Project Manager',
    'exp3-company': 'WNDR Group',
    'exp3-desc': 'Overseeing planning, task delegation, and progress tracking. Facilitating team communication and implementing agile workflows to optimize game development productivity.',
    'exp4-date': 'Feb 2024 \u2014 May 2024',
    'exp4-role': 'Mentee',
    'exp4-company': 'YLAB \u2014 KFUPM',
    'exp4-desc': 'Participated in an inclusive program where KFUPM student teams draft and submit strategic proposals to decision-makers, offering student-centered advice to university departments.',
    'exp5-date': 'Oct 2023 \u2014 Feb 2024',
    'exp5-role': 'Participant',
    'exp5-company': 'Fuel Program \u2014 Saudi Digital Academy',
    'exp5-desc': 'Enrolled in the #FUEL program offering training courses aligned with Vision2030 goals. Developing skills in the most in-demand fields driving the Kingdom\'s digital transformation.',
    'scroll-cue': 'Drag or scroll to explore',
    'section-work': 'Selected Work',
    'contact-heading': 'Let\'s build<br>something <span class="text-green">great</span>.',
    'contact-sub': 'Got a project in mind, a question, or just want to say hello?',
    'ph-name': 'Your name',
    'ph-email': 'Your email',
    'ph-message': 'Your message',
    'btn-send': 'Send Message',
    'notification': 'Message sent!',
    'footer-copy': '\u00a9 2025 Omar Alshahrani'
  },
  ar: {
    'nav-about': '\u0639\u0646\u0651\u064a',
    'nav-journey': '\u0645\u0633\u064a\u0631\u062a\u064a',
    'nav-work': '\u0623\u0639\u0645\u0627\u0644\u064a',
    'nav-contact': '\u062a\u0648\u0627\u0635\u0644',
    'hero-greeting': '\u0645\u0631\u062d\u0628\u064b\u0627\u060c \u0623\u0646\u0627',
    'hero-name': '\u0639\u0645\u0631<br><span class="text-green">\u0627\u0644\u0634\u0647\u0631\u0627\u0646\u064a</span>',
    'hero-role': '\u0645\u0647\u0646\u062f\u0633 \u0628\u0631\u0645\u062c\u064a\u0627\u062a \u0648<br>\u0645\u0647\u062a\u0645 \u0628\u0627\u0644\u0630\u0643\u0627\u0621 \u0627\u0644\u0627\u0635\u0637\u0646\u0627\u0639\u064a \u0648\u0647\u0646\u062f\u0633\u0629 \u0627\u0644\u062d\u0644\u0648\u0644',
    'hero-explore': '\u0627\u0633\u062a\u0643\u0634\u0641',
    'hero-hello': '\u0623\u0644\u0642\u0650 \u0627\u0644\u062a\u062d\u064a\u0629',
    'scroll': '\u0645\u0631\u0651\u0631',
    'section-about': '\u0639\u0646\u0651\u064a',
    'bento-title': '\u0645\u0647\u0646\u062f\u0633 \u0628\u0631\u0645\u062c\u064a\u0627\u062a \u0634\u063a\u0648\u0641<br>\u0628\u0640 <span class="text-green">\u0647\u0646\u062f\u0633\u0629 \u0627\u0644\u062d\u0644\u0648\u0644</span>',
    'bento-text-1': '\u0623\u0646\u0627 \u0637\u0627\u0644\u0628 \u0647\u0646\u062f\u0633\u0629 \u0628\u0631\u0645\u062c\u064a\u0627\u062a \u0637\u0645\u0648\u062d \u0644\u062f\u064a\u0651 \u0645\u0647\u0627\u0631\u0627\u062a \u0648\u062e\u0628\u0631\u0629 \u0641\u064a \u0639\u0644\u0645 \u0627\u0644\u0628\u064a\u0627\u0646\u0627\u062a \u0648\u062a\u0637\u0648\u064a\u0631 \u0627\u0644\u0648\u064a\u0628 \u0648\u0627\u0633\u062a\u0634\u0627\u0631\u0627\u062a \u062a\u0642\u0646\u064a\u0629 \u0627\u0644\u0645\u0639\u0644\u0648\u0645\u0627\u062a. \u0643\u062d\u0627\u0644\u0651 \u0645\u0628\u062f\u0639 \u0644\u0644\u0645\u0634\u0643\u0644\u0627\u062a\u060c \u0623\u0644\u062a\u0632\u0645 \u0628\u0627\u0644\u062a\u0639\u0644\u0651\u0645 \u0627\u0644\u0645\u0633\u062a\u0645\u0631 \u0648\u0627\u0633\u062a\u062b\u0645\u0627\u0631 \u0627\u0644\u062a\u0642\u0646\u064a\u0627\u062a \u0627\u0644\u0646\u0627\u0634\u0626\u0629 \u0644\u062f\u0641\u0639 \u0627\u0644\u0627\u0628\u062a\u0643\u0627\u0631 \u0648\u062a\u062c\u0627\u0648\u0632 \u0627\u0644\u0623\u0647\u062f\u0627\u0641.',
    'bento-text-2': '\u0623\u062f\u0631\u0633 \u062d\u0627\u0644\u064a\u064b\u0627 \u0628\u0643\u0627\u0644\u0648\u0631\u064a\u0648\u0633 \u0647\u0646\u062f\u0633\u0629 \u0627\u0644\u0628\u0631\u0645\u062c\u064a\u0627\u062a \u0641\u064a \u062c\u0627\u0645\u0639\u0629 \u0627\u0644\u0645\u0644\u0643 \u0641\u0647\u062f \u0644\u0644\u0628\u062a\u0631\u0648\u0644 \u0648\u0627\u0644\u0645\u0639\u0627\u062f\u0646\u060c \u0645\u0639 \u0627\u0644\u062a\u0631\u0643\u064a\u0632 \u0639\u0644\u0649 \u0645\u062a\u0637\u0644\u0628\u0627\u062a \u0627\u0644\u0628\u0631\u0645\u062c\u064a\u0627\u062a \u0648\u0627\u0644\u062a\u0635\u0645\u064a\u0645 \u0648\u0627\u0644\u0628\u0646\u0627\u0621 \u0648\u0623\u0646\u0638\u0645\u0629 \u062f\u0639\u0645 \u0627\u0644\u0642\u0631\u0627\u0631 \u0627\u0644\u0630\u0643\u064a\u0629.',
    'stat-projects': '\u0645\u0634\u0627\u0631\u064a\u0639',
    'stat-industries': '\u0635\u0646\u0627\u0639\u0627\u062a',
    'stat-university': '\u0627\u0644\u062c\u0627\u0645\u0639\u0629',
    'badge-current': '\u062d\u0627\u0644\u064a\u064b\u0627',
    'card-researcher': '\u0628\u0627\u062d\u062b \u0641\u064a \u0645\u0631\u0643\u0632 \u0633\u062f\u0627\u064a\u0627-\u062c\u0627\u0645\u0639\u0629 \u0627\u0644\u0645\u0644\u0643 \u0641\u0647\u062f',
    'card-researcher-desc': '\u0628\u0627\u062d\u062b \u062c\u0627\u0645\u0639\u064a \u0641\u064a \u0645\u0631\u0643\u0632 \u0633\u062f\u0627\u064a\u0627-\u062c\u0627\u0645\u0639\u0629 \u0627\u0644\u0645\u0644\u0643 \u0641\u0647\u062f \u0627\u0644\u0645\u0634\u062a\u0631\u0643 \u0644\u0623\u0628\u062d\u0627\u062b \u0627\u0644\u0630\u0643\u0627\u0621 \u0627\u0644\u0627\u0635\u0637\u0646\u0627\u0639\u064a \u0645\u0646\u0630 \u064a\u0646\u0627\u064a\u0631 \u0662\u0660\u0662\u0666.',
    'badge-interests': '\u0627\u0647\u062a\u0645\u0627\u0645\u0627\u062a',
    'interest-ai': '\u0630\u0643\u0627\u0621 \u0627\u0635\u0637\u0646\u0627\u0639\u064a',
    'interest-analytics': '\u062a\u062d\u0644\u064a\u0644 \u0628\u064a\u0627\u0646\u0627\u062a',
    'interest-fullstack': '\u062a\u0637\u0648\u064a\u0631 \u0645\u062a\u0643\u0627\u0645\u0644',
    'interest-arch': '\u0647\u0646\u062f\u0633\u0629 \u0627\u0644\u062d\u0644\u0648\u0644',
    'quote': '\u0627\u0633\u062a\u062b\u0645\u0627\u0631 \u0627\u0644\u062a\u0642\u0646\u064a\u0627\u062a \u0627\u0644\u0646\u0627\u0634\u0626\u0629 \u0644\u062f\u0641\u0639 \u0627\u0644\u0627\u0628\u062a\u0643\u0627\u0631 \u0648\u062a\u062c\u0627\u0648\u0632 \u0627\u0644\u062a\u0648\u0642\u0639\u0627\u062a.',
    'section-journey': '\u0645\u0633\u064a\u0631\u062a\u064a',
    'exp1-date': '\u064a\u0646\u0627\u064a\u0631 \u0662\u0660\u0662\u0666 \u2014 \u0627\u0644\u062d\u0627\u0644\u064a',
    'exp1-role': '\u0628\u0627\u062d\u062b \u062c\u0627\u0645\u0639\u064a',
    'exp1-company': '\u0645\u0631\u0643\u0632 \u0633\u062f\u0627\u064a\u0627-\u062c\u0627\u0645\u0639\u0629 \u0627\u0644\u0645\u0644\u0643 \u0641\u0647\u062f \u0644\u0623\u0628\u062d\u0627\u062b \u0627\u0644\u0630\u0643\u0627\u0621 \u0627\u0644\u0627\u0635\u0637\u0646\u0627\u0639\u064a',
    'exp1-desc': '\u0625\u062c\u0631\u0627\u0621 \u0623\u0628\u062d\u0627\u062b \u0641\u064a \u0645\u0631\u0643\u0632 \u0633\u062f\u0627\u064a\u0627-\u062c\u0627\u0645\u0639\u0629 \u0627\u0644\u0645\u0644\u0643 \u0641\u0647\u062f \u0627\u0644\u0645\u0634\u062a\u0631\u0643 \u0644\u0623\u0628\u062d\u0627\u062b \u0627\u0644\u0630\u0643\u0627\u0621 \u0627\u0644\u0627\u0635\u0637\u0646\u0627\u0639\u064a\u060c \u0648\u0627\u0644\u0639\u0645\u0644 \u0639\u0644\u0649 \u0645\u0628\u0627\u062f\u0631\u0627\u062a \u0628\u062d\u062b\u064a\u0629 \u0645\u062a\u0642\u062f\u0645\u0629.',
    'exp2-date': '\u064a\u0648\u0646\u064a\u0648 \u0662\u0660\u0662\u0665 \u2014 \u0623\u063a\u0633\u0637\u0633 \u0662\u0660\u0662\u0665',
    'exp2-role': '\u0645\u062a\u062f\u0631\u0628 \u0647\u0646\u062f\u0633\u0629 \u0628\u0631\u0645\u062c\u064a\u0627\u062a',
    'exp2-company': '\u0647\u0627\u0644\u064a\u0628\u0631\u062a\u0648\u0646 \u2014 \u0633\u0646\u063a\u0627\u0641\u0648\u0631\u0629',
    'exp2-desc': '\u062a\u0635\u0645\u064a\u0645 \u0648\u0627\u062c\u0647\u0629 \u0627\u0644\u0645\u0633\u062a\u062e\u062f\u0645 \u0644\u0645\u0631\u0627\u0642\u0628\u0629 \u0633\u0644\u0627\u0645\u0629 \u0627\u0644\u0622\u0628\u0627\u0631. \u062a\u0646\u0641\u064a\u0630 \u0646\u0645\u0627\u0630\u062c \u062a\u0639\u0644\u0645 \u0622\u0644\u064a \u0644\u062a\u0635\u0646\u064a\u0641 \u0623\u0646\u0648\u0627\u0639 \u0627\u0644\u062a\u0633\u0631\u0628. \u062f\u0645\u062c \u062e\u0637\u0648\u0637 \u0627\u0644\u0628\u064a\u0627\u0646\u0627\u062a \u0648\u0643\u062a\u0627\u0628\u0629 \u0627\u062e\u062a\u0628\u0627\u0631\u0627\u062a \u0644\u0644\u0638\u0631\u0648\u0641 \u0627\u0644\u0642\u0627\u0633\u064a\u0629.',
    'exp3-date': '\u0646\u0648\u0641\u0645\u0628\u0631 \u0662\u0660\u0662\u0664 \u2014 \u0623\u0628\u0631\u064a\u0644 \u0662\u0660\u0662\u0665',
    'exp3-role': '\u0645\u062f\u064a\u0631 \u0645\u0634\u0631\u0648\u0639',
    'exp3-company': '\u0645\u062c\u0645\u0648\u0639\u0629 WNDR',
    'exp3-desc': '\u0627\u0644\u0625\u0634\u0631\u0627\u0641 \u0639\u0644\u0649 \u0627\u0644\u062a\u062e\u0637\u064a\u0637 \u0648\u062a\u0648\u0632\u064a\u0639 \u0627\u0644\u0645\u0647\u0627\u0645 \u0648\u0645\u062a\u0627\u0628\u0639\u0629 \u0627\u0644\u062a\u0642\u062f\u0645. \u062a\u0633\u0647\u064a\u0644 \u0627\u0644\u062a\u0648\u0627\u0635\u0644 \u0628\u064a\u0646 \u0627\u0644\u0641\u0631\u064a\u0642 \u0648\u062a\u0637\u0628\u064a\u0642 \u0645\u0646\u0647\u062c\u064a\u0627\u062a \u0623\u062c\u0627\u064a\u0644 \u0644\u062a\u062d\u0633\u064a\u0646 \u0625\u0646\u062a\u0627\u062c\u064a\u0629 \u062a\u0637\u0648\u064a\u0631 \u0627\u0644\u0623\u0644\u0639\u0627\u0628.',
    'exp4-date': '\u0641\u0628\u0631\u0627\u064a\u0631 \u0662\u0660\u0662\u0664 \u2014 \u0645\u0627\u064a\u0648 \u0662\u0660\u0662\u0664',
    'exp4-role': '\u0645\u062a\u062f\u0631\u0628',
    'exp4-company': 'YLAB \u2014 \u062c\u0627\u0645\u0639\u0629 \u0627\u0644\u0645\u0644\u0643 \u0641\u0647\u062f',
    'exp4-desc': '\u0634\u0627\u0631\u0643\u062a \u0641\u064a \u0628\u0631\u0646\u0627\u0645\u062c \u0634\u0627\u0645\u0644 \u062d\u064a\u062b \u062a\u0642\u0648\u0645 \u0641\u0631\u0642 \u0637\u0644\u0627\u0628\u064a\u0629 \u0628\u0635\u064a\u0627\u063a\u0629 \u0648\u062a\u0642\u062f\u064a\u0645 \u0645\u0642\u062a\u0631\u062d\u0627\u062a \u0627\u0633\u062a\u0631\u0627\u062a\u064a\u062c\u064a\u0629 \u0644\u0635\u0646\u0627\u0639 \u0627\u0644\u0642\u0631\u0627\u0631\u060c \u0648\u062a\u0642\u062f\u064a\u0645 \u0645\u0634\u0648\u0631\u0629 \u0637\u0644\u0627\u0628\u064a\u0629 \u0644\u0623\u0642\u0633\u0627\u0645 \u0627\u0644\u062c\u0627\u0645\u0639\u0629.',
    'exp5-date': '\u0623\u0643\u062a\u0648\u0628\u0631 \u0662\u0660\u0662\u0663 \u2014 \u0641\u0628\u0631\u0627\u064a\u0631 \u0662\u0660\u0662\u0664',
    'exp5-role': '\u0645\u0634\u0627\u0631\u0643',
    'exp5-company': '\u0628\u0631\u0646\u0627\u0645\u062c Fuel \u2014 \u0627\u0644\u0623\u0643\u0627\u062f\u064a\u0645\u064a\u0629 \u0627\u0644\u0633\u0639\u0648\u062f\u064a\u0629 \u0627\u0644\u0631\u0642\u0645\u064a\u0629',
    'exp5-desc': '\u0627\u0644\u062a\u062d\u0642\u062a \u0628\u0628\u0631\u0646\u0627\u0645\u062c #FUEL \u0627\u0644\u0630\u064a \u064a\u0642\u062f\u0645 \u062f\u0648\u0631\u0627\u062a \u062a\u062f\u0631\u064a\u0628\u064a\u0629 \u0645\u062a\u0648\u0627\u0641\u0642\u0629 \u0645\u0639 \u0623\u0647\u062f\u0627\u0641 \u0631\u0624\u064a\u0629 \u0662\u0660\u0663\u0660. \u062a\u0637\u0648\u064a\u0631 \u0627\u0644\u0645\u0647\u0627\u0631\u0627\u062a \u0641\u064a \u0623\u0643\u062b\u0631 \u0627\u0644\u0645\u062c\u0627\u0644\u0627\u062a \u0637\u0644\u0628\u064b\u0627 \u0627\u0644\u062a\u064a \u062a\u0642\u0648\u062f \u0627\u0644\u062a\u062d\u0648\u0644 \u0627\u0644\u0631\u0642\u0645\u064a \u0644\u0644\u0645\u0645\u0644\u0643\u0629.',
    'scroll-cue': 'Drag or scroll to explore',
    'section-work': 'Selected Work',
    'contact-heading': 'Let\'s build<br>something <span class="text-green">great</span>.',
    'contact-sub': '\u0647\u0644 \u0644\u062f\u064a\u0643 \u0645\u0634\u0631\u0648\u0639 \u0641\u064a \u0628\u0627\u0644\u0643\u060c \u0633\u0624\u0627\u0644\u060c \u0623\u0648 \u062a\u0631\u064a\u062f \u0641\u0642\u0637 \u0625\u0644\u0642\u0627\u0621 \u0627\u0644\u062a\u062d\u064a\u0629\u061f',
    'ph-name': '\u0627\u0633\u0645\u0643',
    'ph-email': '\u0628\u0631\u064a\u062f\u0643 \u0627\u0644\u0625\u0644\u0643\u062a\u0631\u0648\u0646\u064a',
    'ph-message': '\u0631\u0633\u0627\u0644\u062a\u0643',
    'btn-send': '\u0623\u0631\u0633\u0644 \u0627\u0644\u0631\u0633\u0627\u0644\u0629',
    'notification': '\u062a\u0645 \u0625\u0631\u0633\u0627\u0644 \u0627\u0644\u0631\u0633\u0627\u0644\u0629!',
    'footer-copy': '\u00a9 \u0662\u0660\u0662\u0665 \u0639\u0645\u0631 \u0627\u0644\u0634\u0647\u0631\u0627\u0646\u064a',
    'contact-heading': '\u0644\u0646\u0628\u0646\u0650 \u0634\u064a\u0626\u064b\u0627<br><span class="text-green">\u0639\u0638\u064a\u0645\u064b\u0627</span>.',
    'scroll-cue': '\u0627\u0633\u062d\u0628 \u0623\u0648 \u0645\u0631\u0651\u0631 \u0644\u0644\u0627\u0633\u062a\u0643\u0634\u0627\u0641',
    'section-work': '\u0623\u0639\u0645\u0627\u0644 \u0645\u062e\u062a\u0627\u0631\u0629'
  }
};

let currentLang = localStorage.getItem('lang') || 'en';

function setLanguage(lang) {
  currentLang = lang;
  const t = translations[lang];
  if (!t) return;

  // Set direction and language
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';

  // Update text content for data-i18n elements
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (t[key] !== undefined) {
      el.textContent = t[key];
    }
  });

  // Update HTML content for data-i18n-html elements
  document.querySelectorAll('[data-i18n-html]').forEach(el => {
    const key = el.getAttribute('data-i18n-html');
    if (t[key] !== undefined) {
      el.innerHTML = t[key];
    }
  });

  // Update placeholders for data-i18n-ph elements
  document.querySelectorAll('[data-i18n-ph]').forEach(el => {
    const key = el.getAttribute('data-i18n-ph');
    if (t[key] !== undefined) {
      el.placeholder = t[key];
    }
  });

  // Toggle font family
  if (lang === 'ar') {
    document.body.style.fontFamily = "'TheYearOfHandicrafts', 'Noto Kufi Arabic', sans-serif";
  } else {
    document.body.style.fontFamily = "'Space Grotesk', sans-serif";
  }

  // Update toggle buttons
  const toggleText = lang === 'ar' ? 'EN' : '\u0639\u0631\u0628\u064a';
  const langToggle = document.getElementById('langToggle');
  const langToggleMobile = document.getElementById('langToggleMobile');
  if (langToggle) langToggle.textContent = toggleText;
  if (langToggleMobile) langToggleMobile.textContent = toggleText;

  // Save preference
  localStorage.setItem('lang', lang);
}

function toggleLanguage() {
  setLanguage(currentLang === 'en' ? 'ar' : 'en');
}

function initLanguage() {
  // Wire click handlers
  const langToggle = document.getElementById('langToggle');
  const langToggleMobile = document.getElementById('langToggleMobile');
  if (langToggle) langToggle.addEventListener('click', toggleLanguage);
  if (langToggleMobile) langToggleMobile.addEventListener('click', toggleLanguage);

  // Restore saved language
  const saved = localStorage.getItem('lang');
  if (saved && saved !== 'en') {
    setLanguage(saved);
  }
}