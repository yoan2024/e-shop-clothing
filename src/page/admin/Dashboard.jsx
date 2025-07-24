// Dashboard.tsx
// This component handles the admin dashboard view, including routes and layout for different admin sections.

import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// Components for the admin layout and views
import AsidebarAdmin from "../../componentsAdmin/AsidebarAdmin";
import MainProduct from "../../componentsAdmin/MainProduct";
import MainUsers from "../../componentsAdmin/MainUsers";
import MainPedidos from "../../componentsAdmin/MainPedidos";
import BienvenidaAdmin from "../../componentsAdmin/BienvenidaAdmin";
import Login from "../client/Login";

// Dashboard component for admin
const Dashboard = () => {
  return (
    <>
      {/* Admin layout: sidebar + main content */}
      <div className="w-full flex flex-row justify-end p-2">
        <AsidebarAdmin />
        
        {/* Admin Routes */}
        <Routes>
          {/* Redirect base path to /admin */}
          <Route path="/" element={<Navigate to="/admin" />} />
          
          {/* Admin login */}
          <Route path="/login_in" element={<Login />} />
          
          {/* Admin welcome page */}
          <Route path="/admin" element={<BienvenidaAdmin />} />
          
          {/* Admin product management */}
          <Route path="/admin/productos" element={<MainProduct />} />
          
          {/* Admin order management */}
          <Route path="/admin/pedidos" element={<MainPedidos />} />
          
          {/* Admin user management */}
          <Route path="/admin/usuarios" element={<MainUsers />} />
        </Routes>
      </div>
    </>
  );
};

export default Dashboard;
