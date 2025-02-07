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

// ✅ Replace with your actual API key (consider hiding it in a backend)
const API_KEY = "fb6ec35829msh58603dad7166720p1f2d26jsn00ae6aaa89f4"; 

async function fetchJobs() {
    const jobList = document.getElementById("job-list");

    if (!jobList) {
        console.error("Error: job-list element not found in HTML.");
        return;
    }

    // ✅ Show a loading message while fetching data
    jobList.innerHTML = '<li class="loading">Fetching jobs... ⏳</li>';

    const url = "https://jsearch.p.rapidapi.com/search?query=developer%20jobs%20in%20chicago&page=1&num_pages=1&country=us&date_posted=all";
    const options = {
        method: "GET",
        headers: {
            "x-rapidapi-key": API_KEY,
            "x-rapidapi-host": "jsearch.p.rapidapi.com"
        }
    };

    try {
        const response = await fetch(url, options);

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Full API Response:", data);

        // ✅ Clear previous job results
        jobList.innerHTML = "";

        if (data.data && data.data.length > 0) { 
            data.data.forEach(job => {
                console.log("Job Data:", job);

                // ✅ Extract job details safely
                const jobTitle = job.job_title || "No title available";
                const company = job.employer_name || "N/A";
                const location = job.job_city || "Location Not Specified";
                const salary = job.salary || "Not Disclosed";
                const jobUrl = job.job_apply_link || "#";

                // ✅ Create a job list item
                const li = document.createElement("li");
                li.innerHTML = `
                    <strong>Job Title:</strong> ${jobTitle}<br>
                    <strong>Company:</strong> ${company}<br>
                    <strong>Location:</strong> ${location}<br>
                    <strong>Salary:</strong> ${salary}<br>
                    <a href="${jobUrl}" target="_blank">🔗 View Job</a>
                `;
                jobList.appendChild(li);
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
