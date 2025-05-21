import React from "react";
import Hero from "../component/Hero";
import Informacion from "../component/Informacion";
import Tendencia from "../component/tendencia";

const Home = () => {
  return (
    <div className="w-full mt-14  min-h-screen bg-blue-400">
      <Hero />
      <Tendencia />
      <Informacion />
    </div>
  );
};

export default Home;
