document.addEventListener("DOMContentLoaded", () => {
    // Ensure the user is authenticated
    if (!localStorage.getItem("user")) {
        window.location.href = "index.html"; // Redirect to login if not authenticated
    }

    // Logout functionality
    document.getElementById("logout-btn").addEventListener("click", () => {
        localStorage.removeItem("user");
        window.location.href = "index.html"; // Redirect to login
    });

    // Fetch and display jobs
    fetchJobs();
});

const API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhZGl0eWFyYWkwNDAxMjAwN0BnbWFpbC5jb20iLCJwZXJtaXNzaW9ucyI6InVzZXIifQ.tN9FVZPfqQJvk2fNb8Z9wVBIe2eMDIk1YKtt17uYX-o";

async function fetchJobs() {
    try {
        const response = await fetch("https://api.theirstack.com/v1/jobs/search", {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "Authorization": `Bearer ${API_KEY}`
            },
            body: JSON.stringify({
                "page": 0,
                "limit": 20,  // Fetch more job listings
                "order_by": [{ "desc": true, "field": "date_posted" }],
                "job_country_code_or": ["IN"],
                "posted_at_max_age_days": 30, // Increase to 30 days for more listings
                "include_total_results": true,
                "blur_company_data": false
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Full API Response:", data); // Debugging: Check the full response

        // Ensure job list container exists
        const jobList = document.getElementById("job-list");
        if (!jobList) {
            console.error("Error: job-list element not found in HTML.");
            return;
        }

        jobList.innerHTML = "";

        // ✅ Display job details correctly
        if (data.data && data.data.length > 0) { 
            data.data.forEach(job => {
                const li = document.createElement("li");
                li.innerHTML = `
                    <strong>Job Title: ${job.title || "No title available"}</strong><br>
                    <strong>Company:</strong> ${job.company_name || "N/A"}<br>
                    <strong>Location:</strong> ${job.location || "Not specified"}<br>
                    <strong>Salary:</strong> ${job.salary || "Not disclosed"}<br>
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

        // Prevent error if job-list is missing
        const jobList = document.getElementById("job-list");
        if (jobList) {
            jobList.innerHTML = "<li>Error fetching job data. Check console.</li>";
        }
    }
}
