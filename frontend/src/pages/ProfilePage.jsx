import React, { useEffect, useState } from "react";
import { useUser } from "../context/UserContext";
import { useNavigate } from "react-router-dom";

const ProfilePage = () => {
    const { user, updateUserProfile } = useUser();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploadError, setUploadError] = useState(null);

    // Editable profile data
    const [profileData, setProfileData] = useState({
        full_name: "",
        email: "",
        phone: "",
        profile_picture: "",
    });

    // Load user profile on mount
    useEffect(() => {
        if (!user) {
            const mockProfile = {
                full_name: "John Doe",
                email: "johndoe@example.com",
                phone: "+123456789",
                profile_picture: localStorage.getItem("profile_picture") || "https://via.placeholder.com/150",
            };

            setTimeout(() => {
                updateUserProfile(mockProfile);
                setProfileData(mockProfile);
                setLoading(false);
            }, 1000); // Simulate API delay
        } else {
            setProfileData(user);
            setLoading(false);
        }
    }, [user, updateUserProfile]);

    // Handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfileData((prev) => ({ ...prev, [name]: value }));
    };

    // Handle file selection
    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setSelectedFile(file);
        }
    };

    // Handle profile picture upload
    const handleUpload = async () => {
        if (!selectedFile) {
            setUploadError("Please select a file first.");
            return;
        }

        // Simulating profile picture upload by creating a URL
        const newProfilePicture = URL.createObjectURL(selectedFile);
        
        // Persist profile picture in local storage
        localStorage.setItem("profile_picture", newProfilePicture);

        // Update state and context
        const updatedProfile = { ...profileData, profile_picture: newProfilePicture };
        setProfileData(updatedProfile);
        updateUserProfile(updatedProfile);

        setUploadError(null);
        alert("Profile picture updated successfully!");
    };

    // Handle saving other profile details
    const handleSaveChanges = () => {
        updateUserProfile(profileData);
        alert("Profile updated successfully!");
    };

    if (loading) return <p className="text-center text-lg mt-5">Loading...</p>;

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-lg bg-white shadow-lg rounded-xl p-6">
                {/* Profile Picture Section */}
                <div className="flex flex-col items-center">
                    <img
                        src={profileData.profile_picture}
                        alt="Profile"
                        className="w-32 h-32 rounded-full border-4 border-gray-300 shadow-sm"
                    />
                    <h3 className="mt-4 text-xl font-semibold text-gray-800">{profileData.full_name}</h3>
                </div>

                {/* Profile Picture Upload */}
                <div className="mt-6">
                    <label className="block text-sm font-medium text-gray-700">
                        Change Profile Picture
                    </label>
                    <input
                        type="file"
                        accept="image/*"
                        className="mt-2 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        onChange={handleFileChange}
                    />
                    <button
                        className="mt-3 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-all"
                        onClick={handleUpload}
                    >
                        Upload
                    </button>
                    {uploadError && <p className="text-red-500 text-sm mt-2">{uploadError}</p>}
                </div>

                {/* Editable Profile Fields */}
                <div className="mt-6">
                    <h5 className="text-lg font-semibold text-gray-700">Account Details</h5>
                    <div className="mt-2">
                        <label className="block text-sm font-medium text-gray-700">Full Name</label>
                        <input
                            type="text"
                            name="full_name"
                            value={profileData.full_name}
                            onChange={handleChange}
                            className="mt-1 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div className="mt-3">
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={profileData.email}
                            onChange={handleChange}
                            className="mt-1 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div className="mt-3">
                        <label className="block text-sm font-medium text-gray-700">Phone</label>
                        <input
                            type="text"
                            name="phone"
                            value={profileData.phone}
                            onChange={handleChange}
                            className="mt-1 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>

                {/* Save Changes Button */}
                <button
                    className="mt-6 w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition-all"
                    onClick={handleSaveChanges}
                >
                    Save Changes
                </button>
            </div>
        </div>
    );
};

export default ProfilePage;
