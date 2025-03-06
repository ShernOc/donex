import { createContext, useContext, useState } from "react";
import PropTypes from "prop-types";

const DonationContext = createContext();

export const DonationProvider = ({ children }) => {
  const [donations, setDonations] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Create a donation
  const createDonation = async (charityId, amount, isAnonymous) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("https://donex-66an.onrender.com/create-donation", {
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

  // Fetch all donations (optional)
  const fetchDonations = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("https://donex-66an.onrender.com/donations", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch donations: ${response.statusText}`);
      }

      const data = await response.json();
      setDonations(data);
    } catch (error) {
      console.error("Error fetching donations:", error.message);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

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
