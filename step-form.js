// document.addEventListener("DOMContentLoaded", function () {
//     const form = document.getElementById("step-form");

//     if (!form) {
//         console.error("❌ Maintenance form not found in DOM. Ensure the ID matches.");
//         return;
//     }

//     const steps = document.querySelectorAll(".form-step");
//     const progressSteps = document.querySelectorAll(".step");
//     const nextBtns = document.querySelectorAll(".next-step");
//     const prevBtns = document.querySelectorAll(".prev-step");
//     let currentStep = 0;

//     if (steps.length === 0) {
//         console.error("❌ No form steps found. Ensure your HTML has elements with class .form-step");
//         return;
//     }

//     steps[currentStep].classList.add("active");

//     function updateProgress() {
//         progressSteps.forEach((step, index) => {
//             step.classList.toggle("active", index <= currentStep);
//         });
//     }

//     function validateFields(step) {
//         let isValid = true;
//         const inputs = steps[step].querySelectorAll("input, textarea, select");

//         inputs.forEach(input => {
//             let errorMessage = input.nextElementSibling;
//             if (input.value.trim() === "") {
//                 input.style.border = "2px solid red";

//                 if (!errorMessage || !errorMessage.classList.contains("error-message")) {
//                     const error = document.createElement("span");
//                     error.textContent = "Please fill here.";
//                     error.classList.add("error-message");
//                     error.style.color = "red";
//                     error.style.fontSize = "12px";
//                     error.style.display = "block";
//                     error.style.marginTop = "5px";
//                     input.parentNode.insertBefore(error, input.nextSibling);
//                 }

//                 isValid = false;
//             } else {
//                 input.style.border = "1px solid #ddd";
//                 if (errorMessage && errorMessage.classList.contains("error-message")) {
//                     errorMessage.remove();
//                 }
//             }
//         });

//         return isValid;
//     }

//     nextBtns.forEach((button) => {
//         button.addEventListener("click", () => {
//             if (validateFields(currentStep)) {
//                 steps[currentStep].classList.remove("active");
//                 currentStep++;
//                 if (currentStep < steps.length) {
//                     steps[currentStep].classList.add("active");
//                     updateProgress();
//                 }
//             }
//         });
//     });

//     prevBtns.forEach((button) => {
//         button.addEventListener("click", () => {
//             steps[currentStep].classList.remove("active");
//             currentStep--;
//             steps[currentStep].classList.add("active");
//             updateProgress();
//         });
//     });

//     function convertToBase64(file) {
//         return new Promise((resolve, reject) => {
//             const reader = new FileReader();
//             reader.readAsDataURL(file);
//             reader.onload = () => resolve(reader.result);
//             reader.onerror = error => reject(error);
//         });
//     }

//     function loadExistingReport() {
//         const params = new URLSearchParams(window.location.search);
//         const reportId = params.get("id");
//         let records = JSON.parse(localStorage.getItem("maintenanceRecords")) || [];
//         let existingReport = records.find(report => report.id == reportId);

//         if (existingReport) {
//             document.getElementById("phone").value = existingReport.phone || "";
//             document.getElementById("security-question").value = existingReport.securityQuestion || "";

//             if (existingReport.uploadedFile) {
//                 let imageElement = document.createElement("img");
//                 imageElement.src = existingReport.uploadedFile;
//                 imageElement.style.maxWidth = "300px";
//                 document.getElementById("upload-docs").parentNode.appendChild(imageElement);
//             }

//             document.getElementById("equipment-name").value = existingReport.name || "";
//             document.getElementById("equipment-model").value = existingReport.model || "";
//             document.getElementById("equipment-issue").value = existingReport.issue || "";
//             document.getElementById("maintenance-date").value = existingReport.date || "";
//             document.getElementById("technician-name").value = existingReport.technician || "";
//             document.getElementById("actions-taken").value = existingReport.actions || "";
//             document.getElementById("maintenance-status").value = existingReport.status || "";

//             let hiddenInput = document.createElement("input");
//             hiddenInput.type = "hidden";
//             hiddenInput.id = "record-id";
//             hiddenInput.value = reportId;
//             form.appendChild(hiddenInput);
//         }
//     }

//     form.addEventListener("submit", async function (event) {
//         event.preventDefault();

//         if (validateFields(currentStep)) {
//             const params = new URLSearchParams(window.location.search);
//             const reportId = params.get("id");
//             let records = JSON.parse(localStorage.getItem("maintenanceRecords")) || [];

//             let uploadedFile = document.getElementById("upload-docs").files[0];
//             let fileBase64 = uploadedFile ? await convertToBase64(uploadedFile) : "";

//             let newReport = {
//                 id: reportId ? parseInt(reportId) : Date.now(),
//                 phone: document.getElementById("phone").value,
//                 uploadedFile: fileBase64,  // ✅ Store Image as Base64
//                 securityQuestion: document.getElementById("security-question").value,
//                 name: document.getElementById("equipment-name").value,
//                 model: document.getElementById("equipment-model").value,
//                 issue: document.getElementById("equipment-issue").value,
//                 date: document.getElementById("maintenance-date").value,
//                 technician: document.getElementById("technician-name").value,
//                 actions: document.getElementById("actions-taken").value,
//                 status: document.getElementById("maintenance-status").value
//             };

//             if (reportId) {
//                 let index = records.findIndex(report => report.id == reportId);
//                 if (index !== -1) {
//                     records[index] = newReport;
//                 }
//             } else {
//                 let duplicate = records.find(report => 
//                     report.phone === newReport.phone &&
//                     report.securityQuestion === newReport.securityQuestion &&
//                     report.uploadedFile === newReport.uploadedFile &&
//                     report.name === newReport.name &&
//                     report.model === newReport.model &&
//                     report.issue === newReport.issue &&
//                     report.date === newReport.date &&
//                     report.technician === newReport.technician &&
//                     report.actions === newReport.actions &&
//                     report.status === newReport.status
//                 );

//                 if (!duplicate) {
//                     records.push(newReport);
//                 } else {
//                     console.warn("⚠️ Duplicate entry detected, skipping save.");
//                 }
//             }

//             localStorage.setItem("maintenanceRecords", JSON.stringify(records));
//             updateStatusCount(newReport.status, newReport);
//             showConfirmationPopup();
//         }
//     });

//     function updateStatusCount(status, newRecord) {
//         let statusCounts = JSON.parse(localStorage.getItem("statusCounts")) || {
//             "draft": 0,
//             "in-progress": 0,
//             "in-review": 0,
//             "approved": 0,
//             "archived": 0,
//             "deleted": 0
//         };

//         if (statusCounts.hasOwnProperty(status)) {
//             statusCounts[status]++;
//             localStorage.setItem("statusCounts", JSON.stringify(statusCounts));
//         }
//     }

//     function showConfirmationPopup() {
//         const popup = document.createElement("div");
//         popup.classList.add("custom-popup");
//         popup.innerHTML = `
//             <div class="popup-content">
//                 <p>File Submitted Successfully!</p>
//                 <button id="popup-ok">OK</button>
//             </div>
//         `;
//         document.body.appendChild(popup);

//         setTimeout(() => {
//             const popupOkButton = document.getElementById("popup-ok");
//             if (popupOkButton) {
//                 popupOkButton.addEventListener("click", function () {
//                     window.location.href = "index.html";
//                 });
//             } else {
//                 console.error("❌ 'popup-ok' button not found.");
//             }
//         }, 100);
//     }

//     loadExistingReport();
// });



// document.addEventListener("DOMContentLoaded", function () {
//     const form = document.getElementById("step-form");

//     if (!form) {
//         console.error("❌ Maintenance form not found in DOM. Ensure the ID matches.");
//         return;
//     }

//     const steps = document.querySelectorAll(".form-step");
//     const progressSteps = document.querySelectorAll(".step");
//     const nextBtns = document.querySelectorAll(".next-step");
//     const prevBtns = document.querySelectorAll(".prev-step");
//     let currentStep = 0;

//     if (steps.length === 0) {
//         console.error("❌ No form steps found. Ensure your HTML has elements with class .form-step");
//         return;
//     }

//     steps[currentStep].classList.add("active");

//     function updateProgress() {
//         progressSteps.forEach((step, index) => {
//             step.classList.toggle("active", index <= currentStep);
//         });
//     }

//     function validateFields(step) {
//         let isValid = true;
//         const inputs = steps[step].querySelectorAll("input, textarea, select");

//         inputs.forEach(input => {
//             let errorMessage = input.nextElementSibling;
//             if (input.value.trim() === "") {
//                 input.style.border = "2px solid red";

//                 if (!errorMessage || !errorMessage.classList.contains("error-message")) {
//                     const error = document.createElement("span");
//                     error.textContent = "Please fill here.";
//                     error.classList.add("error-message");
//                     error.style.color = "red";
//                     error.style.fontSize = "12px";
//                     error.style.display = "block";
//                     error.style.marginTop = "5px";
//                     input.parentNode.insertBefore(error, input.nextSibling);
//                 }

//                 isValid = false;
//             } else {
//                 input.style.border = "1px solid #ddd";
//                 if (errorMessage && errorMessage.classList.contains("error-message")) {
//                     errorMessage.remove();
//                 }
//             }
//         });

//         return isValid;
//     }

//     nextBtns.forEach((button) => {
//         button.addEventListener("click", () => {
//             if (validateFields(currentStep)) {
//                 steps[currentStep].classList.remove("active");
//                 currentStep++;
//                 if (currentStep < steps.length) {
//                     steps[currentStep].classList.add("active");
//                     updateProgress();
//                 }
//             }
//         });
//     });

//     prevBtns.forEach((button) => {
//         button.addEventListener("click", () => {
//             steps[currentStep].classList.remove("active");
//             currentStep--;
//             steps[currentStep].classList.add("active");
//             updateProgress();
//         });
//     });

//     function loadExistingReport() {
//         const params = new URLSearchParams(window.location.search);
//         const reportId = params.get("id");
//         let records = JSON.parse(localStorage.getItem("maintenanceRecords")) || [];
//         let existingReport = records.find(report => report.id == reportId);

//         if (existingReport) {
//             document.getElementById("phone").value = existingReport.phone || "";
//             document.getElementById("security-question").value = existingReport.securityQuestion || "";

//             if (existingReport.uploadedFile) {
//                 let fileDisplay = document.createElement("p");
//                 fileDisplay.textContent = `Uploaded File: ${existingReport.uploadedFile}`;
//                 document.getElementById("upload-docs").parentNode.appendChild(fileDisplay);
//             }

//             document.getElementById("equipment-name").value = existingReport.name || "";
//             document.getElementById("equipment-model").value = existingReport.model || "";
//             document.getElementById("equipment-issue").value = existingReport.issue || "";
//             document.getElementById("maintenance-date").value = existingReport.date || "";
//             document.getElementById("technician-name").value = existingReport.technician || "";
//             document.getElementById("actions-taken").value = existingReport.actions || "";
//             document.getElementById("maintenance-status").value = existingReport.status || "";

//             let hiddenInput = document.createElement("input");
//             hiddenInput.type = "hidden";
//             hiddenInput.id = "record-id";
//             hiddenInput.value = reportId;
//             form.appendChild(hiddenInput);
//         }
//     }

//     form.addEventListener("submit", function (event) {
//         event.preventDefault();

//         if (validateFields(currentStep)) {
//             const params = new URLSearchParams(window.location.search);
//             const reportId = params.get("id");
//             let records = JSON.parse(localStorage.getItem("maintenanceRecords")) || [];

//             let uploadedFile = document.getElementById("upload-docs").files[0];
//             let fileName = uploadedFile ? uploadedFile.name : "";

//             let newReport = {
//                 id: reportId ? parseInt(reportId) : Date.now(),
//                 phone: document.getElementById("phone").value,
//                 uploadedFile: fileName,  // Store the file name
//                 securityQuestion: document.getElementById("security-question").value,
//                 name: document.getElementById("equipment-name").value,
//                 model: document.getElementById("equipment-model").value,
//                 issue: document.getElementById("equipment-issue").value,
//                 date: document.getElementById("maintenance-date").value,
//                 technician: document.getElementById("technician-name").value,
//                 actions: document.getElementById("actions-taken").value,
//                 status: document.getElementById("maintenance-status").value
//             };

//             if (reportId) {
//                 let index = records.findIndex(report => report.id == reportId);
//                 if (index !== -1) {
//                     records[index] = newReport;
//                 }
//             } else {
//                 // ✅ Prevent Duplicates: Check if an identical form exists before saving
//                 let duplicate = records.find(report => 
//                     report.phone === newReport.phone &&
//                     report.securityQuestion === newReport.securityQuestion &&
//                     report.uploadedFile === newReport.uploadedFile &&
//                     report.name === newReport.name &&
//                     report.model === newReport.model &&
//                     report.issue === newReport.issue &&
//                     report.date === newReport.date &&
//                     report.technician === newReport.technician &&
//                     report.actions === newReport.actions &&
//                     report.status === newReport.status
//                 );

//                 if (!duplicate) {
//                     records.push(newReport);
//                 } else {
//                     console.warn("⚠️ Duplicate entry detected, skipping save.");
//                 }
//             }

//             localStorage.setItem("maintenanceRecords", JSON.stringify(records));
//             updateStatusCount(newReport.status, newReport);
//             showConfirmationPopup();
//         }
//     });

//     function updateStatusCount(status, newRecord) {
//         let statusCounts = JSON.parse(localStorage.getItem("statusCounts")) || {
//             "draft": 0,
//             "in-progress": 0,
//             "in-review": 0,
//             "approved": 0,
//             "archived": 0,
//             "deleted": 0
//         };

//         if (statusCounts.hasOwnProperty(status)) {
//             statusCounts[status]++;
//             localStorage.setItem("statusCounts", JSON.stringify(statusCounts));
//         }
//     }

//     function showConfirmationPopup() {
//         const popup = document.createElement("div");
//         popup.classList.add("custom-popup");
//         popup.innerHTML = `
//             <div class="popup-content">
//                 <p>File Submitted Successfully!</p>
//                 <button id="popup-ok">OK</button>
//             </div>
//         `;
//         document.body.appendChild(popup);

//         setTimeout(() => {
//             const popupOkButton = document.getElementById("popup-ok");
//             if (popupOkButton) {
//                 popupOkButton.addEventListener("click", function () {
//                     window.location.href = "index.html";
//                 });
//             } else {
//                 console.error("❌ 'popup-ok' button not found.");
//             }
//         }, 100);
//     }

//     loadExistingReport();
// });



document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("step-form");

    if (!form) {
        console.error("❌ Maintenance form not found in DOM. Ensure the ID matches.");
        return;
    }

    const steps = document.querySelectorAll(".form-step");
    const progressSteps = document.querySelectorAll(".step");
    const nextBtns = document.querySelectorAll(".next-step");
    const prevBtns = document.querySelectorAll(".prev-step");
    let currentStep = 0;

    if (steps.length === 0) {
        console.error("❌ No form steps found. Ensure your HTML has elements with class .form-step");
        return;
    }

    steps[currentStep].classList.add("active");

    function updateProgress() {
        progressSteps.forEach((step, index) => {
            step.classList.toggle("active", index <= currentStep);
        });
    }

    function validateFields(step) {
        let isValid = true;
        const inputs = steps[step].querySelectorAll("input, textarea, select");

        inputs.forEach(input => {
            let errorMessage = input.nextElementSibling;
            if (input.value.trim() === "") {
                input.style.border = "2px solid red";

                if (!errorMessage || !errorMessage.classList.contains("error-message")) {
                    const error = document.createElement("span");
                    error.textContent = "Please fill here.";
                    error.classList.add("error-message");
                    error.style.color = "red";
                    error.style.fontSize = "12px";
                    error.style.display = "block";
                    error.style.marginTop = "5px";
                    input.parentNode.insertBefore(error, input.nextSibling);
                }

                isValid = false;
            } else {
                input.style.border = "1px solid #ddd";
                if (errorMessage && errorMessage.classList.contains("error-message")) {
                    errorMessage.remove();
                }
            }
        });

        return isValid;
    }

    nextBtns.forEach((button) => {
        button.addEventListener("click", () => {
            if (validateFields(currentStep)) {
                steps[currentStep].classList.remove("active");
                currentStep++;
                if (currentStep < steps.length) {
                    steps[currentStep].classList.add("active");
                    updateProgress();
                }
            }
        });
    });

    prevBtns.forEach((button) => {
        button.addEventListener("click", () => {
            steps[currentStep].classList.remove("active");
            currentStep--;
            steps[currentStep].classList.add("active");
            updateProgress();
        });
    });

    function convertToBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });
    }

    function loadExistingReport() {
        const params = new URLSearchParams(window.location.search);
        const reportId = params.get("id");
        let records = JSON.parse(localStorage.getItem("maintenanceRecords")) || [];
        let existingReport = records.find(report => report.id == reportId);

        if (existingReport) {
            document.getElementById("phone").value = existingReport.phone || "";
            document.getElementById("security-question").value = existingReport.securityQuestion || "";

            if (existingReport.uploadedFile) {
                let imageElement = document.createElement("img");
                imageElement.src = existingReport.uploadedFile;
                imageElement.style.maxWidth = "300px";
                document.getElementById("upload-docs").parentNode.appendChild(imageElement);
            }

            document.getElementById("equipment-name").value = existingReport.name || "";
            document.getElementById("equipment-model").value = existingReport.model || "";
            document.getElementById("equipment-issue").value = existingReport.issue || "";
            document.getElementById("maintenance-date").value = existingReport.date || "";
            document.getElementById("technician-name").value = existingReport.technician || "";
            document.getElementById("actions-taken").value = existingReport.actions || "";
            document.getElementById("maintenance-status").value = existingReport.status || "";

            let hiddenInput = document.createElement("input");
            hiddenInput.type = "hidden";
            hiddenInput.id = "record-id";
            hiddenInput.value = reportId;
            form.appendChild(hiddenInput);
        }
    }

    form.addEventListener("submit", async function (event) {
        event.preventDefault();

        if (validateFields(currentStep)) {
            const params = new URLSearchParams(window.location.search);
            const reportId = params.get("id");
            let records = JSON.parse(localStorage.getItem("maintenanceRecords")) || [];

            let uploadedFile = document.getElementById("upload-docs").files[0];
            let fileBase64 = uploadedFile ? await convertToBase64(uploadedFile) : "";

            let newReport = {
                id: reportId ? parseInt(reportId) : Date.now(),
                phone: document.getElementById("phone").value,
                uploadedFile: fileBase64,  // ✅ Store Image as Base64
                securityQuestion: document.getElementById("security-question").value,
                name: document.getElementById("equipment-name").value,
                model: document.getElementById("equipment-model").value,
                issue: document.getElementById("equipment-issue").value,
                date: document.getElementById("maintenance-date").value,
                technician: document.getElementById("technician-name").value,
                actions: document.getElementById("actions-taken").value,
                status: document.getElementById("maintenance-status").value
            };

            if (reportId) {
                let index = records.findIndex(report => report.id == reportId);
                if (index !== -1) {
                    records[index] = newReport;
                }
            } else {
                let duplicate = records.find(report => 
                    report.phone === newReport.phone &&
                    report.securityQuestion === newReport.securityQuestion &&
                    report.uploadedFile === newReport.uploadedFile &&
                    report.name === newReport.name &&
                    report.model === newReport.model &&
                    report.issue === newReport.issue &&
                    report.date === newReport.date &&
                    report.technician === newReport.technician &&
                    report.actions === newReport.actions &&
                    report.status === newReport.status
                );

                if (!duplicate) {
                    records.push(newReport);
                } else {
                    console.warn("⚠️ Duplicate entry detected, skipping save.");
                }
            }

            localStorage.setItem("maintenanceRecords", JSON.stringify(records));
            updateStatusCount(newReport.status, newReport);
            showConfirmationPopup();
        }
    });

    function updateStatusCount(status, newRecord) {
        let statusCounts = JSON.parse(localStorage.getItem("statusCounts")) || {
            "draft": 0,
            "in-progress": 0,
            "in-review": 0,
            "approved": 0,
            "archived": 0,
            "deleted": 0
        };

        if (statusCounts.hasOwnProperty(status)) {
            statusCounts[status]++;
            localStorage.setItem("statusCounts", JSON.stringify(statusCounts));
        }
    }

    function showConfirmationPopup() {
        const popup = document.createElement("div");
        popup.classList.add("custom-popup");
        popup.innerHTML = `
            <div class="popup-content">
                <p>File Submitted Successfully!</p>
                <button id="popup-ok">OK</button>
            </div>
        `;
        document.body.appendChild(popup);

        setTimeout(() => {
            const popupOkButton = document.getElementById("popup-ok");
            if (popupOkButton) {
                popupOkButton.addEventListener("click", function () {
                    window.location.href = "index.html";
                });
            } else {
                console.error("❌ 'popup-ok' button not found.");
            }
        }, 100);
    }

    loadExistingReport();
});

