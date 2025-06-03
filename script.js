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
