const url = "http://localhost:5000/expense"

document.addEventListener('DOMContentLoaded',showExpenses);
async function handleFormSubmit(event){
    event.preventDefault()
    try {
        const amount = event.target.amount.value;
        const description= event.target.description.value.trim();
        const category = event.target.category.value;
        
        const res = await axios.post(url+"/add",{amount,description,category});
        if(res.status === 201){
            const {message,data:expense} = res.data;
            console.log(message);
            console.log("Expense",expense);
        }
    } catch (error) {
        handleErrorMessage(error);
    }
}

async function showExpenses() {
    const expensesList = document.getElementById('expenses-list');
    expensesList.innerHTML = '';

    const result = await axios.get(url + "/get")
    const {message,data:expenses} = result.data;

    expenses.forEach((expense) => {
        const li = document.createElement('li');
        li.textContent = `Amount: ${expense.amount} Description: ${expense.description} Category: ${expense.category}`;

        const editBtn = document.createElement('button');
        editBtn.className = 'edit-btn';
        editBtn.textContent = 'Edit';
        // editBtn.addEventListener('click', () => editExpense(expense.id));
        li.appendChild(editBtn);

        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-btn';
        deleteBtn.textContent = 'Delete';
        // deleteBtn.addEventListener('click', () => deleteExpense(expense.id));
        li.appendChild(deleteBtn);

        expensesList.appendChild(li);
    });
}

function handleErrorMessage(error) {
    if (error.response) {
        alert(`${error.response.status} - ${error.response.data?.message || error.response.statusText}`);
    } else if (error.request) {
        console.log(`No response from server. Please check your network or server status.`) ;
    } else {
        console.log(`Error: ${error.message}`);
    }
}