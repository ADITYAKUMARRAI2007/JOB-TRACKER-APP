// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { 
  getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged, 
  createUserWithEmailAndPassword, signInWithEmailAndPassword 
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";

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
const loginButton = document.getElementById("login-btn");
const signupButton = document.getElementById("signup-btn");
const userInfoDisplay = document.getElementById("user-info");
const errorMessage = document.getElementById("error-message");

// ✅ Google Sign-in event
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

// ✅ Email/Password Login
// Email/Password Login
if (loginButton) {
  loginButton.addEventListener("click", () => {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        console.log("Login Success:", userCredential.user);
        localStorage.setItem("user", JSON.stringify(userCredential.user));
        window.location.href = "dashboard.html";
      })
      .catch((error) => {
        console.error("Login Error:", error.code, error.message);
        alert(`Login Error: ${error.message}`);
      });
  });
}

// Email/Password Signup
if (signupButton) {
  signupButton.addEventListener("click", () => {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    createUserWithEmailAndPassword(auth, email, password)
      .then(() => {
        console.log("Signup Success:", email);
        alert("Account created! Please log in.");
      })
      .catch((error) => {
        console.error("Signup Error:", error.code, error.message);
        alert(`Signup Error: ${error.message}`);
      });
  });
};

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
      userInfoDisplay.innerHTML = `Welcome, ${user.displayName || user.email}!`;
    }
  }
});
