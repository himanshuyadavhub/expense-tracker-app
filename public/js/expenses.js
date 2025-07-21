const url = "http://localhost:5000/expense"
let editExpenseId = null;
const token = localStorage.getItem("token");

document.addEventListener('DOMContentLoaded', showExpenses);

async function handleFormSubmit(event) {
    event.preventDefault()
    try {
        const amount = event.target.amount.value;
        const description = event.target.description.value.trim();
        const category = event.target.category.value;

        let res;
        if (editExpenseId) {
            res = await axios.put(url + `/update/${editExpenseId}`, { amount, description, category },{headers:{token}});
        } else {
            res = await axios.post(url + "/add", { amount, description, category },{headers:{token}});
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

        const result = await axios.get(url + "/get",{headers:{token}})
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
        const res = await axios.delete(url + `/delete/${expenseId}`, {headers:{token}});
        console.log(res.data.message);
        const listItem = document.getElementById(expenseId);
        if (listItem) listItem.remove();

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