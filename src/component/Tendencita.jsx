// External libraries
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ClipLoader from "react-spinners/ClipLoader";

// Context
import { useProducts } from "../context/ContextProducts";

/// Component: Tendenciaa
/// Purpose: Displays a top trending product carousel based on high product ratings
const Tendenciaa = () => {
  const navigate = useNavigate();

  // Global products state from context
  const { products } = useProducts();

  // Local states
  const [topProducts, setTopProducts] = useState([]); // Stores products with rating >= 4.5
  const [img, setImg] = useState(null); // Current image being displayed
  const [currentProduct, setCurrentProduct] = useState([]); // Stores the current selected product

  // Filter top-rated products from the full list
  useEffect(() => {
    async function fetchTopProducts() {
      const productos = await products;
      if (productos?.length > 0) {
        const top = products.filter((p) => p.rating?.rate >= 4.5);
        setTopProducts(top);
      }
    }
    fetchTopProducts();
  }, [products]);

  // Find the product that matches the current image and set it as current
  useEffect(() => {
    if (img && topProducts) {
      const findCurrent = topProducts.find((p) => p.image === img);
      if (findCurrent) {
        setCurrentProduct([findCurrent]);
      }
    }
  }, [img]);

  // When top products are ready, set the first one as current image
  useEffect(() => {
    if (topProducts.length > 0) {
      const img1 = topProducts[0].image;
      setImg(img1);
    }
  }, [topProducts]);

  // Show loading spinner while products are not available
  if (!products) return <ClipLoader color="#36d7b7" size={50} />;

  // Handle clicking the left or right navigation arrows
  const handleOnClick = (direction) => {
    const currentIndex = topProducts.findIndex((p) => p.image === img);
    if (currentIndex === -1) return;

    const newIndex = direction === "izquierda" ? currentIndex - 1 : currentIndex + 1;

    // Prevent going out of bounds
    if (newIndex >= 0 && newIndex < topProducts.length) {
      setImg(topProducts[newIndex].image);
    } else {
      console.log("No more products in that direction");
    }
  };

  // Find current selected product by image
  const current = topProducts.find((p) => p.image === img);

  // Navigate to product detail page
  const handleRouter = (id) => {
    if (!id) return;
    navigate(`/product/${id}`);
  };

  return (
    <div>
      <div className="flex flex-col justify-center items-center">
        <h2>Top Most Popular</h2>

        {/* Image slider container */}
        <div className="flex  flex-row justify-center">
          <div>
            <div
              className="relative cursor-pointer"
              onClick={() => handleRouter(current.id)}
            >
              {/* Product image */}
              <div className="w-96 max-sm:w-72 aspect-square overflow-hidden rounded-xl shadow-md">
                <img src={img} alt="product" className="object-contain w-full h-full"  />
              </div>

              {/* Right arrow */}
              <span
                className="absolute top-1/2 right-0 cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation(); // Prevent triggering navigation
                  handleOnClick("correcta");
                }}
              >
                <img src="/images/flecha-correcta.png" alt="next" className="w-10 h-10" />
              </span>

              {/* Left arrow */}
              <span
                className="absolute top-1/2 cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation(); // Prevent triggering navigation
                  handleOnClick("izquierda");
                }}
              >
                <img src="/images/flecha-izquierda.png" alt="previous" className="w-10 h-10" />
              </span>
            </div>
          </div>
        </div>

        {/* Product details below the image */}
        {currentProduct.map((p) => (
          <ol key={p.id} className="text-center mt-4">
            <li>{p.title}</li>
            <li className="font-bold">$ {p.price}</li>
          </ol>
        ))}
      </div>
    </div>
  );
};

export default Tendenciaa;
