import React from "react";

const Nav = () => {
  return (
    <div className="w-full flex flex-row justify-center  mt-2 text-xl">
      <div className="flex  w-11/12 flex-row justify-between bg-yellow-300">
        <div className="flex flex-row gap-2">
          <div>MAN</div>
          <div>WOMAN</div>
          <div>KIDS</div>
          <div>EXPLORE</div>
          <div>NEW</div>
        </div>
        <div>
          <div>BALENCIAGA</div>
        </div>
        <div className="flex flex-row items-center gap-2">
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
