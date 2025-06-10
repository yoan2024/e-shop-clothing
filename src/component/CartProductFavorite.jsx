import { StarRating } from "./Starts";
import { useNavigate } from "react-router-dom";

const CartProductFavorite = ({ p }) => {
  const navegate = useNavigate();
  const handleRouter = (id) => {
    if (!id) return;
    navegate(`/product/${id}`);
  };
  return (
    <div
      className="w-48 h-80 flex flex-col items-center text-center transition-transform duration-300 transform hover:scale-105 hover:shadow-lg border rounded-xl p-2 cursor-pointer"
      onClick={() => handleRouter(p.id)}
    >
      <div className="bg-white w-full h-40 flex items-center justify-center overflow-hidden rounded-md">
        <img
          src={p.image}
          alt={p.title}
          className="max-h-full max-w-full transition-transform duration-300 transform hover:scale-110"
        />
      </div>
      <div className="mt-2 text-sm font-medium line-clamp-2 h-10">
        {p.title}
      </div>
      <div className="text-lg  font-bold">${p.price}</div>
      {<StarRating rating={p.rating.rate} />}
      <div className="flex flex-row justify-around mt-3 w-full">
        <div>corazon</div>
        <button className="px-4 py-1 bg-orange-400 rounded-2xl">Buy</button>
      </div>
    </div>
  );
};

export default CartProductFavorite;
