document.addEventListener("DOMContentLoaded", () => {
    updateJobStats();
    fetchJobs();
    displayScheduledInterviews();

    const logoutBtn = document.getElementById("logout-btn");
    const scheduledInterviewsBtn = document.getElementById("scheduled-interviews-btn");
    const scheduledInterviewsSection = document.getElementById("scheduled-interviews-section");

    if (logoutBtn) {
        logoutBtn.addEventListener("click", () => {
            localStorage.removeItem("user");
            window.location.href = "index.html";
        });
    }

    scheduledInterviewsBtn.addEventListener("click", (e) => {
        e.preventDefault();
        scheduledInterviewsSection.classList.remove("hidden"); // Show the section
        displayScheduledInterviews(); // Fetch and show scheduled interviews
        scheduledInterviewsSection.scrollIntoView({ behavior: "smooth", block: "start" });
    });
});

const API_KEY = "292b9e5d13655f0e6e05600ccbfbe4ac8fc38ab9834526fbb19166310a556fc2";


// Fetch job postings
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

// Add job to job list
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

// Apply for a job
function applyForJob(job) {
    addJobToKanban(job);
    alert(`You have applied for: ${job.title}`);
}

// Add job to Kanban board
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

// Move job between columns
function moveJobToColumn(jobItem, status, job) {
    const targetColumn = document.querySelector(`#${status} .kanban-items`);
    if (targetColumn) {
        targetColumn.appendChild(jobItem);
        updateKanbanCounts();
    }
    
    if (status === "interview") {
        saveScheduledInterview(job); // Store in localStorage
        redirectToGoogleCalendar(job);
    }
}

// Save scheduled interviews to localStorage
function saveScheduledInterview(job) {
    let interviews = JSON.parse(localStorage.getItem("scheduledInterviews")) || [];
    interviews.push({
        title: job.title,
        company: job.company_name || "Unknown",
        date: new Date().toISOString().split("T")[0], // Example date
        time: "10:00 AM" // Default time
    });
    localStorage.setItem("scheduledInterviews", JSON.stringify(interviews));
}

// Display scheduled interviews
function displayScheduledInterviews() {
    const scheduledInterviewsList = document.getElementById("scheduled-interviews-list");
    scheduledInterviewsList.innerHTML = "";

    let interviews = JSON.parse(localStorage.getItem("scheduledInterviews")) || [];

    if (interviews.length === 0) {
        scheduledInterviewsList.innerHTML = `<p class="text-gray-600">No interviews scheduled yet.</p>`;
        return;
    }

    interviews.forEach((interview, index) => {
        const interviewCard = document.createElement("div");
        interviewCard.classList.add("bg-gray-100", "p-4", "rounded-lg", "shadow-md", "flex", "justify-between", "items-center");

        interviewCard.innerHTML = `
            <div>
                <h3 class="text-lg font-bold">${interview.company}</h3>
                <p>${interview.title}</p>
                <p class="text-sm text-gray-500">${interview.date} at ${interview.time}</p>
            </div>
            <button data-index="${index}" class="remove-btn bg-red-500 text-white px-3 py-1 rounded">Remove</button>
        `;

        scheduledInterviewsList.appendChild(interviewCard);
    });

    // Remove interview
    document.querySelectorAll(".remove-btn").forEach((button) => {
        button.addEventListener("click", (e) => {
            const index = e.target.getAttribute("data-index");
            let interviews = JSON.parse(localStorage.getItem("scheduledInterviews")) || [];
            interviews.splice(index, 1);
            localStorage.setItem("scheduledInterviews", JSON.stringify(interviews));
            displayScheduledInterviews();
        });
    });
}
function updateJobStats() {
    const totalApps = document.getElementById("total-apps");
    const totalInterviews = document.getElementById("total-interviews");
    const totalOffers = document.getElementById("total-offers");

    const appliedCount = document.querySelectorAll("#applied .kanban-item").length;
    const interviewCount = document.querySelectorAll("#interview .kanban-item").length;
    const offerCount = document.querySelectorAll("#offer .kanban-item").length;

    if (totalApps) totalApps.textContent = appliedCount;
    if (totalInterviews) totalInterviews.textContent = interviewCount;
    if (totalOffers) totalOffers.textContent = offerCount;
}


// Redirect to Google Calendar
function redirectToGoogleCalendar(job) {
    const title = `Interview for ${job.title}`;
    const now = new Date();
    const formattedTime = now.toISOString().replace(/-|:|\.\d+/g, "");
    const googleCalendarUrl = `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${formattedTime}/${formattedTime}`;
    window.open(googleCalendarUrl, "_blank");
}
