import { useState, useContext } from "react";
import { UserContext } from "../context/UserContext";
import { Link, useNavigate } from "react-router-dom";

const Register = () => {
  const { registerUser, registerCharity } = useContext(UserContext);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("user");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const [userForm, setUserForm] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [charityForm, setCharityForm] = useState({
    charityName: "",
    email: "",
    password: "",
    confirmPassword: "",
    description: "",
  });

  const handleChange = (e, formType) => {
    const { name, value } = e.target;
    if (formType === "user") {
      setUserForm({ ...userForm, [name]: value });
    } else {
      setCharityForm({ ...charityForm, [name]: value });
    }
  };

  const handleSubmit = (e, formType) => {
    e.preventDefault();
    const formData = formType ==="user" ? userForm : charityForm;
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }
    setError("");

    if (formType === "user") {
      registerUser(userForm);
      navigate("/login");
    } else {
      registerCharity(charityForm);
      setMessage("Your charity application is successful, pending approval.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-blue-500 to-purple-600 p-4">
      <div className="w-full max-w-lg bg-white dark:bg-gray-900 shadow-lg rounded-3xl p-8 space-y-6">
        <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-gray-300">
          Register
        </h2>
        <div className="flex mb-6 border-b-2 border-gray-300">
          <button
            className={`w-1/2 py-3 text-lg font-semibold ${
              activeTab === "user"
                ? "text-rose-500 border-b-4 border-rose-500"
                : "text-gray-400"
            }`}
            onClick={() => setActiveTab("user")}
          >
            User
          </button>
          <button
            className={`w-1/2 py-3 text-lg font-semibold ${
              activeTab === "charity"
                ? "text-rose-500 border-b-4 border-rose-500"
                : "text-gray-400"
            }`}
            onClick={() => setActiveTab("charity")}
          >
            Charity
          </button>
        </div>

        {error && <p className="text-red-500 text-center">{error}</p>}
        {message && <p className="text-green-500 text-center">{message}</p>}

        <form
          onSubmit={(e) => handleSubmit(e, activeTab)}
          className="space-y-6"
        >
          {activeTab === "user" ? (
            <>
              <input
                type="text"
                name="fullName"
                placeholder="Full Name"
                value={userForm.fullName}
                onChange={(e) => handleChange(e, "user")}
                className="w-full px-4 py-3 border rounded-lg shadow-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700 border-gray-300 focus:ring-2 focus:ring-blue-500 transition transform hover:scale-105 duration-300"
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={userForm.email}
                onChange={(e) => handleChange(e, "user")}
                className="w-full px-4 py-3 border rounded-lg shadow-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700 border-gray-300 focus:ring-2 focus:ring-blue-500 transition transform hover:scale-105 duration-300"
                required
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={userForm.password}
                onChange={(e) => handleChange(e, "user")}
                className="w-full px-4 py-3 border rounded-lg shadow-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700 border-gray-300 focus:ring-2 focus:ring-blue-500 transition transform hover:scale-105 duration-300"
                required
              />
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                value={userForm.confirmPassword}
                onChange={(e) => handleChange(e, "user")}
                className="w-full px-4 py-3 border rounded-lg shadow-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700 border-gray-300 focus:ring-2 focus:ring-blue-500 transition transform hover:scale-105 duration-300"
                required
              />
            </>
          ) : (
            <>
              <input
                type="text"
                name="charityName"
                placeholder="Charity Name"
                value={charityForm.charityName}
                onChange={(e) => handleChange(e, "charity")}
                className="w-full px-4 py-3 border rounded-lg shadow-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700 border-gray-300 focus:ring-2 focus:ring-blue-500 transition transform hover:scale-105 duration-300"
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={charityForm.email}
                onChange={(e) => handleChange(e, "charity")}
                className="w-full px-4 py-3 border rounded-lg shadow-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700 border-gray-300 focus:ring-2 focus:ring-blue-500 transition transform hover:scale-105 duration-300"
                required
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={charityForm.password}
                onChange={(e) => handleChange(e, "charity")}
                className="w-full px-4 py-3 border rounded-lg shadow-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700 border-gray-300 focus:ring-2 focus:ring-blue-500 transition transform hover:scale-105 duration-300"
                required
              />
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                value={charityForm.confirmPassword}
                onChange={(e) => handleChange(e, "charity")}
                className="w-full px-4 py-3 border rounded-lg shadow-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700 border-gray-300 focus:ring-2 focus:ring-blue-500 transition transform hover:scale-105 duration-300"
                required
              />
              <textarea
                name="description"
                placeholder="Description"
                value={charityForm.description}
                onChange={(e) => handleChange(e, "charity")}
                className="w-full px-4 py-3 border rounded-lg shadow-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700 border-gray-300 focus:ring-2 focus:ring-blue-500 transition transform hover:scale-105 duration-300"
                required
              />
            </>
          )}
          <button
            type="submit"
            className="w-full p-3 text-white bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg shadow-lg hover:scale-105 transition transform duration-300"
          >
            Register
          </button>
        </form>

        <p className="text-center dark:text-gray-300 text-gray-700">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-400 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
