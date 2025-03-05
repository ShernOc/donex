import { useState } from "react";
import { useUser } from "../context/UserContext";
import { useNavigate, Link } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";

const Register = () => {
  const { registerUser } = useUser();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("user");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [userForm, setUserForm] = useState({
    full_name: "",
    email: "",
    password: "",
    confirmPassword: "",
    profile_picture: "",
  });

  const [charityForm, setCharityForm] = useState({
    full_name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e, formType) => {
    const { name, value } = e.target;
    if (formType === "user") {
      setUserForm((prev) => ({ ...prev, [name]: value }));
    } else {
      setCharityForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e, formType) => {
    e.preventDefault();
    const formData = formType === "user" ? userForm : charityForm;

    if (formData.password !== formData.confirmPassword) {
      setMessage("Passwords do not match");
      return;
    }

    setIsLoading(true);
    setMessage("");

    try {
      await registerUser(formData, formType, navigate);
    } catch (error) {
      setMessage(error.message || "Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignUp = async (credentialResponse) => {
    setIsLoading(true);
    setMessage("");

    try {
      // Decode the JWT token to get user information
      const decoded = jwtDecode(credentialResponse.credential);

      const googleUser = {
        full_name: decoded.name,
        email: decoded.email,
        profile_picture: decoded.picture,
        password: "google_oauth_placeholder", // Placeholder password for Google users
      };

      // Register the user using the Google OAuth data
      await registerUser(googleUser, "user", navigate);
    } catch (error) {
      setMessage(error.message || "Google Sign-Up failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const getFormFields = () => {
    if (activeTab === "user") {
      return (
        <>
          <input
            type="text"
            name="full_name"
            placeholder="Full Name"
            value={userForm.full_name}
            onChange={(e) => handleChange(e, "user")}
            required
            className="w-full p-3 border rounded-lg focus:ring focus:ring-red-300"
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={userForm.email}
            onChange={(e) => handleChange(e, "user")}
            required
            className="w-full p-3 border rounded-lg focus:ring focus:ring-red-300"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={userForm.password}
            onChange={(e) => handleChange(e, "user")}
            required
            className="w-full p-3 border rounded-lg focus:ring focus:ring-red-300"
          />
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={userForm.confirmPassword}
            onChange={(e) => handleChange(e, "user")}
            required
            className="w-full p-3 border rounded-lg focus:ring focus:ring-red-300"
          />
        </>
      );
    } else {
      return (
        <>
          <input
            type="text"
            name="full_name"
            placeholder="Charity Name"
            value={charityForm.full_name}
            onChange={(e) => handleChange(e, "charity")}
            required
            className="w-full p-3 border rounded-lg focus:ring focus:ring-red-300"
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={charityForm.email}
            onChange={(e) => handleChange(e, "charity")}
            required
            className="w-full p-3 border rounded-lg focus:ring focus:ring-red-300"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={charityForm.password}
            onChange={(e) => handleChange(e, "charity")}
            required
            className="w-full p-3 border rounded-lg focus:ring focus:ring-red-300"
          />
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={charityForm.confirmPassword}
            onChange={(e) => handleChange(e, "charity")}
            required
            className="w-full p-3 border rounded-lg focus:ring focus:ring-red-300"
          />
        </>
      );
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-6">
      <div className="w-full max-w-lg bg-white shadow-xl rounded-xl p-6">
        <h2 className="text-3xl font-bold text-center text-gray-800">Register</h2>

        {/* Tab Switcher */}
        <div className="flex mt-4 border-b">
          <button
            className={`w-1/2 py-3 text-lg font-semibold ${
              activeTab === "user" ? "border-b-4 border-red-500 text-red-500" : "text-gray-500"
            }`}
            onClick={() => setActiveTab("user")}
          >
            Donor
          </button>
          <button
            className={`w-1/2 py-3 text-lg font-semibold ${
              activeTab === "charity" ? "border-b-4 border-red-500 text-red-500" : "text-gray-500"
            }`}
            onClick={() => setActiveTab("charity")}
          >
            Charity
          </button>
        </div>

        {message && <p className="text-red-500 text-center mt-2">{message}</p>}

        {/* Form */}
        <form onSubmit={(e) => handleSubmit(e, activeTab)} className="space-y-4 mt-6">
          {getFormFields()}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full p-3 text-white bg-red-500 hover:bg-red-600 rounded-lg disabled:bg-gray-400"
          >
            {isLoading ? "Registering..." : "Register"}
          </button>
          <div className="flex justify-center mt-4">
            <GoogleLogin
              onSuccess={handleGoogleSignUp}
              onError={() => setMessage("Google Sign-In failed. Please try again.")}
            />
          </div>
          <p className="text-center text-gray-900">
            Already have an account? <Link to="/login" className="text-rose-500 hover:underline">Login</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;