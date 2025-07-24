import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase/firebase-config";

// 1. Create context for image URL
const Context = createContext();

// 2. Provider component for managing user profile image
const ImageProvider = ({ children }) => {
  const [url, setUrl] = useState(null); // State to store image URL

  useEffect(() => {
    // Listen for authentication state changes
    const unSubscribe = onAuthStateChanged(auth, (user) => {
      async function fetchUserImage() {
        try {
          if (!user) {
            // If user is not logged in, do nothing
            return;
          }

          const uid = user.uid;
          const userDocRef = doc(db, "users", uid);
          const userDoc = await getDoc(userDocRef);

          if (userDoc.exists()) {
            const userData = userDoc.data();

            // Use custom uploaded image or fallback to default
            const image = userData.image || userData.imageDefault;
            setUrl(image);
          } else {
            console.warn("User document does not exist.");
          }
        } catch (error) {
          console.error("Error fetching user image:", error);
        }
      }

      fetchUserImage();
    });

    // Cleanup the listener on unmount
    return () => unSubscribe();
  }, []);

  return (
    <Context.Provider value={{ url, setUrl }}>
      {children}
    </Context.Provider>
  );
};

// 3. Custom hook for using the image context
export function useImage() {
  const context = useContext(Context);
  if (!context) {
    throw new Error("useImage must be used within ImageProvider");
  }
  return context;
}

export default ImageProvider;
