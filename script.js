$(document).ready(function() {
    // Toggle navigation for mobile
    $('#nav-toggle').click(function() {
        $('.nav').toggle();
    });

    // Smooth scrolling for navigation links
    $('.link').on('click', function(event) {
        event.preventDefault();
        var target = $(this).attr('href');
        $('html, body').animate({
            scrollTop: $(target).offset().top - 70 // Adjust for fixed navbar height
        }, 800);
    });
})

document.addEventListener("DOMContentLoaded", function () {
    const skillsSection = document.getElementById("competencias");
    const progressBars = document.querySelectorAll(".progress-bar");
    let skillsAnimated = false;

    function isElementInViewport(el) {
        const rect = el.getBoundingClientRect();
        return rect.top < window.innerHeight && rect.bottom >= 0;
    }

    function animateProgressBars() {
        if (!skillsAnimated && isElementInViewport(skillsSection)) {
            progressBars.forEach((bar) => {
                const percent = bar.getAttribute("data-percent");
                bar.style.width = percent + "%";
            });
            skillsAnimated = true; // Evita que a animação seja repetida
        }
    }

    window.addEventListener("scroll", animateProgressBars);
});


document.addEventListener("DOMContentLoaded", function () {
    const navbar = document.querySelector(".custom-navbar");
    const header = document.querySelector(".header");

    window.addEventListener("scroll", function () {
        if (window.scrollY > header.offsetHeight) {
            navbar.classList.add("scrolled");
        } else {
            navbar.classList.remove("scrolled");
        }
    });
});

// Language translations for PT and EN
const translations = {
  PT: {
    nav: ["Início", "Sobre Mim", "Competências", "Portfolio", "Contactos"],
    header: {
      up: "Olá, sou a",
      down: "Joana Araújo",
      contact: "Contacte-me!"
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
        { name: "Python", percent: "60%" }
      ],
      programs: [
        { name: "Final Cut Pro", percent: "75%" },
        { name: "Figma", percent: "90%" },
        { name: "Photoshop", percent: "70%" },
        { name: "Microsoft Office", percent: "80%" },
        { name: "Blender", percent: "60%" }
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
    blog: {
      subtitle: "As minhas",
      title: "Experiências profissionais",
      cards: [
        {
          title: "Web developer",
          date: "Presente",
          desc: `Desenvolvo websites por conta própria, desde a fase de planeamento até à implementação final. Trabalho com tecnologias como HTML, CSS e JavaScript, React e PHP criando sites responsivos e focados na experiência do utilizador. Tenho colaborado com clientes para entender as suas necessidades e traduzir ideias em soluções funcionais.`,
          links: [
            { href: "http://henriquearaujodasilvapsi.pt", text: "Exemplo 1" },
            { href: "https://joanaaraujo03.github.io/ThinkAlike/index.html", text: "Exemplo 2" }
          ]
        },
        {
          title: "Forum Creativa",
          date: "2024 - Presente",
          desc: `Recebi formação especializada para as marcas Nescafé Dolce Gusto e Nescafé Dolce Gusto Neo, desenvolvendo conhecimento aprofundado sobre o portfólio de produtos e técnicas eficazes de apresentação e venda. Atuo em ações representando a marca, garantindo um atendimento profissional e informativo ao cliente, promovendo a interação e fidelização dos consumidores.`,
          links: [
            { href: "certificado1.pdf", text: "Descarregar Diploma" }
          ]
        },
        {
          title: "Babysitting",
          date: "2021",
          desc: `Experiência em cuidados infantis ocasionais, desenvolvendo fortes competências como paciência, responsabilidade e comunicação interpessoal, essenciais para estabelecer confiança e um ambiente seguro.`,
          links: []
        }
      ]
    },
    contact: {
      subtitle: "Os meus",
      title: "Contactos"
    },
    footer: "© 2025 Todos os direitos reservados a <span style=\"font-weight: 600;\"> Joana Araújo </span>"
  },
  EN: {
    nav: ["Home", "About", "Skills", "Portfolio", "Contact"],
    header: {
      up: "Hi, I'm",
      down: "Joana Araújo",
      contact: "Contact me!"
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
      programsTitle: "Programs",
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
        { name: "Python", percent: "60%" }
      ],
      programs: [
        { name: "Final Cut Pro", percent: "75%" },
        { name: "Figma", percent: "90%" },
        { name: "Photoshop", percent: "70%" },
        { name: "Microsoft Office", percent: "80%" },
        { name: "Blender", percent: "60%" }
      ]
    },
    portfolio: {
      subtitle: "My",
      title: "Portfolio",
      items: [
        { title: "Websites", desc: "Websites developed in an academic context" },
        { title: "Photography", desc: "Academic Photography Portfolio" },
        { title: "Videos", desc: "Videos developed both academically and personally" }
      ]
    },
    blog: {
      subtitle: "My",
      title: "Professional Experience",
      cards: [
        {
          title: "Web developer",
          date: "Present",
          desc: `I develop websites independently, from planning to final implementation. I work with technologies such as HTML, CSS, JavaScript, React, and PHP, creating responsive, user-focused sites. I have collaborated with clients to understand their needs and translate ideas into functional solutions.`,
          links: [
            { href: "http://henriquearaujodasilvapsi.pt", text: "Example 1" },
            { href: "https://joanaaraujo03.github.io/ThinkAlike/index.html", text: "Example 2" }
          ]
        },
        {
          title: "Forum Creativa",
          date: "2024 - Present",
          desc: `I received specialized training for the Nescafé Dolce Gusto and Nescafé Dolce Gusto Neo brands, developing in-depth knowledge of the product portfolio and effective presentation and sales techniques. I act in actions representing the brand, ensuring professional and informative customer service, promoting interaction and consumer loyalty.`,
          links: [
            { href: "certificado1.pdf", text: "Download Diploma" }
          ]
        },
        {
          title: "Babysitting",
          date: "2021",
          desc: `Experience in occasional childcare, developing strong skills such as patience, responsibility, and interpersonal communication, essential for establishing trust and a safe environment.`,
          links: []
        }
      ]
    },
    contact: {
      subtitle: "My",
      title: "Contacts"
    },
    footer: "© 2025 All rights reserved to <span style=\"font-weight: 600;\"> Joana Araújo </span>"
  }
};

function setLanguage(lang) {
  // Navbar
  const navLinks = document.querySelectorAll('.nav .link');
  translations[lang].nav.forEach((text, i) => {
    if (navLinks[i]) navLinks[i].textContent = text;
  });
  // Header
  document.querySelector('.header-title .up').textContent = translations[lang].header.up;
  document.querySelector('.header-title .down').textContent = translations[lang].header.down;
  document.querySelector('.btn-contact').textContent = translations[lang].header.contact;
  // About
  document.querySelector('#about .section-subtitle').textContent = translations[lang].about.subtitle;
  document.querySelector('#about .section-title').textContent = translations[lang].about.title;
  document.querySelector('#about .about-caption-text p:last-of-type').textContent = translations[lang].about.text;
  // Timeline Title
  document.querySelector('#about .timeline-title').textContent = lang === 'PT' ? 'Percurso Académico' : "Academic Path";
  // Timeline
  const timeline = document.querySelector('#about .timeline');
  timeline.innerHTML = '';
  translations[lang].about.timeline.forEach(item => {
    timeline.innerHTML += `<div class=\"timeline-item\"><div class=\"timeline-content\"><h4>${item.year}</h4><p>${item.desc}</p></div></div>`;
  });
  document.querySelector('.btn-download a').textContent = translations[lang].about.download;
  // Skills Section
  document.querySelector('#competencias .section-subtitle').textContent = translations[lang].competencias.subtitle;
  document.querySelector('#competencias .section-title').textContent = translations[lang].competencias.title;
  // Skills
  const skillsCards = document.querySelectorAll('.skills-card');
  // Always update card titles for all languages
  if (skillsCards[0]) skillsCards[0].querySelector('h3').textContent = translations[lang].competencias.skillsTitle || 'Skills';
  if (skillsCards[1]) skillsCards[1].querySelector('h3').textContent = translations[lang].competencias.languagesTitle || 'Linguagens';
  if (skillsCards[2]) skillsCards[2].querySelector('h3').textContent = translations[lang].competencias.programsTitle || 'Programas';
  const skills = document.querySelectorAll('.skills-card')[0].querySelectorAll('.skill-item');
  skills.forEach((el, i) => {
    if (translations[lang].competencias.skills[i]) {
      el.querySelector('p').textContent = translations[lang].competencias.skills[i].name;
      el.querySelector('.percentage').textContent = translations[lang].competencias.skills[i].percent;
    }
  });
  // Languages
  const langs = document.querySelectorAll('.skills-card')[1].querySelectorAll('.skill-item');
  langs.forEach((el, i) => {
    if (translations[lang].competencias.languages[i]) {
      el.querySelector('p').textContent = translations[lang].competencias.languages[i].name;
      el.querySelector('.percentage').textContent = translations[lang].competencias.languages[i].percent;
    }
  });
  // Programs
  const progs = document.querySelectorAll('.skills-card')[2].querySelectorAll('.skill-item');
  progs.forEach((el, i) => {
    if (translations[lang].competencias.programs[i]) {
      el.querySelector('p').textContent = translations[lang].competencias.programs[i].name;
      el.querySelector('.percentage').textContent = translations[lang].competencias.programs[i].percent;
    }
  });
  // Portfolio
  document.querySelector('#portfolio .section-subtitle').textContent = translations[lang].portfolio.subtitle;
  document.querySelector('#portfolio .section-title').textContent = translations[lang].portfolio.title;
  const portfolioItems = document.querySelectorAll('.portfolio-item');
  portfolioItems.forEach((el, i) => {
    const overlay = el.querySelector('.portfolio-overlay');
    overlay.innerHTML = `<h3>${translations[lang].portfolio.items[i].title}</h3><p>${translations[lang].portfolio.items[i].desc}</p>`;
  });
  // Blog/Experience
  document.querySelector('#blog .section-subtitle').textContent = translations[lang].blog.subtitle;
  document.querySelector('#blog .section-title').textContent = translations[lang].blog.title;
  const blogCards = document.querySelectorAll('.experience-card');
  translations[lang].blog.cards.forEach((card, i) => {
    if (blogCards[i]) {
      blogCards[i].querySelector('h3').textContent = card.title;
      blogCards[i].querySelector('.date').textContent = card.date;
      blogCards[i].querySelectorAll('p')[1].textContent = card.desc;
      const links = blogCards[i].querySelectorAll('.download-link');
      card.links.forEach((l, j) => {
        if (links[j]) links[j].textContent = l.text;
      });
    }
  });
  // Contact
  document.querySelector('#contact .section-subtitle').textContent = translations[lang].contact.subtitle;
  document.querySelector('#contact .section-title').textContent = translations[lang].contact.title;
  // Footer
  document.querySelector('.footer p').innerHTML = translations[lang].footer;

  // Update both download CV buttons
  const cvBtnPT = document.querySelector('.cv-btn-pt');
  const cvBtnEN = document.querySelector('.cv-btn-en');
  if (cvBtnPT && cvBtnEN) {
    if (lang === 'PT') {
      cvBtnPT.textContent = 'Descarregar CV PT';
      cvBtnPT.setAttribute('href', 'cv.pdf');
      cvBtnEN.textContent = 'Descarregar CV EN';
      cvBtnEN.setAttribute('href', 'cv_en.pdf');
    } else {
      cvBtnPT.textContent = 'Download CV PT';
      cvBtnPT.setAttribute('href', 'cv.pdf');
      cvBtnEN.textContent = 'Download CV EN';
      cvBtnEN.setAttribute('href', 'cv_en.pdf');
    }
  }
}

// Language toggle logic for all pages
function setupLangToggle(translations, setLanguage) {
  document.addEventListener("DOMContentLoaded", function () {
    const langBtn = document.getElementById('lang-toggle');
    let currentLang = 'PT';
    if (langBtn) {
      langBtn.addEventListener('click', function() {
        currentLang = currentLang === 'PT' ? 'EN' : 'PT';
        langBtn.textContent = currentLang === 'PT' ? 'EN' : 'PT';
        setLanguage(currentLang);
      });
      setLanguage('PT');
    }
  });
}

// Call setupLangToggle on each page with the translations and setLanguage function
setupLangToggle(translations, setLanguage);


