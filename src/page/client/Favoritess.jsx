import { useEffect, useState } from "react";
import CartProductFavorite from "../../component/CartProductFavorite";
import { useFavorite } from "../../context/Favorites";

const Favoritess = () => {
  const { favorites, setFavorites } = useFavorite();
  const [displayed, setDisplayed] = useState([]);

  useEffect(() => {
    if (!favorites) return null;
    if (favorites) {
      setDisplayed(favorites);
    }
  }, [favorites]);

  return (
    <div className="w-full mt-20 flex flex-row  justify-center min-h-screen p-2 ">
      <div className="flex flex-col  items-center min-w-96 w-4/5 ">
        <div className="flex flex-row justify-between   max-sm:flex-col max-sm:justify-start">
          <div>
            <div>Favorites</div>
            <div>Find your saved item and get ready to order them</div>
          </div>
          <div>Search favorites input</div>
        </div>
        <div>
          <div className="w-11/12 flex flex-row gap-1 justify-center flex-wrap  border-slate-200">
            {favorites.map((p, index) => {
              return (
                <div key={index}>
                  <CartProductFavorite p={p} />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Favoritess;
