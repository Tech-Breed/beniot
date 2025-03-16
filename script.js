document.addEventListener("DOMContentLoaded", function () {
    // Section Management
    const sections = {
        equipment: "Equipment Maintenance",
        usage: "Equipment Data & Usage",
        operations: "Operations Data",
        inventory: "Supply Chain Inventory",
        expenses: "Expense Tracking",
        schedule: "Maintenance Schedule"
    };

    const sidebarItems = document.querySelectorAll(".sidebar nav ul li");
    const sectionTitle = document.getElementById("section-title");

    // Hide all sections initially
    document.querySelectorAll(".content-section").forEach(section => {
        section.style.display = "none";
    });

    // Show default section (equipment)
    const defaultSection = document.getElementById("equipment");
    if (defaultSection) defaultSection.style.display = "block";

    sidebarItems.forEach(item => {
        item.addEventListener("click", function () {
            // Remove active class from all items
            sidebarItems.forEach(i => i.classList.remove("active"));
            this.classList.add("active");

            // Get section type
            const sectionType = this.getAttribute("data-section");

            // Update section title
            sectionTitle.textContent = sections[sectionType] || "Unknown Section";

            // Hide all sections
            document.querySelectorAll(".content-section").forEach(section => {
                section.style.display = "none";
            });

            // Show selected section if it exists
            const selectedSection = document.getElementById(sectionType);
            if (selectedSection) {
                selectedSection.style.display = "block";
            } else {
                console.error(`❌ Section #${sectionType} not found!`);
            }
        });
    });
});



    

    // Dropdown Functionality
    const dataList = document.querySelector(".data-list");

    if (dataList) {
        dataList.addEventListener("click", function (event) {
            const target = event.target;

            // Handle dropdown toggle
            if (target.classList.contains("three-dots")) {
                event.stopPropagation();
                let dropdown = target.closest(".dropdown");

                // Close other open dropdowns
                document.querySelectorAll(".dropdown").forEach(d => {
                    if (d !== dropdown) d.classList.remove("open");
                });

                // Toggle clicked dropdown
                dropdown.classList.toggle("open");
            }

            // Close dropdown when selecting an option
            if (target.closest(".dropdown-menu button")) {
                target.closest(".dropdown").classList.remove("open");
            }
        });
    }

    // Close dropdown when clicking outside
    document.addEventListener("click", function (event) {
        if (!event.target.closest(".dropdown")) {
            document.querySelectorAll(".dropdown").forEach(d => d.classList.remove("open"));
        }
    });

