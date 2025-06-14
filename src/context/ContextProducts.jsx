import { createContext, useContext, useEffect, useState } from "react";
import { getDoc, setDoc } from "firebase/firestore";
import { doc } from "firebase/firestore";
import { db } from "../firebase/firebase-config";
const Context = createContext();

const UserProviderProductos = ({ children }) => {
  const [products, setProducts] = useState();

  useEffect(() => {
    async function usarFecht() {
      const refproducts = doc(db, "productos", "productos1088272651");
      const getproducts = await getDoc(refproducts);
      if (getproducts.exists()) {
        const produ = getproducts.data();
        console.log("jajaja", produ);
        const p = produ.productos;
        setProducts(p);
        console.log("curent prodtc hay", p);
        console.log("entra varias veces");
      } else {
        let productos;
        const data = await fetch("https://fakestoreapi.com/products")
          .then((response) => response.json())
          .then((data) => {
            productos = data;
            setProducts(data);
          });

        setDoc(refproducts, {
          productos: productos,
        });
        console.log("solo entro una ves");
      }
    }

    usarFecht();
  }, []);

  return (
    <Context.Provider value={{ products, setProducts }}>
      {children}
    </Context.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(Context);
  if (!context) {
    throw new Error("no se puede usar el useProducts fuera del provider");
  }
  return context;
};

export default UserProviderProductos;
