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

async function fetchJobs() {
    const jobList = document.getElementById("job-list");
    if (!jobList) {
        console.error("Error: job-list element not found in HTML.");
        return;
    }
    jobList.innerHTML = '<li class="loading">Fetching jobs... ⏳</li>';

    const xhr = new XMLHttpRequest();
    xhr.withCredentials = true;

    xhr.addEventListener("readystatechange", function () {
        if (this.readyState === this.DONE) {
            try {
                const data = JSON.parse(this.responseText);
                console.log("Full API Response:", data);
                jobList.innerHTML = "";

                if (data && data.results && data.results.length > 0) {
                    data.results.forEach(job => {
                        const jobTitle = job.job_title || "No title available";
                        const company = job.company_name || "N/A";
                        const location = job.location || "Not specified";
                        const salary = job.salary || "Not disclosed";
                        const jobUrl = job.url || "#";

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
                    jobList.innerHTML = "<li>No jobs found. Try adjusting the filters.</li>";
                }
            } catch (error) {
                console.error("Error parsing job data:", error);
                jobList.innerHTML = "<li>Error fetching job data. Check console.</li>";
            }
        }
    });

    xhr.open("GET", "https://indeed-indeed.p.rapidapi.com/apigetjobs?v=2&format=json");
    xhr.setRequestHeader("x-rapidapi-key", "fb6ec35829msh58603dad7166720p1f2d26jsn00ae6aaa89f4");
    xhr.setRequestHeader("x-rapidapi-host", "indeed-indeed.p.rapidapi.com");

    xhr.send();
}
