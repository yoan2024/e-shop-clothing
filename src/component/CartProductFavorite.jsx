// --- This component displays a product card for a user's favorite item.
// It shows product image, title, price, rating, and includes a "like" icon and a "Buy" button. --- //

import { StarRating } from "./Starts";
import { useNavigate } from "react-router-dom";
import { useLiked } from "../context/Liked";

const CartProductFavorite = ({ p }) => {
  const { liked, setLiked } = useLiked();
  const navigate = useNavigate();

  // Navigate to product detail page
  const handleRouter = (id) => {
    if (!id) return;
    navigate(`/product/${id}`);
  };

  return (
    <div
      className="w-48 h-80 flex flex-col items-center text-center transition-transform duration-300 transform hover:scale-105 hover:shadow-lg border rounded-xl p-2 cursor-pointer"
      onClick={() => handleRouter(p.id)}
    >
      {/* Product image */}
      <div className="bg-white w-full h-40 flex items-center justify-center overflow-hidden rounded-md">
        <img
          src={p.image}
          alt={p.title}
          className="max-h-full max-w-full transition-transform duration-300 transform hover:scale-110"
        />
      </div>

      {/* Product title */}
      <div className="mt-2 text-sm font-medium line-clamp-2 h-10">
        {p.title}
      </div>

      {/* Product price */}
      <div className="text-lg font-bold">${p.price}</div>

      {/* Star rating */}
      <StarRating rating={p.rating.rate} />

      {/* Like icon + Buy button */}
      <div className="flex flex-row justify-around mt-3 w-full">
        {/* Placeholder for like icon */}
        <div>❤️</div>

        {/* Buy button */}
        <button className="px-4 py-1 bg-orange-400 rounded-2xl text-white hover:bg-orange-500 transition">
          Buy
        </button>
      </div>
    </div>
  );
};

export default CartProductFavorite;
