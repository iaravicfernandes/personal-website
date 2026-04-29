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
      
      // Animar as barras de progresso das habilidades
      const bar = entry.target.querySelector('.skill-bar');
      if (bar && bar.dataset.width && !bar.style.width) {
        // Pequeno delay para a animação ficar mais suave
        setTimeout(() => {
          bar.style.width = bar.dataset.width;
        }, 100);
      }
    }
  });
}, { threshold: 0.15, rootMargin: '0px 0px -20px 0px' });

// Observar todos os elementos com classe .reveal
document.querySelectorAll('.reveal').forEach(el => {
  revealObserver.observe(el);
});

// Também observar as skill cards para garantir que as barras sejam animadas
document.querySelectorAll('.skill-card').forEach(card => {
  revealObserver.observe(card);
});

// ---- FORMULÁRIO DE CONTATO com validação melhorada ----
function handleForm() {
  const nome     = document.getElementById('nome');
  const email    = document.getElementById('email');
  const mensagem = document.getElementById('mensagem');
  
  const nomeVal     = nome.value.trim();
  const emailVal    = email.value.trim();
  const mensagemVal = mensagem.value.trim();
  
  let isValid = true;
  
  // Validação do nome
  if (!nomeVal) {
    highlightField(nome);
    isValid = false;
  } else {
    removeHighlight(nome);
  }
  
  // Validação do email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailVal || !emailRegex.test(emailVal)) {
    highlightField(email);
    isValid = false;
  } else {
    removeHighlight(email);
  }
  
  // Validação da mensagem
  if (!mensagemVal || mensagemVal.length < 5) {
    highlightField(mensagem);
    isValid = false;
  } else {
    removeHighlight(mensagem);
  }
  
  if (!isValid) {
    return;
  }
  
  // Simular envio do formulário
  const contactForm = document.getElementById('contactForm');
  const formSuccess = document.getElementById('formSuccess');
  
  if (contactForm && formSuccess) {
    contactForm.style.display = 'none';
    formSuccess.classList.add('show');
    
    // Limpar campos do formulário (opcional)
    nome.value = '';
    email.value = '';
    mensagem.value = '';
    
    // Scroll suave para o sucesso (opcional)
    formSuccess.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
}

// Funções auxiliares para validação visual
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
    
    // Pular se for apenas "#" ou vazio
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
    
    // Se a imagem já estiver carregada
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

// ---- INICIALIZAÇÃO: Verificar imagens já carregadas nos cards ----
document.addEventListener('DOMContentLoaded', function() {
  // Para cada card de portfólio, verificar se a imagem já existe e carregou
  for (let i = 1; i <= 6; i++) {
    const img = document.getElementById('img-card' + i);
    if (img && img.complete && img.naturalHeight !== 0) {
      // Imagem já carregada com sucesso
      showPortfolioImage('card' + i);
    } else if (img && img.src && img.src !== '') {
      // Imagem configurada mas não carregada ainda (o onload vai lidar)
      // Forçar verificação
      img.onload = () => showPortfolioImage('card' + i);
      img.onerror = () => hidePortfolioImage('card' + i);
    } else {
      // Sem imagem, mostrar ícone
      hidePortfolioImage('card' + i);
    }
  }
  
  // Garantir que a navbar comece transparente se estiver no topo
  if (window.scrollY <= 50) {
    navbar.classList.remove('scrolled');
  }
  
  // Adicionar suporte para tema escuro/preferência de movimento (opcional)
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (prefersReducedMotion.matches) {
    document.documentElement.style.scrollBehavior = 'auto';
  }
});

// ---- PREVENIR CLIQUE EM BOTÕES DUPLICADOS NO FORMULÁRIO ----
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

// ---- ANIMAÇÃO EXTRA PARA ÍCONES DAS SKILLS (quando visíveis) ----
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

// Estilo para animação dos ícones (adicionado dinamicamente)
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

// ---- LOG NO CONSOLE APENAS PARA DESENVOLVIMENTO (remover em produção) ----
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
  console.log('🚀 Site Iara Victoria - Modo desenvolvimento');
  console.log('✅ Font Awesome ícones carregados');
  console.log('✅ Scroll reveal ativo');
  console.log('✅ Menu mobile configurado');
}