document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('data-form');
    const chartContainer = document.getElementById('chart-container');
    const stockChartCanvas = document.getElementById('stock-chart');
    let stockChart;

    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        const companyName = document.getElementById('symbol').value.trim();
        const dataType = document.getElementById('data-type').value;

        if (!companyName) {
            displayMessage('Please enter a valid company name.', 'error');
            return;
        }

        const apiKey = 'WSBDVOMABRNO6H04';
        const symbolSearchUrl = https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${companyName}&apikey=${apiKey};

        try {
            // Fetch symbol for the company name
            const symbolResponse = await fetch(symbolSearchUrl);
            const symbolData = await symbolResponse.json();

            if (!symbolData.bestMatches || symbolData.bestMatches.length === 0) {
                displayMessage('No matching companies found for the given name.', 'error');
                return;
            }

            const symbol = symbolData.bestMatches[0]['1. symbol'];
            const companyNameMatched = symbolData.bestMatches[0]['2. name'];
            let fetchUrl, parser;

            // Determine API URL and parser function
            if (dataType === 'intraday') {
                fetchUrl = https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${symbol}&interval=5min&apikey=${apiKey};
                parser = parseIntradayData;
            } else if (dataType === 'daily') {
                fetchUrl = https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${apiKey};
                parser = parseTimeSeriesData;
            }

            const response = await fetch(fetchUrl);
            const data = await response.json();

            if (parser) {
                const parsedData = parser(data, dataType);
                updateChart(stockChart, stockChartCanvas, parsedData);
                updateStockInfo(symbol, companyNameMatched, parsedData.latestPrice);
            } else {
                displayMessage('Unsupported data type.', 'error');
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            displayMessage('An error occurred while fetching the data.', 'error');
        }
    });
});

// Parse intraday data
function parseIntradayData(data) {
    const series = data['Time Series (5min)'];
    const labels = Object.keys(series).slice(0, 30).reverse(); // Get the last 30 intervals
    const values = labels.map((time) => parseFloat(series[time]['4. close'])); // Extract closing prices

    return { labels, values, latestPrice: values[values.length - 1] };
}

// Parse daily time series data
function parseTimeSeriesData(data) {
    const series = data['Time Series (Daily)'];
    const labels = Object.keys(series).slice(0, 30).reverse(); // Get the last 30 dates
    const values = labels.map((date) => parseFloat(series[date]['4. close'])); // Extract closing prices

    return { labels, values, latestPrice: values[values.length - 1] };
}

// Update the chart
function updateChart(chart, canvas, parsedData) {
    if (chart) {
        chart.destroy(); // Destroy the existing chart
    }

    chart = new Chart(canvas, {
        type: 'line',
        data: {
            labels: parsedData.labels,
            datasets: [
                {
                    label: 'Closing Price',
                    data: parsedData.values,
                    borderColor: 'rgba(75, 192, 192, 1)',
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    borderWidth: 1,
                },
            ],
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: true,
                    position: 'top',
                },
            },
        },
    });
}

// Display stock details
function updateStockInfo(symbol, companyName, latestPrice) {
    const infoContainer = document.getElementById('info-container') || createInfoContainer();
    infoContainer.innerHTML = `
        <p><strong>Company Name:</strong> ${companyName}</p>
        <p><strong>Stock Symbol:</strong> ${symbol}</p>
        <p><strong>Latest Stock Price:</strong> $${latestPrice.toFixed(2)}</p>
    `;
}

// Display error or success messages
function displayMessage(message, type) {
    const messageContainer = document.getElementById('message-container') || createMessageContainer();
    messageContainer.textContent = message;
    messageContainer.className = message ${ type };
}

// Helper: Create a container for displaying stock info
function createInfoContainer() {
    const container = document.createElement('div');
    container.id = 'info-container';
    container.style.margin = '20px 0';
    document.getElementById('chart-container').appendChild(container);
    return container;
}

// Helper: Create a container for messages
function createMessageContainer() {
    const container = document.createElement('div');
    container.id = 'message-container';
    document.getElementById('chart-container').prepend(container);
    return container;
}