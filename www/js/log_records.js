let currentPage = 1;
const tableContainer = document.getElementById('tableContainer');
const errorContainer = document.getElementById('errorContainer');

function showLoading() {
    tableContainer.innerHTML = '<div class="loading">Loading logs...</div>';
}

function showError(message) {
    errorContainer.innerHTML = `<div class="error-message">${message}</div>`;
}

function clearError() {
    errorContainer.innerHTML = '';
}

function showNoData() {
    tableContainer.innerHTML = '<div class="no-data">No logs found matching your criteria</div>';
}

function updateExportLinks() {
    const user = document.getElementById('filterUser').value;
    const api = document.getElementById('filterApi').value;
    const date = document.getElementById('filterDate').value;

    const exportLinks = document.querySelectorAll('.export-buttons a');
    exportLinks.forEach(link => {
        const baseUrl = link.href.split('?')[0];
        const format = link.href.includes('csv') ? 'csv' : 'excel';
        link.href = `${baseUrl}?format=${format}&user=${user}&api=${api}&date=${date}`;
    });
}

async function fetchLogs(page = 1) {
    clearError();
    showLoading();
    currentPage = page;

    const user = document.getElementById('filterUser').value;
    const api = document.getElementById('filterApi').value;
    const date = document.getElementById('filterDate').value;

    updateExportLinks();

    try {
        const response = await fetch(`server/log_records.php?page=${page}&user=${user}&api=${api}&date=${date}`);
        const data = await response.json();

        if (!data.success) {
            throw new Error(data.error || 'Failed to fetch logs');
        }

        if (!data.data || data.data.length === 0) {
            showNoData();
            document.getElementById('pagination').innerHTML = '';
            return;
        }

        // Restore table if it was replaced with no-data message
        if (!document.getElementById('logTable')) {
            tableContainer.innerHTML = `
                <table id="logTable">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>LogID</th>
                            <th>Username</th>
                            <th>API</th>
                            <th>User Activity</th>
                            <th>Log Time</th>
                        </tr>
                    </thead>
                    <tbody></tbody>
                </table>
            `;
        }

        const tableBody = document.querySelector("#logTable tbody");
        tableBody.innerHTML = '';

        data.data.forEach((record, index) => {
            const rowNumber = (page - 1) * 15 + index + 1;
            const row = `<tr>
                <td>${rowNumber}</td>
                <td>${record.LogID}</td>
                <td>${record.Username}</td>
                <td>${record.Api || 'None'}</td>
                <td>${record.UserActivity}</td>
                <td>${new Date(record.LogTime).toLocaleString()}</td>
            </tr>`;
            tableBody.innerHTML += row;
        });

        // Update pagination
        const pagination = document.getElementById('pagination');
        pagination.innerHTML = '';
        for (let i = 1; i <= data.total_pages; i++) {
            const button = document.createElement('button');
            button.textContent = i;
            button.onclick = () => fetchLogs(i);
            if (i === page) button.classList.add('active');
            pagination.appendChild(button);
        }

    } catch (error) {
        showError(error.message || 'Failed to connect to the database. Please try again later.');
    }
}

// Initial fetch
fetchLogs();

// Add event listeners for enter key on filters
document.getElementById('filterUser').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') fetchLogs();
});
document.getElementById('filterDate').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') fetchLogs();
});
