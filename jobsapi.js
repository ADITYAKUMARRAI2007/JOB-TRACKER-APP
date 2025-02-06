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

// API Key (Replace with your actual API key)
const API_KEY = "bfa31807db84b89a1d55ac2892e5c2884649cd380cf36febba471c7f45ef3f01";

// Fetch job data from API
async function fetchJobs() {
    try {
        const response = await fetch("https://api.apijobs.dev/v1/job/search", {
            method: "POST",
            headers: {
                "apikey": API_KEY, // API key in the header
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                "q": "fullstack" // Search query
            }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log("API Response:", data); // Debugging: Check API response in console

        const jobList = document.getElementById("job-list");
        jobList.innerHTML = ""; // Clear previous job listings

        // 🔍 Ensure the API response structure is correct
        if (data && data.data && Array.isArray(data.data.results) && data.data.results.length > 0) {
            data.data.results.forEach(job => {
                const li = document.createElement("li");
                li.innerHTML = `
                    <strong>${job.title || "Unknown Job"}</strong><br>
                    Company: ${job.company || "N/A"}<br>
                    Location: ${job.location || "Not specified"}<br>
                    Salary: ${job.salary || "Not disclosed"}
                `;
                jobList.appendChild(li);
            });
        } else {
            jobList.innerHTML = "<li>No jobs found.</li>"; // If no jobs exist
        }

    } catch (error) {
        console.error("Error fetching jobs:", error);
        document.getElementById("job-list").innerHTML = "<li>Error fetching job data.</li>";
    }
}
