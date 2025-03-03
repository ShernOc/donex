import { useState, useContext } from "react";
import { UserContext } from "../context/UserContext";
import { CharityContext } from "../context/CharityContext.jsx";
import { Link, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { GoogleLogin } from "@react-oauth/google";
import { toast } from "react-toastify";

const Login = () => {
  const { loginUser, login_with_google } = useContext(UserContext);
  // const { loginCharity } = useContext(CharityContext); // Now correctly included

  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [userType, setUserType] = useState("donor");

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = form.email.trim();
    const password = form.password.trim();

    if (!email || !password) {
      setError("Please fill in all fields!");
      return;
    }

    setError("");
    setLoading(true);

    try {
      if (userType === "donor") {
        await loginUser(email, password);
        toast.success("Login successful!");
        navigate("/donor/dashboard");
      } else if (userType === "charity") {
        await loginCharity(email, password);
        toast.success("Login successful!");
        navigate("/charity/dashboard");
      }
    } catch (err) {
      setError("Invalid email or password!");
    } finally {
      setLoading(false);
    }
  };

  // Handle Google Login
  const handleGoogleLogin = async (credential) => {
    try {
      const user_details = jwtDecode(credential);
      await login_with_google(user_details.email);
      toast.success("Google login successful!");
      navigate("/donor/dashboard");
    } catch (error) {
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

        {/* User Type Selection */}
        <div className="flex justify-center space-x-4">
          <button
            className={`px-4 py-2 rounded-lg ${
              userType === "donor" ? "bg-red-500 text-white" : "bg-gray-300"
            }`}
            onClick={() => setUserType("donor")}
          >
            Donor
          </button>
          <button
            className={`px-4 py-2 rounded-lg ${
              userType === "charity" ? "bg-red-500 text-white" : "bg-gray-300"
            }`}
            onClick={() => setUserType("charity")}
          >
            Charity
          </button>
        </div>

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
          </div>
          <button
            type="submit"
            className="w-full p-3 text-white bg-red-500 rounded-lg shadow-lg hover:scale-105 transition transform duration-300"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* Google Login */}
        <GoogleLogin
          onSuccess={(credentialResponse) =>
            handleGoogleLogin(credentialResponse.credential)
          }
          onError={() => toast.error("Google Login Failed")}
        />

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
