// Inventory Module
function loadInventory() {
    const mainContent = document.getElementById('main-content');
    const inventory = JSON.parse(localStorage.getItem('inventory') || '[]');

    mainContent.innerHTML = `
        <div class="fade-in">
            <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <h1 class="text-2xl sm:text-3xl font-bold">Inventory Management</h1>
                <button class="btn btn-primary btn-sm sm:btn-md w-full sm:w-auto" onclick="openAddProductModal()">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                    </svg>
                    <span class="hidden sm:inline">Add Product</span>
                    <span class="sm:hidden">Add</span>
                </button>
            </div>
            
            <!-- Search and Filter -->
            <div class="card bg-base-100 shadow mb-6">
                <div class="card-body">
                    <div class="flex flex-col md:flex-row gap-4">
                        <input type="text" id="searchInventory" placeholder="Search products..." class="input input-bordered flex-1" onkeyup="filterInventory()">
                        <select class="select select-bordered" id="filterCategory" onchange="filterInventory()">
                            <option value="">All Categories</option>
                            <option value="Electronics">Electronics</option>
                            <option value="Clothing">Clothing</option>
                            <option value="Food">Food</option>
                            <option value="Furniture">Furniture</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>
                </div>
            </div>
            
            <!-- Inventory Table -->
            <div class="card bg-base-100 shadow">
                <div class="card-body">
                    <div class="overflow-x-auto">
                        <table class="table table-zebra">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Name</th>
                                    <th>Category</th>
                                    <th>Quantity</th>
                                    <th>Unit Price</th>
                                    <th>Total Value</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody id="inventoryTableBody">
                                ${renderInventoryTable(inventory)}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- Add/Edit Product Modal -->
        <dialog id="productModal" class="modal">
            <div class="modal-box w-11/12 max-w-lg">
                <h3 class="font-bold text-lg mb-4" id="modalTitle">Add Product</h3>
                <form id="productForm" onsubmit="saveProduct(event)">
                    <input type="hidden" id="productId">
                    <div class="form-control mb-4">
                        <label class="label">
                            <span class="label-text">Product Name</span>
                        </label>
                        <input type="text" id="productName" class="input input-bordered" required>
                    </div>
                    <div class="form-control mb-4">
                        <label class="label">
                            <span class="label-text">Category</span>
                        </label>
                        <select id="productCategory" class="select select-bordered" required>
                            <option value="">Select Category</option>
                            <option value="Electronics">Electronics</option>
                            <option value="Clothing">Clothing</option>
                            <option value="Food">Food</option>
                            <option value="Furniture">Furniture</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>
                    <div class="form-control mb-4">
                        <label class="label">
                            <span class="label-text">Quantity</span>
                        </label>
                        <input type="number" id="productQuantity" class="input input-bordered" min="0" required>
                    </div>
                    <div class="form-control mb-4">
                        <label class="label">
                            <span class="label-text">Unit Price ($)</span>
                        </label>
                        <input type="number" id="productPrice" class="input input-bordered" min="0" step="0.01" required>
                    </div>
                    <div class="form-control mb-4">
                        <label class="label">
                            <span class="label-text">Description</span>
                        </label>
                        <textarea id="productDescription" class="textarea textarea-bordered" rows="3"></textarea>
                    </div>
                    <div class="modal-action">
                        <button type="button" class="btn" onclick="closeProductModal()">Cancel</button>
                        <button type="submit" class="btn btn-primary">Save</button>
                    </div>
                </form>
            </div>
            <form method="dialog" class="modal-backdrop">
                <button>close</button>
            </form>
        </dialog>
    `;
}

function renderInventoryTable(inventory) {
    if (inventory.length === 0) {
        return '<tr><td colspan="8" class="text-center">No products found. Add your first product!</td></tr>';
    }

    return inventory.map(item => {
        const totalValue = parseFloat(item.quantity) * parseFloat(item.price);
        const isLowStock = parseInt(item.quantity) < 10;

        return `
            <tr>
                <td>${item.id.substring(0, 8)}</td>
                <td class="font-semibold">${item.name}</td>
                <td><span class="badge badge-outline">${item.category}</span></td>
                <td>${item.quantity}</td>
                <td>${formatCurrency(item.price)}</td>
                <td>${formatCurrency(totalValue)}</td>
                <td>
                    ${isLowStock ?
                '<span class="badge badge-warning">Low Stock</span>' :
                '<span class="badge badge-success">In Stock</span>'
            }
                </td>
                <td>
                    <div class="flex flex-col sm:flex-row gap-1 sm:gap-2">
                        <button class="btn btn-xs sm:btn-sm btn-info" onclick="editProduct('${item.id}')">Edit</button>
                        <button class="btn btn-xs sm:btn-sm btn-error" onclick="deleteProduct('${item.id}')">Delete</button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}

function openAddProductModal() {
    document.getElementById('modalTitle').textContent = 'Add Product';
    document.getElementById('productForm').reset();
    document.getElementById('productId').value = '';
    document.getElementById('productModal').showModal();
}

function closeProductModal() {
    document.getElementById('productModal').close();
}

function editProduct(id) {
    const inventory = JSON.parse(localStorage.getItem('inventory') || '[]');
    const product = inventory.find(item => item.id === id);

    if (product) {
        document.getElementById('modalTitle').textContent = 'Edit Product';
        document.getElementById('productId').value = product.id;
        document.getElementById('productName').value = product.name;
        document.getElementById('productCategory').value = product.category;
        document.getElementById('productQuantity').value = product.quantity;
        document.getElementById('productPrice').value = product.price;
        document.getElementById('productDescription').value = product.description || '';
        document.getElementById('productModal').showModal();
    }
}

function saveProduct(event) {
    event.preventDefault();

    const inventory = JSON.parse(localStorage.getItem('inventory') || '[]');
    const productId = document.getElementById('productId').value;
    const product = {
        id: productId || generateId(),
        name: document.getElementById('productName').value,
        category: document.getElementById('productCategory').value,
        quantity: document.getElementById('productQuantity').value,
        price: document.getElementById('productPrice').value,
        description: document.getElementById('productDescription').value,
        createdAt: productId ? inventory.find(p => p.id === productId)?.createdAt : new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };

    if (productId) {
        const index = inventory.findIndex(p => p.id === productId);
        if (index !== -1) {
            inventory[index] = product;
        }
    } else {
        inventory.push(product);
    }

    localStorage.setItem('inventory', JSON.stringify(inventory));
    showToast(productId ? 'Product updated successfully!' : 'Product added successfully!');
    closeProductModal();
    loadInventory();
}

function deleteProduct(id) {
    if (confirm('Are you sure you want to delete this product?')) {
        const inventory = JSON.parse(localStorage.getItem('inventory') || '[]');
        const filtered = inventory.filter(item => item.id !== id);
        localStorage.setItem('inventory', JSON.stringify(filtered));
        showToast('Product deleted successfully!');
        loadInventory();
    }
}

function filterInventory() {
    const searchTerm = document.getElementById('searchInventory').value.toLowerCase();
    const categoryFilter = document.getElementById('filterCategory').value;
    const inventory = JSON.parse(localStorage.getItem('inventory') || '[]');

    const filtered = inventory.filter(item => {
        const matchesSearch = item.name.toLowerCase().includes(searchTerm) ||
            (item.description || '').toLowerCase().includes(searchTerm);
        const matchesCategory = !categoryFilter || item.category === categoryFilter;
        return matchesSearch && matchesCategory;
    });

    document.getElementById('inventoryTableBody').innerHTML = renderInventoryTable(filtered);
}

