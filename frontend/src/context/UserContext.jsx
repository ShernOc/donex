import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [authToken, setAuthToken] = useState(sessionStorage.getItem("token"));
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  console.log("User", user)

  // ✅ Register Function
  const register = async (formData, userType) => {
    toast.loading("Registering...");
    try {
      const response = await fetch("http://127.0.0.1:5000/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, userType }),
      });

      const data = await response.json();
      toast.dismiss();

      if (response.ok) {
        toast.success("Registration successful!");
        navigate("/login"); // ✅ Redirect to login page
      } else {
        toast.error(data.error || "Registration failed!");
      }
    } catch (error) {
      toast.dismiss();
      toast.error("An error occurred. Please try again.");
    }
  };

  // ✅ Login Function
  const login = async (email, password) => {
    toast.loading("Logging in...");
    try {
      const response = await fetch("http://127.0.0.1:5000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      toast.dismiss();

      if (response.ok) {
        sessionStorage.setItem("token", data.access_token);
        setAuthToken(data.access_token);
        await fetchUser();
        toast.success("Successfully logged in!");
        navigate("/dashboard");
      } else {
        toast.error(data.error || "Login failed!");
      }
    } catch (error) {
      toast.dismiss();
      toast.error("An error occurred. Please try again.");
    }
  };

  // ✅ Fetch Current User
  const fetchUser = async () => {
    if (!authToken) return;
    try {
      const response = await fetch("http://127.0.0.1:5000/user", {
        method: "GET",
        headers: { Authorization: `Bearer ${authToken}` },
      });

      const data = await response.json();
      if (response.ok) {
        setUser(data);
      } else {
        setAuthToken(null);
        sessionStorage.removeItem("token");
      }
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  };

  // ✅ Logout Function
  const logout = async () => {
    try {
      const response = await fetch("http://127.0.0.1:5000/logout", {
        method: "DELETE",
        headers: { Authorization: `Bearer ${authToken}` },
      });

      if (response.ok) {
        setAuthToken(null);
        setUser(null);
        sessionStorage.removeItem("token");
        toast.success("Logged out successfully!");
        navigate("/login");
      } else {
        toast.error("Failed to log out.");
      }
    } catch (error) {
      toast.error("An error occurred.");
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (authToken) fetchUser();
  }, [authToken]);

  return (
    <UserContext.Provider value={{ authToken, user, register, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};
