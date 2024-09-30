// script.js
document.addEventListener('DOMContentLoaded', function() {
    const commentForm = document.getElementById('commentForm');
    const commentsList = document.getElementById('comments-list');
    const loadMoreButton = document.getElementById('load-more');
    const submitSpinner = document.getElementById('submit-spinner');
    const loadSpinner = document.getElementById('load-spinner');
    const noMoreComments = document.getElementById('no-more-comments');
    const commentCount = document.getElementById('comment-count');
    const postId = document.getElementById('postId').value;

    // URL do seu Google Apps Script Web App
    const scriptURL = 'https://script.google.com/macros/s/AKfycbw_2b2tAuBWNuGWMmouIP_5ApS82kRoz19H_sc69kXwdddAxHkYvK7ZKrhCmw1AvLregA/exec';

    let currentPage = 1;
    const commentsPerPage = 5;
    let totalComments = 0;

    // Função para obter os likes do usuário do armazenamento local
    function getUserLikes() {
        return JSON.parse(localStorage.getItem('userLikes') || '{}');
    }

    // Função para salvar os likes do usuário no armazenamento local
    function saveUserLike(commentId) {
        const userLikes = getUserLikes();
        userLikes[commentId] = true;
        localStorage.setItem('userLikes', JSON.stringify(userLikes));
    }

    commentForm.addEventListener('submit', e => {
        e.preventDefault();
        const submitButton = commentForm.querySelector('button[type="submit"]');
        submitButton.disabled = true;
        submitSpinner.classList.remove('hidden');

        const formData = new FormData(commentForm);
        formData.append('postId', postId);
        formData.append('action', 'addComment');

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

        fetch(`${scriptURL}?postId=${postId}&page=${currentPage}&perPage=${commentsPerPage}&action=getComments`)
            .then(response => response.json())
            .then(data => {
                if (!append) {
                    commentsList.innerHTML = '';
                }
                
                totalComments = data.totalComments;
                updateCommentCount();

                if (data.comments.length === 0 && currentPage === 1) {
                    commentsList.innerHTML = '<p class="no-comments">Ainda não há comentários para este post.</p>';
                    loadMoreButton.classList.add('hidden');
                    noMoreComments.classList.add('hidden');
                } else {
                    const userLikes = getUserLikes();
                    data.comments.forEach(comment => {
                        const commentElement = document.createElement('div');
                        commentElement.className = 'comment';
                        commentElement.innerHTML = `
                            <p class="comment-author">${comment.name}</p>
                            <p class="comment-date">${new Date(comment.timestamp).toLocaleString()}</p>
                            <p>${comment.comment}</p>
                            <button class="like-button ${userLikes[comment.id] ? 'liked' : ''}" data-comment-id="${comment.id}">
                                <i class="fas fa-heart"></i>
                                <span class="like-count">${comment.likes || 0}</span>
                            </button>
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

                addLikeEventListeners();
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Erro ao carregar comentários. Por favor, tente novamente.');
            })
            .finally(() => {
                loadSpinner.classList.add('hidden');
            });
    }

    function updateCommentCount() {
        commentCount.textContent = `(${totalComments})`;
    }

    function addLikeEventListeners() {
        const likeButtons = document.querySelectorAll('.like-button');
        likeButtons.forEach(button => {
            button.addEventListener('click', function() {
                const commentId = this.dataset.commentId;
                const userLikes = getUserLikes();
                const likeCount = this.querySelector('.like-count');
                const currentLikes = parseInt(likeCount.textContent);

                if (!userLikes[commentId]) {
                    // Adicionar like
                    likeCount.textContent = currentLikes + 1;
                    this.classList.add('liked');
                    updateLike(commentId, 'add', currentLikes + 1);
                    saveUserLike(commentId);
                } else {
                    // Remover like
                    likeCount.textContent = currentLikes - 1;
                    this.classList.remove('liked');
                    updateLike(commentId, 'remove', currentLikes - 1);
                    removeUserLike(commentId);
                }
            });
        });
    }

    function updateLike(commentId, action, newLikeCount) {
        fetch(`${scriptURL}?action=${action}Like&commentId=${commentId}`, { method: 'POST' })
            .then(response => response.json())
            .then(data => {
                if (data.result === 'success') {
                    const likeButton = document.querySelector(`.like-button[data-comment-id="${commentId}"]`);
                    const likeCount = likeButton.querySelector('.like-count');
                    likeCount.textContent = data.likes;
                } else {
                    alert('Erro ao atualizar o like. Por favor, tente novamente.');
                    loadComments(); // Recarrega os comentários para atualizar o estado correto
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Erro ao atualizar o like. Por favor, tente novamente.');
                loadComments(); // Recarrega os comentários para atualizar o estado correto
            });
    }

    function removeUserLike(commentId) {
        const userLikes = getUserLikes();
        delete userLikes[commentId];
        localStorage.setItem('userLikes', JSON.stringify(userLikes));
    }

    // Carregar comentários iniciais
    loadComments();
});