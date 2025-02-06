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
const API_KEY = '292b9e5d13655f0e6e05600ccbfbe4ac8fc38ab9834526fbb19166310a556fc2';

async function fetchJobs() {
    try {
        const response = await fetch("https://app.apijobs.dev/jobs", {
            method: "POST",
            headers: {
                "apikey": API_KEY,  // Ensure this is exactly how the API expects it
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "q": "fullstack",
                "employmentType": "FULL_TIME" // Make sure to include this
            }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log(data); // Log the response to check its structure

        const jobList = document.getElementById("job-list");
        jobList.innerHTML = ""; // Clear previous job listings

        if (data.hits && data.hits.length > 0) {
            data.hits.forEach(job => {
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
