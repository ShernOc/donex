import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Clock, History, Settings } from 'lucide-react';

const DonorDashboard = () => {
  const donations = [
    { id: 1, charity: 'Save the Children', amount: 50, date: '2024-03-15', status: 'Completed' },
    { id: 2, charity: 'Red Cross', amount: 100, date: '2024-03-10', status: 'Completed' },
    { id: 3, charity: 'UNICEF', amount: 75, date: '2024-03-05', status: 'Processing' },
  ];

  const recurringDonations = [
    { id: 1, charity: 'Doctors Without Borders', amount: 25, frequency: 'Monthly', nextDate: '2024-04-01' },
    { id: 2, charity: 'WWF', amount: 50, frequency: 'Monthly', nextDate: '2024-04-05' },
  ];

  return (
    <div className="flex-1 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Donor Dashboard</h1>
          <p className="text-gray-600 mt-2">Welcome back! Manage your donations and impact.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Donated</p>
                <p className="text-2xl font-bold text-gray-900">$225.00</p>
              </div>
              <Heart className="h-8 w-8 text-rose-500" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Monthly</p>
                <p className="text-2xl font-bold text-gray-900">$75.00</p>
              </div>
              <Clock className="h-8 w-8 text-rose-500" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Charities Supported</p>
                <p className="text-2xl font-bold text-gray-900">5</p>
              </div>
              <Heart className="h-8 w-8 text-rose-500" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Impact Score</p>
                <p className="text-2xl font-bold text-gray-900">85</p>
              </div>
              <Settings className="h-8 w-8 text-rose-500" />
            </div>
          </div>
        </div>

        {/* Recent Donations */}
        <div className="bg-white rounded-lg shadow-sm mb-8">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Recent Donations</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Charity</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {donations.map((donation) => (
                  <tr key={donation.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{donation.charity}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${donation.amount}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{donation.date}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        donation.status === 'Completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {donation.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recurring Donations */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Recurring Donations</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Charity</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Frequency</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Next Payment</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recurringDonations.map((donation) => (
                  <tr key={donation.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{donation.charity}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${donation.amount}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{donation.frequency}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{donation.nextDate}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <button className="text-rose-600 hover:text-rose-900">Manage</button>
                    </td>
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