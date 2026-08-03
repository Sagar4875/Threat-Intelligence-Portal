// =========================================
// Threat Intelligence Portal
// Login Module
// =========================================

// Backend Authentication API
const API_URL = "http://localhost:8080/api/auth/login";

// =========================================
// DOM Elements
// =========================================

const loginForm = document.getElementById("loginForm");

const email = document.getElementById("email");

const password = document.getElementById("password");

const rememberMe = document.getElementById("rememberMe");

const loginBtn = document.getElementById("loginBtn");

const loading = document.getElementById("loading");

const errorMessage = document.getElementById("errorMessage");

const togglePassword = document.getElementById("togglePassword");

// =========================================
// Utility Functions
// =========================================

function showError(message) {

    errorMessage.style.display = "block";

    errorMessage.textContent = message;

}

function hideError() {

    errorMessage.style.display = "none";

    errorMessage.textContent = "";

}

function showLoading() {

    loading.style.display = "block";

    loginBtn.disabled = true;

}

function hideLoading() {

    loading.style.display = "none";

    loginBtn.disabled = false;

}

// =========================================
// Show / Hide Password
// =========================================

togglePassword.addEventListener("click", () => {

    if (password.type === "password") {

        password.type = "text";

        togglePassword.classList.remove("fa-eye");

        togglePassword.classList.add("fa-eye-slash");

    } else {

        password.type = "password";

        togglePassword.classList.remove("fa-eye-slash");

        togglePassword.classList.add("fa-eye");

    }

});

// =========================================
// Validate Login Form
// =========================================

function validateForm() {

    hideError();

    if (email.value.trim() === "") {

        showError("Email is required.");

        email.focus();

        return false;

    }

    if (password.value.trim() === "") {

        showError("Password is required.");

        password.focus();

        return false;

    }

    return true;

}

// ==========================================
// Login Authentication
// ==========================================

loginForm.addEventListener("submit", async function (event) {

    event.preventDefault();

    if (!validateForm()) {
        return;
    }

    showLoading();
    hideError();

    const loginData = {
        email: email.value.trim(),
        password: password.value.trim()
    };

    try {

        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(loginData)
        });

        let data = {};

        try {
            data = await response.json();
        } catch (e) {
            // Ignore if response body is empty
        }

        if (!response.ok) {
            throw new Error(data.message || "Invalid email or password.");
        }

        if (!data.token) {
            throw new Error("JWT token was not returned by the server.");
        }

        sessionStorage.setItem("jwtToken", data.token);
        sessionStorage.setItem("loggedInUser", JSON.stringify(data));
        sessionStorage.setItem("userRole", data.role || "");
        sessionStorage.setItem("userEmail", data.email || loginData.email);

        if (rememberMe.checked) {
            localStorage.setItem("rememberEmail", loginData.email);
        } else {
            localStorage.removeItem("rememberEmail");
        }

        hideLoading();

        window.location.replace("admin.html");

    } catch (error) {

        hideLoading();

        console.error("Login Error:", error);

        showError(error.message);

    }

});
// ==========================================
// Remember Me
// ==========================================

window.addEventListener("DOMContentLoaded", () => {

    const rememberedEmail = localStorage.getItem("rememberEmail");

    if (rememberedEmail) {

        email.value = rememberedEmail;

        rememberMe.checked = true;

    }

});

// ==========================================
// Get Logged-in User
// ==========================================

function getLoggedInUser() {

    const user = sessionStorage.getItem("loggedInUser");

    return user ? JSON.parse(user) : null;

}

// ==========================================
// Get JWT Token
// ==========================================

function getToken() {

    return sessionStorage.getItem("jwtToken");

}

// ==========================================
// Authorization Header
// ==========================================

function getAuthHeaders() {

    const token = getToken();

    return {

        "Content-Type": "application/json",

        "Authorization": `Bearer ${token}`

    };

}

// ==========================================
// Check Login Status
// ==========================================

function isLoggedIn() {

    return sessionStorage.getItem("loggedInUser") !== null;

}

// ==========================================
// Logout
// ==========================================

function logout() {

    sessionStorage.removeItem("loggedInUser");

    sessionStorage.removeItem("jwtToken");

    sessionStorage.removeItem("userRole");

    sessionStorage.removeItem("userEmail");

    window.location.href = "login.html";

}

// ==========================================
// Display Logged-in User
// ==========================================

function displayLoggedInUser() {

    const user = getLoggedInUser();

    if (!user) {

        return;

    }

    const profile = document.querySelector(".profile span");

    if (profile) {

        profile.textContent =
            user.fullName || user.email || "Administrator";

    }

}

// ==========================================
// Expose Global Logout Function
// ==========================================

window.logout = logout;
// ==========================================
// Protect Login Page
// ==========================================

function checkExistingSession() {

    if (isLoggedIn()) {

        window.location.href = "admin.html";

    }

}

// ==========================================
// Protect Dashboard Pages
// ==========================================

function protectPage() {

    if (!isLoggedIn()) {

        window.location.href = "login.html";

    }

}

// ==========================================
// Initialize Login Page
// ==========================================

function initializeLoginPage() {

    hideError();

    hideLoading();

    checkExistingSession();

}

// ==========================================
// Page Initialization
// ==========================================

document.addEventListener("DOMContentLoaded", () => {

    initializeLoginPage();

});

// ==========================================
// Global Utility Functions
// ==========================================

window.getToken = getToken;

window.getAuthHeaders = getAuthHeaders;

window.getLoggedInUser = getLoggedInUser;

window.isLoggedIn = isLoggedIn;

window.protectPage = protectPage;

// ==========================================
// Prevent Form Resubmission
// ==========================================

if (window.history.replaceState) {

    window.history.replaceState(
        null,
        null,
        window.location.href
    );

}

// ==========================================
// Clear Error While Typing
// ==========================================

email.addEventListener("input", hideError);

password.addEventListener("input", hideError);

// ==========================================
// End of Login Module
// ==========================================