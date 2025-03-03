import { useState } from "react";
import { useUser } from "../context/UserContext";
import { useNavigate, Link } from "react-router-dom";

const RegisterAdmin = () => {
  const { registerAdmin } = useUser(); 
  const navigate = useNavigate();
  const [message, setMessage] = useState("");

  const [adminForm, setAdminForm] = useState({
    full_name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAdminForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (adminForm.password !== adminForm.confirmPassword) {
      setMessage("Passwords do not match");
      return;
    }

    try {
      const response = await registerAdmin({
        full_name: adminForm.full_name,
        email: adminForm.email,
        password: adminForm.password,
        role: "admin", 
      });

      if (response.success) {
        setMessage("Admin account created successfully!");
        setTimeout(() => navigate("/admin-dashboard"), 2000); 
      } else {
        setMessage(response.msg || "Error creating admin");
      }
    } catch (error) {
      setMessage("Registration failed. Please try again.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-6">
      <div className="w-full max-w-lg bg-white shadow-xl rounded-xl p-6">
        <h2 className="text-3xl font-bold text-center text-gray-800">Register as an Admin</h2>

        {message && <p className="text-center text-red-500">{message}</p>}

        <form onSubmit={handleSubmit} className="space-y-4 mt-6">
          <input
            type="text"
            name="full_name"
            placeholder="Full Name"
            value={adminForm.full_name}
            onChange={handleChange}
            required
            className="w-full p-3 border rounded-lg focus:ring focus:ring-red-300"
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={adminForm.email}
            onChange={handleChange}
            required
            className="w-full p-3 border rounded-lg focus:ring focus:ring-red-300"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={adminForm.password}
            onChange={handleChange}
            required
            className="w-full p-3 border rounded-lg focus:ring focus:ring-red-300"
          />
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={adminForm.confirmPassword}
            onChange={handleChange}
            required
            className="w-full p-3 border rounded-lg focus:ring focus:ring-red-300"
          />
          <button type="submit" className="w-full p-3 text-white bg-red-500 hover:bg-red-600 rounded-lg">
            Register as an Admin
          </button>
          <p className="text-center text-gray-900">
            Already have an account? <Link to="/login" className="text-rose-500 hover:underline">Login</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default RegisterAdmin;

