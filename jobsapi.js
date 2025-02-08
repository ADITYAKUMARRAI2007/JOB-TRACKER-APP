document.addEventListener("DOMContentLoaded", () => {
    // Initialize job stats
    updateJobStats();

    // Logout functionality
    const logoutBtn = document.getElementById("logout-btn");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", () => {
            localStorage.removeItem("user");
            window.location.href = "index.html";
        });
    }

    // Google Calendar Integration
    document.getElementById("calendar-form").addEventListener("submit", function (e) {
        e.preventDefault();

        const title = document.getElementById("event-title").value;
        const dateTime = document.getElementById("event-time").value;

        if (!title || !dateTime) {
            alert("Please fill all fields");
            return;
        }

        const formattedTime = new Date(dateTime).toISOString().replace(/-|:|\.\d+/g, "");
        const googleCalendarUrl = `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${formattedTime}/${formattedTime}`;

        window.open(googleCalendarUrl, "_blank");
    });

    // Fetch job listings
    fetchJobs();
});

const API_KEY = "YOUR_API_KEY_HERE";

// Fetch job listings from API
async function fetchJobs() {
    const jobList = document.getElementById("job-list");
    if (!jobList) return;
    jobList.innerHTML = '<li class="loading">Fetching jobs... ⏳</li>';

    try {
        const response = await fetch("https://api.apijobs.dev/v1/job/search", {
            method: "POST",
            headers: {
                "apikey": API_KEY,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ q: "developer" })
        });
        const data = await response.json();

        jobList.innerHTML = "";
        if (data?.hits?.length) {
            data.hits.forEach(job => addJobToList(job));
        } else {
            jobList.innerHTML = '<li>No jobs found.</li>';
        }
    } catch (error) {
        jobList.innerHTML = '<li>Error fetching jobs.</li>';
        console.error("Error fetching jobs:", error);
    }
}

// Add job to job listing section
function addJobToList(job) {
    const jobList = document.getElementById("job-list");
    const jobItem = document.createElement("li");
    jobItem.innerHTML = `
        <h3>${job.title}</h3>
        <p><strong>Company:</strong> ${job.company_name || "Not Provided"}</p>
        <p><strong>Location:</strong> ${job.city}, ${job.country}</p>
        <p><strong>Description:</strong> ${job.description?.substring(0, 200) || "No description available"}...</p>
        <a href="${job.website_url}" target="_blank">View Job</a>
        <button class="apply-btn">Apply</button>
    `;
    jobList.appendChild(jobItem);

    jobItem.querySelector(".apply-btn").addEventListener("click", () => applyForJob(job));
}

// Handle job application
function applyForJob(job) {
    addJobToKanban(job);
    alert(`You have applied for: ${job.title}`);
}

// Add job to Kanban Board
function addJobToKanban(job) {
    const jobItem = document.createElement("div");
    jobItem.classList.add("kanban-item");
    jobItem.innerHTML = `
        <h4>${job.title}</h4>
        <p>${job.company_name || "No company name"}</p>
        <button class="move-btn" data-status="interview">Move to Interview</button>
        <button class="move-btn" data-status="offer">Move to Offer</button>
    `;

    document.querySelector("#applied .kanban-items").appendChild(jobItem);
    updateKanbanCounts();

    jobItem.querySelectorAll(".move-btn").forEach(btn => {
        btn.addEventListener("click", (e) => {
            moveJobToColumn(jobItem, e.target.dataset.status);
        });
    });
}

// Move job item between Kanban columns
function moveJobToColumn(jobItem, status) {
    const targetColumn = document.querySelector(`#${status} .kanban-items`);
    if (targetColumn) {
        targetColumn.appendChild(jobItem);
        updateKanbanCounts();
    }
}

// Update job statistics
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
