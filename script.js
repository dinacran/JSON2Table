var jsonData = null;
const dataContainer = document.getElementById('dataContainer');
const table = document.createElement('table');

async function setJsonData() {
    const apiUrl = document.getElementById('apiUrl').value;
    const authType = document.getElementById('auth').value;
    const reqType = document.getElementById('request-type').value;
    const token = document.getElementById('tokenInput').value;
    if (!apiUrl) {
        dataContainer.innerHTML = '<p style="color: red;">Please enter a valid API URL.</p>';
        return;
    }
    try {
        const headers = {};
        if (authType) {
            headers['Authorization'] = `${authType} ${token}`;
        }
        const response = await fetch(apiUrl, {
            method: `${reqType}`,
            headers: headers
        });
        if (!response.ok) {
            throw new Error(`Failed to fetch data: ${response.statusText}`);
        }
        jsonData = await response.json();
        generateTable();
        format();
    } catch (error) {
        jsonData = null;
        dataContainer.innerHTML = `<p style="color: red;">Error: ${error.message}</p>`;
    }
}

function format() {
    dataContainer.innerHTML = '';
    const viewMode = document.querySelector('input[name="viewMode"]:checked').value;
    if (viewMode === 'text') {
        dataContainer.textContent = JSON.stringify(jsonData, null, 2);
        hljs.highlightElement(dataContainer);
    } else if (viewMode === 'table') {
        if(jsonData === null || jsonData ==='') return;
       dataContainer.appendChild(table);
    }
}

function generateTable() {
    table.innerHTML = '';
    if(!Array.isArray(jsonData)) jsonData = [jsonData];
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
}

function printExcel() {
    if (jsonData == null) {
        dataContainer.innerHTML = '<p style="color: red;">Data container is empty</p>';
        return;
    }
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(jsonData);
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    XLSX.writeFile(workbook, "data.xlsx");
}