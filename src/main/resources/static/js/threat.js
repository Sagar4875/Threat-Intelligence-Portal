// ==============================
// Threat Management JavaScript
// Part 1 - Initialization
// ==============================

// ---------- API URLs ----------

const THREAT_API = "http://localhost:8080/api/threats";
const CATEGORY_API = "http://localhost:8080/api/categories";

// ---------- Global Variables ----------

let threats = [];
let categories = [];
let editingThreatId = null;

// ---------- DOM Elements ----------

const threatForm = document.getElementById("threatForm");

const threatId = document.getElementById("threatId");
const threatName = document.getElementById("threatName");
const category = document.getElementById("category");
const severity = document.getElementById("severity");
const status = document.getElementById("status");
const dateReported = document.getElementById("dateReported");
const description = document.getElementById("description");
const mitigation = document.getElementById("mitigation");

const saveBtn = document.getElementById("saveBtn");
const updateBtn = document.getElementById("updateBtn");
const clearBtn = document.getElementById("clearBtn");

const threatTableBody = document.getElementById("threatTableBody");

const searchThreat = document.getElementById("searchThreat");
const filterSeverity = document.getElementById("filterSeverity");

// ---------- Dashboard Cards ----------

const totalThreats = document.getElementById("totalThreats");
const criticalThreats = document.getElementById("criticalThreats");
const resolvedThreats = document.getElementById("resolvedThreats");
const activeThreats = document.getElementById("activeThreats");

// ==============================
// Load Categories
// ==============================

async function loadCategories() {

    try {

        const response = await apiFetch(CATEGORY_API);
        categories = await response.json();

        category.innerHTML =
            `<option value="">Select Category</option>`;

        categories.forEach(cat => {

            category.innerHTML += `

                <option value="${cat.categoryId}">

                    ${cat.categoryName}

                </option>

            `;

        });

    } catch (error) {

        console.error("Error Loading Categories:", error);

    }

}

// ==============================
// Load Threats
// ==============================

async function loadThreats() {

    try {

        const response = await apiFetch(THREAT_API);
        threats = await response.json();

        displayThreats(threats);

        updateStatistics();

    } catch (error) {

        console.error("Error Loading Threats:", error);

    }

}

// ==============================
// Display Threats
// ==============================

function displayThreats(threatList) {

    threatTableBody.innerHTML = "";

    threatList.forEach(threat => {

        threatTableBody.innerHTML += `

        <tr>

            <td>${threat.threatId}</td>

            <td>${threat.threatName}</td>

            <td>${threat.category.categoryName}</td>

            <td>${threat.severity}</td>

            <td>${threat.status}</td>

            <td>${threat.dateReported}</td>

            <td>

                <button class="btn"
                        onclick="editThreat(${threat.threatId})">

                    <i class="fa-solid fa-pen"></i>

                    Edit

                </button>

                <button class="btn"
                        onclick="deleteThreat(${threat.threatId})">

                    <i class="fa-solid fa-trash"></i>

                    Delete

                </button>

            </td>

        </tr>

        `;

    });

}

// ==============================
// Update Statistics
// ==============================

function updateStatistics() {

    totalThreats.textContent = threats.length;

    criticalThreats.textContent =
        threats.filter(t => t.severity === "Critical").length;

    resolvedThreats.textContent =
        threats.filter(t => t.status === "Resolved").length;

    activeThreats.textContent =
        threats.filter(t => t.status === "Active").length;

}
// ==============================
// Add Threat
// ==============================

async function addThreat() {

    const threatData = {

        threatName: threatName.value,

        category: {
            categoryId: parseInt(category.value)
        },

        severity: severity.value,

        status: status.value,

        description: description.value,

        mitigation: mitigation.value,

        dateReported: dateReported.value

    };

    try {

        const response = await apiFetch(THREAT_API, {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(threatData)

        });

        if (response.ok) {

            alert("Threat Added Successfully.");

            clearForm();

            loadThreats();

        } else {

            alert("Failed to Add Threat.");

        }

    } catch (error) {

        console.error(error);

    }

}

// ==============================
// Edit Threat
// ==============================

async function editThreat(id) {

    try {

        const response = await apiFetch(`${THREAT_API}/${id}`);
        const threat = await response.json();

        editingThreatId = id;

        threatId.value = threat.threatId;

        threatName.value = threat.threatName;

        category.value = threat.category.categoryId;

        severity.value = threat.severity;

        status.value = threat.status;

        description.value = threat.description;

        mitigation.value = threat.mitigation;

        dateReported.value = threat.dateReported;

        saveBtn.style.display = "none";

        updateBtn.style.display = "inline-block";

        window.scrollTo({

            top: 0,

            behavior: "smooth"

        });

    } catch (error) {

        console.error(error);

    }

}

// ==============================
// Update Threat
// ==============================

async function updateThreat() {

    const threatData = {

        threatId: editingThreatId,

        threatName: threatName.value,

        category: {
            categoryId: parseInt(category.value)
        },

        severity: severity.value,

        status: status.value,

        description: description.value,

        mitigation: mitigation.value,

        dateReported: dateReported.value

    };

    try {

        const response = await apiFetch(`${THREAT_API}/${editingThreatId}`, {
            method: "PUT",

            headers: {

                "Content-Type": "application/json"

            },

            body: JSON.stringify(threatData)

        });

        if (response.ok) {

            alert("Threat Updated Successfully.");

            clearForm();

            loadThreats();

        } else {

            alert("Failed to Update Threat.");

        }

    } catch (error) {

        console.error(error);

    }

}

// ==============================
// Delete Threat
// ==============================

async function deleteThreat(id) {

    if (!confirm("Are you sure you want to delete this Threat?")) {

        return;

    }

    try {

        const response = await apiFetch(`${THREAT_API}/${id}`, {
            method: "DELETE"

        });

        if (response.ok) {

            alert("Threat Deleted Successfully.");

            loadThreats();

        } else {

            alert("Failed to Delete Threat.");

        }

    } catch (error) {

        console.error(error);

    }

}

// ==============================
// Clear Form
// ==============================

function clearForm() {

    editingThreatId = null;

    threatForm.reset();

    saveBtn.style.display = "inline-block";

    updateBtn.style.display = "none";

}
// ==============================
// Search Threat
// ==============================

searchThreat.addEventListener("keyup", () => {

    const keyword = searchThreat.value.toLowerCase();

    const filteredThreats = threats.filter(threat =>

        threat.threatName.toLowerCase().includes(keyword)

    );

    displayThreats(filteredThreats);

});

// ==============================
// Filter by Severity
// ==============================

filterSeverity.addEventListener("change", () => {

    const selectedSeverity = filterSeverity.value;

    if (selectedSeverity === "") {

        displayThreats(threats);

        return;

    }

    const filteredThreats = threats.filter(threat =>

        threat.severity === selectedSeverity

    );

    displayThreats(filteredThreats);

});

// ==============================
// Form Submit
// ==============================

threatForm.addEventListener("submit", function (e) {

    e.preventDefault();

    if (editingThreatId === null) {

        addThreat();

    }

});

// ==============================
// Update Button
// ==============================

updateBtn.addEventListener("click", function () {

    updateThreat();

});

// ==============================
// Clear Button
// ==============================

clearBtn.addEventListener("click", function () {

    clearForm();

});

// ==============================
// Initialize Page
// ==============================

document.addEventListener("DOMContentLoaded", function () {

    loadCategories();

    loadThreats();

});