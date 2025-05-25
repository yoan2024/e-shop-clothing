import { useState } from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa";

export function FavoriteButton() {
  const [liked, setLiked] = useState(false);

  return (
    <button
      onClick={() => setLiked((prev) => !prev)}
      className="focus:outline-none"
    >
      {liked ? (
        <FaHeart className="text-red-500 text-4xl" />
      ) : (
        <FaRegHeart className="text-gray-400 text-4xl" />
      )}
    </button>
  );
}
