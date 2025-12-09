// Main Application Controller
let currentPage = 'dashboard';

// Initialize app
document.addEventListener('DOMContentLoaded', async () => {
    await loadDemoData();
    initializeData();
    updateFooterYear();
    loadPage('dashboard');
});

// Load demo data from JSON file
async function loadDemoData() {
    // Check if data already exists
    const hasData = localStorage.getItem('inventory') &&
        JSON.parse(localStorage.getItem('inventory') || '[]').length > 0;

    if (hasData) {
        console.log('Data already exists in localStorage');
        return; // Data already loaded
    }

    try {
        const response = await fetch('demo-data.json');

        if (!response.ok) {
            throw new Error('Failed to fetch demo data');
        }

        const demoData = await response.json();

        // Load demo data into localStorage
        if (demoData.inventory && demoData.inventory.length > 0) {
            localStorage.setItem('inventory', JSON.stringify(demoData.inventory));
            console.log(`Loaded ${demoData.inventory.length} inventory items`);
        }
        if (demoData.sales && demoData.sales.length > 0) {
            localStorage.setItem('sales', JSON.stringify(demoData.sales));
            console.log(`Loaded ${demoData.sales.length} sales`);
        }
        if (demoData.purchases && demoData.purchases.length > 0) {
            localStorage.setItem('purchases', JSON.stringify(demoData.purchases));
            console.log(`Loaded ${demoData.purchases.length} purchases`);
        }
        if (demoData.transactions && demoData.transactions.length > 0) {
            localStorage.setItem('transactions', JSON.stringify(demoData.transactions));
            console.log(`Loaded ${demoData.transactions.length} transactions`);
        }
        if (demoData.employees && demoData.employees.length > 0) {
            localStorage.setItem('employees', JSON.stringify(demoData.employees));
            console.log(`Loaded ${demoData.employees.length} employees`);
        }
        if (demoData.suppliers && demoData.suppliers.length > 0) {
            localStorage.setItem('suppliers', JSON.stringify(demoData.suppliers));
            console.log(`Loaded ${demoData.suppliers.length} suppliers`);
        }
        if (demoData.customers && demoData.customers.length > 0) {
            localStorage.setItem('customers', JSON.stringify(demoData.customers));
            console.log(`Loaded ${demoData.customers.length} customers`);
        }

        console.log('✅ Demo data loaded successfully!');
        // Show notification after a short delay
        setTimeout(() => {
            showToast('Demo data loaded! Welcome to RootX Softwares ERP System', 'success');
        }, 500);
    } catch (error) {
        console.error('Error loading demo data:', error);
        // Try to load embedded data as fallback
        loadEmbeddedDemoData();
    }
}

// Fallback: Load embedded demo data if JSON file fails
function loadEmbeddedDemoData() {
    const embeddedData = getEmbeddedDemoData();

    if (embeddedData.inventory && embeddedData.inventory.length > 0) {
        localStorage.setItem('inventory', JSON.stringify(embeddedData.inventory));
    }
    if (embeddedData.sales && embeddedData.sales.length > 0) {
        localStorage.setItem('sales', JSON.stringify(embeddedData.sales));
    }
    if (embeddedData.purchases && embeddedData.purchases.length > 0) {
        localStorage.setItem('purchases', JSON.stringify(embeddedData.purchases));
    }
    if (embeddedData.transactions && embeddedData.transactions.length > 0) {
        localStorage.setItem('transactions', JSON.stringify(embeddedData.transactions));
    }
    if (embeddedData.employees && embeddedData.employees.length > 0) {
        localStorage.setItem('employees', JSON.stringify(embeddedData.employees));
    }
    if (embeddedData.suppliers && embeddedData.suppliers.length > 0) {
        localStorage.setItem('suppliers', JSON.stringify(embeddedData.suppliers));
    }
    if (embeddedData.customers && embeddedData.customers.length > 0) {
        localStorage.setItem('customers', JSON.stringify(embeddedData.customers));
    }

    console.log('✅ Embedded demo data loaded!');
    setTimeout(() => {
        showToast('Demo data loaded! Welcome to RootX Softwares ERP System', 'success');
    }, 500);
}

// Get embedded demo data (fallback)
function getEmbeddedDemoData() {
    return {
        "inventory": [
            { "id": "inv001", "name": "Laptop Dell XPS 15", "category": "Electronics", "quantity": 25, "price": 1299.99, "description": "High-performance laptop with 16GB RAM, 512GB SSD", "createdAt": "2024-01-15T10:30:00.000Z", "updatedAt": "2024-01-15T10:30:00.000Z" },
            { "id": "inv002", "name": "Wireless Mouse Logitech", "category": "Electronics", "quantity": 150, "price": 29.99, "description": "Ergonomic wireless mouse with long battery life", "createdAt": "2024-01-16T11:00:00.000Z", "updatedAt": "2024-01-16T11:00:00.000Z" },
            { "id": "inv003", "name": "Office Chair Ergonomic", "category": "Furniture", "quantity": 8, "price": 299.99, "description": "Comfortable ergonomic office chair with lumbar support", "createdAt": "2024-01-17T09:15:00.000Z", "updatedAt": "2024-01-17T09:15:00.000Z" },
            { "id": "inv004", "name": "Coffee Beans Premium", "category": "Food", "quantity": 45, "price": 24.99, "description": "Premium arabica coffee beans, 1kg pack", "createdAt": "2024-01-18T14:20:00.000Z", "updatedAt": "2024-01-18T14:20:00.000Z" },
            { "id": "inv005", "name": "T-Shirt Cotton Premium", "category": "Clothing", "quantity": 120, "price": 19.99, "description": "100% cotton premium t-shirt, various colors", "createdAt": "2024-01-19T10:45:00.000Z", "updatedAt": "2024-01-19T10:45:00.000Z" },
            { "id": "inv006", "name": "Monitor 27 inch 4K", "category": "Electronics", "quantity": 5, "price": 449.99, "description": "27-inch 4K UHD monitor with HDR support", "createdAt": "2024-01-20T13:30:00.000Z", "updatedAt": "2024-01-20T13:30:00.000Z" },
            { "id": "inv007", "name": "Desk Lamp LED", "category": "Furniture", "quantity": 30, "price": 39.99, "description": "Adjustable LED desk lamp with touch control", "createdAt": "2024-01-21T11:00:00.000Z", "updatedAt": "2024-01-21T11:00:00.000Z" },
            { "id": "inv008", "name": "Keyboard Mechanical", "category": "Electronics", "quantity": 12, "price": 89.99, "description": "Mechanical keyboard with RGB backlight", "createdAt": "2024-01-22T15:20:00.000Z", "updatedAt": "2024-01-22T15:20:00.000Z" }
        ],
        "sales": [
            { "id": "sale001", "customer": "Tech Solutions Inc", "date": "2024-01-25", "items": [{ "productId": "inv001", "name": "Laptop Dell XPS 15", "quantity": 2, "price": 1299.99 }, { "productId": "inv002", "name": "Wireless Mouse Logitech", "quantity": 5, "price": 29.99 }], "total": 2749.93, "createdAt": "2024-01-25T10:00:00.000Z" },
            { "id": "sale002", "customer": "Office Plus Ltd", "date": "2024-01-26", "items": [{ "productId": "inv003", "name": "Office Chair Ergonomic", "quantity": 3, "price": 299.99 }, { "productId": "inv007", "name": "Desk Lamp LED", "quantity": 10, "price": 39.99 }], "total": 1289.67, "createdAt": "2024-01-26T14:30:00.000Z" },
            { "id": "sale003", "customer": "Retail Store Chain", "date": "2024-01-27", "items": [{ "productId": "inv005", "name": "T-Shirt Cotton Premium", "quantity": 50, "price": 19.99 }, { "productId": "inv004", "name": "Coffee Beans Premium", "quantity": 20, "price": 24.99 }], "total": 1498.50, "createdAt": "2024-01-27T09:15:00.000Z" }
        ],
        "purchases": [
            { "id": "pur001", "supplier": "Global Electronics Supply", "date": "2024-01-20", "items": [{ "name": "Laptop Dell XPS 15", "quantity": 10, "price": 1100.00 }, { "name": "Monitor 27 inch 4K", "quantity": 5, "price": 380.00 }], "total": 12300.00, "createdAt": "2024-01-20T11:00:00.000Z" },
            { "id": "pur002", "supplier": "Furniture World", "date": "2024-01-22", "items": [{ "name": "Office Chair Ergonomic", "quantity": 5, "price": 250.00 }, { "name": "Desk Lamp LED", "quantity": 20, "price": 30.00 }], "total": 1850.00, "createdAt": "2024-01-22T13:45:00.000Z" },
            { "id": "pur003", "supplier": "Textile Importers", "date": "2024-01-24", "items": [{ "name": "T-Shirt Cotton Premium", "quantity": 100, "price": 15.00 }], "total": 1500.00, "createdAt": "2024-01-24T10:20:00.000Z" }
        ],
        "transactions": [
            { "id": "trans001", "type": "income", "category": "Sale", "description": "Sale to Tech Solutions Inc", "amount": 2749.93, "date": "2024-01-25", "createdAt": "2024-01-25T10:00:00.000Z" },
            { "id": "trans002", "type": "expense", "category": "Purchase", "description": "Purchase from Global Electronics Supply", "amount": 12300.00, "date": "2024-01-20", "createdAt": "2024-01-20T11:00:00.000Z" },
            { "id": "trans003", "type": "income", "category": "Sale", "description": "Sale to Office Plus Ltd", "amount": 1289.67, "date": "2024-01-26", "createdAt": "2024-01-26T14:30:00.000Z" },
            { "id": "trans004", "type": "expense", "category": "Salary", "description": "Monthly payroll - January", "amount": 15000.00, "date": "2024-01-31", "createdAt": "2024-01-31T09:00:00.000Z" },
            { "id": "trans005", "type": "expense", "category": "Rent", "description": "Office rent - January", "amount": 2500.00, "date": "2024-01-01", "createdAt": "2024-01-01T10:00:00.000Z" },
            { "id": "trans006", "type": "income", "category": "Sale", "description": "Sale to Retail Store Chain", "amount": 1498.50, "date": "2024-01-27", "createdAt": "2024-01-27T09:15:00.000Z" }
        ],
        "employees": [
            { "id": "emp001", "name": "John Smith", "email": "john.smith@rootxsoftwares.com", "phone": "+1-555-0101", "department": "IT", "position": "Senior Developer", "salary": 8500.00, "address": "123 Tech Street, Silicon Valley, CA 94000", "joinDate": "2023-01-15", "createdAt": "2023-01-15T09:00:00.000Z", "updatedAt": "2023-01-15T09:00:00.000Z" },
            { "id": "emp002", "name": "Sarah Johnson", "email": "sarah.johnson@rootxsoftwares.com", "phone": "+1-555-0102", "department": "Sales", "position": "Sales Manager", "salary": 7200.00, "address": "456 Business Ave, New York, NY 10001", "joinDate": "2023-02-01", "createdAt": "2023-02-01T09:00:00.000Z", "updatedAt": "2023-02-01T09:00:00.000Z" },
            { "id": "emp003", "name": "Michael Chen", "email": "michael.chen@rootxsoftwares.com", "phone": "+1-555-0103", "department": "IT", "position": "Full Stack Developer", "salary": 7800.00, "address": "789 Code Road, Seattle, WA 98101", "joinDate": "2023-03-10", "createdAt": "2023-03-10T09:00:00.000Z", "updatedAt": "2023-03-10T09:00:00.000Z" },
            { "id": "emp004", "name": "Emily Davis", "email": "emily.davis@rootxsoftwares.com", "phone": "+1-555-0104", "department": "HR", "position": "HR Manager", "salary": 6800.00, "address": "321 People Street, Boston, MA 02101", "joinDate": "2023-01-20", "createdAt": "2023-01-20T09:00:00.000Z", "updatedAt": "2023-01-20T09:00:00.000Z" },
            { "id": "emp005", "name": "David Wilson", "email": "david.wilson@rootxsoftwares.com", "phone": "+1-555-0105", "department": "Finance", "position": "Finance Manager", "salary": 7500.00, "address": "654 Money Lane, Chicago, IL 60601", "joinDate": "2023-02-15", "createdAt": "2023-02-15T09:00:00.000Z", "updatedAt": "2023-02-15T09:00:00.000Z" },
            { "id": "emp006", "name": "Lisa Anderson", "email": "lisa.anderson@rootxsoftwares.com", "phone": "+1-555-0106", "department": "Marketing", "position": "Marketing Specialist", "salary": 6200.00, "address": "987 Brand Blvd, Los Angeles, CA 90001", "joinDate": "2023-04-01", "createdAt": "2023-04-01T09:00:00.000Z", "updatedAt": "2023-04-01T09:00:00.000Z" },
            { "id": "emp007", "name": "Robert Taylor", "email": "robert.taylor@rootxsoftwares.com", "phone": "+1-555-0107", "department": "Operations", "position": "Operations Manager", "salary": 7000.00, "address": "147 Process Way, Dallas, TX 75201", "joinDate": "2023-03-01", "createdAt": "2023-03-01T09:00:00.000Z", "updatedAt": "2023-03-01T09:00:00.000Z" }
        ],
        "suppliers": [
            { "id": "sup001", "name": "Global Electronics Supply", "contact": "+1-555-2001", "email": "contact@globalelectronics.com", "address": "1000 Tech Park, San Jose, CA 95110", "createdAt": "2023-01-10T10:00:00.000Z" },
            { "id": "sup002", "name": "Furniture World", "contact": "+1-555-2002", "email": "sales@furnitureworld.com", "address": "2000 Design Street, Miami, FL 33101", "createdAt": "2023-01-12T10:00:00.000Z" },
            { "id": "sup003", "name": "Textile Importers", "contact": "+1-555-2003", "email": "info@textileimporters.com", "address": "3000 Fabric Avenue, Atlanta, GA 30301", "createdAt": "2023-01-14T10:00:00.000Z" }
        ],
        "customers": [
            { "id": "cust001", "name": "Tech Solutions Inc", "email": "orders@techsolutions.com", "phone": "+1-555-3001", "address": "500 Innovation Drive, Austin, TX 78701" },
            { "id": "cust002", "name": "Office Plus Ltd", "email": "purchasing@officeplus.com", "phone": "+1-555-3002", "address": "600 Corporate Blvd, Denver, CO 80201" },
            { "id": "cust003", "name": "Retail Store Chain", "email": "buying@retailchain.com", "phone": "+1-555-3003", "address": "700 Commerce Street, Phoenix, AZ 85001" }
        ]
    };
}

// Initialize default data in localStorage
function initializeData() {
    if (!localStorage.getItem('inventory')) {
        localStorage.setItem('inventory', JSON.stringify([]));
    }
    if (!localStorage.getItem('sales')) {
        localStorage.setItem('sales', JSON.stringify([]));
    }
    if (!localStorage.getItem('purchases')) {
        localStorage.setItem('purchases', JSON.stringify([]));
    }
    if (!localStorage.getItem('transactions')) {
        localStorage.setItem('transactions', JSON.stringify([]));
    }
    if (!localStorage.getItem('employees')) {
        localStorage.setItem('employees', JSON.stringify([]));
    }
    if (!localStorage.getItem('suppliers')) {
        localStorage.setItem('suppliers', JSON.stringify([]));
    }
    if (!localStorage.getItem('customers')) {
        localStorage.setItem('customers', JSON.stringify([]));
    }
}

// Update footer year
function updateFooterYear() {
    const footerYear = document.querySelector('.footer-year');
    if (footerYear) {
        footerYear.textContent = new Date().getFullYear();
    }
}

// Reload demo data (clear and reload)
async function reloadDemoData() {
    if (confirm('This will clear all current data and reload demo data. Continue?')) {
        // Clear all localStorage
        localStorage.removeItem('inventory');
        localStorage.removeItem('sales');
        localStorage.removeItem('purchases');
        localStorage.removeItem('transactions');
        localStorage.removeItem('employees');
        localStorage.removeItem('suppliers');
        localStorage.removeItem('customers');

        // Reload demo data
        await loadDemoData();

        // Reload current page
        loadPage(currentPage);

        showToast('Demo data reloaded successfully!', 'success');
    }
}

// Page loader with loading animation
function loadPage(page) {
    currentPage = page;
    updateActiveMenu();

    const mainContent = document.getElementById('main-content');

    // Show loading state
    mainContent.innerHTML = `
        <div class="flex items-center justify-center min-h-[400px]">
            <div class="text-center">
                <span class="loading loading-spinner loading-lg text-primary"></span>
                <p class="mt-4 text-base-content/70">Loading...</p>
            </div>
        </div>
    `;

    // Load page content with slight delay for smooth transition
    setTimeout(() => {
        switch (page) {
            case 'dashboard':
                loadDashboard();
                break;
            case 'inventory':
                loadInventory();
                break;
            case 'sales':
                loadSales();
                break;
            case 'purchase':
                loadPurchase();
                break;
            case 'accounting':
                loadAccounting();
                break;
            case 'hr':
                loadHR();
                break;
            case 'reports':
                loadReports();
                break;
            default:
                loadDashboard();
        }
    }, 150);
}

// Update active menu
function updateActiveMenu() {
    document.querySelectorAll('.menu a').forEach(link => {
        link.classList.remove('active-menu');
    });
    const activeMenu = document.getElementById(`menu-${currentPage}`);
    if (activeMenu) {
        activeMenu.classList.add('active-menu');
    }
}

// Utility functions
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(amount);
}

function formatDate(date) {
    return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `alert alert-${type === 'success' ? 'success' : 'error'} fixed top-4 right-4 z-50 w-auto min-w-[300px] shadow-lg animate-slide-in`;
    toast.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
            ${type === 'success' ?
            '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />' :
            '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />'
        }
        </svg>
        <span>${message}</span>
    `;
    document.body.appendChild(toast);

    setTimeout(() => {
        toast.style.animation = 'slide-out 0.3s ease-out';
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, 3000);
}

