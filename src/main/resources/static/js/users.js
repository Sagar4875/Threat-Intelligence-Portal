// ==========================================
// Threat Intelligence Portal
// User Management Module
// ==========================================

// Backend API URL
const API_URL = "http://localhost:8080/api/users";

// ==========================================
// Form Elements
// ==========================================

const userForm = document.getElementById("userForm");

const userId = document.getElementById("userId");

const fullName = document.getElementById("fullName");

const email = document.getElementById("email");

const password = document.getElementById("password");

const role = document.getElementById("role");

const status = document.getElementById("status"); // Keep this only if User.java has a status field
// ==========================================
// Buttons
// ==========================================

const saveBtn = document.getElementById("saveBtn");

const updateBtn = document.getElementById("updateBtn");

const clearBtn = document.getElementById("clearBtn");

// ==========================================
// Search & Filters
// ==========================================

const searchUser = document.getElementById("searchUser");

const roleFilter = document.getElementById("roleFilter");

const statusFilter = document.getElementById("statusFilter");

// ==========================================
// Table
// ==========================================

const userTableBody = document.getElementById("userTableBody");

// ==========================================
// Dashboard Cards
// ==========================================

const totalUsers = document.getElementById("totalUsers");

const adminUsers = document.getElementById("adminUsers");

const analystUsers = document.getElementById("analystUsers");

const activeUsers = document.getElementById("activeUsers");

// ==========================================
// Summary Cards
// ==========================================

const latestUser = document.getElementById("latestUser");

const adminRatio = document.getElementById("adminRatio");

const analystRatio = document.getElementById("analystRatio");

const systemUsage = document.getElementById("systemUsage");

// ==========================================
// Statistics
// ==========================================

const statTotalUsers = document.getElementById("statTotalUsers");

const statAdmins = document.getElementById("statAdmins");

const statAnalysts = document.getElementById("statAnalysts");

const statActiveUsers = document.getElementById("statActiveUsers");

// ==========================================
// Global Variables
// ==========================================

let users = [];

let filteredUsers = [];

let editMode = false;

// ==========================================
// Utility Functions
// ==========================================

function showSuccess(message) {

    alert(message);

}

function showError(message) {

    alert(message);

}

// ==========================================
// Reset Form
// ==========================================

function resetForm() {

    userForm.reset();

    userId.value = "";

    editMode = false;

    saveBtn.disabled = false;

    updateBtn.disabled = true;

}

// ==========================================
// Initialize
// ==========================================

updateBtn.disabled = true;
// ==========================================
// Load All Users
// ==========================================

async function loadUsers() {

    try {

        const response = await apiFetch(API_URL);
        if (!response.ok) {

            throw new Error("Failed to load users.");

        }

        users = await response.json();

        filteredUsers = [...users];

        renderUserTable(filteredUsers);

        updateDashboardCards();

    } catch (error) {

        console.error(error);

        showError("Unable to load users.");

    }

}

// ==========================================
// Render User Table
// ==========================================

function renderUserTable(userList) {

    userTableBody.innerHTML = "";

    if (userList.length === 0) {

        userTableBody.innerHTML = `
            <tr>
                <td colspan="6" class="no-data">
                    No users found.
                </td>
            </tr>
        `;

        return;

    }

    userList.forEach(user => {

        const roleClass =
            user.role === "ADMIN"
                ? "role-admin"
                : "role-analyst";

        const statusClass =
            user.status === "Active"
                ? "status-active"
                : "status-inactive";

        const row = `

        <tr>

            <td>${user.userId}</td>

            <td>${user.fullName}</td>

            <td>${user.email}</td>

            <td>

                <span class="role-badge ${roleClass}">

                    ${user.role}

                </span>

            </td>

            <td>

                <span class="status-badge ${statusClass}">

                    ${user.status}

                </span>

            </td>

            <td>

                <div class="action-buttons">

                    <button
                        class="edit-btn"
                        onclick="editUser(${user.userId})">

                        <i class="fa-solid fa-pen"></i>

                    </button>

                    <button
                        class="delete-btn"
                        onclick="deleteUser(${user.userId})">

                        <i class="fa-solid fa-trash"></i>

                    </button>

                </div>

            </td>

        </tr>

        `;

        userTableBody.innerHTML += row;

    });

}

// ==========================================
// Update Dashboard Cards
// ==========================================

function updateDashboardCards() {

    totalUsers.textContent = users.length;

    statTotalUsers.textContent = users.length;

    const admins =
        users.filter(user => user.role === "ADMIN");

    const analysts =
        users.filter(user => user.role === "ANALYST");

    const active =
        users.filter(user => user.status === "Active");

    adminUsers.textContent = admins.length;

    analystUsers.textContent = analysts.length;

    activeUsers.textContent = active.length;

    statAdmins.textContent = admins.length;

    statAnalysts.textContent = analysts.length;

    statActiveUsers.textContent = active.length;

    // Summary Cards

    latestUser.textContent =
        users.length > 0
            ? users[users.length - 1].fullName
            : "-";

    adminRatio.textContent =
        users.length === 0
            ? "0%"
            : Math.round((admins.length / users.length) * 100) + "%";

    analystRatio.textContent =
        users.length === 0
            ? "0%"
            : Math.round((analysts.length / users.length) * 100) + "%";

    if (active.length === users.length && users.length > 0) {

        systemUsage.textContent = "Excellent";

    } else if (active.length >= users.length / 2) {

        systemUsage.textContent = "Normal";

    } else {

        systemUsage.textContent = "Low";

    }

}
// ==========================================
// Save User
// ==========================================

userForm.addEventListener("submit", async function (event) {

    event.preventDefault();

    const userData = {

        fullName: fullName.value.trim(),

        email: email.value.trim(),

        password: password.value.trim(),

        role: role.value,

        status: status.value

    };

    if (
        userData.fullName === "" ||
        userData.email === ""
    ){

        showError("Please fill all required fields.");

        return;

    }

    try {

        const response = await apiFetch(API_URL, {
            method: "POST",

            headers: {

                "Content-Type": "application/json"

            },

            body: JSON.stringify(userData)

        });

        if (!response.ok) {

            throw new Error("Unable to save user.");

        }

        showSuccess("User added successfully.");

        resetForm();

        await loadUsers();

    } catch (error) {

        console.error(error);

        showError("Failed to add user.");

    }

});

// ==========================================
// Update User
// ==========================================

updateBtn.addEventListener("click", async function () {

    if (userId.value === "") {

        showError("Please select a user first.");

        return;

    }

    const userData = {

        userId: Number(userId.value),

        fullName: fullName.value.trim(),

        email: email.value.trim(),

        password: password.value.trim(),

        role: role.value,

        status: status.value

    };

    if (
        userData.fullName === "" ||
        userData.email === "" ||
        userData.password === ""
    ) {

        showError("Please fill all required fields.");

        return;

    }

    try {

        const response = await apiFetch(`${API_URL}/${userId.value}`, {
            method: "PUT",

            headers: {

                "Content-Type": "application/json"

            },

            body: JSON.stringify(userData)

        });

        if (!response.ok) {

            throw new Error("Unable to update user.");

        }

        showSuccess("User updated successfully.");

        resetForm();

        await loadUsers();

    } catch (error) {

        console.error(error);

        showError("Failed to update user.");

    }

});
// ==========================================
// Edit User
// ==========================================

async function editUser(id) {

    try {

        const response = await apiFetch(`${API_URL}/${id}`);
        if (!response.ok) {

            throw new Error("Unable to fetch user.");

        }

        const user = await response.json();

        userId.value = user.userId;

        fullName.value = user.fullName;

        email.value = user.email;

        password.value = "";
        status.value = user.status;

        editMode = true;

        saveBtn.disabled = true;

        updateBtn.disabled = false;

        window.scrollTo({

            top: 0,

            behavior: "smooth"

        });

    } catch (error) {

        console.error(error);

        showError("Unable to load user details.");

    }

}

// ==========================================
// Delete User
// ==========================================

async function deleteUser(id) {

    const confirmDelete = confirm(
        "Are you sure you want to delete this user?"
    );

    if (!confirmDelete) {

        return;

    }

    try {

        const response = await apiFetch(`${API_URL}/${id}`, {
            method: "DELETE"

        });

        if (!response.ok) {

            throw new Error("Unable to delete user.");

        }

        showSuccess("User deleted successfully.");

        if (userId.value == id) {

            resetForm();

        }

        await loadUsers();

    } catch (error) {

        console.error(error);

        showError("Failed to delete user.");

    }

}

// ==========================================
// Clear Button
// ==========================================

clearBtn.addEventListener("click", function () {

    resetForm();

});

// ==========================================
// Enable / Disable Buttons
// ==========================================

function enableEditMode() {

    editMode = true;

    saveBtn.disabled = true;

    updateBtn.disabled = false;

}

function disableEditMode() {

    editMode = false;

    saveBtn.disabled = false;

    updateBtn.disabled = true;

}

// ==========================================
// Improved Reset Form
// ==========================================

function resetForm() {

    userForm.reset();

    userId.value = "";

    disableEditMode();

}
// ==========================================
// Search & Filter Users
// ==========================================

function filterUsers() {

    const searchText = searchUser.value.toLowerCase().trim();

    const selectedRole = roleFilter.value;

    const selectedStatus = statusFilter.value;

    filteredUsers = users.filter(user => {

        const matchesSearch =
            user.fullName.toLowerCase().includes(searchText) ||
            user.email.toLowerCase().includes(searchText);

        const matchesRole =
            selectedRole === "" ||
            user.role === selectedRole;

        const matchesStatus =
            selectedStatus === "" ||
            user.status === selectedStatus;

        return matchesSearch && matchesRole && matchesStatus;

    });

    renderUserTable(filteredUsers);

}

// ==========================================
// Search Event
// ==========================================

searchUser.addEventListener("keyup", filterUsers);

// ==========================================
// Role Filter
// ==========================================

roleFilter.addEventListener("change", filterUsers);

// ==========================================
// Status Filter
// ==========================================

statusFilter.addEventListener("change", filterUsers);

// ==========================================
// Refresh Dashboard
// ==========================================

async function refreshDashboard() {

    await loadUsers();

}

// ==========================================
// Auto Refresh Every 30 Seconds
// ==========================================

setInterval(refreshDashboard, 30000);

// ==========================================
// Page Initialization
// ==========================================

document.addEventListener("DOMContentLoaded", async () => {

    try {

        disableEditMode();

        await loadUsers();

    } catch (error) {

        console.error(error);

        showError("Failed to initialize User Management.");

    }

});

// ==========================================
// Make Functions Global
// ==========================================

window.editUser = editUser;

window.deleteUser = deleteUser;
