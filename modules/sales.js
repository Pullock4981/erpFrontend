// Sales Module
function loadSales() {
    const mainContent = document.getElementById('main-content');
    const sales = JSON.parse(localStorage.getItem('sales') || '[]');
    const inventory = JSON.parse(localStorage.getItem('inventory') || '[]');
    const customers = JSON.parse(localStorage.getItem('customers') || '[]');

    mainContent.innerHTML = `
        <div class="fade-in">
            <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <h1 class="text-2xl sm:text-3xl font-bold">Sales Management</h1>
                <button class="btn btn-primary btn-sm sm:btn-md w-full sm:w-auto" onclick="openAddSaleModal()">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                    </svg>
                    <span class="hidden sm:inline">New Sale</span>
                    <span class="sm:hidden">New Sale</span>
                </button>
            </div>
            
            <!-- Sales Summary -->
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                <div class="stat bg-base-100 shadow rounded-lg">
                    <div class="stat-title">Total Sales</div>
                    <div class="stat-value text-primary">${sales.length}</div>
                    <div class="stat-desc">All time orders</div>
                </div>
                <div class="stat bg-base-100 shadow rounded-lg">
                    <div class="stat-title">Total Revenue</div>
                    <div class="stat-value text-success">${formatCurrency(sales.reduce((sum, sale) => sum + (parseFloat(sale.total) || 0), 0))}</div>
                    <div class="stat-desc">From all sales</div>
                </div>
                <div class="stat bg-base-100 shadow rounded-lg">
                    <div class="stat-title">This Month</div>
                    <div class="stat-value text-info">${formatCurrency(getThisMonthSales(sales))}</div>
                    <div class="stat-desc">Current month revenue</div>
                </div>
            </div>
            
            <!-- Sales Table -->
            <div class="card bg-base-100 shadow">
                <div class="card-body">
                    <div class="overflow-x-auto">
                        <table class="table table-zebra">
                            <thead>
                                <tr>
                                    <th>Order ID</th>
                                    <th>Customer</th>
                                    <th>Date</th>
                                    <th>Items</th>
                                    <th>Total</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody id="salesTableBody">
                                ${renderSalesTable(sales)}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- Add/Edit Sale Modal -->
        <dialog id="saleModal" class="modal">
            <div class="modal-box w-11/12 max-w-4xl max-h-[90vh] overflow-y-auto">
                <h3 class="font-bold text-lg mb-4" id="saleModalTitle">New Sale</h3>
                <form id="saleForm" onsubmit="saveSale(event)">
                    <input type="hidden" id="saleId">
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                        <div class="form-control">
                            <label class="label">
                                <span class="label-text">Customer Name</span>
                            </label>
                            <input type="text" id="saleCustomer" class="input input-bordered" required>
                        </div>
                        <div class="form-control">
                            <label class="label">
                                <span class="label-text">Date</span>
                            </label>
                            <input type="date" id="saleDate" class="input input-bordered" required>
                        </div>
                    </div>
                    
                    <div class="form-control mb-4">
                        <label class="label">
                            <span class="label-text">Select Product</span>
                        </label>
                        <div class="flex flex-col sm:flex-row gap-2">
                            <select id="saleProductSelect" class="select select-bordered flex-1" onchange="addSaleItem()">
                                <option value="">Choose Product</option>
                                ${inventory.map(item => `
                                    <option value="${item.id}" data-name="${item.name}" data-price="${item.price}" data-stock="${item.quantity}">
                                        ${item.name} - ${formatCurrency(item.price)} (Stock: ${item.quantity})
                                    </option>
                                `).join('')}
                            </select>
                            <button type="button" class="btn btn-primary w-full sm:w-auto" onclick="addSaleItem()">Add</button>
                        </div>
                    </div>
                    
                    <div class="overflow-x-auto mb-4">
                        <table class="table table-zebra">
                            <thead>
                                <tr>
                                    <th>Product</th>
                                    <th>Quantity</th>
                                    <th>Price</th>
                                    <th>Total</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody id="saleItemsTable">
                                <tr><td colspan="5" class="text-center text-gray-500">No items added yet</td></tr>
                            </tbody>
                        </table>
                    </div>
                    
                    <div class="flex justify-end mb-4">
                        <div class="text-right">
                            <p class="text-2xl font-bold">Total: <span id="saleTotal">$0.00</span></p>
                        </div>
                    </div>
                    
                    <div class="modal-action">
                        <button type="button" class="btn" onclick="closeSaleModal()">Cancel</button>
                        <button type="submit" class="btn btn-primary">Complete Sale</button>
                    </div>
                </form>
            </div>
            <form method="dialog" class="modal-backdrop">
                <button>close</button>
            </form>
        </dialog>
    `;

    // Set default date
    document.getElementById('saleDate').value = new Date().toISOString().split('T')[0];
}

let saleItems = [];

function renderSalesTable(sales) {
    if (sales.length === 0) {
        return '<tr><td colspan="7" class="text-center">No sales found. Create your first sale!</td></tr>';
    }

    return sales.map(sale => `
        <tr>
            <td data-label="Order ID" class="font-mono">#${sale.id.substring(0, 8)}</td>
            <td data-label="Customer">${sale.customer}</td>
            <td data-label="Date">${formatDate(sale.date)}</td>
            <td data-label="Items">${sale.items.length} item(s)</td>
            <td data-label="Total" class="font-semibold">${formatCurrency(sale.total)}</td>
            <td data-label="Status"><span class="badge badge-success">Completed</span></td>
            <td data-label="Actions">
                <button class="btn btn-xs sm:btn-sm btn-info w-full sm:w-auto" onclick="viewSale('${sale.id}')">View</button>
            </td>
        </tr>
    `).join('');
}

function openAddSaleModal() {
    saleItems = [];
    document.getElementById('saleModalTitle').textContent = 'New Sale';
    document.getElementById('saleForm').reset();
    document.getElementById('saleId').value = '';
    document.getElementById('saleDate').value = new Date().toISOString().split('T')[0];
    document.getElementById('saleItemsTable').innerHTML = '<tr><td colspan="5" class="text-center text-gray-500">No items added yet</td></tr>';
    document.getElementById('saleTotal').textContent = '$0.00';
    document.getElementById('saleModal').showModal();
}

function closeSaleModal() {
    document.getElementById('saleModal').close();
    saleItems = [];
}

function addSaleItem() {
    const select = document.getElementById('saleProductSelect');
    const selectedOption = select.options[select.selectedIndex];

    if (!selectedOption.value) return;

    const productId = selectedOption.value;
    const productName = selectedOption.dataset.name;
    const productPrice = parseFloat(selectedOption.dataset.price);
    const stock = parseInt(selectedOption.dataset.stock);

    // Check if item already exists
    const existingItem = saleItems.find(item => item.productId === productId);
    if (existingItem) {
        if (existingItem.quantity >= stock) {
            showToast('Insufficient stock!', 'error');
            return;
        }
        existingItem.quantity += 1;
    } else {
        saleItems.push({
            productId,
            name: productName,
            price: productPrice,
            quantity: 1
        });
    }

    updateSaleItemsTable();
    select.value = '';
}

function removeSaleItem(index) {
    saleItems.splice(index, 1);
    updateSaleItemsTable();
}

function updateSaleItemsTable() {
    const tbody = document.getElementById('saleItemsTable');

    if (saleItems.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="text-center text-gray-500">No items added yet</td></tr>';
        document.getElementById('saleTotal').textContent = '$0.00';
        return;
    }

    tbody.innerHTML = saleItems.map((item, index) => {
        const itemTotal = item.price * item.quantity;
        return `
            <tr>
                <td>${item.name}</td>
                <td>
                    <input type="number" class="input input-bordered input-sm w-20" 
                           value="${item.quantity}" min="1" 
                           onchange="updateSaleItemQuantity(${index}, this.value)">
                </td>
                <td>${formatCurrency(item.price)}</td>
                <td>${formatCurrency(itemTotal)}</td>
                <td>
                    <button type="button" class="btn btn-sm btn-error" onclick="removeSaleItem(${index})">Remove</button>
                </td>
            </tr>
        `;
    }).join('');

    const total = saleItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    document.getElementById('saleTotal').textContent = formatCurrency(total);
}

function updateSaleItemQuantity(index, quantity) {
    const inventory = JSON.parse(localStorage.getItem('inventory') || '[]');
    const item = saleItems[index];
    const product = inventory.find(p => p.id === item.productId);

    if (parseInt(quantity) > parseInt(product.quantity)) {
        showToast('Insufficient stock!', 'error');
        quantity = product.quantity;
    }

    saleItems[index].quantity = parseInt(quantity) || 1;
    updateSaleItemsTable();
}

function saveSale(event) {
    event.preventDefault();

    if (saleItems.length === 0) {
        showToast('Please add at least one item!', 'error');
        return;
    }

    const inventory = JSON.parse(localStorage.getItem('inventory') || '[]');
    const sales = JSON.parse(localStorage.getItem('sales') || '[]');

    // Check stock availability
    for (const saleItem of saleItems) {
        const product = inventory.find(p => p.id === saleItem.productId);
        if (!product || parseInt(product.quantity) < saleItem.quantity) {
            showToast(`Insufficient stock for ${saleItem.name}!`, 'error');
            return;
        }
    }

    // Update inventory
    saleItems.forEach(saleItem => {
        const product = inventory.find(p => p.id === saleItem.productId);
        if (product) {
            product.quantity = parseInt(product.quantity) - saleItem.quantity;
        }
    });

    const total = saleItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    const sale = {
        id: generateId(),
        customer: document.getElementById('saleCustomer').value,
        date: document.getElementById('saleDate').value,
        items: saleItems.map(item => ({
            productId: item.productId,
            name: item.name,
            quantity: item.quantity,
            price: item.price
        })),
        total: total,
        createdAt: new Date().toISOString()
    };

    sales.push(sale);
    localStorage.setItem('inventory', JSON.stringify(inventory));
    localStorage.setItem('sales', JSON.stringify(sales));

    showToast('Sale completed successfully!');
    closeSaleModal();
    loadSales();
}

function viewSale(id) {
    const sales = JSON.parse(localStorage.getItem('sales') || '[]');
    const sale = sales.find(s => s.id === id);

    if (sale) {
        const itemsList = sale.items.map(item =>
            `${item.name} x${item.quantity} = ${formatCurrency(item.price * item.quantity)}`
        ).join('\n');

        alert(`Sale Details\n\nOrder ID: #${sale.id.substring(0, 8)}\nCustomer: ${sale.customer}\nDate: ${formatDate(sale.date)}\n\nItems:\n${itemsList}\n\nTotal: ${formatCurrency(sale.total)}`);
    }
}

function getThisMonthSales(sales) {
    const now = new Date();
    const thisMonth = sales.filter(sale => {
        const saleDate = new Date(sale.date);
        return saleDate.getMonth() === now.getMonth() && saleDate.getFullYear() === now.getFullYear();
    });
    return thisMonth.reduce((sum, sale) => sum + (parseFloat(sale.total) || 0), 0);
}

