// ---- NAVBAR: scroll ativo + mudança de estilo ----
const navbar   = document.getElementById('navbar');
const navLinks = document.querySelectorAll('.nav-links a:not(.nav-cta)');
const sections = document.querySelectorAll('section[id]');

window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }

  let current = '';
  sections.forEach(s => {
    const sectionTop = s.offsetTop - 100;
    const sectionBottom = sectionTop + s.offsetHeight;
    if (window.scrollY >= sectionTop && window.scrollY < sectionBottom) {
      current = s.getAttribute('id');
    }
  });
  
  navLinks.forEach(a => {
    a.classList.remove('active');
    const href = a.getAttribute('href');
    if (href === '#' + current) {
      a.classList.add('active');
    }
  });
});

// ---- MENU MOBILE ----
const toggle = document.getElementById('navToggle');
const menu   = document.getElementById('navLinks');

function closeMenu() {
  menu.classList.remove('open');
  toggle.classList.remove('open');
  toggle.setAttribute('aria-expanded', 'false');
  toggle.setAttribute('aria-label', 'Abrir menu');
}

if (toggle) {
  toggle.addEventListener('click', () => {
    menu.classList.toggle('open');
    toggle.classList.toggle('open');
    const isOpen = menu.classList.contains('open');
    toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    toggle.setAttribute('aria-label', isOpen ? 'Fechar menu' : 'Abrir menu');
  });
}

// Fechar menu ao clicar em qualquer link
document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', closeMenu);
});

// Fechar menu ao clicar fora
document.addEventListener('click', (event) => {
  if (!menu || !toggle) return;
  const clickedOutsideMenu = !menu.contains(event.target);
  const clickedOutsideToggle = !toggle.contains(event.target);

  if (menu.classList.contains('open') && clickedOutsideMenu && clickedOutsideToggle) {
    closeMenu();
  }
});

// ---- SCROLL REVEAL com animação das skill-bars ----
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      
      const bar = entry.target.querySelector('.skill-bar');
      if (bar && bar.dataset.width && !bar.style.width) {
        setTimeout(() => {
          bar.style.width = bar.dataset.width;
        }, 100);
      }
    }
  });
}, { threshold: 0.15, rootMargin: '0px 0px -20px 0px' });

document.querySelectorAll('.reveal').forEach(el => {
  revealObserver.observe(el);
});

document.querySelectorAll('.skill-card').forEach(card => {
  revealObserver.observe(card);
});

// ---- FORMULÁRIO DE CONTATO com EmailJS ----
function handleForm() {
  const nome     = document.getElementById('nome');
  const email    = document.getElementById('email');
  const mensagem = document.getElementById('mensagem');
  
  const nomeVal     = nome.value.trim();
  const emailVal    = email.value.trim();
  const mensagemVal = mensagem.value.trim();
  
  let isValid = true;
  
  if (!nomeVal) {
    highlightField(nome);
    isValid = false;
  } else {
    removeHighlight(nome);
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailVal || !emailRegex.test(emailVal)) {
    highlightField(email);
    isValid = false;
  } else {
    removeHighlight(email);
  }
  
  if (!mensagemVal || mensagemVal.length < 5) {
    highlightField(mensagem);
    isValid = false;
  } else {
    removeHighlight(mensagem);
  }
  
  // GA4 — tentativa de envio (mesmo com campos inválidos)
  gtag('event', 'form_tentativa_envio', {
    campos_validos: isValid
  });

  if (!isValid) {
    return;
  }

  const btn = document.getElementById('formBtn');
  btn.disabled = true;
  btn.innerHTML = 'Enviando... <i class="fas fa-spinner fa-spin" style="margin-left: 8px;"></i>';

  emailjs.send("service_bwprer5", "template_bk5k0k8", {
    from_name:  nomeVal,
    from_email: emailVal,
    message:    mensagemVal,
  })
  .then(() => {
    const contactForm = document.getElementById('contactForm');
    const formSuccess = document.getElementById('formSuccess');
    contactForm.style.display = 'none';
    formSuccess.classList.add('show');
    nome.value = '';
    email.value = '';
    mensagem.value = '';
    formSuccess.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

    // GA4 — formulário enviado com sucesso ✅
    gtag('event', 'form_contato_enviado', {
      event_category: 'contato',
      event_label: 'Formulário enviado com sucesso'
    });
  })
  .catch((error) => {
    console.error('Erro ao enviar:', error);
    btn.disabled = false;
    btn.innerHTML = 'Enviar Mensagem <i class="fas fa-arrow-right" style="margin-left: 8px;"></i>';
    alert('Ocorreu um erro ao enviar. Tente novamente ou entre em contato pelo WhatsApp.');

    // GA4 — erro no envio do formulário ❌
    gtag('event', 'form_contato_erro', {
      event_category: 'contato',
      event_label: 'Erro ao enviar formulário'
    });
  });
}

function highlightField(field) {
  field.style.borderColor = '#ef4444';
  field.style.backgroundColor = '#fef2f2';
  setTimeout(() => {
    field.style.borderColor = '';
    field.style.backgroundColor = '';
  }, 2500);
}

function removeHighlight(field) {
  field.style.borderColor = '';
  field.style.backgroundColor = '';
}

// ---- SMOOTH ANCHOR SCROLL com offset da navbar ----
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const targetId = this.getAttribute('href');
    
    if (targetId === '#' || targetId === '') return;
    
    const target = document.querySelector(targetId);
    if (!target) return;
    
    e.preventDefault();
    
    const navbarHeight = navbar ? navbar.offsetHeight : 80;
    const offset = navbarHeight + 20;
    const elementPosition = target.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.scrollY - offset;
    
    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });
  });
});

// ---- IMAGENS DOS CARDS DE PORTFÓLIO (com fallback para ícones) ----
function showPortfolioImage(cardId) {
  const img     = document.getElementById('img-' + cardId);
  const icon    = document.getElementById('emoji-' + cardId);
  const overlay = document.getElementById('overlay-' + cardId);

  if (img) {
    img.style.display = 'block';
    img.style.opacity = '0';
    img.style.transition = 'opacity 0.4s ease';
    
    if (img.complete && img.naturalHeight !== 0) {
      img.style.opacity = '1';
    } else {
      img.onload = () => { 
        img.style.opacity = '1'; 
      };
    }
  }
  if (overlay) overlay.style.display = 'block';
  if (icon) icon.style.display = 'none';
}

function hidePortfolioImage(cardId) {
  const img     = document.getElementById('img-' + cardId);
  const icon    = document.getElementById('emoji-' + cardId);
  const overlay = document.getElementById('overlay-' + cardId);

  if (img) {
    img.style.display = 'none';
    img.style.opacity = '0';
  }
  if (overlay) overlay.style.display = 'none';
  if (icon) icon.style.display = 'block';
}

// ---- INICIALIZAÇÃO ----
document.addEventListener('DOMContentLoaded', function() {

  // GA4 — rastrear clique no botão de WhatsApp
  const whatsappBtn = document.querySelector('.whatsapp-btn');
  if (whatsappBtn) {
    whatsappBtn.addEventListener('click', () => {
      gtag('event', 'click_whatsapp', {
        event_category: 'contato',
        event_label: 'Botão WhatsApp'
      });
    });
  }

  // GA4 — rastrear clique no botão "Entrar em Contato" do hero
  const heroCta = document.querySelector('.hero-actions .btn-primary');
  if (heroCta) {
    heroCta.addEventListener('click', () => {
      gtag('event', 'click_cta_hero', {
        event_category: 'engajamento',
        event_label: 'CTA Hero — Entrar em Contato'
      });
    });
  }

  // GA4 — rastrear clique no e-mail
  const emailLink = document.querySelector('a[href^="mailto:"]');
  if (emailLink) {
    emailLink.addEventListener('click', () => {
      gtag('event', 'click_email', {
        event_category: 'contato',
        event_label: 'Link de e-mail'
      });
    });
  }

  // GA4 — rastrear até onde o visitante rolou a página (25%, 50%, 75%, 100%)
  const scrollMilestones = { 25: false, 50: false, 75: false, 100: false };
  window.addEventListener('scroll', () => {
    const scrolled = Math.round(
      (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100
    );
    for (const milestone in scrollMilestones) {
      if (!scrollMilestones[milestone] && scrolled >= milestone) {
        scrollMilestones[milestone] = true;
        gtag('event', 'scroll_profundidade', {
          event_category: 'engajamento',
          event_label: `Rolou ${milestone}% da página`
        });
      }
    }
  });

  // GA4 — rastrear qual seção o visitante visualizou
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        gtag('event', 'secao_visualizada', {
          event_category: 'engajamento',
          event_label: entry.target.getAttribute('id')
        });
      }
    });
  }, { threshold: 0.4 });

  document.querySelectorAll('section[id]').forEach(section => {
    sectionObserver.observe(section);
  });

  // Inicialização dos cards de portfólio
  for (let i = 1; i <= 6; i++) {
    const img = document.getElementById('img-card' + i);
    if (img && img.complete && img.naturalHeight !== 0) {
      showPortfolioImage('card' + i);
    } else if (img && img.src && img.src !== '') {
      img.onload = () => showPortfolioImage('card' + i);
      img.onerror = () => hidePortfolioImage('card' + i);
    } else {
      hidePortfolioImage('card' + i);
    }
  }
  
  if (window.scrollY <= 50) {
    navbar.classList.remove('scrolled');
  }
  
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (prefersReducedMotion.matches) {
    document.documentElement.style.scrollBehavior = 'auto';
  }
});

// ---- PREVENIR CLIQUE DUPLO NO FORMULÁRIO ----
let isSubmitting = false;
const originalHandleForm = handleForm;
window.handleForm = function() {
  if (isSubmitting) return;
  isSubmitting = true;
  originalHandleForm();
  setTimeout(() => {
    isSubmitting = false;
  }, 2000);
};

// ---- ANIMAÇÃO DOS ÍCONES DAS SKILLS ----
const skillObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const icon = entry.target.querySelector('.skill-icon');
      if (icon) {
        icon.style.animation = 'iconPop 0.5s cubic-bezier(0.34, 1.2, 0.64, 1) forwards';
        setTimeout(() => {
          if (icon) icon.style.animation = '';
        }, 500);
      }
      skillObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

document.querySelectorAll('.skill-card').forEach(card => {
  skillObserver.observe(card);
});

const style = document.createElement('style');
style.textContent = `
  @keyframes iconPop {
    0% { transform: scale(0.8); opacity: 0; }
    50% { transform: scale(1.1); }
    100% { transform: scale(1); opacity: 1; }
  }
  .skill-icon {
    animation: none;
  }
  .form-success.show {
    display: block !important;
    animation: fadeInUp 0.5s ease;
  }
  .hero-stat-num {
    transition: all 0.3s ease;
  }
  .hero-stat-num:hover {
    color: var(--gold-soft);
    transform: translateY(-2px);
  }
`;
document.head.appendChild(style);
