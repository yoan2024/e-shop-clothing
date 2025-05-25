import { useEffect, useState } from "react";
import Asidebar from "../component/Asidebar";
import { useProducts } from "../context/ContextProducts";
import ClipLoader from "react-spinners/ClipLoader";
import CartProduct from "../component/CartProduct";

const Catalogo = () => {
  const { products, setProduts } = useProducts();
  const [filterProducts, setFilterProducts] = useState([]);

  useEffect(() => {
    if (!products) return;
    if (products) {
      setFilterProducts(products);
    }
  }, [products]);
  console.log(filterProducts);
  return (
    <div className="w-full flex flex-row justify-end mt-14  p-2">
      <Asidebar
        filterProducts={filterProducts}
        setFilterProducts={setFilterProducts}
      />
      {!products && (
        <>
          <div className="min-h-screen flex flex-row w-5/6  justify-center items-center">
            <ClipLoader />
          </div>
        </>
      )}
      <div className="w-11/12 flex flex-row gap-1 justify-center flex-wrap border-solid border-t-2 border-slate-200">
        {products &&
          filterProducts.map((p, index) => {
            return (
              <>
                <div key={index}>
                  <CartProduct p={p} />
                </div>
              </>
            );
          })}
      </div>
    </div>
  );
};

export default Catalogo;
