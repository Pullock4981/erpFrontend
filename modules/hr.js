// HR Management Module
function loadHR() {
    const mainContent = document.getElementById('main-content');
    const employees = JSON.parse(localStorage.getItem('employees') || '[]');

    mainContent.innerHTML = `
        <div class="fade-in">
            <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <h1 class="text-2xl sm:text-3xl font-bold">HR Management</h1>
                <button class="btn btn-primary btn-sm sm:btn-md w-full sm:w-auto" onclick="openAddEmployeeModal()">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                    </svg>
                    <span class="hidden sm:inline">Add Employee</span>
                    <span class="sm:hidden">Add</span>
                </button>
            </div>
            
            <!-- HR Summary -->
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div class="stat bg-base-100 shadow rounded-lg">
                    <div class="stat-title">Total Employees</div>
                    <div class="stat-value text-primary">${employees.length}</div>
                    <div class="stat-desc">Active staff</div>
                </div>
                <div class="stat bg-base-100 shadow rounded-lg">
                    <div class="stat-title">Total Salary</div>
                    <div class="stat-value text-warning">${formatCurrency(employees.reduce((sum, e) => sum + (parseFloat(e.salary) || 0), 0))}</div>
                    <div class="stat-desc">Monthly payroll</div>
                </div>
                <div class="stat bg-base-100 shadow rounded-lg">
                    <div class="stat-title">Departments</div>
                    <div class="stat-value text-info">${new Set(employees.map(e => e.department)).size}</div>
                    <div class="stat-desc">Active departments</div>
                </div>
                <div class="stat bg-base-100 shadow rounded-lg">
                    <div class="stat-title">Avg. Salary</div>
                    <div class="stat-value text-success">${employees.length > 0 ? formatCurrency(employees.reduce((sum, e) => sum + (parseFloat(e.salary) || 0), 0) / employees.length) : '$0.00'}</div>
                    <div class="stat-desc">Per employee</div>
                </div>
            </div>
            
            <!-- Search and Filter -->
            <div class="card bg-base-100 shadow mb-6">
                <div class="card-body">
                    <div class="flex flex-col md:flex-row gap-4">
                        <input type="text" id="searchEmployee" placeholder="Search employees..." class="input input-bordered flex-1" onkeyup="filterEmployees()">
                        <select class="select select-bordered" id="filterDepartment" onchange="filterEmployees()">
                            <option value="">All Departments</option>
                            <option value="Sales">Sales</option>
                            <option value="IT">IT</option>
                            <option value="HR">HR</option>
                            <option value="Finance">Finance</option>
                            <option value="Operations">Operations</option>
                            <option value="Marketing">Marketing</option>
                        </select>
                    </div>
                </div>
            </div>
            
            <!-- Employees Table -->
            <div class="card bg-base-100 shadow">
                <div class="card-body">
                    <div class="overflow-x-auto">
                        <table class="table table-zebra">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Phone</th>
                                    <th>Department</th>
                                    <th>Position</th>
                                    <th>Salary</th>
                                    <th>Join Date</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody id="employeesTableBody">
                                ${renderEmployeesTable(employees)}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- Add/Edit Employee Modal -->
        <dialog id="employeeModal" class="modal">
            <div class="modal-box w-11/12 max-w-2xl max-h-[90vh] overflow-y-auto">
                <h3 class="font-bold text-lg mb-4" id="employeeModalTitle">Add Employee</h3>
                <form id="employeeForm" onsubmit="saveEmployee(event)">
                    <input type="hidden" id="employeeId">
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div class="form-control">
                            <label class="label">
                                <span class="label-text">Full Name</span>
                            </label>
                            <input type="text" id="employeeName" class="input input-bordered" required>
                        </div>
                        <div class="form-control">
                            <label class="label">
                                <span class="label-text">Email</span>
                            </label>
                            <input type="email" id="employeeEmail" class="input input-bordered" required>
                        </div>
                        <div class="form-control">
                            <label class="label">
                                <span class="label-text">Phone</span>
                            </label>
                            <input type="tel" id="employeePhone" class="input input-bordered" required>
                        </div>
                        <div class="form-control">
                            <label class="label">
                                <span class="label-text">Department</span>
                            </label>
                            <select id="employeeDepartment" class="select select-bordered" required>
                                <option value="">Select Department</option>
                                <option value="Sales">Sales</option>
                                <option value="IT">IT</option>
                                <option value="HR">HR</option>
                                <option value="Finance">Finance</option>
                                <option value="Operations">Operations</option>
                                <option value="Marketing">Marketing</option>
                            </select>
                        </div>
                        <div class="form-control">
                            <label class="label">
                                <span class="label-text">Position</span>
                            </label>
                            <input type="text" id="employeePosition" class="input input-bordered" required>
                        </div>
                        <div class="form-control">
                            <label class="label">
                                <span class="label-text">Salary ($)</span>
                            </label>
                            <input type="number" id="employeeSalary" class="input input-bordered" min="0" step="0.01" required>
                        </div>
                        <div class="form-control md:col-span-2">
                            <label class="label">
                                <span class="label-text">Address</span>
                            </label>
                            <textarea id="employeeAddress" class="textarea textarea-bordered" rows="2"></textarea>
                        </div>
                        <div class="form-control">
                            <label class="label">
                                <span class="label-text">Join Date</span>
                            </label>
                            <input type="date" id="employeeJoinDate" class="input input-bordered" required>
                        </div>
                    </div>
                    <div class="modal-action">
                        <button type="button" class="btn" onclick="closeEmployeeModal()">Cancel</button>
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

function renderEmployeesTable(employees) {
    if (employees.length === 0) {
        return '<tr><td colspan="9" class="text-center">No employees found. Add your first employee!</td></tr>';
    }

    return employees.map(employee => `
        <tr>
            <td data-label="ID" class="font-mono">${employee.id.substring(0, 8)}</td>
            <td data-label="Name" class="font-semibold">${employee.name}</td>
            <td data-label="Email">${employee.email}</td>
            <td data-label="Phone">${employee.phone}</td>
            <td data-label="Department"><span class="badge badge-outline">${employee.department}</span></td>
            <td data-label="Position">${employee.position}</td>
            <td data-label="Salary">${formatCurrency(employee.salary)}</td>
            <td data-label="Join Date">${formatDate(employee.joinDate)}</td>
            <td data-label="Actions">
                <div class="flex flex-col sm:flex-row gap-1 sm:gap-2">
                    <button class="btn btn-xs sm:btn-sm btn-info w-full sm:w-auto" onclick="editEmployee('${employee.id}')">Edit</button>
                    <button class="btn btn-xs sm:btn-sm btn-error w-full sm:w-auto" onclick="deleteEmployee('${employee.id}')">Delete</button>
                </div>
            </td>
        </tr>
    `).join('');
}

function openAddEmployeeModal() {
    document.getElementById('employeeModalTitle').textContent = 'Add Employee';
    document.getElementById('employeeForm').reset();
    document.getElementById('employeeId').value = '';
    document.getElementById('employeeJoinDate').value = new Date().toISOString().split('T')[0];
    document.getElementById('employeeModal').showModal();
}

function closeEmployeeModal() {
    document.getElementById('employeeModal').close();
}

function editEmployee(id) {
    const employees = JSON.parse(localStorage.getItem('employees') || '[]');
    const employee = employees.find(e => e.id === id);

    if (employee) {
        document.getElementById('employeeModalTitle').textContent = 'Edit Employee';
        document.getElementById('employeeId').value = employee.id;
        document.getElementById('employeeName').value = employee.name;
        document.getElementById('employeeEmail').value = employee.email;
        document.getElementById('employeePhone').value = employee.phone;
        document.getElementById('employeeDepartment').value = employee.department;
        document.getElementById('employeePosition').value = employee.position;
        document.getElementById('employeeSalary').value = employee.salary;
        document.getElementById('employeeAddress').value = employee.address || '';
        document.getElementById('employeeJoinDate').value = employee.joinDate;
        document.getElementById('employeeModal').showModal();
    }
}

function saveEmployee(event) {
    event.preventDefault();

    const employees = JSON.parse(localStorage.getItem('employees') || '[]');
    const employeeId = document.getElementById('employeeId').value;

    const employee = {
        id: employeeId || generateId(),
        name: document.getElementById('employeeName').value,
        email: document.getElementById('employeeEmail').value,
        phone: document.getElementById('employeePhone').value,
        department: document.getElementById('employeeDepartment').value,
        position: document.getElementById('employeePosition').value,
        salary: parseFloat(document.getElementById('employeeSalary').value),
        address: document.getElementById('employeeAddress').value,
        joinDate: document.getElementById('employeeJoinDate').value,
        createdAt: employeeId ? employees.find(e => e.id === employeeId)?.createdAt : new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };

    if (employeeId) {
        const index = employees.findIndex(e => e.id === employeeId);
        if (index !== -1) {
            employees[index] = employee;
        }
    } else {
        employees.push(employee);
    }

    localStorage.setItem('employees', JSON.stringify(employees));
    showToast(employeeId ? 'Employee updated successfully!' : 'Employee added successfully!');
    closeEmployeeModal();
    loadHR();
}

function deleteEmployee(id) {
    if (confirm('Are you sure you want to delete this employee?')) {
        const employees = JSON.parse(localStorage.getItem('employees') || '[]');
        const filtered = employees.filter(e => e.id !== id);
        localStorage.setItem('employees', JSON.stringify(filtered));
        showToast('Employee deleted successfully!');
        loadHR();
    }
}

function filterEmployees() {
    const searchTerm = document.getElementById('searchEmployee').value.toLowerCase();
    const departmentFilter = document.getElementById('filterDepartment').value;
    const employees = JSON.parse(localStorage.getItem('employees') || '[]');

    const filtered = employees.filter(employee => {
        const matchesSearch = employee.name.toLowerCase().includes(searchTerm) ||
            employee.email.toLowerCase().includes(searchTerm) ||
            employee.position.toLowerCase().includes(searchTerm);
        const matchesDepartment = !departmentFilter || employee.department === departmentFilter;
        return matchesSearch && matchesDepartment;
    });

    document.getElementById('employeesTableBody').innerHTML = renderEmployeesTable(filtered);
}

