import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { 
  getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged, 
  createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail 
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";

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
const loginButton = document.getElementById("login-btn");
const signupButton = document.getElementById("signup-btn");
const errorMessage = document.getElementById("error-message");
const showError = (message) => {
  if (errorMessage) {
    errorMessage.textContent = `Error: ${message}`;
  }
};

if (signInButton) {
  signInButton.addEventListener("click", async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      localStorage.setItem("user", JSON.stringify(result.user));
      window.location.href = "dashboard.html";
    } catch (error) {
      showError(error.message);
      console.error("Google Sign-in Error:", error.code, error.message);
    }
  });
}

if (loginButton) {
  loginButton.addEventListener("click", async () => {
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!email || !password) {
      showError("Please enter both email and password.");
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      localStorage.setItem("user", JSON.stringify(userCredential.user));
      window.location.href = "dashboard.html";
    } catch (error) {
      showError(error.message);
      console.error("Login Error:", error.code, error.message);
    }
  });
}

if (signupButton) {
  signupButton.addEventListener("click", async () => {
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!email || !password) {
      showError("Please enter both email and password.");
      return;
    }

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      alert("Account created! Please log in.");
    } catch (error) {
      showError(error.message);
      console.error("Signup Error:", error.code, error.message);
    }
  });
}

if (resetPasswordButton) {
  resetPasswordButton.addEventListener("click", async () => {
    const email = document.getElementById("email").value.trim();

    if (!email) {
      showError("Please enter your email to reset the password.");
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      alert("Password reset email sent. Check your inbox.");
    } catch (error) {
      showError(error.message);
      console.error("Reset Password Error:", error.code, error.message);
    }
  });
}
if (signOutButton) {
  signOutButton.addEventListener("click", async () => {
    try {
      await signOut(auth);
      localStorage.removeItem("user");
      window.location.href = "index.html";
    } catch (error) {
      showError(error.message);
      console.error("Logout Error:", error.code, error.message);
    }
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
