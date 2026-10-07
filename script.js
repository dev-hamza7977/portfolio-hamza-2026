(() => {
  'use strict';

  const root = document.documentElement;
  const body = document.body;
  const nav = document.getElementById('nav');
  const menuToggle = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');
  const form = document.getElementById('contactForm');

  /* ---------------------------------------------------------
     NAVIGATION
     --------------------------------------------------------- */
  const setScrolled = () => nav?.classList.toggle('scrolled', window.scrollY > 24);
  setScrolled();
  window.addEventListener('scroll', setScrolled, { passive: true });

  menuToggle?.addEventListener('click', () => {
    const open = navLinks?.classList.toggle('open') ?? false;
    menuToggle.setAttribute('aria-expanded', String(open));
    menuToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  });

  navLinks?.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      menuToggle?.setAttribute('aria-expanded', 'false');
      menuToggle?.setAttribute('aria-label', 'Open menu');
    });
  });

  // Close the mobile navigation when clicking outside it or pressing Escape.
  document.addEventListener('click', event => {
    if (!navLinks?.classList.contains('open')) return;
    if (!nav?.contains(event.target)) {
      navLinks.classList.remove('open');
      menuToggle?.setAttribute('aria-expanded', 'false');
      menuToggle?.setAttribute('aria-label', 'Open menu');
    }
  });

  document.addEventListener('keydown', event => {
    if (event.key !== 'Escape' || !navLinks?.classList.contains('open')) return;
    navLinks.classList.remove('open');
    menuToggle?.setAttribute('aria-expanded', 'false');
    menuToggle?.setAttribute('aria-label', 'Open menu');
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 1100 && navLinks?.classList.contains('open')) {
      navLinks.classList.remove('open');
      menuToggle?.setAttribute('aria-expanded', 'false');
      menuToggle?.setAttribute('aria-label', 'Open menu');
    }
  });

  /* Smooth internal links */
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', event => {
      const id = link.getAttribute('href');
      if (!id || id === '#') return;
      const target = document.querySelector(id);
      if (!target) return;
      event.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  /* ---------------------------------------------------------
     THEME SWITCHER — ONE SYSTEM ONLY
     --------------------------------------------------------- */
  const switcher = document.getElementById('themeSwitcherPro');
  const themeButton = document.getElementById('themeSwitcherButton');
  const themeMenu = document.getElementById('themeSwitcherMenu');

  const themes = {
    midnight: {
      bg:'#070a10', section:'#0b1019', alt:'#0e1520', surface:'#121a26', surface2:'#172131',
      text:'#f5f7fb', muted:'#a8b3c2', border:'rgba(255,255,255,.10)',
      accent:'#5eead4', soft:'rgba(94,234,212,.12)', line:'rgba(94,234,212,.30)'
    },
    graphite: {
      bg:'#090a0d', section:'#0e1014', alt:'#12151a', surface:'#17191e', surface2:'#1d2026',
      text:'#f5f6f7', muted:'#aeb3bb', border:'rgba(255,255,255,.10)',
      accent:'#d5dbe3', soft:'rgba(213,219,227,.10)', line:'rgba(213,219,227,.27)'
    },
    navy: {
      bg:'#06101c', section:'#091725', alt:'#0c1c2e', surface:'#102238', surface2:'#142b43',
      text:'#f3f7fc', muted:'#a7b8cc', border:'rgba(160,195,230,.13)',
      accent:'#69b8ff', soft:'rgba(105,184,255,.12)', line:'rgba(105,184,255,.31)'
    },
    forest: {
      bg:'#06110d', section:'#091812', alt:'#0c2018', surface:'#10251c', surface2:'#153025',
      text:'#f0f8f4', muted:'#a7bcb2', border:'rgba(155,215,185,.13)',
      accent:'#6ee7b7', soft:'rgba(110,231,183,.12)', line:'rgba(110,231,183,.30)'
    },
    burgundy: {
      bg:'#11080c', section:'#180b11', alt:'#211019', surface:'#28141d', surface2:'#321a25',
      text:'#fff5f7', muted:'#c4abb4', border:'rgba(255,190,205,.13)',
      accent:'#f08aa7', soft:'rgba(240,138,167,.12)', line:'rgba(240,138,167,.30)'
    }
  };

  function applyTheme(name) {
    const key = themes[name] ? name : 'midnight';
    const t = themes[key];
    const vars = {
      '--bg':t.bg,
      '--section-bg':t.section,
      '--section-alt':t.alt,
      '--surface':t.surface,
      '--surface2':t.surface2,
      '--text':t.text,
      '--muted':t.muted,
      '--border':t.border,
      '--line':t.border,
      '--accent':t.accent,
      '--accent2':t.accent,
      '--accent-soft':t.soft,
      '--accent-line':t.line,
      '--card':t.surface
    };
    Object.entries(vars).forEach(([property, value]) => root.style.setProperty(property, value));
    root.dataset.theme = key;
    try { localStorage.setItem('portfolio-theme', key); } catch (_) {}

    themeMenu?.querySelectorAll('[data-theme-pro]').forEach(item => {
      item.classList.toggle('active', item.dataset.themePro === key);
      item.setAttribute('aria-current', item.dataset.themePro === key ? 'true' : 'false');
    });
  }

  let savedTheme = 'midnight';
  try { savedTheme = localStorage.getItem('portfolio-theme') || 'midnight'; } catch (_) {}
  applyTheme(savedTheme);

  if (switcher && themeButton && themeMenu) {
    themeButton.addEventListener('click', event => {
      event.stopPropagation();
      const open = switcher.classList.toggle('open');
      themeButton.setAttribute('aria-expanded', String(open));
    });

    themeMenu.querySelectorAll('[data-theme-pro]').forEach(item => {
      item.addEventListener('click', event => {
        event.stopPropagation();
        applyTheme(item.dataset.themePro);
        switcher.classList.remove('open');
        themeButton.setAttribute('aria-expanded', 'false');
      });
    });

    document.addEventListener('click', event => {
      if (!switcher.contains(event.target)) {
        switcher.classList.remove('open');
        themeButton.setAttribute('aria-expanded', 'false');
      }
    });

    document.addEventListener('keydown', event => {
      if (event.key === 'Escape') {
        switcher.classList.remove('open');
        themeButton.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* ---------------------------------------------------------
     CONTACT FORM
     --------------------------------------------------------- */
  form?.addEventListener('submit', event => {
    event.preventDefault();
    const data = new FormData(form);
    const subject = encodeURIComponent(`Project Inquiry — ${data.get('project') || 'Website Project'}`);
    const bodyText = `Hi Hamza,\n\nMy name is ${data.get('name') || ''}.\nEmail: ${data.get('email') || ''}\nProject Type: ${data.get('project') || ''}\n\nProject details:\n${data.get('message') || ''}\n\nThanks.`;
    window.location.href = `mailto:meghani9869@gmail.com?subject=${subject}&body=${encodeURIComponent(bodyText)}`;
  });

  /* ---------------------------------------------------------
     GSAP ANIMATIONS
     --------------------------------------------------------- */
  // The CSS keeps everything visible by default. GSAP enhances the page
  // when the CDN is available, so animations can never make content disappear.
  const prefersReducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  const hasGSAP = typeof window.gsap !== 'undefined';

  if (hasGSAP && !prefersReducedMotion) {
    document.documentElement.classList.add('gsap-ready');
    if (window.ScrollTrigger) gsap.registerPlugin(ScrollTrigger);

    const reveal = (selector, vars = {}) => {
      const items = gsap.utils.toArray(selector);
      if (!items.length) return;

      gsap.fromTo(items,
        { opacity: 0, y: vars.y ?? 34, scale: vars.scale ?? 1 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: vars.duration ?? 0.85,
          ease: vars.ease ?? 'power3.out',
          stagger: vars.stagger ?? 0.1,
          clearProps: 'opacity,transform',
          scrollTrigger: {
            trigger: vars.trigger || items[0],
            start: vars.start || 'top 84%',
            once: true
          }
        }
      );
    };

    // Hero: immediate premium entrance.
    const heroCopy = document.querySelector('.hero-copy');
    const heroVisual = document.querySelector('.hero-visual');
    if (heroCopy) {
      gsap.fromTo(heroCopy,
        { opacity: 0, y: 45 },
        { opacity: 1, y: 0, duration: 1.05, ease: 'power4.out', delay: 0.12, clearProps: 'opacity,transform' }
      );
    }
    if (heroVisual) {
      gsap.fromTo(heroVisual,
        { opacity: 0, x: 45, scale: 0.96 },
        { opacity: 1, x: 0, scale: 1, duration: 1.1, ease: 'power4.out', delay: 0.24, clearProps: 'opacity,transform' }
      );
    }

    // Section labels/headings.
    reveal('.section-label', { y: 20, duration: 0.7, stagger: 0.04 });
    reveal('.section-heading', { y: 28, duration: 0.85 });
    reveal('.projects-head', { y: 28, duration: 0.85 });

    // Cards and content groups.
    reveal('.mini-card', { y: 35, duration: 0.75, stagger: 0.12, trigger: '.about' });
    reveal('.skill-group', { y: 30, duration: 0.75, stagger: 0.12, trigger: '.skills' });
    reveal('.timeline-item', { y: 42, duration: 0.8, stagger: 0.16, trigger: '.experience' });
    reveal('.project-card', { y: 40, scale: 0.97, duration: 0.85, stagger: 0.12, trigger: '.projects' });
    reveal('.service-card', { y: 42, duration: 0.8, stagger: 0.13, trigger: '.services' });
    reveal('.pricing-box', { y: 40, scale: 0.98, duration: 0.9, trigger: '.pricing' });
    reveal('.education-card', { y: 40, duration: 0.85, trigger: '.education' });
    reveal('.cta-content', { y: 35, duration: 0.85, trigger: '.cta-section' });
    reveal('.cta-index, .cta-side-note', { y: 18, duration: 0.7, stagger: 0.1, trigger: '.cta-section' });
    reveal('.contact-intro', { y: 28, duration: 0.85, trigger: '.contact' });
    reveal('.contact-info-panel', { x: -35, duration: 0.85, trigger: '.contact' });
    reveal('.contact-form', { x: 35, duration: 0.9, trigger: '.contact' });
    reveal('.contact-detail', { x: -20, duration: 0.65, stagger: 0.1, trigger: '.contact' });
    reveal('.socials-premium a', { y: 18, duration: 0.55, stagger: 0.08, trigger: '.contact' });

    // Subtle timeline line draw.
    const timelineLine = document.querySelector('.timeline::before');
    const experience = document.querySelector('.experience');
    if (experience) {
      const line = experience.querySelector('.timeline');
      if (line) {
        gsap.fromTo(line,
          { '--timeline-progress': '0%' },
          {
            '--timeline-progress': '100%',
            duration: 1.8,
            ease: 'power2.out',
            scrollTrigger: { trigger: line, start: 'top 75%', once: true }
          }
        );
      }
    }

    // Gentle floating effect for hero visual.
    if (heroVisual) {
      gsap.to(heroVisual, {
        y: -8,
        duration: 3.5,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
      });
    }

    // Button micro-interactions.
    document.querySelectorAll('.btn, .nav-cta, .service-card a, .project-card').forEach(el => {
      el.addEventListener('mouseenter', () => gsap.to(el, { y: -3, duration: 0.22, ease: 'power2.out', overwrite: true }));
      el.addEventListener('mouseleave', () => gsap.to(el, { y: 0, duration: 0.28, ease: 'power2.out', overwrite: true }));
    });
  }

  /* ---------------------------------------------------------
     CUSTOM CURSOR — DESKTOP ONLY
     --------------------------------------------------------- */
  const cursorDot = document.querySelector('.cursor-dot');
  const cursorRing = document.querySelector('.cursor-ring');
  const cursorGlow = document.querySelector('.cursor-glow');
  const finePointer = window.matchMedia && window.matchMedia('(pointer:fine)').matches;

  if (finePointer && cursorDot && cursorRing && cursorGlow) {
    let mx = innerWidth / 2, my = innerHeight / 2;
    let rx = mx, ry = my;
    let gx = mx, gy = my;

    const move = event => {
      mx = event.clientX;
      my = event.clientY;
      // Do not leave the custom cursor parked at 0,0 before the first mouse movement.
      document.documentElement.classList.add('custom-cursor-active');
      cursorDot.style.transform = `translate3d(${mx}px,${my}px,0) translate(-50%,-50%)`;
    };
    window.addEventListener('mousemove', move, { passive: true });

    const tick = () => {
      rx += (mx - rx) * .18;
      ry += (my - ry) * .18;
      gx += (mx - gx) * .075;
      gy += (my - gy) * .075;
      cursorRing.style.transform = `translate3d(${rx}px,${ry}px,0) translate(-50%,-50%)`;
      cursorGlow.style.transform = `translate3d(${gx}px,${gy}px,0) translate(-50%,-50%)`;
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);

    document.querySelectorAll('a, button, input, textarea, select, .service-card, .project-card, .skill-group, .timeline-content').forEach(el => {
      el.addEventListener('mouseenter', () => body.classList.add('cursor-hover'));
      el.addEventListener('mouseleave', () => body.classList.remove('cursor-hover'));
    });
  }

  /* Prevent stuck mobile menu when resizing to desktop. */
  window.addEventListener('resize', () => {
    if (innerWidth > 760) {
      navLinks?.classList.remove('open');
      menuToggle?.setAttribute('aria-expanded', 'false');
      menuToggle?.setAttribute('aria-label', 'Open menu');
    }
  }, { passive: true });
})();
