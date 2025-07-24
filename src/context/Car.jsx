import { useContext, createContext, useEffect, useState } from "react";
import { db } from "../firebase/firebase-config";
import { auth } from "../firebase/firebase-config";
import { getDoc, doc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

// 1. Create the context for the cart
const Context = createContext();

// 2. Provider component that wraps around the application
const CarProvider = ({ children }) => {
  // Holds the current user's cart items
  const [car, setCar] = useState([]);

  // Fetch the user's cart when auth state changes
  useEffect(() => {
    // Subscribe to Firebase auth changes
    const unSubscribe = onAuthStateChanged(auth, (user) => {
      // Async function to fetch the cart data
      async function fetchUserCart() {
        // If user is not logged in, skip fetching
        if (!user) {
          return null;
        }

        // Fetch cart data from Firestore
        const uid = user.uid;
        const refDoc = doc(db, "Car", uid);
        const document = await getDoc(refDoc);

        if (document.exists()) {
          // If document exists, update the cart state with the items
          const carData = document.data();
          const itemsCars = carData.car;
          setCar(itemsCars);
        } else {
          // If no cart document, set an empty cart
          setCar([]);
        }
      }

      fetchUserCart();
    });

    // Clean up subscription on component unmount
    return () => unSubscribe();
  }, []);

  // Provide the cart state and setter to all children
  return (
    <Context.Provider value={{ car, setCar }}>
      {children}
    </Context.Provider>
  );
};

export default CarProvider;

// 3. Custom hook to use cart context
export function useCar() {
  const contextCar = useContext(Context);

  if (!Context) {
    throw new Error("useCar must be used within a CarProvider");
  }

  return contextCar;
}
