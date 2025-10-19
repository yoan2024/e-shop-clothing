// --- This component displays a single product card used in catalog or product lists.
// It shows the image, title, price, and star rating. When clicked, it navigates to the product detail page. --- //

import { StarRating } from "./Starts";
import { useNavigate } from "react-router-dom";

const CartProduct = ({ p }) => {
  const navigate = useNavigate();

  // Navigate to the product detail page using its ID
  const handleRouter = (id) => {
    if (!id) return;
    navigate(`/product/${id}`);
  };

  return (
    <div
      className="w-48 h-64   flex flex-col items-center text-center transition-transform duration-300 transform hover:scale-105 hover:shadow-lg border rounded-xl  cursor-pointer"
      onClick={() => handleRouter(p.id)}
    >
      {/* Product image with hover zoom effect */}
      <div className="bg-white w-full h-40 flex items-center justify-center overflow-hidden rounded-md">
        <img
          src={p.image}
          alt={p.title}
          className="max-h-full max-w-full transition-transform duration-300 transform hover:scale-110"
        />
      </div>

      {/* Product title (limited to 2 lines) */}
      <div className="mt-2  font-medium line-clamp-2 h-fit">
        {p.title}
      </div>

      {/* Product price */}
      <div className="text-lg font-bold">${p.price}</div>

      {/* Star rating based on product rating */}
      {<StarRating rating={p.rating.rate} />}
    </div>
  );
};

export default CartProduct;
