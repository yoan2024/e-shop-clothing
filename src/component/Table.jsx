// ==============================
// Table.jsx
// ==============================

import { useState } from "react";
import BodyTableP from "./BodyTableP";
import { motion, AnimatePresence } from "framer-motion";
import { Star, ImagePlus } from "lucide-react";
import { writeBatch, WriteBatch } from "firebase/firestore";
import { generateUniqueID } from "../utils/utils";
import axios from "axios";
import { ImEdge } from "react-icons/im";
import { db } from "../firebase/firebase-config";
import { collection, getDoc, getDocs, query, setDoc, where } from "firebase/firestore";

const Table = ({ ped }) => {
  // ====== Local States ======
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [images, setImages] = useState([]);
  const [files, setFiles] = useState([])


  console.log(images, "imagenes")
  // ====== Modal Handlers ======
  const handleOpenModal = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedOrder(null);
    setIsModalOpen(false);
  };

  const handleAddItemReview = (item) => {
    setSelectedItem(item);
    setReviewModalOpen(true);
  };

  const handleCloseReviewModal = () => {
    setReviewModalOpen(false);
    setSelectedItem(null);
    setRating(0);
    setComment("");
    setImages([]);
    setFiles([])
  };

  // ====== Image Upload Handler ======
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map((file) => URL.createObjectURL(file)); // preview URLs
    setImages((prev) => [...prev, ...newImages]);
    setFiles(files)
  };

  const handleRemoveImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  // ====== Submit Review Handler ======
  const handleSubmitReview = () => {
    if (rating === 0 || comment.trim() === "") {
      alert("Please add both a rating and a comment before submitting.");
      return;
    }


    const urlsCloud = handleUpload()

    const newReview = {
      reviewId: `R-${generateUniqueID()}`,
      userId: ped.userId,
      orderId: ped.orderId,
      itemId: selectedItem.id,
      rating,
      comment,
      images: urlsCloud,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      helpfulCount: 0,
    };

    handleDB(newReview)
    
    handleCloseReviewModal();
  };
 
  // Upload the images to Cloudinary and update Firestore
  const handleUpload = async () => {
   
   if(files.length === 0) return [];
    const urls = []
  for(const file of files){
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "ecomerce"); // Cloudinary preset
     
     try {
      const res = await axios.post(
        "https://api.cloudinary.com/v1_1/dcqsgyyax/image/upload",
        formData
      );
      urls.push(res.data.secure_url)   
    } catch (error) {
      console.log("hubo un error ca en la loop de files")
    } 
    }

    return urls
  } 


  const handleDB= async (review)  => {
 
    const ID_USER = review.userId
    //agregando  nuevo docuemnto en la colelecoon reviewds

   const refdoc = doc(db, "reviews", ID_USER)
   await setDoc(refdoc, review)


   // actualizando el estado de reviewd en cada item de los pedidos del ususario
   
 const refdocP =  collection(db, "allOrders")
   const consult = query(refdocP, where("userId", "==", ID_USER), where("status", "==", "Delivered"))
   const getdocs = getDocs(consult)
   const batch = writeBatch(db)
   const forEachDoc = getdocs.forEach((document) => {
     const data = document.data();

    // 3️⃣ Modifica el array de items
    const updatedItems = data.items.map((item) => {
      if (item.id === review.itemId) {
        return { ...item, reviewed: true }; // solo actualiza item con id 1
      }
      return item;
    });

    // 4️⃣ Aplica el update en el batch
    const docRef = doc(db, "allOrders", document.id);
    batch.update(docRef, { orderedItems: updatedItems });
    
   })


   const refdocP2 = doc(db, "products")
   const getdoc2 = getDoc(refdocP2, "products1088272651")
   const document = (await getdoc2).data()
    if(document){
      const products2 = document.products.map((d) => {

      })

   /// esto se toca en un futuro 
    }
  }
  
  

  return (
    <section className="flex flex-col items-center">
      {/* ============================== */}
      {/* Orders List */}
      {/* ============================== */}
      <div className="w-full">
        {ped.map((order, index) => (
          <div key={index} className="relative mb-8">
            {/* 🔹 Add Review Button (only for delivered orders) */}
            {order.status === "Delivered" && (
              <div className="flex justify-end mb-2">
                <button
                  onClick={() => handleOpenModal(order)}
                  className="px-4 py-1 bg-orange-500 text-white rounded hover:bg-orange-600 transition"
                >
                  Add Reviews
                </button>
              </div>
            )}

            {/* 🔹 Order Table */}
            <table className="table-auto border-2 w-full border-collapse">
              <thead>
                <tr className="text-sm">
                  <th className="border-2 border-slate-900">{order.orderId}</th>
                  <th className="border-2 border-slate-900">{order.orderDate}</th>
                  <th className="border-2 border-slate-900">ITEM</th>
                  <th className="border-2 border-slate-900">NAME</th>
                  <th className="border-2 border-slate-900">QUANTITY</th>
                  <th className="border-2 border-slate-900">TOTAL</th>
                  <th className="border-2 border-slate-900">STATUS</th>
                  <th className="border-2 border-slate-900">SHIPPING</th>
                </tr>
              </thead>

              <tbody className="text-xs">
                <BodyTableP
                  itemspedidos={order.orderedItems}
                  status={order.status}
                  shippingStatus={order.shippingStatus}
                />
                <tr>
                  <td colSpan="8" className="h-4"></td>
                </tr>
                <tr>
                  <th className="bg-black/50">Total</th>
                  <th></th>
                  <th></th>
                  <th></th>
                  <th></th>
                  <th className="bg-black/50">${order.totalPaid} USD</th>
                  <th>{order.status}</th>
                  <th className="p-2 animate-pulse">{order.shippingStatus}</th>
                </tr>
              </tbody>
            </table>
          </div>
        ))}
      </div>

      {/* ============================== */}
      {/* Main Modal - List of Order Items */}
      {/* ============================== */}
      <AnimatePresence>
        {isModalOpen && selectedOrder && (
          <motion.div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-2xl shadow-lg p-6 w-[90%] max-w-md"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
            >
              <h2 className="text-xl font-semibold mb-4 text-center">
                Add a Review for Order #{selectedOrder.orderId}
              </h2>

              <div className="max-h-[300px] overflow-y-auto space-y-3">
                {selectedOrder.orderedItems.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between border-b pb-2"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-10 h-10 object-contain rounded"
                      />
                      <div>
                        <p className="font-medium text-sm">{item.title}</p>
                        <p className="text-xs text-gray-500">
                          ${item.price} × {item.quantity}
                        </p>
                      </div>
                    </div>

                    {item.reviewed ? (
                      <span className="text-xs text-green-600 font-medium">
                        ✅ Reviewed
                      </span>
                    ) : (
                      <button
                        onClick={() => handleAddItemReview(item)}
                        className="px-2 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                      >
                        Add Review
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <div className="flex justify-end mt-5">
                <button
                  onClick={handleCloseModal}
                  className="px-4 py-2 text-sm bg-gray-700 text-white rounded hover:bg-gray-900"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ============================== */}
      {/* Review Modal (Item-Specific) */}
      {/* ============================== */}
      <AnimatePresence>
        {reviewModalOpen && selectedItem && (
          <motion.div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-2xl shadow-lg p-6 w-[90%] max-w-md"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
            >
              <h2 className="text-xl font-semibold text-center mb-3">
                Review: {selectedItem.title}
              </h2>

              <div className="flex flex-col items-center gap-3 mb-4">
                <img
                  src={selectedItem.image}
                  alt={selectedItem.title}
                  className="w-24 h-24 object-contain rounded"
                />
                <p className="text-gray-600 text-sm text-center">
                  {selectedItem.description}
                </p>
              </div>

              {/* 🔹 Star Rating */}
              <div className="flex justify-center mb-3">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={28}
                    className={`cursor-pointer transition-colors ${
                      (hoverRating || rating) >= star
                        ? "text-yellow-400"
                        : "text-gray-300"
                    }`}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => setRating(star)}
                  />
                ))}
              </div>

              {/* 🔹 Comment Input */}
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Write your review..."
                className="w-full border rounded-lg p-2 text-sm focus:ring-2 focus:ring-orange-500 outline-none resize-none h-24"
              />

              {/* 🔹 Image Upload */}
              <div className="mt-3">
                <label className="flex items-center gap-2 text-sm text-gray-700 font-medium cursor-pointer">
                  <ImagePlus size={18} />
                  Add Photos
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                </label>

                {/* Preview selected images */}
                <div className="flex flex-wrap gap-2 mt-2">
                  {images.map((img, idx) => (
                    <div key={idx} className="relative w-16 h-16">
                      <img
                        src={img}
                        alt={`preview-${idx}`}
                        className="w-full h-full object-cover rounded-md"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(idx)}
                        className="absolute top-0 right-0 bg-black/50 text-white text-xs px-1 rounded"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* 🔹 Action Buttons */}
              <div className="flex justify-end gap-2 mt-5">
                <button
                  onClick={handleCloseReviewModal}
                  className="px-4 py-2 text-sm bg-gray-200 rounded hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmitReview}
                  className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Submit Review
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Table;
