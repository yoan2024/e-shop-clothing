// UserProfileContext.jsx
import React, { useEffect, useState, createContext, useContext } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../firebase/firebase-config";
import { getDoc, doc } from "firebase/firestore";
import { logout } from "../firebase/authService";

// 1. Create the context
const Context = createContext();

// 2. Provider component
const UserProfileProvider = ({ children}) => {
  const [userProfile, setUserProfile] = useState({});

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) return;

      const refUser = doc(db, "users", firebaseUser.uid);
      const getdocref = await getDoc(refUser);

      if (getdocref.exists()) {
        const data = getdocref.data();
        setUserProfile(data);
      } else {
        logout();
        
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <Context.Provider value={{ userProfile, setUserProfile }}>
      {children}
    </Context.Provider>
  );
};

export default UserProfileProvider;

// 3. Custom hook for consuming the context
export const useUserProfile = () => {
  const context = useContext(Context);

  if (!context) {
    throw new Error("useUserProfile must be used within UserProfileProvider.");
  }

  return context;
};
