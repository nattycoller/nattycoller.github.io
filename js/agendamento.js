// Function to show the modal
function showModal(message, redirectOnClose) {
    var modal = document.getElementById("myModal");
    var modalMessage = document.getElementById("modalMessage");
    var closeButton = document.getElementsByClassName("close")[0];
    var okButton = document.getElementById("okButton");
    var spinner = document.getElementById("spinner");    

    // Set the message in the modal
    modalMessage.innerHTML = message;

    // Show the modal
    modal.style.display = "block";

    // Show the spinner if the message indicates that data is being sent
    if (message === "Enviando dados...") {
        spinner.style.display = "block";
        if (okButton) {
            okButton.style.display = "none";
        }
    } else {
        spinner.style.display = "none";
        if (okButton) {
            okButton.style.display = "block";
        }
    }

    // Add event listener to close the modal when the close button is clicked
    closeButton.addEventListener("click", function() {
        modal.style.display = "none";
        if (redirectOnClose) {
            // window.location.href = 'index.html';
        }
    });

    // Add event listener to OK button
    if (okButton) {
        okButton.addEventListener("click", function() {
            modal.style.display = "none";
            if (redirectOnClose) {
                // window.location.href = 'index.html';
            }
        });
    }
}

// Add event listener to the form submission
document.getElementById("agendamentoForm").addEventListener("submit", function(event) {
    event.preventDefault(); // Prevent the default form submission

    // Show the modal immediately to indicate form submission is in progress
    showModal("Enviando dados...", false); // Set to false, so no redirection on this stage

    // Perform an AJAX request to submit the form
    var xhr = new XMLHttpRequest();
    xhr.open("POST", this.action);
    xhr.onreadystatechange = function() {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                // Successful response
                var response = xhr.responseText;
                showModal(`
                    <h2>Agendamento Solicitado!</h2>
                    <p>Efetue o pagamento e depois clique em (já paguei).</p>  
                    <img id="qrCodeImg" src="#" alt="QR Code para pagamento" />
                    <p>Chave Pix:</p>  
                    <p id="chavePix" class="pix-key">collergabriela92@gmail.com</p>
                    <button id="copiarPix" class="copy-button">Copiar Chave Pix</button>
                    <a id="linkPacote" href="https://wa.me/5587991915811?text=Olá%20Nilza!%20Realizei%20o%20agendamento%20da%20nossa%20video-chamada.%20Vou%20te%20passar%20o%20comprovante%20aqui%20para%20você%20confirmar%20no%20sistema..." target="_blank"><button class="payment-button">Já paguei!</button></a>
                    <p id="alertaCopia" class="alerta-copia" style="display: none;">Chave Pix copiada!</p>
                `, true); // Set to true for redirection

                document.getElementById("agendamentoForm").reset(); // Clear the form fields

                // Add the event listener for the copiarPix button after it has been added to the DOM
                var copiarPixButton = document.getElementById('copiarPix');
                if (copiarPixButton) {
                    copiarPixButton.addEventListener('click', () => {
                        const chavePixText = document.getElementById('chavePix').textContent;
                        navigator.clipboard.writeText(chavePixText).then(() => {
                            document.getElementById('alertaCopia').style.display = 'block';
                            setTimeout(() => {
                                document.getElementById('alertaCopia').style.display = 'none';
                            }, 2000);
                        });
                    });
                }
            } else {
                // Error response
                showModal("Erro: Algo deu errado.", false); // Set to false, so no redirection on error
            }
        }
    };
    xhr.send(new FormData(this));
});
