document.addEventListener("DOMContentLoaded", () => {
    // Mock job stats (Replace with API data)
    document.getElementById("total-apps").textContent = "12";
    document.getElementById("total-interviews").textContent = "4";
    document.getElementById("total-offers").textContent = "2";

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

    // Job Fetching from API
    fetchJobs();
});

// Replace with your actual API key
const API_KEY = "292b9e5d13655f0e6e05600ccbfbe4ac8fc38ab9834526fbb19166310a556fc2";

async function fetchJobs() {
    const jobList = document.getElementById("job-list");

    if (!jobList) {
        console.error("Error: job-list element not found in HTML.");
        return;
    }

    jobList.innerHTML = '<li class="loading">Fetching jobs... ⏳</li>';

    const url = "https://api.apijobs.dev/v1/job/search"; // Ensure the endpoint URL is correct
    const options = {
        method: "POST",
        headers: {
            "apikey": API_KEY,  // Ensure the API key is correct
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            query: "developer",  // Ensure 'query' is a valid job type
            location: "remote",  // Ensure location is supported
            full_time: true,     // Ensure full_time is a valid parameter
            page: 1,
            per_page: 5
        })
    };

    console.log("Request body:", options.body); // Log the request body to check if it's correctly formatted

    try {
        const response = await fetch(url, options);

        // Log the full response for debugging
        const responseData = await response.json();
        console.log("API Response:", responseData);

        if (!response.ok) {
            throw new Error(`Error: ${response.status} ${response.statusText}`);
        }

        // If no jobs found, show an appropriate message
        if (responseData && responseData.jobs && responseData.jobs.length > 0) {
            const jobs = responseData.jobs;
            jobList.innerHTML = ''; // Clear loading text

            jobs.forEach(job => {
                const jobItem = document.createElement('li');
                jobItem.innerHTML = `
                    <h3>${job.title}</h3>
                    <p><strong>Company:</strong> ${job.company}</p>
                    <p><strong>Location:</strong> ${job.location}</p>
                    <a href="${job.url}" target="_blank">View Job</a>
                    <button class="apply-btn" data-job-id="${job.id}">Apply</button>
                `;
                jobList.appendChild(jobItem);

                // Handle apply button click
                const applyBtn = jobItem.querySelector('.apply-btn');
                applyBtn.addEventListener('click', () => {
                    addJobToKanban(job);
                    updateStats('total-apps', 1);  // Increment Total Applications
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


// Add job to Kanban Board
function addJobToKanban(job) {
    // Kanban columns
    const appliedColumn = document.getElementById("applied");
    const interviewColumn = document.getElementById("interview");
    const offerColumn = document.getElementById("offer");

    // Create a new item for the Kanban board
    const jobItem = document.createElement('div');
    jobItem.classList.add('kanban-item');
    jobItem.innerHTML = `
        <h4>${job.title}</h4>
        <p>${job.company}</p>
        <button class="move-btn" data-status="applied">Move to Applied</button>
        <button class="move-btn" data-status="interview">Move to Interview</button>
        <button class="move-btn" data-status="offer">Move to Offer</button>
    `;

    // Add item to 'Applied' column by default
    appliedColumn.querySelector('.kanban-items').appendChild(jobItem);

    // Increment counts for Kanban board columns
    updateKanbanCounts();

    // Handle moving between stages
    const moveBtns = jobItem.querySelectorAll('.move-btn');
    moveBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const status = e.target.getAttribute('data-status');
            moveJobToColumn(jobItem, status);
        });
    });
}

// Move job item to the selected Kanban column
function moveJobToColumn(jobItem, status) {
    const appliedColumn = document.getElementById("applied");
    const interviewColumn = document.getElementById("interview");
    const offerColumn = document.getElementById("offer");

    // Remove job from current column
    appliedColumn.querySelector('.kanban-items').removeChild(jobItem);
    interviewColumn.querySelector('.kanban-items').removeChild(jobItem);
    offerColumn.querySelector('.kanban-items').removeChild(jobItem);

    // Add job to the selected column
    if (status === "applied") {
        appliedColumn.querySelector('.kanban-items').appendChild(jobItem);
    } else if (status === "interview") {
        interviewColumn.querySelector('.kanban-items').appendChild(jobItem);
    } else if (status === "offer") {
        offerColumn.querySelector('.kanban-items').appendChild(jobItem);
    }

    // Update the Kanban counts after moving the job
    updateKanbanCounts();
}

// Update Kanban board statistics (count of jobs in each stage)
function updateKanbanCounts() {
    const appliedCount = document.getElementById("applied-count");
    const interviewCount = document.getElementById("interview-count");
    const offerCount = document.getElementById("offer-count");

    appliedCount.textContent = document.getElementById("applied").querySelector('.kanban-items').children.length;
    interviewCount.textContent = document.getElementById("interview").querySelector('.kanban-items').children.length;
    offerCount.textContent = document.getElementById("offer").querySelector('.kanban-items').children.length;
}

// Update stats display (e.g., Total Applications)
function updateStats(id, increment) {
    const statElement = document.getElementById(id);
    if (statElement) {
        statElement.textContent = parseInt(statElement.textContent) + increment;
    }
}
