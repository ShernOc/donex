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
    phone: "",
    profile_picture: "",
    role: "user",
  });

  const [imageSrc, setImageSrc] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({ ...prev, ...user }));
    }
  }, [user]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setImageSrc(reader.result);
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
    try {
      const croppedImg = await getCroppedImg();
      if (!croppedImg) {
        toast.error("Failed to crop image.");
        return;
      }

      const cloudinaryFormData = new FormData();
      cloudinaryFormData.append("file", croppedImg, "cropped-image.jpg");
      cloudinaryFormData.append("upload_preset", UPLOAD_PRESET);

      const uploadResponse = await fetch(CLOUDINARY_URL, {
        method: "POST",
        body: cloudinaryFormData,
      });

      const data = await uploadResponse.json();

      if (data.secure_url) {
        setFormData((prev) => ({ ...prev, profile_picture: data.secure_url }));
        setImageSrc(null);
        toast.success("Profile picture uploaded successfully!");
      } else {
        throw new Error("Cloudinary upload failed");
      }
    } catch (error) {
      toast.error("Failed to upload image.");
      console.error("Image Processing Error:", error);
    }
  };

  const handleSave = async () => {
    if (!formData.name || !formData.email || !formData.phone) {
      toast.error("Please fill in all required fields.");
      return;
    }
  
    if (!user || !user.id) {
      toast.error("User ID is missing. Please log in again.");
      return;
    }
  
    setIsUpdating(true);
    try {
      await updateUser(user.id, formData);  // Ensure user.id is passed
      toast.success("Profile updated successfully!");
      localStorage.setItem("user", JSON.stringify(formData));
      navigate("/donor/dashboard");
    } catch (error) {
      toast.error("Failed to update profile.");
      console.error("Profile update error:", error);
    }
    setIsUpdating(false);
  };
  

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 py-6">
      <div className="max-w-4xl w-full mx-auto p-8 bg-white shadow-xl rounded-3xl">
        <h2 className="text-3xl font-semibold text-center text-gray-800 mb-6">
          Profile Settings
        </h2>

        {imageSrc && (
          <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg shadow-xl w-96">
              <h3 className="text-xl font-semibold mb-4 text-center">
                Crop Your Image
              </h3>
              <div className="relative w-full h-64 bg-gray-200 rounded-lg overflow-hidden">
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
              <div className="mt-4 text-center">
                <button
                  className="bg-blue-500 text-white p-2 rounded"
                  onClick={handleCropSave}
                >
                  Save Cropped Image
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block font-medium">Name</label>
            <input
              type="text"
              className="w-full p-3 border border-gray-300 rounded-md"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
          </div>

          <div>
            <label className="block font-medium">Email</label>
            <input
              type="email"
              className="w-full p-3 border border-gray-300 rounded-md"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
          </div>

          <div>
            <label className="block font-medium">Phone</label>
            <input
              type="text"
              className="w-full p-3 border border-gray-300 rounded-md"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
            />
          </div>

          <div>
            <label className="block font-medium">Profile Photo</label>
            <input
              type="file"
              className="w-full p-3 border border-gray-300 rounded-md"
              onChange={handleImageUpload}
            />
            {formData.profile_picture && (
              <div className="mt-2 flex justify-center">
                <img
                  src={formData.profile_picture}
                  alt="Profile"
                  className="w-32 h-32 object-cover rounded-full border border-gray-300"
                />
              </div>
            )}
          </div>

          <div className="mt-6 text-center">
            <button
              onClick={handleSave}
              className={`bg-blue-500 text-white p-3 rounded-md w-full ${
                isUpdating ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={isUpdating}
            >
              {isUpdating ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
