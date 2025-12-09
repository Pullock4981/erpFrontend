// Purchase Module
function loadPurchase() {
    const mainContent = document.getElementById('main-content');
    const purchases = JSON.parse(localStorage.getItem('purchases') || '[]');
    const suppliers = JSON.parse(localStorage.getItem('suppliers') || '[]');

    mainContent.innerHTML = `
        <div class="fade-in">
            <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <h1 class="text-2xl sm:text-3xl font-bold">Purchase Management</h1>
                <div class="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                    <button class="btn btn-secondary btn-sm sm:btn-md w-full sm:w-auto" onclick="openAddSupplierModal()">
                        <span class="hidden sm:inline">Add Supplier</span>
                        <span class="sm:hidden">Supplier</span>
                    </button>
                    <button class="btn btn-primary btn-sm sm:btn-md w-full sm:w-auto" onclick="openAddPurchaseModal()">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                        </svg>
                        <span class="hidden sm:inline">New Purchase</span>
                        <span class="sm:hidden">Purchase</span>
                    </button>
                </div>
            </div>
            
            <!-- Purchase Summary -->
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                <div class="stat bg-base-100 shadow rounded-lg">
                    <div class="stat-title">Total Purchases</div>
                    <div class="stat-value text-primary">${purchases.length}</div>
                    <div class="stat-desc">All time orders</div>
                </div>
                <div class="stat bg-base-100 shadow rounded-lg">
                    <div class="stat-title">Total Spent</div>
                    <div class="stat-value text-warning">${formatCurrency(purchases.reduce((sum, p) => sum + (parseFloat(p.total) || 0), 0))}</div>
                    <div class="stat-desc">Total expenses</div>
                </div>
                <div class="stat bg-base-100 shadow rounded-lg">
                    <div class="stat-title">This Month</div>
                    <div class="stat-value text-info">${formatCurrency(getThisMonthPurchases(purchases))}</div>
                    <div class="stat-desc">Current month expenses</div>
                </div>
            </div>
            
            <!-- Purchases Table -->
            <div class="card bg-base-100 shadow">
                <div class="card-body">
                    <div class="overflow-x-auto">
                        <table class="table table-zebra">
                            <thead>
                                <tr>
                                    <th>Order ID</th>
                                    <th>Supplier</th>
                                    <th>Date</th>
                                    <th>Items</th>
                                    <th>Total</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody id="purchasesTableBody">
                                ${renderPurchasesTable(purchases)}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- Add/Edit Purchase Modal -->
        <dialog id="purchaseModal" class="modal">
            <div class="modal-box w-11/12 max-w-4xl max-h-[90vh] overflow-y-auto">
                <h3 class="font-bold text-lg mb-4">New Purchase Order</h3>
                <form id="purchaseForm" onsubmit="savePurchase(event)">
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                        <div class="form-control">
                            <label class="label">
                                <span class="label-text">Supplier Name</span>
                            </label>
                            <input type="text" id="purchaseSupplier" class="input input-bordered" required>
                        </div>
                        <div class="form-control">
                            <label class="label">
                                <span class="label-text">Date</span>
                            </label>
                            <input type="date" id="purchaseDate" class="input input-bordered" required>
                        </div>
                    </div>
                    
                    <div class="form-control mb-4">
                        <label class="label">
                            <span class="label-text">Add Item</span>
                        </label>
                        <div class="flex flex-col sm:flex-row gap-2">
                            <input type="text" id="purchaseItemName" placeholder="Item Name" class="input input-bordered flex-1">
                            <input type="number" id="purchaseItemQty" placeholder="Qty" class="input input-bordered w-full sm:w-24" min="1">
                            <input type="number" id="purchaseItemPrice" placeholder="Price" class="input input-bordered w-full sm:w-32" min="0" step="0.01">
                            <button type="button" class="btn btn-primary w-full sm:w-auto" onclick="addPurchaseItem()">Add</button>
                        </div>
                    </div>
                    
                    <div class="overflow-x-auto mb-4">
                        <table class="table table-zebra">
                            <thead>
                                <tr>
                                    <th>Item Name</th>
                                    <th>Quantity</th>
                                    <th>Unit Price</th>
                                    <th>Total</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody id="purchaseItemsTable">
                                <tr><td colspan="5" class="text-center text-gray-500">No items added yet</td></tr>
                            </tbody>
                        </table>
                    </div>
                    
                    <div class="flex justify-end mb-4">
                        <div class="text-right">
                            <p class="text-2xl font-bold">Total: <span id="purchaseTotal">$0.00</span></p>
                        </div>
                    </div>
                    
                    <div class="modal-action">
                        <button type="button" class="btn" onclick="closePurchaseModal()">Cancel</button>
                        <button type="submit" class="btn btn-primary">Complete Purchase</button>
                    </div>
                </form>
            </div>
            <form method="dialog" class="modal-backdrop">
                <button>close</button>
            </form>
        </dialog>
        
        <!-- Add Supplier Modal -->
        <dialog id="supplierModal" class="modal">
            <div class="modal-box w-11/12 max-w-lg">
                <h3 class="font-bold text-lg mb-4">Add Supplier</h3>
                <form onsubmit="saveSupplier(event)">
                    <div class="form-control mb-4">
                        <label class="label">
                            <span class="label-text">Supplier Name</span>
                        </label>
                        <input type="text" id="supplierName" class="input input-bordered" required>
                    </div>
                    <div class="form-control mb-4">
                        <label class="label">
                            <span class="label-text">Contact</span>
                        </label>
                        <input type="text" id="supplierContact" class="input input-bordered" required>
                    </div>
                    <div class="form-control mb-4">
                        <label class="label">
                            <span class="label-text">Email</span>
                        </label>
                        <input type="email" id="supplierEmail" class="input input-bordered">
                    </div>
                    <div class="form-control mb-4">
                        <label class="label">
                            <span class="label-text">Address</span>
                        </label>
                        <textarea id="supplierAddress" class="textarea textarea-bordered" rows="3"></textarea>
                    </div>
                    <div class="modal-action">
                        <button type="button" class="btn" onclick="closeSupplierModal()">Cancel</button>
                        <button type="submit" class="btn btn-primary">Save</button>
                    </div>
                </form>
            </div>
            <form method="dialog" class="modal-backdrop">
                <button>close</button>
            </form>
        </dialog>
    `;

    document.getElementById('purchaseDate').value = new Date().toISOString().split('T')[0];
}

let purchaseItems = [];

function renderPurchasesTable(purchases) {
    if (purchases.length === 0) {
        return '<tr><td colspan="7" class="text-center">No purchases found. Create your first purchase order!</td></tr>';
    }

    return purchases.map(purchase => `
        <tr>
            <td class="font-mono">#${purchase.id.substring(0, 8)}</td>
            <td>${purchase.supplier}</td>
            <td>${formatDate(purchase.date)}</td>
            <td>${purchase.items.length} item(s)</td>
            <td class="font-semibold">${formatCurrency(purchase.total)}</td>
            <td><span class="badge badge-success">Completed</span></td>
            <td>
                <button class="btn btn-xs sm:btn-sm btn-info w-full sm:w-auto" onclick="viewPurchase('${purchase.id}')">View</button>
            </td>
        </tr>
    `).join('');
}

function openAddPurchaseModal() {
    purchaseItems = [];
    document.getElementById('purchaseForm').reset();
    document.getElementById('purchaseDate').value = new Date().toISOString().split('T')[0];
    document.getElementById('purchaseItemsTable').innerHTML = '<tr><td colspan="5" class="text-center text-gray-500">No items added yet</td></tr>';
    document.getElementById('purchaseTotal').textContent = '$0.00';
    document.getElementById('purchaseModal').showModal();
}

function closePurchaseModal() {
    document.getElementById('purchaseModal').close();
    purchaseItems = [];
}

function addPurchaseItem() {
    const name = document.getElementById('purchaseItemName').value;
    const quantity = parseInt(document.getElementById('purchaseItemQty').value);
    const price = parseFloat(document.getElementById('purchaseItemPrice').value);

    if (!name || !quantity || !price) {
        showToast('Please fill all fields!', 'error');
        return;
    }

    purchaseItems.push({ name, quantity, price });
    updatePurchaseItemsTable();

    // Clear inputs
    document.getElementById('purchaseItemName').value = '';
    document.getElementById('purchaseItemQty').value = '';
    document.getElementById('purchaseItemPrice').value = '';
}

function removePurchaseItem(index) {
    purchaseItems.splice(index, 1);
    updatePurchaseItemsTable();
}

function updatePurchaseItemsTable() {
    const tbody = document.getElementById('purchaseItemsTable');

    if (purchaseItems.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="text-center text-gray-500">No items added yet</td></tr>';
        document.getElementById('purchaseTotal').textContent = '$0.00';
        return;
    }

    tbody.innerHTML = purchaseItems.map((item, index) => {
        const itemTotal = item.price * item.quantity;
        return `
            <tr>
                <td>${item.name}</td>
                <td>${item.quantity}</td>
                <td>${formatCurrency(item.price)}</td>
                <td>${formatCurrency(itemTotal)}</td>
                <td>
                    <button type="button" class="btn btn-sm btn-error" onclick="removePurchaseItem(${index})">Remove</button>
                </td>
            </tr>
        `;
    }).join('');

    const total = purchaseItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    document.getElementById('purchaseTotal').textContent = formatCurrency(total);
}

function savePurchase(event) {
    event.preventDefault();

    if (purchaseItems.length === 0) {
        showToast('Please add at least one item!', 'error');
        return;
    }

    const purchases = JSON.parse(localStorage.getItem('purchases') || '[]');
    const inventory = JSON.parse(localStorage.getItem('inventory') || '[]');
    const transactions = JSON.parse(localStorage.getItem('transactions') || '[]');

    const total = purchaseItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    // Add items to inventory
    purchaseItems.forEach(purchaseItem => {
        const existingProduct = inventory.find(p => p.name.toLowerCase() === purchaseItem.name.toLowerCase());
        if (existingProduct) {
            existingProduct.quantity = parseInt(existingProduct.quantity) + purchaseItem.quantity;
        } else {
            inventory.push({
                id: generateId(),
                name: purchaseItem.name,
                category: 'Other',
                quantity: purchaseItem.quantity,
                price: purchaseItem.price,
                description: 'Added from purchase',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            });
        }
    });

    const purchase = {
        id: generateId(),
        supplier: document.getElementById('purchaseSupplier').value,
        date: document.getElementById('purchaseDate').value,
        items: purchaseItems,
        total: total,
        createdAt: new Date().toISOString()
    };

    purchases.push(purchase);

    // Add transaction
    transactions.push({
        id: generateId(),
        type: 'expense',
        category: 'Purchase',
        description: `Purchase from ${purchase.supplier}`,
        amount: total,
        date: purchase.date,
        createdAt: new Date().toISOString()
    });

    localStorage.setItem('purchases', JSON.stringify(purchases));
    localStorage.setItem('inventory', JSON.stringify(inventory));
    localStorage.setItem('transactions', JSON.stringify(transactions));

    showToast('Purchase order completed successfully!');
    closePurchaseModal();
    loadPurchase();
}

function viewPurchase(id) {
    const purchases = JSON.parse(localStorage.getItem('purchases') || '[]');
    const purchase = purchases.find(p => p.id === id);

    if (purchase) {
        const itemsList = purchase.items.map(item =>
            `${item.name} x${item.quantity} = ${formatCurrency(item.price * item.quantity)}`
        ).join('\n');

        alert(`Purchase Details\n\nOrder ID: #${purchase.id.substring(0, 8)}\nSupplier: ${purchase.supplier}\nDate: ${formatDate(purchase.date)}\n\nItems:\n${itemsList}\n\nTotal: ${formatCurrency(purchase.total)}`);
    }
}

function getThisMonthPurchases(purchases) {
    const now = new Date();
    const thisMonth = purchases.filter(purchase => {
        const purchaseDate = new Date(purchase.date);
        return purchaseDate.getMonth() === now.getMonth() && purchaseDate.getFullYear() === now.getFullYear();
    });
    return thisMonth.reduce((sum, purchase) => sum + (parseFloat(purchase.total) || 0), 0);
}

function openAddSupplierModal() {
    document.getElementById('supplierModal').showModal();
}

function closeSupplierModal() {
    document.getElementById('supplierModal').close();
}

function saveSupplier(event) {
    event.preventDefault();

    const suppliers = JSON.parse(localStorage.getItem('suppliers') || '[]');

    const supplier = {
        id: generateId(),
        name: document.getElementById('supplierName').value,
        contact: document.getElementById('supplierContact').value,
        email: document.getElementById('supplierEmail').value,
        address: document.getElementById('supplierAddress').value,
        createdAt: new Date().toISOString()
    };

    suppliers.push(supplier);
    localStorage.setItem('suppliers', JSON.stringify(suppliers));

    showToast('Supplier added successfully!');
    closeSupplierModal();
    loadPurchase();
}

