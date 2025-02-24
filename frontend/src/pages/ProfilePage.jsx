import { useState, useEffect, useCallback } from "react";
import Cropper from "react-easy-crop";

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

  const [imageSrc, setImageSrc] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [croppedImage, setCroppedImage] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user")) || {};
    setFormData((prev) => ({ ...prev, ...storedUser }));
  }, []);

  const isCharity = formData.role === "charity";

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

  const getCroppedImg = async () => {
    if (!imageSrc || !croppedAreaPixels) return;

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

    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        const croppedImageUrl = URL.createObjectURL(blob);
        resolve(croppedImageUrl);
      }, "image/jpeg");
    });
  };

  const handleCropSave = async () => {
    const croppedImg = await getCroppedImg();
    setCroppedImage(croppedImg);
    setFormData((prev) => ({ ...prev, profilePhoto: croppedImg }));
    setImageSrc(null); // Close cropper
  };

  const handleSave = () => {
    localStorage.setItem("user", JSON.stringify(formData));
    alert("Profile updated successfully!");
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="max-w-4xl w-full mx-auto p-8 bg-white shadow-lg rounded-2xl">
        <h2 className="text-3xl font-semibold text-center mb-6">Profile Settings</h2>

        {/* Image Cropping Modal */}
        {imageSrc && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-4 rounded-lg shadow-lg w-96">
              <h3 className="text-lg font-semibold mb-3">Crop your image</h3>
              <div className="relative w-full h-64 bg-gray-200">
                <Cropper
                  image={imageSrc}
                  crop={crop}
                  zoom={zoom}
                  aspect={1}
                  onCropChange={setCrop}
                  onZoomChange={setZoom}
                  onCropComplete={onCropComplete}
                />
              </div>
              <div className="flex justify-between items-center mt-4">
                <input
                  type="range"
                  min="1"
                  max="3"
                  step="0.1"
                  value={zoom}
                  onChange={(e) => setZoom(e.target.value)}
                  className="w-full"
                />
              </div>
              <div className="flex justify-between mt-4">
                <button className="bg-red-500 text-white px-4 py-2 rounded" onClick={() => setImageSrc(null)}>Cancel</button>
                <button className="bg-blue-600 text-white px-4 py-2 rounded" onClick={handleCropSave}>Save Crop</button>
              </div>
            </div>
          </div>
        )}

        {/* Profile Photo Upload & Resize */}
        <div className="flex flex-col items-center">
          <img
            src={croppedImage || formData.profilePhoto || "/default-avatar.png"}
            alt="Profile"
            className="rounded-full object-cover border-4 border-gray-300 shadow-md"
            style={{ width: "128px", height: "128px" }}
          />
          <input type="file" accept="image/*" onChange={handleImageUpload} className="border p-2 w-full rounded mt-4" />
        </div>

        {/* Profile Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          <input type="text" name="name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="Full Name" className="border p-3 w-full rounded" />
          <input type="email" name="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} placeholder="Email" className="border p-3 w-full rounded" />
          <input type="text" name="phone" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} placeholder="Phone Number" className="border p-3 w-full rounded" />
        </div>

        <textarea name="about" value={formData.about} onChange={(e) => setFormData({ ...formData, about: e.target.value })} placeholder="Write about yourself..." className="border p-3 w-full rounded mt-4" />

        {isCharity && (
          <div className="mt-6">
            <h3 className="text-xl font-semibold text-center">Charity Details</h3>
            <textarea name="description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="Brief Description about the Charity" className="border p-3 w-full rounded mt-2" />
            <input type="text" name="donationGoal" value={formData.donationGoal} onChange={(e) => setFormData({ ...formData, donationGoal: e.target.value })} placeholder="Donation Goal (e.g., $10,000)" className="border p-3 w-full rounded mt-2" />
          </div>
        )}

        <button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold p-3 rounded w-full mt-6 transition">
          Save Changes
        </button>
      </div>
    </div>
  );
}

// Function to create an image object
const createImage = (url) =>
  new Promise((resolve, reject) => {
    const img = new Image();
    img.src = url;
    img.onload = () => resolve(img);
    img.onerror = (error) => reject(error);
  });
