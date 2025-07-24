// --- Footer component for the website. 
// Includes newsletter input, quick shop links, policy links, and company info. --- //

const Footer = () => {
  return (
    <div className="w-full h-40 max-md:h-auto flex flex-row max-md:flex-col gap-5 items-center justify-around bg-gray-200 p-5">
      {/* Brand and Newsletter Section */}
      <div className="flex flex-col justify-center gap-3">
        <div className="text-xl font-bold">TRENDORA</div>

        {/* Newsletter input */}
        <div className="flex flex-row items-center gap-1 border-b-2 border-black border-solid">
          <input
            type="text"
            className="bg-gray-200 w-60 outline-none"
            placeholder="Get latest offers to your inbox"
          />
          <div className="p-2 bg-black text-white rounded-lg cursor-pointer hover:bg-gray-800 transition">
            &gt;
          </div>
        </div>
      </div>

      {/* Navigation Links Section */}
      <div className="flex flex-row gap-5 justify-center text-sm">
        {/* Shop Section */}
        <div>
          <div className="font-bold mb-1">Shop</div>
          <div>My Account</div>
          <div>Login</div>
          <div>Wishlist</div>
          <div>Cart</div>
        </div>

        {/* Information Section */}
        <div>
          <div className="font-bold mb-1">Information</div>
          <div>Shipping Policy</div>
          <div>Returns & Refunds</div>
          <div>Cookies Policy</div>
          <div>FAQs</div>
        </div>

        {/* Company Section */}
        <div>
          <div className="font-bold mb-1">Company</div>
          <div>About Us</div>
          <div>Privacy Policy</div>
          <div>Terms & Conditions</div>
          <div>Contact Us</div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
