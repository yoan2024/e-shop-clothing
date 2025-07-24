/**
 * FavoriteButton.jsx
 * 
 * This component renders a heart icon (filled or outlined) that allows users 
 * to add or remove a product from their favorites list. It syncs changes to Firestore
 * and updates the favorites context.
 */

import { useEffect } from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa";

import { getDoc, doc, setDoc } from "firebase/firestore";
import { db } from "../firebase/firebase-config";

import { useFavorite } from "../context/Favorites";
import { useUser } from "../context/User";
import { useProducts } from "../context/ContextProducts";

export function FavoriteButton({ id, liked, setLiked }) {
  const { favorites, setFavorites } = useFavorite();
  const { products } = useProducts();
  const { user } = useUser();

  useEffect(() => {
    if (!products) return;

    async function updateFavorites() {
      const userId = user?.uid;
      if (!userId) return;

      const favoritesRef = doc(db, "favorites", userId);
      const snapshot = await getDoc(favoritesRef);

      if (liked) {
        // If product is liked, add it to Firestore if not already present
        const selectedProduct = products.find((p) => p.id === id);
        if (!selectedProduct) return;

        if (snapshot.exists()) {
          const data = snapshot.data();
          const currentFavorites = data.favorites || [];

          const alreadyExists = currentFavorites.find((p) => p.id === id);
          if (!alreadyExists) {
            const updatedFavorites = [...currentFavorites, selectedProduct];
            await setDoc(favoritesRef, { favorites: updatedFavorites });
            setFavorites(updatedFavorites);
          }
        } else {
          // First time saving a favorite for this user
          await setDoc(favoritesRef, { favorites: [selectedProduct] });
          setFavorites([selectedProduct]);
        }
      } else {
        // If product is unliked, remove it from Firestore
        if (snapshot.exists()) {
          const data = snapshot.data();
          const updatedFavorites = data.favorites.filter((p) => p.id !== id);
          await setDoc(favoritesRef, { favorites: updatedFavorites });
          setFavorites(updatedFavorites);
        }
      }
    }

    updateFavorites();
  }, [liked, products, id, user]);

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
