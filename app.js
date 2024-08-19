// app.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";
import { getDatabase, ref, push } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-database.js";

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

document.getElementById('inputForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const purpose = document.getElementById('purpose').value;
    const amount = document.getElementById('amount').value;
    const paidBy = document.getElementById('options').value;
    const timestamp = new Date().toISOString(); // Current date and time

    // Save data to Firebase
    push(ref(database, 'payments'), {
        purpose: purpose,
        amount: amount,
        paidBy: paidBy,
        timestamp: timestamp
    }).then(() => {
        alert('Data saved successfully!');
    }).catch((error) => {
        console.error('Error saving data: ', error);
    });

    // Clear the form
    document.getElementById('inputForm').reset();
});



 let btn = document.getElementById("btn");

btn.addEventListener("click", () => {
    window.location.href = "/viewpayments.html";
});
