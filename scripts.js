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
const signInButton = document.getElementById('google-signin-btn');
const signOutButton = document.getElementById('signout-btn');
const userInfoDisplay = document.getElementById('user-info');
const errorMessage = document.getElementById('error-message');

// Sign-in event
signInButton.addEventListener('click', () => {
  signInWithPopup(auth, provider)
    .then((result) => {
      const user = result.user;
      userInfoDisplay.innerHTML = `Welcome, ${user.displayName}!`;
      signInButton.style.display = 'none';
      signOutButton.style.display = 'block';
      errorMessage.textContent = '';
       window.location.href = "dashboard.html"
    })
    .catch((error) => {
      errorMessage.textContent = `Error: ${error.message}`;
    });
});

// Sign-out event
signOutButton.addEventListener('click', () => {
  signOut(auth)
    .then(() => {
      userInfoDisplay.innerHTML = '';
      signInButton.style.display = 'block';
      signOutButton.style.display = 'none';
      errorMessage.textContent = '';
    })
    .catch((error) => {
      errorMessage.textContent = `Error: ${error.message}`;
    });
});

// Monitor auth state
onAuthStateChanged(auth, (user) => {
  if (user) {
    userInfoDisplay.innerHTML = `Welcome, ${user.displayName}!`;
    signInButton.style.display = 'none';
    signOutButton.style.display = 'block';
  } else {
    userInfoDisplay.innerHTML = '';
    signInButton.style.display = 'block';
    signOutButton.style.display = 'none';
  }
});
