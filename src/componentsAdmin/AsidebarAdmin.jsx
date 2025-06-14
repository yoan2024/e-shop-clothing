import { useState } from "react";
import { useNavigate } from "react-router-dom";
const AsidebarAdmin = () => {
  const [hover, seHover] = useState("");
  const navigate = useNavigate();

  const handleclick = (e) => {
    if (e === "productos") {
      navigate("/admin/productos");
      seHover("productos");
    } else if (e === "pedidos") {
      navigate("/admin/pedidos");
      seHover("pedidos");
    } else if (e === "usuarios") {
      navigate("/admin/usuarios");
      seHover("usuarios");
    }
  };

  console.log("current hover", hover);
  return (
    <div className=" p-2 flex flex-col gap-6 min-h-screen  w-1/5 bg-slate-100 rounded-xl  shadow-2xl justify-between">
      <div className="flex flex-col gap-2 mt-4">
        <div
          className={`p-2 ${
            hover === "productos" ? "bg-red-400" : "bg-slate-400"
          } rounded-2xl text-xl`}
          onClick={() => handleclick("productos")}
        >
          PRODUCTOS
        </div>
        <div
          className={`p-2 ${
            hover === "pedidos" ? "bg-red-400" : "bg-slate-400"
          } rounded-2xl text-xl`}
          onClick={() => handleclick("pedidos")}
        >
          PEDIDOS
        </div>
        <div
          className={`p-2 ${
            hover === "usuarios" ? "bg-red-400" : "bg-slate-400"
          } rounded-2xl text-xl`}
          onClick={() => handleclick("usuarios")}
        >
          USUARIOS
        </div>
      </div>
      <div className="mb-5">
        <button className="bg-red-700 p-1 rounded-2xl font-bold">
          Cerrar sesion
        </button>
      </div>
    </div>
  );
};

export default AsidebarAdmin;
