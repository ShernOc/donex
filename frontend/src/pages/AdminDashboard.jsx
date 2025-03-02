import React, { useState, useEffect } from "react";
import { Users, Building2, AlertCircle, CheckCircle } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";

const AdminDashboard = () => {
  const [users, setUsers] = useState(0);
  const [charityApplications, setCharityApplications] = useState([]);
  const [activeCharities, setActiveCharities] = useState([]);
  const [donationData, setDonationData] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token'); // Get the authorization token

    fetch("http://127.0.0.1:5000/users")
      .then((res) => res.json())
      .then((data) => setUsers(Array.isArray(data) ? data.length : 0))
      .catch((err) => console.error("Error fetching users:", err));

    fetch("http://127.0.0.1:5000/charities", {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        const charities = Array.isArray(data) ? data : data.charities || [];
        setCharityApplications(charities);
        setActiveCharities(charities.filter((charity) => charity.status === "Approved"));
      })
      .catch((err) => console.error("Error fetching charities:", err));

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
      })
      .catch((err) => console.error("Error fetching donations:", err));
  }, []);

  const handleApprove = (id) => {
    const token = localStorage.getItem('token');
    fetch(`http://127.0.0.1:5000/charities/update/${id}`, {
      method: "PATCH",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status: "Approved" }),
    })
      .then((res) => res.json())
      .then(() => {
        setCharityApplications((prev) =>
          prev.map((app) => (app.id === id ? { ...app, status: "Approved" } : app))
        );
        setActiveCharities((prev) =>
          [...prev, charityApplications.find((app) => app.id === id)]
        );
      })
      .catch((err) => console.error("Error approving charity:", err));
  };

  const handleReject = (id) => {
    const token = localStorage.getItem('token');
    fetch(`http://127.0.0.1:5000/charities/delete/${id}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then(() => {
        setCharityApplications((prev) => prev.filter((app) => app.id !== id));
      })
      .catch((err) => console.error("Error rejecting charity:", err));
  };

  const handleDeleteCharity = (id) => {
    const token = localStorage.getItem('token');
    fetch(`http://127.0.0.1:5000/charities/delete/${id}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then(() => {
        setActiveCharities((prev) => prev.filter((charity) => charity.id !== id));
      })
      .catch((err) => console.error("Error deleting charity:", err));
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
            { label: "Active Charities", value: activeCharities.length, icon: <Building2 className="h-8 w-8 text-rose-500" /> },
            { label: "Pending Reviews", value: charityApplications.filter(app => app.status === "Pending").length, icon: <AlertCircle className="h-8 w-8 text-rose-500" /> },
            { label: "Approved Charities", value: activeCharities.length, icon: <CheckCircle className="h-8 w-8 text-rose-500" /> },
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
    </div>
  );
};

export default AdminDashboard;
