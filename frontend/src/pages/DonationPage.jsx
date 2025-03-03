import { useState } from "react";
import { useCharity } from "../context/CharityContext";
import { useUser } from "../context/UserContext";
import { useDonation } from "../context/DonationContext";
import { Heart } from "lucide-react";

const DonationPage = () => {
  const { charities = [] } = useCharity();
  const { user } = useUser();
  const { createDonation } = useDonation();
  const [charityId, setCharityId] = useState("");
  const [amount, setAmount] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [donationType, setDonationType] = useState("one-time");
  const [frequency, setFrequency] = useState("");

  const predefinedAmounts = [10, 25, 50, 100];

  const handleAmountChange = (e) => {
    setAmount(e.target.value);
  };

  const handleDonationTypeChange = (type) => {
    setDonationType(type);
    if (type === "one-time") {
      setFrequency(""); // Clear frequency for one-time donations
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const donationDetails = {
      charity_id: charityId,
      amount: parseFloat(amount) || 0,
      is_anonymous: isAnonymous,
      frequency:donationType !== 'one-time' ? frequency : null
    };

    try {
      const response = await createDonation(donationDetails);
      if (response) {
        alert("Donation successful! Redirecting to PayPal...");
        window.location.href = response.paypal_link;
      }
    } catch (error) {
      alert("Error processing donation. Please try again.");
    }
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
                  className="w-full p-2 border rounded-md"
                >
                  <option value="" disabled>
                    Select a charity
                  </option>
                  {charities.length > 0 ? (
                    charities.map((charity) => (
                      <option key={charity.id} value={charity.id}>
                        {charity.charity_name}
                      </option>
                    ))
                  ) : (
                    <option disabled>Loading charities...</option>
                  )}
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
                      className={`py-3 px-4 border rounded-md ${amount === preset.toString()
                          ? "border-rose-500 bg-rose-50 text-rose-700"
                          : "border-gray-300 bg-white text-white hover:border-rose-500"
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
                  onChange={handleAmountChange}
                  placeholder="Enter an amount"
                  className="w-full p-2 border rounded-md"
                />
              </div>

              {/* Anonymous Donation */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={isAnonymous}
                  onChange={() => setIsAnonymous(!isAnonymous)}
                  className="mr-2"
                />
                <label className="text-sm text-gray-700">
                  Donate anonymously
                </label>
              </div>

              {/* Donation Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-4">
                  Donation Type
                </label>
                <select
                  value={donationType}
                  onChange={(e) => handleDonationTypeChange(e.target.value)}
                  className="border p-2 rounded w-full"
                >
                  <option value="one-time">One-time</option>
                  <option value="monthly">Monthly</option>
                  <option value="yearly">Yearly</option>
                </select>
              </div>

              {/* Frequency (Only for recurring donations) */}
              {donationType !== "one-time" && (
                  <input
                    type="text"
                    placeholder="Enter frequency (e.g., Every 30 days)"
                    value={frequency}
                    onChange={(e) => setFrequency(e.target.value)}
                    className="border p-2 rounded w-full"
                  />
              )}

              {/* Submit Button */}
              <div className="pt-6">
                <button
                  type="submit"
                  className="w-full flex justify-center py-3 px-4 bg-rose-600 text-white rounded-md"
                >
                  <Heart className="h-5 w-5 mr-2" />
                  Donate Now
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