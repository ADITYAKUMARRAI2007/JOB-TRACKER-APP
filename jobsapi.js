document.addEventListener("DOMContentLoaded", () => {
    // Redirect to login page if user is not authenticated
    if (!localStorage.getItem("user")) {
        window.location.href = "index.html";
    }

    // Logout functionality
    document.getElementById("logout-btn").addEventListener("click", () => {
        localStorage.removeItem("user");
        window.location.href = "index.html";
    });

    // Fetch jobs on page load
    fetchJobs();
});

const API_KEY = "fb6ec35829msh58603dad7166720p1f2d26jsn00ae6aaa89f4"; // 🔴 Replace with your actual API key
const API_HOST = "indeed-indeed.p.rapidapi.com";
const API_URL = "https://indeed-indeed.p.rapidapi.com/apigetjobs?v=2&format=json";

async function fetchJobs() {
    const jobList = document.getElementById("job-list");

    if (!jobList) {
        console.error("Error: job-list element not found in HTML.");
        return;
    }

    // Show loading message before fetching data
    jobList.innerHTML = '<li class="loading">Fetching jobs... ⏳</li>';

    try {
        const response = await fetch(API_URL, {
            method: "GET",
            headers: {
                "x-rapidapi-key": API_KEY,
                "x-rapidapi-host": API_HOST
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Full API Response:", data); // ✅ Debugging log

        jobList.innerHTML = ""; // Clear loading message

        if (data.data && data.data.length > 0) {
            data.data.forEach(job => {
                console.log("Job Data:", job); // ✅ Debugging log

                const jobTitle = job.job_title || job.name || "No title available";
                const salary = job.salary ? `💰 ${job.salary}` : "Salary: Not disclosed";
                const company = job.company_name ? `🏢 ${job.company_name}` : "Company: N/A";
                const location = job.location ? `📍 ${job.location}` : "Location: Not specified";

                const li = document.createElement("li");
                li.innerHTML = `
                    <strong>Job Title:</strong> ${jobTitle}<br>
                    <strong>${company}</strong><br>
                    <strong>${location}</strong><br>
                    <strong>${salary}</strong><br>
                    <a href="${job.url}" target="_blank">🔗 View Job</a>
                `;
                jobList.appendChild(li);
            });
        } else {
            console.warn("No jobs found in API response.");
            jobList.innerHTML = "<li>No jobs found. Try adjusting the filters.</li>";
        }
    } catch (error) {
        console.error("Error fetching job data:", error);
        jobList.innerHTML = "<li>Error fetching job data. Check console.</li>";
    }
}
