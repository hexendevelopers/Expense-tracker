// viewPayments.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-database.js";

// Your Firebase configuration object
const firebaseConfig = {
    apiKey: "AIzaSyBaG6FqrwGTvnTJkOuiW7HxdJ45fQq3pqw",
    authDomain: "expense-tracker-7de0a.firebaseapp.com",
    projectId: "expense-tracker-7de0a",
    storageBucket: "expense-tracker-7de0a.appspot.com",
    messagingSenderId: "317587692535",
    appId: "1:317587692535:web:8d0662100701034a96ecf2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const paymentsRef = ref(database, 'payments');

// Function to calculate count and total amount by payer
function calculateStats(data) {
    const stats = {
        shijas: { count: 0, total: 0 },
        swalih: { count: 0, total: 0 },
        company: { count: 0, total: 0 }
    };

    data.forEach(item => {
        if (stats.hasOwnProperty(item.paidBy)) {
            stats[item.paidBy].count++;
            stats[item.paidBy].total += parseFloat(item.amount);
        }
    });

    return stats;
}

// Fetch and display data
onValue(paymentsRef, (snapshot) => {
    const tableBody = document.querySelector('#paymentsTable tbody');
    const shijasCountElem = document.getElementById('shijasCount');
    const shijasAmountElem = document.getElementById('shijasAmount');
    const swalihCountElem = document.getElementById('swalihCount');
    const swalihAmountElem = document.getElementById('swalihAmount');
    const companyCountElem = document.getElementById('companyCount');
    const companyAmountElem = document.getElementById('companyAmount');

    tableBody.innerHTML = ''; // Clear existing data

    const paymentsData = [];
    snapshot.forEach((childSnapshot) => {
        const data = childSnapshot.val();
        paymentsData.push({
            purpose: data.purpose,
            amount: data.amount,
            paidBy: data.paidBy,
            timestamp: new Date(data.timestamp).toLocaleString()
        });
    });

    const stats = calculateStats(paymentsData);

    shijasCountElem.textContent = stats.shijas.count;
    shijasAmountElem.textContent = stats.shijas.total.toFixed(2);
    swalihCountElem.textContent = stats.swalih.count;
    swalihAmountElem.textContent = stats.swalih.total.toFixed(2);
    companyCountElem.textContent = stats.company.count;
    companyAmountElem.textContent = stats.company.total.toFixed(2);

    paymentsData.forEach((data) => {
        const row = document.createElement('tr');

        row.innerHTML = `
            <td>${data.purpose}</td>
            <td>${data.amount}</td>
            <td>${data.paidBy}</td>
            <td>${data.timestamp}</td>
        `;

        tableBody.appendChild(row);
    });
});

// Function to convert table data to JSON format
function tableToJSON() {
    const rows = Array.from(document.querySelectorAll('table tr'));
    const headers = rows[0].querySelectorAll('th');
    const data = [];
    
    rows.slice(1).forEach(row => {
        const rowData = {};
        row.querySelectorAll('td').forEach((cell, index) => {
            rowData[headers[index].innerText] = cell.innerText;
        });
        data.push(rowData);
    });

    return data;
}

// Function to export data to Excel
function exportToExcel() {
    const data = tableToJSON();
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Payments');

    XLSX.writeFile(workbook, 'payments.xlsx');
}

// Event listener for the export button
document.getElementById('exportBtn').addEventListener('click', () => {
    exportToExcel();
});
