document.addEventListener("DOMContentLoaded", () => {
    // ✅ Ensure user authentication
    if (!localStorage.getItem("user")) {
        window.location.href = "index.html";
        return;
    }

    // ✅ Safe logout handling
    const logoutBtn = document.getElementById("logout-btn");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", () => {
            localStorage.removeItem("user");
            window.location.href = "index.html";
        });
    }

    // ✅ Fetch jobs on page load
    fetchJobs();
});

// ✅ Replace with your actual API key
const API_KEY = "292b9e5d13655f0e6e05600ccbfbe4ac8fc38ab9834526fbb19166310a556fc2";

async function fetchJobs() {
    const jobList = document.getElementById("job-list");

    if (!jobList) {
        console.error("Error: job-list element not found in HTML.");
        return;
    }

    // ✅ Show a loading message while fetching data
    jobList.innerHTML = '<li class="loading">Fetching jobs... ⏳</li>';

    const url = "https://api.apijobs.dev/v1/job/search";
    const options = {
        method: "POST",
        headers: {
            "apikey": API_KEY,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            q: "fullstack" // ✅ Removed extra comma
        })
    };

    try {
        const response = await fetch(url, options);
        console.log("Response Status:", response.status); // Debugging

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Full API Response:", data); // Debugging

        // ✅ Clear previous job results
        jobList.innerHTML = "";

        if (data.hits && data.hits.length > 0) { 
            data.hits.forEach(job => {
                console.log("Job Data:", job);

                // ✅ Extract job details safely
                const jobTitle = job.title || "No title available";
                const company = job.company || "N/A";
                const location = job.location || "Location Not Specified";
                const jobUrl = job.url || "#";

                // ✅ Create job list item
                const li = document.createElement("li");
                li.innerHTML = `
                    <strong>Job Title:</strong> ${jobTitle}<br>
                    <strong>Company:</strong> ${company}<br>
                    <strong>Location:</strong> ${location}<br>
                    <a href="${jobUrl}" target="_blank">🔗 View Job</a>
                    <button class="apply-btn" data-title="${jobTitle}" data-company="${company}">Apply</button>
                `;

                jobList.appendChild(li);
            });

            // ✅ Add event listeners for Apply buttons
            document.querySelectorAll(".apply-btn").forEach(button => {
                button.addEventListener("click", applyForJob);
            });
        } else {
            console.warn("No jobs found in API response.");
            jobList.innerHTML = "<li>No jobs found. Try adjusting the filters.</li>";
        }
    } catch (error) {
        console.error("Error fetching job data:", error);
        jobList.innerHTML = `<li>Error fetching job data: ${error.message}. Check console.</li>`;
    }
}

// ✅ Apply for a Job & Schedule Interview
async function applyForJob(event) {
    const button = event.target;
    const jobTitle = button.getAttribute("data-title");
    const company = button.getAttribute("data-company");

    // ✅ Confirm Application
    const confirmApply = confirm(`Do you want to apply for ${jobTitle} at ${company}?`);
    if (!confirmApply) return;

    alert(`You applied for ${jobTitle} at ${company}!`);

    // ✅ Add job to Kanban board (default: "Applied" column)
    addToKanban(jobTitle, company, "applied");

    // ✅ Schedule interview with Google Calendar API
    scheduleInterview(jobTitle, company);
}

// ✅ Kanban Board: Track Job Applications
function addToKanban(jobTitle, company, stage) {
    const stageColumn = document.getElementById(stage);
    if (!stageColumn) return;

    const jobItem = document.createElement("div");
    jobItem.classList.add("kanban-item");
    jobItem.innerHTML = `<strong>${jobTitle}</strong> at ${company}`;

    stageColumn.appendChild(jobItem);
}

// ✅ Schedule Interview with Google Calendar API
function scheduleInterview(jobTitle, company) {
    const interviewDate = prompt(`Enter interview date for ${jobTitle} at ${company} (YYYY-MM-DD):`);
    if (!interviewDate) return;

    // ✅ Example: Google Calendar Event
    const event = {
        summary: `Interview: ${jobTitle} at ${company}`,
        start: { date: interviewDate },
        end: { date: interviewDate },
        reminders: { useDefault: true }
    };

    console.log("Google Calendar Event:", event);
    alert(`Interview scheduled on ${interviewDate} for ${jobTitle} at ${company}!`);
}

// ✅ Job Statistics
function updateJobStats() {
    const appliedCount = document.getElementById("applied").childElementCount;
    const interviewCount = document.getElementById("interview").childElementCount;
    const offerCount = document.getElementById("offer").childElementCount;

    document.getElementById("applied-count").textContent = appliedCount;
    document.getElementById("interview-count").textContent = interviewCount;
    document.getElementById("offer-count").textContent = offerCount;
}

// ✅ Update job stats dynamically
setInterval(updateJobStats, 1000);
