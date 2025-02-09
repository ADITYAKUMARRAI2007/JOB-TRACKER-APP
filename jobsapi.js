document.addEventListener("DOMContentLoaded", () => {
    localStorage.removeItem("scheduledInterviews"); 
    updateJobStats();
    fetchJobs();

    const logoutBtn = document.getElementById("logout-btn");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", () => {
            localStorage.removeItem("user");
            window.location.href = "index.html";
        });
    }

    const scheduledInterviewsBtn = document.getElementById("scheduled-interviews-btn");
    if (scheduledInterviewsBtn) {
        scheduledInterviewsBtn.addEventListener("click", () => {
            showScheduledInterviews();
        });
    }

    const searchInput = document.getElementById("job-search");
    if (searchInput) {
        searchInput.addEventListener("input", filterJobs);
    }
});

const API_KEY = "fd7e9f60c88e3b47cc89766b131eb94f8f72d309f033ed5935d1ff0712979d04";

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


function filterJobs() {
    const query = document.getElementById("job-search").value.toLowerCase();
    const jobCards = document.querySelectorAll("#job-list .job-item");

    jobCards.forEach(card => {
        const jobTitle = card.querySelector("h3").textContent.toLowerCase();
        if (jobTitle.includes(query)) {
            card.style.display = "block";
        } else {
            card.style.display = "none";
        }
    });
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
        scheduleGoogleCalendarInterview(job);
    }
}

function scheduleGoogleCalendarInterview(job) {
    const title = `Interview for ${job.title}`;
    const now = new Date();
    const formattedTime = now.toISOString().replace(/-|:|\.\d+/g, "");
    const googleCalendarUrl = `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${formattedTime}/${formattedTime}`;

    const interviews = JSON.parse(localStorage.getItem("scheduledInterviews")) || [];
    interviews.push({ title: job.title, company: job.company_name, date: now.toDateString() });
    localStorage.setItem("scheduledInterviews", JSON.stringify(interviews));

    window.location.href = googleCalendarUrl;
}

function showScheduledInterviews() {
    const scheduledSection = document.getElementById("scheduled-interviews-section");
    const scheduledList = document.getElementById("scheduled-interviews-list");

    scheduledList.innerHTML = "";

    const interviews = JSON.parse(localStorage.getItem("scheduledInterviews")) || [];

    if (interviews.length === 0) {
        scheduledList.innerHTML = "<p>No scheduled interviews yet.</p>";
    } else {
        interviews.forEach((interview) => {
            const interviewItem = document.createElement("div");
            interviewItem.classList.add("p-4", "bg-gray-100", "rounded-lg", "shadow");

            interviewItem.innerHTML = `
                <h4 class="text-lg font-semibold">${interview.title}</h4>
                <p><strong>Company:</strong> ${interview.company}</p>
                <p><strong>Date:</strong> ${interview.date}</p>
            `;
            scheduledList.appendChild(interviewItem);
        });
    }

    scheduledSection.classList.remove("hidden");
}

function updateJobStats() {
    const interviewCount = document.querySelectorAll('#interview .kanban-item').length;
    document.getElementById("total-apps").textContent = document.querySelectorAll('#applied .kanban-item').length;
    document.getElementById("total-interviews").textContent = interviewCount;
    document.getElementById("total-offers").textContent = document.querySelectorAll('#offer .kanban-item').length;

    document.getElementById("sidebar-interviews").textContent = interviewCount;
}

function updateKanbanCounts() {
    document.getElementById("applied-count").textContent = document.querySelectorAll('#applied .kanban-item').length;
    document.getElementById("interview-count").textContent = document.querySelectorAll('#interview .kanban-item').length;
    document.getElementById("offer-count").textContent = document.querySelectorAll('#offer .kanban-item').length;
    updateJobStats();
}
