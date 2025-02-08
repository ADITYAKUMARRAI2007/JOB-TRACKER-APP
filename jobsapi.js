document.addEventListener("DOMContentLoaded", () => {
    updateJobStats();
    fetchJobs();

    const logoutBtn = document.getElementById("logout-btn");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", () => {
            localStorage.removeItem("user");
            window.location.href = "index.html";
        });
    }
});

const API_KEY = "292b9e5d13655f0e6e05600ccbfbe4ac8fc38ab9834526fbb19166310a556fc2";

async function fetchJobs() {
    const jobList = document.getElementById("job-list");
    if (!jobList) return;
    jobList.innerHTML = '<p class="loading">Fetching jobs... ⏳</p>';

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
            jobList.innerHTML = '<p>No jobs found.</p>';
        }
    } catch (error) {
        jobList.innerHTML = '<p>Error fetching jobs.</p>';
        console.error("Error fetching jobs:", error);
    }
}

function addJobToList(job) {
    const jobList = document.getElementById("job-list");
    const jobItem = document.createElement("div");
    jobItem.classList.add("job-item", "bg-white", "p-4", "rounded-lg", "shadow-lg");

    jobItem.innerHTML = `
        <h3 class="text-xl font-semibold">${job.title}</h3>
        <p><strong>Company:</strong> ${job.company_name || "Not Provided"}</p>
        <p><strong>Location:</strong> ${job.city || "Unknown"}, ${job.country || "Unknown"}</p>
        <p><strong>Description:</strong> ${job.description?.substring(0, 150) || "No description available"}...</p>
        <a href="${job.website_url}" target="_blank" class="text-blue-600">View Job</a>
        <button class="apply-btn bg-blue-500 text-white px-4 py-2 rounded mt-2">Apply</button>
    `;

    jobList.appendChild(jobItem);
    jobItem.querySelector(".apply-btn").addEventListener("click", () => applyForJob(job));
}

function applyForJob(job) {
    addJobToKanban(job);
    alert(`You have applied for: ${job.title}`);
}

function addJobToKanban(job) {
    const jobItem = document.createElement("div");
    jobItem.classList.add("kanban-item", "bg-gray-200", "p-3", "rounded-lg", "shadow");

    jobItem.innerHTML = `
        <h4 class="font-semibold">${job.title}</h4>
        <p>${job.company_name || "No company name"}</p>
        <button class="move-btn bg-yellow-500 text-white px-2 py-1 rounded mt-2" data-status="interview">Move to Interview</button>
        <button class="move-btn bg-green-500 text-white px-2 py-1 rounded mt-2" data-status="offer">Move to Offer</button>
    `;

    document.querySelector("#applied .kanban-items").appendChild(jobItem);
    updateKanbanCounts();

    jobItem.querySelectorAll(".move-btn").forEach(btn => {
        btn.addEventListener("click", (e) => {
            moveJobToColumn(jobItem, e.target.dataset.status, job);
        });
    });
}

function moveJobToColumn(jobItem, status, job) {
    const targetColumn = document.querySelector(`#${status} .kanban-items`);
    if (targetColumn) {
        targetColumn.appendChild(jobItem);
        updateKanbanCounts();
    }
    
    if (status === "interview") {
        redirectToGoogleCalendar(job);
    }
}

function redirectToGoogleCalendar(job) {
    const title = `Interview for ${job.title}`;
    const now = new Date();
    const formattedTime = now.toISOString().replace(/-|:|\.\d+/g, "");
    const googleCalendarUrl = `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${formattedTime}/${formattedTime}`;
    window.location.href = googleCalendarUrl;
}

function updateJobStats() {
    document.getElementById("total-apps").textContent = document.querySelectorAll('#applied .kanban-item').length;
    document.getElementById("total-interviews").textContent = document.querySelectorAll('#interview .kanban-item').length;
    document.getElementById("total-offers").textContent = document.querySelectorAll('#offer .kanban-item').length;
}

function updateKanbanCounts() {
    document.getElementById("applied-count").textContent = document.querySelectorAll('#applied .kanban-item').length;
    document.getElementById("interview-count").textContent = document.querySelectorAll('#interview .kanban-item').length;
    document.getElementById("offer-count").textContent = document.querySelectorAll('#offer .kanban-item').length;
    updateJobStats();
}

function updateJobStats() {
    const interviewCount = document.querySelectorAll('#interview .kanban-item').length;
    document.getElementById("total-apps").textContent = document.querySelectorAll('#applied .kanban-item').length;
    document.getElementById("total-interviews").textContent = interviewCount;
    document.getElementById("total-offers").textContent = document.querySelectorAll('#offer .kanban-item').length;

    // Update sidebar interview count
    document.getElementById("sidebar-interviews").textContent = interviewCount;
}
