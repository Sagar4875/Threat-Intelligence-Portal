// ============================================
// Reports Module JavaScript
// Part 1
// ============================================

// ------------ API ----------------

const THREAT_API = "http://localhost:8080/api/threats";

// ------------ Global Data ------------

let reports = [];

// ------------ DOM Elements ------------

const reportTableBody = document.getElementById("reportTableBody");

const totalThreats = document.getElementById("totalThreats");
const criticalThreats = document.getElementById("criticalThreats");
const resolvedThreats = document.getElementById("resolvedThreats");
const activeThreats = document.getElementById("activeThreats");

const totalCategories = document.getElementById("totalCategories");
const highestSeverity = document.getElementById("highestSeverity");
const latestThreat = document.getElementById("latestThreat");

// ============================================
// Load Reports
// ============================================

async function loadReports() {

    try {

        const response = await apiFetch(THREAT_API);
        reports = await response.json();

        displayReports(reports);

        updateDashboard();

    }

    catch (error) {

        console.error("Error Loading Reports :", error);

    }

}

// ============================================
// Display Report Table
// ============================================

function displayReports(data) {

    reportTableBody.innerHTML = "";

    data.forEach(report => {

        reportTableBody.innerHTML += `

        <tr>

            <td>${report.threatId}</td>

            <td>${report.threatName}</td>

            <td>${report.category.categoryName}</td>

            <td>${report.severity}</td>

            <td>${report.status}</td>

            <td>${report.dateReported}</td>

        </tr>

        `;

    });

}

// ============================================
// Dashboard Statistics
// ============================================

function updateDashboard() {

    totalThreats.textContent = reports.length;

    criticalThreats.textContent =
        reports.filter(r => r.severity === "Critical").length;

    resolvedThreats.textContent =
        reports.filter(r => r.status === "Resolved").length;

    activeThreats.textContent =
        reports.filter(r => r.status === "Active").length;

    // Total Categories

    const categories = [...new Set(

        reports.map(r => r.category.categoryName)

    )];

    totalCategories.textContent = categories.length;

    // Highest Severity

    if (reports.some(r => r.severity === "Critical")) {

        highestSeverity.textContent = "Critical";

    }

    else if (reports.some(r => r.severity === "High")) {

        highestSeverity.textContent = "High";

    }

    else if (reports.some(r => r.severity === "Medium")) {

        highestSeverity.textContent = "Medium";

    }

    else {

        highestSeverity.textContent = "Low";

    }

    // Latest Threat

    if (reports.length > 0) {

        latestThreat.textContent =
            reports[reports.length - 1].threatName;

    }

    else {

        latestThreat.textContent = "--";

    }

}
// ============================================
// Search Threat
// ============================================

const searchThreat = document.getElementById("searchThreat");

searchThreat.addEventListener("keyup", function () {

    const keyword = searchThreat.value.toLowerCase();

    const filteredReports = reports.filter(report =>

        report.threatName.toLowerCase().includes(keyword)

    );

    displayReports(filteredReports);

});

// ============================================
// Filter by Severity
// ============================================

const severityFilter = document.getElementById("severityFilter");

severityFilter.addEventListener("change", function () {

    const severity = severityFilter.value;

    if (severity === "") {

        displayReports(reports);

        return;

    }

    const filteredReports = reports.filter(report =>

        report.severity === severity

    );

    displayReports(filteredReports);

});

// ============================================
// Filter by Status
// ============================================

const statusFilter = document.getElementById("statusFilter");

statusFilter.addEventListener("change", function () {

    const status = statusFilter.value;

    if (status === "") {

        displayReports(reports);

        return;

    }

    const filteredReports = reports.filter(report =>

        report.status === status

    );

    displayReports(filteredReports);

});

// ============================================
// Refresh Report
// ============================================

const refreshReport = document.getElementById("refreshReport");

refreshReport.addEventListener("click", function () {

    searchThreat.value = "";

    severityFilter.value = "";

    statusFilter.value = "";

    loadReports();

});
// ============================================
// Export Report to CSV
// ============================================

const exportCSV = document.getElementById("exportCSV");

exportCSV.addEventListener("click", function () {

    if (reports.length === 0) {

        alert("No Report Available.");

        return;

    }

    let csv =
        "ID,Threat Name,Category,Severity,Status,Date Reported\n";

    reports.forEach(report => {

        csv +=

            report.threatId + "," +
            report.threatName + "," +
            report.category.categoryName + "," +
            report.severity + "," +
            report.status + "," +
            report.dateReported + "\n";

    });

    const blob = new Blob([csv], {

        type: "text/csv"

    });

    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");

    a.href = url;

    a.download = "Threat_Report.csv";

    a.click();

    window.URL.revokeObjectURL(url);

});

// ============================================
// Print Report
// ============================================

const printReport = document.getElementById("printReport");

printReport.addEventListener("click", function () {

    window.print();

});

// ============================================
// Initialize Page
// ============================================

document.addEventListener("DOMContentLoaded", function () {

    loadReports();

});