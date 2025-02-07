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

// ✅ Replace with backend proxy or hide in environment variable
const API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhZGl0eWFyYWkwNDAxMjAwN0BnbWFpbC5jb20iLCJwZXJtaXNzaW9ucyI6InVzZXIifQ.tN9FVZPfqQJvk2fNb8Z9wVBIe2eMDIk1YKtt17uYX-o"; 

async function fetchJobs() {
    const jobList = document.getElementById("job-list");

    if (!jobList) {
        console.error("Error: job-list element not found in HTML.");
        return;
    }

    // ✅ Show loading state
    jobList.innerHTML = '<li class="loading">Fetching jobs... ⏳</li>';

    const url = "https://api.theirstack.com/v1/jobs/search";
    const options = {
        method: "POST",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "Authorization": `Bearer ${API_KEY}`
        },
        body: JSON.stringify({
            page: 0,
            limit: 10,
            order_by: [{ desc: true, field: "date_posted" }],
            include_total_results: false,
            blur_company_data: false,
            job_country_code_or: ["IN"],  // Fetch jobs in India
            posted_at_max_age_days: 15
        })
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

        if (data.jobs && data.jobs.length > 0) { 
            data.jobs.forEach(job => {
                console.log("Job Data:", job);

                // ✅ Extract job details safely
                const jobTitle = job.title || "No title available";
                const company = job.company_name || "N/A";
                const location = job.location || "Location Not Specified";
                const salary = job.salary || "Not Disclosed";
                const jobUrl = job.job_url || "#";

                // ✅ Create job list item
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
