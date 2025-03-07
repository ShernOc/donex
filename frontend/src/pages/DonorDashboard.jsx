import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Clock, Settings } from 'lucide-react';

const DonorDashboard = () => {
  const [donations, setDonations] = useState([]);
  const [user, setUser] = useState({ fullname: 'User', profilePicture: '/profile-placeholder.png' });
  const [stats, setStats] = useState({ totalDonated: 0, charitiesSupported: 0, monthlyDonations: {} });


  // Fetch donor data from the backend
  const fetchDonorData = async () => {
    try {
      const token = localStorage.getItem('token');

      // Fetch current user data
      const userResponse = await fetch('http://127.0.0.1:5000/current_user', {
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
      const donationsResponse = await fetch('http://127.0.0.1:5000/donations', {
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
    fetchDonorData();
  }, []);

  // Polling: Fetch data every 2 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      fetchDonorData();
    }, 120000); // Fetch data every 2 mins

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);


  
  return (
    <div className="flex-1 bg-pink-200">
      <div className="max-w-7xl mx-auto px-4 py-8">

        {/* Welcome Section */}
        <div className="mb-8 flex items-center justify-between bg-pink-50 p-6 rounded-lg shadow-sm">
          <div className="flex items-center space-x-4">
            <img 
              src={user.profilePicture} 
              alt="Profile" 
              className="h-16 w-16 rounded-full border border-gray-300"
            />
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Welcome back, {user.fullname}!</h2>
              <p className="text-gray-600">Manage your donations and impact.</p>
            </div>
          </div>
          <Link 
            to="/profile" 
            className="bg-rose-400 !text-white px-4 py-2 rounded-lg shadow-sm hover:bg-rose-500 transition"
          >
            Edit Profile
          </Link>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-pink-50 p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Donated</p>
                <p className="text-2xl font-bold text-gray-900">${stats.totalDonated.toFixed(2)}</p>
              </div>
              <Heart className="h-8 w-8 text-rose-500" />
            </div>
          </div>
          <div className="bg-pink-50 p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Charities Supported</p>
                <p className="text-2xl font-bold text-gray-900">{stats.charitiesSupported}</p>
              </div>
              <Clock className="h-8 w-8 text-rose-500" />
            </div>
          </div>
          <div className="bg-pink-50 p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Monthly Donations</p>
                <p className="text-2xl font-bold text-gray-900">{Object.keys(stats.monthlyDonations).length}</p>
              </div>
              <Settings className="h-8 w-8 text-rose-500" />
            </div>
          </div>
        </div>

        {/* Recent Donations Section */}
        <div className="bg-pink-50 rounded-lg shadow-sm mb-8">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Recent Donations</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {Object.entries(donations).map(([user, amount]) => (
                  <tr key={user}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DonorDashboard;