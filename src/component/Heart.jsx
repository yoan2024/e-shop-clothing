import { useEffect, useState } from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa";

export function FavoriteButton({ id }) {
  const [liked, setLiked] = useState(false);

  useEffect(() => {}, [liked]);
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
