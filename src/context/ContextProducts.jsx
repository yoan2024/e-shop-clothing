import { createContext, useContext, useEffect, useState } from "react";
import { getDoc, setDoc, doc } from "firebase/firestore";
import { db } from "../firebase/firebase-config";

// 1. Create the context
const Context = createContext();

// 2. Provider to supply products to the entire application
const UserProviderProductos = ({ children }) => {
  const [products, setProducts] = useState();

  useEffect(() => {
    // Fetch product data from Firestore or fallback to FakeStoreAPI
    async function fetchProducts() {
      const ref = doc(db, "products", "products1088272651");
      const snapshot = await getDoc(ref);

      if (snapshot.exists()) {
        // If products already exist in Firestore, use them
        const firestoreData = snapshot.data();
        setProducts(firestoreData.products);
      } else {
        // Otherwise, fetch from FakeStoreAPI
        try {
          const response = await fetch("https://fakestoreapi.com/products");
          const apiProducts = await response.json();

          // Save fetched products in state and Firestore
          setProducts(apiProducts);
          await setDoc(ref, { products: apiProducts });
        } catch (error) {
          console.error("Failed to fetch products:", error);
        }
      }
    }

    fetchProducts();
  }, []);

  return (
    <Context.Provider value={{ products, setProducts }}>
      {children}
    </Context.Provider>
  );
};

// 3. Custom hook to consume the products context
export const useProducts = () => {
  const context = useContext(Context);
  if (!context) {
    throw new Error("useProducts must be used within a UserProviderProductos");
  }
  return context;
};

export default UserProviderProductos;
