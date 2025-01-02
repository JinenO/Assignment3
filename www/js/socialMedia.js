document.getElementById('social-form').addEventListener('submit', function(e) {
    e.preventDefault(); // Prevent the form from refreshing the page

    // Get the hashtag or keyword from the input field
    const hashtag = document.getElementById('hashtag').value;

    if (!hashtag) {
        alert("Please enter a hashtag or keyword.");
        return;
    }

    // Twitter API Bearer Token (You need to create a Twitter Developer account to get this)
    const bearerToken = 'YOUR_TWITTER_BEARER_TOKEN'; // Replace with your Twitter Bearer Token
    const apiUrl = `https://api.twitter.com/2/tweets/search/recent?query=${hashtag}&max_results=10`;

    // Make the API request to Twitter
    fetch(apiUrl, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${bearerToken}`
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        if (data.data && data.data.length > 0) {
            let postsHTML = '';
            data.data.forEach(post => {
                postsHTML += `
                    <div class="social-post">
                        <p><strong>Tweet:</strong> ${post.text}</p>
                        <p><strong>Posted on:</strong> ${post.created_at}</p>
                        <hr>
                    </div>
                `;
            });

            // Display social media posts
            document.getElementById('posts-list').innerHTML = postsHTML;
            document.getElementById('error-message').style.display = 'none';
            document.getElementById('social-results').style.display = 'block';
        } else {
            // Show error message if no posts found
            document.getElementById('error-message').textContent = 'No posts found for this hashtag/keyword.';
            document.getElementById('error-message').style.display = 'block';
            document.getElementById('social-results').style.display = 'none';
        }
    })
    .catch(error => {
        document.getElementById('error-message').textContent = 'Error fetching posts. Please try again later.';
        document.getElementById('error-message').style.display = 'block';
        document.getElementById('social-results').style.display = 'none';
    });
});
