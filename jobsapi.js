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

    // Fetch jobs from API
    fetchJobs();

    // Load jobs from localStorage
    loadJobsFromStorage();
});

// API Key
const API_KEY = "292b9e5d13655f0e6e05600ccbfbe4ac8fc38ab9834526fbb19166310a556fc2";

// Fetch job listings
async function fetchJobs() {
    const jobList = document.getElementById("job-list");

    if (!jobList) {
        console.error("Error: job-list element not found.");
        return;
    }

    jobList.innerHTML = '<li class="loading">Fetching jobs... ⏳</li>';

    const url = "https://api.apijobs.dev/v1/job/search";

    const options = {
        method: "POST",
        headers: {
            "apikey": API_KEY,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            q: "developer"
        })
    };

    try {
        const response = await fetch(url, options);
        const data = await response.json();

        console.log("API Response:", data);

        if (data && data.hits && Array.isArray(data.hits) && data.hits.length > 0) {
            jobList.innerHTML = '';  

            data.hits.forEach(job => {
                const jobItem = document.createElement('div');
                jobItem.classList.add('job-card', 'p-4', 'border', 'rounded-lg', 'shadow', 'mb-3');

                jobItem.innerHTML = `
                    <h3 class="text-lg font-semibold">${job.title}</h3>
                    <p><strong>Company:</strong> ${job.company_name || "Not Provided"}</p>
                    <p><strong>Location:</strong> ${job.city}, ${job.country}</p>
                    <p>${job.description ? job.description.substring(0, 200) + "..." : "No description available"}</p>
                    <a href="${job.website_url}" target="_blank" class="text-blue-500 hover:underline">View Job</a>
                    <button class="apply-btn bg-green-500 text-white px-4 py-2 mt-2 rounded">Apply</button>
                `;
                jobList.appendChild(jobItem);

                jobItem.querySelector('.apply-btn').addEventListener('click', function () {
                    applyForJob(job);
                });
            });
        } else {
            jobList.innerHTML = '<li>No jobs found for your search criteria.</li>';
        }
    } catch (error) {
        jobList.innerHTML = '<li>Error fetching jobs. Please try again later.</li>';
        console.error("Error fetching jobs:", error);
    }
}

// Handle job application
function applyForJob(job) {
    console.log("Applying for job:", job.title);
    addJobToKanban(job);
    alert(`You have applied for the job: ${job.title}`);
}

// Add job to Kanban Board (Applied Column)
function addJobToKanban(job) {
    const appliedColumn = document.getElementById("applied").querySelector(".kanban-items");

    if (!appliedColumn) {
        console.error("Error: Applied column not found.");
        return;
    }

    const jobItem = document.createElement("div");
    jobItem.classList.add("kanban-item", "bg-white", "p-4", "rounded-lg", "shadow", "border");

    jobItem.innerHTML = `
        <h4 class="text-lg font-semibold">${job.title}</h4>
        <p class="text-gray-600"><strong>Company:</strong> ${job.company_name || "N/A"}</p>
        <a href="${job.website_url}" target="_blank" class="text-blue-500 hover:underline">View Job</a>
        <button class="move-btn bg-green-500 text-white p-2 rounded hover:bg-green-600">Schedule Interview</button>
    `;

    appliedColumn.appendChild(jobItem);
    updateKanbanCounts();

    jobItem.querySelector(".move-btn").addEventListener("click", function () {
        moveToInterview(jobItem);
    });

    saveToLocalStorage(jobItem.innerHTML, "applied");
}

// Move job to Interview stage
function moveToInterview(jobItem) {
    const interviewColumn = document.getElementById("interview").querySelector(".kanban-items");

    jobItem.querySelector(".move-btn").textContent = "Received Offer";
    jobItem.querySelector(".move-btn").classList.replace("bg-green-500", "bg-blue-500");

    interviewColumn.appendChild(jobItem);
    updateKanbanCounts();

    jobItem.querySelector(".move-btn").addEventListener("click", function () {
        moveToOffer(jobItem);
    });

    saveToLocalStorage(jobItem.innerHTML, "interview");
}

// Move job to Offer stage
function moveToOffer(jobItem) {
    const offerColumn = document.getElementById("offer").querySelector(".kanban-items");

    jobItem.querySelector(".move-btn").remove();
    offerColumn.appendChild(jobItem);
    updateKanbanCounts();

    saveToLocalStorage(jobItem.innerHTML, "offer");
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

// Save job status in localStorage
function saveToLocalStorage(jobHTML, column) {
    let jobs = JSON.parse(localStorage.getItem(column)) || [];
    jobs.push(jobHTML);
    localStorage.setItem(column, JSON.stringify(jobs));
}

// Load jobs from localStorage on page reload
function loadJobsFromStorage() {
    ["applied", "interview", "offer"].forEach(column => {
        const columnElement = document.getElementById(column).querySelector(".kanban-items");
        const jobs = JSON.parse(localStorage.getItem(column)) || [];

        jobs.forEach(jobHTML => {
            const jobItem = document.createElement("div");
            jobItem.classList.add("kanban-item");
            jobItem.innerHTML = jobHTML;
            columnElement.appendChild(jobItem);
        });
    });

    updateKanbanCounts();
}
