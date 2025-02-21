import React, { useState } from "react";
import { Users, Building2, AlertCircle, CheckCircle } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";

const AdminDashboard = () => {
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [newRegistrations, setNewRegistrations] = useState(true);
  const [charityApplications, setCharityApplications] = useState([
    { id: 1, name: "Hope Foundation", status: "Pending", date: "2024-03-15", type: "Education" },
    { id: 2, name: "Green Earth", status: "Approved", date: "2024-03-10", type: "Environment" },
    { id: 3, name: "Care for All", status: "Under Review", date: "2024-03-05", type: "Healthcare" },
  ]);

  const [activeCharities, setActiveCharities] = useState([
    { id: 1, name: "Helping Hands", type: "Food Aid" },
    { id: 2, name: "Safe Haven", type: "Shelter" },
    { id: 3, name: "Bright Future", type: "Education" },
  ]);

  const handleApprove = (id) => {
    setCharityApplications((prev) =>
      prev.map((app) => (app.id === id ? { ...app, status: "Approved" } : app))
    );
  };

  const handleReject = (id) => {
    setCharityApplications((prev) => prev.filter((app) => app.id !== id));
  };

  const handleDeleteCharity = (id) => {
    setActiveCharities((prev) => prev.filter((charity) => charity.id !== id));
  };

  const donationData = [
    { month: "Jan", donations: 3000 },
    { month: "Feb", donations: 4500 },
    { month: "Mar", donations: 5000 },
    { month: "Apr", donations: 7000 },
    { month: "May", donations: 8000 },
  ];

  const userGrowthData = [
    { month: "Jan", users: 100 },
    { month: "Feb", users: 250 },
    { month: "Mar", users: 400 },
    { month: "Apr", users: 600 },
    { month: "May", users: 850 },
  ];

  return (
    <div className="flex-1 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">Platform Overview and Management</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[
            { label: "Total Users", value: "1,234", icon: <Users className="h-8 w-8 text-rose-500" /> },
            { label: "Active Charities", value: activeCharities.length, icon: <Building2 className="h-8 w-8 text-rose-500" /> },
            { label: "Pending Reviews", value: charityApplications.filter(app => app.status === "Pending").length, icon: <AlertCircle className="h-8 w-8 text-rose-500" /> },
            { label: "Approved Today", value: charityApplications.filter(app => app.status === "Approved").length, icon: <CheckCircle className="h-8 w-8 text-rose-500" /> },
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

        {/* Charts Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
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

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">User Growth</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={userGrowthData}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="users" fill="#3182CE" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Charity Applications */}
        <div className="bg-white rounded-lg shadow-sm mb-8">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Charity Applications</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  {["Charity Name", "Type", "Date", "Status", "Actions"].map((header, index) => (
                    <th key={index} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {charityApplications.map((app) => (
                  <tr key={app.id}>
                    <td className="px-6 py-4 text-sm text-gray-900">{app.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{app.type}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{app.date}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 inline-flex text-xs font-semibold rounded-full ${
                        app.status === "Approved" ? "bg-green-100 text-green-800" :
                        app.status === "Pending" ? "bg-yellow-100 text-yellow-800" :
                        "bg-blue-100 text-blue-800"
                      }`}>
                        {app.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button onClick={() => handleApprove(app.id)} className="text-green-600 hover:text-green-900 mr-4">Review</button>
                      <button onClick={() => handleApprove(app.id)} className="text-green-600 hover:text-green-900 mr-4">Approve</button>
                      <button onClick={() => handleReject(app.id)} className="text-red-600 hover:text-red-900">Reject</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Active Charities */}
        <div className="bg-white rounded-lg shadow-sm mb-8">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Active Charities</h2>
          </div>
          <ul className="p-6">
            {activeCharities.map((charity) => (
              <li key={charity.id} className="flex justify-between p-3 border-b">
                <span className="text-gray-900">{charity.name} ({charity.type})</span>
                <button onClick={() => handleDeleteCharity(charity.id)} className="text-red-600 hover:text-red-900">Delete</button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
