import { useState } from "react";
import { useUser } from "../context/User";
import Nav from "./Nav";
import { useLocation } from "react-router-dom";
import { Search } from "lucide-react";

const Header = ({ togle, settogle }) => {
  const [textSearch, setTextSearch] = useState("");
  const [suggest, setSuggest] = useState([
    { id: 1, title: "hola como estas bb" },
    { id: 1, title: "hola como estas bb" },
    { id: 1, title: "hola como estas bb" },
  ]);
  const [search, setSearch] = useState("");
  const { user, setUser } = useUser();
  const location = useLocation();

  const urls = ["/sign_up", "/login_in"];

  const includesUrls = urls.includes(location.pathname);

  if (!user) return null;

  const handleSearch = () => {};

  return (
    <header className="w-full bg-white/90 shadow-md flex flex-col justify-center p-3">
      <div className="flex flex-row items-center relative  justify-between mb-2">
        <div>
          <img src="/images/marca.png" alt="" className="w-28 h-28" />
        </div>
        <div className="w-1/2  absolute top-10 left-1/4   border-solid border-2 border-slate-600 ">
          <div className="flex flex-row items-center">
            <div className="w-full">
              <input
                className="text-xl w-full p-2 border-none"
                placeholder="buscar productos...."
                type="text"
                value={search}
                id="search"
                onChange={(e) => setSearch(e.target.value)}
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
          <div className="px-1 mt-2 py-2   bg-white">
            {/*aqui va la suggest arrays*/}

            {suggest.length > 0 && (
              <>
                {suggest.map((s) => {
                  return (
                    <div className="flex flex-row gap-2 mt-2 hover:bg-slate-500 py-2 cursor-pointer">
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
