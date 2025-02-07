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

function fetchJobs() {
    const jobList = document.getElementById("job-list");

    if (!jobList) {
        console.error("Error: job-list element not found in HTML.");
        return;
    }

    // Show loading message before fetching
    jobList.innerHTML = '<li class="loading">Fetching jobs... ⏳</li>';

    const xhr = new XMLHttpRequest();
    xhr.withCredentials = true;

    xhr.addEventListener("readystatechange", function () {
        if (this.readyState === 4) {
            try {
                const response = JSON.parse(this.responseText);
                console.log("Full API Response:", response);

                jobList.innerHTML = ""; // Clear the loading text

                if (response.data && response.data.length > 0) {
                    response.data.forEach(job => {
                        const jobTitle = job.job_title || "No title available";
                        const company = job.company_name || "N/A";
                        const location = job.location || "Not specified";
                        const salary = job.salary || "Not disclosed";

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
                    jobList.innerHTML = "<li>No jobs found. Try adjusting the filters.</li>";
                }
            } catch (error) {
                console.error("Error parsing API response:", error);
                jobList.innerHTML = "<li>Error fetching job data. Check console.</li>";
            }
        }
    });

    xhr.open("GET", "https://indeed12.p.rapidapi.com/jobs/search?query=manager&location=chicago&page_id=1&locality=us&fromage=1&radius=50&sort=date&job_type=permanent");
    xhr.setRequestHeader("x-rapidapi-key", "fb6ec35829msh58603dad7166720p1f2d26jsn00ae6aaa89f4");
    xhr.setRequestHeader("x-rapidapi-host", "indeed12.p.rapidapi.com");

    xhr.send();
}
