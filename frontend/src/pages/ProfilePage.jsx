import { useState, useEffect, useCallback } from "react";
import Cropper from "react-easy-crop";
import { useUser } from "../context/UserContext";
import { toast } from "react-toastify";

const CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/dvqgo17cz/upload";
const UPLOAD_PRESET = "donex_proj";

// Utility function to crop the image
const getCroppedImg = async (imageSrc, pixelCrop) => {
  const image = new Image();
  image.src = imageSrc;

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;

  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  );

  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      resolve(blob);
    }, "image/jpeg");
  });
};

export default function ProfilePage() {
  const { user, updateUser } = useUser();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    profilePhoto: "",
  });

  const [imageSrc, setImageSrc] = useState(null);
  const [croppedImage, setCroppedImage] = useState(null);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [zoom, setZoom] = useState(1);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [userId, setUserId] = useState(null);
  const [showCropper, setShowCropper] = useState(false);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await fetch("https://donex-uq5f.onrender.com/current_user", {
          method: "GET",
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });

        if (response.ok) {
          const data = await response.json();
          setUserId(data.id);
          setFormData({
            name: data.full_name || "",
            email: data.email || "",
            profilePhoto: data.profile_picture || "",
          });
        } else {
          console.error("Failed to fetch user profile");
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    fetchUserProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImageSrc(reader.result);
        setShowCropper(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleCropAndUpload = useCallback(async () => {
    try {
      const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels);
      setCroppedImage(croppedImage);

      const formData = new FormData();
      formData.append("file", croppedImage);
      formData.append("upload_preset", UPLOAD_PRESET);

      const response = await fetch(CLOUDINARY_URL, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      setFormData((prev) => ({ ...prev, profilePhoto: data.secure_url }));
      setShowCropper(false);
    } catch (error) {
      console.error("Error cropping and uploading image:", error);
      toast.error("Failed to upload image.");
    }
  }, [imageSrc, croppedAreaPixels]);

  const handleSave = async () => {
    if (!userId) {
      toast.error("User ID not found. Please log in again.");
      return;
    }

    // Map frontend fields to backend fields
    const payload = {
      full_name: formData.name,
      email: formData.email,
      profile_picture: formData.profilePhoto,
      role: "user", // Add a default role or fetch it from the user context
    };

    try {
      const response = await fetch(`https://donex-uq5f.onrender.com/users/${userId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        toast.success("Profile updated successfully!");
        const data = await response.json();
        updateUser(data); // Update the user context if needed
      } else {
        toast.error("Failed to update profile.");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("An error occurred while saving the profile.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl w-full p-8 bg-white shadow-lg rounded-2xl space-y-6">
        <h2 className="text-4xl font-bold text-center mb-8 text-gray-800">Profile Settings</h2>

        <div className="flex flex-col items-center">
          <img
            src={formData.profilePhoto || "/default-avatar.png"}
            alt="Profile"
            className="rounded-full object-cover border-4 border-gray-300 shadow-md w-32 h-32 mb-4"
          />
          <input type="file" accept="image/*" onChange={handleImageUpload} className="border p-2 rounded w-full" />
        </div>

        {showCropper && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50">
            <div className="bg-white p-4 rounded-lg">
              <div className="relative w-96 h-96">
                <Cropper
                  image={imageSrc}
                  crop={crop}
                  zoom={zoom}
                  aspect={1}
                  onCropChange={setCrop}
                  onCropComplete={onCropComplete}
                  onZoomChange={setZoom}
                />
              </div>
              <button
                onClick={handleCropAndUpload}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold p-2 rounded-md shadow-md mt-4"
              >
                Crop and Upload
              </button>
            </div>
          </div>
        )}

        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Name"
          className="border p-3 rounded w-full"
        />

        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email"
          className="border p-3 rounded w-full"
        />

        <button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold p-4 rounded-md shadow-md w-full mt-6 transition">
          Save Changes
        </button>
      </div>
    </div>
  );
}