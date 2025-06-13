import { useNavigate } from "react-router-dom";
import { useUser } from "../context/User";
import { logout } from "../firebase/authService";
import { useImage } from "../context/Image";
import { useEffect, useState } from "react";
import ClipLoader from "react-spinners/ClipLoader";
const Nav = ({ tog, settog }) => {
  const { url, setUrl } = useImage();
  const { user, setUser } = useUser();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleClick = (prom) => {
    if (prom === "MAN") {
      navigate("/catalogo/men");
    } else if (prom === "WOMEN") {
      navigate("/catalogo/women");
    } else if (prom === "JEWELERY") {
      navigate("/catalogo/jewelery");
    } else if (prom === "ELECTRONICS") {
      navigate("/catalogo/electronics");
    } else if (prom === "HOME") {
      navigate("/");
    } else if (prom === "PERFIL") {
      navigate("/perfilUser");
    } else if (prom === "heart") {
      navigate("/favorites");
    }
  };

  if (!user) return null;
  return (
    <nav>
      <div className="flex  w-11/12  flex-row  justify-between items-center">
        <div className="flex flex-row gap-2 text-xl">
          <div
            className="cursor-pointer font-bold"
            onClick={() => handleClick("HOME")}
          >
            HOME
          </div>
          <div className="cursor-pointer" onClick={() => handleClick("MAN")}>
            MAN
          </div>
          <div className="cursor-pointer" onClick={() => handleClick("WOMEN")}>
            WOMAN
          </div>
          <div
            className="cursor-pointer"
            onClick={() => handleClick("JEWELERY")}
          >
            JEWELERY
          </div>
          <div
            className="cursor-pointer"
            onClick={() => handleClick("ELECTRONICS")}
          >
            ELECTRONICS
          </div>
        </div>

        <div className="flex flex-row items-center  gap-4">
          <div className="relative mt-2">
            {/* Ícono del usuario */}
            <button
              onClick={() => setOpen(!open)}
              className="focus:outline-none"
            >
              {url ? (
                <img
                  src={url}
                  alt="User avatar"
                  className="w-8 h-8 rounded-full border border-gray-300"
                />
              ) : (
                <ClipLoader
                  color="#36d7b7"
                  className="w-8 h-8 rounded-full border border-gray-300"
                />
              )}
            </button>

            {/* Panel desplegable */}
            {open && (
              <div className="absolute right-0 mt-2 w-64 bg-white border rounded-xl shadow-xl p-4 z-50">
                <div className="flex items-center gap-3 mb-4">
                  <img
                    src={url}
                    alt="Avatar"
                    className="w-12 h-12 rounded-full"
                  />

                  <div>
                    <p className="font-semibold text-lg">{user.name}</p>
                    <p className="text-sm text-gray-500">{user.email}</p>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => navigate("/perfilUser")}
                    className="text-left px-4 py-2 rounded-md hover:bg-gray-100"
                  >
                    Ver perfil
                  </button>
                  <button
                    onClick={handleLogout}
                    className="text-left px-4 py-2 rounded-md hover:bg-red-100 text-red-600"
                  >
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
          <div className="w-5 h-5 cursor-pointer" onClick={() => settog(!tog)}>
            {" "}
            <img src="/images/bolsa.png" alt="" className="w-full h-full" />
          </div>
          <div
            className="w-5 h-5 cursor-pointer"
            onClick={() => handleClick("heart")}
          >
            <img
              src="/images/heart.png"
              alt="Avatar"
              className="w-full h-full"
            />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Nav;
