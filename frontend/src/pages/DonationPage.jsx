import { useState, useEffect} from "react";
import { useDonation } from "../context/DonationContext";
import { useCharity } from "../context/CharityContext";
import { Heart } from "lucide-react";
import { useParams } from "react-router-dom";

const DonationPage = () => {
  const { createDonation } = useDonation();
  const { charities = [], fetchCharities, fetchCharityById } = useCharity();
  const { id } = useParams();
  const [charityId, setCharityId] = useState("");
  const [amount, setAmount] = useState("");
  const [donation_type, setDonationType] = useState("one-time");
  const [donation_frequency, setFrequency] = useState("monthly");
  const [is_anonymous, setIsAnonymous] = useState(false);
  
  const predefinedAmounts = [10, 25, 50, 100];

  const handleAmountChange = (e) => {
    setAmount(e.target.value);
  };

  const handleDonationTypeChange = (donation_type) => {
    setDonationType(donation_type);
    if (donation_type === "one-time") {
      setFrequency(""); // Clear frequency for one-time donations
    }
  };

  // fetch the charities
  useEffect(() => {
    fetchCharities();
    fetchCharityById(id);
  }, []);

  console.log("Fetched charities:", charities);


  const handleSubmit = async (e) => {
    e.preventDefault();

    // allow for the selection of data 
    if (!charityId || !amount) {
      alert("Please select a charity and enter an amount.");
      return;
    }

    const donationDetails = {
      charity_id: charityId,
      amount: parseFloat(amount) || 0,
      is_anonymous: is_anonymous,
      donation_type:donation_type !== 'one-time' ? donation_frequency : null,
    
    };

    try {
      const response = await createDonation(donationDetails.charity_id,donationDetails.amount,donationDetails.is_anonymous);
      
      if (response && response.paypal_link){
        alert("Donation successful! Redirecting to PayPal...");
      // takes you to the paypal link
        window.location.href = response.paypal_link; 
      }else {
        alert("Donation successful, but no PayPal link provided.");
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
                  className="w-full p-2 border rounded-md text-gray-900 bg-white"
                >
                  <option value="" disabled>
                    Select a charity
                  </option>
                  {charities.length > 0 ?(
                    charities.map((charity) => (
                      <option key={charity.id} value={charity.id}>
                      {charity.charity_name}
                    </option> ))
                    ):(
                      <option disabled>Loading charities...</option>
                    )}
                </select>
              </div>
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
                          ? "border-rose-500 bg-rose-50 text-rose-700"
                          : "border-gray-300 bg-black text-white hover:border-rose-500"
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
                  placeholder="Enter custom amount"
                  className="w-full p-2 border rounded-md text-gray-900 bg-white"
                />
              </div>
              {/* Anonymous Donation */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={is_anonymous}
                  onChange={() => setIsAnonymous(!is_anonymous)}
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
                  value={donation_type}
                  onChange={(e) => handleDonationTypeChange(e.target.value)}
                  className="border p-2 rounded w-full"
                >
                  <option value="one-time">One-time</option>
                  <option value="monthly">Monthly</option>
                  <option value="yearly">Yearly</option>
                </select>
                </div>

                {/* Frequency (Only for recurring donations) */}
              {donation_type !== "one-time" && (
                  <input
                    type="text"
                    placeholder="Enter frequency (e.g., Every 30 days)"
                    value={donation_frequency}
                    onChange={(e) => setFrequency(e.target.value)}
                    className="border p-2 rounded w-full"
                  />
              )}
              <div className="pt-6">
                <button
                  type="submit"
                  className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-rose-600 hover:bg-rose-700"
                >
                  <Heart className="h-5 w-5 mr-2" /> Complete Donation
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
