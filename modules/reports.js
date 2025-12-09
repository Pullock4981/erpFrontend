// Reports Module
function loadReports() {
    const mainContent = document.getElementById('main-content');
    const sales = JSON.parse(localStorage.getItem('sales') || '[]');
    const purchases = JSON.parse(localStorage.getItem('purchases') || '[]');
    const transactions = JSON.parse(localStorage.getItem('transactions') || '[]');
    const inventory = JSON.parse(localStorage.getItem('inventory') || '[]');
    const employees = JSON.parse(localStorage.getItem('employees') || '[]');

    // Calculate metrics
    const totalRevenue = sales.reduce((sum, sale) => sum + (parseFloat(sale.total) || 0), 0);
    const totalExpenses = purchases.reduce((sum, purchase) => sum + (parseFloat(purchase.total) || 0), 0);
    const netProfit = totalRevenue - totalExpenses;
    const totalInventoryValue = inventory.reduce((sum, item) => sum + (parseFloat(item.quantity) * parseFloat(item.price)), 0);

    // Monthly data
    const monthlyData = getMonthlyData(sales, purchases);

    mainContent.innerHTML = `
        <div class="fade-in">
            <h1 class="text-2xl sm:text-3xl font-bold mb-6">Reports & Analytics</h1>
            
            <!-- Key Metrics -->
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div class="stat bg-base-100 shadow rounded-lg">
                    <div class="stat-title">Total Revenue</div>
                    <div class="stat-value text-success">${formatCurrency(totalRevenue)}</div>
                    <div class="stat-desc">From all sales</div>
                </div>
                <div class="stat bg-base-100 shadow rounded-lg">
                    <div class="stat-title">Total Expenses</div>
                    <div class="stat-value text-error">${formatCurrency(totalExpenses)}</div>
                    <div class="stat-desc">From all purchases</div>
                </div>
                <div class="stat bg-base-100 shadow rounded-lg">
                    <div class="stat-title">Net Profit</div>
                    <div class="stat-value ${netProfit >= 0 ? 'text-success' : 'text-error'}">${formatCurrency(netProfit)}</div>
                    <div class="stat-desc">Revenue - Expenses</div>
                </div>
                <div class="stat bg-base-100 shadow rounded-lg">
                    <div class="stat-title">Inventory Value</div>
                    <div class="stat-value text-info">${formatCurrency(totalInventoryValue)}</div>
                    <div class="stat-desc">Total stock value</div>
                </div>
            </div>
            
            <!-- Charts -->
            <div class="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
                <div class="card bg-base-100 shadow">
                    <div class="card-body">
                        <div class="flex justify-between items-center mb-4">
                            <h2 class="card-title">Monthly Revenue vs Expenses</h2>
                            <div class="text-sm">
                                <span class="badge badge-success mr-2">Revenue</span>
                                <span class="badge badge-error">Expenses</span>
                            </div>
                        </div>
                        <canvas id="monthlyChart"></canvas>
                        <div class="mt-4 grid grid-cols-3 gap-2 text-xs">
                            <div class="text-center p-2 bg-base-200 rounded">
                                <div class="font-semibold text-success">${formatCurrency(monthlyData.reduce((sum, m) => sum + m.revenue, 0))}</div>
                                <div class="text-base-content/70">Total Revenue</div>
                            </div>
                            <div class="text-center p-2 bg-base-200 rounded">
                                <div class="font-semibold text-error">${formatCurrency(monthlyData.reduce((sum, m) => sum + m.expenses, 0))}</div>
                                <div class="text-base-content/70">Total Expenses</div>
                            </div>
                            <div class="text-center p-2 bg-base-200 rounded">
                                <div class="font-semibold text-info">${formatCurrency(monthlyData.reduce((sum, m) => sum + m.revenue - m.expenses, 0))}</div>
                                <div class="text-base-content/70">Net Profit</div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="card bg-base-100 shadow">
                    <div class="card-body">
                        <div class="flex justify-between items-center mb-4">
                            <h2 class="card-title">Sales by Category</h2>
                            <div class="text-sm text-base-content/70">
                                <span class="font-semibold">Total: </span>
                                <span class="text-success">${formatCurrency(Object.values(getCategorySalesData(sales)).reduce((a, b) => a + b, 0))}</span>
                            </div>
                        </div>
                        <canvas id="categoryChart"></canvas>
                        <div class="mt-4 text-xs">
                            <div class="font-semibold mb-2">Category Breakdown:</div>
                            <div class="space-y-1">
                                ${Object.entries(getCategorySalesData(sales)).map(([cat, val]) => {
        const percentage = Object.values(getCategorySalesData(sales)).reduce((a, b) => a + b, 0) > 0 ?
            ((val / Object.values(getCategorySalesData(sales)).reduce((a, b) => a + b, 0)) * 100).toFixed(1) : 0;
        return `<div class="flex justify-between items-center p-1 bg-base-200 rounded">
                                        <span>${cat}</span>
                                        <span class="font-semibold">${formatCurrency(val)} (${percentage}%)</span>
                                    </div>`;
    }).join('')}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Detailed Reports -->
            <div class="grid grid-cols-1 xl:grid-cols-2 gap-6">
                <!-- Top Products -->
                <div class="card bg-base-100 shadow">
                    <div class="card-body">
                        <h2 class="card-title">Top Selling Products</h2>
                        <div class="overflow-x-auto">
                            <table class="table table-zebra">
                                <thead>
                                    <tr>
                                        <th>Product</th>
                                        <th>Quantity Sold</th>
                                        <th>Revenue</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${getTopProducts(sales).map(product => `
                                        <tr>
                                            <td data-label="Product" class="font-semibold">${product.name}</td>
                                            <td data-label="Quantity Sold">${product.quantity}</td>
                                            <td data-label="Revenue">${formatCurrency(product.revenue)}</td>
                                        </tr>
                                    `).join('')}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                
                <!-- Department Distribution -->
                <div class="card bg-base-100 shadow">
                    <div class="card-body">
                        <h2 class="card-title">Employee Distribution</h2>
                        <div class="overflow-x-auto">
                            <table class="table table-zebra">
                                <thead>
                                    <tr>
                                        <th>Department</th>
                                        <th>Employees</th>
                                        <th>Total Salary</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${getDepartmentStats(employees).map(dept => `
                                        <tr>
                                            <td data-label="Department" class="font-semibold">${dept.department}</td>
                                            <td data-label="Employees">${dept.count}</td>
                                            <td data-label="Total Salary">${formatCurrency(dept.totalSalary)}</td>
                                        </tr>
                                    `).join('')}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Financial Summary -->
            <div class="card bg-base-100 shadow mt-6">
                <div class="card-body">
                    <h2 class="card-title">Financial Summary</h2>
                    <div class="overflow-x-auto">
                        <table class="table table-zebra">
                            <thead>
                                <tr>
                                    <th>Period</th>
                                    <th>Revenue</th>
                                    <th>Expenses</th>
                                    <th>Profit</th>
                                    <th>Profit Margin</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${getFinancialSummary(sales, purchases).map(period => `
                                    <tr>
                                        <td class="font-semibold">${period.period}</td>
                                        <td class="text-success">${formatCurrency(period.revenue)}</td>
                                        <td class="text-error">${formatCurrency(period.expenses)}</td>
                                        <td class="${period.profit >= 0 ? 'text-success' : 'text-error'}">${formatCurrency(period.profit)}</td>
                                        <td>${period.margin}%</td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    `;

    // Initialize charts
    setTimeout(() => {
        initMonthlyChart(monthlyData);
        initCategoryChart(sales);
    }, 100);
}

function getMonthlyData(sales, purchases) {
    const months = [];
    const now = new Date();

    for (let i = 5; i >= 0; i--) {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
        months.push({
            month: date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
            revenue: 0,
            expenses: 0
        });
    }

    sales.forEach(sale => {
        const saleDate = new Date(sale.date);
        const monthIndex = months.findIndex(m => {
            const monthDate = new Date(m.month);
            return saleDate.getMonth() === monthDate.getMonth() &&
                saleDate.getFullYear() === monthDate.getFullYear();
        });
        if (monthIndex !== -1) {
            months[monthIndex].revenue += parseFloat(sale.total) || 0;
        }
    });

    purchases.forEach(purchase => {
        const purchaseDate = new Date(purchase.date);
        const monthIndex = months.findIndex(m => {
            const monthDate = new Date(m.month);
            return purchaseDate.getMonth() === monthDate.getMonth() &&
                purchaseDate.getFullYear() === monthDate.getFullYear();
        });
        if (monthIndex !== -1) {
            months[monthIndex].expenses += parseFloat(purchase.total) || 0;
        }
    });

    return months;
}

function initMonthlyChart(data) {
    const ctx = document.getElementById('monthlyChart');
    if (!ctx) return;

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: data.map(d => d.month),
            datasets: [{
                label: 'Revenue',
                data: data.map(d => d.revenue),
                backgroundColor: 'rgba(34, 197, 94, 0.7)',
                borderColor: 'rgb(34, 197, 94)',
                borderWidth: 2,
                borderRadius: 4
            }, {
                label: 'Expenses',
                data: data.map(d => d.expenses),
                backgroundColor: 'rgba(239, 68, 68, 0.7)',
                borderColor: 'rgb(239, 68, 68)',
                borderWidth: 2,
                borderRadius: 4
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
                            const value = context.parsed.y;
                            const label = context.dataset.label;
                            const profit = context.datasetIndex === 0 ?
                                value - data[context.dataIndex].expenses :
                                data[context.dataIndex].revenue - value;
                            return [
                                `${label}: ${formatCurrency(value)}`,
                                `Net: ${formatCurrency(profit)}`
                            ];
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
                },
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
                    const monthData = data[index];
                    alert(`Month: ${monthData.month}\nRevenue: ${formatCurrency(monthData.revenue)}\nExpenses: ${formatCurrency(monthData.expenses)}\nProfit: ${formatCurrency(monthData.revenue - monthData.expenses)}`);
                }
            }
        }
    });
}

function getCategorySalesData(sales) {
    const categoryData = {};
    sales.forEach(sale => {
        sale.items.forEach(item => {
            const inventory = JSON.parse(localStorage.getItem('inventory') || '[]');
            const product = inventory.find(p => p.id === item.productId);
            const category = product?.category || 'Other';
            if (!categoryData[category]) {
                categoryData[category] = 0;
            }
            categoryData[category] += parseFloat(item.price) * parseInt(item.quantity);
        });
    });
    return categoryData;
}

function initCategoryChart(sales) {
    const ctx = document.getElementById('categoryChart');
    if (!ctx) return;

    const categoryData = getCategorySalesData(sales);

    const categoryLabels = Object.keys(categoryData);
    const categoryValues = Object.values(categoryData);
    const totalSales = categoryValues.reduce((a, b) => a + b, 0);

    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: categoryLabels,
            datasets: [{
                data: categoryValues,
                backgroundColor: [
                    'rgba(251, 146, 60, 0.9)',
                    'rgba(59, 130, 246, 0.9)',
                    'rgba(34, 197, 94, 0.9)',
                    'rgba(168, 85, 247, 0.9)',
                    'rgba(236, 72, 153, 0.9)',
                    'rgba(239, 68, 68, 0.9)'
                ],
                borderColor: '#fff',
                borderWidth: 2,
                hoverOffset: 10
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    padding: 12,
                    titleFont: { size: 14, weight: 'bold' },
                    bodyFont: { size: 13 },
                    callbacks: {
                        label: function (context) {
                            const label = context.label || '';
                            const value = context.parsed || 0;
                            const percentage = totalSales > 0 ? ((value / totalSales) * 100).toFixed(1) : 0;
                            return [
                                `${label}: ${formatCurrency(value)}`,
                                `Percentage: ${percentage}%`
                            ];
                        }
                    }
                },
                legend: {
                    display: true,
                    position: 'right',
                    labels: {
                        font: { size: 12 },
                        padding: 12,
                        usePointStyle: true,
                        generateLabels: function (chart) {
                            const data = chart.data;
                            if (data.labels.length && data.datasets.length) {
                                return data.labels.map((label, i) => {
                                    const value = data.datasets[0].data[i];
                                    const percentage = totalSales > 0 ? ((value / totalSales) * 100).toFixed(1) : 0;
                                    return {
                                        text: `${label} (${percentage}%)`,
                                        fillStyle: data.datasets[0].backgroundColor[i],
                                        strokeStyle: data.datasets[0].borderColor,
                                        lineWidth: data.datasets[0].borderWidth,
                                        hidden: false,
                                        index: i
                                    };
                                });
                            }
                            return [];
                        }
                    }
                }
            },
            onClick: (event, elements) => {
                if (elements.length > 0) {
                    const index = elements[0].index;
                    const category = categoryLabels[index];
                    const value = categoryValues[index];
                    const percentage = totalSales > 0 ? ((value / totalSales) * 100).toFixed(1) : 0;
                    alert(`Category: ${category}\nSales: ${formatCurrency(value)}\nPercentage: ${percentage}%`);
                }
            }
        }
    });
}

function getTopProducts(sales) {
    const productSales = {};

    sales.forEach(sale => {
        sale.items.forEach(item => {
            if (!productSales[item.name]) {
                productSales[item.name] = {
                    name: item.name,
                    quantity: 0,
                    revenue: 0
                };
            }
            productSales[item.name].quantity += parseInt(item.quantity);
            productSales[item.name].revenue += parseFloat(item.price) * parseInt(item.quantity);
        });
    });

    return Object.values(productSales)
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 5);
}

function getDepartmentStats(employees) {
    const deptStats = {};

    employees.forEach(emp => {
        if (!deptStats[emp.department]) {
            deptStats[emp.department] = {
                department: emp.department,
                count: 0,
                totalSalary: 0
            };
        }
        deptStats[emp.department].count++;
        deptStats[emp.department].totalSalary += parseFloat(emp.salary) || 0;
    });

    return Object.values(deptStats).sort((a, b) => b.count - a.count);
}

function getFinancialSummary(sales, purchases) {
    const now = new Date();
    const summary = [];

    // This Month
    const thisMonthSales = sales.filter(s => {
        const d = new Date(s.date);
        return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    });
    const thisMonthPurchases = purchases.filter(p => {
        const d = new Date(p.date);
        return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    });
    const thisMonthRevenue = thisMonthSales.reduce((sum, s) => sum + (parseFloat(s.total) || 0), 0);
    const thisMonthExpenses = thisMonthPurchases.reduce((sum, p) => sum + (parseFloat(p.total) || 0), 0);

    summary.push({
        period: 'This Month',
        revenue: thisMonthRevenue,
        expenses: thisMonthExpenses,
        profit: thisMonthRevenue - thisMonthExpenses,
        margin: thisMonthRevenue > 0 ? ((thisMonthRevenue - thisMonthExpenses) / thisMonthRevenue * 100).toFixed(2) : 0
    });

    // Last Month
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastMonthSales = sales.filter(s => {
        const d = new Date(s.date);
        return d.getMonth() === lastMonth.getMonth() && d.getFullYear() === lastMonth.getFullYear();
    });
    const lastMonthPurchases = purchases.filter(p => {
        const d = new Date(p.date);
        return d.getMonth() === lastMonth.getMonth() && d.getFullYear() === lastMonth.getFullYear();
    });
    const lastMonthRevenue = lastMonthSales.reduce((sum, s) => sum + (parseFloat(s.total) || 0), 0);
    const lastMonthExpenses = lastMonthPurchases.reduce((sum, p) => sum + (parseFloat(p.total) || 0), 0);

    summary.push({
        period: 'Last Month',
        revenue: lastMonthRevenue,
        expenses: lastMonthExpenses,
        profit: lastMonthRevenue - lastMonthExpenses,
        margin: lastMonthRevenue > 0 ? ((lastMonthRevenue - lastMonthExpenses) / lastMonthRevenue * 100).toFixed(2) : 0
    });

    // All Time
    const allTimeRevenue = sales.reduce((sum, s) => sum + (parseFloat(s.total) || 0), 0);
    const allTimeExpenses = purchases.reduce((sum, p) => sum + (parseFloat(p.total) || 0), 0);

    summary.push({
        period: 'All Time',
        revenue: allTimeRevenue,
        expenses: allTimeExpenses,
        profit: allTimeRevenue - allTimeExpenses,
        margin: allTimeRevenue > 0 ? ((allTimeRevenue - allTimeExpenses) / allTimeRevenue * 100).toFixed(2) : 0
    });

    return summary;
}

