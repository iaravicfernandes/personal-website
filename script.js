/* =============================================================
   IARA VICTORIA FERNANDES DE SOUZA — Portfólio Profissional
   script.js — Interações, animações e efeitos premium
   ============================================================= */

'use strict';

/* ======================== UTILS ========================= */
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];
const clamp = (n, min, max) => Math.min(Math.max(n, min), max);

function trackAnalyticsEvent(eventName, params = {}) {
  const eventParams = {
    event_category: 'contact',
    ...params,
  };

  if (typeof window.gtag === 'function') {
    window.gtag('event', eventName, eventParams);
  } else if (Array.isArray(window.dataLayer)) {
    window.dataLayer.push({ event: eventName, ...eventParams });
  }
}

/* ======================== ANALYTICS DE CONTATO ========================= */
(function initContactAnalytics() {
  document.addEventListener('click', (e) => {
    const whatsappLink = e.target.closest('a[href*="wa.me"], a[href*="whatsapp.com"]');
    if (whatsappLink) {
      trackAnalyticsEvent('click_whatsapp');
      return;
    }

    const emailLink = e.target.closest('a[href^="mailto:"]');
    if (emailLink) {
      trackAnalyticsEvent('click_email');
    }
  });
})();

/* ======================== LOADER ========================= */
(function initLoader() {
  const loader = $('#loader');
  if (!loader) return;

  // Garante que a animação da barra termina antes de esconder
  const minDelay = 1600; // ms
  const start = Date.now();

  window.addEventListener('load', () => {
    const elapsed = Date.now() - start;
    const remaining = Math.max(0, minDelay - elapsed);

    setTimeout(() => {
      loader.classList.add('loaded');
      document.body.style.overflow = '';
    }, remaining);
  });

  // Fallback se o evento load demorar
  setTimeout(() => loader.classList.add('loaded'), 3500);

  // Bloqueia scroll enquanto carrega
  document.body.style.overflow = 'hidden';
})();

/* ======================== CURSOR PERSONALIZADO ========================= */
(function initCursor() {
  // Somente em dispositivos com hover real (desktop)
  if (!window.matchMedia('(hover: hover)').matches) return;

  const cursor = $('#cursor');
  const follower = $('#cursorFollower');
  if (!cursor || !follower) return;

  let mouseX = 0, mouseY = 0;
  let followerX = 0, followerY = 0;
  let rafId = null;

  // Posição imediata do cursor principal
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.left = mouseX + 'px';
    cursor.style.top  = mouseY + 'px';
  });

  // Follower com lag suave via RAF
  function animateFollower() {
    followerX += (mouseX - followerX) * 0.12;
    followerY += (mouseY - followerY) * 0.12;
    follower.style.left = followerX + 'px';
    follower.style.top  = followerY + 'px';
    rafId = requestAnimationFrame(animateFollower);
  }
  animateFollower();

  // Hover em elementos interativos
  const hoverTargets = 'a, button, [role="button"], .skill-card, .portfolio-card, .sobre-card, .traj-card, .interesse-item';
  document.addEventListener('mouseover', (e) => {
    if (e.target.closest(hoverTargets)) {
      cursor.classList.add('cursor--hover');
      follower.classList.add('cursor--hover');
    }
  });
  document.addEventListener('mouseout', (e) => {
    if (e.target.closest(hoverTargets)) {
      cursor.classList.remove('cursor--hover');
      follower.classList.remove('cursor--hover');
    }
  });

  // Esconde quando o mouse sai da janela
  document.addEventListener('mouseleave', () => {
    cursor.style.opacity = '0';
    follower.style.opacity = '0';
  });
  document.addEventListener('mouseenter', () => {
    cursor.style.opacity = '1';
    follower.style.opacity = '';
  });
})();

/* ======================== NAVBAR ========================= */
(function initNavbar() {
  const navbar = $('#navbar');
  if (!navbar) return;

  let lastScrollY = 0;
  let ticking = false;

  function updateNavbar() {
    const scrollY = window.scrollY;

    // Classe 'scrolled' para estilo fosco
    if (scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Auto-hide sutil: esconde ao rolar para baixo, aparece ao rolar para cima
    if (scrollY > 400) {
      if (scrollY > lastScrollY + 8) {
        navbar.style.transform = 'translateY(-100%)';
      } else if (scrollY < lastScrollY - 4) {
        navbar.style.transform = 'translateY(0)';
      }
    } else {
      navbar.style.transform = 'translateY(0)';
    }

    navbar.style.transition = 'transform .4s cubic-bezier(.16,1,.3,1), background .4s, box-shadow .4s';
    lastScrollY = scrollY;
    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(updateNavbar);
      ticking = true;
    }
  }, { passive: true });
})();

/* ======================== MENU MOBILE ========================= */
(function initMobileMenu() {
  const toggle = $('#navToggle');
  const mobileMenu = $('#navMobile');
  if (!toggle || !mobileMenu) return;

  function openMenu() {
    toggle.classList.add('active');
    mobileMenu.classList.add('open');
    toggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    toggle.classList.remove('active');
    mobileMenu.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  toggle.addEventListener('click', () => {
    toggle.classList.contains('active') ? closeMenu() : openMenu();
  });

  // Fecha ao clicar em links do menu mobile
  $$('.nav-mobile-link').forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  // Fecha ao clicar fora
  document.addEventListener('click', (e) => {
    if (!e.target.closest('#navMobile') && !e.target.closest('#navToggle')) {
      closeMenu();
    }
  });

  // Fecha ao pressionar Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMenu();
  });
})();

/* ======================== SCROLL REVEAL ========================= */
(function initScrollReveal() {
  const elements = $$('.reveal-up, .reveal-left, .reveal-right');
  if (!elements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // Para animações de entrada única, para de observar
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  elements.forEach(el => observer.observe(el));
})();

/* ======================== PARALLAX SUAVE NO HERO ========================= */
(function initHeroParallax() {
  const blobs = $$('.hero-blob');
  const heroGrid = $('.hero-grid');
  if (!blobs.length) return;

  let rafId = null;
  let scrollY = 0;

  function applyParallax() {
    const y = scrollY;
    blobs.forEach((blob, i) => {
      const speed = i === 0 ? 0.25 : 0.15;
      blob.style.transform = `translateY(${y * speed}px)`;
    });
    if (heroGrid) {
      heroGrid.style.transform = `translateY(${y * 0.08}px)`;
    }
    rafId = null;
  }

  window.addEventListener('scroll', () => {
    scrollY = window.scrollY;
    if (!rafId) rafId = requestAnimationFrame(applyParallax);
  }, { passive: true });
})();

/* ======================== EFEITO DE CONTAGEM NOS CARDS ========================= */
(function initCountAnimation() {
  // Anima o "1 ano de exp." e outros números se existirem
  const heroCard = $('.hero-card');
  if (!heroCard) return;

  // Texto da tag com número: anima opacidade de entrada
  const tags = $$('.hero-card-tags .tag');
  tags.forEach((tag, i) => {
    tag.style.opacity = '0';
    tag.style.transform = 'translateY(8px)';
    tag.style.transition = `opacity .4s ${0.8 + i * 0.1}s, transform .4s ${0.8 + i * 0.1}s`;
    setTimeout(() => {
      tag.style.opacity = '1';
      tag.style.transform = 'translateY(0)';
    }, 100);
  });
})();

/* ======================== PARTICLES / GLITTER NO HERO ========================= */
(function initHeroParticles() {
  const heroBg = $('.hero-bg');
  if (!heroBg) return;

  const canvas = document.createElement('canvas');
  canvas.style.cssText = `
    position: absolute; inset: 0; width: 100%; height: 100%;
    pointer-events: none; z-index: 0; opacity: 0.35;
  `;
  heroBg.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  let W, H, particles, rafId;

  const GOLD = '#C9A227';
  const GOLD_LIGHT = '#E6C65C';

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }

  function createParticles(n = 38) {
    return Array.from({ length: n }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 2.2 + 0.4,
      vx: (Math.random() - 0.5) * 0.22,
      vy: (Math.random() - 0.5) * 0.18 - 0.06,
      alpha: Math.random() * 0.5 + 0.15,
      color: Math.random() > 0.5 ? GOLD : GOLD_LIGHT,
      pulse: Math.random() * Math.PI * 2,
    }));
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => {
      p.pulse += 0.018;
      const a = p.alpha * (0.7 + 0.3 * Math.sin(p.pulse));
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = a;
      ctx.fill();

      p.x += p.vx;
      p.y += p.vy;

      if (p.x < -5) p.x = W + 5;
      if (p.x > W + 5) p.x = -5;
      if (p.y < -5) p.y = H + 5;
      if (p.y > H + 5) p.y = -5;
    });
    ctx.globalAlpha = 1;
    rafId = requestAnimationFrame(draw);
  }

  // Pausa partículas quando o hero sai de tela
  const heroSection = $('.hero');
  if (heroSection) {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        if (!rafId) draw();
      } else {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
    });
    observer.observe(heroSection);
  }

  window.addEventListener('resize', () => {
    resize();
    particles = createParticles();
  });

  resize();
  particles = createParticles();
  draw();
})();

/* ======================== TILT NOS CARDS ========================= */
(function initCardTilt() {
  if (!window.matchMedia('(hover: hover)').matches) return;

  const cards = $$('.traj-card, .portfolio-card, .skill-card');

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top  + rect.height / 2;
      const dx = (e.clientX - cx) / (rect.width  / 2);
      const dy = (e.clientY - cy) / (rect.height / 2);

      const rotX = clamp(-dy * 5, -6, 6);
      const rotY = clamp( dx * 5, -6, 6);

      card.style.transform = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-5px)`;
      card.style.transition = 'transform .08s linear';
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.transition = 'transform .4s cubic-bezier(.34,1.56,.64,1)';
    });
  });
})();

/* ======================== ACTIVE NAV LINK (SCROLL SPY) ========================= */
(function initScrollSpy() {
  const sections = $$('section[id]');
  const navLinks = $$('.nav-link');
  if (!sections.length || !navLinks.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navLinks.forEach(link => {
          const href = link.getAttribute('href');
          if (href === `#${id}`) {
            link.style.color = 'var(--gold)';
          } else if (!link.classList.contains('nav-cta')) {
            link.style.color = '';
          }
        });
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(s => observer.observe(s));
})();

/* ======================== FORMULÁRIO DE CONTATO ========================= */
(function initContactForm() {
  const form = $('#contatoForm');
  if (!form) return;

  const fields = {
    nome:     { el: $('#nome'),     err: $('#nomeError'),     validate: v => v.trim().length >= 2 ? '' : 'Por favor, insira seu nome completo.' },
    email:    { el: $('#email'),    err: $('#emailError'),    validate: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? '' : 'Insira um e-mail válido.' },
    mensagem: { el: $('#mensagem'), err: $('#mensagemError'), validate: v => v.trim().length >= 10 ? '' : 'Sua mensagem deve ter pelo menos 10 caracteres.' },
  };

  const successEl = $('#formSuccess');
  const submitBtn = form.querySelector('[type="submit"]');

  // Validação em tempo real (ao sair do campo)
  Object.values(fields).forEach(({ el, err, validate }) => {
    el.addEventListener('blur', () => {
      const msg = validate(el.value);
      err.textContent = msg;
      el.classList.toggle('error', !!msg);
    });
    el.addEventListener('input', () => {
      if (el.classList.contains('error')) {
        const msg = validate(el.value);
        err.textContent = msg;
        el.classList.toggle('error', !!msg);
      }
    });
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Valida todos os campos
    let valid = true;
    Object.values(fields).forEach(({ el, err, validate }) => {
      const msg = validate(el.value);
      err.textContent = msg;
      el.classList.toggle('error', !!msg);
      if (msg) valid = false;
    });

    if (!valid) return;

    // Estado de loading
    submitBtn.classList.add('loading');
    submitBtn.disabled = true;
    successEl.textContent = '';

    // Simula envio (integre com Formspree, EmailJS, etc.)
    await new Promise(r => setTimeout(r, 1800));

    // Sucesso
    submitBtn.classList.remove('loading');
    submitBtn.disabled = false;
    successEl.textContent = '✓ Mensagem enviada com sucesso! Em breve entrarei em contato.';
    trackAnalyticsEvent('form_submit_contact');

    // Limpa o formulário com animação
    form.querySelectorAll('input, textarea').forEach(el => {
      el.style.transition = 'opacity .4s';
      el.style.opacity = '0.4';
      setTimeout(() => {
        el.value = '';
        el.style.opacity = '1';
      }, 500);
    });

    // Remove mensagem de sucesso após 6s
    setTimeout(() => {
      successEl.style.transition = 'opacity .5s';
      successEl.style.opacity = '0';
      setTimeout(() => {
        successEl.textContent = '';
        successEl.style.opacity = '';
      }, 500);
    }, 6000);
  });
})();

/* ======================== SMOOTH SCROLL COM OFFSET ========================= */
(function initSmoothScroll() {
  const navbarHeight = () => ($('#navbar')?.offsetHeight || 72);

  $$('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href === '#') return;

      const target = $(href);
      if (!target) return;

      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - navbarHeight() - 16;

      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
})();

/* ======================== EFEITO DE DIGITAÇÃO NA HERO ========================= */
(function initTypewriter() {
  const tagline = $('.hero-tagline');
  if (!tagline) return;

  // Apenas adiciona um cursor piscante após o texto do eyebrow
  const eyebrow = $('.hero-eyebrow');
  if (!eyebrow) return;

  const cursor = document.createElement('span');
  cursor.style.cssText = `
    display: inline-block;
    width: 2px;
    height: 0.9em;
    background: var(--gold);
    margin-left: 3px;
    vertical-align: middle;
    border-radius: 1px;
    animation: blinkCursor .75s step-end infinite;
  `;

  // Adiciona estilo da animação dinamicamente
  if (!$('#blinkStyle')) {
    const style = document.createElement('style');
    style.id = 'blinkStyle';
    style.textContent = `
      @keyframes blinkCursor {
        0%, 100% { opacity: 1; }
        50%       { opacity: 0; }
      }
    `;
    document.head.appendChild(style);
  }

  eyebrow.appendChild(cursor);

  // Remove o cursor após 4s (efeito de "terminou de digitar")
  setTimeout(() => {
    cursor.style.transition = 'opacity .5s';
    cursor.style.opacity = '0';
    setTimeout(() => cursor.remove(), 500);
  }, 4000);
})();

/* ======================== PROGRESS BAR DE LEITURA ========================= */
(function initReadingProgress() {
  const bar = document.createElement('div');
  bar.style.cssText = `
    position: fixed; top: 0; left: 0;
    height: 2px;
    background: linear-gradient(90deg, var(--gold-dark), var(--gold-light));
    z-index: 9999;
    width: 0%;
    transition: width .1s linear;
    pointer-events: none;
  `;
  document.body.appendChild(bar);

  let rafId = null;
  window.addEventListener('scroll', () => {
    if (!rafId) {
      rafId = requestAnimationFrame(() => {
        const docH = document.documentElement.scrollHeight - window.innerHeight;
        const pct  = docH > 0 ? (window.scrollY / docH) * 100 : 0;
        bar.style.width = pct + '%';
        rafId = null;
      });
    }
  }, { passive: true });
})();

/* ======================== RIPPLE NOS BOTÕES ========================= */
(function initButtonRipple() {
  $$('.btn, .btn-wpp, .nav-link.nav-cta').forEach(btn => {
    btn.style.position = 'relative';
    btn.style.overflow = 'hidden';

    btn.addEventListener('click', function(e) {
      const rect = this.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const ripple = document.createElement('span');
      ripple.style.cssText = `
        position: absolute;
        border-radius: 50%;
        background: rgba(255,255,255,.25);
        transform: scale(0);
        animation: rippleEffect .55s linear;
        pointer-events: none;
        left: ${x}px;
        top: ${y}px;
        width: 1px; height: 1px;
        margin: -0.5px;
      `;

      if (!$('#rippleStyle')) {
        const style = document.createElement('style');
        style.id = 'rippleStyle';
        style.textContent = `
          @keyframes rippleEffect {
            to { transform: scale(220); opacity: 0; }
          }
        `;
        document.head.appendChild(style);
      }

      this.appendChild(ripple);
      setTimeout(() => ripple.remove(), 600);
    });
  });
})();

/* ======================== COUNTER ANIMADO NOS STATS ========================= */
(function initStatCounters() {
  // Anima números ao entrar na viewport — útil caso adicione stats no futuro
  function animateValue(el, start, end, duration, suffix = '') {
    const startTime = performance.now();
    function update(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(start + (end - start) * eased) + suffix;
      if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  }

  // Exposta globalmente para uso futuro
  window.animateValue = animateValue;
})();

/* ======================== EFEITO GLOW NO HOVER DOS CARDS ESCUROS ========================= */
(function initDarkCardGlow() {
  const cards = $$('.traj-card, .portfolio-card');

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width)  * 100;
      const y = ((e.clientY - rect.top)  / rect.height) * 100;
      card.style.setProperty('--glow-x', x + '%');
      card.style.setProperty('--glow-y', y + '%');
      card.style.backgroundImage = `
        radial-gradient(circle at ${x}% ${y}%, rgba(201,162,39,.07) 0%, transparent 60%),
        none
      `;
    });
    card.addEventListener('mouseleave', () => {
      card.style.backgroundImage = '';
    });
  });
})();

/* ======================== SCROLL SUAVE: STAGGER NOS GRIDS ========================= */
(function initStaggeredReveal() {
  const grids = [
    '.sobre-cards',
    '.skills-grid',
    '.portfolio-grid',
    '.interesses-grid',
    '.trajetoria-grid',
  ];

  grids.forEach(selector => {
    const grid = $(selector);
    if (!grid) return;

    const items = $$(':scope > *', grid);
    items.forEach((item, i) => {
      // Incrementa o delay de forma escalonada se já não tiver --delay
      if (!item.style.getPropertyValue('--delay')) {
        item.style.setProperty('--delay', `${i * 0.07}s`);
      }
    });
  });
})();

/* ======================== FOOTER — ANO DINÂMICO ========================= */
(function initFooterYear() {
  const copy = $('.footer-copy');
  if (!copy) return;
  copy.innerHTML = copy.innerHTML.replace('2025', new Date().getFullYear());
})();

/* ======================== LAZY LOAD DE IMAGENS (future-proof) ========================= */
(function initLazyImages() {
  const imgs = $$('img[data-src]');
  if (!imgs.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.removeAttribute('data-src');
        observer.unobserve(img);
      }
    });
  }, { rootMargin: '200px' });

  imgs.forEach(img => observer.observe(img));
})();

/* ======================== ACCESSIBILITY: SKIP TO CONTENT ========================= */
(function initSkipLink() {
  const skip = document.createElement('a');
  skip.href = '#sobre';
  skip.textContent = 'Pular para o conteúdo';
  skip.style.cssText = `
    position: fixed; top: -100px; left: 1rem;
    background: var(--gold); color: #fff;
    padding: .6rem 1.2rem; border-radius: 0 0 8px 8px;
    font-weight: 700; font-size: .9rem;
    z-index: 10000;
    transition: top .2s;
  `;
  skip.addEventListener('focus', () => skip.style.top = '0');
  skip.addEventListener('blur',  () => skip.style.top = '-100px');
  document.body.prepend(skip);
})();

/* ======================== MAGNETIC EFFECT NOS BOTÕES PRINCIPAIS ========================= */
(function initMagneticButtons() {
  if (!window.matchMedia('(hover: hover)').matches) return;

  $$('.btn-primary, .btn-wpp, .nav-logo').forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const dx = (e.clientX - (rect.left + rect.width  / 2)) * 0.22;
      const dy = (e.clientY - (rect.top  + rect.height / 2)) * 0.22;
      btn.style.transform = `translate(${dx}px, ${dy}px)`;
      btn.style.transition = 'transform .12s ease';
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
      btn.style.transition = 'transform .4s cubic-bezier(.34,1.56,.64,1)';
    });
  });
})();

/* ======================== FAB WPP — SCROLL REVEAL ========================= */
(function initFabReveal() {
  const fab = $('.fab-wpp');
  if (!fab) return;

  fab.style.opacity = '0';
  fab.style.transform = 'scale(0.7) translateY(10px)';
  fab.style.transition = 'opacity .4s, transform .4s cubic-bezier(.34,1.56,.64,1)';

  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
      fab.style.opacity = '1';
      fab.style.transform = '';
    } else {
      fab.style.opacity = '0';
      fab.style.transform = 'scale(0.7) translateY(10px)';
    }
  }, { passive: true });
})();

/* ======================== LOG DE INICIALIZAÇÃO ========================= */
console.log(
  '%c IVF Portfolio %c Carregado com sucesso ✓ ',
  'background:#C9A227;color:#fff;padding:4px 8px;border-radius:4px 0 0 4px;font-weight:700',
  'background:#1A1A1A;color:#C9A227;padding:4px 8px;border-radius:0 4px 4px 0;font-weight:700'
);
