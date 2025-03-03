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

  const [userForm, setUserForm] = useState({
    full_name: "",
    email: "",
    password: "",
    confirmPassword: "",
    profile_picture: null,
  });

  const [charityForm, setCharityForm] = useState({
    charity_name: "",
    email: "",
    password: "",
    confirmPassword: "",
    profile_picture: null,
  });

  const handleChange = (e, formType) => {
    const { name, value, type } = e.target;
    if (type === "file") {
      const file = e.target.files[0];
      if (formType === "user") {
        setUserForm((prev) => ({ ...prev, profile_picture: file }));
      } else {
        setCharityForm((prev) => ({ ...prev, profile_picture: file }));
      }
    } else {
      if (formType === "user") {
        setUserForm((prev) => ({ ...prev, [name]: value }));
      } else {
        setCharityForm((prev) => ({ ...prev, [name]: value }));
      }
    }
  };

  const handleSubmit = async (e, formType) => {
    e.preventDefault();
    const formData = formType === "user" ? userForm : charityForm;
    setMessage("");
    await registerUser(formData, formType, navigate);
  };

  function signUpWithGoogle(token) {
    console.log("Sign up token:", token);
    const decoded = jwtDecode(token);
  
    const googleUser = {
      full_name: decoded.name,
      email: decoded.email,
      profile_picture: decoded.picture,
      password: "google_oauth_placeholder", // Placeholder password
    };
  
    registerUser(googleUser, "user"); // Registers as a user by default
  }
  

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-6">
      <div className="w-full max-w-lg bg-white shadow-xl rounded-xl p-6">
        <h2 className="text-3xl font-bold text-center text-gray-800">Register</h2>

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

        {message && <p className="text-green-500 text-center mt-2">{message}</p>}

        <form onSubmit={(e) => handleSubmit(e, activeTab)} className="space-y-4 mt-6">
          {activeTab === "user" ? (
            <>
              <input type="text" name="full_name" placeholder="Full Name" value={userForm.full_name} onChange={(e) => handleChange(e, "user")} required className="w-full p-3 border rounded-lg focus:ring focus:ring-red-300" />
              <input type="email" name="email" placeholder="Email" value={userForm.email} onChange={(e) => handleChange(e, "user")} required className="w-full p-3 border rounded-lg focus:ring focus:ring-red-300" />
              <input type="password" name="password" placeholder="Password" value={userForm.password} onChange={(e) => handleChange(e, "user")} required className="w-full p-3 border rounded-lg focus:ring focus:ring-red-300" />
              <input type="password" name="confirmPassword" placeholder="Confirm Password" value={userForm.confirmPassword} onChange={(e) => handleChange(e, "user")} required className="w-full p-3 border rounded-lg focus:ring focus:ring-red-300" />
              <input type="file" name="profile_picture" accept="image/png, image/jpeg" onChange={(e) => handleChange(e, "user")} />
            </>
          ) : (
            <>
              <input type="text" name="charity_name" placeholder="Charity Name" value={charityForm.charity_name} onChange={(e) => handleChange(e, "charity")} required className="w-full p-3 border rounded-lg focus:ring focus:ring-red-300" />
              <input type="email" name="email" placeholder="Email" value={charityForm.email} onChange={(e) => handleChange(e, "charity")} required className="w-full p-3 border rounded-lg focus:ring focus:ring-red-300" />
              <input type="password" name="password" placeholder="Password" value={charityForm.password} onChange={(e) => handleChange(e, "charity")} required className="w-full p-3 border rounded-lg focus:ring focus:ring-red-300" />
              <input type="password" name="confirmPassword" placeholder="Confirm Password" value={charityForm.confirmPassword} onChange={(e) => handleChange(e, "charity")} required className="w-full p-3 border rounded-lg focus:ring focus:ring-red-300" />
              <input type="file" name="profile_picture" accept="image/png, image/jpeg" onChange={(e) => handleChange(e, "charity")} />
            </>
          )}
          <button type="submit" className="w-full p-3 text-white bg-red-500 hover:bg-red-600 rounded-lg">Register</button>
          <div>
            <GoogleLogin onSuccess={(response) => signUpWithGoogle(response.credential)} onError={() => console.log("Login failed")} />
          </div>
          <p className="text-center text-gray-900">Already have an account? <Link to="/login" className="text-rose-500 hover:underline">Login</Link></p>
        </form>
      </div>
    </div>
  );
};

export default Register;
