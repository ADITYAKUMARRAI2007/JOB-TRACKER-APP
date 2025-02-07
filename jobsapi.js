document.addEventListener("DOMContentLoaded", () => {
    if (!localStorage.getItem("user")) {
        window.location.href = "index.html";
        return;
    }

    document.getElementById("logout-btn").addEventListener("click", () => {
        localStorage.removeItem("user");
        window.location.href = "index.html";
    });

    fetchJobs();
    loadStats();
});

const API_KEY = "YOUR_API_KEY_HERE";
const jobList = document.getElementById("job-list");

async function fetchJobs() {
    jobList.innerHTML = '<li>Loading jobs... ⏳</li>';

    const url = "https://api.apijobs.dev/v1/job/search";
    const options = {
        method: "POST",
        headers: { "apikey": API_KEY, "Content-Type": "application/json" },
        body: JSON.stringify({ q: "fullstack" })
    };

    try {
        const response = await fetch(url, options);
        const data = await response.json();

        jobList.innerHTML = "";

        if (data.hits && data.hits.length > 0) {
            data.hits.forEach(job => {
                const jobTitle = job.title || "No title available";
                const company = job.company || "N/A";
                const location = job.location || "Location Not Specified";
                const jobUrl = job.url || "#";

                const li = document.createElement("li");
                li.innerHTML = `
                    <strong>Job Title:</strong> ${jobTitle}<br>
                    <strong>Company:</strong> ${company}<br>
                    <strong>Location:</strong> ${location}<br>
                    <a href="${jobUrl}" target="_blank">🔗 View Job</a>
                    <button onclick="applyJob('${jobTitle}', '${company}')">Apply</button>
                `;
                jobList.appendChild(li);
            });
        } else {
            jobList.innerHTML = "<li>No jobs found. Try a different search.</li>";
        }
    } catch (error) {
        jobList.innerHTML = `<li>Error: ${error.message}</li>`;
    }
}

function applyJob(title, company) {
    const appliedList = document.querySelector("#applied .kanban-list");
    const li = document.createElement("li");
    li.innerText = `${title} - ${company}`;
    li.draggable = true;
    li.ondragstart = dragStart;
    appliedList.appendChild(li);

    updateStats();
    scheduleInterview(title);
}

function updateStats() {
    const count = document.querySelectorAll("#applied .kanban-list li").length;
    document.getElementById("applications-count").innerText = count;
}

function scheduleInterview(jobTitle) {
    const event = {
        summary: `Interview for ${jobTitle}`,
        start: { dateTime: new Date().toISOString(), timeZone: "UTC" },
        end: { dateTime: new Date(new Date().getTime() + 3600000).toISOString(), timeZone: "UTC" }
    };

    fetch("https://www.googleapis.com/calendar/v3/calendars/primary/events", {
        method: "POST",
        headers: {
            "Authorization": `Bearer YOUR_GOOGLE_ACCESS_TOKEN`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify(event)
    })
    .then(response => response.json())
    .then(data => {
        alert(`Interview scheduled: ${data.htmlLink}`);
    })
    .catch(error => console.error("Error scheduling interview:", error));
}

// 🏗 Drag & Drop Kanban Functionality
document.querySelectorAll(".kanban-list").forEach(list => {
    list.ondragover = (e) => e.preventDefault();
    list.ondrop = (e) => {
        e.preventDefault();
        const id = e.dataTransfer.getData("text");
        const item = document.getElementById(id);
        e.target.appendChild(item);
    };
});

function dragStart(e) {
    e.dataTransfer.setData("text", e.target.id);
}
