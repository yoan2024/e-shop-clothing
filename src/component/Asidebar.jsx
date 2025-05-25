import { useEffect, useState } from "react";
import { useProducts } from "../context/ContextProducts";

const Asidebar = ({ setFilterProducts, filterProducts }) => {
  const { products, setProducts } = useProducts();
  const [category, setCategory] = useState("all");
  const [filterPrice, setFilterPrice] = useState("all");
  const [filterRating, setFilterRating] = useState("all");
  useEffect(() => {
    function filtrarProductosYPrecioYRanting() {
      let filtered = [...products];

      // Category filter
      if (category !== "all") {
        if (category === "men") {
          filtered = filtered.filter((p) => p.category === "men's clothing");
        } else if (category === "women") {
          filtered = filtered.filter((p) => p.category === "women's clothing");
        } else if (category === "jewelery") {
          filtered = filtered.filter((p) => p.category === "jewelery");
        } else if (category === "electronics") {
          filtered = filtered.filter((p) => p.category === "electronics");
        }
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

      if (filterRating !== "all") {
        if (filterRating === "3+") {
          filtered = filtered.filter((p) => p.rating.rate >= 3);
        } else if (filterRating === "4.5+") {
          filtered = filtered.filter((p) => p.rating.rate >= 4.5);
        } else if (filterRating === "4+") {
          filtered = filtered.filter((p) => p.rating.rate >= 4);
        }
      }

      setFilterProducts(filtered);
    }

    if (products && products.length > 0) {
      filtrarProductosYPrecioYRanting();
    }
  }, [category, filterPrice, products, filterRating]);

  return (
    <div className=" p-2 flex flex-col gap-6  w-1/6 bg-slate-100 rounded-xl  shadow-2xl">
      <div>
        <div className="text-xl font-semibold">Gender / Target audience</div>
        <div className="flex flex-row gap-1 items-center">
          <label htmlFor="men" className="text-xl font-light">
            Men
          </label>
          <input
            type="checkbox"
            id="men"
            checked={category === "men"}
            onChange={() => setCategory("men")}
          />
        </div>
        <div className="flex flex-row gap-1 items-center">
          <label htmlFor="women" className="text-xl font-light">
            Woman
          </label>
          <input
            type="checkbox"
            id="women"
            checked={category === "women"}
            onChange={() => setCategory("women")}
          />
        </div>
      </div>
      <div>
        <div className="text-xl font-semibold">Jewery</div>
        <div className="flex flex-row gap-1 items-center">
          <label htmlFor="jewelery" className="text-xl font-light">
            Jewelery
          </label>
          <input
            type="checkbox"
            id="jewelery"
            checked={category === "jewelery"}
            onChange={() => setCategory("jewelery")}
          />
        </div>
      </div>
      <div>
        <div className="text-xl font-semibold">Electronics</div>
        <div className="flex flex-row gap-1 items-center">
          <label htmlFor="electronics" className="text-xl font-light">
            Electronics
          </label>
          <input
            type="checkbox"
            id="electronics"
            checked={category === "electronics"}
            onChange={() => setCategory("electronics")}
          />
        </div>
      </div>
      <div>
        <div className="text-xl font-semibold">Price Range Slider</div>
        <div>
          <div>
            <label htmlFor="under50" className="text-xl  font-light">
              Under $50
            </label>
            <input
              type="radio"
              id="under50"
              className="ml-1"
              checked={filterPrice === "under-50"}
              onChange={() => setFilterPrice("under-50")}
            />
          </div>
          <div>
            <label htmlFor="50-200" className="text-xl font-light">
              $50-$200
            </label>
            <input
              type="radio"
              id="50-200"
              checked={filterPrice === "50-200"}
              className="ml-1"
              onChange={() => setFilterPrice("50-200")}
            />
          </div>
          <div>
            <label htmlFor="200-500" className="text-xl font-light">
              $200-$500
            </label>
            <input
              type="radio"
              checked={filterPrice === "200-500"}
              id="200-500"
              className="ml-1"
              onChange={() => setFilterPrice("200-500")}
            />
          </div>
          <div>
            <label htmlFor="500+" className="text-xl font-light">
              500+
            </label>
            <input
              type="radio"
              checked={filterPrice === "500+"}
              id="500+"
              className="ml-1"
              onChange={() => setFilterPrice("500+")}
            />
          </div>
        </div>
      </div>
      <div>
        <div className="text-xl font-semibold">Rating Filter</div>
        <div>
          <div>
            <label htmlFor="4.5+" className="text-xl  font-light">
              ⭐ 4.5+
            </label>
            <input
              type="radio"
              id="4.5+"
              checked={filterRating === "4.5+"}
              className="ml-1"
              onChange={() => setFilterRating("4.5+")}
            />
          </div>
          <div>
            <label htmlFor="4+" className="text-xl font-light">
              ⭐ 4+
            </label>
            <input
              type="radio"
              id="4+"
              className="ml-1"
              checked={filterRating === "4+"}
              onChange={() => setFilterRating("4+")}
            />
          </div>
          <div>
            <label htmlFor="3+" className="text-xl font-light">
              ⭐ 3+
            </label>
            <input
              type="radio"
              id="3+"
              className="ml-1"
              checked={filterRating === "3+"}
              onChange={() => setFilterRating("3+")}
            />
          </div>
          <div>
            <label htmlFor="all" className="text-xl font-light">
              All ratings
            </label>
            <input
              type="radio"
              id="all"
              className="ml-1"
              checked={filterRating === "all"}
              onChange={() => setFilterRating("all")}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Asidebar;
