const url = "http://localhost:5000/expense"
let editExpenseId = null;
const token = localStorage.getItem("token");
const isPremiumUser = localStorage.getItem("isPremiumUser");

const cashfree = Cashfree({ mode: "sandbox" });

document.addEventListener('DOMContentLoaded', () => {
    showExpenses()
    handlePremiumDiv()
});

async function handleFormSubmit(event) {
    event.preventDefault()
    try {
        const amount = event.target.amount.value;
        const description = event.target.description.value.trim();
        const category = event.target.category.value;

        let res;
        if (editExpenseId) {
            res = await axios.put(url + `/update/${editExpenseId}`, { amount, description, category }, { headers: { token } });
        } else {
            res = await axios.post(url + "/add", { amount, description, category }, { headers: { token } });
        }

        const { message, data: expense } = res.data;
        console.log(message);

        if (res.status === 201) {
            const expensesList = document.getElementById('expenses-list');
            expensesList.appendChild(createExpenseItem(expense));
        } else if (res.status === 200) {
            const prevListItem = document.getElementById(editExpenseId);
            prevListItem.replaceWith(createExpenseItem(expense));
            editExpenseId = null;
        }
        document.getElementById('submit-btn').textContent = "Add Expense";
        event.target.reset();

    } catch (error) {
        handleErrorMessage(error);
    }
}

async function showExpenses() {
    try {
        const expensesList = document.getElementById('expenses-list');
        expensesList.innerHTML = '';

        const result = await axios.get(url + "/get", { headers: { token } })
        const { message, data: expenses } = result.data;

        expenses.forEach((expense) => {
            expensesList.appendChild(createExpenseItem(expense));
        });
    } catch (error) {
        handleErrorMessage(error);
    }
}

function editExpenseHandler(expense) {
    document.getElementById('amount').value = expense.amount;
    document.getElementById('description').value = expense.description;
    document.getElementById('category').value = expense.category;

    editExpenseId = expense.id;
    document.getElementById('submit-btn').textContent = "Update Expense";
}

async function deleteExpenseHandler(expenseId) {
    try {
        const res = await axios.delete(url + `/delete/${expenseId}`, { headers: { token } });
        console.log(res.data.message);
        const listItem = document.getElementById(expenseId);
        if (listItem) listItem.remove();

    } catch (error) {
        handleErrorMessage(error);
    }
}

async function showLeaderboard() {
    try {
        const leaderboardList = document.getElementById('leaderboard-list');
        leaderboardList.innerHTML = "";

        const result = await axios.get("http://localhost:5000/feature/leaderboard", {headers:{token}});
        const { message, data: leaderboard } = result.data;

        leaderboard.forEach(expenseSummary => {
            const amount = expenseSummary.totalExpense ? expenseSummary.totalExpense : 0;
            leaderboardList.appendChild(createLeaderboardItem(amount, expenseSummary.userName));
        })

    } catch (error) {
        handleErrorMessage(error);
    }
}

function handlePremiumDiv() {
    const premiumDiv = document.getElementById("premium-container"); 4
    premiumDiv.innerHTML = "";
    if (isPremiumUser === "false") {
        const buyPremiumBtn = createButton("Buy Premium", "buyPremium-btn");
        buyPremiumBtn.addEventListener('click', buyPremiumHandler);
        premiumDiv.appendChild(buyPremiumBtn);
    }
    if (isPremiumUser === "true") {
        const text = document.createElement("p");
        text.textContent = "You are a Premium User!";
        premiumDiv.appendChild(text);

        const leaderboardDiv = document.createElement("div");
        leaderboardDiv.id = "leaderboard-container";
        leaderboardDiv.className = "leaderboard-container";
        leaderboardDiv.innerHTML = `
            <h2>Leaderboard:</h2>
            <ul id="leaderboard-list"></ul>
            <button id="leaderboard-btn" class="leaderboard-btn" onclick="showLeaderboard()">Show Leaderboard</button>
        `;
        premiumDiv.appendChild(leaderboardDiv);
    }
}

async function buyPremiumHandler() {
    try {
        const result = await axios.post("http://localhost:5000/premium/buy", { orderId: "XYZ" }, { headers: { token } });
        const { message: paymentStatusMessage, data: paymentDetails } = result.data;
        console.log(paymentStatusMessage);
        const { paymentSessionId, orderId } = paymentDetails;

        let checkoutOptions = {
            paymentSessionId,
            redirectTarget: "_modal",
        };

        const paymentResult = await cashfree.checkout(checkoutOptions);
        if (paymentResult.redirect) {
            console.log("Exceptional case user has been redirected!");
            return;
        }

        const orderResult = await axios.get("http://localhost:5000/premium/status/" + orderId, { headers: { token } });
        const { message: orderStatusMessage, data } = orderResult.data;
        const orderStatus = data.orderStatus;

        console.log(orderStatusMessage);

        if (orderStatus === "Failure") {
            alert("Payment for premium failed!")
            return;
        } else if (orderStatus === "Success") {
            localStorage.setItem("isPremiumUser", true);
            alert("Congrats, You're a premium user now!")
            location.reload();
            return;
        }

        if (paymentResult.error) {
            // This will be true whenever user clicks on close icon inside the modal or any error happens during the payment
            console.log("paymentResult.error", paymentResult.error);
        }



    } catch (error) {
        handleErrorMessage(error);
    }
}

// HELPER FUNCTIONS:

function handleErrorMessage(error) {
    if (error.response) {
        alert(`${error.response.status} - ${error.response.data?.message || error.response.statusText}`);
    } else if (error.request) {
        console.log(`No response from server. Please check your network or server status.`);
    } else {
        console.log(`Error: ${error.message}`);
    }
}

function createButton(text, className) {
    const btn = document.createElement('button');
    btn.className = className;
    btn.textContent = text;
    return btn;
}

function createExpenseItem(expense) {
    const listItem = document.createElement('li');
    listItem.id = expense.id;
    listItem.innerHTML = `
        <p>
        Amount: ${expense.amount}<br>
        Category: ${expense.category}<br>
        Description: ${expense.description}<br>
        </p>
    `;

    const editBtn = createButton("Edit", "edit-btn");
    editBtn.addEventListener('click', () => editExpenseHandler(expense));
    listItem.appendChild(editBtn);

    const deleteBtn = createButton("Delete", "delete-btn");
    deleteBtn.addEventListener('click', () => deleteExpenseHandler(expense.id));
    listItem.appendChild(deleteBtn);

    return listItem;
}

function createLeaderboardItem(totalAmount, userName) {
    const listItem = document.createElement('li');
    listItem.id = userName;
    listItem.innerHTML = `<p>Name: ${userName}  Total Amount: ${totalAmount}</p>`;
    return listItem;
}