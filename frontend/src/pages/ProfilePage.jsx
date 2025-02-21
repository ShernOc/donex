import { useState, useEffect } from "react";

export default function ProfilePage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    about: "",
    profilePhoto: "",
    description: "",
    donationGoal: "",
    impactStories: "",
    role: "user", // Default role
  });

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user")) || {};
    setFormData((prev) => ({ ...prev, ...storedUser }));
  }, []);

  const isCharity = formData.role === "charity";

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    localStorage.setItem("user", JSON.stringify(formData));
    alert("Profile updated successfully!");
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-2xl">
      <h2 className="text-2xl font-semibold mb-4">Profile Settings</h2>
      <div className="flex flex-col items-center">
        <img
          src={formData.profilePhoto || "/default-avatar.png"}
          alt="Profile"
          className="w-24 h-24 rounded-full mb-4 object-cover"
        />
        <input
          type="text"
          name="profilePhoto"
          placeholder="Profile Image URL"
          value={formData.profilePhoto}
          onChange={handleChange}
          className="border p-2 w-full rounded"
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Full Name" className="border p-2 w-full rounded" />
        <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" className="border p-2 w-full rounded" />
        <input type="text" name="phone" value={formData.phone} onChange={handleChange} placeholder="Phone Number" className="border p-2 w-full rounded" />
      </div>
      <textarea name="about" value={formData.about} onChange={handleChange} placeholder="Write about yourself..." className="border p-2 w-full rounded mt-4" />
      
      {isCharity && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold">Charity Details</h3>
          <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Brief Description about the Charity" className="border p-2 w-full rounded mt-2" />
          <input type="text" name="donationGoal" value={formData.donationGoal} onChange={handleChange} placeholder="Donation Goal (e.g., $10,000)" className="border p-2 w-full rounded mt-2" />
          <textarea name="impactStories" value={formData.impactStories} onChange={handleChange} placeholder="Share impact stories about your charity's work" className="border p-2 w-full rounded mt-2" />
        </div>
      )}
      <button onClick={handleSave} className="bg-blue-500 text-white p-2 rounded w-full mt-6">Save Changes</button>
    </div>
  );
}
