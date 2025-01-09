document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('news-form'); // News form
    const queryInput = document.getElementById('query'); // Input for search query
    const newsResults = document.getElementById('news-results'); // Container for displaying results
    const articlesList = document.getElementById('articles-list'); // List of articles
    const errorMessage = document.getElementById('error-message'); // Error message container

    // Event listener for form submission
    form.addEventListener('submit', function (event) {
        event.preventDefault();
        const query = queryInput.value.trim(); // Get user input

        // Check if the query is empty
        if (!query) {
            displayError("Please enter a search keyword!");
            return;
        }

        // Clear error and fetch news
        clearError();
        fetchNews(query);
    });

    function logNewsSearch(query) {
        fetch('https://jinen.infinityfreeapp.com/www/server/news.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                searchTerm: query
            })
        })
            .catch(error => console.error('Error logging search:', error));
    }

    // Function to fetch news from newsdata.io API
    function fetchNews(query) {
        const apiKey = 'pub_64445b7effd253471381533c433cacf607317'; // Replace with your newsdata.io API key
        const url = `https://newsdata.io/api/1/news?apikey=${apiKey}&q=${encodeURIComponent(query)}`;
        // Reset previous results and hide displays
        articlesList.innerHTML = '';
        newsResults.style.display = 'none';
        errorMessage.style.display = 'none';

        // Fetch request
        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                if (data.results && data.results.length > 0) {
                    logNewsSearch(query);
                    displayArticles(data.results); // Display articles if available
                } else {
                    displayError("No articles found. Try a different search term.");
                }
            })
            .catch(error => {
                displayError(`An error occurred: ${error.message}`);
            });
    }

    // Function to display articles
    function displayArticles(articles) {
        const articleHTML = articles.map(article => {
            // Shorten the description if it's too long (e.g., 100 characters max)
            const shortDescription = article.description ? article.description.slice(0, 100) + '...' : 'No description available.';
            
            return `
                <div class="article card mb-3">
                    <div class="card-body">
                        ${article.image_url ? `<img src="${article.image_url}" alt="Article Image" class="img-fluid">` : ''}
                        <h5 class="card-title">
                            <a href="${article.link}" target="_blank" class="text-decoration-none">${article.title}</a>
                        </h5>
                        <p class="card-text">${shortDescription}</p>
                        <footer class="footer-article">
                            Source: <cite>${article.source_id}</cite>
                        </footer>
                    </div>
                </div>
            `;
        }).join('');
        
        articlesList.innerHTML = articleHTML;
        newsResults.style.display = 'block'; // Show results
    }
    
    // Function to display error message
    function displayError(message) {
        errorMessage.textContent = message;
        errorMessage.style.display = 'block'; // Show error
    }

    // Function to clear the error message
    function clearError() {
        errorMessage.textContent = '';
        errorMessage.style.display = 'none'; // Hide error
    }
});
