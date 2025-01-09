document.addEventListener("DOMContentLoaded", () => {
    // Fetch user data from profile endpoint
    fetch("https://jinen.infinityfreeapp.com/www/server/profile.php")
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                console.error(data.error);
                alert(data.error);
                window.location.href = "login.html";
                return;
            }

            // Display welcome greeting with the user's name
            document.getElementById("userGreeting").innerText = `Welcome ${data.Username}!`;

            // Fetch weather data for current location
            fetchWeather(data.CurrentLocation);
        })
        .catch(error => {
            console.error("Error fetching user data:", error);
        });
});

function fetchWeather(location) {
    if (!location || location === "Not set") {
        document.getElementById("weatherDetails").innerHTML = `
            <div class="alert alert-warning" role="alert">
                No location set for weather information.
            </div>`;
        return;
    }

    const apiKey = "01c348787bf83521c5c58da319e62121"; // Replace with your actual API key
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(location)}&appid=${apiKey}&units=metric`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(weatherData => {
            if (weatherData.cod !== 200) {
                document.getElementById("weatherDetails").innerHTML = `
                    <div class="alert alert-danger" role="alert">
                        Unable to fetch weather details. (${weatherData.message})
                    </div>`;
                return;
            }

            const { main, weather, wind, name } = weatherData;

            // Weather box with detailed data
            document.getElementById("weatherDetails").innerHTML = `
                <div class="card weather-box mx-auto shadow">
                    <div class="card-body text-center">
                        <h3 class="card-title">${name}</h3>
                        <img src="https://openweathermap.org/img/wn/${weather[0].icon}@2x.png" 
                             alt="${weather[0].description}" class="weather-icon">
                        <h4>${main.temp}°C</h4>
                        <p class="mb-2 text-muted">${weather[0].description}</p>
                        <p><strong>Feels like:</strong> ${main.feels_like}°C</p>
                        <p><strong>Humidity:</strong> ${main.humidity}%</p>
                        <p><strong>Wind:</strong> ${wind.speed} m/s</p>
                    </div>
                </div>`;
        })
        .catch(error => {
            console.error("Error fetching weather data:", error);
            document.getElementById("weatherDetails").innerHTML = `
                <div class="alert alert-danger" role="alert">
                    Failed to fetch weather details.
                </div>`;
        });
}
