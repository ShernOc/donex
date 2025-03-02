import React, { useEffect, useState } from "react";
import { DollarSign, Users, TrendingUp, BarChart } from "lucide-react";

const CharityDashboard = () => {
  const [donations, setDonations] = useState([]);
  const [storyTitle, setStoryTitle] = useState("");
  const [storyContent, setStoryContent] = useState("");
  const [dashboardStats, setDashboardStats] = useState({
    totalDonations: 0,
    totalDonors: 0,
    monthlyGrowth: "0%",
    successRate: "0%",
  });

  // Fetch donations and dashboard stats
  useEffect(() => {
    const token = localStorage.getItem("token");

    const fetchDashboardData = async () => {
      try {
        const [donationsRes, statsRes] = await Promise.all([
          fetch("http://127.0.0.1:5000/donations", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch("http://127.0.0.1:5000/dashboard-stats", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        if (donationsRes.ok) {
          const donationsData = await donationsRes.json();
          setDonations(Array.isArray(donationsData) ? donationsData : []);
        }

        if (statsRes.ok) {
          const statsData = await statsRes.json();
          setDashboardStats(statsData);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchDashboardData();
  }, []);

  // Handle impact story submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const storyData = { title: storyTitle, content: storyContent };

    try {
      const response = await fetch("http://127.0.0.1:5000/stories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(storyData),
      });

      if (response.ok) {
        alert("Impact story submitted successfully!");
        setStoryTitle("");
        setStoryContent("");
      } else {
        alert("Failed to submit story.");
      }
    } catch (error) {
      console.error("Error submitting story:", error);
    }
  };

  return (
    <div className="flex-1 bg-gray-50 font-[Inter]">
      <div className="max-w-7xl mx-auto px-6 py-10">
        <h1 className="text-4xl font-extrabold text-gray-900">Charity Dashboard</h1>
        <p className="text-gray-600 mt-2 text-lg">Monitor your donations and impact</p>

        {/* Dashboard Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[
            {
              title: "Total Donations",
              value: `$${dashboardStats.totalDonations}`,
              Icon: DollarSign,
            },
            { title: "Total Donors", value: dashboardStats.totalDonors, Icon: Users },
            { title: "Monthly Growth", value: dashboardStats.monthlyGrowth, Icon: TrendingUp },
            { title: "Success Rate", value: dashboardStats.successRate, Icon: BarChart },
          ].map(({ title, value, Icon }) => (
            <div
              key={title}
              className="bg-white p-6 rounded-xl shadow-md flex items-center justify-between"
            >
              <div>
                <p className="text-sm text-gray-600">{title}</p>
                <p className="text-2xl font-bold text-gray-900">{value}</p>
              </div>
              <Icon className="h-10 w-10 text-rose-500" />
            </div>
          ))}
        </div>

        {/* Recent Donations Table */}
        <div className="bg-white rounded-xl shadow-md mb-8">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Recent Donations</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-50 text-gray-600 text-sm">
                <tr>
                  <th className="px-6 py-3">Donor</th>
                  <th className="px-6 py-3">Amount</th>
                  <th className="px-6 py-3">Date</th>
                  <th className="px-6 py-3">Type</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200 text-gray-900">
                {donations.length > 0 ? (
                  donations.map((donation) => (
                    <tr key={donation.id} className="hover:bg-gray-100">
                      <td className="px-6 py-4">{donation.donor}</td>
                      <td className="px-6 py-4">${donation.amount}</td>
                      <td className="px-6 py-4 text-gray-500">{donation.date}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 text-xs font-medium rounded-full ${
                            donation.type === "Recurring"
                              ? "bg-green-100 text-green-800"
                              : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {donation.type}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="px-6 py-4 text-center text-gray-500">
                      No donations available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Impact Stories Form */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Share an Impact Story</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              name="storyTitle"
              value={storyTitle}
              onChange={(e) => setStoryTitle(e.target.value)}
              placeholder="Title"
              className="border p-3 rounded-md shadow-sm w-full"
              required
            />
            <textarea
              name="storyContent"
              value={storyContent}
              onChange={(e) => setStoryContent(e.target.value)}
              placeholder="Write your impact story..."
              className="border p-3 rounded-md shadow-sm w-full h-32"
              required
            />
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold p-4 rounded-md shadow-md w-full transition"
            >
              Submit Story
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CharityDashboard;
