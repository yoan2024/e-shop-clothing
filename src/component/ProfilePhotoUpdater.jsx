// ProfilePhotoUploader.jsx
import { useState, useRef } from "react";
import axios from "axios";
import { Camera } from "lucide-react";
import { useImage } from "../context/Image";
import ClipLoader from "react-spinners/ClipLoader";
import { useUser } from "../context/User";
import { getDoc, doc, setDoc } from "firebase/firestore";
import { db } from "../firebase/firebase-config";

function ProfilePhotoUploader() {
  const { user } = useUser();                // Access the current user from context
  const inputF = useRef(null);              // Reference to the hidden file input
  const { url, setUrl } = useImage();       // Profile image URL and setter (from context)
  const [file, setFile] = useState(null);   // Selected file by the user
  const [preview, setPreview] = useState(""); // Preview of the selected image
  const [showButton, setShowButton] = useState(false); // Show upload button if image is selected
  const [loading, setLoading] = useState(false);       // Show loader when uploading

  // Triggered when user selects a file
  const handleChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    setFile(selectedFile);                              // Save selected file
    setPreview(URL.createObjectURL(selectedFile));      // Show preview
    setShowButton(true);                                // Show upload button
  };

  // Open the file input when camera icon is clicked
  const handleIconClick = () => {
    inputF.current.click();
  };

  // Upload the image to Cloudinary and update Firestore
  const handleUpload = async () => {
    if (!file) return alert("Please choose an image first.");
    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "ecomerce"); // Cloudinary preset

    try {
      const res = await axios.post(
        "https://api.cloudinary.com/v1_1/dcqsgyyax/image/upload",
        formData
      );

      const iduser = user.uid;
      const refdoc = doc(db, "users", iduser);
      const getdata = await getDoc(refdoc);

      if (getdata.exists()) {
        const data = getdata.data();
        const newData = { ...data, image: res.data.secure_url };

        await setDoc(refdoc, newData); // Update user document in Firestore
      }

      setUrl(res.data.secure_url); // Set image URL in context
      setFile(null);
      setPreview("");
      setShowButton(false);
      alert("✅ Image uploaded successfully");
    } catch (error) {
      console.error("Upload failed:", error);
      alert("❌ Image upload failed");
    } finally {
      setLoading(false);
    }
  };

  // Show loader while waiting for preview or stored image
  if (!preview && !url) return <ClipLoader color="#36d7b7" size={50} />;

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Profile image and camera icon */}
      <div className="w-24 h-24 relative">
        <img
          src={preview || url}
          alt="Profile picture"
          className="w-full h-full object-cover rounded-full border shadow-md"
        />
        <div className="absolute top-2 right-2 bg-white p-1 rounded-full cursor-pointer hover:bg-gray-200">
          <Camera size={20} onClick={handleIconClick} className="text-black" />
          <input
            ref={inputF}
            type="file"
            className="hidden"
            accept="image/*"
            onChange={handleChange}
          />
        </div>
      </div>

      {/* Upload button */}
      {showButton && (
        <button
          onClick={handleUpload}
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          {loading ? "Uploading..." : "Save image"}
        </button>
      )}
    </div>
  );
}

export default ProfilePhotoUploader;
