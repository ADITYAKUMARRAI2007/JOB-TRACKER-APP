document.addEventListener("DOMContentLoaded", () => {
    // Redirect to login if user is not authenticated
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

const API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhZGl0eWFyYWkwNDAxMjAwN0BnbWFpbC5jb20iLCJwZXJtaXNzaW9ucyI6InVzZXIifQ.tN9FVZPfqQJvk2fNb8Z9wVBIe2eMDIk1YKtt17uYX-o";

async function fetchJobs() {
    const jobList = document.getElementById("job-list");
    
    if (!jobList) {
        console.error("Error: job-list element not found in HTML.");
        return;
    }

    // Show loading message before fetching
    jobList.innerHTML = '<li class="loading">Fetching jobs... ⏳</li>';

    
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
        console.log("Full API Response:", data);

        jobList.innerHTML = ""; // Clear the loading text

        if (data.data && data.data.length > 0) { 
            data.data.forEach(job => {
                console.log("Job Data:", job);

                const jobTitle = job.job_title || job.name || job.title || job.position || "No title available";
                const salary = job.salary ? `<span class="salary">💰 ${job.salary}</span>` : "<span class='salary'>Salary: Not disclosed</span>";
                const company = job.company_name ? `<span class="company">🏢 ${job.company_name}</span>` : "<span class='company'>Company: N/A</span>";
                const location = job.location ? `<span class="location">📍 ${job.location}</span>` : "<span class='location'>Location: Not specified</span>";

                const li = document.createElement("li");
                li.classList.add("job-item");
                li.innerHTML = `
                    <h3>${jobTitle}</h3>
                    ${company}
                    ${location}
                    ${salary}
                    <br>
                    <a href="${job.url}" target="_blank" class="apply-btn">🔗 View Job</a>
                `;

                jobList.appendChild(li);

                // Fade-in animation for each job item
                setTimeout(() => {
                    li.classList.add("show");
                }, 100);
            });
        } else {
            jobList.innerHTML = "<li class='no-jobs'>🚫 No jobs found. Try adjusting the filters.</li>";
        }

    } catch (error) {
        console.error("Error fetching job data:", error);
        jobList.innerHTML = "<li class='error'>❌ Error fetching jobs. Please try again later.</li>";
    }
}
