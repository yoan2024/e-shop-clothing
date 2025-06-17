// ProfilePhotoUploader.jsx
import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { Camera } from "lucide-react";
import { useImage } from "../context/Image";
import ClipLoader from "react-spinners/ClipLoader";
import { useUser } from "../context/User";
import { getDoc, doc, setDoc } from "firebase/firestore";
import { db } from "../firebase/firebase-config";
function ProfilePhotoUploader() {
  const { user, setUser } = useUser();
  const inputF = useRef(null);
  const { url, setUrl } = useImage();
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");

  const [showButton, setShowButton] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
    setShowButton(true);
  };

  const handleIconClick = () => {
    inputF.current.click();
  };

  const handleUpload = async () => {
    if (!file) return alert("Elige una imagen primero");
    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "ecomerce");

    try {
      const res = await axios.post(
        "https://api.cloudinary.com/v1_1/dcqsgyyax/image/upload",
        formData
      );
      const iduser = await user.uid;
      console.log("iduser", iduser);
      const refdoc = doc(db, "usuarios", iduser);
      const getdata = await getDoc(refdoc);
      if (getdata.exists()) {
        const data = getdata.data();
        let newData = { ...data, image: res.data.secure_url };
        setDoc(refdoc, newData);
        console.log("actualizado correctamente la imagen de firebase de user");
      }
      setUrl(res.data.secure_url);
      setFile(null);
      setPreview("");
      setShowButton(false);
      alert("✅ Imagen subida correctamente");
    } catch (error) {
      console.error("Error uploading:", error);
      alert("❌ Falló la subida");
    } finally {
      setLoading(false);
    }
  };
  if (!preview && !url) return <ClipLoader color="#36d7b7" size={50} />;
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="w-48 h-48 relative">
        <img
          src={preview || url}
          alt="Foto de perfil"
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

      {showButton && (
        <button
          onClick={handleUpload}
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          {loading ? "Subiendo..." : "Guardar imagen"}
        </button>
      )}
    </div>
  );
}

export default ProfilePhotoUploader;
