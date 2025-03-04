import React, { useState, useEffect } from "react";
import { Users, Building2, AlertCircle, CheckCircle, DollarSign, XCircle, Check } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";

const AdminDashboard = () => {
  const [users, setUsers] = useState(0);
  const [charityApplications, setCharityApplications] = useState([]);
  const [activeCharities, setActiveCharities] = useState([]); 
  const [donationData, setDonationData] = useState([]);
  const [totalDonations, setTotalDonations] = useState(0);
  const [selectedCharity, setSelectedCharity] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');

    // Fetch users
    fetch("http://127.0.0.1:5000/users")
      .then((res) => res.json())
      .then((data) => setUsers(Array.isArray(data) ? data.length : 0))
      .catch((err) => console.error("Error fetching users:", err));

    // Fetch all charities
    fetch("http://127.0.0.1:5000/charities", {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Fetched Charities:", data);
        const charities = Array.isArray(data.charities) ? data.charities : [];
        setCharityApplications(charities);
      })
      .catch((err) => console.error("Error fetching charities:", err));

    // Fetch approved charities
    fetch("http://127.0.0.1:5000/charities?status=approved", {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Fetched Approved Charities:", data);
        const approvedCharities = Array.isArray(data.charities) ? data.charities : [];
        setActiveCharities(approvedCharities);
      })
      .catch((err) => console.error("Error fetching approved charities:", err));

    // Fetch donations
    fetch("http://127.0.0.1:5000/donations", {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        const donations = Array.isArray(data) ? data : data.donations || [];
        const formattedData = donations.map((donation) => ({
          month: donation.month,
          donations: donation.amount,
        }));
        setDonationData(formattedData);
        const total = donations.reduce((acc, donation) => acc + donation.amount, 0);
        setTotalDonations(total);
      })
      .catch((err) => console.error("Error fetching donations:", err));
  }, []);

  const handleDecision = (id, decision) => {
    const token = localStorage.getItem('token');
    fetch(`http://127.0.0.1:5000/admin/charities/${id}`, {
      method: "PATCH",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ approved: decision === "Approved" }), 
    })
      .then((res) => res.json())
      .then((data) => {
        // Update the charity's approved status in the charityApplications state
        setCharityApplications((prev) =>
          prev.map((charity) =>
            charity.id === id ? { ...charity, approved: decision === "Approved" } : charity
          )
        );

        // If approved, add the charity to the activeCharities list
        if (decision === "Approved") {
          setActiveCharities((prev) => [...prev, data]);
        }
      })
      .catch((err) => console.error("Error updating charity status:", err));
  };

  const handleReview = (charity) => {
    const token = localStorage.getItem('token');
    fetch(`http://127.0.0.1:5000/charities/${charity.id}`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Fetched Charity Details:", data); 
        setSelectedCharity(data);
        setIsModalOpen(true); 
      })
      .catch((err) => console.error("Error fetching charity details:", err));
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedCharity(null);
  };

  return (
    <div className="flex-1 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Your Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">Platform Overview and Management</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[
            { label: "Total Users", value: users, icon: <Users className="h-8 w-8 text-rose-500" /> },
            { label: "Pending Reviews", value: charityApplications.filter(app => app.approved === 'pending').length, icon: <AlertCircle className="h-8 w-8 text-rose-500" /> },
            { label: "Approved Charities", value: activeCharities.length, icon: <CheckCircle className="h-8 w-8 text-rose-500" /> },
            { label: "Total Donations", value: `ksh ${totalDonations.toLocaleString()}`, icon: <DollarSign className="h-8 w-8 text-rose-500" /> },
          ].map((stat, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-sm flex justify-between">
              <div>
                <p className="text-sm text-gray-600">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
              {stat.icon}
            </div>
          ))}
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Pending Charity Requests</h2>
          <ul>
            {charityApplications
              .filter((app) => app.approved === 'pending') 
              .map((charity) => (
                <li key={charity.id} className="p-4 bg-gray-100 mb-2 flex justify-between items-center">
                  <span>{charity.charity_name}</span>
                  <div>
                    <button
                      className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
                      onClick={() => handleReview(charity)}
                    >
                      Review
                    </button>
                    <button
                      className="bg-green-500 text-white px-4 py-2 rounded mr-2"
                      onClick={() => handleDecision(charity.id, "Approved")}
                    >
                      Approve <Check className="inline" />
                    </button>
                    <button
                      className="bg-red-500 text-white px-4 py-2 rounded"
                      onClick={() => handleDecision(charity.id, "Rejected")}
                    >
                      Reject <XCircle className="inline" />
                    </button>
                  </div>
                </li>
              ))}
          </ul>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Approved Charities</h2>
          <ul>
            {activeCharities.map((charity) => (
              <li key={charity.id} className="p-4 bg-gray-100 mb-2 flex justify-between items-center">
                <span>{charity.charity_name}</span>
                <span className="text-green-500">Approved</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Monthly Donations</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={donationData}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="donations" fill="#E53E3E" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {isModalOpen && selectedCharity && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-md max-w-md">
              <h2 className="text-2xl font-bold mb-4">Review {selectedCharity.charity_name}</h2>
              <p><strong>Email:</strong> {selectedCharity.email || 'N/A'}</p>
              <p><strong>Description:</strong> {selectedCharity.description || 'N/A'}</p>
              <p><strong>Phone Number:</strong> {selectedCharity.phone_number || 'N/A'}</p>
              <p><strong>Bank Name:</strong> {selectedCharity.bank_name || 'N/A'}</p>
              <p><strong>Account Holder:</strong> {selectedCharity.account_holder || 'N/A'}</p>
              <p><strong>Targeted Amount:</strong> KSh {selectedCharity.targeted_amount || 'N/A'}</p>
              <button onClick={closeModal} className="mt-4 bg-red-500 text-white px-4 py-2 rounded">
                Close
              </button>
            </div>
          </div>
      )}
    </div>
  );
};

export default AdminDashboard;