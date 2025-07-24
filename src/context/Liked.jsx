import { createContext, useContext, useEffect, useState } from "react";
import { db } from "../firebase/firebase-config";
import { auth } from "../firebase/firebase-config";
import { onAuthStateChanged } from "firebase/auth";
import { getDoc, doc } from "firebase/firestore";

// 1. Create context for managing "liked" state
const Context = createContext();

// 2. Provider component for sharing the "liked" state across the app
const LikedProvider = ({ children }) => {
  const [liked, setLiked] = useState(false); // Initial state for liked item

  return (
    <Context.Provider value={{ liked, setLiked }}>
      {children}
    </Context.Provider>
  );
};

// 3. Custom hook to consume the liked context
export const useLiked = () => {
  const context = useContext(Context);

  if (!context) {
    throw new Error("useLiked must be used within a LikedProvider");
  }

  return context;
};

export default LikedProvider;
