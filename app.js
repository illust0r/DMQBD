const transactionForm = document.getElementById('transaction-form');
const transactionDescription = document.getElementById('transaction-description');
const transactionAmount = document.getElementById('transaction-amount');
const transactionType = document.getElementById('transaction-type');
const transactionCategory = document.getElementById('transaction-category');
const transactionDate = document.getElementById('transaction-date');
const transactionList = document.getElementById('transaction-list');
const balanceDisplay = document.getElementById('balance');
const chart = document.getElementById('chart');
//
//
let transactions = [];

async function fetchTransactions() {
    const response = await fetch('http://localhost:3001/transactions');
    transactions = await response.json();
}

async function addTransaction(transaction) {
    const response = await fetch('http://localhost:3001/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(transaction)
    });
    const newTransaction = await response.json();
    transactions.push(newTransaction);
}

async function deleteTransaction(id) {
    await fetch(`http://localhost:3001/transactions/${id}`, { method: 'DELETE' });
    transactions = transactions.filter(transaction => transaction._id !== id);
}

function calculateBalance() {
    return transactions.reduce((sum, transaction) => sum + transaction.amount, 0);
}

function sortTransactionsByDate() {
    transactions.sort((a, b) => new Date(a.date) - new Date(b.date));
}

function calculateDailyTotals() {
    const dailyTotals = {};

    transactions.forEach(transaction => {
        if (!dailyTotals[transaction.date]) {
            dailyTotals[transaction.date] = 0;
        }
        dailyTotals[transaction.date] += transaction.amount;
    });

    return dailyTotals;
}

async function updateUI() {
    sortTransactionsByDate();

    const balance = calculateBalance();
    balanceDisplay.textContent = balance.toFixed(2);
    transactionList.innerHTML = '';

    transactions.forEach(transaction => {
        const listItem = document.createElement('div');
        listItem.innerHTML = `${transaction.description}: ¥${Math.abs(transaction.amount).toFixed(2)} (${transaction.type}, ${transaction.category}, ${transaction.date}) <button class="delete-btn">删除</button>`;
        const deleteButton = listItem.querySelector('.delete-btn');
        deleteButton.addEventListener('click', async () => {
            await deleteTransaction(transaction._id);
            updateUI();
        });
        transactionList.appendChild(listItem);
    });

    const dailyTotals = calculateDailyTotals();
    const dailyTotalKeys = Object.keys(dailyTotals);
    const dailyTotalValues = dailyTotalKeys.map(date => dailyTotals[date]);

    const data = [{
        x: dailyTotalKeys,
        y: dailyTotalValues,
        type: 'bar',
        text: dailyTotalKeys.map(date => dailyTotals[date] > 0 ? '收入' : '支出'),
        textposition: 'auto',
        marker: {
            color: dailyTotalValues.map(value => value > 0 ? 'rgb(50, 200, 50)' : 'rgb(200, 50, 50)')
        }
    }];

    const layout = {
        title: '每日收支图表',
        xaxis: { title: '日期' },
        yaxis: { title: '金额' }
    };

    Plotly.newPlot(chart, data, layout);
}

transactionForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const description = transactionDescription.value.trim();
    const amount = parseFloat(transactionAmount.value) * (transactionType.value === 'income' ? 1 : -1);
    const type = transactionType.value;
    const category = transactionCategory.value;
    const date = transactionDate.value;

    if (!description || isNaN(amount) || !date) {
        alert('请输入有效的描述、金额和日期');
        return;
    }

    const transaction = { description, amount, type, category, date };
    await addTransaction(transaction);

    sortTransactionsByDate();
    await updateUI();

    transactionDescription.value = '';
    transactionAmount.value = '';
    transactionDate.value = '';
});

(async function initialize() {
    await fetchTransactions();
    updateUI();
})();
