// weather.js
document.getElementById('weather-form').addEventListener('submit', function(e) {
    e.preventDefault(); // Prevent the form from refreshing the page

    // Get the city name from the input field
    const city = document.getElementById('city').value;

    if (!city) {
        alert("Please enter a city name.");
        return;
    }

    // Your OpenWeather API key
    const apiKey = '01c348787bf83521c5c58da319e62121'; // Your API key
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`; // Only city name in the query

    // Make the API request
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            if (data.cod === 200) { // Successful response
                const weather = data.weather[0].description;
                const temperature = data.main.temp;
                const humidity = data.main.humidity;
                const icon = `http://openweathermap.org/img/wn/${data.weather[0].icon}.png`;

                // Display weather data
                document.getElementById('weather-results').innerHTML = `
                    <h3>Weather in ${city}</h3>
                    <img src="${icon}" alt="Weather icon" />
                    <p><strong>Description:</strong> ${weather}</p>
                    <p><strong>Temperature:</strong> ${temperature}°C</p>
                    <p><strong>Humidity:</strong> ${humidity}%</p>
                `;
                document.getElementById('error-message').style.display = 'none';
                document.getElementById('weather-results').style.display = 'block';
            } else {
                // Show error message if city is not found
                document.getElementById('error-message').textContent = 'City not found. Please check the city name and try again.';
                document.getElementById('error-message').style.display = 'block';
                document.getElementById('weather-results').style.display = 'none';
            }
        })
        .catch(error => {
            document.getElementById('error-message').textContent = 'Error fetching weather. Please try again later.';
            document.getElementById('error-message').style.display = 'block';
            document.getElementById('weather-results').style.display = 'none';
        });
});
