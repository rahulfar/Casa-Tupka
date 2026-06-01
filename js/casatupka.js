/* ============================================================
   CASA TUPKA — JavaScript
   Animations, Interactions, UX
   ============================================================ */

(function () {
  'use strict';

  /* ---- AGE GATE ---- */
  const ageGate   = document.getElementById('age-gate');
  const ageYes    = document.getElementById('age-yes');
  const ageNo     = document.getElementById('age-no');

  const passed = sessionStorage.getItem('ct_age_passed');
  if (passed) {
    ageGate.classList.add('hidden');
    setTimeout(() => { ageGate.style.display = 'none'; }, 800);
  }

  ageYes && ageYes.addEventListener('click', function () {
    sessionStorage.setItem('ct_age_passed', '1');
    ageGate.classList.add('hidden');
    setTimeout(() => { ageGate.style.display = 'none'; }, 800);
    triggerEntrance();
  });

  ageNo && ageNo.addEventListener('click', function () {
    window.location.href = 'https://www.google.com';
  });

  /* ---- ENTRANCE ANIMATION on hero elements ---- */
  function triggerEntrance() {
    const els = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');
    els.forEach((el, i) => {
      const delay = parseInt(el.dataset.delay || 0, 10);
      setTimeout(() => el.classList.add('visible'), delay);
    });
  }
  if (passed) triggerEntrance();

  /* ---- NAVBAR SCROLL ---- */
  const navbar = document.getElementById('navbar');
  const backTop = document.getElementById('back-to-top');

  function onScroll() {
    const scrollY = window.scrollY;
    if (scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    if (scrollY > 400) {
      backTop.classList.add('visible');
    } else {
      backTop.classList.remove('visible');
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });

  backTop && backTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ---- HAMBURGER / MOBILE MENU ---- */
  const hamburger  = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');

  hamburger && hamburger.addEventListener('click', function () {
    this.classList.toggle('active');
    mobileMenu.classList.toggle('open');
    document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
  });

  // Support for desktop/menu overlay buttons in `index.html`
  const openMenuBtn  = document.getElementById('openMenu');
  const closeMenuBtn = document.getElementById('closeMenu');
  const menuOverlay  = document.getElementById('menuOverlay');
  const header       = document.querySelector('.luxury-header');

  if (openMenuBtn && menuOverlay) {
    openMenuBtn.addEventListener('click', function () {
      menuOverlay.classList.add('active');
      if (header) header.style.display = 'none';
      document.body.style.overflow = 'hidden';
    });
  }

  if (closeMenuBtn && menuOverlay) {
    closeMenuBtn.addEventListener('click', function () {
      menuOverlay.classList.remove('active');
      if (header) header.style.display = '';
      document.body.style.overflow = '';
    });
  }

  // Close on link click
  document.querySelectorAll('.menu-item').forEach(link => {
    link.addEventListener('click', () => {
      if (menuOverlay) menuOverlay.classList.remove('active');
      if (header) header.style.display = '';
      document.body.style.overflow = '';
    });
  });

  // Close menu when clicking on overlay background
  if (menuOverlay) {
    menuOverlay.addEventListener('click', (e) => {
      if (e.target === menuOverlay) {
        menuOverlay.classList.remove('active');
        if (header) header.style.display = '';
        document.body.style.overflow = '';
      }
    });
  }

  /* ---- PARTICLES ---- */
  function createParticles() {
    const container = document.getElementById('particles');
    if (!container) return;
    const count = 28;
    for (let i = 0; i < count; i++) {
      const p = document.createElement('div');
      p.className = 'particle';
      const size   = Math.random() * 3 + 1;
      const left   = Math.random() * 100;
      const delay  = Math.random() * 12;
      const dur    = Math.random() * 10 + 8;
      const bright = Math.random() > 0.5 ? '#c9a34c' : '#e8d08a';
      p.style.cssText = `
        width:${size}px; height:${size}px;
        left:${left}%;
        bottom: -10px;
        background:${bright};
        animation-duration:${dur}s;
        animation-delay:${delay}s;
      `;
      container.appendChild(p);
    }
  }
  createParticles();

  /* ---- INTERSECTION OBSERVER — REVEAL ---- */
  const revealEls = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el    = entry.target;
        const delay = parseInt(el.dataset.delay || 0, 10);
        setTimeout(() => el.classList.add('visible'), delay);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  revealEls.forEach(el => observer.observe(el));

  /* ---- COUNTER ANIMATION ---- */
  function animateCounter(el, target, duration = 2000) {
    const isYear = target >= 1900;
    const start  = isYear ? target - 74 : 0;
    const startTime = performance.now();

    function step(now) {
      const elapsed  = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased    = 1 - Math.pow(1 - progress, 4); // ease-out quartic
      const value    = Math.floor(start + (target - start) * eased);
      el.textContent = value.toLocaleString();
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = target.toLocaleString();
    }
    requestAnimationFrame(step);
  }

  const statCards = document.querySelectorAll('.stat-card');
  const statObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const numEl  = entry.target.querySelector('.stat-card__number');
        const target = parseInt(numEl.dataset.target, 10);
        if (!isNaN(target)) animateCounter(numEl, target);
        statObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });

  statCards.forEach(card => statObserver.observe(card));

  /* ---- SMOOTH ANCHOR SCROLL ---- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const navH   = navbar ? navbar.offsetHeight : 80;
        const top    = target.getBoundingClientRect().top + window.scrollY - navH;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  /* ---- EMAIL FORM ---- */
  const form    = document.getElementById('notify-form');
  const success = document.getElementById('notify-success');

  form && form.addEventListener('submit', function (e) {
    e.preventDefault();
    const email = document.getElementById('email-input').value.trim();
    if (!email) return;

    // Animate button
    const btn = form.querySelector('.notify__btn');
    btn.textContent = 'Adding You...';
    btn.disabled    = true;

    setTimeout(() => {
      form.style.display    = 'none';
      success.style.display = 'block';
      success.style.animation = 'fadeInUp 0.6s ease forwards';
    }, 1200);
  });

  /* ---- TASTING NOTE HOVER ---- */
  document.querySelectorAll('.note').forEach(note => {
    note.addEventListener('mouseenter', () => {
      note.style.color = 'var(--ivory)';
      note.style.transform = 'translateX(4px)';
      note.style.transition = 'all 0.3s';
    });
    note.addEventListener('mouseleave', () => {
      note.style.color = '';
      note.style.transform = '';
    });
  });

  /* ---- HERO PARALLAX (subtle) ---- */
  const heroContent = document.querySelector('.hero__content');
  const heroBottle  = document.querySelector('.hero__bottle');

  window.addEventListener('scroll', function () {
    const scrollY = window.scrollY;
    if (scrollY < window.innerHeight) {
      if (heroContent) heroContent.style.transform = `translateY(${scrollY * 0.15}px)`;
      if (heroBottle)  heroBottle.style.transform  = `translateY(${scrollY * 0.08}px)`;
    }
  }, { passive: true });

  /* ---- ACTIVE NAV LINKS on scroll ---- */
  const sections  = document.querySelectorAll('section[id]');
  const navLinks  = document.querySelectorAll('.navbar__links a');

  window.addEventListener('scroll', () => {
    const scrollPos = window.scrollY + 120;
    sections.forEach(section => {
      const top    = section.offsetTop;
      const height = section.offsetHeight;
      const id     = section.getAttribute('id');
      if (scrollPos >= top && scrollPos < top + height) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }, { passive: true });

  /* ---- CURSOR GLOW (desktop only) ---- */
  if (window.innerWidth > 1024) {
    const glow = document.createElement('div');
    glow.style.cssText = `
      position:fixed; pointer-events:none; z-index:9998;
      width:300px; height:300px; border-radius:50%;
      background:radial-gradient(circle, rgba(201,163,76,0.04) 0%, transparent 70%);
      transform:translate(-50%,-50%);
      transition:left 0.4s ease, top 0.4s ease;
      top:0; left:0;
    `;
    document.body.appendChild(glow);
    document.addEventListener('mousemove', e => {
      glow.style.left = e.clientX + 'px';
      glow.style.top  = e.clientY + 'px';
    });
  }

  /* ---- PROCESS STEP HOVER LINES ---- */
  document.querySelectorAll('.process__step').forEach((step, i) => {
    step.style.transitionDelay = (i * 60) + 'ms';
  });

  /* ---- FACT CARD STAGGER ---- */
  document.querySelectorAll('.fact-card').forEach((card, i) => {
    card.style.transitionDelay = (i * 80) + 'ms';
  });

  /* ---- MARQUEE PAUSE ON HOVER ---- */
  const marqueeTrack = document.querySelector('.marquee-track');
  if (marqueeTrack) {
    marqueeTrack.addEventListener('mouseenter', () => {
      marqueeTrack.style.animationPlayState = 'paused';
    });
    marqueeTrack.addEventListener('mouseleave', () => {
      marqueeTrack.style.animationPlayState = 'running';
    });
  }

  /* ---- COMING SOON MODAL ---- */
  const comingSoonModal = document.getElementById('comingSoonModal');
  const csClose = comingSoonModal && comingSoonModal.querySelector('.cs-close');
  let csTimer = null;

  function openComingSoonModal() {
    if (!comingSoonModal) return;
    clearTimeout(csTimer);
    comingSoonModal.classList.add('open');
    comingSoonModal.setAttribute('aria-hidden', 'false');
    // auto-close after 3 seconds
    csTimer = setTimeout(() => closeComingSoonModal(), 3000);
  }

  function closeComingSoonModal() {
    if (!comingSoonModal) return;
    comingSoonModal.classList.remove('open');
    comingSoonModal.setAttribute('aria-hidden', 'true');
    clearTimeout(csTimer);
    csTimer = null;
  }

  if (csClose) csClose.addEventListener('click', closeComingSoonModal);
  if (comingSoonModal) comingSoonModal.addEventListener('click', (e) => {
    if (e.target === comingSoonModal) closeComingSoonModal();
  });

  // Attach to any link/button with "coming soon" text
  const csTargets = Array.from(document.querySelectorAll('a, button'))
    .filter(el => (el.textContent || '').toLowerCase().includes('coming soon'));

  csTargets.forEach(el => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      openComingSoonModal();
    });
  });

  /* ---- LOG ---- */
  console.log(
    '%cCASA TUPKA %c— Coming Summer 2026',
    'font-family:Georgia,serif;font-size:18px;color:#c9a34c;font-style:italic;',
    'font-family:monospace;font-size:12px;color:#8c6d2f;'
  );

})();
