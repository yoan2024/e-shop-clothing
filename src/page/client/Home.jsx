import Hero from "../../component/Hero";
import Informacion from "../../component/Informacion";
import Tendenciaa from "../../component/Tendencita";
import ProductsShow from "../../component/ProductsShow";

const Home = () => {
  return (
    <div className="w-full mt-14  min-h-screen p-2">
      <Hero />
      <Tendenciaa />
      <ProductsShow />
      <Informacion />
    </div>
  );
};

export default Home;
