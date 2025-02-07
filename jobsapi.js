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

const API_URL = "https://indeed-indeed.p.rapidapi.com/apigetjobs?v=2&format=json";
const API_KEY = "fb6ec35829msh58603dad7166720p1f2d26jsn00ae6aaa89f4";

async function fetchJobs() {
    const jobList = document.getElementById("job-list");

    if (!jobList) {
        console.error("Error: job-list element not found in HTML.");
        return;
    }

    // Show loading message before fetching
    jobList.innerHTML = '<li class="loading">Fetching jobs... ⏳</li>';

    try {
        const response = await fetch(API_URL, {
            method: "GET",
            headers: {
                "x-rapidapi-key": API_KEY,
                "x-rapidapi-host": "indeed-indeed.p.rapidapi.com",
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Job API Response:", data);

        jobList.innerHTML = ""; // Clear loading message

        if (data.data && data.data.length > 0) {
            data.data.forEach(job => {
                console.log("Job Data:", job);

                const jobTitle = job.job_title || "No title available";
                const salary = job.salary ? `💰 ${job.salary}` : "Salary: Not disclosed";
                const company = job.company_name || "Company: N/A";
                const location = job.location || "Location: Not specified";

                const li = document.createElement("li");
                li.innerHTML = `
                    <strong>Job Title:</strong> ${jobTitle}<br>
                    <strong>Company:</strong> ${company}<br>
                    <strong>Location:</strong> ${location}<br>
                    <strong>Salary:</strong> ${salary}<br>
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
