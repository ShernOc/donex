import { useState, useContext } from "react";
import { UserContext } from "../context/UserContext";
import { CharityContext } from "../context/CharityContext.jsx";
import { Link, useNavigate } from "react-router-dom";
// import { FaGithub, FaGoogle } from "react-icons/fa";
// import signinwithgoogle from "./Google.jsx"; 

const Login = () => {
  const { loginUser } = useContext(UserContext);
  const {loginCharity}=useContext(CharityContext)
  const navigate = useNavigate();
  // const { googleLogin } = signinwithgoogle; 

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [userType, setUserType] = useState("donor");
  
  
 
// Handle change 
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
    setLoading(true);


    try {
      if (userType === "donor") {
         await loginUser(email, password);
        navigate("/donor/dashboard"); 

      } else if (userType === "charity") {
         await loginCharity(email, password);navigate("/charity/dashboard");
      }
    } catch {
      setError("Invalid email or password!");
    } finally {
      setLoading(false);
    }
  };

  const togglePassword = () => {
    setShowPassword(!showPassword);
  };


  // const handleGoogleLogin = async () => {
  //   try {
  //     await googleLogin();
  //     console.log("Logged in user:", user);
  //     navigate("/donor/dashboard");
  //   } catch (error) {
  //     console.error(error);
  //     setError("Google login failed!");
  //   }
  // };

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

        <div className="flex flex-col space-y-4 mt-4">
          {/* <button
            onClick={handleGoogleLogin}
            className="flex items-center justify-center p-3 text-gray-800 bg-gray-300 rounded-lg shadow hover:scale-105 transition transform duration-300"
          >
            <FaGoogle className="w-5 h-5 mr-2" />
            Login with Google
          </button> */}
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

