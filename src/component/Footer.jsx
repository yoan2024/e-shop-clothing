import React from "react";

const Footer = () => {
  return (
    <div className="w-full h-40 max-md:h-auto flex flex-row max-md:flex-col gap-5 items-center justify-around bg-gray-200 p-5">
      <div className="flex flex-col  justify-center  gap-3">
        <div>TRENDORA</div>
        <div className="flex flex-row  border-b-2 border-black border-solid">
          <div>
            <input
              type="text"
              className="bg-gray-200 w-60"
              placeholder="Get latest oferts to your inbox"
            />
          </div>
          <div className="p-2 bg-black text-white rounded-lg">&gt;</div>
        </div>
      </div>
      <div className="flex flex-row gap-5  justify-center ">
        <div>
          <div className="font-bold">Shop</div>
          <div>My account</div>
          <div>Login</div>
          <div>Wishlist</div>
          <div>Cart</div>
        </div>
        <div>
          <div className="font-bold">Information</div>
          <div>Shipping Policy</div>
          <div>Returns & Refunds</div>
          <div>Cookies Policy</div>
          <div>Frequently asked</div>
        </div>
        <div>
          <div className="font-bold">Company</div>
          <div>About us</div>
          <div>Privacy Policy</div>
          <div>Terms & Condition</div>
          <div>Contact Uss</div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
