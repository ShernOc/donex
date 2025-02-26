

// import { useState } from "react";
// import { useUser } from "../context/UserContext";
// import { Link, useNavigate } from "react-router-dom";
// import { FaGithub, FaGoogle } from "react-icons/fa";
// import signinwithgoogle from "./Google"; // Ensure these are correctly imported
// import signinwithgithub from "./Github";

// const Login = () => {
//   const navigate = useNavigate();
//   const { loginUser } = useUser();
//   const [form, setForm] = useState({ email: "", password: "" });
//   const [error, setError] = useState("");
//   const [showPassword, setShowPassword] = useState(false);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setForm({ ...form, [name]: value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const email = form.email.trim();
//     const password = form.password.trim();

//     if (!email || !password) {
//       setError("Please fill in all fields!");
//       return;
//     }
//     setError("");

//     try {
//       const user = await loginUser(email, password);
//       if (!user) throw new Error("Invalid email or password");

//       const { role } = user;
//       if (role === "charity") {
//         navigate("/charity/dashboard");
//       } else if (role === "donor") {
//         navigate("/donor/dashboard");
//       } else {
//         navigate("/");
//       }
//     } catch (error) {
//       setError(error.message || "Login failed!");
//     }
//   };

//   const togglePassword = () => {
//     setShowPassword(!showPassword);
//   };

//   const handleGoogleLogin = async () => {
//     try {
//       await signinwithgoogle(); // Call the Google login function
//       navigate("/donor/dashboard");
//     } catch (error) {
//       setError("Google login failed!");
//     }
//   };

//   const handleGithubLogin = async () => {
//     try {
//       await signinwithgithub();
//       navigate("/donor/dashboard");
//     } catch (error) {
//       setError(`GitHub login failed! ${error.message}`);
//     }
//   };

//   return (
//     <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-blue-500 to-purple-600 p-4">
//       <div className="w-full max-w-md bg-white dark:bg-gray-900 shadow-lg rounded-3xl p-8 space-y-6">
//         <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-gray-300">
//           Login
//         </h2>

//         {error && <p className="text-red-500 text-center">{error}</p>}

//         <form onSubmit={handleSubmit} className="space-y-6">
//           <input
//             type="email"
//             name="email"
//             placeholder="Email"
//             value={form.email}
//             onChange={handleChange}
//             className="w-full px-4 py-3 border rounded-lg shadow-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700 border-gray-300 focus:ring-2 focus:ring-blue-500 transition transform hover:scale-105 duration-300"
//             required
//           />
//           <div className="relative">
//             <input
//               type={showPassword ? "text" : "password"}
//               name="password"
//               placeholder="Password"
//               value={form.password}
//               onChange={handleChange}
//               className="w-full px-4 py-3 border rounded-lg shadow-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700 border-gray-300 focus:ring-2 focus:ring-blue-500 transition transform hover:scale-105 duration-300"
//               required
//             />
//             <button
//               type="button"
//               onClick={togglePassword}
//               className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 focus:outline-none"
//             >
//               {showPassword ? "Hide" : "Show"}
//             </button>
//           </div>
//           <button
//             type="submit"
//             className="w-full p-3 text-white bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg shadow-lg hover:scale-105 transition transform duration-300"
//           >
//             Login
//           </button>
//         </form>

//         <div className="flex flex-col space-y-4 mt-4">
//           <button
//             onClick={handleGoogleLogin}
//             className="flex items-center justify-center p-3 text-gray-700 bg-gray-100 rounded-lg shadow hover:scale-105 transition transform duration-300"
//           >
//             <FaGoogle className="w-5 h-5 mr-2" />
//             Login with Google
//           </button>
//           <button
//             onClick={handleGithubLogin}
//             className="flex items-center justify-center p-3 text-gray-700 bg-gray-100 rounded-lg shadow hover:scale-105 transition transform duration-300"
//           >
//             <FaGithub className="w-5 h-5 mr-2" />
//             Login with Github
//           </button>
//         </div>

//         <p className="text-center dark:text-gray-300 text-gray-700">
//           Don't have an account?{" "}
//           <Link to="/register" className="text-blue-400 hover:underline">
//             Register
//           </Link>
//         </p>
//       </div>
//     </div>
//   );
// };

// export default Login;

import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { FaGoogle, FaGithub } from "react-icons/fa";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  
  const { loginUser } = useUser();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      await loginUser(email, password, navigate);
    } catch (err) {
      setError(err.message);
    }
  };

  const togglePassword = () => setShowPassword((prev) => !prev);

  const handleGoogleLogin = () => {
    console.log("Google login clicked");
  };

  const handleGithubLogin = () => {
    console.log("GitHub login clicked");
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-blue-500 to-purple-600 p-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-900 shadow-lg rounded-3xl p-8 space-y-6">
        <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-gray-300">
          Login
        </h2>

        {error && <p className="text-red-500 text-center">{error}</p>}

        <form onSubmit={handleLogin} className="space-y-6">
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 border rounded-lg shadow-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700 border-gray-300 focus:ring-2 focus:ring-blue-500 transition transform hover:scale-105 duration-300"
            required
          />
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border rounded-lg shadow-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700 border-gray-300 focus:ring-2 focus:ring-blue-500 transition transform hover:scale-105 duration-300"
              required
            />
            <button
              type="button"
              onClick={togglePassword}
              className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 focus:outline-none"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
          <button
            type="submit"
            className="w-full p-3 text-white bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg shadow-lg hover:scale-105 transition transform duration-300"
          >
            Login
          </button>
        </form>

        <div className="flex flex-col space-y-4 mt-4">
          <button
            onClick={handleGoogleLogin}
            className="flex items-center justify-center p-3 text-gray-700 bg-gray-100 rounded-lg shadow hover:scale-105 transition transform duration-300"
          >
            <FaGoogle className="w-5 h-5 mr-2" />
            Login with Google
          </button>
          <button
            onClick={handleGithubLogin}
            className="flex items-center justify-center p-3 text-gray-700 bg-gray-100 rounded-lg shadow hover:scale-105 transition transform duration-300"
          >
            <FaGithub className="w-5 h-5 mr-2" />
            Login with Github
          </button>
        </div>
       
        <p className="text-center dark:text-gray-300 text-gray-700">
          Don&apos;t have an account?{" "}
          <Link to="/register" className="text-blue-400 hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
