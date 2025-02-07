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

const API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhZGl0eWFyYWkwNDAxMjAwN0BnbWFpbC5jb20iLCJwZXJtaXNzaW9ucyI6InVzZXIifQ.tN9FVZPfqQJvk2eMDIk1YKtt17uYX-o";

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
                "limit": 10,
                "order_by": [{ "desc": true, "field": "date_posted" }],
                "job_country_code_or": ["IN"],
                "posted_at_max_age_days": 30,
                "include_total_results": true,
                "blur_company_data": false
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Full API Response:", data);  // ✅ Debug full response

        const jobList = document.getElementById("job-list");
        if (!jobList) {
            console.error("Error: job-list element not found in HTML.");
            return;
        }

        jobList.innerHTML = "";

        if (data.data && data.data.length > 0) { 
            data.data.forEach(job => {
                console.log("Job Data:", job);  // ✅ Print job object to check fields

                // ✅ Find the correct job title field
                const jobTitle = job.job_title || job.name || job.title || job.position || "No title available";

                // ✅ Find the correct salary field (try different options)
                const salary = job.salary || job.salary_range || job.compensation || job.pay || "Not disclosed";

                const li = document.createElement("li");
                li.innerHTML = `
                    <strong>Job Title:</strong> ${jobTitle}<br>
                    <strong>Company:</strong> ${job.company_name || "N/A"}<br>
                    <strong>Location:</strong> ${job.location || "Not specified"}<br>
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
        const jobList = document.getElementById("job-list");
        if (jobList) {
            jobList.innerHTML = "<li>Error fetching job data. Check console.</li>";
        }
    }
}
