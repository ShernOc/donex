import { createContext, useState, useEffect, useContext } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(sessionStorage.getItem("token") || "");
  const navigate = useNavigate();


  console.log("access token ", token);
  console.log("current user ", user);
  
  useEffect(() => {
    if (token) {
      fetchCurrentUser();
    }
  }, [token]);

  // Register user
  const registerUser = async (formData, userType) => {
    try {
      toast.loading("Registering...");
  
      const userPayload = {
        ...formData,
        userType,
        password: formData.password || "google_oauth_placeholder", // Ensures a password for OAuth users
      };
  
      const response = await fetch("http://127.0.0.1:5000/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userPayload),
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
      console.error("Registration failed:", error);
    }
  };
  
  const login_with_google = async (email) => {
    try {
      toast.loading("Logging you in ...");

      const response = await fetch("http://127.0.0.1:5000/google-login", {
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
        sessionStorage.setItem("token", data.access_token);
        setToken(data.access_token);

        // Fetch user details
        const userResponse = await fetch("http://127.0.0.1:5000/current_user", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${data.access_token}`,
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
      toast.error(error.message || "Something went wrong. Please try again.");
    }
  };
  
  
  // Login user
  const loginUser = async (email, password) => {
    try {
      toast.loading("Logging you in ...");
      const response = await fetch("http://127.0.0.1:5000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      toast.dismiss();

      if (!response.ok) throw new Error(data.error || "Login failed!");

      localStorage.setItem("token", data.access_token);
      setToken(data.access_token);

      // Wait before fetching user
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Get User
      const userResponse = await fetch("http://127.0.0.1:5000/current_user", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${data.access_token}`,
        },
      });

      const userData = await userResponse.json();
      if (!userResponse.ok) throw new Error("User data retrieval failed");

      setUser(userData);
      sessionStorage.setItem("user", JSON.stringify(userData));

      console.log("User Role:", userData.role);

      // Ensure navigation happens only when userData is set
      if (userData.role === "admin") {
        navigate("/admin/dashboard");
      } else if (userData.role === "user") {
        navigate("donor/dashboard");
      } else if (userData.role === "charity") {
        navigate("charity/dashboard");
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
      const response = await fetch("http://127.0.0.1:5000/current_user", {
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

  const updateUser = async (userId, updatedData) => {
    if (!userId) {
      console.error("User ID is undefined. Cannot update profile.");
      return Promise.reject("User ID is required.");
    }
  
    try {
      const response = await fetch(`http://127.0.0.1:5000/user/${userId}`, {
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
      await fetch("http://127.0.0.1:5000/logout", {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
  
      setUser(null);
      setToken("");
  
      // Clear all stored data
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("user");
      localStorage.removeItem("user");  // Ensure local storage is also cleared
  
      navigate("/login");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };
  
  return (
    <UserContext.Provider value={{ user, registerUser, loginUser,setUser, logoutUser, updateUser,login_with_google }}>
      {children}
    </UserContext.Provider>
  );
};
