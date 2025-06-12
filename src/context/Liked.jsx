import { useContext, createContext, useEffect } from "react";
import { useState } from "react";
import { db } from "../firebase/firebase-config";
import { useUser } from "./User";
import { auth } from "../firebase/firebase-config";
import { getDoc, doc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

const Context = createContext();

const LikedProvider = ({ children }) => {
  const [liked, setLiked] = useState(false);

  return (
    <Context.Provider value={{ liked, setLiked }}>{children}</Context.Provider>
  );
};

export const useLiked = () => {
  const context = useContext(Context);
  if (!context) {
    throw new Error("solo se puede adentro el provider liked");
  }
  return context;
};

export default LikedProvider;
