document.addEventListener("DOMContentLoaded", function () {
    const params = new URLSearchParams(window.location.search);
    const reportId = params.get("id");
    let records = JSON.parse(localStorage.getItem("maintenanceRecords")) || [];
    let report = records.find(r => r.id == reportId);

    if (report) {
        document.getElementById("view-phone").textContent = report.phone || "N/A";
        document.getElementById("view-uploaded-file").textContent = report.uploadedFile ? "File uploaded" : "No file uploaded";
        document.getElementById("view-security-question").textContent = report.securityQuestion || "N/A";
        document.getElementById("view-equipment-name").textContent = report.name || "N/A";
        document.getElementById("view-equipment-model").textContent = report.model || "N/A";
        document.getElementById("view-equipment-issue").textContent = report.issue || "N/A";
        document.getElementById("view-maintenance-date").textContent = report.date || "N/A";
        document.getElementById("view-technician-name").textContent = report.technician || "N/A";
        document.getElementById("view-actions-taken").textContent = report.actions || "N/A";
        document.getElementById("view-maintenance-status").textContent = report.status || "N/A";

        // ✅ Display Uploaded Image
        if (report.uploadedFile) {
            let imgElement = document.getElementById("view-upload-img");
            imgElement.src = report.uploadedFile;
            imgElement.style.display = "block";  // Ensure it's visible
        }

        // ✅ Export as Word (DOCX)
        document.getElementById("export-doc").addEventListener("click", function () {
            let content = `
                <html>
                    <head><meta charset="UTF-8"><title>Maintenance Report</title></head>
                    <body>
                        <h2>Maintenance Report</h2>
                        <p><strong>Phone:</strong> ${report.phone}</p>
                        <p><strong>Security Question:</strong> ${report.securityQuestion}</p>
                        <p><strong>Equipment Name:</strong> ${report.name}</p>
                        <p><strong>Model:</strong> ${report.model}</p>
                        <p><strong>Issue:</strong> ${report.issue}</p>
                        <p><strong>Date:</strong> ${report.date}</p>
                        <p><strong>Technician:</strong> ${report.technician}</p>
                        <p><strong>Actions Taken:</strong> ${report.actions}</p>
                        <p><strong>Status:</strong> ${report.status}</p>
                        ${report.uploadedFile ? `<p><strong>Uploaded File:</strong> <br><img src="${report.uploadedFile}" style="max-width:300px;"></p>` : ""}
                    </body>
                </html>
            `;

            let blob = new Blob([content], { type: "application/msword" });
            let link = document.createElement("a");
            link.href = URL.createObjectURL(blob);
            link.download = "Maintenance_Report.doc";
            link.click();
        });

        // ✅ Export as Excel (CSV)
        document.getElementById("export-excel").addEventListener("click", function () {
            let tableData = [
                ["Field", "Value"],
                ["Phone", report.phone || "N/A"],
                ["Uploaded File", report.uploadedFile ? "File uploaded" : "No file uploaded"],
                ["Security Question", report.securityQuestion || "N/A"],
                ["Equipment Name", report.name || "N/A"],
                ["Equipment Model", report.model || "N/A"],
                ["Issue", report.issue || "N/A"],
                ["Maintenance Date", report.date || "N/A"],
                ["Technician Name", report.technician || "N/A"],
                ["Actions Taken", report.actions || "N/A"],
                ["Status", report.status || "N/A"]
            ];

            let csvContent = "data:text/csv;charset=utf-8," 
                + tableData.map(row => row.join(",")).join("\n");

            let encodedUri = encodeURI(csvContent);
            let link = document.createElement("a");
            link.setAttribute("href", encodedUri);
            link.setAttribute("download", "Maintenance_Report.csv");
            document.body.appendChild(link);
            link.click();
        });
    } else {
        console.error("❌ Report not found. Ensure the ID is correct.");
    }
});


