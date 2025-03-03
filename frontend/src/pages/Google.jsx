import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../firebase"; 

const googleProvider = new GoogleAuthProvider();

const googleLogin = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    console.log("User signed in:", result.user);
    return result.user;
  } catch (error) {
    console.error("Google login error:", error);
    throw error;
  }
};

export default { googleLogin };
