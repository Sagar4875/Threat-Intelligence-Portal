let editingCategoryId = null;

document.addEventListener("DOMContentLoaded", () => {

    loadCategories();

    const form = document.getElementById("categoryForm");

    form.addEventListener("submit", async (e) => {

        e.preventDefault();

        const categoryName = document.getElementById("categoryName").value.trim();
        const description = document.getElementById("description").value.trim();

        if (categoryName === "" || description === "") {

            alert("Please fill all fields.");
            return;

        }

        try {

            let url = "/api/categories";
            let method = "POST";

            if (editingCategoryId !== null) {

                url = `/api/categories/${editingCategoryId}`;
                method = "PUT";

            }

            const response = await apiFetch(url, {
                method: method,

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    categoryName,
                    description
                })

            });

            if (!response.ok) {

                throw new Error("Operation Failed");

            }

            if (editingCategoryId === null) {

                alert("Category Added Successfully.");

            } else {

                alert("Category Updated Successfully.");

            }

            form.reset();

            editingCategoryId = null;

            document.getElementById("saveButton").innerHTML = `
                <i class="fa-solid fa-plus"></i>
                Save Category
            `;

            loadCategories();

        } catch (error) {

            console.error(error);

            alert("Something went wrong.");

        }

    });

});

async function loadCategories() {

    try {

        const response = await apiFetch("/api/categories");
        const categories = await response.json();

        const tableBody = document.getElementById("categoryTableBody");

        tableBody.innerHTML = "";

        categories.forEach(category => {

            tableBody.innerHTML += `

                <tr>

                    <td>${category.categoryId}</td>

                    <td>${category.categoryName}</td>

                    <td>${category.description}</td>

                    <td>

                        <button class="btn"
                                onclick="editCategory(${category.categoryId})">

                            <i class="fa-solid fa-pen"></i>

                            Edit

                        </button>

                        <button class="btn"
                                onclick="deleteCategory(${category.categoryId})">

                            <i class="fa-solid fa-trash"></i>

                            Delete

                        </button>

                    </td>

                </tr>

            `;

        });

    } catch (error) {

        console.error(error);

    }

}

async function editCategory(id) {

    try {

        const response = await apiFetch(`/api/categories/${id}`);
        if (!response.ok) {

            throw new Error("Unable to load category");

        }

        const category = await response.json();

        document.getElementById("categoryName").value = category.categoryName;
        document.getElementById("description").value = category.description;

        editingCategoryId = id;

        document.getElementById("saveButton").innerHTML = `
            <i class="fa-solid fa-pen"></i>
            Update Category
        `;

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    } catch (error) {

        console.error(error);

        alert("Unable to load category.");

    }

}

async function deleteCategory(id) {

    const confirmDelete = confirm("Are you sure you want to delete this category?");

    if (!confirmDelete) {

        return;

    }

    try {

        const response = await apiFetch(`/api/categories/${id}`, {
            method: "DELETE"

        });

        if (!response.ok) {

            throw new Error("Unable to delete category");

        }

        alert("Category Deleted Successfully.");

        loadCategories();

    } catch (error) {

        console.error(error);

        alert("Something went wrong.");

    }

}