// import { createContext, useContext, useEffect, useState } from "react";
// import { toast } from "react-toastify";

// export const CharityContext = createContext();

// export const useCharity = () => {
//   return useContext(CharityContext);
// };

// export const CharityProvider = ({ children }) => {
//   const [charities, setCharities] = useState([]);
//   const [charity, setCharity] = useState(null);

//   const [token, setToken] = useState(localStorage.getItem("charityToken") || "");


//   useEffect(() => {
//     fetchCharities();
//   }, []);

//   // get all charities
//   const fetchCharities = async () => {
//     try {
//       const response = await fetch("http://127.0.0.1:5001/charities", {
//         method: "GET",
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem("charityToken")}`,
//         },
//       });

//       const data = await response.json();
//       if (response.ok) {
//         setCharities(data.charities);
//       }
//     } catch (error) {
//       console.error("Error fetching charities:", error);
//     }
//   };

//   const getCharityById = async (id) => {
//     try {
//       const response = await fetch(`http://127.0.0.1:5001/charities/${id}`, {
//         method: "GET",
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem("charityToken")}`,
//         },
//       });
//       return response.json();
//     } catch (error) {
//       console.error("Error fetching charity by ID:", error);
//     }
//   };
  
//   // register Charity
//   const registerCharity = async (charityData) => {
//     try {
//       const response = await fetch("http://127.0.0.1:5001/charity", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ ...charityData, user_id: charityData.user_id || null, 
//         approved: "pending" }),
//       });

//       const data = await response.json();
//       if (response.ok) {
//         setCharities((prev) => [...prev, { id: data.charity_id, ...charityData, approved: "pending" }]);
//         alert("Your charity application is successful, pending admin approval.");
//       }
//       else{
//         toast.error(data.error ||"Failed to register Data")
//       }

//       return data;
//     } catch (error) {
//       console.error("Error posting charity:", error);

//       toast.error("An error occurred while posting charity.");

//     }
//   };

//   const approveCharity = async (id) => {
//     try {
//       const response = await fetch(`http://127.0.0.1:5001/charities/approve/${id}`, {
//         method: "PATCH",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${localStorage.getItem("charityToken")}`,
//         },
//       });
//       const data = await response.json();
//       if (response.ok) {
//         setCharities((prev) => prev.map((charity) => (charity.id === id ? { ...charity, approved: "approved" } : charity)));
//       }
//       return data;
//     } catch (error) {
//       console.error("Error approving charity:", error);
//     }
//   };

//   // update the charity 
//   const updateCharity = async (id, updateData) => {
//     try {
//       const response = await fetch(`http://127.0.0.1:5001/charities/update/${id}`, {
//         method: "PATCH",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${localStorage.getItem("charityToken")}`,
//         },
//         body: JSON.stringify(updateData),
//       });
//       const data = await response.json();
//       if (response.ok) {
//         setCharities((prev) => prev.map((charity) => (charity.id === id ? { ...charity, ...updateData } : charity)));
//       }
//       return data;
//     } catch (error) {
//       console.error("Error updating charity:", error);
//     }
//   };

//     // Login Charity
//     const loginCharity = async (email, password, navigate) => {
//       try {
//         const response = await fetch("http://127.0.0.1:5001/charity_login", {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ email, password }),
//         });
  
//         const data = await response.json();
//         if (response.ok) {
//           localStorage.setItem("charityToken", data.access_token);
//           setToken(data.access_token);
//           await fetchCharity(); // Fetch charity details after login
//           navigate("/charity-dashboard");
//         } else {
//           throw new Error(data.msg || "Login failed");
//         }
//       } catch (error) {
//         console.error("Login error:", error.message);
//       }
//     };
  
//     // Fetch current charity details
//     const fetchCharity_current_charity = async () => {
//       try {
//         const response = await fetch("http://127.0.0.1:5001/current_charity", {
//           headers: { Authorization: `Bearer ${token}` },
//         });
  
//         const data = await response.json();
//         if (response.ok) {
//           setCharity(data);
//         } else {
//           setCharity(null);
//         }
//       } catch (error) {
//         console.error("Error fetching charity:", error.message);
//       }
//     };
  
//     // Logout function
//     const logoutCharity = () => {
//       localStorage.removeItem("charityToken");
//       setToken("");
//       setCharity(null);
//     };
  
//     useEffect(() => {
//       if (token) {
//         fetchCharity();
//       }
//     }, [token]);

// //Delete Charity 

//   const deleteCharity = async (id) => {
//     try {
//       const response = await fetch(`http://127.0.0.1:5001/charity/delete/${id}`, {
//         method: "DELETE",
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem("charity_Token")}`,
//         },
//       });
//       const data = await response.json();
//       if (response.ok) {
//         setCharities((prev) => prev.filter((charity) => charity.id !== id));
//       }
//       return data;
//     } catch (error) {
//       console.error("Error deleting charity:", error);
//     }
//   };

//   return (
//     <CharityContext.Provider
//       value={{
//         charities,
//         fetchCharities,
//         fetchCharity_current_charity,
//         loginCharity,
//         logoutCharity,
//         getCharityById,
//         registerCharity,
//         approveCharity,
//         updateCharity,
//         deleteCharity,
//       }}
//     >
//       {/* charities: charities.filter((charity) => charity.approved === "approved"), */}
//       {children}
//     </CharityContext.Provider>
//   );
// };

import { createContext, useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";


export const CharityContext = createContext();

export const useCharity = () => useContext(CharityContext);


export const CharityProvider = ({ children }) => {
  const [charities, setCharities] = useState([]);
  const [charity, setCharity] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("charityToken") || "");

  useEffect(() => {                     
    if (token) {
      fetchCharities();
    }
  }, [token]);


// Register Charity
const registerCharity = async (formData, userType) => {
  try {
    const response = await fetch("http://127.0.0.1:5001/charity", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...formData,userType,
        approved: "pending",
      }),
    });
    const data = await response.json();
    if (response.ok) {
      setCharities((prev) => [
        ...prev,
        { id: data.charity_id, ...formData, approved: "pending" },
      ]);
      toast.success("Your charity application is successful, pending admin approval.");
    } else {
      toast.error(data.error || "Failed to register charity.");
    }
    return data;
  } catch (error) {
    console.error("Error posting charity:", error);
    toast.error("An error occurred while posting charity.");
  }
};

  // Get all charities
  const fetchCharities = async () => {
    try {
      const response = await fetch("http://127.0.0.1:5001/charities", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("charityToken")}`,
        },
      });

      const data = await response.json();
      if (response.ok) {
        setCharities(data.charities);
      }
    } catch (error) {
      console.error("Error fetching charities:", error);
    }
  };

  const getCharityById = async (id) => {
    try {
      const response = await fetch(`http://127.0.0.1:5001/charities/${id}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("charityToken")}`,
        },
      });
      return response.json();
    } catch (error) {
      console.error("Error fetching charity by ID:", error);
    }
  };

  
  // Login Charity
  const loginCharity = async (email, password, navigate) => {
    try {
      const response = await fetch("http://127.0.0.1:5001/charity_login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (response.ok) {
        localStorage.setItem("charityToken", data.access_token);
        setToken(data.access_token);
        await fetchCharity_current_charity(); // Fetch charity details after login
        navigate("/charity-dashboard");
      } else {
        throw new Error(data.msg || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error.message);
    }
  };

  // Fetch current charity details
  const fetchCharity_current_charity = async () => {
    try {
      const response = await fetch("http://127.0.0.1:5001/current_charity", {
        headers: { Authorization: `Bearer ${localStorage.getItem("charityToken")}` },
      });

      const data = await response.json();
      if (response.ok) {
        setCharity(data);
      } else {
        setCharity(null);
      }
    } catch (error) {
      console.error("Error fetching charity:", error.message);
    }
  };

  // Logout function
  const logoutCharity = () => {
    localStorage.removeItem("charityToken");
    setToken("");
    setCharity(null);
  };

  return (
    <CharityContext.Provider
      value={{
        charities,
        charity,
        fetchCharities,
        fetchCharity_current_charity,
        loginCharity,
        logoutCharity,
        getCharityById,
        registerCharity,
      }}
    >
      {children}
    </CharityContext.Provider>
  );
};


