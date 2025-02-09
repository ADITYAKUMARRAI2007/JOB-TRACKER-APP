
<p align="center">
  <img src="assets/logo.webp" alt="Job Tracker Logo" width="120">
</p>

# Job Tracker App 🚀

## Overview
Job Tracker is a **feature-rich web application** designed to streamline job application tracking, **schedule interviews**, and manage job search progress effectively. The platform offers a **Kanban board**, **Google Calendar integration**, **job listing APIs**, and **Firebase authentication** for a seamless user experience.

## Features
- **User Authentication:** Secure login via Firebase Authentication with Google Sign-in (`firebase.js`).
- **Kanban Board:** Drag-and-drop system for tracking job applications through stages (`dashboard.html`).
- **Job Listings:** Fetch and display job postings dynamically via API (`fetch.js`).
- **Interview Scheduling:** Google Calendar API integration for interview reminders (`jobsapi.js`).
- **Real-time Statistics:** Display job tracking insights using `Chart.js`.
- **Dark Mode Support:** Toggle between light and dark UI themes (`stylesdash.css`).
- **Logout Functionality:** Securely sign out and clear session data.
- **Error Handling & Validation:** Ensures smooth user interactions.

## Technologies Used
| Technology   | Purpose |
|-------------|------------------------------------------------------|
| **HTML5**   | Structure of the web application |
| **CSS (Tailwind & Custom CSS)** | Enhances UI and responsiveness |
| **JavaScript (ES6+)** | Handles client-side interactivity |
| **Firebase Authentication** | Secure Google login authentication |
| **Google Calendar API** | Automates interview scheduling |
| **Job Search API** | Fetches job listings dynamically |
| **Chart.js** | Displays job statistics visually |
| **GitHub Pages / Vercel** | Hosting and deployment |

## API Integrations
### 1️⃣ **Google Calendar API** (`jobsapi.js`)
- **Functionality:** Allows users to schedule interviews.
- **API Endpoints:**
  - `POST /events` → Creates a calendar event.
  - `GET /events` → Fetches scheduled interviews.

### 2️⃣ **Job Search API** (`fetch.js`)
- **Functionality:** Fetches job listings from an external API.
- **API Endpoint:** `POST https://theirstack.p.rapidapi.com/v1/jobs/search`
- **Example Response:**
```json
{
  "jobs": [
    {
      "title": "Software Engineer",
      "company": "Company XYZ",
      "location": "Remote",
      "salary": "$80,000"
    }
  ]
}
```

## Installation & Setup
### Prerequisites
- **Node.js** installed on your machine.
- **Firebase CLI** for authentication configuration.

### Steps
1. **Clone the repository:**
   ```sh
   git clone https://github.com/your-username/job-tracker.git
   cd job-tracker
   ```
2. **Install dependencies:**
   ```sh
   npm install
   ```
3. **Start the development server:**
   ```sh
   npm start
   ```
4. **Set up Firebase Authentication and Firestore** in `firebase.js`.
5. **Configure API keys for job listings and Google Calendar** in `fetch.js`.
6. **Run the application** by opening `index.html` in a browser or running:
   ```sh
   live-server
   ```

## Project Structure
```
job-tracker/
│-- index.html       # Login page
│-- dashboard.html   # User dashboard
│-- styles.css       # Login page styles
│-- stylesdash.css   # Dashboard styles
│-- scripts.js       # Firebase authentication logic
│-- firebase.js      # Firebase configuration
│-- jobsapi.js       # Job search API integration
│-- fetch.js         # Job data fetching logic
│-- logo.webp        # Application logo
│-- README.md        # Project documentation
```

## Usage
1. **Launch the application in a browser.**
2. **Sign in** using Google Authentication to access the dashboard.
3. **Track job applications** via the Kanban board.
4. **Search for new jobs** dynamically from external APIs.
5. **Schedule interviews** and sync them with Google Calendar.
6. **Monitor job search progress** through analytics and charts.
7. **Enable notifications** for job updates and interview schedules.

## Future Enhancements
- **Email Notifications:** Automated alerts for upcoming interviews.
- **AI Resume Analysis:** AI-powered feedback on uploaded resumes.
- **Job Recommendation System:** AI-driven job suggestions based on user activity.
- **Mobile App Version:** React Native-based app for Android & iOS.
- **CSV Export:** Export application history for records.

## Deployment
### **GitHub Pages Deployment**
```sh
npm run build
npm run deploy
```
### **Vercel Deployment**
```sh
vercel
```

## License
This project is licensed under the **MIT License**, allowing modifications and commercial use.

## Contributors
- **Aditya Kumar Rai** - Developer & Designer

## Contact
For inquiries, contributions, or support, email: `your-email@example.com` or connect via [GitHub](https://github.com/your-username).

