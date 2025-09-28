// --- Favoritess page:
// --- This component displays all the user's favorite products saved in FireBase --- //

import { useEffect, useState } from "react";
import CartProductFavorite from "../../component/CartProductFavorite";
import { useFavorite } from "../../context/Favorites";

const Favoritess = () => {
  // --- Access favorites from context --- //
  const { favorites, setFavorites } = useFavorite();

  // --- Local state to control what favorites are displayed --- //
  const [displayed, setDisplayed] = useState([]);

  // --- Whenever the favorites list changes, update the displayed list --- //
  useEffect(() => {
    if (!favorites) return;
    setDisplayed(favorites);
  }, [favorites]);


  console.log("favories en ese momento: ", favorites)
  return (
    <div className="w-full mt-20 flex flex-row justify-center min-h-screen p-2">
      <div className="flex flex-col items-center min-w-96 w-4/5">

        {/* --- NO ONE FAVORITES SECTION --- */}
       {favorites.length === 0 && (
  <>
    <div className="flex flex-row justify-between max-sm:flex-col max-sm:justify-start">
      <div className="flex flex-col items-center justify-center py-20 px-4 text-center bg-gray-50 rounded-md shadow-sm">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-16 w-16 text-gray-400 mb-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5.121 17.804A5 5 0 016 6.707l6-6 6 6a5 5 0 010 7.07l-6 6-6-6z"
          />
        </svg>
        <h2 className="text-xl font-semibold text-gray-700 mb-2">You have no favorite products</h2>
        <p className="text-gray-500 mb-4">
          Browse our store and save your favorite items here to view them later.
        </p>
        <a
          href="/"
          className="inline-block px-6 py-2 bg-black text-white text-sm font-medium rounded hover:bg-gray-800 transition"
        >
          Go to Store
        </a>
      </div>

      {/* --- Placeholder for a search input (optional feature) --- */}
    </div>
  </>
)}


        {/* --- List of favorite product cards --- */}
        <div>
          <div className="w-11/12 flex flex-row gap-1 justify-center flex-wrap border-slate-200">
            {favorites.map((p, index) => (
              <div key={index}>
                <CartProductFavorite p={p} />
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Favoritess;
