// --- Catalog page: 
// --- This component displays a product catalog based on the selected category.
// It shows a sidebar for filtering and a grid of product cards.
// It uses context to access all products and displays a loading spinner while data is loading. --- //

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ClipLoader from "react-spinners/ClipLoader";

import Asidebar from "../../component/Asidebar";
import CartProduct from "../../component/CartProduct";
import { useProducts } from "../../context/ContextProducts";

const Catalog = () => {
  const { category } = useParams(); // Get the current category from the URL
  const [categ, setCateg] = useState(category); // Local state for category
  const { products, setProduts } = useProducts(); // Context for all available products
  const [filterProducts, setFilterProducts] = useState([]); // Filtered products to display

  // Update local category whenever the route param changes
  useEffect(() => {
    setCateg(category);
  }, [category]);

  // Sync the products to the filtered list whenever the context updates
  useEffect(() => {
    if (products) {
      setFilterProducts(products);
    }
  }, [products]);

 

  return (
    <div className="w-full flex flex-row justify-end mt-14 p-2">
      {/* Sidebar component for filtering by category or other options */}
      <Asidebar
        categ={categ}
        filterProducts={filterProducts}
        setFilterProducts={setFilterProducts}
      />

      {/* Show loading spinner if products are still loading */}
      {!products && (
        <div className="min-h-screen flex flex-row w-5/6 justify-center items-center">
          <ClipLoader />
        </div>
      )}

      {/* Product cards grid */}
      <div className="w-11/12 flex flex-row gap-1 justify-center flex-wrap border-solid border-t-2 border-slate-200">
        {products &&
          filterProducts.map((p, index) => (
            <div id={p.id} key={index}>
              <CartProduct p={p} />
            </div>
          ))}
      </div>
    </div>
  );
};

export default Catalog;
