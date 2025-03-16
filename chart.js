document.addEventListener("DOMContentLoaded", function () {
    console.log("📊 Equipment Usage Charts Loaded");

    if (typeof Chart === "undefined") {
        console.error("❌ ERROR: Chart.js is NOT LOADED! Check script source.");
        return;
    }

    // ✅ Helper Function to Get Chart Context
    function getChartContext(id) {
        let canvas = document.getElementById(id);
        if (!canvas) {
            console.error(`❌ ERROR: '${id}' canvas NOT FOUND in DOM!`);
            return null;
        }
        return canvas.getContext("2d");
    }

    const usageCtx = getChartContext("usageChart");
    const conditionCtx = getChartContext("conditionChart");
    const statusCtx = getChartContext("statusChart");
    const operatorCtx = getChartContext("operatorChart");
    const categoryCtx = getChartContext("categoryChart");

    if (!usageCtx || !conditionCtx || !statusCtx || !operatorCtx || !categoryCtx) {
        console.error("❌ ERROR: Missing chart elements. Check your HTML.");
        return;
    }

    function getEquipmentData() {
        let data = JSON.parse(localStorage.getItem("equipmentUsage")) || [];
        console.log("📊 Equipment Data Loaded:", data);
        return data;
    }

    function generateChartOptions(title) {
        return {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: "top",
                    labels: {
                        font: {
                            size: 14
                        }
                    }
                },
                title: {
                    display: true,
                    text: title,
                    font: {
                        size: 16
                    }
                }
            }
        };
    }

    function generateUsageData() {
        let equipmentData = getEquipmentData();
        return {
            labels: equipmentData.map(item => item.equipmentName || "Unknown"),
            datasets: [{
                label: "Usage Hours",
                data: equipmentData.map(item => item.usageHours || 0),
                backgroundColor: ["#007bff", "#28a745", "#dc3545"]
            }]
        };
    }

    function generateConditionData() {
        let equipmentData = getEquipmentData();
        let conditions = equipmentData.reduce((acc, item) => {
            acc[item.condition] = (acc[item.condition] || 0) + 1;
            return acc;
        }, {});

        return {
            labels: Object.keys(conditions),
            datasets: [{
                data: Object.values(conditions),
                backgroundColor: ["#28a745", "#ffc107", "#dc3545"]
            }]
        };
    }

    function generateStatusData() {
        let equipmentData = getEquipmentData();
        let statuses = equipmentData.reduce((acc, item) => {
            acc[item.status] = (acc[item.status] || 0) + 1;
            return acc;
        }, {});

        return {
            labels: Object.keys(statuses),
            datasets: [{
                data: Object.values(statuses),
                backgroundColor: ["#007bff", "#ffc107", "#28a745", "#dc3545"]
            }]
        };
    }

    function generateOperatorData() {
        let equipmentData = getEquipmentData();
        let operators = equipmentData.reduce((acc, item) => {
            acc[item.operatorName] = (acc[item.operatorName] || 0) + 1;
            return acc;
        }, {});

        return {
            labels: Object.keys(operators),
            datasets: [{
                label: "Equipment Handled",
                data: Object.values(operators),
                backgroundColor: "#ff6384"
            }]
        };
    }

    function generateCategoryData() {
        let equipmentData = getEquipmentData();
        let categories = equipmentData.reduce((acc, item) => {
            acc[item.category] = (acc[item.category] || 0) + 1;
            return acc;
        }, {});

        return {
            labels: Object.keys(categories),
            datasets: [{
                data: Object.values(categories),
                backgroundColor: ["#ff6384", "#36a2eb", "#ffcd56"]
            }]
        };
    }

    // ✅ Create Charts
    let usageChart = new Chart(usageCtx, { type: "bar", data: generateUsageData(), options: generateChartOptions("Usage Hours") });
    let conditionChart = new Chart(conditionCtx, { type: "pie", data: generateConditionData(), options: generateChartOptions("Equipment Condition") });
    let statusChart = new Chart(statusCtx, { type: "pie", data: generateStatusData(), options: generateChartOptions("Equipment Status") });
    let operatorChart = new Chart(operatorCtx, { type: "bar", data: generateOperatorData(), options: generateChartOptions("Operator Performance") });
    let categoryChart = new Chart(categoryCtx, { type: "pie", data: generateCategoryData(), options: generateChartOptions("Equipment Categories") });

    // ✅ Update Charts Only When Data Changes
    function updateChartsOnDataChange() {
        console.log("🔄 New Data Added! Updating Charts...");
        
        usageChart.data = generateUsageData();
        conditionChart.data = generateConditionData();
        statusChart.data = generateStatusData();
        operatorChart.data = generateOperatorData();
        categoryChart.data = generateCategoryData();

        usageChart.update();
        conditionChart.update();
        statusChart.update();
        operatorChart.update();
        categoryChart.update();
    }

    // ✅ Detect Local Storage Changes & Update Charts
    window.addEventListener("storage", function (event) {
        if (event.key === "equipmentUsage") {
            updateChartsOnDataChange();
        }
    });

    console.log("✅ Charts Initialized Successfully!");
});




usageChart.data = newUsageData;
        conditionChart.data = newConditionData;
        statusChart.data = newStatusData;
        operatorChart.data = newOperatorData;
        categoryChart.data = newCategoryData;

        usageChart.update();
        conditionChart.update();
        statusChart.update();
        operatorChart.update();
        categoryChart.update();