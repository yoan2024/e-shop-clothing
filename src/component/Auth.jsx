import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase-config";
import { useEffect, useState } from "react";

function App() {
  const [user, setUser] = useState < any > null;

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, []);

  return <div>{user ? `Welcome, ${user.email}` : "You're not logged in"}</div>;
}
