import React, { useState } from 'react';
import { CreditCard, Calendar, Heart } from 'lucide-react';

const DonationPage = () => {
  const [charityId, setCharityId] = useState('');
  const [amount, setAmount] = useState('');
  const [donationType, setDonationType] = useState('one-time');
  const [frequency, setFrequency] = useState('monthly');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');

  const predefinedAmounts = [10, 25, 50, 100];

  const charities = [
    { id: '1', name: 'Save the Children' },
    { id: '2', name: 'Red Cross' },
    { id: '3', name: 'WWF' },
    { id: '4', name: 'UNICEF' },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({
      charityId,
      amount,
      donationType,
      frequency,
      cardNumber,
      expiry,
      cvc,
    });
  };

  return (
    <div className="flex-1 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6 bg-rose-500 text-white">
            <h1 className="text-3xl font-bold">Make a Donation</h1>
            <p className="mt-2">Your generosity makes a difference</p>
          </div>

          <div className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Charity Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-4">
                  Select Charity
                </label>
                <select
                  value={charityId}
                  onChange={(e) => setCharityId(e.target.value)}
                  className="w-full p-2 border rounded-md text-gray-900 bg-white focus:border-rose-500 focus:ring-rose-500"
                >
                  <option value="" disabled>Select a charity</option>
                  {charities.map((charity) => (
                    <option key={charity.id} value={charity.id}>
                      {charity.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Donation Amount */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-4">
                  Select Amount
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  {predefinedAmounts.map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      className={`py-3 px-4 border rounded-md text-center ${
                        amount === preset.toString()
                          ? 'border-rose-500 bg-rose-50 text-rose-700'
                          : 'border-gray-300 bg-black text-white hover:border-rose-500'
                      }`}
                      onClick={() => setAmount(preset.toString())}
                    >
                      ${preset}
                    </button>
                  ))}
                </div>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Enter custom amount"
                  className="w-full p-2 border rounded-md text-gray-900 bg-white focus:border-rose-500 focus:ring-rose-500"
                />
              </div>

              {/* Donation Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-4">
                  Donation Type
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    className={`py-3 px-4 border rounded-md text-center ${
                      donationType === 'one-time'
                        ? 'border-rose-500 bg-rose-50 text-rose-700'
                        : 'border-gray-300 bg-white text-gray-900 hover:border-rose-500'
                    }`}
                    onClick={() => setDonationType('one-time')}
                  >
                    <CreditCard className="h-5 w-5 mr-2" />
                    One-time
                  </button>
                  <button
                    type="button"
                    className={`py-3 px-4 border rounded-md text-center ${
                      donationType === 'recurring'
                        ? 'border-rose-500 bg-rose-50 text-rose-700'
                        : 'border-gray-300 bg-white text-gray-900 hover:border-rose-500'
                    }`}
                    onClick={() => setDonationType('recurring')}
                  >
                    <Calendar className="h-5 w-5 mr-2" />
                    Recurring
                  </button>
                </div>
              </div>

              {/* Frequency Selection */}
              {donationType === 'recurring' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-4">
                    Frequency
                  </label>
                  <select
                    value={frequency}
                    onChange={(e) => setFrequency(e.target.value)}
                    className="w-full p-2 border rounded-md text-gray-900 bg-white focus:border-rose-500 focus:ring-rose-500"
                  >
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="quarterly">Quarterly</option>
                    <option value="annually">Annually</option>
                  </select>
                </div>
              )}

              {/* Payment Information */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Payment Information</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Card Number
                    </label>
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      placeholder="1234 5678 9012 3456"
                      className="w-full p-2 border rounded-md text-gray-900 bg-white focus:border-rose-500 focus:ring-rose-500"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Expiry Date
                      </label>
                      <input
                        type="text"
                        value={expiry}
                        onChange={(e) => setExpiry(e.target.value)}
                        placeholder="MM/YY"
                        className="w-full p-2 border rounded-md text-gray-900 bg-white focus:border-rose-500 focus:ring-rose-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        CVC
                      </label>
                      <input
                        type="text"
                        value={cvc}
                        onChange={(e) => setCvc(e.target.value)}
                        placeholder="123"
                        className="w-full p-2 border rounded-md text-gray-900 bg-white focus:border-rose-500 focus:ring-rose-500"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-6">
                <button
                  type="submit"
                  className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-rose-600 hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500"
                >
                  <Heart className="h-5 w-5 mr-2" />
                  Complete Donation
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DonationPage;
