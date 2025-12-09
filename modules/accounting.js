// Accounting Module
function loadAccounting() {
    const mainContent = document.getElementById('main-content');
    const transactions = JSON.parse(localStorage.getItem('transactions') || '[]');
    const sales = JSON.parse(localStorage.getItem('sales') || '[]');
    const purchases = JSON.parse(localStorage.getItem('purchases') || '[]');

    // Calculate totals
    const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + (parseFloat(t.amount) || 0), 0);
    const totalExpenses = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + (parseFloat(t.amount) || 0), 0);
    const balance = totalIncome - totalExpenses;

    mainContent.innerHTML = `
        <div class="fade-in">
            <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <h1 class="text-2xl sm:text-3xl font-bold">Accounting & Finance</h1>
                <button class="btn btn-primary btn-sm sm:btn-md w-full sm:w-auto" onclick="openAddTransactionModal()">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                    </svg>
                    <span class="hidden sm:inline">Add Transaction</span>
                    <span class="sm:hidden">Add</span>
                </button>
            </div>
            
            <!-- Financial Summary -->
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                <div class="stat bg-base-100 shadow rounded-lg">
                    <div class="stat-title">Total Income</div>
                    <div class="stat-value text-success">${formatCurrency(totalIncome)}</div>
                    <div class="stat-desc">All income transactions</div>
                </div>
                <div class="stat bg-base-100 shadow rounded-lg">
                    <div class="stat-title">Total Expenses</div>
                    <div class="stat-value text-error">${formatCurrency(totalExpenses)}</div>
                    <div class="stat-desc">All expense transactions</div>
                </div>
                <div class="stat bg-base-100 shadow rounded-lg">
                    <div class="stat-title">Balance</div>
                    <div class="stat-value ${balance >= 0 ? 'text-success' : 'text-error'}">${formatCurrency(balance)}</div>
                    <div class="stat-desc">Income - Expenses</div>
                </div>
            </div>
            
            <!-- Filter -->
            <div class="card bg-base-100 shadow mb-6">
                <div class="card-body">
                    <div class="flex flex-col md:flex-row gap-4">
                        <select class="select select-bordered" id="filterTransactionType" onchange="filterTransactions()">
                            <option value="">All Types</option>
                            <option value="income">Income</option>
                            <option value="expense">Expense</option>
                        </select>
                        <select class="select select-bordered" id="filterTransactionCategory" onchange="filterTransactions()">
                            <option value="">All Categories</option>
                            <option value="Sale">Sale</option>
                            <option value="Purchase">Purchase</option>
                            <option value="Salary">Salary</option>
                            <option value="Other">Other</option>
                        </select>
                        <input type="text" id="searchTransactions" placeholder="Search..." class="input input-bordered flex-1" onkeyup="filterTransactions()">
                    </div>
                </div>
            </div>
            
            <!-- Transactions Table -->
            <div class="card bg-base-100 shadow">
                <div class="card-body">
                    <div class="overflow-x-auto">
                        <table class="table table-zebra">
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Type</th>
                                    <th>Category</th>
                                    <th>Description</th>
                                    <th>Amount</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody id="transactionsTableBody">
                                ${renderTransactionsTable(transactions)}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- Add Transaction Modal -->
        <dialog id="transactionModal" class="modal">
            <div class="modal-box w-11/12 max-w-lg">
                <h3 class="font-bold text-lg mb-4">Add Transaction</h3>
                <form id="transactionForm" onsubmit="saveTransaction(event)">
                    <input type="hidden" id="transactionId">
                    <div class="form-control mb-4">
                        <label class="label">
                            <span class="label-text">Type</span>
                        </label>
                        <select id="transactionType" class="select select-bordered" required>
                            <option value="">Select Type</option>
                            <option value="income">Income</option>
                            <option value="expense">Expense</option>
                        </select>
                    </div>
                    <div class="form-control mb-4">
                        <label class="label">
                            <span class="label-text">Category</span>
                        </label>
                        <select id="transactionCategory" class="select select-bordered" required>
                            <option value="">Select Category</option>
                            <option value="Sale">Sale</option>
                            <option value="Purchase">Purchase</option>
                            <option value="Salary">Salary</option>
                            <option value="Rent">Rent</option>
                            <option value="Utilities">Utilities</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>
                    <div class="form-control mb-4">
                        <label class="label">
                            <span class="label-text">Description</span>
                        </label>
                        <input type="text" id="transactionDescription" class="input input-bordered" required>
                    </div>
                    <div class="form-control mb-4">
                        <label class="label">
                            <span class="label-text">Amount ($)</span>
                        </label>
                        <input type="number" id="transactionAmount" class="input input-bordered" min="0" step="0.01" required>
                    </div>
                    <div class="form-control mb-4">
                        <label class="label">
                            <span class="label-text">Date</span>
                        </label>
                        <input type="date" id="transactionDate" class="input input-bordered" required>
                    </div>
                    <div class="modal-action">
                        <button type="button" class="btn" onclick="closeTransactionModal()">Cancel</button>
                        <button type="submit" class="btn btn-primary">Save</button>
                    </div>
                </form>
            </div>
            <form method="dialog" class="modal-backdrop">
                <button>close</button>
            </form>
        </dialog>
    `;

    document.getElementById('transactionDate').value = new Date().toISOString().split('T')[0];
}

function renderTransactionsTable(transactions) {
    if (transactions.length === 0) {
        return '<tr><td colspan="6" class="text-center">No transactions found. Add your first transaction!</td></tr>';
    }

    return transactions.sort((a, b) => new Date(b.date) - new Date(a.date)).map(transaction => `
        <tr>
            <td>${formatDate(transaction.date)}</td>
            <td>
                <span class="badge ${transaction.type === 'income' ? 'badge-success' : 'badge-error'}">
                    ${transaction.type === 'income' ? 'Income' : 'Expense'}
                </span>
            </td>
            <td><span class="badge badge-outline">${transaction.category}</span></td>
            <td>${transaction.description}</td>
            <td class="font-semibold ${transaction.type === 'income' ? 'text-success' : 'text-error'}">
                ${transaction.type === 'income' ? '+' : '-'}${formatCurrency(transaction.amount)}
            </td>
            <td>
                <button class="btn btn-xs sm:btn-sm btn-error w-full sm:w-auto" onclick="deleteTransaction('${transaction.id}')">Delete</button>
            </td>
        </tr>
    `).join('');
}

function openAddTransactionModal() {
    document.getElementById('transactionForm').reset();
    document.getElementById('transactionId').value = '';
    document.getElementById('transactionDate').value = new Date().toISOString().split('T')[0];
    document.getElementById('transactionModal').showModal();
}

function closeTransactionModal() {
    document.getElementById('transactionModal').close();
}

function saveTransaction(event) {
    event.preventDefault();

    const transactions = JSON.parse(localStorage.getItem('transactions') || '[]');

    const transaction = {
        id: generateId(),
        type: document.getElementById('transactionType').value,
        category: document.getElementById('transactionCategory').value,
        description: document.getElementById('transactionDescription').value,
        amount: parseFloat(document.getElementById('transactionAmount').value),
        date: document.getElementById('transactionDate').value,
        createdAt: new Date().toISOString()
    };

    transactions.push(transaction);
    localStorage.setItem('transactions', JSON.stringify(transactions));

    showToast('Transaction added successfully!');
    closeTransactionModal();
    loadAccounting();
}

function deleteTransaction(id) {
    if (confirm('Are you sure you want to delete this transaction?')) {
        const transactions = JSON.parse(localStorage.getItem('transactions') || '[]');
        const filtered = transactions.filter(t => t.id !== id);
        localStorage.setItem('transactions', JSON.stringify(filtered));
        showToast('Transaction deleted successfully!');
        loadAccounting();
    }
}

function filterTransactions() {
    const typeFilter = document.getElementById('filterTransactionType').value;
    const categoryFilter = document.getElementById('filterTransactionCategory').value;
    const searchTerm = document.getElementById('searchTransactions').value.toLowerCase();

    const transactions = JSON.parse(localStorage.getItem('transactions') || '[]');

    const filtered = transactions.filter(transaction => {
        const matchesType = !typeFilter || transaction.type === typeFilter;
        const matchesCategory = !categoryFilter || transaction.category === categoryFilter;
        const matchesSearch = transaction.description.toLowerCase().includes(searchTerm) ||
            transaction.category.toLowerCase().includes(searchTerm);
        return matchesType && matchesCategory && matchesSearch;
    });

    document.getElementById('transactionsTableBody').innerHTML = renderTransactionsTable(filtered);
}

