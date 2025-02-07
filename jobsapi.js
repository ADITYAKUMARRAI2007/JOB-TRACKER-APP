document.addEventListener("DOMContentLoaded", () => {
    if (!localStorage.getItem("user")) {
        window.location.href = "index.html";
    }

    document.getElementById("logout-btn").addEventListener("click", () => {
        localStorage.removeItem("user");
        window.location.href = "index.html";
    });

    fetchJobs();
});

const API_KEY = "fb6ec35829msh58603dad7166720p1f2d26jsn00ae6aaa89f4"; // Replace with your JSearch API key
const API_URL = "https://jsearch.p.rapidapi.com/search?query=developer%20jobs%20in%20chicago&page=1&num_pages=1&country=us&date_posted=all";

async function fetchJobs() {
    const jobList = document.getElementById("job-list");

    if (!jobList) {
        console.error("Error: job-list element not found in HTML.");
        return;
    }

    jobList.innerHTML = '<li class="loading">Fetching jobs... ⏳</li>'; // Show loading message

    try {
        const response = await fetch(API_URL, {
            method: "GET",
            headers: {
                "x-rapidapi-key": API_KEY,
                "x-rapidapi-host": "jsearch.p.rapidapi.com"
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Full API Response:", data); // Debugging

        jobList.innerHTML = ""; // Clear loading text

        if (data.data && data.data.length > 0) {
            data.data.forEach(job => {
                console.log("Job Data:", job); // Debugging each job record

                const jobTitle = job.job_title || "No title available";
                const company = job.employer_name || "N/A";
                const location = job.job_city || "Not specified";
                const salary = job.salary || "Not disclosed";
                const jobUrl = job.job_apply_link || "#";

                const li = document.createElement("li");
                li.innerHTML = `
                    <strong>Job Title:</strong> ${jobTitle}<br>
                    <strong>Company:</strong> ${company}<br>
                    <strong>Location:</strong> ${location}<br>
                    <strong>Salary:</strong> ${salary}<br>
                    <a href="${jobUrl}" target="_blank">🔗 Apply Now</a>
                `;
                jobList.appendChild(li);
            });
        } else {
            console.warn("No jobs found in API response.");
            jobList.innerHTML = "<li>No jobs found. Try another search.</li>";
        }

    } catch (error) {
        console.error("Error fetching job data:", error);
        jobList.innerHTML = "<li>Error fetching job data. Check console.</li>";
    }
}
