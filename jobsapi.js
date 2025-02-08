document.addEventListener("DOMContentLoaded", () => {
    updateJobStats();
    fetchJobs();
    loadJobsFromStorage();

    // Logout functionality
    const logoutBtn = document.getElementById("logout-btn");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", () => {
            localStorage.removeItem("user");
            window.location.href = "index.html";
        });
    }
});

// API Key
const API_KEY = "292b9e5d13655f0e6e05600ccbfbe4ac8fc38ab9834526fbb19166310a556fc2";

// Fetch job listings
async function fetchJobs() {
    const jobList = document.getElementById("job-list");
    jobList.innerHTML = '<li class="loading">Fetching jobs... ⏳</li>';

    const url = "https://api.apijobs.dev/v1/job/search";
    const options = {
        method: "POST",
        headers: {
            "apikey": API_KEY,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ q: "developer" })
    };

    try {
        const response = await fetch(url, options);
        const data = await response.json();

        jobList.innerHTML = '';  

        data.hits.forEach(job => {
            const jobItem = createJobCard(job, "applied");
            jobList.appendChild(jobItem);
        });

    } catch (error) {
        jobList.innerHTML = '<li>Error fetching jobs. Please try again later.</li>';
        console.error("Error fetching jobs:", error);
    }
}

// Create job card
function createJobCard(job, status) {
    const jobItem = document.createElement("div");
    jobItem.classList.add("kanban-item", "p-4", "rounded-lg", "shadow", "border");
    jobItem.dataset.status = status; // Track current status

    jobItem.innerHTML = `
        <h4 class="text-lg font-semibold">${job.title}</h4>
        <p><strong>Company:</strong> ${job.company_name || "N/A"}</p>
        <a href="${job.website_url}" target="_blank" class="text-blue-500 hover:underline">View Job</a>
        <button class="move-btn bg-green-500 text-white p-2 mt-2 rounded">Move to Interview</button>
    `;

    attachMoveEvent(jobItem);
    saveToLocalStorage(jobItem.outerHTML, status);
    
    return jobItem;
}

// Attach event listener for move buttons
function attachMoveEvent(jobItem) {
    jobItem.querySelector(".move-btn").addEventListener("click", function () {
        moveJob(jobItem);
    });
}

// Move job to the next stage
function moveJob(jobItem) {
    const currentStatus = jobItem.dataset.status;

    if (currentStatus === "applied") {
        document.getElementById("interview").querySelector(".kanban-items").appendChild(jobItem);
        jobItem.dataset.status = "interview";
        jobItem.querySelector(".move-btn").textContent = "Move to Offer";
        jobItem.querySelector(".move-btn").classList.replace("bg-green-500", "bg-blue-500");

    } else if (currentStatus === "interview") {
        document.getElementById("offer").querySelector(".kanban-items").appendChild(jobItem);
        jobItem.dataset.status = "offer";
        jobItem.querySelector(".move-btn").remove();
    }

    updateKanbanCounts();
    saveAllJobsToLocalStorage();
}

// Update job stats dynamically
function updateJobStats() {
    document.getElementById("total-apps").textContent = document.querySelectorAll('#applied .kanban-item').length;
    document.getElementById("total-interviews").textContent = document.querySelectorAll('#interview .kanban-item').length;
    document.getElementById("total-offers").textContent = document.querySelectorAll('#offer .kanban-item').length;
}

// Update Kanban board counts
function updateKanbanCounts() {
    document.getElementById("applied-count").textContent = document.querySelectorAll('#applied .kanban-item').length;
    document.getElementById("interview-count").textContent = document.querySelectorAll('#interview .kanban-item').length;
    document.getElementById("offer-count").textContent = document.querySelectorAll('#offer .kanban-item').length;

    updateJobStats();
}

// Save all jobs in the Kanban board to localStorage
function saveAllJobsToLocalStorage() {
    ["applied", "interview", "offer"].forEach(status => {
        const column = document.getElementById(status).querySelector(".kanban-items");
        const jobs = Array.from(column.children).map(job => job.outerHTML);
        localStorage.setItem(status, JSON.stringify(jobs));
    });
}

// Save job status in localStorage
function saveToLocalStorage(jobHTML, status) {
    let jobs = JSON.parse(localStorage.getItem(status)) || [];
    jobs.push(jobHTML);
    localStorage.setItem(status, JSON.stringify(jobs));
}

// Load jobs from localStorage on page reload
function loadJobsFromStorage() {
    ["applied", "interview", "offer"].forEach(status => {
        const columnElement = document.getElementById(status).querySelector(".kanban-items");
        const jobs = JSON.parse(localStorage.getItem(status)) || [];

        jobs.forEach(jobHTML => {
            const jobItem = document.createElement("div");
            jobItem.classList.add("kanban-item");
            jobItem.innerHTML = jobHTML;
            columnElement.appendChild(jobItem);

            attachMoveEvent(jobItem);
        });
    });

    updateKanbanCounts();
}
