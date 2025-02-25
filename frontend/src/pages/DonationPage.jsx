
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { CreditCard, Calendar, Heart } from 'lucide-react';

const DonationPage = () => {
  const { charityId } = useParams();
  const [amount, setAmount] = useState('');
  const [donationType, setDonationType] = useState('one-time');
  const [frequency, setFrequency] = useState('monthly');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');

  const predefinedAmounts = [10, 25, 50, 100];

  const handleAmountChange = (e) => {
    setAmount(e.target.value);
  };

  const handleDonationTypeChange = (type) => {
    setDonationType(type);
  };

  const handleFrequencyChange = (e) => {
    setFrequency(e.target.value);
  };

  const handleCardNumberChange = (e) => {
    setCardNumber(e.target.value);
  };

  const handleExpiryChange = (e) => {
    setExpiry(e.target.value);
  };

  const handleCvcChange = (e) => {
    setCvc(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add your submission logic here
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
                <div className="mt-2">
                  <input
                    type="number"
                    value={amount}
                    onChange={handleAmountChange}
                    placeholder="Enter custom amount"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-white text-black placeholder-white focus:border-rose-500 focus:ring-rose-500 px-3 py-2"
                  />
                </div>
              </div>

              {/* Donation Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-4">
                  Donation Type
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    className={`py-3 px-4 border rounded-md text-center flex items-center justify-center ${
                      donationType === 'one-time'
                        ? 'border-rose-500 bg-white text-white'
                        : 'border-gray-300 bg-white text-white hover:border-rose-500'
                    }`}
                    onClick={() => handleDonationTypeChange('one-time')}
                  >
                    <CreditCard className="h-5 w-5 mr-2" />
                    One-time
                  </button>
                  <button
                    type="button"
                    className={`py-3 px-4 border rounded-md text-center flex items-center justify-center ${
                      donationType === 'recurring'
                        ? 'border-rose-500 bg-rose-50 text-rose-700'
                        : 'border-gray-300 bg-white text-white hover:border-rose-500'
                    }`}
                    onClick={() => handleDonationTypeChange('recurring')}
                  >
                    <Calendar className="h-5 w-5 mr-2" />
                    Recurring
                  </button>
                </div>
              </div>

              {/* Frequency Selection (only shown for recurring donations) */}
              {donationType === 'recurring' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-4">
                    Frequency
                  </label>
                  <select
                    value={frequency}
                    onChange={handleFrequencyChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-white text-gray-900 placeholder-white focus:border-rose-500 focus:ring-rose-500 px-3 py-2"
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
                    <label htmlFor="card-number" className="block text-sm font-medium text-gray-700">
                      Card Number
                    </label>
                    <input
                      type="text"
                      id="card-number"
                      value={cardNumber}
                      onChange={handleCardNumberChange}
                      placeholder="1234 5678 9012 3456"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-white text-gray-900 placeholder-white focus:border-rose-500 focus:ring-rose-500 px-3 py-2"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="expiry" className="block text-sm font-medium text-gray-700">
                        Expiry Date
                      </label>
                      <input
                        type="text"
                        id="expiry"
                        value={expiry}
                        onChange={handleExpiryChange}
                        placeholder="MM/YY"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-white text-gray-900 placeholder-white focus:border-rose-500 focus:ring-rose-500 px-3 py-2"
                      />
                    </div>
                    <div>
                      <label htmlFor="cvc" className="block text-sm font-medium text-gray-700">
                        CVC
                      </label>
                      <input
                        type="text"
                        id="cvc"
                        value={cvc}
                        onChange={handleCvcChange}
                        placeholder="123"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-white text-gray-900 placeholder-white focus:border-rose-500 focus:ring-rose-500 px-3 py-2"
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
