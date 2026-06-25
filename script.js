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
  initCvPage();
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
    '.see-more-btn[href^="#"]',
    '.cv-topbar-download[href^="#"]',
    '.cv-topbar-link[href^="#"]'
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
        const offset = document.querySelector('.custom-navbar')?.offsetHeight || document.querySelector('.cv-topbar')?.offsetHeight || 70;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        smoothScrollTo(top, 1100);
        if (link.classList.contains('cv-topbar-link--download') || link.classList.contains('cv-topbar-download')) {
          window.setTimeout(() => {
            target.classList.remove('cv-downloads--highlight');
            void target.offsetWidth;
            target.classList.add('cv-downloads--highlight');
          }, 980);
        }
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

const CV_DATA = {
  PT: {
    lang: 'pt',
    pageTitle: 'CV – Joana Araújo',
    eyebrow: 'Curriculum Vitae',
    'role-badge': 'Multimédia | Web Design | Interfaces Digitais',
    'scroll-hint': 'Ver mais',
    'back-link': 'CV Online',
    'topbar-download': 'Descarregar CV',
    'hero-contact': 'Vamos conversar',
    heroContactSubject: 'Contacto via CV Online',
    'projects-cta': 'Ver Portfolio',
    'download-pt': 'Descarregar CV PT',
    'download-en': 'Descarregar CV EN',
    'photo-alt': 'Fotografia de Joana Araújo',
    themeLabelDark: 'Mudar para tema escuro',
    themeLabelLight: 'Mudar para tema claro',
    'stat-1-label': 'Design Gráfico',
    'stat-2-label': 'Edição de Vídeo',
    'stat-3-label': 'Interfaces Digitais',
    'stat-4-label': 'Frontend',
    'contact-title': 'Contacto',
    location: 'Porto, Portugal',
    'languages-title': 'Idiomas',
    'lang-1-name': 'Português',
    'lang-1-level': 'Nativo',
    'lang-2-name': 'Inglês',
    'lang-2-level': 'Avançado',
    'lang-3-name': 'Espanhol',
    'lang-3-level': 'Básico',
    'soft-skills-title': 'Competências Pessoais',
    softSkills: ['Criatividade', 'Trabalho em equipa', 'Comunicação', 'Liderança', 'Adaptabilidade', 'Curiosidade', 'Proatividade'],
    'about-title': 'Perfil Profissional',
    'about-text': 'Sou licenciada em Multimédia e Tecnologias da Comunicação pela Universidade de Aveiro e estou atualmente a concluir o Mestrado em Multimédia na Universidade do Porto. O meu percurso cruza web design, produção multimédia e desenvolvimento de interfaces digitais, áreas onde consigo combinar criatividade com uma componente técnica. Tenho especial interesse por edição de vídeo, design gráfico e frontend, sobretudo em projetos que envolvam experiências digitais claras, intuitivas e visualmente consistentes.',
    'education-title': 'Percurso Académico',
    'edu-1-date': '2024 – Presente',
    'edu-1-degree': 'Mestrado em Multimédia',
    'edu-1-school': 'Universidade do Porto, Porto',
    'edu-1-note': 'Formação multidisciplinar em multimédia, com foco em design de interação, interfaces digitais e comunicação visual.',
    'edu-1-link': 'Ver curso',
    'edu-2-date': '2021 – 2024',
    'edu-2-degree': 'Licenciatura em Multimédia e Tecnologias da Comunicação',
    'edu-2-school': 'Universidade de Aveiro, Aveiro',
    'edu-2-note': 'Base multidisciplinar em design, desenvolvimento web, audiovisual, comunicação digital e prototipagem.',
    'edu-2-link': 'Ver curso',
    'exp-title': 'Percurso Profissional',
    'exp-1-date': 'Abril 2026 – Presente',
    'exp-1-title': 'Web Design, Multimédia e Programação de Interfaces de Utilizador',
    'exp-1-company': 'Invisible Cloud, Porto',
    'exp-1-desc': 'Desenvolvo soluções digitais, conteúdos multimédia e interfaces de utilizador, com foco em clareza visual, usabilidade e consistência.',
    'exp-2-date': 'Outubro 2025 – Março 2026',
    'exp-2-title': 'Estágio IEFP',
    'exp-2-company': 'Invisible Cloud, Porto',
    'exp-2-desc': 'Colaborei em projetos digitais na área do multimédia, design e interfaces, consolidando competências em contexto profissional.',
    'exp-3-date': '2025',
    'exp-3-title': 'Desenvolvimento Web Freelance',
    'exp-3-company': 'Conta própria',
    'exp-3-desc': 'Crio websites e portfólios digitais de forma autónoma, acompanhando o processo desde a componente visual até à implementação funcional.',
    'skills-title': 'Competências Técnicas',
    skillGroups: [
      { name: 'Frontend & Web Development', items: ['HTML5', 'CSS3', 'JavaScript', 'TypeScript', 'React', 'Tailwind CSS', 'Responsive Design', 'REST APIs', 'Git/GitHub', 'WordPress'] },
      { name: 'UI/UX', items: ['Figma', 'Wireframing', 'Prototipagem', 'User Flows', 'Design Systems', 'Acessibilidade', 'Pesquisa com Utilizadores', 'Testes de Usabilidade'] },
      { name: 'Design Gráfico & Digital', items: ['Photoshop', 'Illustrator', 'Figma', 'Canva'] },
      { name: 'Edição de Vídeo & Multimédia', items: ['Premiere Pro', 'Final Cut Pro', 'DaVinci Resolve'] }
    ]
  },
  EN: {
    lang: 'en',
    pageTitle: 'CV – Joana Araújo',
    eyebrow: 'Curriculum Vitae',
    'role-badge': 'Multimedia | Web Design | Digital Interfaces',
    'scroll-hint': 'See more',
    'back-link': 'Online CV',
    'topbar-download': 'Download CV',
    'hero-contact': "Let's talk",
    heroContactSubject: 'Contact via Online CV',
    'projects-cta': 'View Portfolio',
    'download-pt': 'Download CV PT',
    'download-en': 'Download CV EN',
    'photo-alt': 'Portrait of Joana Araújo',
    themeLabelDark: 'Switch to dark mode',
    themeLabelLight: 'Switch to light mode',
    'stat-1-label': 'Graphic Design',
    'stat-2-label': 'Video Editing',
    'stat-3-label': 'Digital Interfaces',
    'stat-4-label': 'Frontend',
    'contact-title': 'Contact',
    location: 'Porto, Portugal',
    'languages-title': 'Languages',
    'lang-1-name': 'Portuguese',
    'lang-1-level': 'Native',
    'lang-2-name': 'English',
    'lang-2-level': 'Advanced',
    'lang-3-name': 'Spanish',
    'lang-3-level': 'Basic',
    'soft-skills-title': 'Soft Skills',
    softSkills: ['Creativity', 'Team work', 'Communication', 'Leadership', 'Adaptability', 'Curiosity', 'Proactivity'],
    'about-title': 'Professional Profile',
    'about-text': "I hold a Bachelor's degree in Multimedia and Communication Technologies from the University of Aveiro and I am currently completing my Master's in Multimedia at the University of Porto. My background combines web design, multimedia production, and digital interface development, allowing me to connect creativity with technical thinking. I am especially interested in video editing, graphic design, and frontend development, particularly in projects that require clear, intuitive, and visually consistent digital experiences.",
    'education-title': 'Academic Background',
    'edu-1-date': '2024 – Present',
    'edu-1-degree': "Master's in Multimedia",
    'edu-1-school': 'University of Porto, Porto',
    'edu-1-note': 'Multidisciplinary training in multimedia, focused on interaction design, digital interfaces, and visual communication.',
    'edu-1-link': 'View course',
    'edu-2-date': '2021 – 2024',
    'edu-2-degree': "Bachelor's in Multimedia and Communication Technologies",
    'edu-2-school': 'University of Aveiro, Aveiro',
    'edu-2-note': 'Multidisciplinary background in design, web development, audiovisual media, digital communication, and prototyping.',
    'edu-2-link': 'View course',
    'exp-title': 'Professional Experience',
    'exp-1-date': 'April 2026 – Present',
    'exp-1-title': 'Web Design, Multimedia, and User Interface Programming',
    'exp-1-company': 'Invisible Cloud, Porto',
    'exp-1-desc': 'I develop digital solutions, multimedia content, and user interfaces, focusing on visual clarity, usability, and consistency.',
    'exp-2-date': 'October 2025 – March 2026',
    'exp-2-title': 'IEFP Internship',
    'exp-2-company': 'Invisible Cloud, Porto',
    'exp-2-desc': 'I collaborated on digital projects in multimedia, design, and interfaces, consolidating my skills in a professional context.',
    'exp-3-date': '2025',
    'exp-3-title': 'Freelance Web Development',
    'exp-3-company': 'Self-employed',
    'exp-3-desc': 'I create websites and digital portfolios independently, following the process from visual design through to functional implementation.',
    'skills-title': 'Technical Skills',
    skillGroups: [
      { name: 'Frontend & Web Development', items: ['HTML5', 'CSS3', 'JavaScript', 'TypeScript', 'React', 'Tailwind CSS', 'Responsive Design', 'REST APIs', 'Git/GitHub', 'WordPress'] },
      { name: 'UI/UX', items: ['Figma', 'Wireframing', 'Prototyping', 'User Flows', 'Design Systems', 'Accessibility', 'User Research', 'Usability Testing'] },
      { name: 'Graphic & Digital Design', items: ['Photoshop', 'Illustrator', 'Figma', 'Canva'] },
      { name: 'Video Editing & Multimedia', items: ['Premiere Pro', 'Final Cut Pro', 'DaVinci Resolve'] }
    ]
  }
};

function buildCvSkillGroups(data) {
  const el = document.getElementById('cv-skill-groups');
  if (!el || !data.skillGroups) return;
  el.innerHTML = '';
  data.skillGroups.forEach((group, gi) => {
    const div = document.createElement('div');
    div.className = 'cv-skill-group cv-reveal';
    div.style.setProperty('--delay', `${gi * 0.08}s`);
    const h4 = document.createElement('h4');
    h4.className = 'cv-skill-group__name';
    h4.textContent = group.name;
    const pills = document.createElement('div');
    pills.className = 'cv-skill-pills';
    group.items.forEach((item, ii) => {
      const span = document.createElement('span');
      span.className = 'cv-skill-pill';
      span.style.setProperty('--stagger', `${ii * 45}ms`);
      span.textContent = item;
      pills.appendChild(span);
    });
    div.appendChild(h4);
    div.appendChild(pills);
    el.appendChild(div);
  });
}

function buildCvSoftSkills(data) {
  const el = document.getElementById('cv-soft-skills');
  if (!el || !data.softSkills) return;
  el.innerHTML = '';
  data.softSkills.forEach((skill, i) => {
    const span = document.createElement('span');
    span.className = 'cv-soft-tag';
    span.style.setProperty('--stagger', `${i * 55}ms`);
    span.textContent = skill;
    el.appendChild(span);
  });
}

function applyCvLang(lang) {
  const data = CV_DATA[lang];
  if (!data) return;
  document.documentElement.lang = data.lang;
  if (data.pageTitle) document.title = data.pageTitle;
  document.querySelectorAll('[data-cv]').forEach(el => {
    const key = el.getAttribute('data-cv');
    if (typeof data[key] === 'string') {
      el.textContent = data[key];
    }
  });
  const topbarDownload = document.querySelector('.cv-topbar-download');
  if (topbarDownload) topbarDownload.textContent = data['topbar-download'];
  const heroContact = document.querySelector('.cv-hero-contact-btn');
  if (heroContact) {
    heroContact.textContent = data['hero-contact'];
    heroContact.setAttribute('href', `mailto:joanacunhaaraujo@gmail.com?subject=${encodeURIComponent(data.heroContactSubject)}`);
  }
  const projectsCta = document.querySelector('.cv-projects-btn');
  if (projectsCta) projectsCta.textContent = data['projects-cta'];
  const downloadPt = document.querySelector('.cv-dl-btn');
  if (downloadPt) downloadPt.textContent = data['download-pt'];
  const downloadEn = document.querySelector('.cv-dl-btn--outline');
  if (downloadEn) downloadEn.textContent = data['download-en'];
  const photo = document.querySelector('.cv-sidebar-photo__img');
  if (photo && data['photo-alt']) photo.setAttribute('alt', data['photo-alt']);
  const themeBtn = document.getElementById('cv-theme-toggle');
  const isLight = document.querySelector('.cv-page')?.classList.contains('cv-page--light');
  if (themeBtn) {
    themeBtn.setAttribute('aria-label', isLight ? data.themeLabelDark : data.themeLabelLight);
  }
  buildCvSkillGroups(data);
  buildCvSoftSkills(data);
  const btn = document.getElementById('cv-lang-toggle');
  if (btn) {
    btn.textContent = lang === 'PT' ? 'EN' : 'PT';
    btn.setAttribute('aria-label', lang === 'PT' ? 'Switch language to English' : 'Mudar idioma para português');
  }
}

function initCvReveal() {
  if (!('IntersectionObserver' in window)) {
    document.querySelectorAll('.cv-reveal, .cv-soft-tag, .cv-skill-pill').forEach(el => el.classList.add('is-visible'));
    return;
  }
  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  document.querySelectorAll('.cv-reveal, .cv-soft-tag, .cv-skill-pill').forEach(el => obs.observe(el));
}

function initCvLangBars() {
  const fills = document.querySelectorAll('.cv-lang-fill');
  if (!fills.length) return;
  if (!('IntersectionObserver' in window)) {
    fills.forEach(fill => fill.classList.add('is-animated'));
    return;
  }
  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-animated');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  fills.forEach(fill => obs.observe(fill));
}

function initCvTheme() {
  const themeBtn = document.getElementById('cv-theme-toggle');
  const cvPage = document.querySelector('.cv-page');
  if (!themeBtn || !cvPage) return;

  const sunSvg = `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></svg>`;
  const moonSvg = `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`;
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');

  function getSystemTheme() {
    return prefersDark.matches ? 'dark' : 'light';
  }

  // Always follow system preference unless user has manually toggled
  let theme = localStorage.getItem('siteTheme') || getSystemTheme();

  const applyTheme = currentTheme => {
    const lang = localStorage.getItem('siteLang') || 'PT';
    const labels = CV_DATA[lang] || CV_DATA.PT;
    if (currentTheme === 'light') {
      cvPage.classList.add('cv-page--light');
      themeBtn.innerHTML = moonSvg;
      themeBtn.setAttribute('aria-label', labels.themeLabelDark || 'Mudar para tema escuro');
    } else {
      cvPage.classList.remove('cv-page--light');
      themeBtn.innerHTML = sunSvg;
      themeBtn.setAttribute('aria-label', labels.themeLabelLight || 'Mudar para tema claro');
    }
  };

  applyTheme(theme);

  themeBtn.addEventListener('click', () => {
    theme = theme === 'dark' ? 'light' : 'dark';
    localStorage.setItem('siteTheme', theme);
    applyTheme(theme);
  });

  // When browser preference changes, follow it (clears manual override)
  prefersDark.addEventListener('change', () => {
    localStorage.removeItem('siteTheme');
    theme = getSystemTheme();
    applyTheme(theme);
  });
}

function initCvPage() {
  if (document.body.dataset.page !== 'cv') return;
  const lang = localStorage.getItem('siteLang') || 'PT';
  applyCvLang(lang);
  initCvReveal();
  initCvLangBars();
  initCvTheme();

  const langBtn = document.getElementById('cv-lang-toggle');
  let currentLang = lang;
  if (langBtn) {
    langBtn.addEventListener('click', () => {
      currentLang = currentLang === 'PT' ? 'EN' : 'PT';
      localStorage.setItem('siteLang', currentLang);
      applyCvLang(currentLang);
      initCvReveal();
    });
  }
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
          role: "Web Design, Multimédia e Programação de Interfaces de Utilizador",
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
      pageCta: "Explorar estudos de caso",
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
        lead: "Uma seleção de produtos digitais recentes e plataformas que desenvolvi, com foco em frontend moderno, clareza visual e estrutura técnica consistente.",
        labels: {
          year: "Ano",
          stack: "Stack",
          languages: "Idiomas",
          styling: "Styling",
          featured: "Projeto em Destaque",
          platform: "Plataforma Web",
          institutional: "Website Institucional",
          client: "Website para Cliente",
          concept: "Projeto Conceptual"
        },
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
        sitesTitle: "Websites Desenvolvidos",
        siteCards: [
          { title: "Invisible Collector", badgeKey: "featured", year: "2026", stack: "React 19 · JSX · Vite", tools: "i18next · react-i18next", desc: "Plataforma desenvolvida em React 19 com Vite, preparada para conteúdo multilingue e pensada para uma experiência digital sólida, clara e escalável.", link: "Ver Site" },
          { title: "Invisible Link", badgeKey: "platform", year: "2026", stack: "JavaScript · React com JSX · Vite", tools: "CSS vanilla · i18next", desc: "Aplicação React criada com Vite, com styling em CSS vanilla e sistema de traduções com i18next para suportar uma navegação leve e multilingue.", link: "Ver Site" },
          { title: "Invisible Cloud", badgeKey: "institutional", year: "2025", stack: "JavaScript · React · .js/.jsx", tools: "Tailwind CSS", desc: "Website institucional em React, com estrutura moderna e styling em Tailwind CSS, desenvolvido para reforçar a clareza visual e a presença digital da marca.", link: "Ver Site" },
          { title: "Psicólogo", badgeKey: "client", year: "2025", stack: "HTML · CSS · JavaScript", tools: "Responsive UI · Visual clarity", desc: "Website criado para um cliente da área da psicologia, com foco numa presença digital serena, clara e profissional, pensada para facilitar a leitura dos serviços e o contacto.", link: "Ver Preview" },
          { title: "Thinkalike", badgeKey: "concept", year: "2025", stack: "HTML · CSS · JavaScript", tools: "Concept branding · Editorial UI", desc: "Website desenvolvido no contexto do mestrado para apresentar uma startup fictícia, combinando identidade visual, estrutura editorial e uma navegação simples orientada para storytelling.", link: "Ver Preview" },
        ]
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
          role: "Web Design, Multimedia, and User Interface Programming",
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
      pageCta: "Explore case studies",
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
        lead: "A selection of recent digital products and platforms I built, focused on modern frontend, visual clarity, and consistent technical structure.",
        labels: {
          year: "Year",
          stack: "Stack",
          languages: "Languages",
          styling: "Styling",
          featured: "Featured Project",
          platform: "Web Platform",
          institutional: "Corporate Website",
          client: "Client Website",
          concept: "Concept Project"
        },
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
        sitesTitle: "Developed Websites",
        siteCards: [
          { title: "Invisible Collector", badgeKey: "featured", year: "2026", stack: "React 19 · JSX · Vite", tools: "i18next · react-i18next", desc: "Platform built with React 19 and Vite, designed for multilingual content and a clear, scalable digital experience.", link: "View Site" },
          { title: "Invisible Link", badgeKey: "platform", year: "2026", stack: "JavaScript · React with JSX · Vite", tools: "Vanilla CSS · i18next", desc: "React application created with Vite, styled with vanilla CSS and powered by i18next for a lightweight multilingual experience.", link: "View Site" },
          { title: "Invisible Cloud", badgeKey: "institutional", year: "2025", stack: "JavaScript · React · .js/.jsx", tools: "Tailwind CSS", desc: "Corporate website built in React with a modern structure and Tailwind CSS styling to strengthen visual clarity and digital presence.", link: "View Site" },
          { title: "Psychologist", badgeKey: "client", year: "2025", stack: "HTML · CSS · JavaScript", tools: "Responsive UI · Visual clarity", desc: "Website created for a psychology client, designed to communicate trust, calm, and clarity while making services and contact details easy to navigate.", link: "View Preview" },
          { title: "Thinkalike", badgeKey: "concept", year: "2025", stack: "HTML · CSS · JavaScript", tools: "Concept branding · Editorial UI", desc: "Website developed during my Master's degree to present a fictional startup, combining visual identity, editorial structure, and simple storytelling-driven navigation.", link: "View Preview" },
        ]
      }
    }
  }
};

function setLanguage(lang) {
  const data = translations[lang];
  if (!data) return;
  const page = document.body.dataset.page || 'home';
  document.documentElement.lang = lang.toLowerCase();

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
      const portfolioPageLink = portfolioSection.querySelector('.portfolio-page-link');
      if (portfolioPageLink && data.portfolio.pageCta) portfolioPageLink.textContent = data.portfolio.pageCta;

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
      document.title = lang === 'PT' ? 'Projetos – Joana Araújo' : 'Projects – Joana Araújo';
      const back = document.querySelector('.pp-nav__back');
      const backText = back?.querySelector('span');
      if (back) {
        back.setAttribute('aria-label', lang === 'PT' ? 'Voltar ao CV online' : 'Back to online CV');
      }
      if (backText) backText.textContent = lang === 'PT' ? 'Voltar' : 'Back';
      const langToggle = document.getElementById('lang-toggle');
      if (langToggle) {
        langToggle.setAttribute('aria-label', lang === 'PT' ? 'Switch language to English' : 'Mudar idioma para português');
      }
      const heroEyebrow = document.querySelector('.pp-hero__eyebrow');
      if (heroEyebrow) heroEyebrow.textContent = lang === 'PT' ? 'Portfolio' : 'Portfolio';
      const sitesTitle = document.querySelector('.sites-title');
      if (sitesTitle) {
        sitesTitle.innerHTML = lang === 'PT'
          ? 'Websites<br><span>Desenvolvidos</span>'
          : 'Websites<br><span>Developed</span>';
      }
      const sitesLead = document.querySelector('.sites-lead');
      if (sitesLead && projectsData.lead) sitesLead.textContent = projectsData.lead;
      const projectCards = document.querySelectorAll('.pp-project');
      projectCards.forEach((card, index) => {
        const cardData = projectsData.siteCards?.[index];
        if (!cardData) return;
        const title = card.querySelector('h2');
        const desc = card.querySelector('.pp-project__desc');
        const year = card.querySelector('.site-year');
        const stack = card.querySelector('.site-stack');
        const tools = card.querySelector('.site-tools');
        const cta = card.querySelector('.pp-project__cta span');
        const badge = card.querySelector('.pp-project__badge');
        const metaLabels = card.querySelectorAll('.pp-project__meta-label');
        if (badge && cardData.badgeKey && projectsData.labels?.[cardData.badgeKey]) {
          badge.textContent = projectsData.labels[cardData.badgeKey];
        }
        if (title) title.textContent = cardData.title;
        if (desc) desc.textContent = cardData.desc;
        if (year) year.textContent = cardData.year;
        if (stack) stack.textContent = cardData.stack;
        if (tools) tools.textContent = cardData.tools;
        if (cta) cta.textContent = cardData.link;
        if (metaLabels[0] && projectsData.labels?.year) metaLabels[0].textContent = projectsData.labels.year;
        if (metaLabels[1] && projectsData.labels?.stack) metaLabels[1].textContent = projectsData.labels.stack;
        if (metaLabels[2]) {
          metaLabels[2].textContent = index === 0
            ? (projectsData.labels?.languages || metaLabels[2].textContent)
            : (projectsData.labels?.styling || metaLabels[2].textContent);
        }
      });
      document.querySelectorAll('.pp-project__browser img').forEach((img, index) => {
        const alts = [
          lang === 'PT' ? 'Preview do site Invisible Collector' : 'Preview of the Invisible Collector website',
          lang === 'PT' ? 'Preview do site Invisible Link' : 'Preview of the Invisible Link website',
          lang === 'PT' ? 'Preview do site Invisible Cloud' : 'Preview of the Invisible Cloud website',
          lang === 'PT' ? 'Preview do site do psicólogo' : 'Preview of the psychologist website',
          lang === 'PT' ? 'Preview do site Thinkalike' : 'Preview of the Thinkalike website'
        ];
        if (alts[index]) img.setAttribute('alt', alts[index]);
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
