// ProfilePhotoUploader.jsx
import { useState } from "react";
import axios from "axios";

function ProfilePhotoUploader() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [url, setUrl] = useState("");

  const handleChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
  };

  const handleUpload = async () => {
    if (!file) return alert("Choose an image first");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "ecomerce"); // tu upload preset

    try {
      const res = await axios.post(
        "https://api.cloudinary.com/v1_1/dcqsgyyax/image/upload",
        formData
      );
      setUrl(res.data.secure_url);
      alert("✅ Imagen subida correctamente");
    } catch (error) {
      console.error("Error uploading:", error);
      alert("❌ Falló la subida");
    }
  };

  return (
    <div>
      <div>
        <img src="" alt="" />
      </div>
      <div>
        <input type="file" onChange={handleChange} />
        {preview && <img src={preview} width="150" alt="Preview" />}
        <button onClick={handleUpload}>Subir imagen</button>
        {url && (
          <div>
            <p>URL guardada:</p>
            <a href={url} target="_blank" rel="noreferrer">
              {url}
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProfilePhotoUploader;
