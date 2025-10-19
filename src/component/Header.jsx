/**
 * Header Component
 *
 * Displays the top section of the website with:
 * - Brand logo (navigates to home)
 * - Promotional banner
 * - Search bar with live suggestions
 * - Keyboard navigation (arrow keys, enter)
 * - Mouse hover support on suggestions
 * - Click outside detection to hide suggestions
 * - Navigation to product pages on selection
 * - Conditionally renders Nav component (hidden on /sign_up and /login_in routes)
 */

import React, { useEffect, useState, useRef } from "react";
import { useUser } from "../context/User";
import { useLocation, useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import { useProducts } from "../context/ContextProducts";
import Nav from "./Nav";

const Header = ({ toggle, setToggle}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useUser();
  const { products } = useProducts();

  // References and state
  const wrapperRef = useRef(null);
  const [sugerenciasVisibles, setSugerenciasVisibles] = useState(true);
  const [inputValue, setInputValue] = useState("");
  const [search, setSearch] = useState("");
  const [suplentSearch, setSuplentSearch] = useState("");
  const [suggest, setSuggest] = useState([]);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [mouseEnter, setMouseEnter] = useState(false);

  // Paths where the Nav component should NOT appear
  const urls = ["/sign_up", "/login_in"];
  const includesUrls = urls.includes(location.pathname);

  /**
   * Filters products based on user input and updates suggestions.
   * Debounced by 1 second.
   */
  useEffect(() => {
    const listening = setTimeout(() => {
      if (!products) return;

      const currentProducts = [...products];
      if (search.trim() && search.length > 0) {
        let filterProducts;

        // Match by starting letters if input is short
        if (search.length < 3) {
          filterProducts = currentProducts.filter((p) =>
            p.title.toLowerCase().startsWith(search.toLowerCase())
          );
        } else {
          filterProducts = currentProducts.filter((p) =>
            p.title.toLowerCase().includes(search.toLowerCase())
          );
        }

        const newSuggest = filterProducts
          .map((p) => ({ id: p.id, title: p.title }))
          .slice(0, 6); // Limit to 6 suggestions

        setSuggest(newSuggest);
        setHighlightedIndex(-1);
      } else {
        setSuggest([]);
      }
    }, 1000);

    return () => clearTimeout(listening);
  }, [search]);

  /**
   * Detects clicks outside the input/suggestion box
   * to hide suggestions dropdown
   */
  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setSugerenciasVisibles(false);
      } else {
        setSugerenciasVisibles(true);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="w-full bg-white/90 shadow-md flex flex-col justify-center px-3">
      
      {/* Brand and Promo Section */}
      <div className="flex flex-row items-center relative header justify-between mb-2">
        <div onClick={() => navigate("/")} className="cursor-pointer">
          <img src="/images/marca.png" alt="brand" className="w-28 h-28" />
        </div>
        <div className="rounded-3xl bg-black w-32 h-24">
          <img src="/images/descuento.png" alt="promo" className="w-full h-full" />
        </div>
      </div>

      {/* Search Bar with Suggestions */}
      <div
        className="w-3/4 self-center z-10 bg-white border-solid border-2 border-slate-600"
        ref={wrapperRef}
      >
        <div className="flex flex-row items-center">
          <div className="w-full">
            <input
              id="search"
              type="text"
              placeholder="Search products..."
              value={inputValue}
              className="text-xl w-full p-2 border-none"
              onChange={(e) => {
                setSearch(e.target.value);
                setInputValue(e.target.value);
              }}
              onKeyDown={(e) => {
                if (suggest.length === 0) return;

                if (e.key === "ArrowDown") {
                  setMouseEnter(false);
                  e.preventDefault();
                  if (highlightedIndex === -1) setSuplentSearch(search);

                  const nextIndex =
                    highlightedIndex + 1 === suggest.length ? -1 : highlightedIndex + 1;

                  if (nextIndex === -1) {
                    setHighlightedIndex(-1);
                    setInputValue(suplentSearch);
                    return;
                  }

                  const selected = suggest[nextIndex];
                  if (selected) setInputValue(selected.title);
                  setHighlightedIndex(nextIndex);
                }

                if (e.key === "ArrowUp") {
                  setMouseEnter(false);
                  e.preventDefault();
                  const prevIndex =
                    highlightedIndex === 0 ? suggest.length - 1 : highlightedIndex - 1;

                  const selected = suggest[prevIndex];
                  if (selected) setInputValue(selected.title);
                  setHighlightedIndex(prevIndex);
                }

                if (e.key === "Enter") {
                  if (highlightedIndex >= 0) {
                    const selected = suggest[highlightedIndex];
                    const foundProduct = products.find((p) => p.title === inputValue);
                    if (foundProduct) {
                      navigate(`product/${foundProduct.id}?from=search`);
                      setSuggest([]);
                      setInputValue("");
                      setSearch("");
                    }
                  }
                }
              }}
            />
          </div>

          {/* Search Icon Button (not functional) */}
          <label
            htmlFor="search"
            className="p-1 cursor-pointer"
            onClick={() => {}}
          >
            <Search className="border-l-2 border-solid border-slate-400" />
          </label>
        </div>

        {/* Suggestions Dropdown */}
        {sugerenciasVisibles && suggest.length > 0 && (
          <>
            {suggest.map((s, index) => {
              const isHighlighted = !mouseEnter && highlightedIndex === index;

              return (
                <div
                  key={s.id}
                  className={`flex mt-2 flex-row gap-2 py-2 cursor-pointer ${
                    isHighlighted
                      ? "bg-slate-500"
                      : !mouseEnter && highlightedIndex >= 0
                      ? ""
                      : "hover:bg-slate-500"
                  }`}
                  onMouseEnter={() => {
                    setHighlightedIndex(index);
                    setMouseEnter(true);
                  }}
                  onClick={() => {
                    navigate(`product/${s.id}?from=search`);
                  }}
                >
                  <div className="ml-2">
                    <Search className="text-gray-600" />
                  </div>
                  <div>{s.title}</div>
                </div>
              );
            })}
          </>
        )}
        {search.length > 0 && suggest.length == 0 && (
        <>
        <div className="flex flex-col items-center justify-center py-20 px-4 text-center bg-white rounded-md shadow-sm">
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-16 w-16 text-gray-400 mb-4"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
  <h2 className="text-xl font-semibold text-gray-700 mb-2">Product not found</h2>
  <p className="text-gray-500 mb-4">
    We couldn’t find the product you’re looking for. Please try a different search.
  </p>
  <a
    href="/"
    className="inline-block px-6 py-2 bg-black text-white text-sm font-medium rounded hover:bg-gray-800 transition"
  >
    Back to Home
  </a>
         </div>     
        </>
        )}
      </div>

      {/* Main Navigation (only visible outside auth pages) */}
      {!includesUrls && <Nav tog={toggle} settog={setToggle} />}
    </header>
  );
};

export default Header;
