document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('nav ul.poppins');

    hamburger.addEventListener('click', function() {
        this.classList.toggle('active');
        navMenu.classList.toggle('show');
    });

    // Close menu when a link is clicked
    document.querySelectorAll('nav ul.poppins li a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('show');
        });
    });

    // Cookie banner functionality
    const cookieBanner = document.querySelector('.cookie-banner');
    const acceptCookiesBtn = document.getElementById('accept-cookies');

    if (!localStorage.getItem('cookiesAccepted')) {
        cookieBanner.classList.add('show');
    }

    acceptCookiesBtn.addEventListener('click', function() {
        localStorage.setItem('cookiesAccepted', 'true');
        cookieBanner.classList.remove('show');
    });

    // Scroll to Top functionality
    const scrollTopBtn = document.getElementById('scrollTopBtn');

    window.onscroll = function() {
        if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
            scrollTopBtn.style.display = "block";
        } else {
            scrollTopBtn.style.display = "none";
        }
    };

    scrollTopBtn.addEventListener('click', function() {
        document.body.scrollTop = 0; // For Safari
        document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
    });
});

// Função para carregar o script apenas em dispositivos móveis
if (window.matchMedia("(max-width: 768px)").matches) {
// MOBILE FORM REPORT
document.addEventListener('DOMContentLoaded', function() {
    // Função para criar e exibir o modal de denúncia
    function showReportModal(commentId) {
    const modal = document.createElement('div');
    modal.className = 'report-modal mobile-report-modal';
    modal.innerHTML = `
        <div class="report-modal-content">
            <h2>Denunciar Comentário</h2>
            <form id="report-form">
                <input type="text" id="reporter-name" placeholder="Seu nome" required>
                <input type="email" id="reporter-email" placeholder="Seu email" required>
                <p>Por favor, selecione o motivo da denúncia:</p>
                <div class="checkbox-group">
                    <label>
                        <input type="checkbox" name="reason" value="Conteúdo ofensivo"> Conteúdo ofensivo
                    </label>
                    <label>
                        <input type="checkbox" name="reason" value="Spam"> Spam
                    </label>
                    <label>
                        <input type="checkbox" name="reason" value="Informação falsa"> Informação falsa
                    </label>
                    <label>
                        <input type="checkbox" name="reason" value="Outro"> Outro
                    </label>
                </div>
                <textarea id="other-reason" placeholder="Especifique o motivo (se selecionou 'Outro')" style="display: none;"></textarea>
                <div id="captcha-container">
                    <p id="captcha-question"></p>
                    <input type="number" id="captcha-answer" required>
                </div>
                <div class="report-modal-buttons">
                    <button type="submit">Enviar Denúncia</button>
                    <button type="button" id="cancel-report">Cancelar</button>
                </div>
            </form>
        </div>
    `;

    document.body.appendChild(modal);

    const reportForm = document.getElementById('report-form');
    const otherReasonCheckbox = reportForm.querySelector('input[value="Outro"]');
    const otherReasonTextarea = document.getElementById('other-reason');
    const captchaQuestion = document.getElementById('captcha-question');
    const captchaAnswer = document.getElementById('captcha-answer');

    // Função para gerar um novo captcha
    function generateCaptcha() {
        const num1 = Math.floor(Math.random() * 10) + 1;
        const num2 = Math.floor(Math.random() * 10) + 1;
        const captchaResult = num1 + num2;
        captchaQuestion.textContent = `Quanto é ${num1} + ${num2}?`;
        return captchaResult;
    }

    // Gerar captcha inicial
    let currentCaptchaResult = generateCaptcha();

    otherReasonCheckbox.addEventListener('change', function() {
        otherReasonTextarea.style.display = this.checked ? 'block' : 'none';
    });

    reportForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const reporterName = document.getElementById('reporter-name').value;
        const reporterEmail = document.getElementById('reporter-email').value;
        const selectedReasons = Array.from(reportForm.querySelectorAll('input[name="reason"]:checked'))
            .map(checkbox => checkbox.value);

        if (otherReasonCheckbox.checked) {
            selectedReasons.push(otherReasonTextarea.value);
        }

        if (selectedReasons.length === 0) {
            alert('Por favor, selecione pelo menos um motivo para a denúncia.');
            return;
        }

        if (parseInt(captchaAnswer.value) !== currentCaptchaResult) {
            alert('Resposta do captcha incorreta. Por favor, tente novamente.');
            currentCaptchaResult = generateCaptcha();
            captchaAnswer.value = '';
            return;
        }

        const reason = selectedReasons.join(', ');
        console.log('Denúncia enviada:', { commentId, reporterName, reporterEmail, reason });
        alert('Denúncia enviada com sucesso!');
        modal.remove();
    });

    // Fechar o modal ao tocar fora dele
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.remove();
        }
    });

    // Fechar o modal ao tocar no botão de cancelar
    document.getElementById('cancel-report').addEventListener('click', function() {
        modal.remove();
    });
    }

    // Adiciona event listeners aos botões de denúncia
    function addReportEventListeners() {
    document.addEventListener('click', function(e) {
        const reportButton = e.target.closest('.report-button');
        if (reportButton) {
        const commentId = reportButton.dataset.commentId;
        showReportModal(commentId);
        }
    });

    // Suporte para eventos de toque
    document.addEventListener('touchstart', function(e) {
        const reportButton = e.target.closest('.report-button');
        if (reportButton) {
        e.preventDefault();
        const commentId = reportButton.dataset.commentId;
        showReportModal(commentId);
        }
    });
    }

    // Inicializa os event listeners
    addReportEventListeners();
});
}