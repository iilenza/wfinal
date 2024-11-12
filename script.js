document.addEventListener('DOMContentLoaded', () => {
    const popularArticlesContainer = document.getElementById('popular-articles');
    const sortOptions = document.getElementById('sort-options');
    const themeToggle = document.getElementById('theme-toggle');
    const articlesContainer = document.getElementById('articles-container');

    let articlesData = [];

    fetch('articles.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Error fetching articles');
            }
            return response.json();
        })
        .then(data => {
            articlesData = data.articles.map(article => {

                const savedViews = localStorage.getItem(`article_${article.id}_views`);
                return {
                    ...article,
                    views: savedViews ? parseInt(savedViews, 10) : article.views
                };
            });
            renderPopularArticles();
            sortArticles();
        })
        .catch(error => {
            console.error('Error fetching articles:', error);
            articlesContainer.innerHTML = `<p>Error loading articles: ${error.message}</p>`;
        });

    function calculateReadingTime(content) {
        const wordsPerMinute = 200;
        const words = content.split(" ").length;
        return `${Math.ceil(words / wordsPerMinute)} min read`;
    }

    function renderArticles(sortedArticles) {
        articlesContainer.innerHTML = '';
        sortedArticles.forEach(article => {
            const readingTime = calculateReadingTime(article.content);
            const articleCard = document.createElement('div');
            articleCard.classList.add('col');
            articleCard.innerHTML = `
                <a href="page${article.id}.html?id=${article.id}" style="text-decoration: none; color: inherit;">
                    <div class="card">
                        <div class="card-body" style="background-image: url('${article.image}');">
                            <div style="background: rgba(0, 0, 0, 0.5); padding: 10px;">
                                <h5>${article.title}</h5>
                                <p>${article.date} | ${article.category}</p>
                                <small><i class="fa-solid fa-eye"></i> <span class="view-count">${article.views}</span> | ${readingTime}</small>
                            </div>
                        </div>
                    </div>
                </a>
            `;


            articleCard.addEventListener('click', (event) => {
                event.preventDefault();
                article.views += 1; 
                articleCard.querySelector('.view-count').textContent = article.views; 
                localStorage.setItem(`article_${article.id}_views`, article.views); 
                window.location.href = `page${article.id}.html?id=${article.id}`; 
            });

            articlesContainer.appendChild(articleCard);
        });
    }

    function renderPopularArticles() {
        const mostPopularArticles = [...articlesData].sort((a, b) => b.views - a.views).slice(0, 3);
        popularArticlesContainer.innerHTML = '';
        mostPopularArticles.forEach(article => {
            popularArticlesContainer.innerHTML += `
                <li class="list-group-item">
                    <a href="page${article.id}.html" class="popular-article-link">${article.title}</a>
                </li>
            `;
        });
    }

    function sortArticles() {
        const sortedArticles = [...articlesData];
        if (sortOptions.value === 'popularity') {
            sortedArticles.sort((a, b) => b.views - a.views);
        } else {
            sortedArticles.sort((a, b) => new Date(b.date) - new Date(a.date));
        }
        renderArticles(sortedArticles);
    }

    function applyTheme(theme) {
        document.body.classList.toggle('dark-mode', theme === 'dark');
        document.body.classList.toggle('light-mode', theme === 'light');
    }

    function toggleTheme() {
        const currentTheme = document.body.classList.contains('dark-mode') ? 'dark' : 'light';
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        applyTheme(newTheme);
        localStorage.setItem('theme', newTheme);
    }

    const savedTheme = localStorage.getItem('theme') || 'light';
    applyTheme(savedTheme);

    themeToggle.addEventListener('click', toggleTheme);
    sortOptions.addEventListener('change', sortArticles);

    sortArticles();
    renderPopularArticles();
});
document.getElementById('contact-form').addEventListener('submit', function(event) {
    event.preventDefault(); 

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;

    console.log("The form has been sent!");
    console.log("Name:", name);
    console.log("Email:", email);
    console.log("Message:", message);

    alert("Your message has been sent!");
    this.reset(); 
});