// ==========================================
// Threat Intelligence Portal
// Authentication Manager
// ==========================================

// Session Keys

const TOKEN_KEY = "jwtToken";

const USER_KEY = "loggedInUser";

const ROLE_KEY = "userRole";

// ==========================================
// Get Token
// ==========================================

function getToken() {

    return sessionStorage.getItem(TOKEN_KEY);

}

// ==========================================
// Get User
// ==========================================

function getUser() {

    const user = sessionStorage.getItem(USER_KEY);

    return user ? JSON.parse(user) : null;

}

// ==========================================
// Get Role
// ==========================================

function getRole() {

    return sessionStorage.getItem(ROLE_KEY);

}

// ==========================================
// Logged In?
// ==========================================

function isAuthenticated() {

    return getToken() !== null;

}

// ==========================================
// Authorization Header
// ==========================================

function authHeaders() {

    return {

        "Content-Type": "application/json",

        "Authorization": "Bearer " + getToken()

    };

}
// ==========================================
// Protect Pages
// ==========================================

function protectPage() {

    if (!isAuthenticated() || isTokenExpired()) {

        logout();

        return;

    }

}

// ==========================================
// Logout
// ==========================================

function logout() {

    sessionStorage.clear();

    window.location.replace("login.html");

}
// ==========================================
// Display Logged-in User
// ==========================================

function displayUser() {

    const user = getUser();

    if (!user) {

        return;

    }

    const profileName = document.querySelector(".profile span");

    if (profileName) {

        profileName.textContent =
            user.fullName || user.email || "Administrator";

    }

}

// ==========================================
// Display Logged-in Role
// ==========================================

function displayRole() {

    const roleElement = document.getElementById("loggedRole");

    if (!roleElement) {

        return;

    }

    roleElement.textContent =
        getRole() || "ADMIN";

}

// ==========================================
// Token Expiry Check
// ==========================================

function checkToken() {

    const token = getToken();

    if (!token) {

        logout();

        return;

    }

}

// ==========================================
// Automatic Initialization
// ==========================================

document.addEventListener("DOMContentLoaded", () => {

    protectPage();

    displayUser();

    displayRole();

    checkToken();

});

// ==========================================
// Make Functions Global
// ==========================================

window.logout = logout;

window.authHeaders = authHeaders;

window.getToken = getToken;

window.getUser = getUser;

window.getRole = getRole;
// ==========================================
// Decode JWT Token
// ==========================================

function parseJwt(token) {

    try {

        const payload = token.split(".")[1];

        const decoded = atob(payload);

        return JSON.parse(decoded);

    } catch (error) {

        console.error("Invalid JWT Token");

        return null;

    }

}

// ==========================================
// Check Token Expiration
// ==========================================

function isTokenExpired() {

    const token = getToken();

    if (!token) {

        return true;

    }

    const payload = parseJwt(token);

    if (!payload || !payload.exp) {

        return true;

    }

    const currentTime = Math.floor(Date.now() / 1000);

    return payload.exp < currentTime;

}

// ==========================================
// Validate Session
// ==========================================

function validateSession() {

    if (isTokenExpired()) {

        alert("Your session has expired. Please login again.");

        logout();

        return false;

    }

    return true;

}

// ==========================================
// Secure Fetch Wrapper
// ==========================================

async function apiFetch(url, options = {}) {

    if (!validateSession()) {

        return null;

    }

    options.headers = {

        ...authHeaders(),

        ...(options.headers || {})

    };

    const response = await fetch(url, options);

    if (response.status === 401) {

        alert("Unauthorized. Please login again.");

        logout();

        return null;

    }

    if (response.status === 403) {

        alert("Access Denied.");

        return null;

    }

    if (!response.ok) {
        throw new Error("Request failed with status " + response.status);
    }

    return response;

}

// ==========================================
// Auto Session Check
// ==========================================

setInterval(() => {

    validateSession();

}, 60000);

// ==========================================
// Global Functions
// ==========================================

window.apiFetch = apiFetch;

window.validateSession = validateSession;

window.isTokenExpired = isTokenExpired;
// ==========================================
// Role-Based Access Control (RBAC)
// ==========================================

function hasRole(...allowedRoles) {

    const role = getRole();

    return allowedRoles.includes(role);

}

// ==========================================
// Protect Admin Pages
// ==========================================

function requireAdmin() {

    if (!hasRole("ADMIN")) {

        alert("Access Denied. Administrator privileges are required.");

        window.location.replace("login.html");
    }

}

// ==========================================
// Protect Analyst Pages
// ==========================================

function requireAnalystOrAdmin() {

    if (!hasRole("ADMIN", "ANALYST")) {

        alert("Access Denied.");

        window.location.href = "login.html";

    }

}

// ==========================================
// Hide Admin Menus
// ==========================================

function hideAdminMenus() {

    if (hasRole("ADMIN")) {

        return;

    }

    document.querySelectorAll(".admin-only").forEach(menu => {

        menu.style.display = "none";

    });

}

// ==========================================
// Logout Button
// ==========================================

const logoutLink = document.getElementById("logoutBtn");

if (logoutLink) {

    logoutLink.addEventListener("click", function (event) {

        event.preventDefault();

        if (confirm("Are you sure you want to logout?")) {

            logout();

        }

    });

}

// ==========================================
// Initialize Authentication
// ==========================================

document.addEventListener("DOMContentLoaded", () => {

    protectPage();

    validateSession();

    displayUser();

    displayRole();

    hideAdminMenus();

});

// ==========================================
// Global Functions
// ==========================================

window.requireAdmin = requireAdmin;

window.requireAnalystOrAdmin = requireAnalystOrAdmin;

window.hasRole = hasRole;