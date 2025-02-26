import { GithubAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../firebase"; 

function Github() {
  const githubLogin = async () => {
    try {
      const provider = new GithubAuthProvider();
      const result = await signInWithPopup(auth, provider);
      console.log("Github Login Successful:", result.user);
    } catch (error) {
      console.error("Github Login Error:", error.message);
      throw error; // ✅ Rethrow to be caught in the Login component
    }
  };

  return { githubLogin }; // ✅ Return function properly
}

export default Github;
