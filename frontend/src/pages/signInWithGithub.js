import { GithubAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../firebase"; // Ensure this is your Firebase config file

const githubProvider = new GithubAuthProvider();

const githubLogin = async () => {
  try {
    const result = await signInWithPopup(auth, githubProvider);
    console.log("User signed in:", result.user);
    return result.user;
  } catch (error) {
    console.error("Github login error:", error);
    throw error;
  }
};

export default { githubLogin };
