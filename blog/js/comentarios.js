document.addEventListener('DOMContentLoaded', function() {
    const commentForm = document.getElementById('commentForm');
    const commentsList = document.getElementById('comments-list');
    const loadMoreButton = document.getElementById('load-more');
    const submitSpinner = document.getElementById('submit-spinner');
    const loadSpinner = document.getElementById('load-spinner');
    const noMoreComments = document.getElementById('no-more-comments');
    const commentCount = document.getElementById('comment-count');
    const postId = document.getElementById('postId').value;
    const commentTextarea = document.getElementById('comment');
    const charCount = document.getElementById('charCount');

    // URL do seu Google Apps Script Web App
    const scriptURL = 'https://script.google.com/macros/s/AKfycbwNn-snwHzEiTexX4kDraAWtCOGexCPqKtzwGcjJT6Q22avx8x64QpHdSZtUHlL_4-zkA/exec';

    let currentPage = 1;
    const commentsPerPage = 5;
    let totalComments = 0;

    function getUserInfo() {
        return JSON.parse(localStorage.getItem('userInfo') || '{}');
    }

    function saveUserInfo(name, email) {
        localStorage.setItem('userInfo', JSON.stringify({ name, email }));
    }

    function getUserLikes() {
        return JSON.parse(localStorage.getItem('userLikes') || '{}');
    }

    function saveUserLike(commentId) {
        const userLikes = getUserLikes();
        userLikes[commentId] = true;
        localStorage.setItem('userLikes', JSON.stringify(userLikes));
    }

    function removeUserLike(commentId) {
        const userLikes = getUserLikes();
        delete userLikes[commentId];
        localStorage.setItem('userLikes', JSON.stringify(userLikes));
    }

    function getUserReports() {
        return JSON.parse(localStorage.getItem('userReports') || '{}');
    }

    function saveUserReport(commentId) {
        const userReports = getUserReports();
        userReports[commentId] = true;
        localStorage.setItem('userReports', JSON.stringify(userReports));
    }

    commentTextarea.addEventListener('input', function() {
        const remainingChars = 500 - this.value.length;
        charCount.textContent = this.value.length;
        if (remainingChars < 0) {
            charCount.style.color = 'red';
        } else {
            charCount.style.color = '';
        }
    });

    commentForm.addEventListener('submit', e => {
        e.preventDefault();
        const submitButton = commentForm.querySelector('button[type="submit"]');
        submitButton.disabled = true;
        submitSpinner.classList.remove('hidden');

        const formData = new FormData(commentForm);
        formData.append('postId', postId);
        formData.append('action', 'addComment');

        const name = formData.get('name');
        const email = formData.get('email');
        saveUserInfo(name, email);

        fetch(scriptURL, { method: 'POST', body: formData })
            .then(response => response.json())
            .then(data => {
                if (data.result === 'success') {
                    alert('Comentário enviado com sucesso!');
                    commentForm.reset();
                    charCount.textContent = '0';
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
                    const userInfo = getUserInfo();
                    const userReports = getUserReports();
                    data.comments.forEach(comment => {
                        const commentElement = createCommentElement(comment, userLikes, userInfo, userReports);
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
                addEditEventListeners();
                addReportEventListeners();
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

    function addEditEventListeners() {
        const editButtons = document.querySelectorAll('.edit-button');
        editButtons.forEach(button => {
            button.addEventListener('click', function() {
                const commentId = this.dataset.commentId;
                const commentElement = this.closest('.comment');
                const commentContent = commentElement.querySelector('.comment-content');
                const currentComment = commentContent.textContent;

                const editForm = document.createElement('form');
                editForm.innerHTML = `
                    <textarea class="edit-textarea" maxlength="500">${currentComment}</textarea>
                    <div class="character-count"><span class="edit-char-count">${currentComment.length}</span>/500</div>
                    <div class="edit-buttons">
                        <button type="submit" class="save-edit-button">Salvar</button>
                        <button type="button" class="cancel-edit-button">Cancelar</button>
                    </div>
                `;

                commentContent.replaceWith(editForm);
                this.style.display = 'none'; // Esconde o botão de editar

                const editTextarea = editForm.querySelector('.edit-textarea');
                const editCharCount = editForm.querySelector('.edit-char-count');

                editTextarea.addEventListener('input', function() {
                    const remainingChars = 500 - this.value.length;
                    editCharCount.textContent = this.value.length;
                    if (remainingChars < 0) {
                        editCharCount.style.color = 'red';
                    } else {
                        editCharCount.style.color = '';
                    }
                });

                editForm.addEventListener('submit', function(e) {
                    e.preventDefault();
                    const newComment = editTextarea.value;
                    updateComment(commentId, newComment, commentElement);
                });

                editForm.querySelector('.cancel-edit-button').addEventListener('click', function() {
                    editForm.replaceWith(commentContent);
                    button.style.display = 'inline-block'; // Mostra o botão de editar novamente
                });
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

    function updateComment(commentId, newComment, commentElement) {
        const formData = new FormData();
        formData.append('action', 'updateComment');
        formData.append('commentId', commentId);
        formData.append('comment', newComment);
    
        fetch(scriptURL, { method: 'POST', body: formData })
            .then(response => response.json())
            .then(data => {
                if (data.result === 'success') {
                    const commentContent = document.createElement('p');
                    commentContent.className = 'comment-content';
                    commentContent.textContent = newComment;
                    commentElement.querySelector('form').replaceWith(commentContent);
                    commentElement.querySelector('.edit-button').style.display = 'inline-block'; // Mostra o botão de editar novamente
                    alert('Comentário atualizado com sucesso!');
                } else {
                    alert('Erro ao atualizar o comentário. Por favor, tente novamente.');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Erro ao atualizar o comentário. Por favor, tente novamente.');
            });
    }

    function createCommentElement(comment, userLikes, userInfo, userReports) {
        const commentElement = document.createElement('div');
        commentElement.className = 'comment';
        commentElement.dataset.commentId = comment.id;
        commentElement.innerHTML = `
            <p class="comment-author">${comment.name}</p>
            <p class="comment-date">${new Date(comment.timestamp).toLocaleString()}</p>
            <p class="comment-content">${comment.comment}</p>
            <button class="like-button ${userLikes[comment.id] ? 'liked' : ''}" data-comment-id="${comment.id}">
                <i class="fas fa-heart"></i>
                <span class="like-count">${comment.likes || 0}</span>
            </button>
            ${comment.email === userInfo.email ? `
                <button class="edit-button" data-comment-id="${comment.id}">
                    <i class="fas fa-edit"></i> Editar
                </button>
            ` : ''}
            ${!userReports[comment.id] ? `
                <button class="report-button" data-comment-id="${comment.id}">
                    <i class="fas fa-flag"></i> Denunciar
                </button>
            ` : ''}
        `;
        return commentElement;
    }

    function reportComment(commentId, reason) {
        const userInfo = getUserInfo();
        const formData = new FormData();
        formData.append('action', 'reportComment');
        formData.append('commentId', commentId);
        formData.append('reporterName', userInfo.name || 'Anônimo');
        formData.append('reporterEmail', userInfo.email || 'anonimo@example.com');
        formData.append('reportReason', reason);

        fetch(scriptURL, { method: 'POST', body: formData })
            .then(response => response.json())
            .then(data => {
                if (data.result === 'success') {
                    alert('Comentário denunciado com sucesso.');
                    saveUserReport(commentId);
                    if (data.reports >= 5) {
                        // Remover o comentário da exibição
                        document.querySelector(`[data-comment-id="${commentId}"]`).remove();
                    } else {
                        // Remover o botão de denúncia
                        const reportButton = document.querySelector(`.report-button[data-comment-id="${commentId}"]`);
                        if (reportButton) {
                            reportButton.remove();
                        }
                    }
                } else {
                    alert(data.message || 'Erro ao denunciar o comentário. Por favor, tente novamente.');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Erro ao denunciar o comentário. Por favor, tente novamente.');
            });
    }

    function addReportEventListeners() {
        const reportButtons = document.querySelectorAll('.report-button');
        reportButtons.forEach(button => {
            button.addEventListener('click', function() {
                const commentId = this.dataset.commentId;
                showReportModal(commentId);
            });
        });
    }

    function showReportModal(commentId) {
        const modal = document.createElement('div');
        modal.className = 'report-modal';
        modal.innerHTML = `
            <div class="report-modal-content">
                <h2>Denunciar Comentário</h2>
                <p>Por favor, selecione o motivo da denúncia:</p>
                <form id="report-form">
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
                    <textarea id="other-reason" placeholder="Especifique o motivo (se selecionou 'Outro')" style="display: none;"></textarea>
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

        otherReasonCheckbox.addEventListener('change', function() {
            otherReasonTextarea.style.display = this.checked ? 'block' : 'none';
        });

        reportForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const selectedReasons = Array.from(reportForm.querySelectorAll('input[name="reason"]:checked'))
                .map(checkbox => checkbox.value);
            
            if (otherReasonCheckbox.checked) {
                selectedReasons.push(otherReasonTextarea.value);
            }

            if (selectedReasons.length === 0) {
                alert('Por favor, selecione pelo menos um motivo para a denúncia.');
                return;
            }

            const reason = selectedReasons.join(', ');
            reportComment(commentId, reason);
            modal.remove();
        });

        document.getElementById('cancel-report').addEventListener('click', function() {
            modal.remove();
        });
    }

    // Carregar comentários iniciais
    loadComments();
});