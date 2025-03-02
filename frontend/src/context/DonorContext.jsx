import { createContext, useContext, useState, useEffect } from "react";


const DonationContext = createContext();

export const useDonations = () => {
  return useContext(DonationContext);
};

export const DonationProvider = ({ children }) => {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchDonations = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/donations", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (!response.ok) throw new Error("Failed to fetch donations");
      const data = await response.json();
      setDonations(data);
    } catch (error) {
      console.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const createDonation = async (charityId, amount) => {
    try {
      const response = await fetch("/api/donations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ charity_id: charityId, amount }),
      });
      if (!response.ok) throw new Error("Failed to create donation");
      const newDonation = await response.json();
      setDonations((prev) => [...prev, newDonation]);
    } catch (error) {
      console.error(error.message);
    }
  };

  const updateDonation = async (donationId, updatedData) => {
    try {
      const response = await fetch(`/api/donations/${donationId}`, {
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
      const response = await fetch(`/api/donations/${donationId}`, {
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

  useEffect(() => {
    fetchDonations();
  }, []);

  return (
    <DonationContext.Provider
      value={{ donations, loading, fetchDonations, createDonation, updateDonation, deleteDonation }}
    >
      {children}
    </DonationContext.Provider>
  );
};
