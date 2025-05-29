import React, { useEffect, useState } from "react";
import { createContext, useContext } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase/firebase-config";

const Contex = createContext();

const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const authchange = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });

    return () => {
      authchange();
    };
  }, []);

  return (
    <Contex.Provider value={{ user, setUser }}>{children}</Contex.Provider>
  );
};

export default UserProvider;

export const useUser = () => {
  const context = useContext(Contex);
  if (!context) {
    throw Error("se puede solo adentro un componente");
  }
  return context;
};
