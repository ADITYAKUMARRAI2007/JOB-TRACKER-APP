document.addEventListener("DOMContentLoaded", async () => {
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
    await fetchJobs();
});

// ✅ Replace with your actual API key
const API_KEY = "292b9e5d13655f0e6e05600ccbfbe4ac8fc38ab9834526fbb19166310a556fc2";

async function fetchJobs() {
    const jobList = document.getElementById("job-list");

    if (!jobList) {
        console.error("Error: job-list element not found in HTML.");
        return;
    }

    // ✅ Show a loading message while fetching data
    jobList.innerHTML = '<li class="loading">Fetching jobs... ⏳</li>';

    const url = "https://api.apijobs.dev/v1/job/search";
    const options = {
        method: "POST",
        headers: {
            "apikey": API_KEY,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            q: "developer" // Try different job keywords
        })
    };

    try {
        const response = await fetch(url, options);

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Full API Response:", data);

        // ✅ Check if jobs array exists
        if (!data || !data.jobs) {
            throw new Error("Invalid API response structure");
        }

        // ✅ Clear previous job results
        jobList.innerHTML = "";

        if (data.jobs.length > 0) { 
            data.jobs.forEach(job => {
                console.log("Job Data:", job);

                // ✅ Extract job details safely
                const jobTitle = job.title || "No title available";
                const company = job.company || "N/A";
                const location = job.location || "Location Not Specified";
                const jobUrl = job.url || "#";

                // ✅ Create job list item
                const li = document.createElement("li");
                li.innerHTML = `
                    <strong>Job Title:</strong> ${jobTitle}<br>
                    <strong>Company:</strong> ${company}<br>
                    <strong>Location:</strong> ${location}<br>
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
