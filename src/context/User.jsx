import React, { useEffect, useState, createContext, useContext } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase/firebase-config";

// 1. Create context to manage authenticated user data
const Context = createContext();

// 2. Provider component that tracks and shares user state
const UserProvider = ({ children }) => {
  // State to store the currently authenticated user
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Listener to detect authentication state changes
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser); // Updates user state when auth changes
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  return (
    <Context.Provider value={{ user, setUser }}>
      {children}
    </Context.Provider>
  );
};

export default UserProvider;

// 3. Custom hook to access the user context easily
export const useUser = () => {
  const context = useContext(Context);

  // Ensure the hook is only used within the provider
  if (!context) {
    throw new Error(
      "useUser must be used inside a UserProvider component."
    );
  }

  return context;
};
