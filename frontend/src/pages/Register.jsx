import { useState, useContext } from "react";
import { UserContext } from "../context/UserContext";
import {CharityContext} from "../context/CharityContext";
import { Link, useNavigate } from "react-router-dom";

const Register = () => {
  const {registerUser} = useContext(UserContext);
  const {registerCharity}=useContext(CharityContext);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("user");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const [userForm, setUserForm] = useState({
    full_name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "user", 
  });

  const [charityForm, setCharityForm] = useState({
    charity_name: "",
    email: "",
    password: "",
    confirmPassword: "",
    description: "",
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
      setError("Passwords do not match!");
      return;
    }
    setError("");
    

      if (formType === "user") {
      await registerUser(userForm);
      navigate("/login");
    } else {
      await registerCharity(charityForm);
      setMessage("Your charity application is successful, pending approval.");
    }
};
  
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-700 p-4">
      <div className="w-full max-w-lg bg-white shadow-lg  rounded-lg p-8 space-y-6">
        <h2 className="text-2xl font-bold text-center text-gray-900">Register</h2>
        
        {/* Tabs */}
        <div className="flex mb-6 border-b">
          <button
            className={`w-1/2 py-3 ${activeTab === "user" ? "text-red-500 border-b-2 border-red-500" : "text-gray-500"}`}
            onClick={() => setActiveTab("user")}
          >
            Donor/Admin
          </button>
          <button
            className={`w-1/2 py-3 ${activeTab === "charity" ? "text-red-500 border-b-2 border-red-500" : "text-gray-500"}`}
            onClick={() => setActiveTab("charity")}
          >
            Charity
          </button>
        </div>

        {/* Error Messages */}
        {error && <p className="text-red-500 text-center">{error}</p>}
        {message && <p className="text-green-500 text-center">{message}</p>}

        {/* Forms */}
        <form onSubmit={(e) => handleSubmit(e, activeTab)} className="space-y-6">
          {activeTab === "user" ? (
            <>
              <input
                type="text"
                name="full_name"
                placeholder="Full Name"
                value={userForm.full_name}
                onChange={(e) => handleChange(e, "user")}
                className="w-full px-4 py-3 border rounded-lg text-gray-900"
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={userForm.email}
                onChange={(e) => handleChange(e, "user")}
                className="w-full px-4 py-3 border rounded-lg text-gray-900"
                required
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={userForm.password}
                onChange={(e) => handleChange(e, "user")}
                className="w-full px-4 py-3 border rounded-lg text-gray-900"
                required
              />
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                value={userForm.confirmPassword}
                onChange={(e) => handleChange(e, "user")}
                className="w-full px-4 py-3 border rounded-lg text-gray-900"
                required
              />

              {/* Role Selection for Users/Admins */}
              <select
                name="role"
                value={userForm.role}
                onChange={(e) => handleChange(e, "user")}
                className="w-full p-3 border rounded-lg text-gray-900"
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </>
          ) : (
            <>
              <input
                type="text"
                name="charity_name"
                placeholder="Charity Name"
                value={charityForm.charity_name}
                onChange={(e) => handleChange(e, "charity")}
                className="w-full px-4 py-3 border rounded-lg text-gray-900"
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={charityForm.email}
                onChange={(e) => handleChange(e, "charity")}
                className="w-full px-4 py-3 border rounded-lg text-gray-900"
                required
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={charityForm.password}
                onChange={(e) => handleChange(e, "charity")}
                className="w-full px-4 py-3 border rounded-lg text-gray-900"
                required
              />
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                value={charityForm.confirmPassword}
                onChange={(e) => handleChange(e, "charity")}
                className="w-full px-4 py-3 border rounded-lg text-gray-900"
                required
              />
              <textarea
                name="description"
                placeholder="Description"
                value={charityForm.description}
                onChange={(e) => handleChange(e, "charity")}
                className="w-full px-4 py-3 border rounded-lg text-gray-900"
                required
              />
            </>
          )}

          <button type="submit" className="w-full bg-rose-500 text-white py-3 rounded-lg hover:bg-rose-600">
            Register
          </button>
        </form>

        <p className="text-center text-gray-900">
          Already have an account? <Link to="/login" className="text-rose-500 hover:underline">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;

