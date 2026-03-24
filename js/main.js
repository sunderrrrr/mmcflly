// ===== SCROLL REVEAL =====
function initReveal() {
  const els = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });
  els.forEach(el => observer.observe(el));
}

// ===== BURGER =====
function initBurger() {
  const burger = document.getElementById('burger');
  if (!burger) return;
  burger.addEventListener('click', () => {
    burger.classList.toggle('open');
  });
}

// ===== SMOOTH ANCHOR =====
function initAnchors() {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}

// ===== HEADER SCROLL EFFECT =====
function initHeaderScroll() {
  const header = document.querySelector('.site-header');
  if (!header) return;
  window.addEventListener('scroll', () => {
    if (window.scrollY > 30) {
      header.style.boxShadow = '0 4px 32px rgba(0,0,0,0.6)';
    } else {
      header.style.boxShadow = 'none';
    }
  }, { passive: true });
}

document.addEventListener('DOMContentLoaded', () => {
  initReveal();
  initBurger();
  initAnchors();
  initHeaderScroll();
});
