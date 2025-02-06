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
    try {
        const response = await fetch("https://api.theirstack.com/v1/jobs/search", {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhZGl0eWEuMjRiY3MxMDE3OEBzc3Quc2NhbGVyLmNvbSIsInBlcm1pc3Npb25zIjoidXNlciJ9.a-XpjR3uFdmyxpKWJchBpuYkufrOnLzsBvKIWMZPgao"
            },
            body: JSON.stringify({
                "page": 0,
                "limit": 10,
                "posted_at_max_age_days": 15,
                "order_by": [
                    {
                        "desc": true,
                        "field": "date_posted"
                    }
                ],
                "job_country_code_or": ["IN"],
                "include_total_results": false,
                "blur_company_data": false
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Fetched Jobs:", data);
        return data;
    } catch (error) {
        console.error("Error fetching jobs:", error);
        return null;
    }
}

// Example: Fetch and display jobs on page load
fetchJobs().then(data => {
    if (data && data.jobs) {
        data.jobs.forEach(job => console.log(`Job: ${job.title} at ${job.company}`));
    }
});
