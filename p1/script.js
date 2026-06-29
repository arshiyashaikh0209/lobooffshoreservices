/* ============================================================
   LOBO OFFSHORE — Advanced JavaScript
   Author: Claude for LOBO Offshore Recruitment & Maritime Services
   ============================================================ */

'use strict';

/* ── 1. DOM Ready Helper ──────────────────────────────────── */
const ready = (fn) => {
  if (document.readyState !== 'loading') fn();
  else document.addEventListener('DOMContentLoaded', fn);
};

ready(() => {
  initNavbar();
  initMobileMenu();
  initScrollReveal();
  initCounters();
  initParticles();
  initMarquee();
  initContactForm();
  initBackToTop();
  initSmoothScrollLinks();
  initTiltCards();
  initCursorGlow();
});


/* ── 2. NAVBAR: scroll state + active link highlight ─────── */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  const links = navbar.querySelectorAll('.nav-links a');
  const sections = document.querySelectorAll('section[id], header[id]');

  let ticking = false;

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const y = window.scrollY;

        // Scrolled class
        navbar.classList.toggle('scrolled', y > 50);

        // Active nav link
        let current = '';
        sections.forEach(sec => {
          const top = sec.offsetTop - 120;
          if (y >= top) current = sec.id;
        });

        links.forEach(a => {
          a.classList.remove('active');
          if (a.getAttribute('href') === `#${current}`) a.classList.add('active');
        });

        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
}


/* ── 3. MOBILE MENU ───────────────────────────────────────── */
function initMobileMenu() {
  const burger    = document.getElementById('burger');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileClose = document.getElementById('mobileClose');
  if (!burger || !mobileMenu) return;

  const open  = () => { mobileMenu.classList.add('open'); burger.classList.add('open'); document.body.style.overflow = 'hidden'; };
  const close = () => { mobileMenu.classList.remove('open'); burger.classList.remove('open'); document.body.style.overflow = ''; };

  burger.addEventListener('click', open);
  mobileClose?.addEventListener('click', close);
  mobileMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', close));

  // Close on ESC
  document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
}


/* ── 4. SCROLL REVEAL with IntersectionObserver ──────────── */
function initScrollReveal() {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReduced) {
    document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale').forEach(el => {
      el.classList.add('in');
    });
    return;
  }

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale').forEach(el => {
    io.observe(el);
  });
}


/* ── 5. ANIMATED COUNTERS ─────────────────────────────────── */
function initCounters() {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const counters = document.querySelectorAll('.stat .num[data-count]');
  if (!counters.length) return;

  const easeOut = t => 1 - Math.pow(1 - t, 3); // cubic ease-out

  const animateCounter = (el) => {
    const target = +el.dataset.count;
    const suffix = el.dataset.suffix || '';
    if (prefersReduced) { el.textContent = target.toLocaleString() + suffix; return; }

    const duration = 1800;
    const start = performance.now();

    const tick = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const value = Math.floor(easeOut(progress) * target);
      el.textContent = value.toLocaleString() + suffix;
      if (progress < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  };

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(el => io.observe(el));
}


/* ── 6. HERO PARTICLE NETWORK (canvas) ───────────────────── */
function initParticles() {
  const canvas = document.getElementById('particles');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let w, h, particles = [], animId;
  const LINK_DIST = 135;
  const GOLD = 'rgba(212,175,55,';

  function resize() {
    w = canvas.width  = canvas.offsetWidth;
    h = canvas.height = canvas.offsetHeight;
  }

  function createParticles() {
    const count = w < 700 ? 28 : 55;
    particles = Array.from({ length: count }, () => ({
      x:  Math.random() * w,
      y:  Math.random() * h,
      vx: (Math.random() - .5) * .28,
      vy: (Math.random() - .5) * .28,
      r:  Math.random() * 1.6 + .6,
      o:  Math.random() * .5 + .4,
    }));
  }

  function draw() {
    ctx.clearRect(0, 0, w, h);

    // Move
    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > w) p.vx *= -1;
      if (p.y < 0 || p.y > h) p.vy *= -1;
    });

    // Links
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const a = particles[i], b = particles[j];
        const dx = a.x - b.x, dy = a.y - b.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < LINK_DIST) {
          const alpha = (1 - dist / LINK_DIST) * .18;
          ctx.strokeStyle = GOLD + alpha + ')';
          ctx.lineWidth = .8;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }

    // Dots
    particles.forEach(p => {
      ctx.beginPath();
      ctx.fillStyle = `rgba(232,205,122,${p.o})`;
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    });

    if (!prefersReduced) animId = requestAnimationFrame(draw);
  }

  // Mouse repulsion
  let mouse = { x: null, y: null };
  canvas.addEventListener('mousemove', e => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  });
  canvas.addEventListener('mouseleave', () => { mouse.x = null; mouse.y = null; });

  // Pause when tab hidden
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) cancelAnimationFrame(animId);
    else if (!prefersReduced) draw();
  });

  const ro = new ResizeObserver(() => { resize(); createParticles(); });
  ro.observe(canvas.parentElement);

  resize();
  createParticles();
  if (!prefersReduced) draw();
}


/* ── 7. CLIENTELE MARQUEE ─────────────────────────────────── */
function initMarquee() {
  const clients = [
    'MASADER','TÜV Rheinland','Tipco.sa','Sodexo','SZD Engineering','Crewell',
    'Al Melhy Trading','Unique Co.','NTI','Mazoon','HAIMO','Gulf Contracting',
    'Al-Balagh','Alshawamikh Oil Services','DOPET','ASAH','Al Jehat Company',
    'Global City Investment','Marsim Muscat','ISEC','HMI','Majestic',
    'Al Sawari','Mazrui','GCC Group',
  ];

  function buildMarquee(id, list) {
    const wrap = document.getElementById(id);
    if (!wrap) return;
    const html = list.map(c => `<div class="client-card">${c}</div>`).join('');
    wrap.innerHTML = html + html; // duplicate for seamless loop
  }

  buildMarquee('marquee1', clients.slice(0, 13));
  buildMarquee('marquee2', clients.slice(13));
}


/* ── 8. CONTACT FORM ──────────────────────────────────────── */
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  const btn = form.querySelector('button[type="submit"]');
  const origHTML = btn?.innerHTML;

  // Live validation styling
  form.querySelectorAll('input, select, textarea').forEach(el => {
    el.addEventListener('blur', () => {
      if (el.required && !el.value.trim()) {
        el.style.borderColor = '#E05353';
      } else {
        el.style.borderColor = '';
      }
    });
    el.addEventListener('input', () => { el.style.borderColor = ''; });
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Quick validation
    let valid = true;
    form.querySelectorAll('[required]').forEach(el => {
      if (!el.value.trim()) { el.style.borderColor = '#E05353'; valid = false; }
    });
    if (!valid) return;

    if (!btn) return;

    // Simulate send
    btn.disabled = true;
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending…';

    setTimeout(() => {
      btn.innerHTML = '<i class="fa-solid fa-check"></i> Message Sent!';
      btn.style.background = 'linear-gradient(135deg,#4caf50,#2e7d32)';
      btn.style.color = '#fff';
      form.reset();

      setTimeout(() => {
        btn.innerHTML = origHTML;
        btn.style.background = '';
        btn.style.color = '';
        btn.disabled = false;
      }, 3000);
    }, 1400);
  });
}


/* ── 9. BACK TO TOP ───────────────────────────────────────── */
function initBackToTop() {
  const toTop = document.getElementById('toTop');
  if (!toTop) return;

  window.addEventListener('scroll', () => {
    toTop.classList.toggle('show', window.scrollY > 500);
  }, { passive: true });

  toTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}


/* ── 10. SMOOTH SCROLL for all anchor links ───────────────── */
function initSmoothScrollLinks() {
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const id = link.getAttribute('href').slice(1);
      if (!id) return;
      const target = document.getElementById(id);
      if (!target) return;
      e.preventDefault();
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
}


/* ── 11. SUBTLE TILT on cards (glass-card, benefit-card) ─── */
function initTiltCards() {
  if (window.matchMedia('(hover: none)').matches) return; // skip on touch
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const cards = document.querySelectorAll('.glass-card, .vm-card');

  cards.forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const cx = rect.left + rect.width  / 2;
      const cy = rect.top  + rect.height / 2;
      const dx = (e.clientX - cx) / (rect.width  / 2);
      const dy = (e.clientY - cy) / (rect.height / 2);
      card.style.transform = `perspective(600px) rotateX(${-dy * 4}deg) rotateY(${dx * 4}deg) scale(1.02)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}


/* ── 12. CURSOR GLOW (subtle ambient follow on desktop) ──── */
function initCursorGlow() {
  if (window.matchMedia('(hover: none)').matches) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const hero = document.querySelector('.hero');
  if (!hero) return;

  const glow = document.createElement('div');
  glow.style.cssText = `
    position:absolute;
    pointer-events:none;
    width:280px; height:280px;
    border-radius:50%;
    background:radial-gradient(circle, rgba(212,175,55,.09), transparent 65%);
    transform:translate(-50%,-50%);
    z-index:1;
    transition:opacity .4s;
    opacity:0;
  `;
  hero.appendChild(glow);

  hero.addEventListener('mousemove', e => {
    const rect = hero.getBoundingClientRect();
    glow.style.left = (e.clientX - rect.left) + 'px';
    glow.style.top  = (e.clientY - rect.top)  + 'px';
    glow.style.opacity = '1';
  });
  hero.addEventListener('mouseleave', () => { glow.style.opacity = '0'; });
}


/* ── 13. ACTIVE NAV LINK CSS (injected once) ──────────────── */
(function injectActiveStyle() {
  const s = document.createElement('style');
  s.textContent = `.nav-links a.active{color:#fff !important;} .nav-links a.active::after{width:100% !important;}`;
  document.head.appendChild(s);
})();