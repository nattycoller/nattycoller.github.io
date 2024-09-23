document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('agendamentoForm');
    const modal = document.getElementById('modal');
    const spinner = document.getElementById('loadingSpinner');
    const responseMessage = document.getElementById('responseMessage');
    const closeModal = document.getElementById('closeModal');
    const okButton = document.getElementById('okButton');

    form.addEventListener('submit', function(event) {
        event.preventDefault();

        // Exibe o modal e o spinner enquanto os dados estão sendo enviados
        modal.classList.add('show');
        spinner.classList.remove('hidden');
        okButton.classList.add('hidden'); // Esconde o botão OK durante o carregamento
        responseMessage.textContent = ''; // Limpa qualquer mensagem anterior

        const formData = new FormData(form);
        const data = new URLSearchParams();

        // Converte FormData para URLSearchParams
        formData.forEach((value, key) => {
            data.append(key, value);
        });

        // Envia os dados ao Google Apps Script
        fetch('https://script.google.com/macros/s/AKfycbxl7RskREmpd89XrEGySek22mR7c5Tj1Rsl8EVIhi6Vj6mmR1xIRH1mmdf43Lqs9xgItw/exec', {
            method: 'POST',
            body: data,
        })
        .then(response => response.text())
        .then(result => {
            spinner.classList.add('hidden'); // Esconde o spinner
            responseMessage.textContent = result; // Exibe a resposta do Google Apps Script
            form.reset(); // Limpa o formulário
            okButton.classList.remove('hidden'); // Mostra o botão OK
        })
        .catch(error => {
            spinner.classList.add('hidden'); // Esconde o spinner
            responseMessage.textContent = 'Erro ao enviar dados. Tente novamente mais tarde.';
            console.error('Erro:', error);
            okButton.classList.remove('hidden'); // Mostra o botão OK
        });
    });

    // Fecha o modal ao clicar no botão 'X'
    closeModal.addEventListener('click', function() {
        modal.classList.remove('show');
    });

    // Fecha o modal ao clicar no botão 'OK'
    okButton.addEventListener('click', function() {
        modal.classList.remove('show');
    });
});
