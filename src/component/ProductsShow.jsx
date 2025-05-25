import { useEffect, useState } from "react";
import { useProducts } from "../context/ContextProducts";
import { useNavigate } from "react-router-dom"; ///

const ProductsShow = () => {
  const navegate = useNavigate();
  const { products, setProducts } = useProducts();
  const [productHombre, setProductsHombre] = useState([]);
  const [productMujer, setProductsMujer] = useState([]);
  const [electronics, setElectronics] = useState([]);
  const [joyeria, setJoyeria] = useState([]);

  useEffect(() => {
    async function name(params) {
      const productos = await products;
      if (productos) {
        const productsMujer = [...productos].filter(
          (p) => p.category === "women's clothing"
        );
        if (productsMujer) {
          setProductsMujer(productsMujer);
        }
        const productsHombre = [...productos].filter(
          (p) => p.category === "men's clothing"
        );
        if (productsHombre) {
          setProductsHombre(productsHombre);
        }
        const electronicos = [...productos].filter(
          (p) => p.category === "electronics"
        );

        if (electronicos) {
          setElectronics(electronicos);
        }

        const jowery = [...productos].filter((p) => p.category === "jewelery");

        if (jowery) {
          setJoyeria(jowery);
        }
      }
    }

    name();
  }, [products]);

  const handleRouter = (id) => {
    if (!id) return;
    navegate(`/product/${id}`);
  };

  if (!productHombre) return <li>Cargando...</li>;
  if (!productMujer) return <li>Cargando...</li>;

  return (
    <div className="w-full flex items-center flex-col   mt-28 border-solid border-t-2 border-slate-200 ">
      <div className="text-3xl  self-center">
        productos relevantes de hombre
      </div>

      <div className="flex flex-wrap justify-center flex-row items-center gap-5">
        {productHombre.map((p) => (
          <div
            key={p.id}
            className="w-48 h-64 flex flex-col items-center text-center transition-transform duration-300 transform hover:scale-105 hover:shadow-lg border rounded-xl p-2"
            onClick={() => handleRouter(p.id)}
          >
            <div className="bg-white w-full h-40 flex items-center justify-center overflow-hidden rounded-md">
              <img
                src={p.image}
                alt={p.title}
                className="max-h-full max-w-full transition-transform duration-300 transform hover:scale-110"
              />
            </div>
            <div className="mt-2 text-sm font-medium line-clamp-2 h-10">
              {p.title}
            </div>
            <div className="text-lg font-bold">${p.price}</div>
          </div>
        ))}
      </div>

      <div className="text-3xl  self-center mt-10">
        productos relevantes de Mujer
      </div>
      <div className="flex flex-wrap justify-center flex-row items-center gap-5">
        {productMujer.map((p) => (
          <div
            key={p.id}
            className="w-48 h-64 flex flex-col items-center text-center transition-transform duration-300 transform hover:scale-105 hover:shadow-lg border rounded-xl p-2"
            onClick={() => handleRouter(p.id)}
          >
            <div className="bg-white w-full h-40 flex items-center justify-center overflow-hidden rounded-md">
              <img
                src={p.image}
                alt={p.title}
                className="max-h-full max-w-full transition-transform duration-300 transform hover:scale-110"
              />
            </div>
            <div className="mt-2 text-sm font-medium line-clamp-2 h-10">
              {p.title}
            </div>
            <div className="text-lg font-bold">${p.price}</div>
          </div>
        ))}
      </div>
      <div className="text-3xl  self-center mt-10">
        productos relevantes de electronics
      </div>
      <div className="flex flex-wrap justify-center flex-row items-center gap-5">
        {electronics.map((p) => (
          <div
            key={p.id}
            className="w-48 h-64 flex flex-col items-center text-center transition-transform duration-300 transform hover:scale-105 hover:shadow-lg border rounded-xl p-2"
            onClick={() => handleRouter(p.id)}
          >
            <div className="bg-white w-full h-40 flex items-center justify-center overflow-hidden rounded-md">
              <img
                src={p.image}
                alt={p.title}
                className="max-h-full max-w-full transition-transform duration-300 transform hover:scale-110"
              />
            </div>
            <div className="mt-2 text-sm font-medium line-clamp-2 h-10">
              {p.title}
            </div>
            <div className="text-lg font-bold">${p.price}</div>
          </div>
        ))}
      </div>
      <div className="text-3xl  self-center mt-10">
        productos relevantes de jowery
      </div>
      <div className="flex flex-wrap justify-center flex-row items-center gap-5">
        {joyeria.map((p) => (
          <div
            key={p.id}
            className="w-48 h-64 flex flex-col items-center text-center transition-transform duration-300 transform hover:scale-105 hover:shadow-lg border rounded-xl p-2"
            onClick={() => handleRouter(p.id)}
          >
            <div className="bg-white w-full h-40 flex items-center justify-center overflow-hidden rounded-md">
              <img
                src={p.image}
                alt={p.title}
                className="max-h-full max-w-full transition-transform duration-300 transform hover:scale-110"
              />
            </div>
            <div className="mt-2 text-sm font-medium line-clamp-2 h-10">
              {p.title}
            </div>
            <div className="text-lg font-bold">${p.price}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductsShow;
