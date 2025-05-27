import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./page/Home";
import Nav from "./component/Nav";
import Catalogo from "./page/Catalogo";
import ProductDetails from "./page/ProductDetails";
import Footer from "./component/Footer";
import Login from "./page/Login";
import Sign_up from "./page/Sign_up";
import { useLocation } from "react-router-dom";

const Layout = () => {
  const location = useLocation();

  const urls = ["/sign_up", "/login_in"];

  const includesUrls = urls.includes(location.pathname);

  return (
    <>
      {!includesUrls && <Nav />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/catalogo" element={<Catalogo />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/sign_up" element={<Sign_up />} />
        <Route path="/login_in" element={<Login />} />
      </Routes>
      {!includesUrls && <Footer />}
    </>
  );
};

const App = () => {
  return (
    <Router>
      <Layout />
    </Router>
  );
};

export default App;
