const apiKey = "01c348787bf83521c5c58da319e62121"; // Replace with your OpenWeatherMap API key



// Handle Weather Search
document.getElementById('searchBtn').addEventListener('click', function () {
    const city = document.getElementById('cityInput').value;
    if (city) {
        fetchWeather(city);
    } else {
        alert("Please enter a city name");
    }
});

// Handle Current Location
document.getElementById('currentLocationBtn').addEventListener('click', function () {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            fetchWeatherByLocation(lat, lon);
        }, function (error) {
            alert("Error fetching location: " + error.message);
        });
    } else {
        alert("Geolocation is not supported by this browser.");
    }
});

// Fetch Weather by City
function fetchWeather(city) {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
    fetch(url)
        .then(response => response.json())
        .then(data => {
            displayWeather(data);
            // Log the weather search interaction
            logWeatherSearch(city);
        })
        .catch(error => alert("Error fetching weather data: " + error));
}


// Fetch Weather by Location
// Fetch Weather by Location
function fetchWeatherByLocation(lat, lon) {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
    fetch(url)
        .then(response => response.json())
        .then(data => {
            displayWeather(data);
        })
        .catch(error => alert("Error fetching weather data: " + error));
}

// Display Weather Data
function displayWeather(data) {
    const temperature = data.main.temp;
    const weatherCondition = data.weather[0].description;
    const humidity = data.main.humidity;
    const locationName = data.name; // Get location name

    // Update Weather Details
    document.getElementById('temperature').innerText = ` ${temperature}°C`;
    document.getElementById('weatherCondition').innerText = ` ${weatherCondition}`;
    document.getElementById('humidity').innerText = `${humidity}%`;

    // Display location name
    const locationElement = document.getElementById('location');
    if (locationElement) {
        locationElement.innerText = ` ${locationName}`;
    } else {
        // If not already present, add the location display dynamically
        const weatherDetails = document.getElementById('weatherDetails');
        const locationDiv = document.createElement('p');
        locationDiv.innerHTML = `<strong>Location:</strong> <span id="location">${locationName}</span>`;
        weatherDetails.prepend(locationDiv);
    }

    // Fetch Forecast Data
    fetchForecast(data.coord.lat, data.coord.lon);
}

// Fetch Forecast Data (Next 5 days)
function fetchForecast(lat, lon) {
    const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
    fetch(url)
        .then(response => response.json())
        .then(data => displayForecast(data))
        .catch(error => alert("Error fetching forecast data: " + error));
}

function logWeatherSearch(searchTerm) {
    const logData = {
        searchTerm: searchTerm
    };

    fetch('server/weather.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(logData)
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                console.log('Weather search logged successfully');
            } else {
                console.error('Failed to log weather search:', data.error);
            }
        })
        .catch(error => console.error('Error:', error));
}


// Display Forecast Data
function displayForecast(data) {
    const temperatures = data.list.map(item => item.main.temp);
    const avgTemp = temperatures.reduce((sum, temp) => sum + temp, 0) / temperatures.length;

    // Update Average Temperature
    document.getElementById('averageTemperature').innerText = `Average Temperature: ${avgTemp.toFixed(2)}°C`;

    // Display Temperature Graph
    const ctx = document.getElementById('temperatureChart').getContext('2d');
    const chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: data.list.map(item => item.dt_txt), // Get date/time for x-axis
            datasets: [{
                label: 'Temperature (°C)',
                data: temperatures,
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
                fill: false
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: false
                }
            }
        }
    });
}
