
// React imports
import { useEffect, useState } from "react";
// UI imports
import { useProducts } from "../context/ContextProducts";
import { Bars3Icon } from '@heroicons/react/24/solid';

const Asidebar = ({ setFilterProducts, categ }) => {

// States
  const { products } = useProducts();
  const [category, setCategory] = useState("all");
  const [filterPrice, setFilterPrice] = useState("all");
  const [filterRating, setFilterRating] = useState("all");
  const [toggle, setToggle] = useState(false)

  useEffect(() => {
    /**
 * Filters the list of products by selected category, price, and rating.
 * Updates the state with the filtered products.
 */
    function filterProducts() {
      let filtered = [...products];

      // Apply category filter only if a specific category is selected
      if (category !== "all") {
        const categoryMap = {
          men: "men's clothing",
          women: "women's clothing",
          jewelery: "jewelery",
          electronics: "electronics"
        };
        filtered = filtered.filter((p) => p.category === categoryMap[category]);
      }

      // Price filter
      if (filterPrice !== "all") {
        if (filterPrice === "under-50") {
          filtered = filtered.filter((p) => p.price < 50);
        } else if (filterPrice === "50-200") {
          filtered = filtered.filter((p) => p.price >= 50 && p.price < 200);
        } else if (filterPrice === "200-500") {
          filtered = filtered.filter((p) => p.price >= 200 && p.price < 500);
        } else if (filterPrice === "500+") {
          filtered = filtered.filter((p) => p.price >= 500);
        }
      }

      // Rating filter
      if (filterRating !== "all") {
        const ratingValue = parseFloat(filterRating);
        filtered = filtered.filter((p) => p.rating.rate >= ratingValue);
      }

      setFilterProducts(filtered);
    }
    // Run filter only when products are loaded
    if (products && products.length > 0) {
      filterProducts();
    }
  }, [category, filterPrice, products, filterRating]);

  useEffect(() => {
    setCategory(categ);
  }, [categ]);

  return (
    <>{toggle ?    <Bars3Icon
          className="h-8 w-8 z-10 absolute  left-0  border-solid border-2 border-black hover:bg-gray-300    cursor-pointer"
          
        onClick={() => setToggle(!toggle)} /> : 
         <div className="p-2 flex flex-col gap-6 w-fit h-fit max-sm:w-auto bg-slate-100 rounded-xl shadow-2xl">
       <Bars3Icon
          className="h-8 w-8    border-solid border-2  hover:bg-gray-300    cursor-pointer"
          
        onClick={() => setToggle(!toggle)} />
      {/* Category Filter */}
      <div>
        <div className="text-xl font-semibold">Category</div>
        {[
          { id: "men", label: "Men" },
          { id: "women", label: "Woman" },
          { id: "jewelery", label: "Jewelery" },
          { id: "electronics", label: "Electronics" },
        ].map(({ id, label }) => (
          <div key={id} className="flex flex-row gap-1 items-center">
            <label htmlFor={id} className="text-xl font-light">
              {label}
            </label>
            <input
              type="radio"
              name="category"
              id={id}
              checked={category === id}
              onChange={() => setCategory(id)}
            />
          </div>
        ))}
      </div>

      {/* Price Filter */}
      <div>
        <div className="text-xl font-semibold">Price Range</div>
        {[
          { id: "under-50", label: "Under $50" },
          { id: "50-200", label: "$50 - $200" },
          { id: "200-500", label: "$200 - $500" },
          { id: "500+", label: "$500+" },
        ].map(({ id, label }) => (
          <div key={id}>
            <label htmlFor={id} className="text-xl font-light">
              {label}
            </label>
            <input
              type="radio"
              name="price"
              id={id}
              className="ml-1"
              checked={filterPrice === id}
              onChange={() => setFilterPrice(id)}
            />
          </div>
        ))}
      </div>

      {/* Rating Filter */}
      <div>
        <div className="text-xl font-semibold">Rating</div>
        {[
          { id: "4.5+", label: "⭐ 4.5+" },
          { id: "4+", label: "⭐ 4+" },
          { id: "3+", label: "⭐ 3+" },
          { id: "all", label: "All ratings" },
        ].map(({ id, label }) => (
          <div key={id}>
            <label htmlFor={id} className="text-xl font-light">
              {label}
            </label>
            <input
              type="radio"
              name="rating"
              id={id}
              className="ml-1"
              checked={filterRating === id}
              onChange={() => setFilterRating(id)}
            />
          </div>
        ))}
      </div>
    </div>}
   
    </>
  );
};

export default Asidebar;
