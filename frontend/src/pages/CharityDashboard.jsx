import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { DollarSign, Users, TrendingUp, BarChart } from "lucide-react";
import { useCharity } from "../context/CharityContext";



const CharityDashboard = () => {
  const [donations, setDonations] = useState([]);
  const [charity,setCharity]=useState(null)
  const [isApproved, setIsApproved] = useState(false);
  const{fetchCurrentCharities}=useCharity();

  console.log(fetchCurrentCharities);


  const navigate = useNavigate();

  const [stats, setStats] = useState({
    totalDonations: 0,
    totalDonors: 0,
    monthlyDonations:0,
    monthlyGrowth: "0%",
    successRate: "0%",
  });

  // fetch the current charity
  useEffect(() => {
    const getCharity = async () => {
      try {
        const data = await fetchCurrentCharities(); // Assuming this returns the current charity
        if (data) {
          setCharity(data);
        }
      } catch (error) {
        console.error("Error fetching charity:", error);
      }
    };

    getCharity();
  }, [fetchCurrentCharities]);



  useEffect(() => {
    const token = localStorage.getItem("token");

    const fetchDashboardData = async () => {
      try {
        const [donationsRes, statsRes, approvalRes] = await Promise.all([
          fetch("https://donex-uq5f.onrender.com/donations", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          
          fetch("https://donex-uq5f.onrender.com/dashboard-stats", {
            headers: { Authorization: `Bearer ${token}` },
          }),

          fetch("https://donex-uq5f.onrender.com/charity-status", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        if (donationsRes.ok) {
          const donationsData = await donationsRes.json();
          setDonations(Array.isArray(donationsData) ? donationsData : []);
        }

        if (statsRes.ok) {
          const statsData = await statsRes.json();
          setStats(statsData);
        }

        if (approvalRes.ok) {
          const { isApproved } = await approvalRes.json();
          setIsApproved(isApproved);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchDashboardData();
  }, [navigate]);


  return (
    <div className="flex-1 bg-gray-50 font-[Inter]">
      <div className="max-w-7xl mx-auto px-6 py-10">
        
        <h1 className="text-4xl font-extrabold text-gray-900">Charity:{charity?.charity_name || "Loading"} Dashboard </h1>

        <p className="text-gray-600 mt-2 text-lg">Monitor your donations and impact</p>

        {!isApproved && (
          <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 my-6 rounded-md">
            <p className="font-bold">Account Verification Required</p>
            <p>
              To fully activate your account, please complete the verification process.
              <Link
                to="/charity/verification"
                className="text-blue-600 hover:underline ml-2"
              >
                Go to Charity Verification
              </Link>
            </p>
          </div>
        )}
      

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[
            { title: "Total Donations", value: `$${stats.totalDonations}`, Icon: DollarSign },
            { title: "Total Donors", value: stats.totalDonors, Icon: Users },
            { title: "Monthly Growth", value: stats.monthlyGrowth, Icon: TrendingUp },
            { title: "Success Rate", value: stats.successRate, Icon: BarChart },
          ].map(({ title, value, Icon }) => (
            <div key={title} className="bg-white p-6 rounded-xl shadow-md flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{title}</p>
                <p className="text-2xl font-bold text-gray-900">{value}</p>
              </div>
              <Icon className="h-10 w-10 text-rose-500" />
            </div>
          ))}
        </div>

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
                      <td className="px-6 py-4">{donation.user_id}</td>
                      <td className="px-6 py-4">${donation.amount}</td>
                      <td className="px-6 py-4 text-gray-500">{donation.donation_date}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 text-xs font-medium rounded-full ${
                            donation.donation_type === "Recurring"
                              ? "bg-green-100 text-green-800"
                              : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {donation.donations_type}
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
      </div>
    </div>
  );
};

export default CharityDashboard;
