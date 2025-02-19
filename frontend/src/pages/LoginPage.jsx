import { useState, useContext } from "react";
import { UserContext } from "../context/UserContext";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const { loginUser } = useContext(UserContext);
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      setError("Please fill in all fields!");
      return;
    }
    setError("");

    loginUser(form)
      .then(() => navigate("/dashboard"))
      .catch((err) => setError("Invalid email or password!"));
  };

  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-blue-500 to-purple-600 p-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-900 shadow-lg rounded-3xl p-8 space-y-6">
        <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-gray-300">
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
            className="w-full px-4 py-3 border rounded-lg shadow-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700 border-gray-300 focus:ring-2 focus:ring-blue-500 transition transform hover:scale-105 duration-300"
            required
          />
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              className="w-full px-4 py-3 border rounded-lg shadow-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700 border-gray-300 focus:ring-2 focus:ring-blue-500 transition transform hover:scale-105 duration-300"
              required
            />
            <button
              type="button"
              onClick={togglePassword}
              className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 focus:outline-none"
            >
              {showPassword ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.98 8.852a10.477 10.477 0 000 6.296m-.654-7.592a1.5 1.5 0 01.22-.593 11.968 11.968 0 0116.707 0 1.5 1.5 0 01.22.593m.654 7.592a10.477 10.477 0 000-6.296M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.98 8.852a10.477 10.477 0 000 6.296m-.654-7.592a1.5 1.5 0 01.22-.593 11.968 11.968 0 0116.707 0 1.5 1.5 0 01.22.593m.654 7.592a10.477 10.477 0 000-6.296M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 3v2.25m-9 3.25a3 3 0 100 6h18a3 3 0 100-6H3z"
                  />
                </svg>
              )}
            </button>
          </div>
          <button
            type="submit"
            className="w-full p-3 text-white bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg shadow-lg hover:scale-105 transition transform duration-300"
          >
            Login
          </button>
        </form>

        <p className="text-center dark:text-gray-300 text-gray-700">
          Don't have an account?{" "}
          <Link to="/register" className="text-blue-400 hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
