import { createContext, useContext, useEffect } from "react";
import { useState } from "react";
import { auth } from "../firebase/firebase-config";
import { db } from "../firebase/firebase-config";
import { onAuthStateChanged } from "firebase/auth";
import { getDoc } from "firebase/firestore";
import { setDoc } from "firebase/firestore";
import { doc } from "firebase/firestore";
const Context = createContext();

const ImageProvider = ({ children }) => {
  const [url, setUrl] = useState(null);

  useEffect(() => {
    const unSubscribe = onAuthStateChanged(auth, (user) => {
      async function dataUser() {
        try {
          if (!user) {
            console.log("user not logueado");
            return null;
          }
          const uid = user.uid;
          const refDoc = doc(db, "usuarios", uid);
          const document = await getDoc(refDoc);
          if (document.exists()) {
            const userdata = document.data();

            const image = userdata.image || userdata.imageDefault;
            setUrl(image);
          } else {
            console.log("no existe un ususario actual");
          }
        } catch (e) {
          console.log("error", e);
        }
      }
      dataUser();
    });

    return () => {
      unSubscribe();
    };
  }, []);

  return (
    <Context.Provider value={{ url, setUrl }}>{children}</Context.Provider>
  );
};

export function useImage() {
  const context = useContext(Context);
  if (!context) {
    throw new Error("no se puede userlo fuera de img provider");
  }

  return context;
}

export default ImageProvider;
