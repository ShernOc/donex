// import { createContext, useContext, useState } from "react";
// import PropTypes from "prop-types";

// const DonationContext = createContext();

// export const DonationProvider = ({ children }) => {
//   const [donations, setDonations] = useState([]);
//   const [error, setError] = useState(null);
//   const [loading, setLoading] = useState(false);

//   // Create a donation
//   const createDonation = async (charityId, amount, isAnonymous) => {
//     setLoading(true);
//     setError(null);

//     try {
//       const response = await fetch("https://donex-uq5f.onrender.com/create-donation", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${localStorage.getItem("token")}`,
//         },
//         body: JSON.stringify({
//           charity_id: charityId,
//           amount: parseFloat(amount),
//           is_anonymous: isAnonymous,
//         }),
//       });

//       if (!response.ok) {
//         throw new Error(`Failed to create donation: ${response.statusText}`);
//       }

//       const data = await response.json();

//       // Ensure the PayPal link is present in the response
//       if (!data.paypalLink) {
//         throw new Error("No PayPal link found in the response");
//       }

//       // Update local state if needed (optional)
//       setDonations((prev) =>
//         Array.isArray(prev) ? [...prev, data.order] : [data.order]
//       );

//       // Return the PayPal link and order data
//       return { paypalLink: data.paypalLink, order: data.order };
//     } catch (error) {
//       console.error("Error creating donation:", error.message);
//       setError(error.message);
//       throw error; // Re-throw the error to handle it in the component
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Fetch all donations (optional)
//   const fetchDonations = async () => {
//     setLoading(true);
//     setError(null);

//     try {
//       const response = await fetch("https://donex-uq5f.onrender.com/donations", {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem("token")}`,
//         },
//       });

//       if (!response.ok) {
//         throw new Error(`Failed to fetch donations: ${response.statusText}`);
//       }

//       const data = await response.json();
//       setDonations(data);
//     } catch (error) {
//       console.error("Error fetching donations:", error.message);
//       setError(error.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <DonationContext.Provider
//       value={{
//         donations,
//         createDonation,
//         fetchDonations,
//         error,
//         loading,
//       }}
//     >
//       {children}
//     </DonationContext.Provider>
//   );
// };
// DonationProvider.propTypes = {
//   children: PropTypes.node.isRequired,
// };

// export const useDonation = () => useContext(DonationContext);

import { createContext, useContext, useState, useEffect } from "react";


export const DonationContext = createContext();

export const useDonation = () => {
  return useContext(DonationContext);
};

export const DonationProvider = ({ children }) => {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totals, setTotals] = useState({
    userDonations: {},
    charityDonations: {},
    monthlyDonations: {},
    grandTotal: 0,
  });


  // get the donations
  const fetchDonation = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://127.0.0.1:5001/donations", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (!response.ok) throw new Error("Failed to fetch donations");

      const data = await response.json();

      setDonations(data.user_donations || []);
      setTotals({
        userDonations: data.user_donations,
        charityDonations: data.charity_donations,
        grandTotal: data.grand_total_donations,
        monthlyDonations: data.monthly_donations,
      });
      
    } catch (error) {
      console.error("Error fetching the donations", error.message);
    } finally {
      setLoading(false);
    }
  };


  //Create a donation and start PayPal transaction
  const handlePayPalPayment = async (charityId, amount, email) => {
    try {
      setLoading(true);
      const response = await fetch("http://127.0.0.1:5001/create-donation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          charity_id: charityId,
          amount,
          email
        }),
      });

      if (!response.ok) throw new Error("Failed to create PayPal order");

      const data = await response.json();
      const paypalOrder = data.order;

      // Redirect user to PayPal approval URL
      const approvalUrl = paypalOrder.links.find(link => link.rel === "approve")?.href;
      if (approvalUrl) {
        window.location.href = approvalUrl; 
      } else {
        throw new Error("PayPal approval URL not found");
      }

    } catch (error) {
      console.error("Error processing PayPal payment:", error.message);
    } finally {
      setLoading(false);
    }
  };


  // Capture payment after user approves
  const capturePayPalPayment = async (orderId) => {
    try {
      setLoading(true);
      const response = await fetch(`http://127.0.0.1:5001/capture-payment/${orderId}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      if (response.ok) {
        alert("Payment successfully captured!");
        fetchDonation(); // Refresh the donations list
      } else {
        alert("Payment capture failed: " + data.error);
      }
    } catch (error) {
      console.error("Error capturing PayPal payment:", error.message);
    } finally {
      setLoading(false);
    }
  };

   // Auto-fetch donations on component mount
   useEffect(() => {
    fetchDonation();
  }, []);

  return (
    <DonationContext.Provider
      value={{
        donations,
        totals,
        loading,
        fetchDonation,
        handlePayPalPayment,
        capturePayPalPayment, // Add this function to the context
      }}
    >
      {children}
    </DonationContext.Provider>
  );
};





  
