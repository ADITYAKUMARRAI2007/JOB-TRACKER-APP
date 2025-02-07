document.addEventListener("DOMContentLoaded", () => {
    // Ensure the user is authenticated
    if (!localStorage.getItem("user")) {
        window.location.href = "index.html"; // Redirect to login if not authenticated
    }

    // Logout functionality
    document.getElementById("logout-btn").addEventListener("click", () => {
        localStorage.removeItem("user");
        window.location.href = "index.html"; // Redirect to login
    });

    // Fetch and display jobs
    fetchJobs();
});
const API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhZGl0eWFyYWkwNDAxMjAwN0BnbWFpbC5jb20iLCJwZXJtaXNzaW9ucyI6InVzZXIifQ.tN9FVZPfqQJvk2fNb8Z9wVBIe2eMDIk1YKtt17uYX-o";

async function searchCompanies() {
    try {
        const response = await fetch("https://api.theirstack.com/v1/companies/search", {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "Authorization": `Bearer ${API_KEY}`
            },
            body: JSON.stringify({
                "page": 0,
                "limit": 10,
                "order_by": [
                    { "desc": true, "field": "confidence" },
                    { "desc": true, "field": "jobs" },
                    { "desc": true, "field": "num_jobs" }
                ],
                "company_country_code_or": ["IN"],
                "include_total_results": false,
                "blur_company_data": false
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Company Data:", data);
        
        // Example: Display the results
        const companyList = document.getElementById("company-list");
        companyList.innerHTML = "";

        if (data.companies && data.companies.length > 0) {
            data.companies.forEach(company => {
                const li = document.createElement("li");
                li.innerHTML = `
                    <strong>${company.name}</strong><br>
                    Industry: ${company.industry || "N/A"}<br>
                    Job Openings: ${company.num_jobs || 0}
                `;
                companyList.appendChild(li);
            });
        } else {
            companyList.innerHTML = "<li>No companies found.</li>";
        }

    } catch (error) {
        console.error("Error fetching company data:", error);
        document.getElementById("company-list").innerHTML = "<li>Error fetching company data.</li>";
    }
}

// Call the function when needed
searchCompanies();
