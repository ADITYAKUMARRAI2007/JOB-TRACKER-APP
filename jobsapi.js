document.addEventListener("DOMContentLoaded", () => {
    // Mock job stats (Replace with API data)
    document.getElementById("total-apps").textContent = "0";
    document.getElementById("total-interviews").textContent = "0";
    document.getElementById("total-offers").textContent = "0";

    // Logout functionality
    const logoutBtn = document.getElementById("logout-btn");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", () => {
            localStorage.removeItem("user");
            window.location.href = "index.html";
        });
    }

    // Google Calendar Integration
    const scheduledInterviews = [];

    document.getElementById("calendar-form").addEventListener("submit", function (e) {
        e.preventDefault();

        const title = document.getElementById("event-title").value;
        const dateTime = document.getElementById("event-time").value;

        if (!title || !dateTime) {
            alert("Please fill all fields");
            return;
        }

        // Save interview details
        scheduledInterviews.push({ title, dateTime });

        // Update UI
        updateScheduledInterviews();

        // Open Google Calendar link
        const formattedTime = new Date(dateTime).toISOString().replace(/-|:|\.\d+/g, "");
        const googleCalendarUrl = `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${formattedTime}/${formattedTime}`;
        window.open(googleCalendarUrl, "_blank");

        // Clear form
        document.getElementById("event-title").value = "";
        document.getElementById("event-time").value = "";
    });

    // Show scheduled interviews when clicking "Schedule Interview"
    const scheduleInterviewBtn = document.getElementById("schedule-interview-btn");
    if (scheduleInterviewBtn) {
        scheduleInterviewBtn.addEventListener("click", () => {
            document.getElementById("scheduled-interviews-section").style.display = "block";
            updateScheduledInterviews();
        });
    }

    // Function to update scheduled interviews list
    function updateScheduledInterviews() {
        const list = document.getElementById("scheduled-interviews-list");
        list.innerHTML = "";

        if (scheduledInterviews.length === 0) {
            list.innerHTML = "<li>No interviews scheduled.</li>";
            return;
        }

        scheduledInterviews.forEach(interview => {
            const li = document.createElement("li");
            li.innerHTML = `<strong>${interview.title}</strong> - ${new Date(interview.dateTime).toLocaleString()}`;
            list.appendChild(li);
        });
    }

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
