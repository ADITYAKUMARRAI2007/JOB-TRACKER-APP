import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyAVnIv8VamXAhfKxZVjYNcS7l88h2Q1NaM",
  authDomain: "job-tracker-app-60030.firebaseapp.com",
  projectId: "job-tracker-app-60030",
  storageBucket: "job-tracker-app-60030.appspot.com",
  messagingSenderId: "567017229800",
  appId: "1:567017229800:web:debf51da5cfa064d91e85d",
  measurementId: "G-PM4YB5M8T2"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

const signInButton = document.getElementById("google-signin-btn");
const signOutButton = document.getElementById("signout-btn");
const loginButton = document.getElementById("login-btn");
const signupButton = document.getElementById("signup-btn");
const resetPasswordButton = document.getElementById("reset-password-btn");
const userInfoDisplay = document.getElementById("user-info");
const errorMessage = document.getElementById("error-message");

if (signInButton) {
  signInButton.addEventListener("click", () => {
    signInWithPopup(auth, provider).then((result) => {
      const user = result.user;
      localStorage.setItem("user", JSON.stringify(user));
      window.location.href = "dashboard.html";
    }).catch((error) => {
      errorMessage.textContent = `Error: ${error.message}`;
    });
  });
}

if (loginButton) {
  loginButton.addEventListener("click", () => {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    signInWithEmailAndPassword(auth, email, password).then((userCredential) => {
      console.log("Login Success:", userCredential.user);
      localStorage.setItem("user", JSON.stringify(userCredential.user));
      window.location.href = "dashboard.html";
    }).catch((error) => {
      console.error("Login Error:", error.code, error.message);
      alert(`Login Error: ${error.code} - ${error.message}`);
    });
  });
}

if (signupButton) {
  signupButton.addEventListener("click", () => {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    createUserWithEmailAndPassword(auth, email, password).then(() => {
      alert("Account created! Please log in.");
    }).catch((error) => {
      errorMessage.textContent = `Signup Error: ${error.message}`;
    });
  });
}

if (resetPasswordButton) {
  resetPasswordButton.addEventListener("click", () => {
    const email = document.getElementById("email").value;
    sendPasswordResetEmail(auth, email).then(() => {
      alert("Password reset email sent. Check your inbox.");
    }).catch((error) => {
      console.error("Reset Error:", error.code, error.message);
      alert(`Error: ${error.message}`);
    });
  });
}

if (signOutButton) {
  signOutButton.addEventListener("click", () => {
    signOut(auth).then(() => {
      localStorage.removeItem("user");
      window.location.href = "index.html";
    }).catch((error) => {
      errorMessage.textContent = `Error: ${error.message}`;
    });
  });
}

onAuthStateChanged(auth, (user) => {
  if (user) {
    localStorage.setItem("user", JSON.stringify(user));
    if (userInfoDisplay) {
      userInfoDisplay.innerHTML = `Welcome, ${user.displayName || user.email}!`;
    }
  }
});
