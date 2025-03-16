document.addEventListener("DOMContentLoaded", function () { 
    console.log("📢 Equipment Data & Usage Page Loaded");

    // ✅ Ensure Elements Exist Before Accessing Them
    const usageDataList = document.querySelector(".usage-data-list");

    let equipmentData = JSON.parse(localStorage.getItem("equipmentUsage")) || [];

    function updateUsageList() {
        usageDataList.innerHTML = "";

        if (equipmentData.length === 0) {
            usageDataList.innerHTML = "<p>No data available. Click 'Add Data' to input details.</p>";
            return;
        }

        equipmentData.forEach((item, index) => {
            let condition = item.condition ? item.condition.toLowerCase() : "unknown"; // ✅ Prevent undefined error

            let dataItem = document.createElement("div");
            dataItem.classList.add("data-item");

            dataItem.innerHTML = `
                <div class="equipment-info">
                    <strong>${item.equipmentName || "N/A"} (${item.equipmentNumber || "N/A"})</strong> - ${item.category || "N/A"}
                    <p>Usage: ${item.startTime || "N/A"} - ${item.endTime || "N/A"} (${calculateUsageHours(item.startTime, item.endTime)} hrs)</p>
                    <p>Operator: ${item.operatorName || "N/A"} | Purpose: ${item.usagePurpose || "N/A"}</p>
                    <p>Issues: ${item.issuesDetected || "None"}</p>
                    <p>Last Maintenance: ${item.lastMaintenance || "N/A"}</p>
                    <p>Next Maintenance Due: ${item.nextMaintenance || "N/A"}</p>
                    <p>Status: <span class="status ${condition}">${item.condition || "Unknown"}</span></p>
                    
                    <div class="actions">
                        <button class="view-data" data-index="${index}">👁 View</button>
                        <button class="delete-data" data-index="${index}">🗑 Delete</button>
                    </div>
                </div>

                ${item.image ? `<img src="${item.image}" alt="Equipment Image" class="equipment-img">` : ""}
            `;

            usageDataList.appendChild(dataItem);
        });
    }

    function calculateUsageHours(start, end) {
        if (!start || !end) return "N/A";
        let startTime = new Date(start);
        let endTime = new Date(end);
        if (isNaN(startTime) || isNaN(endTime)) return "N/A";
        let diff = (endTime - startTime) / (1000 * 60 * 60);
        return diff > 0 ? diff.toFixed(2) : "N/A";
    }

    usageDataList.addEventListener("click", function (event) {
        if (event.target.classList.contains("delete-data")) {
            let index = event.target.getAttribute("data-index");
            equipmentData.splice(index, 1);
            localStorage.setItem("equipmentUsage", JSON.stringify(equipmentData));
            updateUsageList();
        }

        if (event.target.classList.contains("view-data")) {
            let index = event.target.getAttribute("data-index");
            localStorage.setItem("viewEquipment", JSON.stringify(equipmentData[index]));
            window.location.href = "view-equipment.html";
        }
    });

    updateUsageList();
});



