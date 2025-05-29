import { useNavigate } from "react-router-dom";
const Nav = () => {
  const navigate = useNavigate();

  const handleClick = (prom) => {
    if (prom === "MAN") {
    } else if (prom === "WOMAN") {
    } else if (prom === "KIDS") {
    } else if (prom === "EXPLORE") {
    } else if (prom === "NEW") {
    } else if (prom === "HOME") {
      navigate("/");
    }
  };

  return (
    <div className="w-full bg-white/90 shadow-md flex flex-row justify-center p-3 fixed top-0 left-0 z-50">
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
          <div className="cursor-pointer" onClick={() => handleClick("WOAMN")}>
            WOMAN
          </div>
          <div className="cursor-pointer" onClick={() => handleClick("KIDS")}>
            KIDS
          </div>
          <div
            className="cursor-pointer"
            onClick={() => handleClick("EXPLORE")}
          >
            EXPLORE
          </div>
          <div className="cursor-pointer" onClick={() => handleClick("NEW")}>
            NEW
          </div>
        </div>
        <div>
          <div className="text-2xl font-semibold">Trendora</div>
        </div>
        <div className="flex flex-row   gap-4">
          <div className="w-5 h-5">
            <img src="/images/lupa.png" alt="" className="w-full h-full" />
          </div>
          <div className="w-5 h-5">
            {" "}
            <img src="/images/user.png" alt="" className="w-full h-full" />
          </div>
          <div className="w-5 h-5">
            {" "}
            <img src="/images/bolsa.png" alt="" className="w-full h-full" />
          </div>
          <div className="w-5 h-5">
            {" "}
            <img src="/images/heart.png" alt="" className="w-full h-full" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Nav;
