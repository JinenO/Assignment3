// Define API constants
const API_KEY = '313a209035fda25bd0f5bce49f1085c1'; 
const API_URL = 'https://api.openweathermap.org/data/2.5/forecast';
let temperatureData = [];
let labels = [];
let locationName = '';  // Store the location name globally

// Function to extract forecast data for the next 24 hours
function extractForecastData(data) {
    const now = new Date();
    const forecasts = data.list.filter(forecast => {
        const forecastTime = new Date(forecast.dt_txt);
        return forecastTime >= now && forecastTime <= new Date(now.getTime() + 24 * 60 * 60 * 1000);
    });
    return forecasts;
}
function fetchWeatherAndShowChart() {
    fetchWeather();
}

function fetchWeather() {
    const city = document.getElementById('cityInput').value.trim();
    if (!city) {
        alert('Please enter a city name.');
        return;
    }

    // Reset previous data
    document.getElementById('location-name').innerHTML = '';
    document.getElementById('forecastTable').innerHTML = '';
    document.getElementById('forecastTableWrapper').style.display = 'none';
    document.getElementById('temperatureChart').style.display = 'none';
    document.getElementById('current-weather').style.display = 'none';

    temperatureData = [];
    labels = [];

    const url = `${API_URL}?q=${city}&appid=${API_KEY}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.cod !== '200') {
                alert('City not found or API error occurred.');
                return;
            }

            locationName = data.city.name;
            document.getElementById('location-name').innerHTML = `Weather Forecast for ${locationName}`;

            // Display current weather
            const currentWeather = data.list[0];
            const currentTempCelsius = (currentWeather.main.temp - 273.15).toFixed(2);
            const currentHumidity = currentWeather.main.humidity;
            const currentCondition = currentWeather.weather[0].description;

            document.getElementById('current-temperature').innerHTML = `Temperature: ${currentTempCelsius}°C`;
            document.getElementById('current-humidity').innerHTML = `Humidity: ${currentHumidity}%`;
            document.getElementById('current-condition').innerHTML = `Condition: ${currentCondition}`;
            document.getElementById('current-weather').style.display = 'block';

            // Populate table for forecasts
            const forecasts = extractForecastData(data);
            document.getElementById('forecastTableWrapper').style.display = 'table';

            forecasts.forEach(forecast => {
                const dateTime = forecast.dt_txt;
                const tempCelsius = (forecast.main.temp - 273.15).toFixed(2);
                const weatherDesc = forecast.weather[0].description;
                const iconCode = forecast.weather[0].icon;
                const iconUrl = `https://openweathermap.org/img/wn/${iconCode}.png`;

                const row = `
                    <tr>
                        <td>${dateTime}</td>
                        <td>${tempCelsius}°C</td>
                        <td><img src="${iconUrl}" alt="${weatherDesc}" class="weather-icon"> ${weatherDesc}</td>
                    </tr>`;
                document.getElementById('forecastTable').innerHTML += row;

                labels.push(dateTime);
                temperatureData.push(tempCelsius);
            });

            // Show the chart once data is ready
            showChart();
        })
        .catch(error => {
            console.error('Error fetching weather data:', error);
            alert('An error occurred while fetching the weather data.');
        });
}

// Function to show the chart automatically after data fetch
function showChart() {
    // Show the chart
    document.getElementById('temperatureChart').style.display = 'block';

    // Get the canvas element
    const ctx = document.getElementById('temperatureChart').getContext('2d');

    // Dynamically set canvas width and height based on the container size
    const chartContainer = document.querySelector('.container'); // Get the container element for the chart
    document.getElementById('temperatureChart').width = chartContainer.offsetWidth;  // Set width based on container
    document.getElementById('temperatureChart').height = 500;  // Adjust height as needed

    // Create a new chart with the location name as title
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels.map(label => label.replace(/2024-/, '24-').replace(':00:00', '.00')), // Simplify labels
            datasets: [
                {
                    label: 'Temperature (°C)',
                    data: temperatureData,
                    borderColor: 'lightblue',
                    borderWidth: 1,
                    fill: false,
                    pointStyle: 'circle',
                    pointRadius: 5,
                    pointBackgroundColor: 'lightblue',
                },
            ],
        },
        options: {
            responsive: true,
            plugins: {
                legend: { display: true, labels: { font: { size: 14 } } },
                title: {
                    display: true,
                    text: `Temperature Forecast for ${locationName}`,
                    font: { size: 18 },
                    padding: { top: 10, bottom: 30 },
                },
            },
            scales: {
                x: {
                    title: { display: true, text: 'Date-Time', font: { size: 16 } },
                    ticks: {
                        font: { size: 10 },
                        maxRotation: 45,
                        minRotation: 45,
                    },
                },
                y: {
                    title: { display: true, text: 'Temperature (°C)', font: { size: 16 } },
                    ticks: { font: { size: 10 } },
                    grid: { color: 'rgba(200, 200, 200, 0.5)' },
                },
            },
        },
    });
}

// Function to reset the view
function resetView() {
    document.getElementById('forecastTableWrapper').style.display = 'table';
    document.getElementById('temperatureChart').style.display = 'none';
    document.getElementById('location-name').innerHTML = '';
    document.getElementById('forecastTable').innerHTML = '';
    document.getElementById('cityInput').value = '';
    temperatureData = [];
    labels = [];
}
