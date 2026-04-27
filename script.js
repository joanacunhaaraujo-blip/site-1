document.addEventListener('DOMContentLoaded', () => {
  initLegacyRedirect();
  initMobileNav();
  initSmoothScroll();
  initNavbarWatcher();
  initBackToTop();
  initProgressObserver();
  initRevealObserver();
  initParallax();
  initStaggeredAnimations();
  initPortfolioTabs();
  initLanguageToggle();
  initCurrentYear();
  initScrollProgress();
  initCustomCursor();
});

function initScrollProgress() {
  const bar = document.getElementById('scroll-progress');
  if (!bar) return;
  const update = () => {
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.transform = `scaleX(${scrollable > 0 ? window.scrollY / scrollable : 0})`;
  };
  window.addEventListener('scroll', update, { passive: true });
}

function initCustomCursor() {
  if (window.matchMedia('(pointer: coarse)').matches) return;
  const dot  = document.createElement('span');
  const ring = document.createElement('span');
  dot.className  = 'cursor-dot';
  ring.className = 'cursor-ring';
  document.body.appendChild(dot);
  document.body.appendChild(ring);
  let mx = -200, my = -200, rx = -200, ry = -200;
  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    dot.style.transform = `translate(${mx}px,${my}px)`;
  }, { passive: true });
  const lerp = (a, b, t) => a + (b - a) * t;
  const tick = () => {
    rx = lerp(rx, mx, 0.1); ry = lerp(ry, my, 0.1);
    ring.style.transform = `translate(${rx}px,${ry}px)`;
    requestAnimationFrame(tick);
  };
  tick();
  document.querySelectorAll('a,button,.project-card,.skill-tag,.contact-row').forEach(el => {
    el.addEventListener('mouseenter', () => { dot.classList.add('cursor-dot--hover'); ring.classList.add('cursor-ring--hover'); });
    el.addEventListener('mouseleave', () => { dot.classList.remove('cursor-dot--hover'); ring.classList.remove('cursor-ring--hover'); });
  });
}

function initCurrentYear() {
  document.querySelectorAll('[data-current-year]').forEach(el => {
    el.textContent = new Date().getFullYear();
  });
}

function initLegacyRedirect() {
  if (!window.location || !window.location.pathname) return;
  const legacySlugs = ['projects', 'projects', 'projetos'];
  const canonicalHome = `${window.location.origin}/`;
  const normalizePath = path => path.replace(/\/+$/, '').toLowerCase() || '/';
  const pathname = normalizePath(window.location.pathname);
  const currentUrl = window.location.href.toLowerCase();
  const canonicalLower = canonicalHome.toLowerCase();
  const isLegacyPath = legacySlugs.some(slug => {
    const slugPath = `/${slug}`;
    return pathname === slugPath || pathname.startsWith(`${slugPath}/`);
  });
  const isLegacyUrl = legacySlugs.some(slug => {
    const slugUrl = `${canonicalLower}${slug}`;
    return currentUrl === slugUrl ||
      currentUrl.startsWith(`${slugUrl}/`) ||
      currentUrl.startsWith(`${slugUrl}?`) ||
      currentUrl.startsWith(`${slugUrl}#`);
  });
  if (isLegacyPath || isLegacyUrl) {
    window.location.replace(canonicalHome);
  }
}

function initMobileNav() {
  const navToggle = document.getElementById('nav-toggle');
  const menu = document.getElementById('menu');
  if (!navToggle || !menu) return;

  navToggle.addEventListener('click', () => {
    const isOpen = menu.classList.toggle('show');
    navToggle.classList.toggle('is-open', isOpen);
    navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    navToggle.setAttribute('aria-label', isOpen ? 'Fechar menu' : 'Abrir menu');
    document.body.classList.toggle('nav-open', isOpen);
  });

  menu.querySelectorAll('.link').forEach(link => {
    link.addEventListener('click', () => {
      if (menu.classList.contains('show')) {
        menu.classList.remove('show');
        navToggle.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
        navToggle.setAttribute('aria-label', 'Abrir menu');
        document.body.classList.remove('nav-open');
      }
    });
  });
}

function smoothScrollTo(targetY, duration = 900) {
  const startY = window.scrollY || window.pageYOffset;
  const distance = targetY - startY;
  let startTime = null;

  const easing = t => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

  const step = timestamp => {
    if (!startTime) startTime = timestamp;
    const elapsed = timestamp - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = easing(progress);
    window.scrollTo(0, startY + distance * eased);
    if (elapsed < duration) requestAnimationFrame(step);
  };

  requestAnimationFrame(step);
}

function initSmoothScroll() {
  const selectors = [
    '.link[href^="#"]',
    '.btn-outline[href^="#"]',
    '.icon-link[href^="#"]',
    '.see-more-btn[href^="#"]'
  ];
  const links = document.querySelectorAll(selectors.join(', '));
  if (!links.length) return;
  links.forEach(link => {
    link.addEventListener('click', event => {
      const hash = link.getAttribute('href');
      if (!hash || hash === '#' || !hash.startsWith('#')) return;
      const target = document.querySelector(hash);
      if (target) {
        event.preventDefault();
        const offset = document.querySelector('.custom-navbar')?.offsetHeight || 70;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        smoothScrollTo(top, 1100);
      }
    });
  });
}

function initNavbarWatcher() {
  const navbar = document.querySelector('.custom-navbar');
  const header = document.querySelector('.header');
  const logoImg = document.querySelector('.logo img');
  if (!navbar) return;

  const originalLogo = logoImg ? logoImg.getAttribute('src') : null;
  const scrolledLogo = 'logo3.png';

  const updateNavbar = () => {
    const threshold = (header?.offsetHeight || 120) - 80;
    if (window.scrollY > threshold) {
      navbar.classList.add('scrolled');
      if (logoImg && scrolledLogo) logoImg.setAttribute('src', scrolledLogo);
    } else {
      navbar.classList.remove('scrolled');
      if (logoImg && originalLogo) logoImg.setAttribute('src', originalLogo);
    }
  };

  updateNavbar();
  window.addEventListener('scroll', updateNavbar);
}

function initBackToTop() {
  const button = document.getElementById('backToTop');
  const contactSection = document.getElementById('contact');
  const footer = document.querySelector('.footer');
  if (!button) return;

  const toggleVisibility = visible => {
    button.classList.toggle('show', Boolean(visible));
  };

  if ('IntersectionObserver' in window && (contactSection || footer)) {
    const targets = [contactSection, footer].filter(Boolean);
    const observer = new IntersectionObserver(entries => {
      const anyVisible = entries.some(entry => entry.isIntersecting);
      toggleVisibility(anyVisible);
    }, { threshold: 0.15 });
    targets.forEach(target => observer.observe(target));
  } else {
    const checkPosition = () => {
      const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
      let isVisible = false;
      [contactSection, footer].forEach(el => {
        if (el && !isVisible) {
          const rect = el.getBoundingClientRect();
          isVisible = rect.top < viewportHeight && rect.bottom > 0;
        }
      });
      toggleVisibility(isVisible);
    };
    checkPosition();
    window.addEventListener('scroll', checkPosition, { passive: true });
    window.addEventListener('resize', checkPosition);
  }

  button.addEventListener('click', () => {
    const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) {
      window.scrollTo(0, 0);
    } else if (typeof smoothScrollTo === 'function') {
      smoothScrollTo(0, 900);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  });
}

function initProgressObserver() {
  const progressBars = document.querySelectorAll('.progress-bar');
  if (!progressBars.length) return;

  const animate = bar => {
    const percent = bar.getAttribute('data-percent') || '0';
    bar.style.width = `${percent}%`;
  };

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animate(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    progressBars.forEach(bar => observer.observe(bar));
  } else {
    progressBars.forEach(animate);
  }
}

function initRevealObserver() {
  const revealEls = document.querySelectorAll('.reveal');
  if (!revealEls.length) return;

  const reveal = el => el.classList.add('is-visible');

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          reveal(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    revealEls.forEach(el => observer.observe(el));
  } else {
    revealEls.forEach(reveal);
  }
}

function initParallax() {
  const layers = Array.from(document.querySelectorAll('[data-parallax]'));
  if (!layers.length) return;

  const reduceMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  const prefersReducedMotion = () => reduceMotionQuery.matches;
  const getMotionFactor = () => (prefersReducedMotion() ? 0.35 : 1);
  const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
  const resetScrollOffsets = layer => {
    layer.style.setProperty('--parallax-scroll-x', '0px');
    layer.style.setProperty('--parallax-scroll-y', '0px');
  };
  const resetPointerOffsets = layer => {
    layer.style.setProperty('--parallax-pointer-x', '0px');
    layer.style.setProperty('--parallax-pointer-y', '0px');
  };

  const pointerLayers = layers.filter(layer => parseFloat(layer.dataset.parallaxPointer));

  let scrollTicking = false;
  const updateScroll = () => {
    const viewportCenterY = window.innerHeight / 2;
    const viewportCenterX = window.innerWidth / 2;
    const motionFactor = getMotionFactor();

    layers.forEach(layer => {
      const speed = parseFloat(layer.dataset.parallax) || 0;
      if (!speed) {
        resetScrollOffsets(layer);
        return;
      }

      const rect = layer.getBoundingClientRect();
      const layerCenterY = rect.top + rect.height / 2;
      const layerCenterX = rect.left + rect.width / 2;

      const verticalShift = clamp(-(layerCenterY - viewportCenterY) * speed * 0.3 * motionFactor, -200, 200);
      const horizontalShift = clamp(-(layerCenterX - viewportCenterX) * speed * 0.2 * motionFactor, -150, 150);

      const axis = (layer.dataset.parallaxAxis || 'y').toLowerCase();
      const includeX = axis.includes('x');
      const includeY = axis.includes('y');

      layer.style.setProperty('--parallax-scroll-x', includeX ? `${horizontalShift}px` : '0px');
      layer.style.setProperty('--parallax-scroll-y', includeY || !includeX ? `${verticalShift}px` : '0px');
    });

    scrollTicking = false;
  };

  const requestScrollTick = () => {
    if (!scrollTicking) {
      requestAnimationFrame(updateScroll);
      scrollTicking = true;
    }
  };

  updateScroll();
  window.addEventListener('scroll', requestScrollTick, { passive: true });
  window.addEventListener('resize', requestScrollTick);

  if (!pointerLayers.length) return;

  let pointerTicking = false;
  let pointerTarget = { x: 0, y: 0 };

  const updatePointer = () => {
    const motionFactor = getMotionFactor();
    pointerLayers.forEach(layer => {
      const pointerSpeed = parseFloat(layer.dataset.parallaxPointer) || 0;
      if (!pointerSpeed) {
        resetPointerOffsets(layer);
        return;
      }

      const maxPointer = parseFloat(layer.dataset.parallaxPointerMax || '40') || 40;
      const shiftX = clamp(pointerTarget.x * pointerSpeed * maxPointer * motionFactor, -maxPointer, maxPointer);
      const shiftY = clamp(pointerTarget.y * pointerSpeed * maxPointer * 0.6 * motionFactor, -maxPointer, maxPointer);

      layer.style.setProperty('--parallax-pointer-x', `${shiftX}px`);
      layer.style.setProperty('--parallax-pointer-y', `${shiftY}px`);
    });

    pointerTicking = false;
  };

  const handlePointerMove = event => {
    const point = event.touches && event.touches[0] ? event.touches[0] : event;
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;

    pointerTarget = {
      x: clamp((point.clientX - cx) / cx, -1, 1),
      y: clamp((point.clientY - cy) / cy, -1, 1)
    };

    if (!pointerTicking) {
      requestAnimationFrame(updatePointer);
      pointerTicking = true;
    }
  };

  const resetPointer = () => {
    pointerLayers.forEach(resetPointerOffsets);
  };

  window.addEventListener('pointermove', handlePointerMove, { passive: true });
  window.addEventListener('touchmove', handlePointerMove, { passive: true });
  window.addEventListener('pointerleave', resetPointer);
  window.addEventListener('touchend', resetPointer);
  window.addEventListener('blur', resetPointer);

  const handleReduceMotionChange = () => {
    resetPointer();
    updateScroll();
    if (pointerLayers.length) {
      pointerTicking = false;
      requestAnimationFrame(updatePointer);
    }
  };

  if (typeof reduceMotionQuery.addEventListener === 'function') {
    reduceMotionQuery.addEventListener('change', handleReduceMotionChange);
  } else if (typeof reduceMotionQuery.addListener === 'function') {
    reduceMotionQuery.addListener(handleReduceMotionChange);
  }
}

function initPortfolioTabs() {
  const section = document.getElementById('portfolio');
  if (!section) return;

  const tabs = section.querySelectorAll('.portfolio-tab');
  const cards = section.querySelectorAll('.project-card');
  if (!tabs.length || !cards.length) return;

  const activate = filter => {
    if (!filter) return;
    tabs.forEach(tab => tab.classList.toggle('is-active', tab.dataset.filter === filter));
    cards.forEach(card => {
      const match = card.dataset.category === filter;
      card.classList.toggle('is-hidden', !match);
    });
  };

  tabs.forEach(tab => {
    tab.addEventListener('click', () => activate(tab.dataset.filter));
  });

  activate(tabs[0]?.dataset.filter || 'websites');
}

function initStaggeredAnimations() {
  const configs = [
    { container: '.skill-tags', items: '.skill-tag' },
    {
      container: '.timeline',
      items: '.timeline-item',
      onReveal: timeline => timeline.classList.add('is-animated')
    },
    { container: '.portfolio-grid', items: '.project-card' }
  ];

  const groups = [];
  const groupMap = new Map();

  configs.forEach(config => {
    document.querySelectorAll(config.container).forEach(containerEl => {
      const items = containerEl.querySelectorAll(config.items);
      if (!items.length) return;
      items.forEach((item, index) => {
        item.style.setProperty('--stagger', `${index * 80}ms`);
      });
      const payload = { container: containerEl, items, config };
      groups.push(payload);
      groupMap.set(containerEl, payload);
    });
  });

  if (!groups.length) return;

  if (!('IntersectionObserver' in window)) {
    groups.forEach(({ items, config, container }) => {
      config?.onReveal?.(container);
      items.forEach(item => item.classList.add('is-visible'));
    });
    return;
  }

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const group = groupMap.get(entry.target);
        if (!group) return;
        group.config?.onReveal?.(group.container);
        group.items.forEach(item => item.classList.add('is-visible'));
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.2 }
  );

  groups.forEach(({ container }) => observer.observe(container));
}

function initLanguageToggle() {
  const langToggle = document.getElementById('lang-toggle');
  if (!langToggle) return;

  let currentLang = localStorage.getItem('siteLang') || 'PT';
  setLanguage(currentLang);
  langToggle.textContent = currentLang === 'PT' ? 'EN' : 'PT';

  langToggle.addEventListener('click', () => {
    currentLang = currentLang === 'PT' ? 'EN' : 'PT';
    localStorage.setItem('siteLang', currentLang);
    setLanguage(currentLang);
    langToggle.textContent = currentLang === 'PT' ? 'EN' : 'PT';
  });
}

const translations = {
  PT: {
    nav: ["Início", "Sobre Mim", "Competências", "Portfolio", "CV", "Contactos"],
    header: {
      eyebrow: "Designer & Frontend Developer",
      up: "Olá, sou a",
      down: "Joana Araújo",
      lede: "Crio identidades digitais e interfaces profissionais e envolventes, juntando pesquisa, storytelling e desenvolvimento frontend para experiências que ficam na memória.",
      contact: "Contacte-me!",
      ctaSecondary: "Ver portfolio",
      stats: [
        { value: "+20", label: "Projetos digitais" },
        { value: "5", label: "Marcas acompanhadas" },
        { value: "3", label: "Anos a criar interfaces" }
      ],
      scrollHint: "Ver mais"
    },
    about: {
      subtitle: "Quem sou?",
      title: "Perfil Profissional",
      text: `Sou licenciada em Multimédia e Tecnologias da Comunicação e estou a concluir o Mestrado em Multimédia na Universidade do Porto. Trabalho atualmente na área do design de comunicação, multimédia e programação de interfaces de utilizador. Interesso-me especialmente por edição de vídeo, design gráfico e frontend, áreas onde consigo juntar criatividade, pensamento visual e componente técnica. Gosto de desenvolver soluções digitais e experiências visuais funcionais, intuitivas e visualmente consistentes.`,
      professionalTitle: "Percurso Profissional",
      professional: [
        {
          title: "Invisible Cloud",
          role: "Design de Comunicação, Multimédia e Programação de Interfaces de Utilizador",
          date: "Abril 2026 - Presente",
          desc: "Desenvolvo soluções digitais, conteúdos multimédia e interfaces de utilizador, com foco em clareza visual, usabilidade e consistência."
        },
        {
          title: "Invisible Cloud",
          role: "Estágio IEFP",
          date: "Outubro 2025 - Março 2026",
          desc: "Colaborei em projetos digitais na área do multimédia, design e interfaces, consolidando competências em contexto profissional."
        },
        {
          title: "Desenvolvimento Web Freelance",
          date: "2025",
          desc: "Crio websites e portfólios digitais de forma autónoma, acompanhando o processo desde a componente visual até à implementação funcional."
        }
      ],
      academicTitle: "Percurso Académico",
      academic: [
        { title: "Universidade do Porto", role: "Mestrado em Multimédia", date: "2024 - Presente" },
        { title: "Universidade de Aveiro", role: "Licenciatura em Multimédia e Tecnologias da Comunicação", date: "2021 - 2024" }
      ],
      download: "Descarregar CV"
    },
    competencias: {
      subtitle: "As minhas",
      title: "Competências",
      groups: [
        {
          title: "Desenvolvimento & Tecnologias",
          items: [
            "HTML5",
            "CSS3 (Flexbox, Grid)",
            "JavaScript (ES6+)",
            "TypeScript",
            "React",
            "React Router",
            "Tailwind CSS",
            "Bootstrap",
            "CSS Animations",
            "Git & GitHub",
            "Vite",
            "npm",
            "i18n",
            "Node.js",
            "PHP",
            "SQL",
            "REST APIs"
          ]
        },
        {
          title: "Ferramentas & Workflow",
          items: [
            "Netlify",
            "GitHub Actions",
            "Docker (básico)",
            "Figma",
            "Design Systems",
            "Wireframing / Prototipagem",
            "Agile / Scrum",
            "Visual Studio Code",
            "GitHub Desktop",
            "Notion",
            "Terminal / Shell",
            "XAMPP"
          ]
        },
        {
          title: "Design & Multimédia",
          items: ["Figma", "Canva", "Photoshop", "Illustrator", "Inkscape", "Final Cut Pro"]
        }
      ]
    },
    portfolio: {
      subtitle: "Projetos em destaque",
      title: "O meu portfolio",
      tabs: {
        websites: "WebSites",
        prototipos: "Protótipos",
        outros: "Outros"
      },
      cards: {
        "site-estagio": {
          date: "2025",
          title: "Site desenvolvido em Estágio Profissional",
          desc: "No meu estágio profissional fiz o redesign do website da empresa.",
          cta: "Ver Site"
        },
        "site-psicologo": {
          date: "2025",
          title: "Site desenvolvido para Psicólogo",
          desc: "Website desenvolvido para cliente real, focado em experiência do utilizador.",
          cta: "Ver Site"
        },
        "site-thinkalike": {
          date: "2025",
          title: "Thinkalike",
          desc: "Site desenvolvido para representar uma startup fictícia no âmbito do mestrado.",
          cta: "Ver Site"
        },
    
        "site-forecast": {
          date: "2023",
          title: "Aplicação de Previsão do Tempo",
          desc: "Aplicação ReactJS para previsão meteorológica de qualquer cidade.",
          cta: "Ver Projeto"
        },
        // Pacman card for PT
        "site-pacman": {
          date: "2025",
          title: "Pac Power (Godot)",
          desc: "Jogo Pacman desenvolvido em Godot — build web disponível.",
          cta: "Ver Jogo"
        },
        "proto-feup": {
          date: "2025",
          title: "FEUP Booking System",
          desc: "Protótipo de um sistema de reservas para a FEUP, desenvolvido em Figma.",
          cta: "Ver Protótipo"
        },
        "proto-uacontece": {
          date: "2024",
          title: "Uacontece",
          desc: "Protótipo Figma para a aplicação Uacontece, projeto final de licenciatura.",
          cta: "Ver Protótipo"
        }
      }
    },
    parallel: [
      {
        eyebrow: "Processo em paralelo",
        title: "Design e desenvolvimento em diálogo contínuo",
        copy: "Enquanto mergulho na identidade da marca, prototipo e valido interfaces em ciclos curtos para manter ritmo e consistência.",
        list: [
          "Discovery sprints e UX research",
          "Arquitetura de informação & design systems",
          "Prototipagem interativa e testes rápidos"
        ]
      },
      {
        eyebrow: "Experiências imersivas",
        title: "Camadas que dão vida à identidade digital",
        copy: "Misturo tipografia, motion e microinterações desenvolvidas em frontend moderno para experiências fluidas e memoráveis.",
        metrics: [
          { label: "Entrega média", value: "3-4 semanas" },
          { label: "Stack", value: "Figma · React · GSAP" }
        ]
      }
    ],
    contact: {
      subtitle: "Os meus",
      title: "Contactos",
      location: "Porto, Portugal ",
      note: "Conte-me sobre o desafio, utilizadores e métricas de sucesso — envio proposta com roadmap e estimativa.",
      response: "Tempo médio de resposta: 24h",
      linkedinLabel: "LinkedIn"
    },
    footer: "© <span data-current-year></span> Todos os direitos reservados a <span style=\"font-weight: 600;\"> Joana Araújo </span>",
    pages: {
      projects: {
        hero: {
          eyebrow: "Estudos de Caso",
          title: "Sites &",
          highlight: "Projetos",
          desc: "Uma seleção de interfaces interativas e websites que desenvolvi em contexto académico e para clientes.",
          badge: "Atualizado · 2025"
        },
        figmaTitle: "Protótipos Figma",
        figmaCards: [
          { title: "FEUP Booking System", desc: "Protótipo de um sistema de reservas para a FEUP, desenvolvido em Figma.", link: "Ver Protótipo" },
          { title: "Uacontece", desc: "Protótipo Figma para a aplicação Uacontece, projeto final de licenciatura.", link: "Ver Protótipo" }
        ],
        sitesTitle: "Sites Desenvolvidos",
        siteCards: [
          { title: "Site desenvolvido em Estágio Profissional", desc: "No meu estágio profissional fiz o redesign do website da empresa.", link: "Ver Site" },
          { title: "Site desenvolvido para Psicólogo", desc: "Website desenvolvido para cliente real, focado na experiência do utilizador.", link: "Ver Site" },
          { title: "Thinkalike", desc: "Site desenvolvido para representar uma startup fictícia no âmbito do mestrado.", link: "Ver Site" },
          { title: "YOUNIVERSE", desc: "Aplicação interativa em JavaScript e SQL para explorar o Sistema Solar.", link: "GitHub" },
          { title: "Aplicação de Previsão do Tempo", desc: "Aplicação ReactJS para previsão meteorológica de qualquer cidade.", link: "Ver Projeto" },
          { title: "Eco Savvy", desc: "Site interativo sobre a poluição do mar, desenvolvido em grupo.", link: "Ver Projeto" }
        ]
      },
      photos: {
        hero: {
          eyebrow: "Portfolio Visual",
          title: "Fotografia &",
          highlight: "Storytelling",
          desc: "Exploro cor, composição e direção de arte para construir narrativas visuais envolventes.",
          badge: "Series · 2021-2025"
        }
      },
      videos: {
        hero: {
          eyebrow: "Motion & Storytelling",
          title: "Vídeos &",
          highlight: "Animação",
          desc: "Da pesquisa à pós-produção, crio narrativas audiovisuais que unem emoção, ritmo e direção artística.",
          badge: "Showreel · 2021-2025"
        },
        academicTitle: "Âmbito Académico",
        personalTitle: "Âmbito Pessoal",
        intro: "Para mim, o multimédia é mais do que uma profissão, é uma forma de contar histórias e criar experiências. Viajar tem sido uma das minhas maiores inspirações, permitindo-me capturar momentos únicos. Cada vídeo que criei é um reflexo da minha visão criativa e do meu interesse e amor pela edição e produção de vídeos. Ao partilhar estes trabalhos, pretendo mostrar não só as minhas competências técnicas, mas também o meu hobbie em criar conteúdos.",
        academicVideos: [
          {
            badge: "Animação",
            title: "Animação - A Cegonha Azarada",
            desc: "No âmbito da cadeira de Vídeo Animação elaborei em grupo uma animação. A narrativa acompanha uma cegonha azarada que enfrenta vários obstáculos até entregar um bebé à sua família."
          },
          {
            badge: "Curta",
            title: "Curta-Metragem - Amor pela Inteligência Artificial",
            desc: "Projeto desenvolvido na unidade de Vídeo e Animação sobre uma jovem que se apaixona por uma inteligência artificial."
          }
        ],
        countries: {
          thailand: "Tailândia",
          madeira: "Madeira",
          cambodia: "Camboja",
          italy: "Itália",
          greece: "Grécia",
          netherlands: "Países Baixos"
        }
      }
    }
  },
  EN: {
    nav: ["Home", "About", "Skills", "Portfolio", "CV", "Contact"],
    header: {
      eyebrow: "Designer & Frontend Developer",
      up: "Hi, I'm",
      down: "Joana Araújo",
      lede: "I craft beautiful, immersive digital identities and interfaces by blending research, storytelling, and frontend development into memorable experiences.",
      contact: "Get in touch!",
      ctaSecondary: "See portfolio",
      stats: [
        { value: "+20", label: "Digital projects" },
        { value: "5", label: "Brands supported" },
        { value: "3", label: "Years designing interfaces" }
      ],
      scrollHint: "Ver mais"
    },
    about: {
      subtitle: "Who am I?",
      title: "Professional Profile",
      text: `I hold a Bachelor's degree in Multimedia and Communication Technologies and I am completing my Master's in Multimedia at the University of Porto. I currently work in communication design, multimedia, and user interface programming. I am especially interested in video editing, graphic design, and frontend development, areas where I can bring together creativity, visual thinking, and technical skills. I enjoy developing digital solutions and visual experiences that are functional, intuitive, and visually consistent.`,
      professionalTitle: "Professional Experience",
      professional: [
        {
          title: "Invisible Cloud",
          role: "Communication Design, Multimedia, and User Interface Programming",
          date: "April 2026 - Present",
          desc: "I develop digital solutions, multimedia content, and user interfaces, focusing on visual clarity, usability, and consistency."
        },
        {
          title: "Invisible Cloud",
          role: "IEFP Internship",
          date: "October 2025 - March 2026",
          desc: "I collaborated on digital projects in multimedia, design, and interfaces, consolidating my skills in a professional context."
        },
        {
          title: "Freelance Web Development",
          date: "2025",
          desc: "I create websites and digital portfolios independently, following the process from visual design through to functional implementation."
        }
      ],
      academicTitle: "Academic Background",
      academic: [
        { title: "University of Porto", role: "Master's in Multimedia", date: "2024 - Present" },
        { title: "University of Aveiro", role: "Bachelor's in Multimedia and Communication Technologies", date: "2021 - 2024" }
      ],
      download: "Download CV"
    },
    competencias: {
      subtitle: "My",
      title: "Skills",
      groups: [
        {
          title: "Development & Technologies",
          items: [
            "HTML5",
            "CSS3 (Flexbox, Grid)",
            "JavaScript (ES6+)",
            "TypeScript",
            "React",
            "React Router",
            "Tailwind CSS",
            "Bootstrap",
            "CSS Animations",
            "Git & GitHub",
            "Vite",
            "npm",
            "i18n",
            "Node.js",
            "PHP",
            "SQL",
            "REST APIs"
          ]
        },
        {
          title: "Tools & Workflow",
          items: [
            "Netlify",
            "GitHub Actions",
            "Docker (basic)",
            "Figma",
            "Design Systems",
            "Wireframing / Prototyping",
            "Agile / Scrum",
            "Visual Studio Code",
            "GitHub Desktop",
            "Notion",
            "Terminal / Shell",
            "XAMPP"
          ]
        },
        {
          title: "Design & Multimedia",
          items: ["Figma", "Canva", "Photoshop", "Illustrator", "Inkscape", "Final Cut Pro"]
        }
      ]
    },
    portfolio: {
      subtitle: "Featured projects",
      title: "My portfolio",
      tabs: {
        websites: "Websites",
        prototipos: "Prototypes",
        outros: "Other"
      },
      cards: {
        "site-estagio": {
          date: "2024",
          title: "Professional Internship Website",
          desc: "During my professional internship I redesigned the company's website.",
          cta: "View Site"
        },
        "site-psicologo": {
          date: "2024",
          title: "Psychologist Website",
          desc: "Website created for a real client with a strong focus on user experience.",
          cta: "View Site"
        },
        "site-thinkalike": {
          date: "2023",
          title: "Thinkalike",
          desc: "Website built to showcase a fictional startup during my Master's degree.",
          cta: "View Site"
        },
        "site-youniverse": {
          date: "2022",
          title: "YOUNIVERSE",
          desc: "Interactive JavaScript + SQL experience to explore the Solar System.",
          cta: "GitHub"
        },
        "site-forecast": {
          date: "2023",
          title: "Weather Forecast App",
          desc: "ReactJS application that surfaces weather data for any city.",
          cta: "View Project"
        },
        // Pacman card for EN
        "site-pacman": {
          date: "2025",
          title: "Pac Power (Godot)",
          desc: "Pacman game built in Godot — web build available.",
          cta: "Play Game"
        },
        "proto-feup": {
          date: "2024",
          title: "FEUP Booking System",
          desc: "Figma prototype for the FEUP booking workflow.",
          cta: "View Prototype"
        },
        "proto-uacontece": {
          date: "2024",
          title: "Uacontece",
          desc: "Figma prototype for the Uacontece app, my bachelor's capstone project.",
          cta: "View Prototype"
        }
      }
    },
    parallel: [
      {
        eyebrow: "Parallel workflow",
        title: "Design and development in constant dialogue",
        copy: "While I dive into brand insights, I prototype and validate interfaces in short cycles to keep momentum and consistency.",
        list: [
          "Discovery sprints & UX research",
          "Information architecture & design systems",
          "Interactive prototyping and rapid testing"
        ]
      },
      {
        eyebrow: "Immersive experiences",
        title: "Layers that bring digital identities to life",
        copy: "I mix typography, motion, and modern frontend micro-interactions to craft fluid, memorable experiences.",
        metrics: [
          { label: "Average delivery", value: "3-4 weeks" },
          { label: "Stack", value: "Figma · React · GSAP" }
        ]
      }
    ],
    contact: {
      subtitle: "My",
      title: "Contacts",
      lead: "Let's chat?.",
      location: "Porto, Portugal",
      response: "Average response time: 24h",
      linkedinLabel: "LinkedIn"
    },
    footer: "© <span data-current-year></span> All rights reserved to <span style=\"font-weight: 600;\"> Joana Araújo </span>",
    pages: {
      projects: {
        hero: {
          eyebrow: "Case Studies",
          title: "Websites &",
          highlight: "Projects",
          desc: "A selection of interactive interfaces and websites built in academic settings and with real clients.",
          badge: "Updated · 2025"
        },
        figmaTitle: "Figma Prototypes",
        figmaCards: [
          { title: "FEUP Booking System", desc: "Prototype of a booking system for FEUP, designed in Figma.", link: "View Prototype" },
          { title: "Uacontece", desc: "Figma prototype for the Uacontece app, bachelor's final project.", link: "View Prototype" }
        ],
        sitesTitle: "Developed Sites",
        siteCards: [
          { title: "Professional internship website", desc: "During my professional internship I redesigned the company's website.", link: "View Site" },
          { title: "Psychologist personal website", desc: "Website developed for a real client, focused on user experience.", link: "View Site" },
          { title: "Thinkalike", desc: "Website created to represent a fictional startup for my Master's degree.", link: "View Site" },
          { title: "YOUNIVERSE", desc: "Interactive JavaScript and SQL app to explore the Solar System.", link: "GitHub" },
          { title: "Weather Forecast App", desc: "ReactJS application that delivers weather forecasts for any city.", link: "View Project" },
          { title: "Eco Savvy", desc: "Interactive website about sea pollution, built collaboratively.", link: "View Project" }
        ]
      },
      photos: {
        hero: {
          eyebrow: "Visual Portfolio",
          title: "Photography &",
          highlight: "Storytelling",
          desc: "I explore colour, composition, and art direction to craft engaging visual narratives.",
          badge: "Series · 2021-2025"
        }
      },
      videos: {
        hero: {
          eyebrow: "Motion & Storytelling",
          title: "Videos &",
          highlight: "Animation",
          desc: "From research to post-production, I craft audiovisual narratives that blend emotion, rhythm, and art direction.",
          badge: "Showreel · 2021-2025"
        },
        academicTitle: "Academic Projects",
        personalTitle: "Personal Projects",
        intro: "For me, multimedia is more than a profession—it's a way to tell stories and shape experiences. Travelling keeps me inspired and helps me capture unique moments. Each video reflects my creative vision and love for editing and producing. By sharing these projects, I highlight both my technical skills and my passion for content creation.",
        academicVideos: [
          {
            badge: "Animation",
            title: "Animation - The Unlucky Stork",
            desc: "Group project for the Video Animation course about a clumsy stork who faces obstacles while delivering a baby."
          },
          {
            badge: "Short Film",
            title: "Short Film - Love for Artificial Intelligence",
            desc: "Group short film created for the Video and Animation course about a young woman who falls in love with an AI."
          }
        ],
        countries: {
          thailand: "Thailand",
          madeira: "Madeira",
          cambodia: "Cambodia",
          italy: "Italy",
          greece: "Grécia",
          netherlands: "Netherlands"
        }
      }
    }
  }
};

function setLanguage(lang) {
  const data = translations[lang];
  if (!data) return;
  const page = document.body.dataset.page || 'home';

  const navLinks = document.querySelectorAll('.nav .link');
  data.nav.forEach((text, i) => {
    if (navLinks[i]) navLinks[i].textContent = text;
  });

  if (page === 'home') {
    const headerTitleUp = document.querySelector('.header-title .up');
    const headerTitleDown = document.querySelector('.header-title .down');
    const heroEyebrow = document.querySelector('.header .hero-eyebrow');
    const heroLede = document.querySelector('.hero-lede');
    const heroSecondaryCta = document.querySelector('.hero-cta .btn-outline');
    const heroStats = document.querySelectorAll('.hero-stats .stat');
    const scrollIndicator = document.querySelector('.scroll-indicator span');
    const seeMoreBtn = document.querySelector('.see-more-btn');
    const heroCta = document.querySelector('.header .btn-contact');

    if (heroEyebrow) heroEyebrow.textContent = data.header.eyebrow;
    if (headerTitleUp) headerTitleUp.textContent = data.header.up;
    if (headerTitleDown) headerTitleDown.textContent = data.header.down;
    if (heroLede) heroLede.textContent = data.header.lede;
    if (heroSecondaryCta) heroSecondaryCta.textContent = data.header.ctaSecondary;
    if (heroCta) heroCta.textContent = data.header.contact;
    if (scrollIndicator) scrollIndicator.textContent = data.header.scrollHint;
    if (seeMoreBtn && data.header.scrollHint) {
      seeMoreBtn.setAttribute('data-label', data.header.scrollHint);
      seeMoreBtn.setAttribute('aria-label', data.header.scrollHint);
    }
    heroStats.forEach((statEl, iStat) => {
      if (data.header.stats[iStat]) {
        const numEl = statEl.querySelector('.stat-number');
        const labelEl = statEl.querySelector('p');
        if (numEl) numEl.textContent = data.header.stats[iStat].value;
        if (labelEl) labelEl.textContent = data.header.stats[iStat].label;
      }
    });

    const aboutSection = document.querySelector('#about');
    if (aboutSection) {
      const aboutSubtitle = aboutSection.querySelector('.section-subtitle');
      const aboutTitle = aboutSection.querySelector('.section-title');
      const aboutText = aboutSection.querySelector('.about-caption-text p:last-of-type');
      if (aboutSubtitle) aboutSubtitle.textContent = data.about.subtitle;
      if (aboutTitle) aboutTitle.textContent = data.about.title;
      if (aboutText) aboutText.textContent = data.about.text;
      const professionalTitle = aboutSection.querySelector('[data-about-title="professional"]');
      const academicTitle = aboutSection.querySelector('[data-about-title="academic"]');
      if (professionalTitle) professionalTitle.textContent = data.about.professionalTitle;
      if (academicTitle) academicTitle.textContent = data.about.academicTitle;

      const renderAboutList = (type, items = []) => {
        const timeline = aboutSection.querySelector(`[data-about-list="${type}"]`);
        if (!timeline) return;
        timeline.innerHTML = '';
        items.forEach(item => {
          const div = document.createElement('div');
          div.className = 'timeline-item';
          const content = document.createElement('div');
          content.className = 'timeline-content';
          if (item.date) {
            const date = document.createElement('p');
            date.className = 'timeline-date';
            date.textContent = item.date;
            content.appendChild(date);
          }
          const title = document.createElement('h4');
          title.textContent = item.title;
          content.appendChild(title);
          if (item.role) {
            const role = document.createElement('h5');
            role.textContent = item.role;
            content.appendChild(role);
          }
          if (item.desc) {
            const desc = document.createElement('p');
            desc.textContent = item.desc;
            content.appendChild(desc);
          }
          div.appendChild(content);
          timeline.appendChild(div);
        });
      };

      renderAboutList('professional', data.about.professional);
      renderAboutList('academic', data.about.academic);
    }

    const skillsSection = document.querySelector('#competencias');
    if (skillsSection) {
      const groupEls = skillsSection.querySelectorAll('.skills-group');
      const skillsData = data.competencias;
      const groupsData = skillsData.groups || [];

      groupEls.forEach((groupEl, index) => {
        const groupData = groupsData[index];
        if (!groupData) return;
        const titleEl = groupEl.querySelector('h3');
        if (titleEl) titleEl.textContent = groupData.title;
        const tags = groupEl.querySelectorAll('.skill-tag');
        tags.forEach((tag, tagIndex) => {
          if (groupData.items[tagIndex]) {
            tag.textContent = groupData.items[tagIndex];
          }
        });
      });
    }

    const portfolioSection = document.querySelector('#portfolio');
    if (portfolioSection && data.portfolio) {
      const portfolioSubtitle = portfolioSection.querySelector('.section-subtitle');
      const portfolioTitle = portfolioSection.querySelector('.section-title');
      if (portfolioSubtitle && data.portfolio.subtitle) portfolioSubtitle.textContent = data.portfolio.subtitle;
      if (portfolioTitle && data.portfolio.title) portfolioTitle.textContent = data.portfolio.title;

      const tabs = portfolioSection.querySelectorAll('.portfolio-tab');
      tabs.forEach(tab => {
        const key = tab.dataset.filter;
        const label = data.portfolio.tabs?.[key];
        if (label) tab.textContent = label;
      });

      const cards = portfolioSection.querySelectorAll('.project-card');
      cards.forEach(card => {
        const key = card.getAttribute('data-card-id');
        const cardData = data.portfolio.cards?.[key];
        if (!cardData) return;
        const date = card.querySelector('.project-date');
        const title = card.querySelector('.project-title');
        const desc = card.querySelector('.project-description');
        const link = card.querySelector('.project-link');
        if (date && cardData.date) date.textContent = cardData.date;
        if (title && cardData.title) title.textContent = cardData.title;
        if (desc && cardData.desc) desc.textContent = cardData.desc;
        if (link && cardData.cta) link.textContent = cardData.cta;
      });
    }

    const parallelCards = document.querySelectorAll('.parallel-card');
    if (parallelCards.length && data.parallel) {
      parallelCards.forEach((card, index) => {
        const cardData = data.parallel[index];
        if (!cardData) return;
        const eyebrow = card.querySelector('.parallel-eyebrow');
        const title = card.querySelector('.parallel-title');
        const copy = card.querySelector('.parallel-copy');
        if (eyebrow) eyebrow.textContent = cardData.eyebrow;
        if (title) title.textContent = cardData.title;
        if (copy) copy.textContent = cardData.copy;
        const list = card.querySelector('.parallel-list');
        if (list && cardData.list) {
          list.innerHTML = '';
          cardData.list.forEach(item => {
            const li = document.createElement('li');
            li.textContent = item;
            list.appendChild(li);
          });
        }
        if (cardData.metrics) {
          const metricLabels = card.querySelectorAll('.parallel-metrics .metric-label');
          const metricValues = card.querySelectorAll('.parallel-metrics .metric-value');
          cardData.metrics.forEach((metric, iMetric) => {
            if (metricLabels[iMetric]) metricLabels[iMetric].textContent = metric.label;
            if (metricValues[iMetric]) metricValues[iMetric].textContent = metric.value;
          });
        }
      });
    }

    const contactSection = document.querySelector('#contact');
    if (contactSection) {
      const contactSubtitle = contactSection.querySelector('.section-subtitle');
      const contactTitle = contactSection.querySelector('.section-title');
      const contactLead = contactSection.querySelector('[data-contact-lead]');
      if (contactSubtitle) contactSubtitle.textContent = data.contact.subtitle;
      if (contactTitle) contactTitle.textContent = data.contact.title;
      if (contactLead) contactLead.textContent = data.contact.lead;

      const locationEl = contactSection.querySelector('[data-contact-location]');
      if (locationEl) locationEl.textContent = data.contact.location;
      const responseEl = contactSection.querySelector('[data-contact-response]');
      if (responseEl) responseEl.textContent = data.contact.response;
      const noteEl = contactSection.querySelector('[data-contact-note]');
      if (noteEl) noteEl.textContent = data.contact.note;
      const linkedinEl = contactSection.querySelector('[data-contact-linkedin]');
      if (linkedinEl) linkedinEl.textContent = data.contact.linkedinLabel;
    }
  }

  if (page === 'projects') {
    const projectsData = data.pages?.projects;
    if (projectsData) {
      const hero = document.querySelector('.subpage-hero');
      if (hero) {
        const eyebrow = hero.querySelector('.hero-eyebrow');
        const title = hero.querySelector('h1');
        const highlight = hero.querySelector('h1 span');
        const desc = hero.querySelector('p');
        const badge = hero.querySelector('.subpage-hero__badge');
        if (eyebrow) eyebrow.textContent = projectsData.hero.eyebrow;
        if (title && title.firstChild) title.firstChild.textContent = `${projectsData.hero.title} `;
        if (highlight) highlight.textContent = projectsData.hero.highlight;
        if (desc) desc.textContent = projectsData.hero.desc;
        if (badge) badge.textContent = projectsData.hero.badge;
      }
      const figmaTitle = document.querySelector('.figma-title');
      if (figmaTitle) figmaTitle.textContent = projectsData.figmaTitle;
      const figmaCards = document.querySelectorAll('#figma-prototypes .card');
      projectsData.figmaCards.forEach((cardData, iCard) => {
        const card = figmaCards[iCard];
        if (card) {
          const title = card.querySelector('h5');
          const desc = card.querySelector('p');
          const link = card.querySelector('a');
          if (title) title.textContent = cardData.title;
          if (desc) desc.textContent = cardData.desc;
          if (link) link.textContent = cardData.link;
        }
      });
      const sitesTitle = document.querySelector('.sites-title');
      if (sitesTitle) sitesTitle.textContent = projectsData.sitesTitle;
      const siteCards = document.querySelectorAll('#developed-sites .card');
      projectsData.siteCards.forEach((cardData, iCard) => {
        const card = siteCards[iCard];
        if (card) {
          const title = card.querySelector('h5');
          const desc = card.querySelector('p');
          const link = card.querySelector('a');
          if (title) title.textContent = cardData.title;
          if (desc) desc.textContent = cardData.desc;
          if (link) link.textContent = cardData.link;
        }
      });
    }
  }

  if (page === 'photos') {
    const photosData = data.pages?.photos;
    if (photosData) {
      const hero = document.querySelector('.subpage-hero');
      if (hero) {
        const eyebrow = hero.querySelector('.hero-eyebrow');
        const title = hero.querySelector('h1');
        const highlight = hero.querySelector('h1 span');
        const desc = hero.querySelector('p');
        const badge = hero.querySelector('.subpage-hero__badge');
        if (eyebrow) eyebrow.textContent = photosData.hero.eyebrow;
        if (title && title.firstChild) title.firstChild.textContent = `${photosData.hero.title} `;
        if (highlight) highlight.textContent = photosData.hero.highlight;
        if (desc) desc.textContent = photosData.hero.desc;
        if (badge) badge.textContent = photosData.hero.badge;
      }
    }
  }

  if (page === 'videos') {
    const videosData = data.pages?.videos;
    if (videosData) {
      const hero = document.querySelector('.subpage-hero');
      if (hero) {
        const eyebrow = hero.querySelector('.hero-eyebrow');
        const title = hero.querySelector('h1');
        const highlight = hero.querySelector('h1 span');
        const desc = hero.querySelector('p');
        const badge = hero.querySelector('.subpage-hero__badge');
        if (eyebrow) eyebrow.textContent = videosData.hero.eyebrow;
        if (title && title.firstChild) title.firstChild.textContent = `${videosData.hero.title} `;
        if (highlight) highlight.textContent = videosData.hero.highlight;
        if (desc) desc.textContent = videosData.hero.desc;
        if (badge) badge.textContent = videosData.hero.badge;
      }
      const academicTitle = document.querySelector('#academico h2');
      const personalTitle = document.querySelector('#pessoal h2');
      const intro = document.querySelector('#pessoal .intro');
      if (academicTitle) academicTitle.textContent = videosData.academicTitle;
      if (personalTitle) personalTitle.textContent = videosData.personalTitle;
      if (intro) intro.textContent = videosData.intro;

      const academicItems = document.querySelectorAll('#academico .gallery-item');
      videosData.academicVideos.forEach((vid, iVid) => {
        const item = academicItems[iVid];
        if (!item) return;
        const badge = item.querySelector('.video-badge');
        const titleEl = item.querySelector('.video-card-body h4');
        const descEl = item.querySelector('.video-card-body p');
        if (badge) badge.textContent = vid.badge;
        if (titleEl) titleEl.textContent = vid.title;
        if (descEl) descEl.textContent = vid.desc;
      });

      const countryEls = document.querySelectorAll('#pessoal .video-country');
      countryEls.forEach(el => {
        const key = el.getAttribute('data-country');
        if (key && videosData.countries[key]) {
          el.textContent = videosData.countries[key];
        }
      });
    }
  }

  const footer = document.querySelector('.footer p');
  if (footer) {
    footer.innerHTML = data.footer;
    initCurrentYear();
  }

  const cvBtnPT   = document.querySelector('.cv-btn-pt');
  const cvBtnEN   = document.querySelector('.cv-btn-en');
  const cvBtnView = document.querySelector('.cv-btn-view');
  if (cvBtnPT && cvBtnEN) {
    if (lang === 'PT') {
      cvBtnPT.textContent = 'Descarregar CV PT';
      cvBtnEN.textContent = 'Descarregar CV EN';
      if (cvBtnView) cvBtnView.textContent = 'Ver CV Online';
    } else {
      cvBtnPT.textContent = 'Download CV PT';
      cvBtnEN.textContent = 'Download CV EN';
      if (cvBtnView) cvBtnView.textContent = 'View CV Online';
    }
  }
}
