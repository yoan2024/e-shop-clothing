// StarRating.jsx

// ==============================
// This component renders star-based ratings.
// It displays full, half, and empty stars based on the `rating` value passed as a prop.
// Example: A rating of 3.5 will show 3 full stars, 1 half star, and 1 empty star.
// ==============================

// ===== Imports =====
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa"; // Star icons from FontAwesome

// ===== Component =====
export function StarRating({ rating }) {
  // Calculate the number of full stars
  const fullStars = Math.floor(rating);

  // Determine if there's a half star
  const halfStar = rating % 1 >= 0.5;

  // Calculate how many empty stars to display (always total of 5)
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

  return (
    <div className="flex  text-yellow-400">
      {/* Render full stars */}
      {[...Array(fullStars)].map((_, i) => (
        <FaStar key={`full-${i}`} />
      ))}

      {/* Render one half star if needed */}
      {halfStar && <FaStarHalfAlt />}

      {/* Render remaining empty stars */}
      {[...Array(emptyStars)].map((_, i) => (
        <FaRegStar key={`empty-${i}`} />
      ))}
    </div>
  );
}
