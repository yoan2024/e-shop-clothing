import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { getDoc, doc } from "firebase/firestore";
import { auth, db } from "../firebase/firebase-config";

// 1. Create the context
const Context = createContext();

// 2. Provider component for managing user's favorite products
const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    // Listen to authentication state changes
    const unSubscribe = onAuthStateChanged(auth, (user) => {
      async function fetchUserFavorites() {
        if (!user) {
          // If no user is logged in, clear the favorites
          setFavorites([]);
          return;
        }

        const uid = user.uid;
        const userDocRef = doc(db, "favorites", uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          const data = userDoc.data();
          setFavorites(data.favorites || []);
        } else {
          setFavorites([]);
        }
      }

      fetchUserFavorites();
    });

    // Clean up the subscription when the component unmounts
    return () => unSubscribe();
  }, []);

  return (
    <Context.Provider value={{ favorites, setFavorites }}>
      {children}
    </Context.Provider>
  );
};

// 3. Custom hook to consume favorites context
export function useFavorite() {
  const context = useContext(Context);
  if (!context) {
    throw new Error("useFavorite must be used within FavoritesProvider");
  }
  return context;
}

export default FavoritesProvider;
