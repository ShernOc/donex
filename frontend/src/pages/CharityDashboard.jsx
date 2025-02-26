import { DollarSign, Users, TrendingUp, BarChart } from 'lucide-react';


const CharityDashboard = () => {
  const donations = [
    { id: 1, donor: 'Anonymous', amount: 50, date: '2024-03-15', type: 'One-time' },
    { id: 2, donor: 'John Doe', amount: 100, date: '2024-03-10', type: 'Recurring' },
    { id: 3, donor: 'Jane Smith', amount: 75, date: '2024-03-05', type: 'One-time' },
  ];

  return (
    <div className="flex-1 bg-gray-50 font-[Inter]">
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="mb-8">
          <h1 className="text-4xl font-extrabold text-gray-900">Charity Dashboard</h1>
          <p className="text-gray-600 mt-2 text-lg">Monitor your donations and impact</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[{
            title: "Total Donations", value: "$12,345", Icon: DollarSign
          }, {
            title: "Total Donors", value: "156", Icon: Users
          }, {
            title: "Monthly Growth", value: "+15%", Icon: TrendingUp
          }, {
            title: "Success Rate", value: "92%", Icon: BarChart
          }].map(({ title, value, Icon }) => (
            <div key={title} className="bg-white p-6 rounded-xl shadow-md flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{title}</p>
                <p className="text-2xl font-bold text-gray-900">{value}</p>
              </div>
              <Icon className="h-10 w-10 text-rose-500" />
            </div>
          ))}
        </div>

        {/* Recent Donations */}
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
                {donations.map((donation) => (
                  <tr key={donation.id} className="hover:bg-gray-100">
                    <td className="px-6 py-4">{donation.donor}</td>
                    <td className="px-6 py-4">${donation.amount}</td>
                    <td className="px-6 py-4 text-gray-500">{donation.date}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                        donation.type === 'Recurring' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {donation.type}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Impact Stories Form */}
        <div className="bg-white rounded-xl shadow-md">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Share an Impact Story</h2>
          </div>
          <div className="p-6">
            <form className="space-y-6">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">Story Title</label>
                <input
                  type="text"
                  id="title"
                  placeholder="Enter story title..."
                  className="mt-1 block w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500 text-gray-900"
                />
              </div>
              <div>
                <label htmlFor="content" className="block text-sm font-medium text-gray-700">Story Content</label>
                <textarea
                  id="content"
                  rows={4}
                  placeholder="Write your impact story here..."
                  className="mt-1 block w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500 text-gray-900"
                ></textarea>
              </div>
              <div>
                <button
                  type="submit"
                  className="w-full py-3 px-6 font-semibold rounded-lg text-white bg-rose-600 hover:bg-rose-700 focus:ring-2 focus:ring-offset-2 focus:ring-rose-500 transition-all"
                >
                  Publish Story
                </button>
              </div>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
};

export default CharityDashboard;
