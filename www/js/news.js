document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('news-form');
    const queryInput = document.getElementById('query');
    const newsResults = document.getElementById('news-results');
    const articlesList = document.getElementById('articles-list');
    const errorMessage = document.getElementById('error-message');

    form.addEventListener('submit', function (event) {
        event.preventDefault();
        const query = queryInput.value.trim();

        if (query === "") {
            return;
        }

        fetchNews(query);
    });

    function fetchNews(query) {
        const apiKey = 'a818ee39a06d446c86402a6aba8e32e8';
        const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&apiKey=${apiKey}`;

        // Clear previous results and errors
        articlesList.innerHTML = '';
        errorMessage.style.display = 'none';
        newsResults.style.display = 'none';

        fetch(url)
            .then(response => response.json())
            .then(data => {
                if (data.status !== 'ok') {
                    throw new Error('Failed to fetch news articles.');
                }

                // Display results
                const articles = data.articles;
                if (articles.length > 0) {
                    articlesList.innerHTML = articles.map(article => {
                        return `
                            <div class="article card mb-3">
                                <div class="card-body">
                                    <h5 class="card-title"><a href="${article.url}" target="_blank" class="text-decoration-none">${article.title}</a></h5>
                                    <p class="card-text">${article.description}</p>
                                    <footer class="blockquote-footer text-end">Source: <cite title="Source Title">${article.source.name}</cite></footer>
                                </div>
                            </div>
                        `;
                    }).join('');
                    newsResults.style.display = 'block';
                } else {
                    throw new Error('No articles found for the given query.');
                }
            })
            .catch(error => {
                errorMessage.textContent = error.message;
                errorMessage.style.display = 'block';
            });
    }
});
