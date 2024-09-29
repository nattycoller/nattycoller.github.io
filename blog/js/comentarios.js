// script.js
document.addEventListener('DOMContentLoaded', function() {
   const commentForm = document.getElementById('commentForm');
   const commentsList = document.getElementById('comments-list');
   const loadMoreButton = document.getElementById('load-more');
   const submitSpinner = document.getElementById('submit-spinner');
   const loadSpinner = document.getElementById('load-spinner');
   const noMoreComments = document.getElementById('no-more-comments');
   const postId = document.getElementById('postId').value;

   // URL do seu Google Apps Script Web App
   const scriptURL = 'https://script.google.com/macros/s/AKfycbzGdbFZvvPWBr1L8lJskiSBllMjLtOvOw2DQ2SHk4PBUzmsOOu7A2KzkTWy5OqvuAs5NQ/exec';

   let currentPage = 1;
   const commentsPerPage = 5;

   commentForm.addEventListener('submit', e => {
       e.preventDefault();
       const submitButton = commentForm.querySelector('button[type="submit"]');
       submitButton.disabled = true;
       submitSpinner.classList.remove('hidden');

       const formData = new FormData(commentForm);
       formData.append('postId', postId);

       fetch(scriptURL, { method: 'POST', body: formData })
           .then(response => response.json())
           .then(data => {
               if (data.result === 'success') {
                   alert('Comentário enviado com sucesso!');
                   commentForm.reset();
                   currentPage = 1;
                   loadComments();
               } else {
                   alert('Erro ao enviar comentário. Por favor, tente novamente.');
               }
           })
           .catch(error => {
               console.error('Error:', error);
               alert('Erro ao enviar comentário. Por favor, tente novamente.');
           })
           .finally(() => {
               submitButton.disabled = false;
               submitSpinner.classList.add('hidden');
           });
   });

   loadMoreButton.addEventListener('click', () => {
       currentPage++;
       loadComments(true);
   });

   function loadComments(append = false) {
       loadMoreButton.classList.add('hidden');
       loadSpinner.classList.remove('hidden');
       noMoreComments.classList.add('hidden');

       fetch(`${scriptURL}?postId=${postId}&page=${currentPage}&perPage=${commentsPerPage}`)
           .then(response => response.json())
           .then(data => {
               if (!append) {
                   commentsList.innerHTML = '';
               }
               
               if (data.comments.length === 0 && currentPage === 1) {
                   commentsList.innerHTML = '<p class="no-comments">Ainda não há comentários para este post.</p>';
                   loadMoreButton.classList.add('hidden');
                   noMoreComments.classList.add('hidden');
               } else {
                   data.comments.forEach(comment => {
                       const commentElement = document.createElement('div');
                       commentElement.className = 'comment';
                       commentElement.innerHTML = `
                           <p class="comment-author">${comment.name}</p>
                           <p class="comment-date">${new Date(comment.timestamp).toLocaleString()}</p>
                           <p>${comment.comment}</p>
                       `;
                       commentsList.appendChild(commentElement);
                   });

                   if (data.hasMore) {
                       loadMoreButton.classList.remove('hidden');
                       noMoreComments.classList.add('hidden');
                   } else {
                       loadMoreButton.classList.add('hidden');
                       noMoreComments.classList.remove('hidden');
                   }
               }
           })
           .catch(error => {
               console.error('Error:', error);
               alert('Erro ao carregar comentários. Por favor, tente novamente.');
           })
           .finally(() => {
               loadSpinner.classList.add('hidden');
           });
   }

   // Carregar comentários iniciais
   loadComments();
});