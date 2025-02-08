document.addEventListener("DOMContentLoaded", loadScheduledInterviews);

function loadScheduledInterviews() {
    const interviewList = document.getElementById("interview-list");
    const interviews = JSON.parse(localStorage.getItem("scheduledInterviews")) || [];

    if (interviews.length === 0) {
        interviewList.innerHTML = "<p>No interviews scheduled yet.</p>";
        return;
    }

    interviewList.innerHTML = "";
    interviews.forEach((interview, index) => {
        const interviewItem = document.createElement("div");
        interviewItem.classList.add("interview-item");
        interviewItem.innerHTML = `
            <h3>${interview.title}</h3>
            <p><strong>Company:</strong> ${interview.company}</p>
            <p><strong>Scheduled On:</strong> ${interview.date}</p>
            <button onclick="cancelInterview(${index})">Cancel</button>
        `;
        interviewList.appendChild(interviewItem);
    });
}

function cancelInterview(index) {
    let interviews = JSON.parse(localStorage.getItem("scheduledInterviews")) || [];
    interviews.splice(index, 1);
    localStorage.setItem("scheduledInterviews", JSON.stringify(interviews));
    loadScheduledInterviews();
}
