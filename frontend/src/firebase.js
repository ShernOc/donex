import { initializeApp } from "firebase/app";
import { 
  getAuth, GoogleAuthProvider, signInWithPopup, signOut 
} from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyByW5Ail4aPtjNN7HhJ0KsXD8NkZCB3AlA",
  authDomain: "denox-e20ad.firebaseapp.com",
  projectId: "denox-e20ad",
  storageBucket: "denox-e20ad.appspot.com",
  messagingSenderId: "681090394697",
  appId: "1:681090394697:web:2b878a05d27d718208ed98",
  measurementId: "G-7HN31BWKLR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

// Google Sign-In Function
const signInWithGoogle = async (FormData,userType) => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    console.log("User Info:", user);
    
    // Send user data to SQLite (via backend API)
    await fetch("http://127.0.0.1:5000/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
       ...FormData,userType
      }),
    });
  } catch (error) {
    console.error("Sign-in Error:", error);
  }
};

// Logout Function
const logout = async () => {
  try {
    await signOut(auth);
    localStorage.removeItem("user");
    console.log("User signed out successfully");
  } catch (error) {
    console.error("Logout Error:", error);
  }
};

// Export the functions and instances
export { auth, googleProvider, signInWithGoogle, logout, db };
