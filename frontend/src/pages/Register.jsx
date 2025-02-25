import { useState } from "react";
import { useUser } from "../context/UserContext";
import { useNavigate } from "react-router-dom";  

const Register = () => {
  const { registerUser } = useUser();
  const navigate = useNavigate(); 
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "user", 
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.full_name || !formData.email || !formData.
      password || !formData.confirmPassword) {
      setError("Please fill in all fields!");
      return;
    }
  
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    setError("");
    await registerUser(formData, formData, navigate); 

  };
  
  return (
    
    <div className="flex justify-center items-center min-h-screen bg-white p-6">
      <div className="w-full max-w-lg bg-white dark:bg-gray-900 shadow-lg rounded-xl p-6">
        <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-gray-300">
          Register
        </h2>

        {error && <p className="text-red-500 text-center mt-2">{error}</p>}
        
        {/* Form */}
        <form onSubmit={handleSubmit}className="text-white font-white space-y-4 mt-6">
          <input
            type="text"
            name="full_name"
            placeholder="Full Name"
            value={formData.full_name}
            onChange={handleChange}
            required
            className="w-full p-3 border rounded-lg"
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full p-3 border rounded-lg"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full p-3 border rounded-lg"
          />
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            className="w-full p-3 border rounded-lg"
          />

          {/* Role Dropdown */}
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg"
          >
            <option value="user" className="text-black font-semibold">User</option>
            <option value="admin" className="text-black font-semibold" >Admin</option>
          </select>

          <button type="submit" className="w-fit 0.5 p-3 text-white bg-blue-500 rounded-lg">
            Register
          </button>
        </form>
      </div>
    </div>
  );
}

export default Register;


