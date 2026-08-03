// =======================================================
// Threat Intelligence Portal - Dashboard
// =======================================================

// ==========================
// API Endpoints
// ==========================

const USER_API = "http://localhost:8080/api/users";
const CATEGORY_API = "http://localhost:8080/api/categories";
const THREAT_API = "http://localhost:8080/api/threats";

// ==========================
// Global Variables
// ==========================

let users = [];
let categories = [];
let threats = [];

let severityChart = null;
let monthlyChart = null;

// ==========================
// Load Dashboard Data
// ==========================

async function loadDashboard() {

    try {

        await Promise.all([
            loadUsers(),
            loadCategories(),
            loadThreats()
        ]);

        updateDashboardCards();
        loadRecentThreats();
        createSeverityChart();
        createMonthlyChart();

    } catch (error) {

        console.error("Dashboard Loading Error :", error);

    }

}

// ==========================
// Load Users
// ==========================

async function loadUsers() {

    try {

        const response = await apiFetch(USER_API);
        if (!response.ok) {

            throw new Error("Unable to fetch users.");

        }

        users = await response.json();

    } catch (error) {

        console.error("Users Error :", error);

        users = [];

    }

}

// ==========================
// Load Categories
// ==========================

async function loadCategories() {

    try {

        const response = await apiFetch(CATEGORY_API);
        if (!response.ok) {

            throw new Error("Unable to fetch categories.");

        }

        categories = await response.json();

    } catch (error) {

        console.error("Categories Error :", error);

        categories = [];

    }

}

// ==========================
// Load Threats
// ==========================

async function loadThreats() {

    try {

        const response = await apiFetch(THREAT_API);
        if (!response.ok) {

            throw new Error("Unable to fetch threats.");

        }

        threats = await response.json();

    } catch (error) {

        console.error("Threats Error :", error);

        threats = [];

    }

}

// ==========================
// Update Dashboard Cards
// ==========================

function updateDashboardCards() {

    document.getElementById("totalUsers").textContent =
        users.length;

    document.getElementById("totalCategories").textContent =
        categories.length;

    document.getElementById("totalThreats").textContent =
        threats.length;

    const criticalThreats = threats.filter(
        threat =>
            threat.severity &&
            threat.severity.toLowerCase() === "critical"
    ).length;

    document.getElementById("criticalThreats").textContent =
        criticalThreats;

    // Optional Cards

    const activeElement =
        document.getElementById("activeThreats");

    if (activeElement) {

        activeElement.textContent = threats.filter(
            threat =>
                threat.status &&
                threat.status.toLowerCase() === "active"
        ).length;

    }

    const resolvedElement =
        document.getElementById("resolvedThreats");

    if (resolvedElement) {

        resolvedElement.textContent = threats.filter(
            threat =>
                threat.status &&
                threat.status.toLowerCase() === "resolved"
        ).length;

    }

}
// ==========================
// Recent Threats Table
// ==========================

function loadRecentThreats() {

    const tableBody = document.querySelector(".dashboard-table tbody");

    if (!tableBody) {
        return;
    }

    tableBody.innerHTML = "";

    if (threats.length === 0) {

        tableBody.innerHTML = `
            <tr>
                <td colspan="6" style="text-align:center;">
                    No Threats Available
                </td>
            </tr>
        `;

        return;

    }

    // Sort by latest threat first
    threats.sort((a, b) => {

        if (!a.dateReported || !b.dateReported) {
            return 0;
        }

        return new Date(b.dateReported) - new Date(a.dateReported);

    });

    // Display latest 5 threats
    threats.slice(0, 5).forEach(threat => {

        let severityClass = "";

        switch ((threat.severity || "").toLowerCase()) {

            case "critical":
                severityClass = "critical";
                break;

            case "high":
                severityClass = "high";
                break;

            case "medium":
                severityClass = "medium";
                break;

            default:
                severityClass = "low";
        }

        let statusClass = "";

        switch ((threat.status || "").toLowerCase()) {

            case "active":
                statusClass = "critical";
                break;

            case "resolved":
                statusClass = "online";
                break;

            case "investigating":
                statusClass = "high";
                break;

            case "monitoring":
                statusClass = "medium";
                break;

            default:
                statusClass = "low";

        }

        tableBody.innerHTML += `

            <tr>

                <td>${threat.threatId}</td>

                <td>${threat.threatName}</td>

                <td>${threat.category ? threat.category.categoryName : "-"}</td>

                <td>

                    <span class="status ${severityClass}">
                        ${threat.severity}
                    </span>

                </td>

                <td>

                    <span class="status ${statusClass}">
                        ${threat.status}
                    </span>

                </td>

                <td>${threat.dateReported || "-"}</td>

            </tr>

        `;

    });

}

// ==========================
// Dashboard Summary
// ==========================

function getSeverityCount(level) {

    return threats.filter(threat =>

        threat.severity &&
        threat.severity.toLowerCase() === level.toLowerCase()

    ).length;

}

function getStatusCount(status) {

    return threats.filter(threat =>

        threat.status &&
        threat.status.toLowerCase() === status.toLowerCase()

    ).length;

}

function getLatestThreat() {

    if (threats.length === 0) {

        return "N/A";

    }

    const sortedThreats = [...threats].sort((a, b) =>

        new Date(b.dateReported) - new Date(a.dateReported)

    );

    return sortedThreats[0].threatName;

}

function getMostCommonCategory() {

    if (threats.length === 0) {

        return "N/A";

    }

    const categoryMap = {};

    threats.forEach(threat => {

        const category = threat.category
            ? threat.category.categoryName
            : "Unknown";

        categoryMap[category] =
            (categoryMap[category] || 0) + 1;

    });

    let max = 0;

    let mostCommon = "N/A";

    Object.keys(categoryMap).forEach(category => {

        if (categoryMap[category] > max) {

            max = categoryMap[category];
            mostCommon = category;

        }

    });

    return mostCommon;

}
// ==========================
// Severity Doughnut Chart
// ==========================

function createSeverityChart() {

    const canvas = document.getElementById("severityChart");

    if (!canvas) {
        return;
    }

    if (severityChart) {
        severityChart.destroy();
    }

    const critical = getSeverityCount("Critical");
    const high = getSeverityCount("High");
    const medium = getSeverityCount("Medium");
    const low = getSeverityCount("Low");

    severityChart = new Chart(canvas, {

        type: "doughnut",

        data: {

            labels: [

                "Critical",
                "High",
                "Medium",
                "Low"

            ],

            datasets: [{

                data: [

                    critical,
                    high,
                    medium,
                    low

                ],

                backgroundColor: [

                    "#ef4444",
                    "#f97316",
                    "#eab308",
                    "#22c55e"

                ],

                borderWidth: 2

            }]

        },

        options: {

            responsive: true,

            plugins: {

                legend: {

                    position: "bottom"

                }

            }

        }

    });

}

// ==========================
// Monthly Threat Detection
// ==========================

function createMonthlyChart() {

    const canvas = document.getElementById("monthlyChart");

    if (!canvas) {
        return;
    }

    if (monthlyChart) {
        monthlyChart.destroy();
    }

    const monthlyData = {

        Jan: 0,
        Feb: 0,
        Mar: 0,
        Apr: 0,
        May: 0,
        Jun: 0,
        Jul: 0,
        Aug: 0,
        Sep: 0,
        Oct: 0,
        Nov: 0,
        Dec: 0

    };

    threats.forEach(threat => {

        if (!threat.dateReported) {
            return;
        }

        const date = new Date(threat.dateReported);

        const month = date.toLocaleString("default", {

            month: "short"

        });

        if (monthlyData.hasOwnProperty(month)) {

            monthlyData[month]++;

        }

    });

    monthlyChart = new Chart(canvas, {

        type: "line",

        data: {

            labels: Object.keys(monthlyData),

            datasets: [{

                label: "Threats Detected",

                data: Object.values(monthlyData),

                borderColor: "#2563eb",

                backgroundColor: "rgba(37,99,235,.15)",

                borderWidth: 3,

                fill: true,

                tension: 0.4,

                pointRadius: 5,

                pointHoverRadius: 7

            }]

        },

        options: {

            responsive: true,

            maintainAspectRatio: false,

            scales: {

                y: {

                    beginAtZero: true,

                    ticks: {

                        precision: 0

                    }

                }

            },

            plugins: {

                legend: {

                    display: true,

                    position: "top"

                }

            }

        }

    });

}

// ==========================
// Refresh Dashboard
// ==========================

async function refreshDashboard() {

    await loadDashboard();

}

// ==========================
// Auto Refresh
// ==========================

// Refresh every 60 seconds

setInterval(() => {

    refreshDashboard();

}, 60000);
// ==========================
// Dashboard Greeting
// ==========================

function showGreeting() {

    const hour = new Date().getHours();

    let greeting = "";

    if (hour < 12) {

        greeting = "Good Morning";

    } else if (hour < 18) {

        greeting = "Good Afternoon";

    } else {

        greeting = "Good Evening";

    }

    console.log(`${greeting}, Administrator!`);

}

// ==========================
// Card Hover Animation
// ==========================

function initializeCardAnimation() {

    const cards = document.querySelectorAll(".card");

    cards.forEach(card => {

        card.addEventListener("mouseenter", () => {

            card.style.transform = "translateY(-8px)";
            card.style.transition = "0.3s";

        });

        card.addEventListener("mouseleave", () => {

            card.style.transform = "translateY(0px)";

        });

    });

}

// ==========================
// Button Click Animation
// ==========================

function initializeButtonAnimation() {

    const buttons = document.querySelectorAll(".btn");

    buttons.forEach(button => {

        button.addEventListener("click", function () {

            this.style.transform = "scale(0.96)";

            setTimeout(() => {

                this.style.transform = "scale(1)";

            }, 150);

        });

    });

}

// ==========================
// Dashboard Summary
// ==========================

function printDashboardSummary() {

    console.log("========== Dashboard Summary ==========");

    console.log("Total Users :", users.length);

    console.log("Total Categories :", categories.length);

    console.log("Total Threats :", threats.length);

    console.log("Critical Threats :", getSeverityCount("Critical"));

    console.log("High Threats :", getSeverityCount("High"));

    console.log("Medium Threats :", getSeverityCount("Medium"));

    console.log("Low Threats :", getSeverityCount("Low"));

    console.log("Active Threats :", getStatusCount("Active"));

    console.log("Resolved Threats :", getStatusCount("Resolved"));

    console.log("Latest Threat :", getLatestThreat());

    console.log("Most Common Category :", getMostCommonCategory());

    console.log("=======================================");

}

// ==========================
// Dashboard Initialization
// ==========================

document.addEventListener("DOMContentLoaded", async () => {

    showGreeting();

    initializeCardAnimation();

    initializeButtonAnimation();

    await loadDashboard();

    printDashboardSummary();

    console.log("Threat Intelligence Portal Dashboard Loaded Successfully.");

});