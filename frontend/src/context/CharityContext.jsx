import { createContext, useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { updateCurrentUser } from "firebase/auth";
import PropTypes from 'prop-types';

export const CharityContext = createContext();

export const useCharity = () => {
};

CharityProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const CharityProvider = ({ children }) => {
  const [charities, setCharities] = useState([]);
  const navigate = useNavigate();
  const [token, setToken] = useState(sessionStorage.getItem("token") || "");
   const [loading, setLoading] = useState(false);


  // post charities 
  const registerCharity = async (charityData ) => {
    try {
      toast.loading("Registering...");
      const response = await fetch("https://donex-uq5f.onrender.com/charities", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(charityData),
      });

      const data = await response.json();
      if (response.ok) {
        toast.success(data.msg || "Registration successful!");
        navigate("/login");
      } else {
        toast.error(data.error || "Failed to register charity");
      }
      
    } catch (error) {
      toast.dismiss();
      toast.error("An error occurred while posting charity.");
      console.error("Error posting charity:", error);
    }
  };

  // Charity Login 
  const loginCharity = async (email, password) => {
    toast.loading("Logging in as Charity...");
    try {
      const response = await fetch("https://donex-uq5f.onrender.com/charities/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      toast.dismiss();

      if (!response.ok) throw new Error(data.error || "Login failed!");

      // Store token
      localStorage.setItem("token", data.access_token);
      setToken(data.access_token);

      // Fetch charity details
      await new Promise((resolve) => setTimeout(resolve, 500));

      // get charity 
      const charityResponse = await fetch("https://donex-uq5f.onrender.com/current_charities", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${data.access_token}`,
        },
      });
      
      const charityData = await charityResponse.json();
      if (!charityResponse.ok) throw new Error("Charity data retrieval failed");
      
      setCharities(charityData);
      sessionStorage.setItem("charity", JSON.stringify(charityData));

      console.log("Charity name :", charityData.charity_name);
      
      // Navigate to Charity Dashboard
      if (charityData.email){
        navigate("/charity/dashboard");
      } 
      else
            {
        navigate("/");
      }

      if (!charityResponse.status === 401) {
        navigate("/charity/login"); 
        return;
      }
          
    } catch (error) {
      toast.dismiss();
      toast.error(error.message || "Login failed!");
      console.error("Login error:", error);
    }
  };

  // Get all the charities 
  const fetchCharities = async () => {
    setLoading(true)
    try {
      const response = await fetch("https://donex-uq5f.onrender.com/charities?status=approved", {
        method: "GET",
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      if (response.ok) {
        setCharities(data);
      } else {
        console.error("Failed to fetch charity:", data.msg);
      }
    } catch (error) {
      console.error("Error fetching charities:", error);
    }finally{
      setLoading(false)
    }

  };
  

  
  const fetchCharityById = async (charity_id) => {
    try {
      const response = await fetch(`https://donex-uq5f.onrender.com/charities/${charity_id}`)
      
      
      if (!response.ok) throw new Error("Failed to fetch");
      const data=await response.json()
      return data; 
    } catch (error) {
      console.error("Error fetching charity:", error);
      return null;
    }
  };

  


  // Logout Charity
  const logoutCharity = async () => {
    try {
      await fetch("https://donex-uq5f.onrender.com/charities/logout", {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      setCharities(null);
      setToken("");
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("charity");
      navigate("/login");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  
  const deleteCharity = async (id) => {
    try {
      const response = await fetch(`https://donex-uq5f.onrender.com/charities/delete/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("CharityToken")}`,
        },
      });
      const data = await response.json();
      if (response.ok) {
        setCharities((prev) => prev.filter((charity) => charity.id !== id));
      }
      return data;
    } catch (error) {
      console.error("Error deleting charity:", error);
    }
  };

   // fetch the charities
   useEffect(() => {
    fetchCharities();
  }, []);

  useEffect(() => {
    if(token){
      updateCurrentUser();
  } 
  },[token]);

  

  return (
    <CharityContext.Provider
      value={{
        charities,
        fetchCharities,
        fetchCharityById,
        registerCharity,
        loginCharity,
        logoutCharity,
        deleteCharity,
      }}
    >
      {children}
    </CharityContext.Provider>
  );
};