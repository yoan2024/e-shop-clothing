import { createContext, useContext } from "react";
import { useState } from "react";
import { auth } from "../firebase/firebase-config";
import { onAuthStateChanged } from "firebase/auth";
import { getDoc } from "firebase/firestore";
import { useEffect } from "react";
import { doc } from "firebase/firestore";
import { db } from "../firebase/firebase-config";
const Context = createContext();

const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const unSubscribe = onAuthStateChanged(auth, (user) => {
      async function dataUser() {
        if (!user) {
          /*usuario sin iniciar sesión*/
          return null;
        }
        const uid = user.uid;
        const refDoc = doc(db, "favorites", uid);
        const document = await getDoc(refDoc);
        if (document.exists()) {
          const favorites = document.data();
          const itemsFavorites = favorites.favorites;
          setFavorites(itemsFavorites);
        } else {
         
          setFavorites([]);
        }
      }
      dataUser();
    });

    return () => unSubscribe();
  }, []);

  return (
    <Context.Provider value={{ favorites, setFavorites }}>
      {children}
    </Context.Provider>
  );
};

export function useFavorite() {
  const context = useContext(Context);
  if (!context) {
    throw new Error("no se puede usar favorites fuera del provider favorites");
  }
  return context;
}

export default FavoritesProvider;
