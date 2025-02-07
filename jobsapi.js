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

    // Fetch and display companies
    searchCompanies();
});

const API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhZGl0eWFyYWkwNDAxMjAwN0BnbWFpbC5jb20iLCJwZXJtaXNzaW9ucyI6InVzZXIifQ.tN9FVZPfqQJvk2b8Z9wVBIe2eMDIk1YKtt17uYX-o";

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
                "company_country_code_or": ["IN"]
            })
        });

        console.log("Response Headers:", response.headers);
        console.log("Status Code:", response.status);

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Company Data:", data);
    } catch (error) {
        console.error("Error fetching company data:", error);
    }
}

