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

 
console.log("productos fil", filterProducts,  products)
  return (
    <div className="w-full relative  flex   flex-row   mt-14 p-2">
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

      {filterProducts.length === 0 && <div class="flex min-w-full justify-center items-center   bg-gray-100 text-center text-gray-700 p-6 rounded-lg shadow-md">
        <div>
         <h2 class="text-xl font-semibold mb-2">No Products Found</h2>
         <p class="text-sm">Sorry, we couldn't find any products matching your filter. Please try again with different criteria.</p>
        </div>
        </div>}

      {/* Product cards grid */}
      <div className="flex     flex-row gap-1 h-fit justify-center  flex-wrap border-solid border-t-2 border-slate-200">
        {products &&
          filterProducts.map((p, index) => (
            <div id={p.id} key={index} >
              <CartProduct p={p} />
            </div>
          ))}
          
      </div>
    </div>
  );
};

export default Catalog;
