document.addEventListener("DOMContentLoaded", () => {
    // Fetch user data from localStorage
    const user = JSON.parse(localStorage.getItem("user"));

    if (user && user.name) {
        const userInfo = document.getElementById("user-info");
        
        if (userInfo) {
            userInfo.innerHTML = `👋 Welcome, <span class="highlight-name">${user.name}</span>`;
        }
    }

    // Initialize job stats (Replace with API data)
    updateJobStats(0, 0, 0);

    // Logout functionality
    const logoutBtn = document.getElementById("logout-btn");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", () => {
            localStorage.removeItem("user");
            window.location.href = "index.html";
        });
    }

    // Google Calendar Integration (Check if form exists)
    const calendarForm = document.getElementById("calendar-form");
    if (calendarForm) {
        calendarForm.addEventListener("submit", function (e) {
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
    }

    // Fetch job listings
    fetchJobs();
});

// API Key for job API
const API_KEY = "292b9e5d13655f0e6e05600ccbfbe4ac8fc38ab9834526fbb19166310a556fc2";

// Function to fetch job listings
async function fetchJobs() {
    const jobList = document.getElementById("job-list");

    if (!jobList) {
        console.error("Error: job-list element not found in HTML.");
        return;
    }

    jobList.innerHTML = '<li class="loading">Fetching jobs... ⏳</li>'; // Loading message

    const url = "https://api.apijobs.dev/v1/job/search";

    const options = {
        method: "POST",
        headers: {
            "apikey": API_KEY,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            q: "developer" // Searching for "developer" jobs
        })
    };

    try {
        const response = await fetch(url, options);
        const data = await response.json();

        console.log("API Response:", data);

        if (data && data.hits && Array.isArray(data.hits) && data.hits.length > 0) {
            const jobs = data.hits;
            jobList.innerHTML = '';  // Clear loading message

            jobs.forEach(job => {
                const jobItem = document.createElement('li');
                jobItem.innerHTML = `
                    <h3>${job.title}</h3>
                    <p><strong>Company:</strong> ${job.company_name || "Not Provided"}</p>
                    <p><strong>Location:</strong> ${job.city}, ${job.country}</p>
                    <p><strong>Description:</strong> ${job.description ? job.description.substring(0, 200) + "..." : "No description available"}</p>
                    <a href="${job.website_url}" target="_blank">View Job</a>
                    <button class="apply-btn" data-job-id="${job.id}">Apply</button>
                `;
                jobList.appendChild(jobItem);

                const applyBtn = jobItem.querySelector('.apply-btn');
                if (applyBtn) {
                    applyBtn.addEventListener('click', function () {
                        applyForJob(job);
                    });
                }
            });
        } else {
            jobList.innerHTML = '<li>No jobs found for your search criteria.</li>';
        }
    } catch (error) {
        jobList.innerHTML = '<li>Error fetching jobs. Please try again later.</li>';
        console.error("Error fetching jobs:", error);
    }
}

// Function to handle job applications
function applyForJob(job) {
    console.log("Applying for job:", job.title);

    // Add job to the Kanban board
    addJobToKanban(job);

    alert(`You have applied for the job: ${job.title}`);

    // Update job stats
    updateKanbanCounts();
}

// Add job to Kanban Board
function addJobToKanban(job) {
    const appliedColumn = document.getElementById("applied");
    if (!appliedColumn) {
        console.error("Applied column not found in DOM.");
        return;
    }

    const appliedItems = appliedColumn.querySelector('.kanban-items');
    if (!appliedItems) {
        console.error("Kanban item container not found.");
        return;
    }

    const jobItem = document.createElement('div');
    jobItem.classList.add('kanban-item');
    jobItem.innerHTML = `
        <h4>${job.title}</h4>
        <p>${job.company_name || "No company name"}</p>
        <button class="move-btn" data-status="interview">Move to Interview</button>
        <button class="move-btn" data-status="offer">Move to Offer</button>
    `;

    appliedItems.appendChild(jobItem);

    updateKanbanCounts();

    // Move job between columns
    const moveBtns = jobItem.querySelectorAll('.move-btn');
    moveBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const status = e.target.getAttribute('data-status');
            moveJobToColumn(jobItem, status);
        });
    });
}

// Move job item to another Kanban column
function moveJobToColumn(jobItem, status) {
    const interviewColumn = document.getElementById("interview");
    const offerColumn = document.getElementById("offer");

    const interviewItems = interviewColumn.querySelector('.kanban-items');
    const offerItems = offerColumn.querySelector('.kanban-items');

    if (status === "interview") {
        interviewItems.appendChild(jobItem);
    } else if (status === "offer") {
        offerItems.appendChild(jobItem);
    }

    updateKanbanCounts();
}

// Update Kanban board counts
function updateKanbanCounts() {
    const appliedCount = document.querySelectorAll('#applied .kanban-item').length;
    const interviewCount = document.querySelectorAll('#interview .kanban-item').length;
    const offerCount = document.querySelectorAll('#offer .kanban-item').length;

    updateJobStats(appliedCount, interviewCount, offerCount);
}

// Live update for job stats section
function updateJobStats(apps = 0, interviews = 0, offers = 0) {
    document.getElementById("total-apps").textContent = apps;
    document.getElementById("total-interviews").textContent = interviews;
    document.getElementById("total-offers").textContent = offers;
}
