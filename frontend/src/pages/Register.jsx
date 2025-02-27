import { useState } from "react";
import { useUser } from "../context/UserContext";
import { useNavigate } from "react-router-dom";  

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
  });

  const [charityForm, setCharityForm] = useState({
    full_name: "",
    email: "",
    password: "",
    confirmPassword: ""
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
    console.log(formData);
    // if (!formData.charityName ||!formData.email ||!formData.password ||!formData.confirmPassword) {
    //   setMessage("Please be patient while the admins are reviewing your charity.");

    //   return;
    // }
   
    setMessage("");
    await registerUser(formData, formType, navigate); 
  };

  return (
    // Changed background from a gradient to plain white
    <div className="flex justify-center items-center min-h-screen bg-white p-6">
      <div className="w-full max-w-lg bg-white dark:bg-gray-900 shadow-lg rounded-xl p-6">
        <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-gray-300">
          Register
        </h2>

        {/* Tab Switcher */}
        <div className="flex mt-4 border-b">
          <button
            className={`w-1/2 py-3 text-lg font-semibold ${
              activeTab === "user" ? "border-b-4 border-blue-500 text-blue-500" : "text-gray-500"
            }`}
            onClick={() => setActiveTab("user")}
          >
            User
          </button>
          <button
            className={`w-1/2 py-3 text-lg font-semibold ${
              activeTab === "charity" ? "border-b-4 border-blue-500 text-blue-500" : "text-gray-500"
            }`}
            onClick={() => setActiveTab("charity")}
          >
            Charity
          </button>
        </div>

        {message && <p className="text-green-500 text-center mt-2">{message}</p>}

        {/* Form */}
        <form onSubmit={(e) => handleSubmit(e, activeTab)} className="text-white font-white space-y-4 mt-6">
          {activeTab === "user" ? (
            <>
              <input
                type="text"
                name="full_name"
                placeholder="Full Name"
                value={userForm.full_name}
                onChange={(e) => handleChange(e, "user")}
                required
                className="w-full p-3 border rounded-lg"
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={userForm.email}
                onChange={(e) => handleChange(e, "user")}
                required
                className="w-full p-3 border rounded-lg"
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={userForm.password}
                onChange={(e) => handleChange(e, "user")}
                required
                className="w-full p-3 border rounded-lg"
              />
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                value={userForm.confirmPassword}
                onChange={(e) => handleChange(e, "user")}
                required
                className="w-full p-3 border rounded-lg"
              />
            </>
          ) : (
            <>
              <input
                type="text"
                name="full_name"
                placeholder="Charity Name"
                value={charityForm.charityName}
                onChange={(e) => handleChange(e, "charity")}
                required
                className="w-full p-3 border rounded-lg"
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={charityForm.email}
                onChange={(e) => handleChange(e, "charity")}
                required
                className="w-full p-3 border rounded-lg"
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={charityForm.password}
                onChange={(e) => handleChange(e, "charity")}
                required
                className="w-full p-3 border rounded-lg"
              />
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                value={charityForm.confirmPassword}
                onChange={(e) => handleChange(e, "charity")}
                required
                className="w-full p-3 border rounded-lg"
              />
            </>
          )}
          <button type="submit" className="w-full p-3 text-white bg-blue-500 rounded-lg">
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;