// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAVnIv8VamXAhfKxZVjYNcS7l88h2Q1NaM",
  authDomain: "job-tracker-app-60030.firebaseapp.com",
  projectId: "job-tracker-app-60030",
  storageBucket: "job-tracker-app-60030.appspot.com", 
  messagingSenderId: "567017229800",
  appId: "1:567017229800:web:debf51da5cfa064d91e85d",
  measurementId: "G-PM4YB5M8T2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// DOM Elements
const signInButton = document.getElementById("google-signin-btn");
const signOutButton = document.getElementById("signout-btn");
const userInfoDisplay = document.getElementById("user-info");
const errorMessage = document.getElementById("error-message");

// ✅ Sign-in event
if (signInButton) {
  signInButton.addEventListener("click", () => {
    signInWithPopup(auth, provider)
      .then((result) => {
        const user = result.user;
        localStorage.setItem("user", JSON.stringify(user)); // Store user info
        window.location.href = "dashboard.html"; // Redirect to dashboard after login
      })
      .catch((error) => {
        errorMessage.textContent = `Error: ${error.message}`;
      });
  });
}

// ✅ Sign-out event
if (signOutButton) {
  signOutButton.addEventListener("click", () => {
    signOut(auth)
      .then(() => {
        localStorage.removeItem("user"); // Remove user data
        window.location.href = "index.html"; // Redirect to login page
      })
      .catch((error) => {
        errorMessage.textContent = `Error: ${error.message}`;
      });
  });
}

// ✅ Monitor authentication state
onAuthStateChanged(auth, (user) => {
  if (user) {
    localStorage.setItem("user", JSON.stringify(user)); // Save user data
    if (userInfoDisplay) {
      userInfoDisplay.innerHTML = `Welcome, ${user.displayName}!`;
    }
    
    // Only redirect to dashboard if on login page
    if (window.location.pathname.includes("index.html")) {
      window.location.href = "dashboard.html";
    }
  } else {
    localStorage.removeItem("user"); // Clear user data

    // If not logged in and on dashboard, redirect to login
    // if (window.location.pathname.includes("dashboard.html")) {
    //   // window.location.href = "index.html";
    // }
  }
});
