import { BrowserRouter as Router } from "react-router-dom";
import { db } from "../firebase/firebase-config";
import { doc, getDoc } from "firebase/firestore";
import LayoutClient from "../component/LayoutClient";
import LayoutAdmin from "../componentsAdmin/LayoutAdmin";
import { useEffect, useState } from "react";
import { useUser } from "../context/User";
const AppwithRoutes = () => {
  const { user, setUser } = useUser();
  const [rol, setRol] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getRol() {
      if (user) {
        console.log("entroooooooooooo");
        try {
          const refuser = doc(db, "usuarios", user.uid);
          const getdocuser = await getDoc(refuser);
          const docuser = getdocuser.data();
          const userdata = docuser;

          if (userdata && userdata.rol) {
            setRol(userdata.rol);
          } else {
            setRol("cliente"); // fallback por si falta rol
          }
        } catch (err) {
          console.error("Error obteniendo el rol:", err);
          setRol("cliente"); // fallback por error
        }
      } else {
        setRol("cliente"); // usuario no logueado
      }

      setLoading(false);
    }

    const timer = setTimeout(getRol, 300);
    return () => clearTimeout(timer);
  }, [user]);

  if (loading) {
    return (
      <div className="w-screen h-screen flex items-center justify-center">
        <span className="text-xl">Cargando...</span>
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
