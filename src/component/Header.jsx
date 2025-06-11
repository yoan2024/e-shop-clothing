import { useEffect, useState } from "react";
import { useUser } from "../context/User";
import Nav from "./Nav";
import { useLocation } from "react-router-dom";
import { Search } from "lucide-react";
import { useProducts } from "../context/ContextProducts";
import { useNavigate } from "react-router-dom";

const Header = ({ togle, settogle }) => {
  const navegate = useNavigate();
  const { products, setProducts } = useProducts();
  const [inpuValue, setInputValue] = useState("");
  const [suggest, setSuggest] = useState([]);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [search, setSearch] = useState("");
  const [suplentSearch, setSuplentSearch] = useState("");
  const [mouseEnter, setMouseEnter] = useState(false);
  const { user, setUser } = useUser();
  const location = useLocation();
  const urls = ["/sign_up", "/login_in"];
  const includesUrls = urls.includes(location.pathname);
  useEffect(() => {
    const listening = setTimeout(() => {
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
        console.log("current suggest", suggest);
        setHighlightedIndex(-1);
      } else {
        console.log("escribe algo en el search");
        setSuggest([]);
      }
    }, 1000);

    return () => {
      clearTimeout(listening);
    };
  }, [search]);
  if (!user) return null;

  const handleSearch = () => {};

  return (
    <header className="w-full bg-white/90 shadow-md flex flex-col justify-center p-3">
      <div className="flex flex-row items-center relative  justify-between mb-2">
        <div>
          <img src="/images/marca.png" alt="" className="w-28 h-28" />
        </div>
        <div className="w-1/2  z-10 bg-white absolute top-10 left-1/4   border-solid border-2 border-slate-600 ">
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
                      setInputValue(suggest[idIndex].title);
                      return idIndex;
                    });
                  } else if (e.key === "ArrowUp") {
                    setMouseEnter(false);
                    e.preventDefault();
                    setHighlightedIndex((prev) => {
                      const idIndex =
                        prev === 0 ? suggest.length - 1 : prev - 1;

                      setInputValue(suggest[idIndex].title);
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
                        console.log("no se incontro", findProdut);
                      }
                    } else {
                      console.log("buscando producto", inpuValue);
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

          {suggest.length > 0 && (
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

        <div className="rounded-3xl bg-black w-48 h-36">
          <img src="/images/descuento.png" alt="" className="w-full h-full" />
        </div>
      </div>
      {!includesUrls && <Nav tog={togle} settog={settogle} />}
    </header>
  );
};

export default Header;
