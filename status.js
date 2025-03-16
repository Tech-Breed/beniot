// document.addEventListener("DOMContentLoaded", function () {
//     let statusCounts = {
//         "draft": 0,
//         "in-progress": 0,
//         "in-review": 0,
//         "approved": 0,
//         "archived": 0,
//         "deleted": 0
//     };

//     let records = JSON.parse(localStorage.getItem("maintenanceRecords")) || [];

//     function displayRecords(status) {
//         const dataList = document.querySelector(".data-list");
//         if (!dataList) return;

//         dataList.innerHTML = ""; // Clear previous data

//         let filteredRecords = records.filter(record => record.status === status);

//         if (filteredRecords.length === 0) {
//             dataList.innerHTML = "<p>No records found for this status.</p>";
//             return;
//         }

//         filteredRecords.forEach(record => {
//             let recordItem = document.createElement("div");
//             recordItem.classList.add("data-item");
//             recordItem.innerHTML = `
//                 <span class="data-name" data-id="${record.id}">${record.name} - ${record.model} (${record.status})</span>
//                 <div class="data-actions">
//                     <button class="view-btn" data-id="${record.id}"> View</button>
//                     <div class="dropdown">
//                         <button class="three-dots">⋮</button>
//                         <div class="dropdown-menu">
//                             ${status === "deleted"
//                                 ? `<button class="restore-report" data-id="${record.id}">🔄 Restore</button>
//                                    <button class="permanent-delete" data-id="${record.id}">🗑 Delete Permanently</button>`
//                                 : `<button class="rename-report" data-id="${record.id}">✏ Rename</button>
//                                    <button class="edit-report" data-id="${record.id}">📝 Edit</button>
//                                    <button class="delete-report" data-id="${record.id}">🗑 Move to Deleted</button>`
//                             }
//                         </div>
//                     </div>
//                 </div>
//             `;
//             dataList.appendChild(recordItem);
//         });

//         updateStatusCounts();
//     }

//     function updateStatusCounts() {
//         Object.keys(statusCounts).forEach(status => {
//             statusCounts[status] = records.filter(record => record.status === status).length;
//             let countElement = document.getElementById(`${status}-count`);
//             if (countElement) {
//                 countElement.textContent = statusCounts[status];
//             }
//         });
//     }

//     // Make status tabs clickable to show only relevant records
//     document.querySelectorAll(".status-tab").forEach(tab => {
//         tab.addEventListener("click", function () {
//             let selectedStatus = this.getAttribute("data-status");
//             displayRecords(selectedStatus);

//             // Remove active class from all tabs
//             document.querySelectorAll(".status-tab").forEach(t => t.classList.remove("active"));

//             // Add active class to the selected tab
//             this.classList.add("active");
//         });
//     });

//     // Clicking "View" opens the record in view.html
//     document.addEventListener("click", function (event) {
//         if (event.target.classList.contains("view-btn")) {
//             let reportId = event.target.getAttribute("data-id");
//             window.location.href = `view.html?id=${reportId}`;
//         }
//     });

//     // Clicking a record name opens the form with pre-filled data
//     document.addEventListener("click", function (event) {
//         if (event.target.classList.contains("data-name")) {
//             let reportId = event.target.getAttribute("data-id");
//             window.location.href = `form.html?id=${reportId}`;
//         }
//     });

//     // Edit Functionality - Open Form with Existing Data
//     document.addEventListener("click", function (event) {
//         if (event.target.classList.contains("edit-report")) {
//             let reportId = event.target.getAttribute("data-id");
//             let record = records.find(r => r.id === parseInt(reportId));

//             if (record) {
//                 localStorage.setItem("editRecord", JSON.stringify(record)); // Store record for editing
//                 window.location.href = `form.html?id=${reportId}`;
//             }
//         }
//     });

//     // Delete Functionality - Moves Record to "Deleted"
//     document.addEventListener("click", function (event) {
//         if (event.target.classList.contains("delete-report")) {
//             let reportId = parseInt(event.target.getAttribute("data-id"));
//             let record = records.find(r => r.id === reportId);

//             if (record) {
//                 record.status = "deleted"; // Move to "Deleted" status
//                 localStorage.setItem("maintenanceRecords", JSON.stringify(records));
//                 updateStatusCounts();
//                 displayRecords(document.querySelector(".status-tab.active")?.getAttribute("data-status") || "draft");
//             }
//         }
//     });

//     // Restore Functionality - Moves Deleted Form to "In Review"
//     document.addEventListener("click", function (event) {
//         if (event.target.classList.contains("restore-report")) {
//             let reportId = parseInt(event.target.getAttribute("data-id"));
//             let record = records.find(r => r.id === reportId);

//             if (record) {
//                 record.status = "in-review"; // Restore to "In Review"
//                 localStorage.setItem("maintenanceRecords", JSON.stringify(records));
//                 updateStatusCounts();
//                 displayRecords("deleted"); // Refresh deleted tab
//             }
//         }
//     });

//     // Permanent Delete - Removes Record from LocalStorage
//     document.addEventListener("click", function (event) {
//         if (event.target.classList.contains("permanent-delete")) {
//             let reportId = parseInt(event.target.getAttribute("data-id"));

//             records = records.filter(record => record.id !== reportId);
//             localStorage.setItem("maintenanceRecords", JSON.stringify(records));
//             updateStatusCounts();
//             displayRecords("deleted"); // Refresh deleted tab
//         }
//     });

//     // Rename Functionality - Change Name of a Specific Form
//     document.addEventListener("click", function (event) {
//         if (event.target.classList.contains("rename-report")) {
//             let reportId = parseInt(event.target.getAttribute("data-id"));
//             let record = records.find(r => r.id === reportId);

//             if (record) {
//                 let newName = prompt("Enter new name:", record.name);
//                 let newModel = prompt("Enter new model:", record.model);
//                 if (newName && newModel) {
//                     record.name = newName.trim();
//                     record.model = newModel.trim();
//                     localStorage.setItem("maintenanceRecords", JSON.stringify(records));
//                     displayRecords(document.querySelector(".status-tab.active")?.getAttribute("data-status") || "draft");
//                 }
//             }
//         }
//     });

//     // Initial load
//     updateStatusCounts();
//     displayRecords("draft"); // Default to showing draft records on load
// });

// // Three Dot Functionality
// document.addEventListener("DOMContentLoaded", function () {
//     document.addEventListener("click", function (event) {
//         if (event.target.classList.contains("three-dots")) {
//             event.stopPropagation();
//             let dropdown = event.target.closest(".dropdown");

//             // Close other open dropdowns
//             document.querySelectorAll(".dropdown").forEach((d) => {
//                 if (d !== dropdown) d.classList.remove("open");
//             });

//             // Toggle clicked dropdown
//             dropdown.classList.toggle("open");
//         }
//     });

//     // Close dropdown when clicking outside
//     document.addEventListener("click", function (event) {
//         if (!event.target.closest(".dropdown")) {
//             document.querySelectorAll(".dropdown").forEach((d) => d.classList.remove("open"));
//         }
//     });

//     // Close dropdown when selecting an option
//     document.addEventListener("click", function (event) {
//         if (event.target.closest(".dropdown-menu button")) {
//             event.target.closest(".dropdown").classList.remove("open");
//         }
//     });
// });

document.addEventListener("DOMContentLoaded", function () {
    let statusCounts = {
        "draft": 0,
        "in-progress": 0,
        "in-review": 0,
        "approved": 0,
        "archived": 0,
        "deleted": 0
    };

    let records = JSON.parse(localStorage.getItem("maintenanceRecords")) || [];

    function displayRecords(status) {
        const dataList = document.querySelector(".data-list");
        if (!dataList) return;

        dataList.innerHTML = ""; // Clear previous data

        let filteredRecords = records.filter(record => record.status === status);

        if (filteredRecords.length === 0) {
            dataList.innerHTML = "<p>No records found for this status.</p>";
            return;
        }

        filteredRecords.forEach(record => {
            let recordItem = document.createElement("div");
            recordItem.classList.add("data-item");
            recordItem.innerHTML = `
                <span class="data-name" data-id="${record.id}">${record.name} - ${record.model} (${record.status})</span>
                <div class="data-actions">
                    <button class="view-btn" data-id="${record.id}"> View</button>
                    <div class="dropdown">
                        <button class="three-dots">⋮</button>
                        <div class="dropdown-menu">
                            ${status === "deleted"
                                ? `<button class="restore-report" data-id="${record.id}">🔄 Restore</button>
                                   <button class="permanent-delete" data-id="${record.id}">🗑 Delete Permanently</button>`
                                : `<button class="rename-report" data-id="${record.id}">✏ Rename</button>
                                   <button class="edit-report" data-id="${record.id}">📝 Edit</button>
                                   <button class="delete-report" data-id="${record.id}">🗑 Move to Deleted</button>`
                            }
                        </div>
                    </div>
                </div>
            `;
            dataList.appendChild(recordItem);
        });

        updateStatusCounts();
    }

    function updateStatusCounts() {
        Object.keys(statusCounts).forEach(status => {
            statusCounts[status] = records.filter(record => record.status === status).length;
            let countElement = document.getElementById(`${status}-count`);
            if (countElement) {
                countElement.textContent = statusCounts[status];
            }
        });
    }

    // Make status tabs clickable to show only relevant records
    document.querySelectorAll(".status-tab").forEach(tab => {
        tab.addEventListener("click", function () {
            let selectedStatus = this.getAttribute("data-status");
            displayRecords(selectedStatus);

            // Remove active class from all tabs
            document.querySelectorAll(".status-tab").forEach(t => t.classList.remove("active"));

            // Add active class to the selected tab
            this.classList.add("active");
        });
    });

    // Clicking "View" opens the record in view.html
    document.addEventListener("click", function (event) {
        if (event.target.classList.contains("view-btn")) {
            let reportId = event.target.getAttribute("data-id");
            window.location.href = `view.html?id=${reportId}`;
        }
    });

    // Clicking a record name opens the form with pre-filled data
    document.addEventListener("click", function (event) {
        if (event.target.classList.contains("data-name")) {
            let reportId = event.target.getAttribute("data-id");
            window.location.href = `form.html?id=${reportId}`;
        }
    });

    // Edit Functionality - Open Form with Existing Data
    document.addEventListener("click", function (event) {
        if (event.target.classList.contains("edit-report")) {
            let reportId = event.target.getAttribute("data-id");
            let record = records.find(r => r.id === parseInt(reportId));

            if (record) {
                localStorage.setItem("editRecord", JSON.stringify(record)); // Store record for editing
                window.location.href = `form.html?id=${reportId}`;
            }
        }
    });

    // Delete Functionality - Moves Record to "Deleted"
    document.addEventListener("click", function (event) {
        if (event.target.classList.contains("delete-report")) {
            let reportId = parseInt(event.target.getAttribute("data-id"));
            let record = records.find(r => r.id === reportId);

            if (record) {
                record.status = "deleted"; // Move to "Deleted" status
                localStorage.setItem("maintenanceRecords", JSON.stringify(records));
                updateStatusCounts();
                displayRecords(document.querySelector(".status-tab.active")?.getAttribute("data-status") || "draft");
            }
        }
    });

    // Restore Functionality - Moves Deleted Form to "In Review"
    document.addEventListener("click", function (event) {
        if (event.target.classList.contains("restore-report")) {
            let reportId = parseInt(event.target.getAttribute("data-id"));
            let record = records.find(r => r.id === reportId);

            if (record) {
                record.status = "in-review"; // Restore to "In Review"
                localStorage.setItem("maintenanceRecords", JSON.stringify(records));
                updateStatusCounts();
                displayRecords("deleted"); // Refresh deleted tab
            }
        }
    });

    // Permanent Delete - Removes Record from LocalStorage
    document.addEventListener("click", function (event) {
        if (event.target.classList.contains("permanent-delete")) {
            let reportId = parseInt(event.target.getAttribute("data-id"));

            records = records.filter(record => record.id !== reportId);
            localStorage.setItem("maintenanceRecords", JSON.stringify(records));
            updateStatusCounts();
            displayRecords("deleted"); // Refresh deleted tab
        }
    });

    // Rename Functionality - Change Name of a Specific Form
    document.addEventListener("click", function (event) {
        if (event.target.classList.contains("rename-report")) {
            let reportId = parseInt(event.target.getAttribute("data-id"));
            let record = records.find(r => r.id === reportId);

            if (record) {
                let newName = prompt("Enter new name:", record.name);
                let newModel = prompt("Enter new model:", record.model);
                if (newName && newModel) {
                    record.name = newName.trim();
                    record.model = newModel.trim();
                    localStorage.setItem("maintenanceRecords", JSON.stringify(records));
                    displayRecords(document.querySelector(".status-tab.active")?.getAttribute("data-status") || "draft");
                }
            }
        }
    });

    // Initial load
    updateStatusCounts();
    displayRecords("draft"); // Default to showing draft records on load
});

// Three Dot Functionality
document.addEventListener("DOMContentLoaded", function () {
    document.addEventListener("click", function (event) {
        if (event.target.classList.contains("three-dots")) {
            event.stopPropagation();
            let dropdown = event.target.closest(".dropdown");

            // Close other open dropdowns
            document.querySelectorAll(".dropdown").forEach((d) => {
                if (d !== dropdown) d.classList.remove("open");
            });

            // Toggle clicked dropdown
            dropdown.classList.toggle("open");
        }
    });

    // Close dropdown when clicking outside
    document.addEventListener("click", function (event) {
        if (!event.target.closest(".dropdown")) {
            document.querySelectorAll(".dropdown").forEach((d) => d.classList.remove("open"));
        }
    });

    // Close dropdown when selecting an option
    document.addEventListener("click", function (event) {
        if (event.target.closest(".dropdown-menu button")) {
            event.target.closest(".dropdown").classList.remove("open");
        }
    });
});
