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
        .catch(error => {
            alert("Error fetching weather data: " + error);
            clearWeatherData();  // Clear displayed weather data
        });
}

// Fetch Weather by Location
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
        .catch(error => {
            alert("Error fetching weather data: " + error);
            clearWeatherData();  // Clear displayed weather data
            document.getElementById('cityInput').value = ''; // Clear the search text field
        });
}

// Fetch Weather by Location
function fetchWeatherByLocation(lat, lon) {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
    fetch(url)
        .then(response => response.json())
        .then(data => {
            displayWeather(data);
        })
        .catch(error => {
            alert("Error fetching weather data: " + error);
            clearWeatherData();  // Clear displayed weather data
        });
}

// Function to clear weather data fields
function clearWeatherData() {
    document.getElementById('temperature').innerText = '';
    document.getElementById('weatherCondition').innerText = '';
    document.getElementById('humidity').innerText = '';
    document.getElementById('averageTemperature').innerText = '';  // Clear average temperature

    // Remove the location if it exists
    const locationElement = document.getElementById('location');
    if (locationElement) {
        locationElement.parentElement.removeChild(locationElement);
    }

    // Clear forecast chart
    if (temperatureChart) {
        temperatureChart.destroy();
        temperatureChart = null;
    }
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


// Global variable to hold the chart instance
let temperatureChart = null;

function displayForecast(data) {
    const temperatures = data.list.map(item => item.main.temp);
    const avgTemp = temperatures.reduce((sum, temp) => sum + temp, 0) / temperatures.length;

    // Update Average Temperature
    document.getElementById('averageTemperature').innerText = ` ${avgTemp.toFixed(2)}°C`;

    // Extract time labels for the x-axis
    const timeLabels = data.list.map(item => {
        const time = new Date(item.dt_txt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        return time; // Format: "HH:MM" in 24-hour or 12-hour format based on locale
    });

    // Prepare data points with full date and time for tooltips
    const tooltipsData = data.list.map(item => {
        const date = new Date(item.dt_txt).toLocaleDateString();
        const time = new Date(item.dt_txt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        return `${date} ${time}`;
    });

    // Destroy previous chart instance if it exists
    if (temperatureChart) {
        temperatureChart.destroy();
    }

    // Create a new chart instance
    const ctx = document.getElementById('temperatureChart').getContext('2d');
    temperatureChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: timeLabels, // Use only time for x-axis labels
            datasets: [{
                label: 'Temperature (°C)',
                data: temperatures,
                borderColor: 'rgb(149, 163, 240)',
                borderWidth: 1,
                fill: false
            }]
        },
        options: {
            responsive: true, // Ensures chart scales with the container size
            maintainAspectRatio: false, // Allows the chart to resize independently of aspect ratio
            plugins: {
                title: {
                    display: true,
                    text: 'Temperature Forecast Over Time', // Chart Title
                    font: {
                        size: 18
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function (tooltipItem) {
                            const pointIndex = tooltipItem.dataIndex;
                            const fullDate = tooltipsData[pointIndex];
                            return `Date & Time: ${fullDate} | Temp: ${tooltipItem.raw}°C`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    title: {
                        display: true,
                        text: 'Temperature (°C)', // Y-axis title
                        font: {
                            size: 14
                        }
                    },
                    beginAtZero: false
                },
                x: {
                    title: {
                        display: true,
                        text: 'Time', // X-axis title
                        font: {
                            size: 14
                        }
                    }
                }
            }
        }
    });
}
