import { useContext, createContext, useEffect } from "react";
import { useState } from "react";
import { db } from "../firebase/firebase-config";
import { useUser } from "./User";
import { auth } from "../firebase/firebase-config";
import { getDoc, doc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

const Context = createContext();

const CarProvider = ({ children }) => {
  const [car, setCar] = useState([]);

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
          setCar(itemsCars);
        } else {
         
          setCar([]);
        }
      }
      dataUser();
    });

    return () => unSubscribe();
  }, []);

  return (
    <Context.Provider value={{ car, setCar }}>
      {children}
    </Context.Provider>
  );
};

export default CarProvider;

export function useCar() {
  const contextCar = useContext(Context);
  if (!Context) {
    throw new Error(" useCar can only be used within CarProvider");
  }

  return contextCar;
}
