const balance = document.getElementById("balance");
const money_plus = document.getElementById("money-plus");
const money_minus = document.getElementById("money-minus");
const list = document.getElementById("list");
const form = document.getElementById("form");
const text = document.getElementById("text");
const amount = document.getElementById("amount");



const localStorageTransactions = JSON.parse(localStorage.getItem("transactions"));
let transactions = localStorage.getItem("transactions") !== null ? localStorageTransactions:[];
// Add Transaction
function addTransaction(e) {
    e.preventDefault();
    if (text.value.trim() === "" || amount.value.trim() === "") {
        alert("Please enter text and amount");
    } else {
        const transaction = {
            id: generateID(),
            text: text.value,
            amount: +amount.value,
        };

        transactions.push(transaction);
        addTransactionDOM(transaction);
        updateLocalStorage();
        updateValues();
        text.value = "";
        amount.value = "";
    }
}

// Generate ID
function generateID() {
    return Math.floor(Math.random() * 100000000);
}

// Add Transaction to DOM list
function addTransactionDOM(transaction) {
    const sign = transaction.amount < 0 ? "-" : "+";
    const item = document.createElement("li");

    item.classList.add(transaction.amount < 0 ? "minus" : "plus");
    item.innerHTML = `
        <div class="transaction-details">
            <span>${transaction.text}</span>
            <span>${sign}₹${Math.abs(transaction.amount)}</span>
        </div>
        <div class="transaction-actions">
            <button class="edit-btn"><i class="fa-regular fa-pen-to-square"></i></button>
            <button class="delete-btn"><i class="fa-solid fa-xmark"></i></button>
        </div>
    `;

    const editButton = item.querySelector(".edit-btn");
    const deleteButton = item.querySelector(".delete-btn");

    editButton.addEventListener("click", () => editTransaction(transaction.id));
    deleteButton.addEventListener("click", () => removeTransaction(transaction.id));

    list.appendChild(item);
}

//remove Transaction 
function removeTransaction(id){
    transactions = transactions.filter(transaction => transaction.id !== id);
    updateLocalStorage();
    init();
}

function editTransaction(id) {
    const transactionIndex = transactions.findIndex(transaction => transaction.id === id);
    const transaction = transactions[transactionIndex];

    const item = list.childNodes[transactionIndex]; // Get the list item corresponding to the transaction

    const transactionDetails = item.querySelector(".transaction-details");
    const transactionActions = item.querySelector(".transaction-actions");

    const textSpan = transactionDetails.querySelector("span:first-child");
    const amountSpan = transactionDetails.querySelector("span:last-child");

    const textValue = textSpan.textContent;
    const amountValue = parseFloat(amountSpan.textContent.replace("₹", "").replace("-", ""));

    // Create form elements for editing
    const editForm = document.createElement("form");
    editForm.innerHTML = `
        <input type="text" value="${textValue}">
        <input type="number" value="${amountValue}">
        <button type="submit">Save</button>
    `;

    // Replace transaction details with form
    transactionDetails.innerHTML = "";
    transactionDetails.appendChild(editForm);
    transactionActions.style.display = "none"; // Hide action buttons temporarily

    // Handle form submission
    editForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const newText = editForm.querySelector("input[type='text']").value;
        const newAmount = parseFloat(editForm.querySelector("input[type='number']").value);

        if (newText.trim() !== "" && !isNaN(newAmount)) {
            transactions[transactionIndex].text = newText;
            transactions[transactionIndex].amount = newAmount;

            updateLocalStorage();
            init(); // Re-render transactions
        } else {
            alert("Please enter valid text and amount.");
        }
    });
}



// Update the balance, income, and expense
function updateValues() {
    const amounts = transactions.map(transaction => transaction.amount);
    const total = amounts.reduce((acc, item) => (acc += item), 0).toFixed(2);
    const income = amounts
        .filter(item => item > 0)
        .reduce((acc, item) => (acc += item), 0)
        .toFixed(2);
    const expense = (
        amounts.filter(item => item < 0).reduce((acc, item) => (acc += item), 0) * -1
    ).toFixed(2);

    balance.innerText = `₹${total}`;
    money_plus.innerText = `₹${income}`;
    money_minus.innerText = `₹${expense}`;
}

// update local storage 
function updateLocalStorage(){
    localStorage.setItem(
        "transactions", JSON.stringify(transactions)
        
    );
}


// Initialize the application
function init() {
    list.innerHTML = "";
    transactions.forEach(addTransactionDOM);
    updateValues();
}

init();
form.addEventListener("submit", addTransaction);
