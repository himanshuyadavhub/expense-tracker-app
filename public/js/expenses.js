
const url = "http://localhost:5000/expense"
const premiumUrl = "http://localhost:5000/feature"
let editExpenseId = null;
const token = localStorage.getItem("token");
const isPremiumUser = localStorage.getItem("isPremiumUser");
let itemsPerPage = localStorage.getItem("itemsPerPage") || 2;
let totalCount;
let currentPage = 1;
let totalPages;

const cashfree = Cashfree({ mode: "sandbox" });

document.addEventListener('DOMContentLoaded', () => {
    fetchExpensesByPageNo(currentPage, itemsPerPage);
    handlePremiumDiv();
    fetchTotalCountOfExpenses();
    applyEventListeners();
    if (isPremiumUser === "true") {
        enablePremiumFeatures();
    }
});

function applyEventListeners() {
    document.getElementById("next-btn").addEventListener("click", nextButtonHandler);
    document.getElementById("prev-btn").addEventListener("click", prevButtonHandler);
    document.getElementById("items-per-page").addEventListener("change", (event) => changeItemsPerPage(event));
    document.getElementById("items-per-page").value = itemsPerPage;
    document.getElementById("report-generate-btn").addEventListener('click', reportGenerateHandler);


}

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
            fetchExpensesByPageNo(currentPage, itemsPerPage)
            ++totalCount;
            setTotalPagesCount();
        } else if (res.status === 200) {
            const prevListItem = document.getElementById(editExpenseId);
            prevListItem.replaceWith(createExpenseItem(expense));
            editExpenseId = null;
        }
        document.getElementById('submit-btn').textContent = "Add Expense";
        event.target.reset();

    } catch (error) {
        console.log("Error: handleFormSubmit");
        handleErrorMessage(error);
    }
}



async function fetchExpensesByPageNo(pageNo, itemsPerPage) {
    try {
        const result = await axios.get(url + `/get?page=${pageNo}&limit=${itemsPerPage}`, { headers: { token } });
        const { message, data: expenses } = result.data;

        showExpenses(expenses);
    } catch (error) {
        console.log("Error: fetchExpensesByPageNo")
        handleErrorMessage(error);
    }
}

async function fetchTotalCountOfExpenses() {
    try {
        const res = await axios.get(url + "/count", { headers: { token } });
        const { message, data } = res.data;
        totalCount = data.totalCount;
        setTotalPagesCount();
        updateStateOfPaginationButtons();
    } catch (error) {
        console.log("Error: fetchTotalCountOfExpenses")
        handleErrorMessage(error);
    }
}

async function nextButtonHandler() {
    try {
        if (currentPage < totalPages) {
            currentPage++;
            await fetchExpensesByPageNo(currentPage, itemsPerPage);
            updateStateOfPaginationButtons();
            return;
        }
    } catch (error) {
        console.log("Error: nextButtonHandler")
        handleErrorMessage(error);
    }
}
async function prevButtonHandler() {
    try {
        if (currentPage > 1) {
            currentPage--;
            await fetchExpensesByPageNo(currentPage, itemsPerPage);
            updateStateOfPaginationButtons();
            return;
        }
    } catch (error) {
        console.log("Error: prevButtonHandler")
        handleErrorMessage(error);
    }
}

function changeItemsPerPage(event) {
    itemsPerPage = parseInt(event.target.value);
    localStorage.setItem("itemsPerPage", itemsPerPage);
    currentPage = 1;
    fetchExpensesByPageNo(currentPage, itemsPerPage);
    setTotalPagesCount();
    updateStateOfPaginationButtons();

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
        --totalCount;
        setTotalPagesCount();
        if (totalPages < currentPage && currentPage > 1) {
            --currentPage;
        }
        fetchExpensesByPageNo(currentPage, itemsPerPage);
        setTotalPagesCount();
    } catch (error) {
        console.log("Error: deleteExpenseHandler")
        handleErrorMessage(error);
    }
}



// Functions for handling premium features

function handlePremiumDiv() {
    const premiumDiv = document.getElementById("premium-container");
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
        console.log("Error: buyPremiumHandler")
        handleErrorMessage(error);
    }
}

async function showLeaderboard() {
    try {
        const leaderboardList = document.getElementById('leaderboard-list');
        leaderboardList.innerHTML = "";

        const result = await axios.get("http://localhost:5000/feature/leaderboard", { headers: { token } });
        const { message, data: leaderboard } = result.data;

        leaderboard.forEach(expenseSummary => {
            const amount = expenseSummary.totalExpense ? expenseSummary.totalExpense : 0;
            leaderboardList.appendChild(createLeaderboardItem(amount, expenseSummary.userName));
        })

    } catch (error) {
        console.log("Error: showLeaderboard")
        handleErrorMessage(error);
    }
}

async function reportGenerateHandler() {
    try {
        const duration = document.getElementById("duration").value;
        const res = await axios.get(premiumUrl + `/report?duration=${duration}`, { headers: { token } });
        const { message, data: expenses } = res.data;
        console.log(message)
        populateReportTable(expenses, duration);

        const downloadDiv = document.getElementById("download-btn-container")
        downloadDiv.innerHTML = "";
        const downloadBtn = createButton("Download", "download-btn");
        downloadBtn.addEventListener("click", () => downloadCsvFile(generateCSVContent(expenses, duration), `${duration}-report.csv`))
        downloadDiv.appendChild(downloadBtn);

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

function showExpenses(expenses) {
    try {
        const expensesList = document.getElementById('expenses-list');
        expensesList.innerHTML = '';
        if (expenses.length < 1) {
            expensesList.innerHTML = `
                <p>No Expenses Found</p>    
            `
        }
        expenses.forEach((expense) => {
            expensesList.appendChild(createExpenseItem(expense));
        });
    } catch (error) {
        handleErrorMessage(error);
    }
}

function createLeaderboardItem(totalAmount, userName) {
    const listItem = document.createElement('li');
    listItem.id = userName;
    listItem.innerHTML = `<p>Name: ${userName}  Total Amount: ${totalAmount}</p>`;
    return listItem;
}

function enablePremiumFeatures() {
    document.getElementById("leaderboard-container").style = "block";
    document.getElementById("report-container").style = "block";
}

function setTotalPagesCount() {
    totalPages = Math.ceil(totalCount / itemsPerPage) || 1;
    const currPageSpan = document.getElementById("current-page");
    currPageSpan.textContent = `${currentPage}/${totalPages}`;
    updateStateOfPaginationButtons();

}

function updateStateOfPaginationButtons() {
    const nextBtn = document.getElementById("next-btn");
    const prevBtn = document.getElementById("prev-btn");
    const currPageSpan = document.getElementById("current-page");
    currPageSpan.textContent = `${currentPage}/${totalPages}`;
    nextBtn.disabled = currentPage >= totalPages;
    prevBtn.disabled = currentPage <= 1;
}

function createReportRows(expense, duration) {

    const tableRow = document.createElement('tr');

    if (duration === "weekly") {
        const createdAt = new Date(expense.createdAt);
        const formattedDate = `${createdAt.getDate()}/${createdAt.getMonth()+1}/${createdAt.getFullYear()}`
        tableRow.innerHTML = `
            <td>${formattedDate}</td>
            <td>${expense.description}</td>
            <td>${expense.category}</td>
            <td>${expense.amount}</td>
        `
    }
    if (duration === "monthly") {
        tableRow.innerHTML = `
            <td>${expense.date}</td>
            <td>${expense.totalAmount}</td>
        `
    }
    return tableRow;
}

function populateReportTable(expenses, duration) {

    const reportTable = document.getElementById("report-table");
    if (!expenses.length) {
        reportTable.innerHTML += '<tr><td colspan="4">No data available</td></tr>';
        return;
    }
    if (duration === "weekly") {
        reportTable.innerHTML = `
            <th class="table-heading">Date</th>
            <th class="table-heading">Description</th>
            <th class="table-heading">Category</th>
            <th class="table-heading">Amount</th>
        `
    }
    if (duration === "monthly") {
        reportTable.innerHTML = `
            <th class="table-heading">Date</th>
            <th class="table-heading">Amount</th>
        `
    }
    expenses.forEach(expense => {
        reportTable.appendChild(createReportRows(expense, duration));
    })
}

function generateCSVContent(expenses, duration) {
    let csvContent = "";

    if (duration === "weekly") {
        csvContent += "Date,Description,Category,Amount\n";
        expenses.forEach(exp => {
            const createdAt = new Date(exp.createdAt);
            const formattedDate = `${createdAt.getDate()}/${createdAt.getMonth()+1}/${createdAt.getFullYear()}`
            csvContent += `${formattedDate},${exp.description},${exp.category},${exp.amount}\n`;
        });
    } else if (duration === "monthly") {
        csvContent += "Date,Amount\n";
        expenses.forEach(exp => {
            csvContent += `${exp.date},${exp.totalAmount}\n`;
        });
    }

    return csvContent;
}

function downloadCsvFile(csvContent, fileName) {
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    a.click();

    URL.revokeObjectURL(url);
}