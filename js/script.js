// script.js

document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('modalPagamento');
    const closeModalButton = document.querySelector('#modalPagamento .close');

    // Função para abrir o modal
    function openModal() {
        modal.style.display = 'flex';
    }

    // Função para fechar o modal
    function closeModal() {
        modal.style.display = 'none';
    }

    // Adiciona o evento de clique aos botões de pagamento
    document.querySelectorAll('.botaoPagamento').forEach(button => {
        button.addEventListener('click', () => {
            // Atualiza o conteúdo do modal com base no botão clicado
            const buttonId = button.id;
            let qrCodeSrc, chavePix, linkPacote;

            switch (buttonId) {
                case 'botaoPagamento1':
                    qrCodeSrc = 'url_para_qr_code_1.png'; // Substitua pelo URL real
                    chavePix = 'collergabriela92@gmail.com'; // Substitua pela chave real
                    linkPacote = 'https://wa.me/5587991915811?text=Olá%20Nilza!%20Comprei%20o%20Pacote%20Básico%20e%20já%20realizei%20seu%20pagamento!%20Vou%20te%20passar%20o%20comprovante%20para%20receber%20meus%20conteúdos...';
                    break;
                case 'botaoPagamento2':
                    qrCodeSrc = 'url_para_qr_code_2.png'; // Substitua pelo URL real
                    chavePix = 'collergabriela92@gmail.com'; // Substitua pela chave real
                    linkPacote = 'https://wa.me/5587991915811?text=Olá%20Nilza!%20Comprei%20o%20Pacote%20Ouro%20e%20já%20realizei%20seu%20pagamento!%20Vou%20te%20passar%20o%20comprovante%20para%20receber%20meus%20conteúdos...';
                    break;
                case 'botaoPagamento3':
                    qrCodeSrc = 'url_para_qr_code_3.png'; // Substitua pelo URL real
                    chavePix = 'collergabriela92@gmail.com'; // Substitua pela chave real
                    linkPacote = 'https://wa.me/5587991915811?text=Olá%20Nilza!%20Comprei%20o%20Pacote%20Diamante%20e%20já%20realizei%20seu%20pagamento!%20Vou%20te%20passar%20o%20comprovante%20para%20receber%20meus%20conteúdos...';
                    break;
                default:
                    qrCodeSrc = '';
                    chavePix = '';
                    linkPacote = '';
            }

            document.getElementById('qrCodeImg').src = qrCodeSrc;
            document.getElementById('chavePix').textContent = chavePix;
            document.getElementById('linkPacote').href = linkPacote;

            openModal();
        });
    });

    // Adiciona o evento de clique ao botão de fechar
    closeModalButton.addEventListener('click', closeModal);

    // Fecha o modal se o usuário clicar fora do conteúdo
    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            closeModal();
        }
    });

    // Função para copiar chave Pix
    document.getElementById('copiarPix').addEventListener('click', () => {
        const chavePixText = document.getElementById('chavePix').textContent;
        navigator.clipboard.writeText(chavePixText).then(() => {
            document.getElementById('alertaCopia').style.display = 'block';
            setTimeout(() => {
                document.getElementById('alertaCopia').style.display = 'none';
            }, 2000);
        });
    });
});