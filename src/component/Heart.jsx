import { useEffect, useState } from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { getDoc, doc, setDoc } from "firebase/firestore";
import { auth } from "../firebase/firebase-config";
import { db } from "../firebase/firebase-config";
import { useFavorite } from "../context/Favorites";
import { useUser } from "../context/User";

import { useProducts } from "../context/ContextProducts";
export function FavoriteButton({ id, liked, setLiked }) {
  const { favorites, setFavorites } = useFavorite();
  const { products, setProducts } = useProducts();
  const { user, setUser } = useUser();

  useEffect(() => {
    if (!products) return;
  
    async function getfavorites(params) {
      const iduser = user?.uid;
   
      if (iduser) {
        if (liked === true) {
         
          const refdoc = doc(db, "favorites", iduser);
          const getdata = await getDoc(refdoc);
          if (getdata.exists()) {
           
            const data = getdata.data();
            const f = data.favorites;

            const newf = products.filter((P) => P.id === id);
          
            if (newf) {
              const findigual = f.find((p) => p.id === id);
             
              if (!findigual) {
            
                const data = [...f, ...newf];
                setDoc(doc(db, "favorites", iduser), {
                  favorites: data,
                });
                setFavorites(data);
                
              } else {
                
              }
            }
          } else {
            
            const item = products.filter((p) => p.id === id);
            const ref = doc(db, "favorites", iduser);
            setDoc(ref, {
              favorites: item,
            });
            setFavorites(item);
          }
        } else if (liked === false) {
          const refdoc = doc(db, "favorites", iduser);
          const getdata = await getDoc(refdoc);
          if (getdata.exists()) {
            const data = getdata.data();
            const updatedFavorites = data.favorites.filter((p) => p.id !== id);
            await setDoc(refdoc, { favorites: updatedFavorites });
            setFavorites(updatedFavorites);
          }
         
        }
      } else {
        
      }
    }

    getfavorites();
  }, [liked, products]);

  
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
