import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Clock, Settings } from 'lucide-react';

const DonorDashboard = () => {
  const [donations, setDonations] = useState([]);
  const [user, setUser] = useState({ name: 'User', profilePicture: '/profile-placeholder.png' });
  const [stats, setStats] = useState({ totalDonated: 0, charitiesSupported: 0, monthlyDonations: {} });

  useEffect(() => {
    const fetchDonorData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:5000/donations', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch donations');
        }
        
        const data = await response.json();
        setDonations(data.user_donations);
        setUser({
          name: data.user_name,
          profilePicture: data.profile_picture || '/profile-placeholder.png',
        });
        setStats({
          totalDonated: data.grand_total_donations,
          charitiesSupported: Object.keys(data.charity_donations).length,
          monthlyDonations: data.monthly_donations,
        });
      } catch (error) {
        console.error('Error fetching donor data:', error);
      }
    };

    fetchDonorData();
  }, []);

  return (
    <div className="flex-1 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">

        <div className="mb-8 flex items-center justify-between bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center space-x-4">
            <img 
              src={user.profilePicture} 
              alt="Profile" 
              className="h-16 w-16 rounded-full border border-gray-300"
            />
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Welcome back, {JSON.parse(sessionStorage.getItem('user'))['full_name']}!</h2>
              <p className="text-gray-600">Manage your donations and impact.</p>
            </div>
          </div>
          <Link 
            to="/profile" 
            className="bg-rose-500 text-white px-4 py-2 rounded-lg shadow-sm hover:bg-rose-600 transition"
          >
            Edit Profile
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Donated</p>
                <p className="text-2xl font-bold text-gray-900">${stats.totalDonated.toFixed(2)}</p>
              </div>
              <Heart className="h-8 w-8 text-rose-500" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Charities Supported</p>
                <p className="text-2xl font-bold text-gray-900">{stats.charitiesSupported}</p>
              </div>
              <Clock className="h-8 w-8 text-rose-500" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Monthly Donations</p>
                <p className="text-2xl font-bold text-gray-900">{Object.keys(stats.monthlyDonations).length}</p>
              </div>
              <Settings className="h-8 w-8 text-rose-500" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm mb-8">
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
