// Dashboard Module
function loadDashboard() {
    const mainContent = document.getElementById('main-content');

    const inventory = JSON.parse(localStorage.getItem('inventory') || '[]');
    const sales = JSON.parse(localStorage.getItem('sales') || '[]');
    const purchases = JSON.parse(localStorage.getItem('purchases') || '[]');
    const transactions = JSON.parse(localStorage.getItem('transactions') || '[]');
    const employees = JSON.parse(localStorage.getItem('employees') || '[]');

    // Calculate statistics
    const totalProducts = inventory.length;
    const totalSales = sales.reduce((sum, sale) => sum + (parseFloat(sale.total) || 0), 0);
    const totalPurchases = purchases.reduce((sum, purchase) => sum + (parseFloat(purchase.total) || 0), 0);
    const totalRevenue = totalSales;
    const totalExpenses = purchases.reduce((sum, purchase) => sum + (parseFloat(purchase.total) || 0), 0);
    const profit = totalRevenue - totalExpenses;
    const lowStockItems = inventory.filter(item => parseInt(item.quantity) < 10).length;

    mainContent.innerHTML = `
        <div class="fade-in">
            <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <h1 class="text-2xl sm:text-3xl font-bold">Dashboard</h1>
                <div class="flex gap-2 w-full sm:w-auto">
                    <button class="btn btn-sm btn-outline btn-primary flex-1 sm:flex-none" onclick="reloadDemoData()" title="Reload Demo Data">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        <span class="hidden sm:inline">Reload Data</span>
                        <span class="sm:hidden">Reload</span>
                    </button>
                    <button class="btn btn-sm btn-outline btn-primary flex-1 sm:flex-none" onclick="refreshDashboard()" title="Refresh Dashboard">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        <span class="hidden sm:inline">Refresh</span>
                        <span class="sm:hidden">↻</span>
                    </button>
                </div>
            </div>
            
            <!-- Statistics Cards -->
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div class="stat-card stat bg-base-100 shadow rounded-lg">
                    <div class="stat-figure text-primary">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="inline-block w-8 h-8 stroke-current">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
                        </svg>
                    </div>
                    <div class="stat-title">Total Products</div>
                    <div class="stat-value text-primary">${totalProducts}</div>
                    <div class="stat-desc">Items in inventory</div>
                </div>
                
                <div class="stat-card stat bg-base-100 shadow rounded-lg">
                    <div class="stat-figure text-success">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="inline-block w-8 h-8 stroke-current">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                    </div>
                    <div class="stat-title">Total Revenue</div>
                    <div class="stat-value text-success">${formatCurrency(totalRevenue)}</div>
                    <div class="stat-desc">From all sales</div>
                </div>
                
                <div class="stat-card stat bg-base-100 shadow rounded-lg">
                    <div class="stat-figure text-warning">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="inline-block w-8 h-8 stroke-current">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
                        </svg>
                    </div>
                    <div class="stat-title">Total Expenses</div>
                    <div class="stat-value text-warning">${formatCurrency(totalExpenses)}</div>
                    <div class="stat-desc">From purchases</div>
                </div>
                
                <div class="stat-card stat bg-base-100 shadow rounded-lg">
                    <div class="stat-figure text-info">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="inline-block w-8 h-8 stroke-current">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                        </svg>
                    </div>
                    <div class="stat-title">Net Profit</div>
                    <div class="stat-value text-info">${formatCurrency(profit)}</div>
                    <div class="stat-desc">Revenue - Expenses</div>
                </div>
            </div>
            
            <!-- Charts and Additional Stats -->
            <div class="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
                <!-- Sales Chart -->
                <div class="card bg-base-100 shadow">
                    <div class="card-body">
                        <div class="flex justify-between items-center mb-4">
                            <h2 class="card-title">Sales Overview</h2>
                            <div class="text-sm text-base-content/70">
                                <span class="font-semibold">Total: </span>
                                <span class="text-success">${formatCurrency(sales.reduce((sum, sale) => sum + (parseFloat(sale.total) || 0), 0))}</span>
                            </div>
                        </div>
                        <canvas id="salesChart"></canvas>
                        <div class="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                            <div class="text-center p-2 bg-base-200 rounded">
                                <div class="font-semibold text-primary">${sales.length}</div>
                                <div class="text-base-content/70">Total Orders</div>
                            </div>
                            <div class="text-center p-2 bg-base-200 rounded">
                                <div class="font-semibold text-success">${formatCurrency(sales.reduce((sum, sale) => sum + (parseFloat(sale.total) || 0), 0) / Math.max(sales.length, 1))}</div>
                                <div class="text-base-content/70">Avg Order</div>
                            </div>
                            <div class="text-center p-2 bg-base-200 rounded">
                                <div class="font-semibold text-info">${sales.length > 0 ? formatCurrency(Math.max(...sales.map(s => parseFloat(s.total) || 0))) : '$0.00'}</div>
                                <div class="text-base-content/70">Max Order</div>
                            </div>
                            <div class="text-center p-2 bg-base-200 rounded">
                                <div class="font-semibold text-warning">${getThisMonthSales(sales) > 0 ? formatCurrency(getThisMonthSales(sales)) : '$0.00'}</div>
                                <div class="text-base-content/70">This Month</div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Recent Activities -->
                <div class="card bg-base-100 shadow">
                    <div class="card-body">
                        <h2 class="card-title">Recent Activities</h2>
                        <div class="overflow-x-auto">
                            <table class="table table-zebra">
                                <thead>
                                    <tr>
                                        <th>Type</th>
                                        <th>Description</th>
                                        <th>Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${getRecentActivities().map(activity => `
                                        <tr>
                                            <td data-label="Type"><span class="badge badge-${activity.badge}">${activity.type}</span></td>
                                            <td data-label="Description">${activity.description}</td>
                                            <td data-label="Date">${formatDate(activity.date)}</td>
                                        </tr>
                                    `).join('')}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Alerts -->
            <div class="grid grid-cols-1 xl:grid-cols-2 gap-6">
                <div class="card bg-base-100 shadow">
                    <div class="card-body">
                        <h2 class="card-title text-warning">Low Stock Alert</h2>
                        <p class="text-2xl font-bold">${lowStockItems} items need restocking</p>
                        ${lowStockItems > 0 ? `
                            <div class="card-actions justify-end">
                                <button class="btn btn-warning btn-sm" onclick="loadPage('inventory')">View Inventory</button>
                            </div>
                        ` : '<p class="text-success">All items are well stocked!</p>'}
                    </div>
                </div>
                
                <div class="card bg-base-100 shadow">
                    <div class="card-body">
                        <h2 class="card-title">Quick Stats</h2>
                        <div class="stats stats-vertical shadow">
                            <div class="stat">
                                <div class="stat-title">Total Employees</div>
                                <div class="stat-value">${employees.length}</div>
                            </div>
                            <div class="stat">
                                <div class="stat-title">Total Sales Orders</div>
                                <div class="stat-value">${sales.length}</div>
                            </div>
                            <div class="stat">
                                <div class="stat-title">Total Purchase Orders</div>
                                <div class="stat-value">${purchases.length}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    // Initialize chart
    setTimeout(() => {
        initSalesChart(sales);
    }, 100);

    // Add number animation
    animateNumbers();
}

function refreshDashboard() {
    loadDashboard();
    showToast('Dashboard refreshed!');
}

function animateNumbers() {
    const statValues = document.querySelectorAll('.stat-value');
    statValues.forEach((stat, index) => {
        const originalText = stat.textContent;
        const isCurrency = originalText.includes('$');
        const number = parseFloat(originalText.replace(/[^0-9.]/g, ''));

        if (!isNaN(number) && number > 0) {
            stat.textContent = isCurrency ? '$0.00' : '0';
            setTimeout(() => {
                animateValue(stat, 0, number, 800, isCurrency);
            }, index * 100);
        }
    });
}

function animateValue(element, start, end, duration, isCurrency) {
    const range = end - start;
    const increment = range / (duration / 16);
    let current = start;

    const timer = setInterval(() => {
        current += increment;
        if ((increment > 0 && current >= end) || (increment < 0 && current <= end)) {
            current = end;
            clearInterval(timer);
        }

        if (isCurrency) {
            element.textContent = formatCurrency(current);
        } else {
            element.textContent = Math.floor(current).toLocaleString();
        }
    }, 16);
}

function getRecentActivities() {
    const sales = JSON.parse(localStorage.getItem('sales') || '[]');
    const purchases = JSON.parse(localStorage.getItem('purchases') || '[]');
    const inventory = JSON.parse(localStorage.getItem('inventory') || '[]');

    const activities = [
        ...sales.slice(-5).map(sale => ({
            type: 'Sale',
            description: `Sale #${sale.id} - ${formatCurrency(sale.total)}`,
            date: sale.date,
            badge: 'success'
        })),
        ...purchases.slice(-5).map(purchase => ({
            type: 'Purchase',
            description: `Purchase #${purchase.id} - ${formatCurrency(purchase.total)}`,
            date: purchase.date,
            badge: 'warning'
        })),
        ...inventory.slice(-3).map(item => ({
            type: 'Inventory',
            description: `Added: ${item.name}`,
            date: item.createdAt || new Date().toISOString(),
            badge: 'info'
        }))
    ];

    return activities.sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 10);
}

function getThisMonthSales(sales) {
    const now = new Date();
    const thisMonth = sales.filter(sale => {
        const saleDate = new Date(sale.date);
        return saleDate.getMonth() === now.getMonth() && saleDate.getFullYear() === now.getFullYear();
    });
    return thisMonth.reduce((sum, sale) => sum + (parseFloat(sale.total) || 0), 0);
}

function initSalesChart(sales) {
    const ctx = document.getElementById('salesChart');
    if (!ctx) return;

    // Group sales by date (last 7 days)
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        last7Days.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
    }

    const salesByDate = last7Days.map(date => {
        return sales.filter(sale => {
            const saleDate = new Date(sale.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            return saleDate === date;
        }).reduce((sum, sale) => sum + (parseFloat(sale.total) || 0), 0);
    });

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: last7Days,
            datasets: [{
                label: 'Sales ($)',
                data: salesByDate,
                borderColor: 'rgb(251, 146, 60)',
                backgroundColor: 'rgba(251, 146, 60, 0.1)',
                tension: 0.4,
                fill: true,
                pointRadius: 5,
                pointHoverRadius: 8,
                pointBackgroundColor: 'rgb(251, 146, 60)',
                pointBorderColor: '#fff',
                pointBorderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            interaction: {
                intersect: false,
                mode: 'index'
            },
            plugins: {
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    padding: 12,
                    titleFont: { size: 14, weight: 'bold' },
                    bodyFont: { size: 13 },
                    callbacks: {
                        label: function (context) {
                            return `Sales: ${formatCurrency(context.parsed.y)}`;
                        },
                        afterLabel: function (context) {
                            const date = context.label;
                            const daySales = sales.filter(sale => {
                                const saleDate = new Date(sale.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                                return saleDate === date;
                            });
                            if (daySales.length > 0) {
                                return `Orders: ${daySales.length}`;
                            }
                            return 'No orders';
                        }
                    }
                },
                legend: {
                    display: true,
                    position: 'top',
                    labels: {
                        font: { size: 12 },
                        padding: 15,
                        usePointStyle: true
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function (value) {
                            return '$' + value.toLocaleString();
                        },
                        font: { size: 11 }
                    },
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    }
                },
                x: {
                    ticks: {
                        font: { size: 11 }
                    },
                    grid: {
                        display: false
                    }
                }
            },
            onClick: (event, elements) => {
                if (elements.length > 0) {
                    const index = elements[0].index;
                    const date = last7Days[index];
                    const daySales = sales.filter(sale => {
                        const saleDate = new Date(sale.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                        return saleDate === date;
                    });
                    if (daySales.length > 0) {
                        loadPage('sales');
                        showToast(`Showing sales for ${date}`, 'success');
                    }
                }
            }
        }
    });
}

