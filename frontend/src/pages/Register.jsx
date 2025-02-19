import { useState, useContext } from "react";
import { UserContext } from "../context/UserContext";
import { Link, useNavigate } from "react-router-dom";

const Register = () => {
  const { registerUser, registerCharity } = useContext(UserContext);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("user");
  const [showPassword, setShowPassword] = useState({
    userPassword: false,
    userConfirmPassword: false,
    charityPassword: false,
    charityConfirmPassword: false,
  });
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
    const formData = formType === "user" ? userForm : charityForm;
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

  const togglePassword = (field) => {
    setShowPassword((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-lg bg-white shadow-lg rounded-lg p-8 space-y-6">
        <h2 className="text-2xl font-bold text-center text-gray-900">Register</h2>
        <div className="flex mb-6 border-b">
          <button className={`w-1/2 py-3 ${activeTab === "user" ? "text-red-500 border-b-2 border-red-500" : "text-white"}`} onClick={() => setActiveTab("user")}>
            User
          </button>
          <button className={`w-1/2 py-3 ${activeTab === "charity" ? "text-red-500 border-b-2 border-red-500" : "text-white"}`} onClick={() => setActiveTab("charity")}>
            Charity
          </button>
        </div>

        {error && <p className="text-red-500 text-center">{error}</p>}
        {message && <p className="text-green-500 text-center">{message}</p>}

        <form onSubmit={(e) => handleSubmit(e, activeTab)} className="space-y-6">
          {activeTab === "user" ? (
            <>
              <input type="text" name="fullName" placeholder="Full Name" value={userForm.fullName} onChange={(e) => handleChange(e, "user")} className="w-full px-4 py-3 border rounded-lg text-gray-900" required />
              <input type="email" name="email" placeholder="Email" value={userForm.email} onChange={(e) => handleChange(e, "user")} className="w-full px-4 py-3 border rounded-lg text-gray-900" required />
              <input type="password" name="password" placeholder="Password" value={userForm.password} onChange={(e) => handleChange(e, "user")} className="w-full px-4 py-3 border rounded-lg text-gray-900" required />
              <input type="password" name="confirmPassword" placeholder="Confirm Password" value={userForm.confirmPassword} onChange={(e) => handleChange(e, "user")} className="w-full px-4 py-3 border rounded-lg text-gray-900" required />
            </>
          ) : (
            <>
              <input type="text" name="charityName" placeholder="Charity Name" value={charityForm.charityName} onChange={(e) => handleChange(e, "charity")} className="w-full px-4 py-3 border rounded-lg text-gray-900" required />
              <input type="email" name="email" placeholder="Email" value={charityForm.email} onChange={(e) => handleChange(e, "charity")} className="w-full px-4 py-3 border rounded-lg text-gray-900" required />
              <input type="password" name="password" placeholder="Password" value={charityForm.password} onChange={(e) => handleChange(e, "charity")} className="w-full px-4 py-3 border rounded-lg text-gray-900" required />
              <input type="password" name="confirmPassword" placeholder="Confirm Password" value={charityForm.confirmPassword} onChange={(e) => handleChange(e, "charity")} className="w-full px-4 py-3 border rounded-lg text-gray-900" required />
              <textarea name="description" placeholder="Description" value={charityForm.description} onChange={(e) => handleChange(e, "charity")} className="w-full px-4 py-3 border rounded-lg text-gray-900" required />
            </>
          )}
          <button type="submit" className="w-full bg-rose-500 text-white py-3 rounded-lg hover:bg-rose-600">Register</button>
        </form>

        <p className="text-center text-gray-900">Already have an account? <Link to="/login" className="text-rose-500 hover:underline">Login</Link></p>
      </div>
    </div>
  );
};

export default Register;
