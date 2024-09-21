document.addEventListener('DOMContentLoaded', function() {
   // DOM Elements
   const blogPostsContainer = document.getElementById('blog-posts') || document.getElementById('category-posts');
   const recentPostsList = document.getElementById('recent-posts');
   const categoriesList = document.getElementById('categories');
   const loadMoreButton = document.getElementById('load-more-button');
   const loadMoreContainer = document.getElementById('load-more-container');
   const darkModeToggle = document.getElementById('dark-mode-toggle');
   const body = document.body;
   const cookieBanner = document.getElementById('cookie-banner');
   const acceptCookiesButton = document.getElementById('accept-cookies');

   // Variables
   let currentPage = 1;
   const postsPerPage = 5;
   let isLoading = false;

   // ===== BLOG POST DATA =====
   const blogPosts = [
      {
          id: 1,
          title: 'Masturbação Sem Tabu: Benefícios e Verdades Que Ninguém Conta',
          date: 'Set 15, 2024',
          author: 'Nathalia Coller',
          category: 'masturbacao_sem_tabus',
          excerpt: 'Vamos falar sobre masturbação? Sem tabu, sem frescura, do jeito que você merece ouvir! A verdade é que todo mundo faz, mas quase ninguém comenta.',
          content: 'posts/001-masturbacao-sem-tabu.html'
      },
      {
          id: 2,
          title: 'Atraindo Homens e Mulheres: O Que Realmente Importa na Sedução',
          date: 'Set 15, 2024',
          author: 'Nathalia Coller',
          category: 'seducao_e_atracao',
          excerpt: 'Todo mundo, em algum momento, já se perguntou: "O que faz alguém se sentir atraído por mim?" A verdade é que não existe uma fórmula mágica, mas tem alguns segredos que ajudam — e muito — na hora da sedução, seja com homens, mulheres ou ambos!',
          content: 'posts/002-atraindo-homens-e-mulheres.html'
      },
      {
          id: 3,
          title: 'Sexualidade Fluida: Entendendo e Aceitando as Suas Preferências',
          date: 'Set 15, 2024',
          author: 'Nathalia Coller',
          category: 'prazer_e_autoconhecimento',
          excerpt: 'A sexualidade não é uma caixinha fechada e estática. Muito pelo contrário! Ela pode ser dinâmica, variada e mudar ao longo da vida. Esse conceito é conhecido como sexualidade fluida.',
          content: 'posts/003-sexualidade-fluida.html'
      },
      {
          id: 4,
          title: 'Explorando Seus Desejos: O Caminho Para o Desenvolvimento Sexual',
          date: 'Set 15, 2024',
          author: 'Nathalia Coller',
          category: 'desenvolvimento_sexual',
          excerpt: 'O desenvolvimento sexual vai muito além de apenas entender seu corpo. Trata-se de explorar seus desejos, enfrentar suas inseguranças e evoluir na jornada de autoconhecimento sexual. Vamos falar sobre como esse processo pode transformar sua vida.',
          content: 'posts/004-explorando-seus-desejos.html'
      },
      {
          id: 5,
          title: 'O Poder da Masturbação: Redescobrindo o Prazer Sozinho',
          date: 'Set 15, 2024',
          author: 'Nathalia Coller',
          category: 'masturbacao_sem_tabus',
          excerpt: 'Masturbação é um tema cercado por preconceitos, mas a verdade é que ela é uma prática saudável, importante para o autoconhecimento e para o bem-estar sexual. Vamos desmistificar o assunto!',
          content: 'posts/005-o-poder-da-masturbacao.html'
      },
      {
          id: 6,
          title: 'Masturbação Feminina: Quebrando o Silêncio e Assumindo o Prazer',
          date: 'Set 18, 2024',
          author: 'Nathalia Coller',
          category: 'masturbacao_sem_tabus',
          excerpt: 'A masturbação feminina ainda é cercada de tabus, mas é hora de quebrarmos esse silêncio. O prazer feminino é real, legítimo, e deve ser celebrado!',
          content: 'posts/006-masturbacao-feminina.html'
      },
      {
           id: 7,
           title: 'Comunicação Sexual: O Segredo Para Relacionamentos Satisfatórios',
           date: 'Set 18, 2024',
           author: 'Nathalia Coller',
           category: 'sexo_e_relacionamentos',
           excerpt: 'A chave para uma vida sexual plena e saudável dentro de um relacionamento é a comunicação aberta. Vamos falar sobre como você pode melhorar a intimidade com seu parceiro(a) falando abertamente sobre sexo e desejos.',
           content: 'posts/007-comunicacao-sexual.html'
       },
       {
           id: 8,
           title: 'Saúde Sexual: Como Cuidar do Corpo e da Mente Para uma Vida Sexual Plena',
           date: 'Set 18, 2024',
           author: 'Nathalia Coller',
           category: 'saude_sexual',
           excerpt: 'Cuidar da saúde sexual é mais do que prevenir doenças. Envolve cuidar do corpo, da mente e garantir que você esteja vivendo uma vida sexual plena e segura. Vamos explorar maneiras de promover o bem-estar sexual e emocional.',
           content: 'posts/008-saude-sexual.html'
       }
  ];

   // ===== CATEGORIES DATA =====
   const categories = {
      prazer_e_autoconhecimento: { name: 'Prazer e Autoconhecimento', description: 'Aqui, falamos de sexualidade de forma aberta e sem julgamentos. Dicas, curiosidades e tudo o que você sempre quis saber sobre prazer, corpo e relações.' },
      desenvolvimento_sexual: { name: 'Desenvolvimento Sexual', description: 'Dicas e insights para entender melhor seu corpo, desejos e como evoluir na sua jornada sexual.' },
      seducao_e_atracao: { name: 'Sedução e Atração', description: 'Técnicas e dicas sobre como atrair e seduzir pessoas, independentemente de gênero, com foco na autenticidade e confiança.' },
      sexo_e_relacionamentos: { name: 'Sexo e Relacionamentos', description: 'Exploração de temas ligados a sexo em diferentes tipos de relacionamentos, comunicação sexual saudável e intimidade.' },
      saude_sexual: { name: 'Saúde Sexual e Bem-Estar', description: 'Informações sobre práticas sexuais seguras, cuidados com o corpo e dicas para manter uma vida sexual saudável.' },
      masturbacao_sem_tabus: { name: 'Masturbação Sem Tabus', description: 'Quebra de preconceitos e conversas abertas sobre a importância da masturbação para o bem-estar e a saúde sexual.'}
   };

   // ===== BLOG POST FUNCTIONS =====
   function createBlogPostElement(post) {
       const article = document.createElement('article');
       article.className = 'blog-post';
       article.innerHTML = `
           <h2>${post.title}</h2>
           <p class="post-meta">Posted on ${post.date} by ${post.author} | Category: <a href="category-${post.category}.html">${categories[post.category].name}</a></p>
           <p>${post.excerpt}</p>
           <a href="${post.content}" class="read-more">Read More</a>
       `;
       return article;
   }

   function loadBlogPosts() {
       if (isLoading) return;
       isLoading = true;

       const currentCategory = getCurrentCategory();
       const postsToDisplay = currentCategory ? blogPosts.filter(post => post.category === currentCategory) : blogPosts;
       const startIndex = (currentPage - 1) * postsPerPage;
       const endIndex = startIndex + postsPerPage;
       const postsToLoad = postsToDisplay.slice(startIndex, endIndex);

       postsToLoad.forEach(post => {
           const postElement = createBlogPostElement(post);
           blogPostsContainer.appendChild(postElement);
       });

       currentPage++;
       isLoading = false;

       if (endIndex >= postsToDisplay.length) {
           loadMoreContainer.style.display = 'none';
       }
   }

   // ===== RECENT POSTS FUNCTION =====
   function loadRecentPosts() {
       const recentPosts = blogPosts
           .slice()
           .sort((a, b) => b.id - a.id)
           .slice(0, 5);

       recentPostsList.innerHTML = '';

       recentPosts.forEach(post => {
           const li = document.createElement('li');
           li.innerHTML = `<a href="${post.content}">${post.title}</a>`;
           recentPostsList.appendChild(li);
       });
   }

   // ===== CATEGORIES FUNCTIONS =====
   function loadCategories() {
       categoriesList.innerHTML = '';
       Object.entries(categories).forEach(([key, category]) => {
           const count = blogPosts.filter(post => post.category === key).length;
           const li = document.createElement('li');
           li.innerHTML = `<a href="category-${key}.html">${category.name} <span class="category-count">${count}</span></a>`;
           categoriesList.appendChild(li);
       });
   }

   function getCurrentCategory() {
       const path = window.location.pathname;
       const match = path.match(/category-(\w+)\.html/);
       return match ? match[1] : null;
   }

   function initializeCategoryPage() {
       const currentCategory = getCurrentCategory();
       if (currentCategory) {
           document.title = `${categories[currentCategory].name} - TechTalk`;
           const categoryTitle = document.querySelector('.category-title');
           const categoryDescription = document.querySelector('.category-description');
           if (categoryTitle) categoryTitle.textContent = categories[currentCategory].name;
           if (categoryDescription) categoryDescription.textContent = categories[currentCategory].description;
       }
   }

   // ===== COOKIE FUNCTIONS =====
   function setCookie(name, value, days) {
       let expires = "";
       if (days) {
           const date = new Date();
           date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
           expires = "; expires=" + date.toUTCString();
       }
       document.cookie = name + "=" + (value || "") + expires + "; path=/";
   }

   function getCookie(name) {
       const nameEQ = name + "=";
       const ca = document.cookie.split(';');
       for(let i = 0; i < ca.length; i++) {
           let c = ca[i];
           while (c.charAt(0) === ' ') c = c.substring(1, c.length);
           if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
       }
       return null;
   }

   function handleCookieBanner() {
       if (!getCookie('cookies-accepted')) {
           cookieBanner.classList.add('show');
       }

       acceptCookiesButton.addEventListener('click', function() {
           setCookie('cookies-accepted', 'true', 365);
           cookieBanner.classList.remove('show');
       });
   }

   // ===== DARK MODE FUNCTIONS =====
   function setDarkMode(isDark) {
       if (isDark) {
           body.classList.add('dark-mode');
           darkModeToggle.textContent = 'Light Mode';
       } else {
           body.classList.remove('dark-mode');
           darkModeToggle.textContent = 'Dark Mode';
       }
   }

   function initializeDarkMode() {
       const savedMode = localStorage.getItem('darkMode');
       if (savedMode !== null) {
           setDarkMode(savedMode === 'true');
       } else {
           const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
           setDarkMode(prefersDark);
       }

       darkModeToggle.addEventListener('click', () => {
           const isDark = body.classList.toggle('dark-mode');
           localStorage.setItem('darkMode', isDark);
           setDarkMode(isDark);
       });

       const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
       darkModeMediaQuery.addEventListener('change', (e) => {
           if (localStorage.getItem('darkMode') === null) {
               setDarkMode(e.matches);
           }
       });
   }

   // ===== INITIALIZATION =====
   loadBlogPosts();
   loadRecentPosts();
   loadCategories();
   initializeCategoryPage();
   handleCookieBanner();
   initializeDarkMode();

   // ===== EVENT LISTENERS =====
   loadMoreButton.addEventListener('click', loadBlogPosts);
});

// ===== SCROLL TO TOP FUNCTIONS =====
function scrollFunction() {
   const scrollTopBtn = document.getElementById("scrollTopBtn");
   if (document.body.scrollTop > 300 || document.documentElement.scrollTop > 300) {
       scrollTopBtn.style.display = "block";
   } else {
       scrollTopBtn.style.display = "none";
   }
}

function scrollToTop() {
   window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ===== SCROLL EVENT LISTENER =====
window.onscroll = function() {
   scrollFunction();
};