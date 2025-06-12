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
    console.log("entro en el usefects");
    async function getfavorites(params) {
      const iduser = user.uid;
      console.log("current liked inuseefect", liked);
      if (iduser) {
        if (liked === true) {
          console.log("entro el likes true");
          const refdoc = doc(db, "favorites", iduser);
          const getdata = await getDoc(refdoc);
          if (getdata.exists()) {
            console.log("existe el doc");
            const data = getdata.data();
            const f = data.favorites;

            const newf = products.filter((P) => P.id === id);
            console.log("newf es ", newf);
            if (newf) {
              const findigual = f.find((p) => p.id === id);
              console.log(
                "el item esssssssssssssssssssssssssssssssssss en hear.jsx",
                findigual
              );
              if (!findigual) {
                console.log("se filtraron newf correctamente ", newf);
                console.log("se incontro el refproduct", newf);
                const data = [...f, ...newf];
                setDoc(doc(db, "favorites", iduser), {
                  favorites: data,
                });
                setFavorites(data);
                console.log("liked justo antes de agregar el item", liked);
                console.log("agrego item al firestorage");
              } else {
                console.log(
                  "el producto no se agrego por q ya esta en favorites"
                );
              }
            }
          } else {
            console.log("entro en no existe doc");
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
          console.log("product eliminado correctamente");
        }
      } else {
        console.log("nose pudo incontrar un user logeado");
      }
    }

    getfavorites();
  }, [liked, products]);

  console.log("current values liked", liked);
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
