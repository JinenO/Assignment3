document.getElementById('news-form').addEventListener('submit', function(e) {
    e.preventDefault(); // Prevent the form from refreshing the page

    // Get the keyword from the input field
    const query = document.getElementById('query').value.trim();

    if (!query) {
        alert("Please enter a keyword.");
        return;
    }

    // API key and URL for the news API
    const apiKey = '50fbc421ea1e4133a183e16543be3e6c'; // Your actual News API key
    const apiUrl = `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&apiKey=${apiKey}`;

    // Make the API request
    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            if (data.status === 'ok' && data.articles && data.articles.length > 0) {
                let articlesHTML = '';
                data.articles.forEach(article => {
                    articlesHTML += `
                        <div class="news-article">
                            <h3><a href="${article.url}" target="_blank">${article.title}</a></h3>
                            <p><strong>Source:</strong> ${article.source.name}</p>
                            <p>${article.description}</p>
                            <hr>
                        </div>
                    `;
                });

                // Display news results
                document.getElementById('articles-list').innerHTML = articlesHTML;
                document.getElementById('error-message').style.display = 'none';
                document.getElementById('news-results').style.display = 'block';
            } else {
                // Show error message if no articles found
                document.getElementById('error-message').textContent = 'No news articles found for this keyword.';
                document.getElementById('error-message').style.display = 'block';
                document.getElementById('news-results').style.display = 'none';
            }
        })
        .catch(error => {
            // Handle errors such as network issues
            document.getElementById('error-message').textContent = `Error fetching news: ${error.message}`;
            document.getElementById('error-message').style.display = 'block';
            document.getElementById('news-results').style.display = 'none';
        });
});

