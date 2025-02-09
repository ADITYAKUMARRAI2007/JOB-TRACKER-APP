
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";


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

export { auth, provider, signInWithPopup, signOut, onAuthStateChanged };
