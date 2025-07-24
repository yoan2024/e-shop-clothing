// LogicProduct.tsx

import { getDoc, setDoc, doc } from "firebase/firestore";
import { useState, useEffect } from "react";
import axios from "axios";
import { useProducts } from "../context/ContextProducts";
import { db } from "../firebase/firebase-config";

/**
 * LogicProduct handles both adding and editing product logic.
 * @param onClose - function to close the modal
 * @param p - current product to edit (if any)
 * @param logica - string: "editar" or anything else for add
 */
const LogicProduct = ({ onClose, p, logica }) => {
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState("");
  const [imagePreview, setImagePreview] = useState("");

  const { products, setProducts } = useProducts();

  // Load product details if editing
  useEffect(() => {
    if (p) {
      setTitle(p.title || "");
      setPrice(p.price || "");
      setCategory(p.category || "");
      setDescription(p.description || "");
      setImagePreview(p.image || "");
    }
  }, [p]);

  // Handle image input and preview
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size > 2 * 1024 * 1024) {
      console.warn("❌ Image too large, must be under 2MB");
    } else {
      setFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // Handle form submission to save or update a product
  const handleSave = async (prod) => {
    if (
      title.length > 5 &&
      price > 0 &&
      category.length > 5 &&
      description.length > 5 &&
      imagePreview
    ) {
      const formData = new FormData();
      const defaultImagePath = "/images/sinimagen.webp";

      const defaultResponse = await fetch(defaultImagePath);
      const defaultBlob = await defaultResponse.blob();
      const imageToUpload = file || imagePreview || defaultBlob;

      formData.append("file", imageToUpload);
      formData.append("upload_preset", "ecomerce");

      let imageUrl;

      try {
        const uploadResponse = await axios.post(
          "https://api.cloudinary.com/v1_1/dcqsgyyax/image/upload",
          formData
        );
        imageUrl = uploadResponse.data.secure_url;
        alert("✅ Image uploaded successfully");
      } catch (error) {
        console.error("Image upload failed:", error);
        alert("❌ Image upload failed");
        return;
      }

      const productRef = doc(db, "productos", "productos1088272651");
      const snapshot = await getDoc(productRef);
      const productData = snapshot.data();
      let productList = productData.productos;

      if (logica === "editar") {
        // Update existing product
        const updatedList = productList.map((item) =>
          item.id === prod.id
            ? {
                ...item,
                title,
                category,
                price,
                description,
                image: imageUrl,
              }
            : item
        );

        await setDoc(productRef, { productos: updatedList });
        setProducts(updatedList);
      } else {
        // Create new product
        const newId = Math.max(...productList.map((p) => p.id)) + 1;
        const newProduct = {
          id: newId,
          title,
          category,
          price,
          description,
          image: imageUrl,
          rating: {
            count: Math.floor(Math.random() * 200),
            rate: Math.floor(Math.random() * 6),
          },
        };

        productList.push(newProduct);
        await setDoc(productRef, { productos: productList });
        setProducts(productList);

        // Clear form
        setTitle("");
        setPrice("");
        setCategory("");
        setDescription("");

        // Delay closing the modal
        setTimeout(onClose(), 600);
      }
    } else {
      console.warn("❌ Please complete all fields properly.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-black text-xl font-bold"
        >
          ×
        </button>

        {/* Image preview */}
        <div className="w-full h-40 mb-4 flex items-center justify-center overflow-hidden rounded-md border bg-gray-100">
          {imagePreview ? (
            <img
              src={imagePreview}
              alt="Preview"
              className="max-h-full max-w-full object-contain"
            />
          ) : (
            <span className="text-sm text-gray-400">No image</span>
          )}
        </div>

        {/* Product form */}
        <div className="space-y-3">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Product Name"
            className="w-full border rounded px-3 py-2 text-sm"
          />
          <input
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            type="number"
            placeholder="Price"
            className="w-full border rounded px-3 py-2 text-sm"
          />
          <input
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="Category"
            className="w-full border rounded px-3 py-2 text-sm"
          />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description"
            rows={3}
            className="w-full border rounded px-3 py-2 text-sm"
          />
          <input
            type="file"
            onChange={handleImageChange}
            className="w-full text-sm"
          />
          <button
            onClick={() => handleSave(p)}
            className="w-full mt-4 bg-blue-600 text-white rounded py-2 hover:bg-blue-700 transition"
          >
            {logica === "editar" ? "Save Changes" : "Add Product"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LogicProduct;
