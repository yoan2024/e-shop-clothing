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

  return (
    <div className="w-full mt-20 flex flex-row justify-center min-h-screen p-2">
      <div className="flex flex-col items-center min-w-96 w-4/5">

        {/* --- Header section with title and description --- */}
        <div className="flex flex-row justify-between max-sm:flex-col max-sm:justify-start">
          <div>
            <div>Favorites</div>
            <div>Find your saved items and get ready to order them</div>
          </div>

          {/* --- Placeholder for a search input (optional feature) --- */}
          <div>Search favorites input</div>
        </div>

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
