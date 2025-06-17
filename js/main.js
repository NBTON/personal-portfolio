// Custom Green Cursor Functionality
const cursorDot = document.querySelector('.cursor-dot');
const cursorOutline = document.querySelector('.cursor-outline');
const cursorText = document.querySelector('.cursor-text');

// Set initial position to center
let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;
let outlineX = mouseX;
let outlineY = mouseY;
let dotX = mouseX;
let dotY = mouseY;

// Set the initial position of the cursors
cursorDot.style.left = `${dotX}px`;
cursorDot.style.top = `${dotY}px`;
cursorOutline.style.left = `${outlineX}px`;
cursorOutline.style.top = `${outlineY}px`;

// Speed of trailing effect (lower = faster)
const DELAY_FACTOR_OUTLINE = 0.25;
const DELAY_FACTOR_DOT = 0.15;

// Track cursor position
document.addEventListener('mousemove', (e) => {
mouseX = e.clientX;
mouseY = e.clientY;
});

// Show cursor when entering the document
document.addEventListener('mouseenter', () => {
cursorDot.classList.remove('cursor-hidden');
cursorOutline.classList.remove('cursor-hidden');
});

// Hide cursor when leaving the browser window
document.addEventListener('mouseleave', () => {
cursorDot.classList.add('cursor-hidden');
cursorOutline.classList.add('cursor-hidden');
cursorText.style.opacity = '0';
});

// Positions for cursor elements
function animateCursor() {
// Update dot position (faster movement)
dotX += (mouseX - dotX) * DELAY_FACTOR_DOT;
dotY += (mouseY - dotY) * DELAY_FACTOR_DOT;
cursorDot.style.left = `${dotX}px`;
cursorDot.style.top = `${dotY}px`;

// Update outline position (slower movement)
outlineX += (mouseX - outlineX) * DELAY_FACTOR_OUTLINE;
outlineY += (mouseY - outlineY) * DELAY_FACTOR_OUTLINE;
cursorOutline.style.left = `${outlineX}px`;
cursorOutline.style.top = `${outlineY}px`;

requestAnimationFrame(animateCursor);
}

// Start cursor animation
animateCursor();

// Add hover effect to interactive elements
const interactiveElements = document.querySelectorAll(
'a, button, .btn, input, textarea, .hamburger, .close-menu, .skill-tag, .project-card'
);

interactiveElements.forEach(element => {
element.addEventListener('mouseenter', () => {
cursorOutline.classList.add('cursor-hover');

// Add special text for buttons
if (element.tagName === 'BUTTON' || element.classList.contains('btn')) {
    cursorText.style.opacity = '1';
    cursorText.textContent = element.textContent.includes('Contact') 
        ? 'Contact' 
        : element.textContent.includes('View') 
            ? 'View' 
            : 'Click';
    cursorText.style.left = `${mouseX + 20}px`;
    cursorText.style.top = `${mouseY + 20}px`;
}
});

element.addEventListener('mousemove', (e) => {
if (element.tagName === 'BUTTON' || element.classList.contains('btn')) {
    cursorText.style.left = `${e.clientX + 20}px`;
    cursorText.style.top = `${e.clientY + 20}px`;
}
});

element.addEventListener('mouseleave', () => {
cursorOutline.classList.remove('cursor-hover');
cursorText.style.opacity = '0';
});

element.addEventListener('mousedown', () => {
cursorOutline.classList.add('cursor-click');
});

element.addEventListener('mouseup', () => {
cursorOutline.classList.remove('cursor-click');
});
});

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
anchor.addEventListener('click', function(e) {
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
document.getElementById('contactForm').addEventListener('submit', function(e) {
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
const options = { threshold: 0.1 };

const observer = new IntersectionObserver((entries, obs) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible-section");
      obs.unobserve(entry.target);
    }
  });
}, options);

sections.forEach(section => {
  section.classList.add("hidden-section");
  observer.observe(section);
});

// Add scroll-to-top for Personal Portfolio Website View Project button
const portfolioBtn = document.getElementById('portfolioViewProjectBtn');
if (portfolioBtn) {
portfolioBtn.addEventListener('click', function(e) {
e.preventDefault();
window.scrollTo({ top: 0, behavior: 'smooth' });
});
}
