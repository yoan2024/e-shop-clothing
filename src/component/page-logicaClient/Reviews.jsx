import { useState, useEffect } from "react";
import { FaStar, FaRegStar, FaEdit, FaTrash } from "react-icons/fa";
import { useUser } from "../../context/User";
import { useUserProfile } from "../../context/userProfileProvider";
import { useImage } from "../../context/Image";

const UserReviews = () => {
  const [reviews, setReviews] = useState([]);
  const {userProfile, setUserProfile} = useUserProfile()
  const {url} = useImage()
  // Example data (you’ll replace it with your Firebase or API data)
  useEffect(() => {
    const fakeReviews = [
      {
        id: "1",
        productTitle: "Leather Jacket",
        productImage: "https://via.placeholder.com/120",
        rating: 5,
        comment: "Amazing quality and fits perfectly!",
        date: "October 18, 2025",
      },
      {
        id: "2",
        productTitle: "White Sneakers",
        productImage: "https://via.placeholder.com/120",
        rating: 4,
        comment: "Nice design, but a bit tight at first.",
        date: "October 10, 2025",
      },
    ];
    setReviews(fakeReviews);
  }, []);

  // Delete review handler
  const handleDelete = (id) => {
    setReviews((prev) => prev.filter((r) => r.id !== id));
  };

  // Render stars dynamically
  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) =>
      i < rating ? (
        <FaStar key={i} className="text-yellow-400" />
      ) : (
        <FaRegStar key={i} className="text-gray-400" />
      )
    );
  };
console.log("fotoo chimba", userProfile.image, "jaja", userProfile.imageDefault)
  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white rounded-2xl shadow-md">
      {/* 🔹 User Info Section */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <img
            src={url}
            alt="User avatar"
            className="w-20 h-20 rounded-full object-cover border"
          />
          <div>
            <h2 className="text-xl font-semibold">{userProfile.name} </h2>
            <p className="text-gray-500 text-sm">
              {reviews.length} total reviews
            </p>
          </div>
        </div>
      </div>

      {/* 🔹 Reviews List */}
      <div className="space-y-6">
        {reviews.map((review) => (
          <div
            key={review.id}
            className="flex items-start gap-4 border rounded-xl p-4 shadow-sm hover:shadow-md transition"
          >
            {/* Product Image */}
            <img
              src={review.productImage}
              alt={review.productTitle}
              className="w-20 h-20 object-cover rounded-lg"
            />

            {/* Review Content */}
            <div className="flex-1">
              <h3 className="font-semibold text-lg">{review.productTitle}</h3>

              {/* Stars */}
              <div className="flex items-center mt-1">
                {renderStars(review.rating)}
              </div>

              {/* Comment */}
              <p className="text-gray-700 mt-2">{review.comment}</p>

              {/* Date */}
              <p className="text-gray-400 text-sm mt-1">{review.date}</p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col items-center gap-3">
              <button className="text-blue-500 hover:text-blue-600">
                <FaEdit />
              </button>
              <button
                onClick={() => handleDelete(review.id)}
                className="text-red-500 hover:text-red-600"
              >
                <FaTrash />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* 🔹 Empty State */}
      {reviews.length === 0 && (
        <p className="text-center text-gray-500 mt-8">
          You haven’t written any reviews yet.
        </p>
      )}
    </div>
  );
};

export default UserReviews;
