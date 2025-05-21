import React, { useState } from "react";
import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";

const Tendencia = () => {
  const [products, setProducts] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [img, setImg] = useState("");
  useEffect(() => {
    async function usarFecht() {
      const data = await fetch("https://fakestoreapi.com/products")
        .then((response) => response.json())
        .then((data) => {
          setProducts(data);
          console.log(data);
        });
    }

    usarFecht();
  }, []);

  if (!products) return <li>Cargando...</li>;

  useEffect(() => {
    if (products.length > 0) {
      const top = products.filter((p) => p.rating?.rate >= 4.5);
      setTopProducts(top); // ⬅️ guardar los productos con rating 5
      console.log("top populares", top);
    }
  }, [products]);

  useEffect(() => {
    if (topProducts.length > 0) {
      const img1 = topProducts[0].image;
      setImg(img1);
    }
  }, [topProducts]);
  console.log(topProducts);
  console.log(img);

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

  console.log("top productos", topProducts);

  return (
    <div>
      <div className="flex flex-col justify-center items-center">
        <h2>Top mas populares</h2>
        <div className="min-w-2/3 flex flex-row justify-center">
          <div>
            <div className=" relative w-96 h-80">
              <img src={img} alt="" className="w-full h-full " />
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
      </div>
      {products.map((p, index) => {
        return (
          <ol key={index}>
            <li>{p.title}</li>
            <li>{p.price} </li>
            <li>{p.category}</li>
            <li>
              <img src={p.image} alt="" className="w-10 h-10" />{" "}
            </li>
          </ol>
        );
      })}
    </div>
  );
};

export default Tendencia;
