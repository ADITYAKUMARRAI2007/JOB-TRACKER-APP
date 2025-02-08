document.addEventListener("DOMContentLoaded", () => {
    // Mock job stats (Replace with API data)
    document.getElementById("total-apps").addEventListener("click", () => {
        showSection("applications-section");
    });

    document.getElementById("total-interviews").addEventListener("click", () => {
        showSection("scheduled-interviews-section");
    });

    document.getElementById("total-offers").addEventListener("click", () => {
        showSection("offers-received-section");
    });

    // Navigation Buttons
    document.getElementById("dashboard").addEventListener("click", () => {
        showSection("dashboard-section");
    });

    document.getElementById("applications").addEventListener("click", () => {
        showSection("applications-section");
    });

    document.getElementById("schedule-interview").addEventListener("click", () => {
        showSection("scheduled-interviews-section");
    });

    document.getElementById("settings").addEventListener("click", () => {
        alert("Settings Page Coming Soon!");
    });

    document.getElementById("logout-btn").addEventListener("click", () => {
        localStorage.removeItem("user");
        window.location.href = "index.html";
    });

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

    // Fetch Jobs
    fetchJobs();
});

// Function to show sections dynamically
function showSection(sectionId) {
    document.querySelectorAll(".section").forEach(section => {
        section.style.display = "none"; // Hide all sections
    });

    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.style.display = "block"; // Show the selected section
    }
}

// API Key
const API_KEY = "292b9e5d13655f0e6e05600ccbfbe4ac8fc38ab9834526fbb19166310a556fc2";

// Function to fetch job listings
async function fetchJobs() {
    const jobList = document.getElementById("job-list");

    if (!jobList) {
        console.error("Error: job-list element not found in HTML.");
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
            const jobs = data.hits;
            jobList.innerHTML = '';

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
            });
        } else {
            jobList.innerHTML = '<li>No jobs found for your search criteria.</li>';
        }
    } catch (error) {
        jobList.innerHTML = '<li>Error fetching jobs. Please try again later.</li>';
        console.error("Error fetching jobs:", error);
    }
}
