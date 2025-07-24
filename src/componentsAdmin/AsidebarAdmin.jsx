import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { logout } from "../firebase/authService";

/**
 * AsidebarAdmin is the vertical sidebar for the admin panel.
 * It allows navigation between the product, order, and user management pages,
 * and also provides a logout button at the bottom.
 */
const AsidebarAdmin = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [hover, setHover] = useState("");

  /**
   * handleClick is triggered when a section (products, orders, users) is clicked.
   * It navigates to the respective route and updates the current hover state.
   */
  const handleClick = (section) => {
    if (section === "productos") {
      navigate("/admin/productos");
      setHover("productos");
    } else if (section === "pedidos") {
      navigate("/admin/pedidos");
      setHover("pedidos");
    } else if (section === "usuarios") {
      navigate("/admin/usuarios");
      setHover("usuarios");
    }
  };

  /**
   * useEffect is used to highlight the current section based on the route.
   */
  useEffect(() => {
    if (location.pathname === "/admin/productos") {
      setHover("productos");
    } else if (location.pathname === "/admin/pedidos") {
      setHover("pedidos");
    } else if (location.pathname === "/admin/usuarios") {
      setHover("usuarios");
    }
  }, [location]);

  return (
    <div className="p-2 flex flex-col gap-6 h-screen max-h-screen w-1/5 bg-slate-100 rounded-xl shadow-2xl justify-between">
      {/* Navigation buttons */}
      <div className="flex flex-col gap-2 mt-4">
        <div
          style={{ cursor: "pointer" }}
          className={`p-2 ${
            hover === "productos" ? "bg-red-400" : "bg-slate-400"
          } rounded-2xl text-xl`}
          onClick={() => handleClick("productos")}
        >
          PRODUCTOS
        </div>
        <div
          style={{ cursor: "pointer" }}
          className={`p-2 ${
            hover === "pedidos" ? "bg-red-400" : "bg-slate-400"
          } rounded-2xl text-xl`}
          onClick={() => handleClick("pedidos")}
        >
          PEDIDOS
        </div>
        <div
          style={{ cursor: "pointer" }}
          className={`p-2 ${
            hover === "usuarios" ? "bg-red-400" : "bg-slate-400"
          } rounded-2xl text-xl`}
          onClick={() => handleClick("usuarios")}
        >
          USUARIOS
        </div>
      </div>

      {/* Logout button */}
      <div className="mb-5">
        <button
          className="bg-red-700 p-1 rounded-2xl font-bold text-white"
          onClick={() => {
            logout();
            navigate("/login_in");
          }}
        >
          Log out
        </button>
      </div>
    </div>
  );
};

export default AsidebarAdmin;
