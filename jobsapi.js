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

// Fetch job data from API
async function fetchJobs() {
    try {
        const response = await fetch("d60ec2693323f0abe6f72a97abbec864f05d152b1ca0f5548af4b295d380cabc"); // Replace with actual API URL
        const data = await response.json();

        const jobList = document.getElementById("job-list");
        jobList.innerHTML = ""; // Clear previous job listings

        // Loop through the job data and display it
        data.jobs.forEach(job => {
            const li = document.createElement("li");
            li.innerHTML = `
                <strong>${job.title}</strong><br>
                Company: ${job.company}<br>
                Location: ${job.location}<br>
                Salary: ${job.salary}
            `;
            jobList.appendChild(li);
        });
    } catch (error) {
        console.error("Error fetching jobs:", error);
        document.getElementById("job-list").innerHTML = "<li>Error fetching job data.</li>"; // Show error message
    }
}
