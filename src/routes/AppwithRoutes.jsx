import { BrowserRouter as Router } from "react-router-dom";
import { db } from "../firebase/firebase-config";
import { doc, getDoc } from "firebase/firestore";
import LayoutClient from "../component/LayoutClient";
import LayoutAdmin from "../componentsAdmin/LayoutAdmin";
import { useEffect, useState } from "react";
import { useUser } from "../context/User";

/**
 * AppwithRoutes is the main wrapper that determines which layout
 * to render based on the user's role (admin or client).
 */
const AppwithRoutes = () => {
  const { user } = useUser();
  const [rol, setRol] = useState(null);
  const [loading, setLoading] = useState(true);

  /**
   * Fetches the user's role from Firestore.
   * Sets fallback role as "cliente" in case of missing role or any error.
   */
  useEffect(() => {
    async function getRol() {
      if (user) {
        try {
          const refUser = doc(db, "users", user.uid);
          const getDocUser = await getDoc(refUser);
          const userData = getDocUser.data();

          if (userData && userData.rol) {
            setRol(userData.rol);
          } else {
            setRol("client"); // fallback in case role is missing
          }
        } catch (err) {
          setRol("client"); // fallback in case of error
        }
      } else {
        setRol("client"); // fallback for non-logged-in user
      }

      setLoading(false);
    }

    // Slight delay before role fetching to ensure auth context is ready
    const timer = setTimeout(getRol, 300);
    return () => clearTimeout(timer);
  }, [user]);

  // Loading screen while fetching user role
  if (loading) {
    return (
      <div className="w-screen h-screen flex items-center justify-center">
        <span className="text-xl">Loading...</span>
      </div>
    );
  }

  return (
    <Router>
      {rol === "admin" ? <LayoutAdmin rol={rol} /> : <LayoutClient />}
    </Router>
  );
};

export default AppwithRoutes;
