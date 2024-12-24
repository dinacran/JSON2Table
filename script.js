

var jsonData = null;
const dataContainer = document.getElementById('dataContainer');

async function setJsonData() {
    const apiUrl = document.getElementById('apiUrl').value;
    const authType = document.getElementById('auth').value
    const token = document.getElementById('tokenInput').value;
    if (!apiUrl) {
        dataContainer.innerHTML = '<p style="color: red;">Please enter a valid API URL.</p>';
        return;
    }
    try {
        const response = await fetch(apiUrl, {
            headers: {
                'Authorization': `${authType ? `${authType} ${token}` : ''}`
            }
        });
        if (!response.ok) {
            throw new Error('Failed to fetch data');
        }
        jsonData = await response.json();
        format();
    } catch (error) {
        dataContainer.innerHTML = `<p style="color: red;">Error: ${error.message}</p>`;
    }

}
function format() {

    if (jsonData == null) setJsonData();

    const viewMode = document.querySelector('input[name="viewMode"]:checked').value;

    if (viewMode === 'text') {
        dataContainer.innerHTML = `<pre>${JSON.stringify(jsonData, null, 2)}</pre>`;
    } else if (viewMode === 'table') {
        const table = generateTable(jsonData);
    }

}
function generateTable() {

    if (Array.isArray(jsonData)) {
        const table = document.createElement('table');
        const thead = document.createElement('thead');
        const tbody = document.createElement('tbody');

        const headers = Object.keys(jsonData[0]);
        const headerRow = document.createElement('tr');
        headers.forEach(header => {
            const th = document.createElement('th');
            th.textContent = header;
            headerRow.appendChild(th);
        });
        thead.appendChild(headerRow);

        jsonData.forEach(row => {
            const tr = document.createElement('tr');
            headers.forEach(header => {
                const td = document.createElement('td');
                td.textContent = row[header];
                tr.appendChild(td);
            });
            tbody.appendChild(tr);
        });

        table.appendChild(thead);
        table.appendChild(tbody);
        dataContainer.innerHTML = '';
        dataContainer.appendChild(table);
    }
    else {
        const table = document.createElement('table');
        const thead = document.createElement('thead');
        const tbody = document.createElement('tbody');

        const headers = Object.keys(jsonData);
        const headerRow = document.createElement('tr');
        headers.forEach(header => {
            const th = document.createElement('th');
            th.textContent = header;
            headerRow.appendChild(th);
        });
        thead.appendChild(headerRow);
        const tr = document.createElement('tr');
        headers.forEach(header => {
            const td = document.createElement('td');
            td.textContent = jsonData[header];
            tr.appendChild(td);
        });
        tbody.appendChild(tr);
        table.appendChild(thead);
        table.appendChild(tbody);
        dataContainer.innerHTML = '';
        dataContainer.appendChild(table);
    }
}