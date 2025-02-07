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

// API Key provided by the user
const API_KEY = "292b9e5d13655f0e6e05600ccbfbe4ac8fc38ab9834526fbb19166310a556fc2";

// Function to fetch job listings from API
async function fetchJobs() {
    const jobList = document.getElementById("job-list");

    if (!jobList) {
        console.error("Error: job-list element not found in HTML.");
        return;
    }

    jobList.innerHTML = '<li class="loading">Fetching jobs... ⏳</li>'; // Loading message

    const url = "https://api.apijobs.dev/v1/job/search"; // API endpoint for job listings

    const options = {
        method: "POST",
        headers: {
            "apikey": API_KEY,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            q: "developer" // Search for "developer" jobs
        })
    };

    try {
        // Fetch job listings
        const response = await fetch(url, options);
        const data = await response.json();
        
        console.log("API Response:", data); // Log the full API response for debugging

        // Check if there are hits (jobs) in the response
        if (data && data.hits && Array.isArray(data.hits) && data.hits.length > 0) {
            const jobs = data.hits;
            jobList.innerHTML = '';  // Clear the loading message

            // Display job listings
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
                jobList.appendChild(jobItem); // Add each job to the job-list
                
                // Add an event listener to the apply button
                const applyBtn = jobItem.querySelector('.apply-btn');
                if (applyBtn) {
                    applyBtn.addEventListener('click', function() {
                        applyForJob(job);  // Call the function to apply
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

// Function to handle job application
function applyForJob(job) {
    // Add job to Kanban Board (you can modify this logic if needed)
    console.log("Applying for job:", job.title);
    
    // Example: Add the job to the Kanban board (or other actions)
    addJobToKanban(job);

    // Optionally, you can show a success message or add other logic for applying
    alert(`You have applied for the job: ${job.title}`);
}




// Add job to Kanban Board
function addJobToKanban(job) {
    // Kanban columns
    const appliedColumn = document.getElementById("applied");
    const interviewColumn = document.getElementById("interview");
    const offerColumn = document.getElementById("offer");

    // Ensure the Kanban columns and 'kanban-items' container exist
    if (!appliedColumn || !interviewColumn || !offerColumn) {
        console.error("Kanban columns not found in the DOM.");
        return;
    }

    const appliedItems = appliedColumn.querySelector('.kanban-items');
    const interviewItems = interviewColumn.querySelector('.kanban-items');
    const offerItems = offerColumn.querySelector('.kanban-items');

    if (!appliedItems || !interviewItems || !offerItems) {
        console.error("Kanban item containers not found in columns.");
        return;
    }

    // Create a new item for the Kanban board
    const jobItem = document.createElement('div');
    jobItem.classList.add('kanban-item');
    jobItem.innerHTML = `
        <h4>${job.title}</h4>
        <p>${job.company_name || "No company name"}</p>
        <button class="move-btn" data-status="applied">Move to Applied</button>
        <button class="move-btn" data-status="interview">Move to Interview</button>
        <button class="move-btn" data-status="offer">Move to Offer</button>
    `;

    // Add item to 'Applied' column by default
    appliedItems.appendChild(jobItem);

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

    const appliedItems = appliedColumn.querySelector('.kanban-items');
    const interviewItems = interviewColumn.querySelector('.kanban-items');
    const offerItems = offerColumn.querySelector('.kanban-items');

    // Only remove from the column if the job item exists there
    if (appliedItems.contains(jobItem)) {
        appliedItems.removeChild(jobItem);
    }
    if (interviewItems.contains(jobItem)) {
        interviewItems.removeChild(jobItem);
    }
    if (offerItems.contains(jobItem)) {
        offerItems.removeChild(jobItem);
    }

    // Add job to the selected column
    if (status === "applied") {
        appliedItems.appendChild(jobItem);
    } else if (status === "interview") {
        interviewItems.appendChild(jobItem);
    } else if (status === "offer") {
        offerItems.appendChild(jobItem);
    }

    // Update the Kanban counts after moving the job
    updateKanbanCounts();
}

// Update Kanban board statistics (count of jobs in each stage)
function updateKanbanCounts() {
    const appliedCount = document.getElementById("applied-count");
    const interviewCount = document.getElementById("interview-count");
    const offerCount = document.getElementById("offer-count");

    appliedCount.textContent = document.querySelectorAll('#applied .kanban-item').length;
    interviewCount.textContent = document.querySelectorAll('#interview .kanban-item').length;
    offerCount.textContent = document.querySelectorAll('#offer .kanban-item').length;
}
