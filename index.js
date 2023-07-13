
// Budget Tracker
const totalAmount = document.getElementById("total-amount");
const userAmount = document.getElementById("user-amount");
const checkAmountButton = document.getElementById("check-amount");
const totalAmountButton = document.getElementById("total-amount-button");
const productTitle = document.getElementById("product-title");
const errorMessage = document.getElementById("budget-error");
const productTitleError = document.getElementById("product-title-error");
const amount = document.getElementById("amount");
const expenditureValue = document.getElementById("expenditure-value");
const balanceValue = document.getElementById("balance-amount");
const list = document.getElementById("list");
let tempAmount = 0;

// Function to save data to local storage
const saveDataToLocalStorage = (key, data) => {
  localStorage.setItem(key, JSON.stringify(data));
};

// Function to retrieve data from local storage
const getDataFromLocalStorage = (key) => {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : [];
};

// Function to update the UI with expenses from local storage
const updateUIWithExpenses = () => {
  const expenses = getDataFromLocalStorage("expenses") || [];
  list.innerHTML = "";

  expenses.forEach((expense) => {
    listCreator(expense.name, expense.value);
  });
};

// Set Budget Part
totalAmountButton.addEventListener("click", () => {
  tempAmount = totalAmount.value;
  // Empty or negative input
  if (tempAmount === "" || tempAmount < 0) {
    errorMessage.classList.remove("hide");
  } else {
    errorMessage.classList.add("hide");
    // Set Budget
    amount.innerText = tempAmount;
    // Set Balance
    balanceValue.innerText = tempAmount;
    // Clear Input Box
    totalAmount.value = "";
    // Reset expense list and total balance
    list.innerHTML = "";
    expenditureValue.innerText = "0.00";
    // Save budget to local storage
    saveDataToLocalStorage("budget", tempAmount);
    // Reset local storage for expenses
    saveDataToLocalStorage("expenses", []);
  }
});

// Function To Disable Edit and Delete Button
const disableButtons = (bool) => {
  const editButtons = document.getElementsByClassName("edit");
  const deleteButtons = document.getElementsByClassName("delete");
  Array.from(editButtons).forEach((element) => {
    element.disabled = bool;
  });
  Array.from(deleteButtons).forEach((element) => {
    element.disabled = bool;
  });
};

// Function To Add Expenses
checkAmountButton.addEventListener("click", () => {
  // Empty checks
  if (!userAmount.value || !productTitle.value) {
    productTitleError.classList.remove("hide");
    return false;
  }
  // Enable buttons
  disableButtons(false);
  // Expense
  const expenditure = parseFloat(userAmount.value);
  // Total expense (existing + new)
  const sum = parseFloat(expenditureValue.innerText) + expenditure;
  expenditureValue.innerText = sum.toFixed(2);
  // Total balance (budget - total expense)
  const totalBalance = parseFloat(tempAmount) - sum;
  balanceValue.innerText = totalBalance.toFixed(2);
  // Create list
  listCreator(productTitle.value, expenditure.toFixed(2));
  // Empty inputs
  productTitle.value = "";
  userAmount.value = "";
  // Update local storage
  const expenses = getDataFromLocalStorage("expenses") || [];
  expenses.push({ name: productTitle.value, value: expenditure.toFixed(2) });
  saveDataToLocalStorage("expenses", expenses);
});

// Function to create list item
const listCreator = (expenseName, expenseValue) => {
  const listItem = document.createElement("div");
  listItem.classList.add("list-item", "d-flex", "pt-2", "ps-2", "list-item-separator");

  const expenseDetails = document.createElement("div");
  expenseDetails.classList.add("expense-details", "d-flex", "gap-4");

  const expenseNameElement = document.createElement("p");
  expenseNameElement.innerText = expenseName;
  expenseDetails.appendChild(expenseNameElement);

  const expenseValueElement = document.createElement("p");
  expenseValueElement.innerText = expenseValue;
  expenseDetails.appendChild(expenseValueElement);

  listItem.appendChild(expenseDetails);

  const editButton = document.createElement("button");
  editButton.innerHTML = '<i class="fas fa-pen"></i>';
  editButton.classList.add("edit");
  editButton.addEventListener("click", () => {
    editExpense(expenseName, expenseValue, listItem);
  });
  listItem.appendChild(editButton);

  const deleteButton = document.createElement("button");
  deleteButton.innerHTML = '<i class="fas fa-trash"></i>';
  deleteButton.classList.add("delete");
  deleteButton.addEventListener("click", () => {
    deleteExpense(expenseName, expenseValue, listItem);
  });
  listItem.appendChild(deleteButton);

  list.appendChild(listItem);
};

// Function to edit an expense
const editExpense = (expenseName, expenseValue, listItem) => {
  // Disable buttons
  disableButtons(true);

  // Replace expense details with input fields
  const expenseDetails = listItem.querySelector(".expense-details");
  expenseDetails.innerHTML = `
    <input type="text" class="edit-expense-name" value="${expenseName}">
    <input type="number" class="edit-expense-value" value="${expenseValue}">
    <button class="save-button">Save</button>
  `;

  const saveButton = listItem.querySelector(".save-button");
  saveButton.addEventListener("click", () => {
    const editedExpenseName = listItem.querySelector(".edit-expense-name").value;
    const editedExpenseValue = listItem.querySelector(".edit-expense-value").value;

    // Update expense details
    expenseDetails.innerHTML = `
      <p>${editedExpenseName}</p>
      <p>${editedExpenseValue}</p>
    `;

    // Enable buttons
    disableButtons(false);

    // Update local storage
    const expenses = getDataFromLocalStorage("expenses") || [];
    const index = Array.from(list.children).indexOf(listItem);
    if (index !== -1) {
      expenses[index].name = editedExpenseName;
      expenses[index].value = parseFloat(editedExpenseValue).toFixed(2);
      saveDataToLocalStorage("expenses", expenses);
    }
  });
};

// Function to delete an expense
const deleteExpense = (expenseName, expenseValue, listItem) => {
  localStorage.removeItem(listItem);
  listItem.innerHTML = "";
  listItem.classList.remove("list-item-separator")

  // Update total expense and balance
  const totalExpense = parseFloat(expenditureValue.innerText);
  const newTotalExpense = totalExpense - parseFloat(expenseValue);
  expenditureValue.innerText = newTotalExpense.toFixed(2);
  balanceValue.innerText = (parseFloat(tempAmount) - newTotalExpense).toFixed(2);

  // Update local storage
  const expenses = getDataFromLocalStorage("expenses") || [];
  const index = Array.from(list.children).indexOf(listItem);
  if (index !== -1) {
    expenses.splice(index, 1);
    saveDataToLocalStorage("expenses", expenses);
  }
};

// Load budget from local storage and update the UI
const savedBudget = getDataFromLocalStorage("budget");
if (savedBudget) {
  tempAmount = savedBudget;
  amount.innerText = savedBudget;
  balanceValue.innerText = savedBudget;

  // Load expenses from local storage and update the UI
  updateUIWithExpenses();
}


AOS.init();

// Reminder Tracker
const addReminderBtn = document.getElementById('add-reminder-btn');
const reminderNameInput = document.getElementById('reminder-name');
const reminderDateInput = document.getElementById('reminder-date');
const reminderTimeInput = document.getElementById('reminder-time');
const reminderList = document.getElementById('reminder-list');

addReminderBtn.addEventListener('click', function(event) {
  event.preventDefault();


  const reminder = {
    name: reminderNameInput.value,
    date: reminderDateInput.value,
    time: reminderTimeInput.value
  };


  // Store the reminder in your data structure (e.g., array, localStorage)
  // Display the reminder in the UI or trigger notification here

  // Create a new list item
  const listItem = document.createElement('li');
  listItem.classList.add('reminder-item');

  // Create the reminder content
  const reminderContent = document.createElement('div');
  reminderContent.classList.add('reminder-content');
  reminderContent.innerHTML = `<p class="reminder-name">Description: ${reminder.name}</p><p class="reminder-date">Date: ${reminder.date}</p><p>Time: ${reminder.time}</p>`;

  // Create the delete button
  const deleteButton = document.createElement('button');
  deleteButton.classList.add('delete-button', 'fa-solid', 'fa-trash-can');
  deleteButton.style.fontSize = '1.2em';
  deleteButton.addEventListener('click', function() {
    // Handle the delete button click event here
    listItem.remove();
  });

  // Append the reminder content and delete button to the list item
  listItem.appendChild(reminderContent);
  listItem.appendChild(deleteButton);

  // Append the list item to the reminder list
  reminderList.appendChild(listItem);
  
  // Clear the input fields
  reminderNameInput.value = '';
  reminderDateInput.value = '';
  reminderTimeInput.value = '';
});


