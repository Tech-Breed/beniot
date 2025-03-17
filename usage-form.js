document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("usage-form");
    const steps = document.querySelectorAll(".form-step");
    const nextBtns = document.querySelectorAll(".next-step");
    const prevBtns = document.querySelectorAll(".prev-step");

    let currentStep = 0;
    steps[currentStep].classList.add("active");

    // ✅ Step Navigation
    function showStep(stepIndex) {
        steps.forEach((step, index) => {
            step.classList.toggle("active", index === stepIndex);
        });
    }

    nextBtns.forEach((btn) => {
        btn.addEventListener("click", () => {
            currentStep++;
            showStep(currentStep);
        });
    });

    prevBtns.forEach((btn) => {
        btn.addEventListener("click", () => {
            currentStep--;
            showStep(currentStep);
        });
    });

    // ✅ Handle Form Submission
    form.addEventListener("submit", function (event) {
        event.preventDefault();

        const equipmentData = JSON.parse(localStorage.getItem("equipmentUsage")) || [];

        // ✅ Collect Data from Form
        const newEntry = {
            id: Date.now(),
            equipmentName: document.getElementById("equipment-name").value,
            equipmentNumber: document.getElementById("equipment-number").value,
            category: document.getElementById("category").value,
            startTime: document.getElementById("start-time").value,
            endTime: document.getElementById("end-time").value,
            operatorName: document.getElementById("operator-name").value,
            usagePurpose: document.getElementById("usage-purpose").value,
            condition: document.getElementById("condition").value,
            issuesDetected: document.getElementById("issues-detected").value,
            lastMaintenance: document.getElementById("last-maintenance").value,
            nextMaintenance: document.getElementById("next-maintenance").value,
            status: determineStatus(document.getElementById("condition").value),
            image: saveImage()
        };

        // ✅ Insert New Entry at the Beginning
        equipmentData.unshift(newEntry);
        localStorage.setItem("equipmentUsage", JSON.stringify(equipmentData));

        // ✅ Redirect to Usage Page
        window.location.href = "index.html#usage";
    });

    // ✅ Determine Status Automatically
    function determineStatus(condition) {
        switch (condition.toLowerCase()) {
            case "good":
                return "Ready to Go";
            case "needs-checkup":
                return "Needs Servicing";
            case "damaged":
                return "Out of Service";
            default:
                return "Idle";
        }
    }

    // ✅ Save Uploaded Image to Local Storage
    function saveImage() {
        const fileInput = document.getElementById("upload-image");
        if (fileInput.files.length > 0) {
            const reader = new FileReader();
            reader.readAsDataURL(fileInput.files[0]);
            reader.onload = function () {
                localStorage.setItem(`image_${Date.now()}`, reader.result);
            };
            return `image_${Date.now()}`;
        }
        return null;
    };
});
