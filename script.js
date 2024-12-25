var jsonData = null;
const dataContainer = document.getElementById('dataContainer');
const table = document.createElement('table');

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
        generateTable();
    } catch (error) {
        dataContainer.innerHTML = `<p style="color: red;">Error: ${error.message}</p>`;
    }

}
function format() {

    dataContainer.innerHTML = '';

    const viewMode = document.querySelector('input[name="viewMode"]:checked').value;

    if (viewMode === 'text') {
        dataContainer.innerHTML = `<pre>${JSON.stringify(jsonData, null, 2)}</pre>`;
    } else if (viewMode === 'table') {
       dataContainer.appendChild(table)
    }

}
function generateTable() {

    table.innerHTML = '';

    if (Array.isArray(jsonData)) {
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
    else {
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
       
    }
}

function printExcel(){

    if(jsonData == null){
        dataContainer.innerHTML = '<p style="color: red;">Data container is empty</p>';
        return;
    }
    
    const workbook = XLSX.utils.book_new();

    const worksheet = XLSX.utils.json_to_sheet(jsonData);

    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

    XLSX.writeFile(workbook, "data.xlsx");
   
}