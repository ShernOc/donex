import { useState, useEffect } from "react";
import { useDonation } from "../context/DonationContext";
import { Heart } from "lucide-react";
import { useParams } from "react-router-dom";

const DonationPage = () => {
  const { createDonation } = useDonation();
  const { id } = useParams();
  const [charityId, setCharityId] = useState("");
  const [amount, setAmount] = useState("");
  const [donationType, setDonationType] = useState("one-time");
  const [donationFrequency, setDonationFrequency] = useState("monthly");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [charities, setCharities] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const predefinedAmounts = [10, 25, 50, 100];

  useEffect(() => {
    const mockCharities = [
      { id: "1", charityName: "Save the Children" },
      { id: "2", charityName: "Red Cross" },
      { id: "3", charityName: "World Wildlife Fund" },
      { id: "4", charityName: "Doctors Without Borders" },
    ];

    setCharities(mockCharities);

    // Uncomment this to fetch real charities when API is ready
    /*
    const fetchCharities = async () => {
      try {
        const response = await fetch("http://127.0.0.1:5000/charities?status=approved");
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setCharities(data);
      } catch (error) {
        setError("Error fetching charities: " + error.message);
      }
    };
    fetchCharities();
    */
  }, []);

  const handleAmountChange = (e) => {
    setAmount(e.target.value);
  };

  const handleDonationTypeChange = (donationType) => {
    setDonationType(donationType);
    if (donationType === "one-time") {
      setDonationFrequency(""); // Clear frequency for one-time donations
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!charityId || !amount) {
      setError("Please select a charity and enter an amount.");
      return;
    }

    try {
      const response = await createDonation(charityId, amount, isAnonymous);

      if (response?.paypalLink) {
        setSuccess("Donation successful! Redirecting to PayPal...");
        window.location.href = response.paypalLink; // Redirect to PayPal
      } else {
        setSuccess("Donation successful! Thank you for your contribution.");
        setError(null); 
      }
    } catch (error) {
      setError("Error creating donation: " + error.message);
      setSuccess(null); 
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
            {error && <p className="text-red-500">{error}</p>}
            {success && <p className="text-green-500">{success}</p>}
            <form onSubmit={handleSubmit} className="space-y-6">
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
                  {charities.length > 0 ? (
                    charities.map((charity) => (
                      <option key={charity.id} value={charity.id}>
                        {charity.charityName}
                      </option>
                    ))
                  ) : (
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
              {donationType !== "one-time" && (
                <input
                  type="text"
                  placeholder="Enter frequency (e.g., Every 30 days)"
                  value={donationFrequency}
                  onChange={(e) => setDonationFrequency(e.target.value)}
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