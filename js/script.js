document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const header = document.querySelector('header');
    const newsletterForm = document.getElementById('newsletter-form');

    // Toggle mobile menu
    hamburger.addEventListener('click', function() {
        this.classList.toggle('active');
        navLinks.classList.toggle('active');
    });

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Newsletter form submission
    newsletterForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const email = document.getElementById('email').value;
        // Here you would typically send the email to your server or a third-party service
        console.log('Email submitted:', email);
        alert('Obrigado por se inscrever na nossa newsletter!');
        newsletterForm.reset();
    });

    // Add animation on scroll
    const sections = document.querySelectorAll('section');
    const options = {
        root: null,
        threshold: 0.1,
        rootMargin: "0px"
    };

    const observer = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                observer.unobserve(entry.target);
            }
        });
    }, options);

    sections.forEach(section => {
        observer.observe(section);
    });

    // Parallax effect for hero section
    window.addEventListener('scroll', function() {
        const scrollPosition = window.pageYOffset;
        const hero = document.querySelector('#hero');
        hero.style.backgroundPositionY = scrollPosition * 0.7 + 'px';
    });

    // Change header background on scroll
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
});