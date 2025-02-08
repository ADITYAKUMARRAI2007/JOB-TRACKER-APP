document.addEventListener("DOMContentLoaded", () => {
    loadJobs();
    updateKanbanCounts();
});

// Fetch and display jobs from an API
function loadJobs() {
    const jobList = document.getElementById("job-list");

    // Dummy job data (Replace with API fetch call)
    const jobs = [
        { id: 1, title: "Software Engineer", company_name: "Google" },
        { id: 2, title: "Frontend Developer", company_name: "Facebook" },
        { id: 3, title: "Backend Developer", company_name: "Amazon" }
    ];

    jobList.innerHTML = ""; // Clear previous jobs

    jobs.forEach(job => {
        const jobItem = document.createElement("div");
        jobItem.classList.add("bg-white", "p-4", "rounded-lg", "shadow-md");
        jobItem.innerHTML = `
            <h3 class="text-lg font-semibold">${job.title}</h3>
            <p class="text-sm text-gray-500">${job.company_name}</p>
            <button class="apply-btn bg-blue-500 text-white px-3 py-1 mt-2 rounded">Apply</button>
        `;

        jobItem.querySelector(".apply-btn").addEventListener("click", () => applyForJob(job));
        jobList.appendChild(jobItem);
    });
}

// Function to handle job application
function applyForJob(job) {
    console.log("Applying for job:", job.title);
    addJobToKanban(job);
    alert(`You have applied for the job: ${job.title}`);
}

// Add job to Kanban Board
function addJobToKanban(job) {
    const appliedColumn = document.getElementById("applied").querySelector('.kanban-items');

    if (!appliedColumn) {
        console.error("Applied column not found in the DOM.");
        return;
    }

    const jobItem = document.createElement('div');
    jobItem.classList.add('kanban-item', 'bg-white', 'p-4', 'rounded-lg', 'shadow-md', 'mb-2');
    jobItem.innerHTML = `
        <h4 class="text-lg font-semibold">${job.title}</h4>
        <p class="text-sm text-gray-500">${job.company_name}</p>
        <div class="flex gap-2 mt-2">
            <button class="move-btn bg-blue-500 text-white px-2 py-1 rounded" data-status="interview">Move to Interview</button>
            <button class="move-btn bg-green-500 text-white px-2 py-1 rounded" data-status="offer">Move to Offer</button>
        </div>
    `;

    appliedColumn.appendChild(jobItem);
    updateKanbanCounts();

    // Add event listeners for moving jobs
    jobItem.querySelectorAll(".move-btn").forEach(btn => {
        btn.addEventListener("click", (e) => {
            const status = e.target.getAttribute("data-status");
            moveJobToColumn(jobItem, status);
        });
    });
}

// Move job item to the selected Kanban column
function moveJobToColumn(jobItem, status) {
    const column = document.getElementById(status).querySelector('.kanban-items');
    column.appendChild(jobItem);
    updateKanbanCounts();
}

// Function to update job stats dynamically
function updateKanbanCounts() {
    document.getElementById("applied-count").textContent = document.querySelectorAll('#applied .kanban-item').length;
    document.getElementById("interview-count").textContent = document.querySelectorAll('#interview .kanban-item').length;
    document.getElementById("offer-count").textContent = document.querySelectorAll('#offer .kanban-item').length;

    // Update overall statistics
    document.getElementById("total-apps").textContent = document.querySelectorAll('#applied .kanban-item').length;
    document.getElementById("total-interviews").textContent = document.querySelectorAll('#interview .kanban-item').length;
    document.getElementById("total-offers").textContent = document.querySelectorAll('#offer .kanban-item').length;
}
