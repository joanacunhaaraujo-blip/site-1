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
    const logoImg = document.querySelector(".logo img");
    const originalLogo = "logo2.png";
    const scrolledLogo = "logo3.png";

    function updateLogoOnScroll() {
        if (window.scrollY > 0) {
            navbar.classList.add("scrolled");
            if (logoImg) logoImg.src = scrolledLogo;
        } else {
            navbar.classList.remove("scrolled");
            if (logoImg) logoImg.src = originalLogo;
        }
    }

    window.addEventListener("scroll", updateLogoOnScroll);
    // Run once on load in case page is not at the top
    updateLogoOnScroll();
});
