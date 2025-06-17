import AsidebarAdmin from "../../componentsAdmin/AsidebarAdmin";
import MainProduct from "../../componentsAdmin/MainProduct";
import MainUsers from "../../componentsAdmin/MainUsers";
import MainPedidos from "../../componentsAdmin/MainPedidos";
import { Navigate } from "react-router-dom";
import Login from "../client/Login";
import BienvenidaAdmin from "../../componentsAdmin/BienvenidaAdmin";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
const Dashboard = () => {
  return (
    <>
      <div className="w-full flex flex-row justify-end   p-2">
        <AsidebarAdmin />
        <Routes>
          <Route path="/" element={<Navigate to="/admin" />} />
          <Route path="/login_in" element={<Login />} />
          <Route path="/admin" element={<BienvenidaAdmin />} />
          <Route path="/admin/productos" element={<MainProduct />} />
          <Route path="/admin/pedidos" element={<MainPedidos />} />
          <Route path="/admin/usuarios" element={<MainUsers />} />
        </Routes>
      </div>
    </>
  );
};

export default Dashboard;
