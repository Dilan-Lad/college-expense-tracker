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

const searchInput =
    document.getElementById("searchExpenses");

const categoryFilter =
    document.getElementById("filterCategory");
  
  
// =========================
// SEARCH & FILTER
// =========================

searchInput.addEventListener("input", () => {
    renderTransactions();
});

categoryFilter.addEventListener("change", () => {
    renderTransactions();
});


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


    // Get search text
    const searchTerm =
        searchInput.value.toLowerCase().trim();


    // Get selected category
    const selectedCategory =
        categoryFilter.value;


    // Filter expenses
    const filteredExpenses =
        expenses.filter((expense) => {

            const matchesSearch =
                expense.note
                    .toLowerCase()
                    .includes(searchTerm) ||

                expense.category
                    .toLowerCase()
                    .includes(searchTerm);


            const matchesCategory =
                selectedCategory === "all" ||
                expense.category === selectedCategory;


            return matchesSearch && matchesCategory;

        });


    // Show maximum 10 transactions
    const recentExpenses =
        filteredExpenses.slice(0, 10);


    // No results
    if (recentExpenses.length === 0) {

        transactionsList.innerHTML = `
            <div class="empty-state">
                No expenses found.
            </div>
        `;

        return;
    }


    // Create transaction cards
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


            <div class="transaction-right">

                <strong class="expense-amount">
                    − ${formatCurrency(expense.amount)}
                </strong>

                <div class="transaction-actions">

                    <button
                        class="transaction-action edit-btn"
                        data-id="${expense.id}"
                    >
                        Edit
                    </button>

                    <button
                        class="transaction-action delete-btn"
                        data-id="${expense.id}"
                    >
                        Delete
                    </button>

                </div>

            </div>

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
searchInput.addEventListener("input", () => {
    renderTransactions();
});


categoryFilter.addEventListener("change", () => {
    renderTransactions();
});

setDefaultDate();

updateDashboard();

renderTransactions();
// =========================
// DELETE EXPENSE
// =========================

transactionsList.addEventListener("click", (event) => {

    const deleteButton =
        event.target.closest(".delete-btn");


    if (!deleteButton) {
        return;
    }


    const expenseId =
        Number(deleteButton.dataset.id);


    const expense =
        expenses.find(
            (item) => item.id === expenseId
        );


    if (!expense) {
        return;
    }


    const confirmed =
        confirm(
            `Delete "${expense.note}" expense of ${formatCurrency(expense.amount)}?`
        );


    if (!confirmed) {
        return;
    }


    expenses =
        expenses.filter(
            (item) => item.id !== expenseId
        );


    saveExpenses();

    updateDashboard();

    renderTransactions();

});