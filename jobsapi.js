document.addEventListener("DOMContentLoaded", () => {
    // Ensure the user is authenticated
    if (!localStorage.getItem("user")) {
        window.location.href = "index.html"; // Redirect to login if not authenticated
    }

    // Fetch and display jobs
    fetchJobs();
});

// Logout functionality
document.getElementById("logout-btn").addEventListener("click", () => {
    localStorage.removeItem("user");
    window.location.href = "index.html"; // Redirect to login
});

const API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhZGl0eWEuMjRiY3MxMDE3OEBzc3Quc2NhbGVyLmNvbSIsInBlcm1pc3Npb25zIjoidXNlciJ9.a-XpjR3uFdmyxpKWJchBpuYkufrOnLzsBvKIWMZPgao';

async function fetchJobs() {
    const API_KEY = 'YOUR_API_KEY';  // Replace with your API key

    try {
        const response = await fetch("https://api.theirstack.com/v1/jobs/search", {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "Authorization": `Bearer ${API_KEY}`,
            },
            body: JSON.stringify({
                "page": 0,
                "limit": 10,
                "posted_at_max_age_days": 15,
                "order_by": [
                    { "desc": true, "field": "date_posted" }
                ],
                "job_country_code_or": ["IN"],
                "include_total_results": false,
                "blur_company_data": false
            }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log(data);  // Process and display the job data
        // Display the job listings on the page
        const jobList = document.getElementById("job-list");
        jobList.innerHTML = "";
        if (data.jobs && data.jobs.length > 0) {
            data.jobs.forEach(job => {
                const li = document.createElement("li");
                li.innerHTML = `
                    <strong>${job.title}</strong><br>
                    Company: ${job.company || "N/A"}<br>
                    Location: ${job.location || "Not specified"}<br>
                    Salary: ${job.salary || "Not disclosed"}
                `;
                jobList.appendChild(li);
            });
        } else {
            jobList.innerHTML = "<li>No jobs found.</li>"; 
        }

    } catch (error) {
        console.error("Error fetching jobs:", error);
        document.getElementById("job-list").innerHTML = "<li>Error fetching job data.</li>";
    }
}

