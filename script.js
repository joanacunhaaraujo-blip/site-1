document.addEventListener('DOMContentLoaded', () => {
  initMobileNav();
  initSmoothScroll();
  initNavbarWatcher();
  initBackToTop();
  initProgressObserver();
  initRevealObserver();
  initParallax();
  initLanguageToggle();
});

function initMobileNav() {
  const navToggle = document.getElementById('nav-toggle');
  const menu = document.getElementById('menu');
  if (!navToggle || !menu) return;

  navToggle.addEventListener('click', () => {
    menu.classList.toggle('show');
  });

  menu.querySelectorAll('.link').forEach(link => {
    link.addEventListener('click', () => menu.classList.remove('show'));
  });
}

function initSmoothScroll() {
  const links = document.querySelectorAll('.link[href^="#"], .btn-outline[href^="#"], .icon-link[href^="#"]');
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
        window.scrollTo({ top, behavior: 'smooth' });
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
  if (!button) return;

  const toggleButton = () => {
    if (window.scrollY > 300) {
      button.classList.add('show');
    } else {
      button.classList.remove('show');
    }
  };

  toggleButton();
  window.addEventListener('scroll', toggleButton);

  button.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
  const layers = document.querySelectorAll('[data-parallax]');
  if (!layers.length) return;

  let ticking = false;
  const update = () => {
    layers.forEach(layer => {
      const speed = parseFloat(layer.dataset.parallax) || 0.1;
      const rect = layer.getBoundingClientRect();
      const offset = rect.top - window.innerHeight / 2;
      const shift = Math.min(Math.max(-offset * speed * 0.3, -80), 80);
      layer.style.setProperty('--parallax-shift', `${shift}px`);
    });
    ticking = false;
  };

  const requestTick = () => {
    if (!ticking) {
      requestAnimationFrame(update);
      ticking = true;
    }
  };

  update();
  window.addEventListener('scroll', requestTick, { passive: true });
  window.addEventListener('resize', requestTick);
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
    nav: ["Início", "Sobre Mim", "Competências", "Portfolio", "Contactos"],
    header: {
      eyebrow: "Designer & Frontend Developer",
      up: "Olá, sou a",
      down: "Joana Araújo",
      lede: "Crio identidades digitais e interfaces elegantes, aliando pesquisa, storytelling e desenvolvimento frontend para experiências inesquecíveis.",
      contact: "Contacte-me!",
      ctaSecondary: "Ver portfolio",
      stats: [
        { value: "+20", label: "Projetos digitais" },
        { value: "5", label: "Marcas acompanhadas" },
        { value: "3", label: "Anos a criar interfaces" }
      ],
      scrollHint: "Scroll para explorar"
    },
    about: {
      subtitle: "Quem sou?",
      title: "Sobre mim",
      text: `Sou uma estudante de Mestrado em Multimédia na Universidade do Porto, apaixonada por criar experiências digitais cativantes. Considero-me uma pessoa sociável e adaptável, o que me permite trabalhar eficazmente em equipa e comunicar de forma descontraída e produtiva. Gosto de assumir responsabilidades e liderar quando necessário, mas também valorizo a colaboração e sei ouvir diferentes perspetivas. Tenho uma curiosidade constante e vontade de aprender, procuro desafios que me permitam aplicar a minha criatividade e competências no mundo do multimédia, crescendo profissional e pessoalmente a cada experiência.`,
      timeline: [
        { year: "2024 - Presente", desc: "Mestrado em Multimédia, Universidade do Porto" },
        { year: "2021 - 2024", desc: "Licenciatura em Multimédia e Tecnologias da Comunicação, Universidade de Aveiro" }
      ],
      download: "Descarregar CV"
    },
    competencias: {
      subtitle: "As minhas",
      title: "Competências",
      skillsTitle: "Skills",
      languagesTitle: "Linguagens",
      programsTitle: "Programas",
      skills: [
        { name: "Inglês C1", percent: "90%" },
        { name: "Espanhol B1", percent: "75%" },
        { name: "Fotografia", percent: "75%" },
        { name: "Edição de Vídeo", percent: "85%" },
        { name: "Edição de Imagem", percent: "85%" }
      ],
      languages: [
        { name: "HTML", percent: "90%" },
        { name: "CSS", percent: "90%" },
        { name: "JavaScript", percent: "80%" },
        { name: "React", percent: "70%" },
        { name: "SQL", percent: "70%" },
        { name: "GdScript", percent: "60%" },
        { name: "Python", percent: "60%" }
      ],
      programs: [
        { name: "Final Cut Pro", percent: "75%" },
        { name: "Figma", percent: "90%" },
        { name: "Photoshop", percent: "70%" },
        { name: "Microsoft Office", percent: "80%" },
        { name: "Blender", percent: "60%" },
        { name: "Godot", percent: "60%" }
      ]
    },
    portfolio: {
      subtitle: "O meu",
      title: "Portfolio",
      items: [
        { title: "Sites", desc: "Sites desenvolvidos no âmbito académico" },
        { title: "Fotografia", desc: "Portfolio de Fotografia âmbito académico" },
        { title: "Vídeos", desc: "Vídeos desenvolvidos tanto no âmbito académico como pessoal" }
      ]
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
    blog: {
      subtitle: "As minhas",
      title: "Experiências profissionais",
      cards: [
        {
          title: "Estágio IEFP em Web Design e Frontend",
          date: "Setembro 2024 - Presente · Invisible Cloud",
          desc: "Integro a equipa criativa da Invisible Cloud através do programa IEFP, apoiando o design de interfaces e a implementação frontend de landing pages e microsites otimizados para performance.",
          links: [
            { href: "http://invisiblecloud.pt", text: "InvisibleCoud" }
          ]
        },
        {
          title: "Web developer",
          date: "Presente",
          desc: "Desenvolvo websites por conta própria, desde a fase de planeamento até à implementação final. Trabalho com tecnologias como HTML, CSS, JavaScript, React e PHP, criando sites responsivos focados na experiência do utilizador.",
          links: [
            { href: "http://henriquearaujodasilvapsi.pt", text: "Exemplo 1" },
            { href: "https://invisiblecloud.pt", text: "Exemplo 2" },
              { href: "https://joanaaraujo03.github.io/ThinkAlike/index.html", text: "Exemplo 3" }
          ]
        },
        {
          title: "Forum Creativa",
          date: "2024 - Presente",
          desc: "Represento as marcas Nescafé Dolce Gusto e Neo, garantindo um atendimento profissional e informativo, promovendo a interação e fidelização dos consumidores.",
          links: [
            { href: "certificado1.pdf", text: "Descarregar Diploma" }
          ]
        },
        {
          title: "Babysitting",
          date: "2021",
          desc: "Experiência em cuidados infantis ocasionais, desenvolvendo competências como paciência, responsabilidade e comunicação interpessoal.",
          links: []
        }
      ]
    },
    contact: {
      subtitle: "Os meus",
      title: "Contactos",
      lead: "Trago investigação, direção de arte e desenvolvimento frontend para o mesmo fluxo. Partilhe objetivos, contexto e prazos — eu devolvo um plano claro.",
      location: "Porto, Portugal · Híbrido / Remoto",
      note: "Conte-me sobre o desafio, utilizadores e métricas de sucesso — envio proposta com roadmap e estimativa.",
      response: "Tempo médio de resposta: 24h",
      linkedinLabel: "LinkedIn"
    },
    footer: "© 2025 Todos os direitos reservados a <span style=\"font-weight: 600;\"> Joana Araújo </span>",
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
    nav: ["Home", "About", "Skills", "Portfolio", "Contact"],
    header: {
      eyebrow: "Designer & Frontend Developer",
      up: "Hi, I'm",
      down: "Joana Araújo",
      lede: "I craft elegant digital identities and interfaces by blending research, storytelling, and frontend development for unforgettable experiences.",
      contact: "Get in touch!",
      ctaSecondary: "See portfolio",
      stats: [
        { value: "+20", label: "Digital projects" },
        { value: "5", label: "Brands supported" },
        { value: "3", label: "Years designing interfaces" }
      ],
      scrollHint: "Scroll to explore"
    },
    about: {
      subtitle: "Who am I?",
      title: "About me",
      text: `I am a Master's student in Multimedia at the University of Porto, passionate about creating engaging digital experiences. I consider myself sociable and adaptable, which allows me to work effectively in teams and communicate in a relaxed and productive way. I like to take responsibility and lead when necessary, but I also value collaboration and know how to listen to different perspectives. I am constantly curious and eager to learn, seeking challenges that allow me to apply my creativity and skills in the multimedia world, growing professionally and personally with each experience.`,
      timeline: [
        { year: "2024 - Present", desc: "Master's in Multimedia, University of Porto" },
        { year: "2021 - 2024", desc: "Bachelor in Multimedia and Communication Technologies, University of Aveiro" }
      ],
      download: "Download CV"
    },
    competencias: {
      subtitle: "My",
      title: "Skills",
      skillsTitle: "Skills",
      languagesTitle: "Languages",
      programsTitle: "Tools",
      skills: [
        { name: "English C1", percent: "90%" },
        { name: "Spanish B1", percent: "75%" },
        { name: "Photography", percent: "75%" },
        { name: "Video Editing", percent: "85%" },
        { name: "Image Editing", percent: "85%" }
      ],
      languages: [
        { name: "HTML", percent: "90%" },
        { name: "CSS", percent: "90%" },
        { name: "JavaScript", percent: "80%" },
        { name: "React", percent: "70%" },
        { name: "SQL", percent: "70%" },
        { name: "GdScript", percent: "60%" },
        { name: "Python", percent: "60%" }
      ],
      programs: [
        { name: "Final Cut Pro", percent: "75%" },
        { name: "Figma", percent: "90%" },
        { name: "Photoshop", percent: "70%" },
        { name: "Microsoft Office", percent: "80%" },
        { name: "Blender", percent: "60%" },
        { name: "Godot", percent: "60%" }
      ]
    },
    portfolio: {
      subtitle: "My",
      title: "Portfolio",
      items: [
        { title: "Websites", desc: "Websites developed in an academic context" },
        { title: "Photography", desc: "Academic photography portfolio" },
        { title: "Videos", desc: "Videos developed both academically and personally" }
      ]
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
    blog: {
      subtitle: "My",
      title: "Professional Experience",
      cards: [
        {
          title: "IEFP Internship in Web Design & Frontend",
          date: "September 2024 - Present · Invisible Cloud",
          desc: "I support Invisible Cloud's creative team through the IEFP program, shaping interface systems and implementing performant landing pages and microsites.",
          links: [
            { href: "mailto:joanacunhaaraujo@gmail.com", text: "Ask about the internship" }
          ]
        },
        {
          title: "Web developer",
          date: "Present",
          desc: "I independently develop websites from strategy to final implementation, working with HTML, CSS, JavaScript, React, and PHP to craft responsive, user-first experiences.",
          links: [
            { href: "http://henriquearaujodasilvapsi.pt", text: "Example 1" },
            { href: "https://invisiblecloud.pt", text: "Example 2" },
            { href: "https://joanaaraujo03.github.io/ThinkAlike/index.html", text: "Example 3" }
          ]
        },
        {
          title: "Forum Creativa",
          date: "2024 - Present",
          desc: "Brand ambassador for Nescafé Dolce Gusto and Neo, ensuring informed customer interactions and long-lasting relationships.",
          links: [
            { href: "certificado1.pdf", text: "Download Diploma" }
          ]
        },
        {
          title: "Babysitting",
          date: "2021",
          desc: "Occasional childcare experience, building patience, responsibility, and essential soft skills.",
          links: []
        }
      ]
    },
    contact: {
      subtitle: "My",
      title: "Contacts",
      lead: "I blend research, art direction, and frontend implementation in the same flow. Share goals, context, and timelines—I’ll return a clear plan.",
      location: "Porto, Portugal · Hybrid / Remote",
      note: "Tell me about the challenge, users, and success metrics—I’ll reply with a roadmap and estimate.",
      response: "Average response time: 24h",
      linkedinLabel: "LinkedIn"
    },
    footer: "© 2025 All rights reserved to <span style=\"font-weight: 600;\"> Joana Araújo </span>",
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
          greece: "Greece",
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
    const heroCta = document.querySelector('.header .btn-contact');

    if (heroEyebrow) heroEyebrow.textContent = data.header.eyebrow;
    if (headerTitleUp) headerTitleUp.textContent = data.header.up;
    if (headerTitleDown) headerTitleDown.textContent = data.header.down;
    if (heroLede) heroLede.textContent = data.header.lede;
    if (heroSecondaryCta) heroSecondaryCta.textContent = data.header.ctaSecondary;
    if (heroCta) heroCta.textContent = data.header.contact;
    if (scrollIndicator) scrollIndicator.textContent = data.header.scrollHint;
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
      const timelineTitle = aboutSection.querySelector('.timeline-title');
      const timeline = aboutSection.querySelector('.timeline');
      if (aboutSubtitle) aboutSubtitle.textContent = data.about.subtitle;
      if (aboutTitle) aboutTitle.textContent = data.about.title;
      if (aboutText) aboutText.textContent = data.about.text;
      if (timelineTitle) timelineTitle.textContent = lang === 'PT' ? 'Percurso Académico' : 'Academic Path';
      if (timeline) {
        timeline.innerHTML = '';
        data.about.timeline.forEach(item => {
          const div = document.createElement('div');
          div.className = 'timeline-item';
          div.innerHTML = `<div class="timeline-content"><h4>${item.year}</h4><p>${item.desc}</p></div>`;
          timeline.appendChild(div);
        });
      }
    }

    const skillsSection = document.querySelector('#competencias');
    if (skillsSection) {
      const skillsCards = skillsSection.querySelectorAll('.skills-card');
      const skillsData = data.competencias;
      if (skillsCards[0]) skillsCards[0].querySelector('h3').textContent = skillsData.skillsTitle || 'Skills';
      if (skillsCards[1]) skillsCards[1].querySelector('h3').textContent = skillsData.languagesTitle || 'Linguagens';
      if (skillsCards[2]) skillsCards[2].querySelector('h3').textContent = skillsData.programsTitle || 'Programas';

      const skills = skillsCards[0]?.querySelectorAll('.skill-item') || [];
      skills.forEach((el, iSkill) => {
        if (skillsData.skills[iSkill]) {
          el.querySelector('p').textContent = skillsData.skills[iSkill].name;
          el.querySelector('.percentage').textContent = skillsData.skills[iSkill].percent;
        }
      });

      const languages = skillsCards[1]?.querySelectorAll('.skill-item') || [];
      languages.forEach((el, iLang) => {
        if (skillsData.languages[iLang]) {
          el.querySelector('p').textContent = skillsData.languages[iLang].name;
          el.querySelector('.percentage').textContent = skillsData.languages[iLang].percent;
        }
      });

      const programs = skillsCards[2]?.querySelectorAll('.skill-item') || [];
      programs.forEach((el, iProg) => {
        if (skillsData.programs[iProg]) {
          el.querySelector('p').textContent = skillsData.programs[iProg].name;
          el.querySelector('.percentage').textContent = skillsData.programs[iProg].percent;
        }
      });
    }

    const portfolioSection = document.querySelector('#portfolio');
    if (portfolioSection) {
      const portfolioSubtitle = portfolioSection.querySelector('.section-subtitle');
      const portfolioTitle = portfolioSection.querySelector('.section-title');
      if (portfolioSubtitle) portfolioSubtitle.textContent = data.portfolio.subtitle;
      if (portfolioTitle) portfolioTitle.textContent = data.portfolio.title;
      portfolioSection.querySelectorAll('.portfolio-item').forEach((item, iItem) => {
        const overlay = item.querySelector('.portfolio-overlay');
        if (overlay && data.portfolio.items[iItem]) {
          overlay.innerHTML = `<h3>${data.portfolio.items[iItem].title}</h3><p>${data.portfolio.items[iItem].desc}</p>`;
        }
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

    const blogSection = document.querySelector('#blog');
    if (blogSection) {
      const blogSubtitle = blogSection.querySelector('.section-subtitle');
      const blogTitle = blogSection.querySelector('.section-title');
      if (blogSubtitle) blogSubtitle.textContent = data.blog.subtitle;
      if (blogTitle) blogTitle.textContent = data.blog.title;
      const blogCards = blogSection.querySelectorAll('.experience-card');
      data.blog.cards.forEach((card, iCard) => {
        const cardEl = blogCards[iCard];
        if (!cardEl) return;
        const descParagraphs = cardEl.querySelectorAll('p');
        const heading = cardEl.querySelector('h3');
        if (heading) heading.textContent = card.title;
        if (descParagraphs[0]) descParagraphs[0].textContent = card.date;
        if (descParagraphs[1]) descParagraphs[1].textContent = card.desc;

        const existingLinks = Array.from(cardEl.querySelectorAll('.download-link'));
        existingLinks.slice(card.links.length).forEach(linkEl => linkEl.remove());

        card.links.forEach((link, j) => {
          let anchor = existingLinks[j];
          if (!anchor) {
            anchor = document.createElement('a');
            anchor.className = 'download-link';
            cardEl.appendChild(anchor);
          }
          anchor.textContent = link.text;
          anchor.setAttribute('href', link.href);
        });
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
  if (footer) footer.innerHTML = data.footer;

  const cvBtnPT = document.querySelector('.cv-btn-pt');
  const cvBtnEN = document.querySelector('.cv-btn-en');
  if (cvBtnPT && cvBtnEN) {
    if (lang === 'PT') {
      cvBtnPT.textContent = 'Descarregar CV PT';
      cvBtnEN.textContent = 'Descarregar CV EN';
    } else {
      cvBtnPT.textContent = 'Download CV PT';
      cvBtnEN.textContent = 'Download CV EN';
    }
  }
}
