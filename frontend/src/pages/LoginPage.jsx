import { useState, useContext } from "react";
import { UserContext } from "../context/UserContext";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { jwtDecode } from "jwt-decode";
import { GoogleLogin } from "@react-oauth/google";
import { toast } from "react-toastify"; 

const Login = () => {
  const { loginUser, login_with_google } = useContext(UserContext);
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = form.email.trim();
    const password = form.password.trim();
    if (!email || !password) {
      setError("Please fill in all fields!");
      return;
    }
    setError("");
    try {
      setLoading(true);
      await loginUser(email, password);
    } catch {
      setError("Invalid email or password!");
    } finally {
      setLoading(false);
    }
  };

  // Function to determine user type based on email
  const determineUserType = (email) => {
    if (email.includes("charity")) return "charity";
    return "donor";
  };

  const handleGoogleLogin = async (credential) => {
    try {
      if (!credential || typeof credential !== "string") {
        toast.error("Invalid Google response. Please try again.");
        return;
      }
  
      const user_details = jwtDecode(credential);
      const detectedUserType = determineUserType(user_details.email);
  
      console.log("User type:", detectedUserType); 
  
      await login_with_google(user_details.email);
      toast.success("Google login successful!");
  
  
      if (detectedUserType === "donor") {
        navigate("/donor/dashboard");
        console.log("Inner Navigating to:", detectedUserType); 
      } else if (detectedUserType === "charity") {
        navigate("/charity/dashboard");
        console.log("Inner Navigating to:", detectedUserType); 
      } else {
        toast.error("User type not recognized.");
      }
    } catch (error) {
      console.error("Google login error:", error);
      toast.error("Failed to login with Google. Please try again.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-md bg-gray-200 dark:bg-gray-800 shadow-lg rounded-3xl p-8 space-y-6">
        <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-gray-200">
          Login
        </h2>

        {error && <p className="text-red-500 text-center">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="w-full px-4 py-3 border rounded-lg shadow-md dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 border-gray-300 focus:ring-2 focus:ring-red-500 transition transform hover:scale-105 duration-300"
            required
          />
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              className="w-full px-4 py-3 border rounded-lg shadow-md dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 border-gray-300 focus:ring-2 focus:ring-red-500 transition transform hover:scale-105 duration-300"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
            <div className="text-white">
            <Link to="/forgot-password" className="hover:underline">
              Forgot Password?
            </Link>
          </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full p-3 text-white bg-red-500 rounded-lg shadow-lg hover:scale-105 transition transform duration-300"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* Google Login */}
        <div className="flex justify-center">
          <GoogleLogin
            onSuccess={(credentialResponse) =>
              handleGoogleLogin(credentialResponse.credential)
            }
            onError={() => toast.error("Google Login Failed")}
          />
        </div>

        <p className="text-center text-gray-800 dark:text-gray-300">
          Don&apos;t have an account?{" "}
          <Link to="/register" className="text-red-500 hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;