
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const navLinksAnchors = document.querySelectorAll('.nav-links a');

    function toggleMenu() {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
    }

    hamburger.addEventListener('click', toggleMenu);

    navLinksAnchors.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            toggleMenu(); // Fecha o menu

            // Rola suavemente para o elemento alvo
            targetElement.scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
});