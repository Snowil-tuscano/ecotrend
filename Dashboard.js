document.addEventListener("DOMContentLoaded", async function () {

    const params = new URLSearchParams(window.location.search);
    const name = params.get("name");

    let namer=name

    try {
        const res = await fetch(`http://localhost:3000/student-dashboard?name=${name}`);
        const data = await res.json();

        // Get chart context
        let ctx = document.getElementById('innovationGraph').getContext('2d');

        // Initialize monthly progress data from either root level or first project
        let monthlyProgress = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]; // Default zeros

        // First try to get data from root level (older data structure)
        if (data.pro_jan !== undefined || data.pro_feb !== undefined || data.pro_mar !== undefined || data.pro_apr !== undefined) {
            monthlyProgress = [
                data.pro_jan || 0,
                data.pro_feb || 0,
                data.pro_mar || 0,
                data.pro_apr || 0,
                data.pro_may || 0,
                data.pro_june || 0,
                data.pro_jul || 0,
                data.pro_aug || 0,
                data.pro_sep || 0,
                data.pro_oct || 0,
                data.pro_nov || 0,
                data.pro_dec || 0
            ];
        }
        // Then check if we have project data and use the first project's pro_apr for April
        else if (data.projects && data.projects.length > 0 && data.projects[0].pro_apr) {
            // Use the pro_apr value from the first project for April (index 3)
            monthlyProgress[3] = data.projects[0].pro_apr;
        }

        console.log("Monthly Progress Data:", monthlyProgress); 

        // Chart.js Bar Chart
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
                datasets: [{
                    label: 'Innovation Progress',
                    data: monthlyProgress,
                    backgroundColor: [
                        '#3a164f', '#3a164f', '#3a164f', '#c4b5fd', '#3a164f', '#3a164f',
                        '#3a164f', '#3a164f', '#3a164f', '#3a164f', '#3a164f', '#3a164f'
                    ],
                    borderWidth: 1,
                    borderRadius: 5
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            font: {
                                size: 12
                            }
                        }
                    },
                    x: {
                        ticks: {
                            font: {
                                size: 12
                            }
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: true,
                        position: 'top'
                    }
                }
            }
        });
        prog1=document.getElementsByClassName("progress")[0]
        prog1.style.width ="3px";
        prog2=document.getElementsByClassName("progress")[1].style.width ="3px";
        prog3=document.getElementsByClassName("progress")[2].style.width ="3px";

        // Check if metrics array exists before trying to access it
        if (data.metrics && data.metrics.length >= 3) {
            prog1.style.width = `${data.metrics[0]}%`;
            prog2.style.width = `${data.metrics[1]}%`;
            prog3.style.width = `${data.metrics[2]}%`;
        } else if (data.projects && data.projects.length > 0 && data.projects[0].metrics) {
            // Try to get metrics from the first project if available
            document.getElementsByClassName("progress")[0].style.width = `${data.projects[0].metrics[0]}%`;
            document.getElementsByClassName("progress")[1].style.width = `${data.projects[0].metrics[1]}%`;
            document.getElementsByClassName("progress")[2].style.width = `${data.projects[0].metrics[2]}%`;
        }

        const impactEl = document.getElementById("impactPercentage");
        if (impactEl) {
            if (data.sustainableImpact) {
                impactEl.textContent = `${data.sustainableImpact}%`;
            } else if (data.projects && data.projects.length > 0 && data.projects[0].sustainableImpact) {
                impactEl.textContent = `${data.projects[0].sustainableImpact}%`;
            }
        }

        // Fix: Use correct class name "actions-list" instead of "actionlist"
        const actionsList = document.getElementsByClassName("actions-list")[0];
        if (actionsList) {
            if (data.sustainableActions && data.sustainableActions.length > 0) {
                actionsList.innerHTML = data.sustainableActions.map(action => `<li>${action}</li>`).join("");
            } else if (data.projects && data.projects.length > 0 && data.projects[0].sustainableActions) {
                actionsList.innerHTML = data.projects[0].sustainableActions.map(action => `<li>${action}</li>`).join("");
            }
        }

    } catch (error) {
        console.error("Error fetching data:", error);
    }

    // Button click to open popup
    document.getElementsByClassName("btn1")[0].addEventListener("click", () => {
        const addpage = document.createElement("div");
        addpage.style.position = "fixed";
        addpage.style.top = "50%";
        addpage.style.left = "50%";
        addpage.style.transform = "translate(-50%, -50%)";
        addpage.style.width = "450px";
        addpage.style.maxHeight = "90vh";
        addpage.style.backgroundColor = "#f9f9f9";
        addpage.style.border = "1px solid #ccc";
        addpage.style.padding = "30px 20px 20px";
        addpage.style.overflowY = "auto";
        addpage.style.zIndex = "1000";
        addpage.style.boxShadow = "0 8px 16px rgba(0,0,0,0.3)";
        addpage.style.borderRadius = "12px";

        // Cancel (X) button
        const cancelButton = document.createElement("button");
        cancelButton.innerText = "✖";
        cancelButton.style.position = "absolute";
        cancelButton.style.top = "10px";
        cancelButton.style.right = "10px";
        cancelButton.style.border = "none";
        cancelButton.style.background = "transparent";
        cancelButton.style.fontSize = "24px";
        cancelButton.style.cursor = "pointer";
        cancelButton.style.color = "#888";
        addpage.appendChild(cancelButton);

        cancelButton.addEventListener("click", () => {
            document.body.removeChild(addpage);
        });

        // Create input field
        function createInput(type, placeholder) {
            const input = document.createElement("input");
            input.type = type;
            input.placeholder = placeholder;
            input.style.display = "block";
            input.style.margin = "10px auto";
            input.style.width = "85%";
            input.style.padding = "8px";
            input.style.fontSize = "14px";
            input.style.border = "1px solid #ccc";
            input.style.borderRadius = "6px";
            input.style.boxSizing = "border-box";
            return input;
        }

        // Project Name
        const projectName = createInput("text", "Project Name");
        addpage.appendChild(projectName);

        // Innovative Progress
        const innovativeProgress = createInput("number", "Innovative Progress done in current month (%)");
        addpage.appendChild(innovativeProgress);

        // Sustainable Metrics
        const sustainableMetricsLabel = document.createElement("label");
        sustainableMetricsLabel.innerText = "Sustainable Metrics (multiple values)";
        sustainableMetricsLabel.style.display = "block";
        sustainableMetricsLabel.style.textAlign = "center";
        sustainableMetricsLabel.style.margin = "15px 0 5px";
        sustainableMetricsLabel.style.fontWeight = "bold";
        addpage.appendChild(sustainableMetricsLabel);

        const metricInputs = [];

        const metricInput = createInput("number", "Overall Pollution Reduction (%)");
        metricInput.max = "100";
        metricInputs.push(metricInput);
        addpage.appendChild(metricInput);

        const metricInput1 = createInput("number", "Renewable Energy Use (%)");
        metricInput1.max = "100";
        metricInputs.push(metricInput1);
        addpage.appendChild(metricInput1);

        const metricInput2 = createInput("number", "Animal Well-being (%)");
        metricInput2.max = "100";
        metricInputs.push(metricInput2);
        addpage.appendChild(metricInput2);

        // Sustainable Actions
        const sustainableImpactLabel = document.createElement("label");
        sustainableImpactLabel.innerText = "Sustainable Actions Undertaken (multiple values)";
        sustainableImpactLabel.style.display = "block";
        sustainableImpactLabel.style.textAlign = "center";
        sustainableImpactLabel.style.margin = "15px 0 5px";
        sustainableImpactLabel.style.fontWeight = "bold";
        addpage.appendChild(sustainableImpactLabel);

        const sustainableImpactArray = [];

        const impactInput = createInput("text", "Add Sustainable Impact");
        addpage.appendChild(impactInput);

        const addImpactButton = document.createElement("button");
        addImpactButton.innerText = "Add Sustainable Action";
        addImpactButton.style.display = "block";
        addImpactButton.style.margin = "5px auto 15px";
        addImpactButton.style.padding = "7px 14px";
        addImpactButton.style.backgroundColor = "#28a745";
        addImpactButton.style.color = "#fff";
        addImpactButton.style.border = "none";
        addImpactButton.style.borderRadius = "5px";
        addImpactButton.style.cursor = "pointer";
        addpage.appendChild(addImpactButton);

        const impactList = document.createElement("ul");
        impactList.style.margin = "10px auto";
        impactList.style.width = "80%";
        impactList.style.paddingLeft = "20px";
        impactList.style.fontSize = "14px";
        addpage.appendChild(impactList);

        addImpactButton.addEventListener("click", () => {
            const impactValue = impactInput.value.trim();
            if (impactValue) {
                sustainableImpactArray.push(impactValue);
                const listItem = document.createElement("li");
                listItem.innerText = impactValue;
                impactList.appendChild(listItem);
                impactInput.value = "";
            }
        });

        // Sustainable Impact Ratio
        const sustainableRatio = createInput("number", "Sustainable Impact (%)");
        sustainableRatio.max = "100";
        addpage.appendChild(sustainableRatio);

        // Submit Button
        const submitButton = document.createElement("button");
        submitButton.innerText = "Submit";
        submitButton.style.display = "block";
        submitButton.style.margin = "20px auto 0";
        submitButton.style.padding = "10px 20px";
        submitButton.style.backgroundColor = "#007BFF";
        submitButton.style.color = "white";
        submitButton.style.border = "none";
        submitButton.style.borderRadius = "6px";
        submitButton.style.cursor = "pointer";
        submitButton.style.width = "50%";
        addpage.appendChild(submitButton);

        submitButton.addEventListener("click", async (event) => {
            event.preventDefault();

            // Disable and show loading spinner
            submitButton.innerHTML = "⏳ Submitting...";
            submitButton.disabled = true;
            submitButton.style.backgroundColor = "#6c757d";

            const projectData = {
                username: name,
                projectName: projectName.value,
                pro_apr: Number(innovativeProgress.value),
                metrics: metricInputs.map(input => Number(input.value)),
                sustainableActions: sustainableImpactArray,
                sustainableImpact: Number(sustainableRatio.value)
            };

            if (!projectData.projectName || isNaN(projectData.pro_apr) || projectData.metrics.includes(NaN) || isNaN(projectData.sustainableImpact)) {
                alert("Please fill all fields correctly");
                submitButton.innerText = "Submit";
                submitButton.disabled = false;
                submitButton.style.backgroundColor = "#007BFF";
                return;
            }

            try {
                const response = await fetch("http://localhost:3000/AddProject", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(projectData)
                });

                const result = await response.json();

                if (response.ok) {
                    try {
                        document.body.removeChild(addpage);
                    } catch (removeErr) {
                        console.error("Error removing popup:", removeErr);
                    }
                    alert("Project Submitted Successfully ✅");
                    window.location.reload();
                } else {
                    console.warn("Server responded with an error:", result);
                    alert(result.message || "Submission Failed ❌");
                    submitButton.innerText = "Submit";
                    submitButton.disabled = false;
                    submitButton.style.backgroundColor = "#007BFF";
                }

            } catch (error) {
                console.error("Fetch error:", error);
                alert("Server error 🚨");
                submitButton.innerText = "Submit";
                submitButton.disabled = false;
                submitButton.style.backgroundColor = "#007BFF";
            }
        });

        document.body.appendChild(addpage);
    });
});


// Button click to open delete project modal
document.getElementsByClassName("btn2")[0].addEventListener("click", () => {
    const deletePage = document.createElement("div");
    deletePage.style.position = "fixed";
    deletePage.style.top = "50%";
    deletePage.style.left = "50%";
    deletePage.style.transform = "translate(-50%, -50%)";
    deletePage.style.width = "400px";
    deletePage.style.backgroundColor = "#f9f9f9";
    deletePage.style.border = "1px solid #ccc";
    deletePage.style.padding = "30px 20px 20px";
    deletePage.style.zIndex = "1000";
    deletePage.style.boxShadow = "0 8px 16px rgba(0,0,0,0.3)";
    deletePage.style.borderRadius = "12px";

    // Cancel (X) button
    const cancelButton = document.createElement("button");
    cancelButton.innerText = "✖";
    cancelButton.style.position = "absolute";
    cancelButton.style.top = "10px";
    cancelButton.style.right = "10px";
    cancelButton.style.border = "none";
    cancelButton.style.background = "transparent";
    cancelButton.style.fontSize = "24px";
    cancelButton.style.cursor = "pointer";
    cancelButton.style.color = "#888";
    deletePage.appendChild(cancelButton);

    cancelButton.addEventListener("click", () => {
        document.body.removeChild(deletePage);
    });

    // Title
    const title = document.createElement("h3");
    title.innerText = "Delete Project";
    title.style.textAlign = "center";
    title.style.marginBottom = "20px";
    deletePage.appendChild(title);

    // Warning text
    const warningText = document.createElement("p");
    warningText.innerText = "Please enter the name of the project you want to delete. This action cannot be undone.";
    warningText.style.color = "#dc3545";
    warningText.style.textAlign = "center";
    warningText.style.fontSize = "14px";
    warningText.style.marginBottom = "20px";
    deletePage.appendChild(warningText);

    // Create input field for project name
    const projectNameInput = document.createElement("input");
    projectNameInput.type = "text";
    projectNameInput.placeholder = "Project Name";
    projectNameInput.style.display = "block";
    projectNameInput.style.margin = "10px auto";
    projectNameInput.style.width = "85%";
    projectNameInput.style.padding = "8px";
    projectNameInput.style.fontSize = "14px";
    projectNameInput.style.border = "1px solid #ccc";
    projectNameInput.style.borderRadius = "6px";
    projectNameInput.style.boxSizing = "border-box";
    deletePage.appendChild(projectNameInput);

    // Submit Button
    const deleteButton = document.createElement("button");
    deleteButton.innerText = "Delete Project";
    deleteButton.style.display = "block";
    deleteButton.style.margin = "20px auto 0";
    deleteButton.style.padding = "10px 20px";
    deleteButton.style.backgroundColor = "#dc3545"; // Red button for delete
    deleteButton.style.color = "white";
    deleteButton.style.border = "none";
    deleteButton.style.borderRadius = "6px";
    deleteButton.style.cursor = "pointer";
    deleteButton.style.width = "50%";
    deletePage.appendChild(deleteButton);

    deleteButton.addEventListener("click", async () => {
        const projectName = projectNameInput.value.trim();
        if (!projectName) {
            alert("Please enter a project name");
            return;
        }
    
        // Confirm delete
        const confirmDelete = confirm(`Are you sure you want to delete the project: "${projectName}"?`);
        if (!confirmDelete) {
            return;
        }
    
        // Get username from URL params
        const params = new URLSearchParams(window.location.search);
        const username = params.get("name"); // Make sure we use the fresh value
        
        if (!username) {
            alert("Username not found. Please try logging in again.");
            return;
        }
    
        console.log("Attempting to delete project with:", { username, projectName }); // Debug log
    
        // Disable and show loading state
        deleteButton.innerHTML = "⏳ Deleting...";
        deleteButton.disabled = true;
        deleteButton.style.backgroundColor = "#6c757d";
    
        try {
            const response = await fetch("http://localhost:3000/DeleteProject", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    username: username, // Use the fresh username from URL params
                    projectName: projectName
                })
            });
    
            const result = await response.json();
    
            if (response.ok) {
                document.body.removeChild(deletePage);
                alert("Project deleted successfully ✅");
                window.location.reload();
            } else {
                alert(result.message || "Failed to delete project ❌");
                deleteButton.innerText = "Delete Project";
                deleteButton.disabled = false;
                deleteButton.style.backgroundColor = "#dc3545";
            }
        } catch (error) {
            console.error("Error deleting project:", error);
            alert("Server error 🚨");
            deleteButton.innerText = "Delete Project";
            deleteButton.disabled = false;
            deleteButton.style.backgroundColor = "#dc3545";
        }
    });

    document.body.appendChild(deletePage);
});