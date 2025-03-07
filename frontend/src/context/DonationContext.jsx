import { createContext, useContext, useState ,useEffect,} from "react";
import PropTypes from "prop-types";
import {useUser} from "../context/UserContext"; 

const DonationContext = createContext();

export const DonationProvider = ({ children }) => {
  const [donations, setDonations] = useState([]);
  const [error, setError] = useState(null);
  const {user,setUser}=useState();

  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({ totalDonated: 0, charitiesSupported: 0, monthlyDonations: {} });


  // Create a donation
  const createDonation = async (charityId, amount, isAnonymous) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("https://donex-uq5f.onrender.com/create-donation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          charity_id: charityId,
          amount: parseFloat(amount),
          is_anonymous: isAnonymous,


        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to create donation: ${response.statusText}`);
      }

      const data = await response.json();

      // Ensure the PayPal link is present in the response
      if (!data.paypalLink) {
        throw new Error("No PayPal link found in the response");
      }

      // Update local state if needed (optional)
      setDonations((prev) =>
        Array.isArray(prev) ? [...prev, data.order] : [data.order]
      );

      // Return the PayPal link and order data
      return { paypalLink: data.paypalLink, order: data.order };
    } catch (error) {
      console.error("Error creating donation:", error.message);
      setError(error.message);
      throw error; // Re-throw the error to handle it in the component
    } finally {
      setLoading(false);
    }
  };

  // Fetch donor data from the backend
  const fetchDonations = async () => {
    try {
      const token = localStorage.getItem('token');

      // Fetch current user data
      const userResponse = await fetch('https://donex-uq5f.onrender.com/current_user', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!userResponse.ok) {
        throw new Error('Failed to fetch user data');
      }

      const userData = await userResponse.json();

      // Update user state with fetched data
      setUser({
        fullname: userData.full_name || 'User',
        profilePicture: userData.profilePicture || '/profile-placeholder.png',
      });

      // Fetch donations data
      const donationsResponse = await fetch('https://donex-uq5f.onrender.com/donations', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!donationsResponse.ok) {
        throw new Error('Failed to fetch donor data');
      }

      const donationsData = await donationsResponse.json();

      // Update state with fetched donations data
      setDonations(donationsData.user_donations);
      setStats({
        totalDonated: donationsData.grand_total_donations,
        charitiesSupported: Object.keys(donationsData.charity_donations).length,
        monthlyDonations: donationsData.monthly_donations,
      });
    } catch (error) {
      console.error('Error fetching donor data:', error);
    }
  };


    // Fetch data on component mount
    useEffect(() => {
      fetchDonations();
      createDonation();
    }, []);
  
    // Polling: Fetch data every 2 minutes
    useEffect(() => {
      const interval = setInterval(() => {
        fetchDonations();
      }, 120000); // Fetch data every 2 mins
  
      return () => clearInterval(interval); // Cleanup on unmount
    }, []);


  return (
    <DonationContext.Provider
      value={{
        donations,
        createDonation,
        fetchDonations,
        error,
        loading,
      }}
    >
      {children}
    </DonationContext.Provider>
  );
};
DonationProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useDonation = () => useContext(DonationContext);

