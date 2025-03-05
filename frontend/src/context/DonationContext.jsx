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


  // post a donation 
  const createDonation = async (charityId, amount, is_anonymous) => {
    try {
      const response = await fetch("http://127.0.0.1:5001/donations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },

        body: JSON.stringify({ charity_id: charityId, amount, is_anonymous }),
      });

      if (!response.ok) throw new Error("Failed to create donation");
      const newDonation = await response.json();
      setDonations((prev) => [...prev, newDonation]);
      return newDonation;

    }
      catch (error) {
      console.error( "Error creating donation", error.message);
      return null; 
    }
  };

  // update donation
  const updateDonation = async (donationId, updatedData) => {
    try {
      const response = await fetch(`http://127.0.0.1:5001/donations/${donationId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(updatedData),
      });

      if (!response.ok) throw new Error("Failed to update donation");
      setDonations((prev) =>
        prev.map((donation) =>
          donation.id === donationId ? { ...donation, ...updatedData } : donation
        )
      );
    } catch (error) {
      console.error(error.message);
    }
  };

  const deleteDonation = async (donationId) => {
    try {
      const response = await fetch(`http://127.0.0.1:5001/donations/delete/${donationId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (!response.ok) throw new Error("Failed to delete donation");

      setDonations((prev) => prev.filter((donation) => donation.id !== donationId));
    } catch (error) {
      console.error(error.message);
    }
  };

  // call the function
  useEffect(() => {
    fetchDonation();
  }, []);

  return (
    <DonationContext.Provider
      value={{ donations, totals,loading, fetchDonation, createDonation, updateDonation, deleteDonation}}
    >
      {children}
    </DonationContext.Provider>
  );
};



