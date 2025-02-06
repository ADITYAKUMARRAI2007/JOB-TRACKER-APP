// Initialize Firebase (Using the global firebase object)
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
  const app = firebase.initializeApp(firebaseConfig);
  const auth = firebase.auth();
  const provider = new firebase.auth.GoogleAuthProvider();
  
  // Get DOM elements
  const signInButton = document.getElementById('google-signin-btn');
  const signOutButton = document.getElementById('signout-btn');
  const userInfoDisplay = document.getElementById('user-info');
  const errorMessage = document.getElementById('error-message');
  
  // Sign in with Google
  signInButton.addEventListener('click', () => {
    firebase.auth().signInWithPopup(provider)
      .then((result) => {
        const user = result.user;
        userInfoDisplay.innerHTML = `Welcome, ${user.displayName}!`;
        signInButton.style.display = 'none'; // Hide sign-in button
        signOutButton.style.display = 'block'; // Show sign-out button
        errorMessage.textContent = ''; // Clear any error message
      })
      .catch((error) => {
        errorMessage.textContent = `Error: ${error.message}`;
      });
  });
  
  // Sign out
  signOutButton.addEventListener('click', () => {
    firebase.auth().signOut()
      .then(() => {
        userInfoDisplay.innerHTML = '';
        signInButton.style.display = 'block'; // Show sign-in button
        signOutButton.style.display = 'none'; // Hide sign-out button
        errorMessage.textContent = ''; // Clear error message
      })
      .catch((error) => {
        errorMessage.textContent = `Error: ${error.message}`;
      });
  });
  
  // Monitor authentication state
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      userInfoDisplay.innerHTML = `Welcome, ${user.displayName}!`;
      signInButton.style.display = 'none'; // Hide sign-in button
      signOutButton.style.display = 'block'; // Show sign-out button
    } else {
      userInfoDisplay.innerHTML = '';
      signInButton.style.display = 'block'; // Show sign-in button
      signOutButton.style.display = 'none'; // Hide sign-out button
    }
  });
  