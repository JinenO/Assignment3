document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('data-form');
    const resetButton = document.getElementById('reset-button');
    const chartContainer = document.getElementById('chart-container');
    const infoContainerParent = document.getElementById('info-container-parent');
    let stockChart;
    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        const companyName = document.getElementById('symbol').value.trim();
        const dataType = document.getElementById('data-type').value;
    
        if (!companyName) {
            clearDisplay();
            displayMessage('Please enter a valid company name.', 'error');
            return;
        }
    
        const apiKey = 'SFI0HL2RPY2T7QOO';
        const symbolSearchUrl = `https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${companyName}&apikey=${apiKey}`;
    
        try {
            const symbolResponse = await fetch(symbolSearchUrl);
            const symbolData = await symbolResponse.json();
    
            if (!symbolData.bestMatches || symbolData.bestMatches.length === 0) {
                clearDisplay();
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
                displayStockInfo(symbol, companyNameMatched, parsedData.latestPrice);
                updateChart(parsedData);
            } else {
                clearDisplay();
                displayMessage('Unsupported data type.', 'error');
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            clearDisplay();
            displayMessage('An error occurred while fetching the data.', 'error');
        }
    });

    resetButton.addEventListener('click', () => {
        form.reset();
        if (stockChart) {
            stockChart.destroy();
            stockChart = null;
        }
        chartContainer.innerHTML = '<canvas id="stock-chart"></canvas>';
        infoContainerParent.innerHTML = ''; // Clear stock info
        const messageContainer = document.getElementById('message-container');
        if (messageContainer) {
            messageContainer.textContent = ''; // Clear message
            messageContainer.className = ''; // Remove any error style
        }
    });
    
    function clearDisplay() {
        if (stockChart) {
            stockChart.destroy();
            stockChart = null;
        }
        chartContainer.innerHTML = '<canvas id="stock-chart"></canvas>';
        infoContainerParent.innerHTML = ''; // Clear stock info
        const messageContainer = document.getElementById('message-container');
        if (messageContainer) {
            messageContainer.textContent = ''; // Clear message
            messageContainer.className = ''; // Remove any error style
        }
    }
    function parseIntradayData(data) {
        const series = data['Time Series (5min)'];
        const labels = Object.keys(series).slice(0, 30).reverse();
        const values = labels.map((time) => parseFloat(series[time]['4. close']));
        return { labels, values, latestPrice: values[values.length - 1] };
    }

    function parseTimeSeriesData(data) {
        const series = data['Time Series (Daily)'];
        const labels = Object.keys(series).slice(0, 30).reverse();
        const values = labels.map((date) => parseFloat(series[date]['4. close']));
        return { labels, values, latestPrice: values[values.length - 1] };
    }

    function displayStockInfo(symbol, companyName, latestPrice) {
        infoContainerParent.innerHTML = `
            <div id="info-container" style="margin-bottom: 20px;">
                <p><strong>Company Name:</strong> ${companyName}</p>
                <p><strong>Stock Symbol:</strong> ${symbol}</p>
                <p><strong>Latest Price:</strong> $${latestPrice.toFixed(2)}</p>
            </div>
        `;
    }
    function updateChart(parsedData) {
        const canvas = document.getElementById('stock-chart');
        const context = canvas.getContext('2d');
    
        canvas.width = chartContainer.clientWidth; // Ensure width adapts to container
        canvas.height = chartContainer.clientHeight;
    
        if (stockChart) stockChart.destroy();
        
        stockChart = new Chart(context, {
            type: 'line',
            data: {
                labels: parsedData.labels,
                datasets: [{
                    label: 'Closing Price',
                    data: parsedData.values,
                    borderColor: 'rgba(75, 192, 192, 1)',
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    borderWidth: 2,
                    tension: 0.4,
                    fill: true,
                }],
            },
            options: {
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: 'Stock Chart',
                        font: {
                            size: 18,
                        },
                    },
                    legend: {
                        display: true,
                    },
                },
                maintainAspectRatio: false,
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'Time',
                            font: {
                                size: 14,
                            },
                        },
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Price (USD)',
                            font: {
                                size: 14,
                            },
                        },
                    },
                },
            },
        });
    }
    

    function displayMessage(message, type) {
        const messageContainer = document.getElementById('message-container') || createMessageContainer();
        messageContainer.textContent = message;
        messageContainer.className = type;
    }

    function createMessageContainer() {
        const container = document.createElement('div');
        container.id = 'message-container';
        form.insertAdjacentElement('afterend', container);
        return container;
    }
});
