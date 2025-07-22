
import { useEffect, useState } from "react";
import { useUser } from "../context/User";
import Nav from "./Nav";
import React from "react";
import { useLocation } from "react-router-dom";
import { Search } from "lucide-react";
import { useProducts } from "../context/ContextProducts";
import { useNavigate } from "react-router-dom";
import { useRef } from "react";

const Header = ({ togle, settogle }) => {
  const wrapperRef = useRef(null); // 1️⃣ Creamos una referencia al contenedor
  const [sugerenciasVisibles, setSugerenciasVisibles] = React.useState(true);
  const navegate = useNavigate();
  const { products, setProducts } = useProducts();
  const [inpuValue, setInputValue] = useState("");
  const [suggest, setSuggest] = useState([]);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [suggestion, setSuggestionOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [suplentSearch, setSuplentSearch] = useState("");
 const navegacion = useNavigate()
  const [mouseEnter, setMouseEnter] = useState(false);
  const { user, setUser } = useUser();
  const location = useLocation();
  const urls = ["/sign_up", "/login_in"];
  const includesUrls = urls.includes(location.pathname);
  useEffect(() => {
    const listening = setTimeout(() => {
      if (!products) return;
      const currentProducts = [...products];

      if (search.trim() && search.length > 0) {
        let filterProducts;

        if (search.length < 3) {
          filterProducts = currentProducts.filter((p) =>
            p.title.toLowerCase().startWith(search.toLowerCase())
          );
        } else {
          filterProducts = currentProducts.filter((p) =>
            p.title.toLowerCase().includes(search.toLowerCase())
          );
        }

        const newSuggest = filterProducts
          .map((p) => {
            return { id: p.id, title: p.title };
          })
          .slice(0, 6);

        setSuggest(newSuggest);
        
        setHighlightedIndex(-1);
      } else {
       
        setSuggest([]);
      }
    }, 1000);

    return () => {
      clearTimeout(listening);
    };
  }, [search]);

  useEffect(() => {
    // 2️⃣ Esta función se ejecuta cuando haces clic en cualquier parte del documento
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        // 3️⃣ Si hiciste clic fuera del componente, cierra las sugerencias
        setSugerenciasVisibles(false);
      } else {
        setSugerenciasVisibles(true);
      }
    }

    // 4️⃣ Agregamos el listener al documento
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      // 5️⃣ Limpiamos el listener cuando el componente se desmonta
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSearch = () => {};

  return (
    <header className="w-full bg-white/90 shadow-md flex flex-col justify-center p-3">
      <div className="flex flex-row items-center relative header justify-between mb-2">
        <div onClick={() => {
          navegacion("/")
        }} className="cursor-pointer">
          <img src="/images/marca.png" alt="" className="w-28 h-28" />
        </div>

        <div className="rounded-3xl bg-black w-32 h-24">
          <img src="/images/descuento.png" alt="" className="w-full h-full" />
        </div>
      </div>
      <div
        className="w-3/4 self-center  z-10 bg-white   border-solid border-2 border-slate-600 "
        ref={wrapperRef}
      >
        <div className="flex flex-row items-center">
          <div className="w-full">
            <input
              className="text-xl w-full p-2 border-none"
              placeholder="buscar productos...."
              type="text"
              value={inpuValue}
              onKeyDown={(e) => {
                if (suggest.length === 0) return;

                if (e.key === "ArrowDown") {
                  setMouseEnter(false);
                  e.preventDefault();
                  if (highlightedIndex === -1) {
                    setSuplentSearch(search);
                  }

                  let index;
                  if (highlightedIndex + 1 === suggest.length) {
                    index = -1;
                    setHighlightedIndex(index);
                    setInputValue(suplentSearch);
                    return;
                  }
                  setHighlightedIndex((prev) => {
                    const idIndex = (prev + 1) % suggest.length;
                    if (
                      highlightedIndex >= 0 &&
                      highlightedIndex < suggest.length
                    ) {
                      const selected = suggest[highlightedIndex];
                      if (selected) {
                        setInputValue(selected.title);
                      }
                    }
                    return idIndex;
                  });
                } else if (e.key === "ArrowUp") {
                  setMouseEnter(false);
                  e.preventDefault();
                  setHighlightedIndex((prev) => {
                    const idIndex = prev === 0 ? suggest.length - 1 : prev - 1;
                    if (
                      highlightedIndex >= 0 &&
                      highlightedIndex < suggest.length
                    ) {
                      const selected = suggest[highlightedIndex];
                      if (selected) {
                        setInputValue(selected.title);
                      }
                    }

                    return idIndex;
                  });
                } else if (e.key === "Enter") {
                  if (highlightedIndex >= 0) {
                    const selected = suggest[highlightedIndex];
                    console.log("User selected:", selected);
                    const findProdut = products.find(
                      (p) => p.title === inpuValue
                    );
                    if (findProdut) {
                      console.log("se incontro el product", findProdut);
                      const id = findProdut.id;
                      navegate(`product/${id}?from=search`);
                      setSuggest([]);
                      setInputValue("");
                      setSearch("");
                    } else {
                      
                    }
                  } else {
                  
                    navegate();
                  }
                }
              }}
              id="search"
              onChange={(e) => {
                setSearch(e.target.value);
                setInputValue(e.target.value);
              }}
            />{" "}
          </div>
          <label
            htmlFor="search"
            className="p-1 cursor-pointer"
            onClick={handleSearch}
          >
            <Search className=" border-l-2   border-solid border-slate-400" />
          </label>
        </div>

        {/*aqui va la suggest arrays*/}

        {sugerenciasVisibles && suggest.length > 0 && (
          <>
            {suggest.map((s, index) => {
              const isHight = !mouseEnter && highlightedIndex === index;
              return (
                <div
                  key={s.id}
                  className={`flex  mt-2   flex-row gap-2  py-2 cursor-pointer ${
                    isHight
                      ? "bg-slate-500"
                      : mouseEnter === false && highlightedIndex >= 0
                      ? ""
                      : "hover:bg-slate-500"
                  }`}
                  onMouseEnter={() => {
                    setHighlightedIndex(index);
                    setMouseEnter(true);
                  }}
                  onClick={() => {
                    navegate(`product/${s.id}?from=search`);
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
      </div>
      {!includesUrls && <Nav tog={togle} settog={settogle} />}
    </header>
  );
};

export default Header;
