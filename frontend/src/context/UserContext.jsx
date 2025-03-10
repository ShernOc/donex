import { createContext, useState, useEffect, useContext } from "react";
import PropTypes from "prop-types";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(sessionStorage.getItem("token") || "");
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      fetchCurrentUser();
    }
  }, [token]);

  // Register user
  const registerUser = async (formData, userType) => {
    try {
      toast.loading("Registering...");
      const response = await fetch("https://donex-uq5f.onrender.com/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, userType }),
      });

      const data = await response.json();
      toast.dismiss();

      if (response.ok) {
        toast.success(data.msg || "Registration successful!");
        navigate("/login");
      } else {
        toast.error(data.error || "Registration failed.");
      }
    } catch (error) {
      toast.dismiss();
      toast.error("Something went wrong. Please try again.");
      toast.error("Registration failed:", error);
  };
  
  UserProvider.propTypes = {
    children: PropTypes.node.isRequired,
  };
  };

  // Login user
  const loginUser = async (email, password) => {
    try {
      toast.loading("Logging you in ...");
      const response = await fetch("https://donex-uq5f.onrender.com/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      toast.dismiss();

      if (!response.ok) throw new Error(data.error || "Login failed!");

      localStorage.setItem("token", data.access_token);
      localStorage.setItem("role", data.role);

      await setToken(data.access_token);

      // Wait before fetching user
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Get User
      const userResponse = await fetch("https://donex-uq5f.onrender.com/current_user", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          Authorization: `Bearer ${data.access_token}`,
        },
      });

      const userData = await userResponse.json();
      // if (!userResponse.ok) throw new Error("User data retrieval failed");

      setUser(userData);
      sessionStorage.setItem("user", JSON.stringify(userData));

      console.log("User role:", userData.full_name);

      // Ensure navigation happens only when userData is set
      if (userData.role === "admin") {
        navigate("/admin/dashboard");
      } else if (userData.role === "user") {
        navigate("donor/dashboard");
      } else if (userData.role === "charity") {
        navigate("/charity/dashboard");
      } else {
        navigate("/");
      }

    } catch (error) {
      toast.dismiss();
      toast.error(error.message || "Login failed!");
      console.error("Login error:", error);
    }
  };

  // Fetch current user data
  const fetchCurrentUser = async () => {
    try {
      const response = await fetch("https://donex-uq5f.onrender.com/current_user", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      if (response.ok) {
        setUser(data);
        sessionStorage.setItem("user", JSON.stringify(data));
      } else {
        console.error("Failed to fetch user:", data.msg);
        logoutUser();
      }
    } catch (error) {
      console.error("Error fetching user:", error);
      logoutUser();
    }
  };
  

  const login_with_google = async (email) => {
    try {
      toast.loading("Logging you in ...");

      const response = await fetch("https://donex-uq5f.onrender.com/google-login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) throw new Error("Failed to log in with Google");

      const data = await response.json();
      toast.dismiss(); // Remove loading toast

      if (data.access_token) {
        localStorage.setItem("token", token);
        setToken(data.access_token);
        
        console.log("Google Token: ", token)
        // Fetch user details
        const userResponse = await fetch("https://donex-uq5f.onrender.com/current_user", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!userResponse.ok) throw new Error("Failed to fetch user data");
        const userData = await userResponse.json();

        if (userData.email) {
          setUser(userData);
        } else {
          throw new Error("User data is incomplete.");
        }
      } else {
        throw new Error(data.error || "Invalid email provided.");
      }
    } catch (error) {
      console.error("Google login error:", error);
      toast.dismiss();
        toast.error(String(error?.message || "Something went wrong. Please try again."));
    }
  };

  const updateUser = async (userId, updatedData) => {
    if (!userId) {
      console.error("User ID is undefined. Cannot update profile.");
      return Promise.reject("User ID is required.");
    }
  
    try {
      const response = await fetch(`https://donex-uq5f.onrender.com/user/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      });
  
      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status}`);
      }
  
      return await response.json();
    } catch (error) {
      console.error("Profile update failed:", error);
      throw error;
    }
  };
  
  

  // Logout user
  const logoutUser = async () => {
    try {
      await fetch("https://donex-uq5f.onrender.com/logout", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });

      setUser(null);
      setToken("");
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("user");
      navigate("/login");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  // admin to delete or user themselves
  const deleteUser = async (id) => {
    try {
      const response = await fetch(`https://donex-uq5f.onrender.com/users/delete/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await response.json();
      if (response.ok) {
        setUser((prev) => prev.filter((charity) => charity.id !== id));
      }
      return data;
    } catch (error) {
      console.error("Error deleting User:", error);
    }
  };

  return (
    <UserContext.Provider value={{ user, registerUser, loginUser, logoutUser, updateUser, login_with_google, deleteUser }}>
      {children}
    </UserContext.Provider>
  );
};
