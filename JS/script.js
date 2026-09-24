console.log("College Expense Tracker");
// =========================
// ELEMENTS
// =========================

const addExpenseBtn = document.getElementById("addExpenseBtn");
const expenseModal = document.getElementById("expenseModal");
const closeModalBtn = document.getElementById("closeModalBtn");
const cancelModalBtn = document.getElementById("cancelModalBtn");

const expenseForm = document.querySelector(".expense-form");

const amountInput = document.getElementById("amount");
const categoryInput = document.getElementById("category");
const dateInput = document.getElementById("date");
const noteInput = document.getElementById("note");

const quickAmount = document.getElementById("quickAmount");
const quickCategory = document.getElementById("quickCategory");
const quickAddBtn = document.getElementById("quickAddBtn");

const transactionsList = document.querySelector(".transactions-list");


// =========================
// DASHBOARD VALUES
// =========================

const balanceElement = document.querySelector(
    ".balance-card h2"
);

const expenseElement = document.querySelector(
    ".summary-card:nth-child(2) h2"
);

const budgetElement = document.querySelector(
    ".summary-card:nth-child(3) h2"
);


// =========================
// USER DATA
// =========================

const monthlyIncome = 20000;
const monthlyBudget = 11000;

let expenses = JSON.parse(
    localStorage.getItem("spendwiseExpenses")
) || [
    {
        id: 1,
        amount: 120,
        category: "Food",
        date: new Date().toISOString().split("T")[0],
        note: "Lunch"
    },
    {
        id: 2,
        amount: 80,
        category: "Travel",
        date: new Date().toISOString().split("T")[0],
        note: "Bus pass"
    },
    {
        id: 3,
        amount: 500,
        category: "College",
        date: new Date(Date.now() - 86400000)
            .toISOString()
            .split("T")[0],
        note: "College project"
    }
];


// =========================
// CATEGORY ICONS
// =========================

const categoryIcons = {
    Food: "🍔",
    Travel: "🚌",
    College: "📚",
    Hostel: "🏠",
    Shopping: "🛍️",
    Entertainment: "🎬",
    Technology: "💻",
    Personal: "👤",
    Other: "📦"
};


// =========================
// MODAL
// =========================

function openModal() {

    expenseModal.classList.add("active");

    amountInput.focus();

    setDefaultDate();
}


function closeModal() {

    expenseModal.classList.remove("active");

    expenseForm.reset();

    setDefaultDate();
}


addExpenseBtn.addEventListener("click", openModal);

closeModalBtn.addEventListener("click", closeModal);

cancelModalBtn.addEventListener("click", closeModal);


// Close modal when clicking outside

expenseModal.addEventListener("click", (event) => {

    if (event.target === expenseModal) {
        closeModal();
    }

});


// Close with Escape key

document.addEventListener("keydown", (event) => {

    if (
        event.key === "Escape" &&
        expenseModal.classList.contains("active")
    ) {
        closeModal();
    }

});


// =========================
// DATE
// =========================

function setDefaultDate() {

    dateInput.value =
        new Date().toISOString().split("T")[0];
}


// =========================
// ADD EXPENSE
// =========================

expenseForm.addEventListener("submit", (event) => {

    event.preventDefault();

    const amount = Number(amountInput.value);
    const category = categoryInput.value;
    const date = dateInput.value;
    const note = noteInput.value.trim();

    if (!amount || amount <= 0) {

        alert("Please enter a valid amount.");

        return;
    }

    if (!category) {

        alert("Please select a category.");

        return;
    }


    const expense = {

        id: Date.now(),

        amount: amount,

        category: category,

        date: date,

        note: note || category

    };


    expenses.unshift(expense);

    saveExpenses();

    updateDashboard();

    renderTransactions();

    closeModal();

});


// =========================
// QUICK ADD
// =========================

quickAddBtn.addEventListener("click", () => {

    const amount = Number(quickAmount.value);

    const category = quickCategory.value;


    if (!amount || amount <= 0) {

        alert("Please enter a valid amount.");

        return;
    }


    if (!category) {

        alert("Please select a category.");

        return;
    }


    const expense = {

        id: Date.now(),

        amount: amount,

        category: category,

        date: new Date()
            .toISOString()
            .split("T")[0],

        note: category

    };


    expenses.unshift(expense);

    saveExpenses();

    updateDashboard();

    renderTransactions();


    quickAmount.value = "";

    quickCategory.value = "";

});


// =========================
// SAVE DATA
// =========================

function saveExpenses() {

    localStorage.setItem(
        "spendwiseExpenses",
        JSON.stringify(expenses)
    );

}


// =========================
// UPDATE DASHBOARD
// =========================

function updateDashboard() {

    const totalExpenses = expenses.reduce(
        (total, expense) => total + expense.amount,
        0
    );


    const balance = monthlyIncome - totalExpenses;


    balanceElement.textContent =
        formatCurrency(balance);


    expenseElement.textContent =
        formatCurrency(totalExpenses);


    budgetElement.textContent =
        formatCurrency(monthlyBudget);


    updateBudgetProgress(totalExpenses);

}


// =========================
// BUDGET PROGRESS
// =========================

function updateBudgetProgress(totalExpenses) {

    const progressFill =
        document.querySelector(".progress-fill");

    const progressText =
        document.querySelector(".budget-progress span");


    const percentage =
        Math.min(
            (totalExpenses / monthlyBudget) * 100,
            100
        );


    progressFill.style.width =
        `${percentage}%`;


    progressText.textContent =
        `${Math.round(percentage)}%`;

}


// =========================
// TRANSACTIONS
// =========================

function renderTransactions() {

    transactionsList.innerHTML = "";


    const recentExpenses =
        expenses.slice(0, 5);


    if (recentExpenses.length === 0) {

        transactionsList.innerHTML = `
            <div class="empty-state">
                No expenses recorded yet.
            </div>
        `;

        return;
    }


    recentExpenses.forEach((expense) => {

        const transaction =
            document.createElement("div");

        transaction.className =
            "transaction";


        const formattedDate =
            formatDate(expense.date);


        const icon =
            categoryIcons[expense.category] || "📦";


        transaction.innerHTML = `

            <div class="transaction-left">

                <div class="transaction-icon">
                    ${icon}
                </div>

                <div>

                    <strong>
                        ${escapeHTML(expense.note)}
                    </strong>

                    <span>
                        ${expense.category} · ${formattedDate}
                    </span>

                </div>

            </div>


            <strong class="expense-amount">
                − ${formatCurrency(expense.amount)}
            </strong>

        `;


        transactionsList.appendChild(
            transaction
        );

    });

}


// =========================
// FORMAT CURRENCY
// =========================

function formatCurrency(amount) {

    return new Intl.NumberFormat(
        "en-IN",
        {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 0
        }
    ).format(amount);

}


// =========================
// FORMAT DATE
// =========================

function formatDate(dateString) {

    const date =
        new Date(dateString);


    const today =
        new Date();


    const yesterday =
        new Date();


    yesterday.setDate(
        today.getDate() - 1
    );


    if (
        date.toDateString() ===
        today.toDateString()
    ) {
        return "Today";
    }


    if (
        date.toDateString() ===
        yesterday.toDateString()
    ) {
        return "Yesterday";
    }


    return date.toLocaleDateString(
        "en-IN",
        {
            day: "numeric",
            month: "short"
        }
    );

}


// =========================
// SECURITY HELPER
// =========================

function escapeHTML(value) {

    return value
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


// =========================
// INITIALIZE
// =========================

setDefaultDate();

updateDashboard();

renderTransactions();