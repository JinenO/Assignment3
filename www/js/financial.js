document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('data-form');
    const resetButton = document.getElementById('reset-button');
    const stockChartCanvas = document.getElementById('stock-chart');
    const chartContainer = document.getElementById('chart-container');
    let stockChart;

    // Form submit event to fetch stock data
    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const companyName = document.getElementById('symbol').value.trim();
        const dataType = document.getElementById('data-type').value;

        if (!companyName) {
            displayMessage('Please enter a valid company name.', 'error');
            return;
        }

        const apiKey = 'WSBDVOMABRNO6H04';
        const symbolSearchUrl = `https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${companyName}&apikey=${apiKey}`;

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

            if (dataType === 'intraday') {
                fetchUrl = `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${symbol}&interval=5min&apikey=${apiKey}`;
                parser = parseIntradayData;
            } else if (dataType === 'daily') {
                fetchUrl = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${apiKey}`;
                parser = parseTimeSeriesData;
            }

            const response = await fetch(fetchUrl);
            const data = await response.json();

            if (parser) {
                const parsedData = parser(data, dataType);
                updateChart(parsedData);
                displayStockInfo(symbol, companyNameMatched, parsedData.latestPrice);
            } else {
                displayMessage('Unsupported data type.', 'error');
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            displayMessage('An error occurred while fetching the data.', 'error');
        }
    });

    // Reset button functionality
    resetButton.addEventListener('click', () => {
        // Reset form fields
        form.reset();

        // Clear chart
        if (stockChart) {
            stockChart.destroy();
            stockChart = null;
        }

        // Clear any displayed messages
        const messageContainer = document.getElementById('message-container');
        if (messageContainer) messageContainer.remove();

        // Clear the chart container and stock information
        chartContainer.innerHTML = '<canvas id="stock-chart"></canvas>';
        const infoContainer = document.getElementById('info-container');
        if (infoContainer) infoContainer.remove();
    });

    // Helper function to parse intraday data
    function parseIntradayData(data) {
        const series = data['Time Series (5min)'];
        const labels = Object.keys(series).slice(0, 30).reverse(); // Get the last 30 intervals
        const values = labels.map((time) => parseFloat(series[time]['4. close']));

        return { labels, values, latestPrice: values[values.length - 1] };
    }

    // Helper function to parse daily data
    function parseTimeSeriesData(data) {
        const series = data['Time Series (Daily)'];
        const labels = Object.keys(series).slice(0, 30).reverse(); // Get the last 30 intervals
        const values = labels.map((date) => parseFloat(series[date]['4. close']));

        return { labels, values, latestPrice: values[values.length - 1] };
    }

    // Function to update the chart
    function updateChart(parsedData) {
        const canvas = document.getElementById('stock-chart');

        if (stockChart) {
            stockChart.destroy();
        }

        stockChart = new Chart(canvas, {
            type: 'line',
            data: {
                labels: parsedData.labels,
                datasets: [{
                    label: 'Closing Price',
                    data: parsedData.values,
                    borderColor: 'rgba(75, 192, 192, 1)',
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    borderWidth: 1,
                }],
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

    // Function to display stock information
    function displayStockInfo(symbol, companyName, latestPrice) {
        const infoContainer = document.getElementById('info-container') || createInfoContainer();
        infoContainer.innerHTML = `
            <p><strong>Company Name:</strong> ${companyName}</p>
            <p><strong>Stock Symbol:</strong> ${symbol}</p>
            <p><strong>Latest Price:</strong> $${latestPrice.toFixed(2)}</p>
        `;
    }

    // Function to create the stock info container
    function createInfoContainer() {
        const container = document.createElement('div');
        container.id = 'info-container';
        container.style.marginTop = '20px';
        chartContainer.appendChild(container);
        return container;
    }

    // Function to display messages
    function displayMessage(message, type) {
        const messageContainer = document.getElementById('message-container') || createMessageContainer();
        messageContainer.textContent = message;
        messageContainer.className = type;
    }

    // Function to create the message container
    function createMessageContainer() {
        const container = document.createElement('div');
        container.id = 'message-container';
        container.style.margin = '10px 0';
        form.insertAdjacentElement('afterend', container);
        return container;
    }
});
