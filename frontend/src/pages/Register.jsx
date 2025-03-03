import { useState } from "react";
import { useUser } from "../context/UserContext";
import { useNavigate, Link } from "react-router-dom";
import { signInWithGoogle } from "../firebase";

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
    profile_picture: "",
  });

  const [charityForm, setCharityForm] = useState({
    full_name: "",
    email: "",
    password: "",
    confirmPassword: "",
    description:"",
    url:""
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
    setMessage("");

    if (formType === "charity") {
      if (charityForm.password !== charityForm.confirmPassword) {
        setMessage("Passwords do not match");
        return;
      }
      await registerCharity({
        charity_name: charityForm.charity_name,
        email: charityForm.email,
        password: charityForm.password,
        user_id:user?.id ||null,
        description:charityForm.description,
        url:charityForm.url
      });
    } else {
      if (userForm.password !== userForm.confirmPassword) {
        setMessage("Passwords do not match");
        return;
      }
      await registerUser({
        full_name: userForm.full_name,
        email: userForm.email,
        password: userForm.password,
      });
      {
        setMessage("User account created successfully!");
      }
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-6">
      <div className="w-full max-w-lg bg-white shadow-xl rounded-xl p-6">
        <h2 className="text-3xl font-bold text-center text-gray-800">Register</h2>

     {/* Tab Switcher  */}
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

        {/* Form */}
        <form onSubmit={(e) => handleSubmit(e, activeTab)} className="space-y-4 mt-6">
          {activeTab === "user" ? (
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
          ) : (
            <>
              <input
                type="text"
                name="charity_name"
                placeholder="Charity Name"
                value={charityForm.charity_name}
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
              <textarea
              name="description"
              placeholder="Enter description"
              value={charityForm.description}
              onChange={(e) => handleChange(e, "charity")}
              required
              className="w-full p-3 border rounded-lg focus:ring focus:ring-red-300 h-24"
            />
            <input
              type="text"
              name="url"
              placeholder="Website URL"
              value={charityForm.url}
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
          )}
          <button type="submit" className="w-full p-3 text-white bg-red-500 hover:bg-red-600 rounded-lg">
            Register
          </button>
          <button
            onClick={handleGoogleSignIn}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600 transition"
          >
            sign in with Google
          </button>
          <p className="text-center text-gray-900">
            Already have an account? <Link to="/login" className="text-rose-500 hover:underline">Login</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;
