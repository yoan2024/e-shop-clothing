import { useState } from "react";
import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useProducts } from "../context/ContextProducts";
import ClipLoader from "react-spinners/ClipLoader";

const Tendencia = () => {
  const { products, setProducts } = useProducts();
  const [topProducts, setTopProducts] = useState([]);
  const [img, setImg] = useState(null);
  const [currentProduct, setCurrentProduct] = useState([]);

  useEffect(() => {
    async function name(params) {
      const productos = await products;
      if (productos) {
        if (productos.length > 0) {
          const top = products.filter((p) => p.rating?.rate >= 4.5);
          setTopProducts(top); // ⬅️ guardar los productos con rating 5
        }
      } else {
        console.log("los productos son null");
      }
    }
    name();
  }, [products]);

  useEffect(() => {
    if (img && topProducts) {
      const findCurrent = topProducts.find((p) => p.image === img);
      if (findCurrent) {
        setCurrentProduct([findCurrent]);
      }
    }
  }, [img]);

  useEffect(() => {
    if (topProducts.length > 0) {
      const img1 = topProducts[0].image;
      setImg(img1);
    }
  }, [topProducts]);

  if (!products) return <ClipLoader color="#36d7b7" size={50} />;

  const handleOnClick = (direction) => {
    const currentIndex = topProducts.findIndex((p) => p.image === img);
    if (currentIndex === -1) return;

    let newIndex =
      direction === "izquierda" ? currentIndex - 1 : currentIndex + 1;

    // Validamos que esté dentro de los límites
    if (newIndex >= 0 && newIndex < topProducts.length) {
      setImg(topProducts[newIndex].image);
    } else {
      console.log("No hay más productos en esa dirección");
    }
  };

  return (
    <div>
      <div className="flex flex-col justify-center items-center">
        <h2>Top mas populares</h2>
        <div className="min-w-2/3 flex flex-row justify-center">
          <div>
            <div className=" relative ">
              <div className="flex flex-row justify-center items-center">
                <img src={img} alt="" className="w-96 h-80" />
              </div>
              <span
                className="absolute top-1/2 cursor-pointer right-0"
                onClick={() => handleOnClick("correcta")}
              >
                <img
                  src="/images/flecha-correcta.png"
                  alt=""
                  className=" w-10 h-10"
                />
              </span>
              <span
                className=" cursor-pointer absolute top-1/2"
                onClick={() => handleOnClick("izquierda")}
              >
                <img
                  src="/images/flecha-izquierda.png"
                  alt=""
                  className="  w-10 h-10"
                />
              </span>
            </div>
          </div>
        </div>
        {currentProduct.map((p) => {
          return (
            <ol key={p.id}>
              <li>{p.title}</li>
              <li className="font-bold">$ {p.price} </li>
            </ol>
          );
        })}
      </div>
    </div>
  );
};

export default Tendencia;
