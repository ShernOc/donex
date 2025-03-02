import { useState, useEffect, useCallback } from "react";
import Cropper from "react-easy-crop";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { toast } from "react-toastify";

const CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/dvqgo17cz/upload";
const UPLOAD_PRESET = "donex_proj"; 

export default function ProfilePage() {
  const { user, updateUser } = useUser();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    about: "",
    profilePhoto: "",
    description: "",
    donationGoal: "",
    impactStories: "",
    role: "user",
  });

  const [imageSrc, setImageSrc] = useState(null);
  const [croppedImage, setCroppedImage] = useState(null);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [zoom, setZoom] = useState(1);
  const [userId, setUserId] = useState(null);
  const [showCropper, setShowCropper] = useState(false);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await fetch("http://127.0.0.1:5000/current_user", {
          method: "GET",
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });

        if (response.ok) {
          const data = await response.json();
          setUserId(data.id);
          setFormData({
            name: data.name || "",
            email: data.email || "",
            about: data.about || "",
            profilePhoto: data.profile_photo || "",
            description: data.description || "",
            donationGoal: data.donation_goal || "",
            impactStories: data.impact_stories || "",
            role: data.role || "user",
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

  const isCharity = formData.role === "charity";

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

  const createImage = (url) =>
    new Promise((resolve, reject) => {
      const image = new Image();
      image.crossOrigin = "anonymous";
      image.src = url;
      image.onload = () => resolve(image);
      image.onerror = reject;
    });

  const getCroppedImg = async () => {
    if (!imageSrc || !croppedAreaPixels) return null;

    try {
      const image = await createImage(imageSrc);
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      canvas.width = croppedAreaPixels.width;
      canvas.height = croppedAreaPixels.height;

      ctx.drawImage(
        image,
        croppedAreaPixels.x,
        croppedAreaPixels.y,
        croppedAreaPixels.width,
        croppedAreaPixels.height,
        0,
        0,
        croppedAreaPixels.width,
        croppedAreaPixels.height
      );

      return new Promise((resolve, reject) => {
        canvas.toBlob((blob) => {
          if (blob) resolve(blob);
          else reject(new Error("Canvas to Blob conversion failed"));
        }, "image/jpeg");
      });
    } catch (error) {
      console.error("Error cropping image:", error);
      return null;
    }
  };

  const handleCropSave = async () => {
    const croppedImg = await getCroppedImg();
    if (croppedImg) {
      setCroppedImage(croppedImg);
      setFormData((prev) => ({ ...prev, profilePhoto: croppedImg }));
      setImageSrc(null);
      setShowCropper(false);
    }
  };

  const handleSave = async () => {
    if (!userId) {
      alert("User ID not found. Please log in again.");
      return;
    }

    try {
      const response = await fetch(`http://127.0.0.1:5000/users/${userId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert("Profile updated successfully!");
      } else {
        alert("Failed to update profile.");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("An error occurred while saving the profile.");
    }
  };
  

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl w-full p-8 bg-white shadow-lg rounded-2xl space-y-6">
        <h2 className="text-4xl font-bold text-center mb-8 text-gray-800">Profile Settings</h2>

        <div className="flex flex-col items-center">
          <img
            src={croppedImage || formData.profilePhoto || "/default-avatar.png"}
            alt="Profile"
            className="rounded-full object-cover border-4 border-gray-300 shadow-md w-32 h-32 mb-4"
          />
          <input type="file" accept="image/*" onChange={handleImageUpload} className="border p-2 rounded w-full" />
        </div>

        {showCropper && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h2 className="text-xl font-bold mb-4">Crop Image</h2>
              <div className="relative w-80 h-80 bg-gray-300">
                <Cropper
                  image={imageSrc}
                  crop={{ x: 0, y: 0 }}
                  zoom={zoom}
                  aspect={1}
                  onCropChange={() => {}}
                  onCropComplete={onCropComplete}
                  onZoomChange={setZoom}
                />
              </div>
              <div className="flex justify-between mt-4">
                <button onClick={() => setShowCropper(false)} className="bg-gray-500 text-white px-4 py-2 rounded-md">
                  Cancel
                </button>
                <button onClick={handleCropSave} className="bg-blue-600 text-white px-4 py-2 rounded-md">
                  Crop & Save
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input type="text" name="name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="Full Name" className="border p-3 rounded-md shadow-sm w-full" />
          <input type="email" name="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} placeholder="Email" className="border p-3 rounded-md shadow-sm w-full" />
        </div>

        <button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold p-4 rounded-md shadow-md w-full mt-6 transition">
          Save Changes
        </button>
      </div>
    </div>
  );
}

const createImage = (url) =>
  new Promise((resolve, reject) => {
    const img = new Image();
    img.src = url;
    img.onload = () => resolve(img);
    img.onerror = (error) => reject(error);
  });
