import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { logout } from "../firebase/authService";
import { Bars3Icon } from '@heroicons/react/24/solid';

/**
 * AsidebarAdmin is the vertical sidebar for the admin panel.
 * It allows navigation between the product, order, and user management pages,
 * and also provides a logout button at the bottom.
 */
const AsidebarAdmin = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [hover, setHover] = useState("");
  const [toggle, setTogle] = useState(false)

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

  return (<>
  
    {!toggle ?  <Bars3Icon
          className="h-8 w-8 absolute z-10  top-8 left-4  border-solid border-2  hover:bg-gray-300    cursor-pointer"
          
        onClick={() => setTogle(!toggle)} /> :    
       <div className={`p-2 flex flex-col   bg-slate-100 max-sm:w-screen    justify-between gap-6 h-screen max-h-screen max-w-max   ${toggle ? "" : "max-xl:hidden" } rounded-xl shadow-2xl`} >
      {/* Navigation buttons */}
      <div className="flex flex-col gap-2 mt-4">
        <Bars3Icon
          className="h-8 w-8 mb-2 border-solid border-2  hover:bg-gray-300   text-gray-700 cursor-pointer"
          
        onClick={() => setTogle(!toggle)}/>
        <div
          style={{ cursor: "pointer" }}
          className={`p-2 ${
            hover === "productos" ? "bg-red-400" : "bg-slate-400"
          } rounded-2xl text-xl`}
          onClick={() => handleClick("productos")}
        >
          PRODUCTOS        </div>
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
          className="bg-red-700 cursor-pointer  text-xl rounded-2xl p-2 font-bold text-white"
          onClick={() => {
            logout();
            navigate("/login_in");
          }}
        >
          Log out
        </button>
      </div>
    </div> } 
  </>);
};

export default AsidebarAdmin;




