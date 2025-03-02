import React, { useState } from "react";

const CharityVerification = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    charity_name: "",
    email: "",
    description: "",
    phone_number: "",
    bank_name: "",
    account_number: "",
    account_holder: "",
    targeted_amount: "",
  });

  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await fetch("http://127.0.0.1:5000/charities/verify", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to submit charity verification.");
      }

      const data = await response.json();
      alert(data.message);
      if (onSubmit) onSubmit(data);
      setFormData({
        charity_name: "",
        email: "",
        description: "",
        phone_number: "",
        bank_name: "",
        account_number: "",
        account_holder: "",
        targeted_amount: "",
      });
    } catch (err) {
      console.error("Error submitting form:", err);
      setError(err.message);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Charity Verification Form</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Charity Name */}
        <div className="col-span-2">
          <label className="block text-gray-700 font-medium">Charity Name</label>
          <input
            type="text"
            name="charity_name"
            value={formData.charityName}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg"
            required
          />
        </div>

        {/* Contact Email */}
        <div>
          <label className="block text-gray-700 font-medium">Contact Email</label>
          <input
            type="email"
            name="email"
            value={formData.contactEmail}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg"
            required
          />
        </div>

        {/* description*/}
        <div>
          <label className="block text-gray-700 font-medium">Description </label>
          <input
            type="text"
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg"
          />
        </div>

        {/* Phone Number */}
        <div>
          <label className="block text-gray-700 font-medium">Phone Number</label>
          <input
            type="tel"
            name="phone_number"
            value={formData.phoneNumber}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg"
            required
          />
        </div>

        {/* Bank Name (Optional) */}
        <div>
          <label className="block text-gray-700 font-medium">Bank Name (Optional)</label>
          <input
            type="text"
            name="bank_name"
            value={formData.bankName}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg"
          />
        </div>

        {/* Account Number (Optional) */}
        <div>
          <label className="block text-gray-700 font-medium">Account Number (Optional)</label>
          <input
            type="text"
            name="account_number"
            value={formData.accountNumber}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg"
          />
        </div>

        {/* Account Holder Name (Optional) */}
        <div className="col-span-2">
          <label className="block text-gray-700 font-medium">Account Holder Name (Optional)</label>
          <input
            type="text"
            name="account_holder"
            value={formData.accountHolder}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg"
          />
        </div>

        {/* Targeted Amount */}
        <div className="col-span-2">
          <label className="block text-gray-700 font-medium">Targeted Amount (KSh)</label>
          <input
            type="number"
            name="targeted_amount"
            value={formData.targetedAmount}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg"
            required
          />
        </div>

        {/* Submit Button */}
        <div className="col-span-2">
          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Submit for Verification
          </button>
        </div>
      </form>
    </div>
  );
};

export default CharityVerification;
