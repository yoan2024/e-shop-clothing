import { useContext, createContext, useEffect } from "react";
import { useState } from "react";
import { db } from "../firebase/firebase-config";
import { useUser } from "./User";
import { auth } from "../firebase/firebase-config";
import { getDoc, doc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

const Context = createContext();

const CarritoProvider = ({ children }) => {
  const [carrito, setCarrito] = useState([]);

  useEffect(() => {
    const unSubscribe = onAuthStateChanged(auth, (user) => {
      async function dataUser() {
        if (!user) {
          /*usuario sin iniciar sesión*/
          return null;
        }
        const uid = user.uid;
        const refDoc = doc(db, "Carrito", uid);
        const document = await getDoc(refDoc);
        if (document.exists()) {
          const carrito = document.data();
          const itemsCars = carrito.carrito;
          setCarrito(itemsCars);
        } else {
         
          setCarrito([]);
        }
      }
      dataUser();
    });

    return () => unSubscribe();
  }, []);

  return (
    <Context.Provider value={{ carrito, setCarrito }}>
      {children}
    </Context.Provider>
  );
};

export default CarritoProvider;

export function useCarrito() {
  const contextCarrito = useContext(Context);
  if (!Context) {
    throw new Error(" useCarrito solo se puede usar dentro CarritoProvider");
  }

  return contextCarrito;
}
