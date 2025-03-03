import { createContext, useState, useEffect, useContext } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const[admin,setAdmin] = useState(null)
  const [token, setToken] = useState(sessionStorage.getItem("token") || "");
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      fetchCurrentUser();
    }
  }, [token]);

  
// register user
  const registerUser = async (formData, userType) => {
    try {
      toast.loading("Registering...");
      const response = await fetch("http://127.0.0.1:5000/register", {
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
      console.error("Registration failed:", error);
    }
  };

  const registerAdmin = async (formData) => {
    try {
      toast.loading("Registering admin...");
      const response = await fetch("http://127.0.0.1:5000/register_admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
  
      const data = await response.json();
      toast.dismiss();
  
      if (response.ok) {
        toast.success(data.msg || "Admin registered successfully!");
        navigate("/login"); 
      } else {
        toast.error(data.error || "Admin registration failed.");
      }
    } catch (error) {
      toast.dismiss();
      toast.error("Something went wrong. Please try again.");
      console.error("Admin registration failed:", error);
    }
  };

  // Login User/Admin
  const loginUser = async (email, password ) => {
    toast.loading("Logging you in ...");
  
    try {
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
      if (userData.role ==="admin") {
        navigate("/admin/dashboard");
      } else if (userData.role === "user") {
        navigate("donor/dashboard");
      } 
      else {
        navigate("/");
      }

    } catch (error) {
      toast.dismiss();
      toast.error(error.message || "Login failed!");
      console.error("Login error:", error);
    }
  };

  // Getting the User
  const fetchAllUsers= async () => {
    try {
      const response = await fetch(`http://127.0.0.1:5000/users`, {
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
  
// Getting the current User
  const fetchUser_ById= async (id) => {
    try {
      const response = await fetch(`http://127.0.0.1:5000/users/${id}`, {
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

  // Getting the current User
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

//   Logout User
  const logoutUser = async () => {
    try {
      await fetch("http://127.0.0.1:5000/logout", {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      setUser(null);
      setToken("");
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
      const response = await fetch(`http://127.0.0.1:5000/users/delete/${id}`, {
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
    <UserContext.Provider value={{ user,admin, registerAdmin, registerUser, fetchAllUsers, loginUser, logoutUser, deleteUser, fetchUser_ById,fetchCurrentUser}}>
      {children}
    </UserContext.Provider>
  );
};
