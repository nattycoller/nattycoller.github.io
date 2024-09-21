// Function to show the modal
function showModal(message) {
   var modal = document.getElementById("myModal");
   var modalMessage = document.getElementById("modalMessage");
   var closeButton = document.getElementsByClassName("close-newslatter")[0];
   var okButton = document.getElementById("okButton");
   var spinner = document.getElementById("spinner");

   // Set the message in the modal
   modalMessage.textContent = message;

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
   });

   // Add event listener to OK button
   if (okButton) {
       okButton.addEventListener("click", function() {
           modal.style.display = "none";
       });
   }
}

// Add event listener to the form submission
document.getElementById("newslatterForm").addEventListener("submit", function(event) {
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
               showModal("Email salvo! Nos manteremos informados sobre mais novidades!", true); // Set to true for redirection
               document.getElementById("newslatterForm").reset(); // Clear the form fields
           } else {
               // Error response
               showModal("Erro: Algo deu errado.", false); // Set to false, so no redirection on error
           }
       }
   };
   xhr.send(new FormData(this));
});
