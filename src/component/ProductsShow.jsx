/**
 * This component displays categorized product listings:
 * - Men's clothing
 * - Women's clothing
 * - Electronics
 * - Jewelry
 * It filters products from context and shows them in categorized sections.
 */

import { useEffect, useState } from "react";
import { useProducts } from "../context/ContextProducts";
import { useNavigate } from "react-router-dom";


const ProductsShow = () => {
  const navigate = useNavigate();
  const { products, setProducts } = useProducts();

  // State to store categorized product lists
  const [productHombre, setProductsHombre] = useState([]);
  const [productMujer, setProductsMujer] = useState([]);
  const [electronics, setElectronics] = useState([]);
  const [joyeria, setJoyeria] = useState([]);

  // Categorize products when `products` changes
  useEffect(() => {
    async function categorizeProducts() {
      const productos = await products;

      if (productos) {
        const productsMujer = [...productos].filter(
          (p) => p.category === "women's clothing"
        );
        if (productsMujer) setProductsMujer(productsMujer);

        const productsHombre = [...productos].filter(
          (p) => p.category === "men's clothing"
        );
        if (productsHombre) setProductsHombre(productsHombre);

        const electronicos = [...productos].filter(
          (p) => p.category === "electronics"
        );
        if (electronicos) setElectronics(electronicos);

        const jowery = [...productos].filter(
          (p) => p.category === "jewelery"
        );
        if (jowery) setJoyeria(jowery);
      }
    }

    categorizeProducts();
  }, [products]);

  // Navigates to the product detail page
  const handleRouter = (id) => {
    if (!id) return;
    navigate(`/product/${id}`);
  };

  // Render loading state if products are not ready
  if (!productHombre || !productMujer) return <li>Loading...</li>;

  return (
    <div className="w-full flex items-center flex-col mt-28 border-solid border-t-2 border-slate-200">

      {/* Men's Clothing Section */}
      <div className="text-3xl max-sm:text-xl mb-4 self-center">Relevant Men's Products</div>
      <div className="flex flex-wrap justify-center   flex-row items-center lg:gap-2">
        {productHombre.map((p) => (
          <div
            key={p.id}
            className="w-1/2 sm:w-1/3 md:w-1/4 lg:w-1/5 xl:w-1/6 h-64 flex flex-col items-center text-center transition-transform duration-300 transform hover:scale-105 hover:shadow-lg border rounded-xl p-2"
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

      {/* Women's Clothing Section */}
      <div className="text-3xl max-sm:text-xl mb-4  self-center mt-10">Relevant Women's Products</div>
      <div className="flex flex-wrap justify-center  lg:gap-2   flex-row items-center ">
        {productMujer.map((p) => (
          <div
            key={p.id}
            className="w-1/2 sm:w-1/3 md:w-1/4 lg:w-1/5 xl:w-1/6 flex flex-col items-center text-center transition-transform duration-300 transform hover:scale-105 hover:shadow-lg border rounded-xl p-2"
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

      {/* Electronics Section */}
      <div className="text-3xl max-sm:text-xl mb-4 self-center mt-10">Relevant Electronics</div>
      <div className="flex flex-wrap justify-center  lg:gap-2 flex-row items-center ">
        {electronics.map((p) => (
          <div
            key={p.id}
            className="w-1/2 sm:w-1/3 md:w-1/4 lg:w-1/5 xl:w-1/6 flex flex-col items-center text-center transition-transform duration-300 transform hover:scale-105 hover:shadow-lg border rounded-xl p-2"
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

      {/* Jewelry Section */}
      <div className="text-3xl max-sm:text-xl mb-2 self-center mt-10">Relevant Jewelry</div>
      <div className="flex flex-wrap justify-center  lg:gap-2 flex-row items-center ">
        {joyeria.map((p) => (
          <div
            key={p.id}
            className="w-1/2 sm:w-1/3 md:w-1/4 lg:w-1/5 xl:w-1/6 flex flex-col items-center text-center transition-transform duration-300 transform hover:scale-105 hover:shadow-lg border rounded-xl p-2"
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
