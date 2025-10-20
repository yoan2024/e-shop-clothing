// components/AccountSidebar.jsx
import { useState } from "react";
import { ChevronDown, ChevronUp, Package, User, Star, Gift, Shield, CreditCard, Menu } from "lucide-react";



const navItems = ["All", "Processing", "On the way", "Delivered", "Returned", "Cancelled"];

const AccountSidebar = ({activeTab, setActiveTab} ) => {
  const [open, setOpen] = useState(false); // toggle orders dropdown
  const [menuOpen, setMenuOpen] = useState(false); // toggle sidebar on mobile

  return (
    <>
      

      {/* Sidebar */}
      <aside
        className={`bg-white   transition-transform duration-300 ease-in-out min-w-fit`}
      >

        <nav className="p-4 flex flex-col gap-2">
          {/* Personal Information */}
          <button className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100">
            <User className="w-5 h-5" /> 
            <span>Personal Information</span>
          </button>

          {/* Orders with dropdown */}
          <div>
            <button
              className="flex justify-between items-center w-full p-2 rounded-lg hover:bg-gray-100"
              onClick={() => setOpen(!open)}
            >
              <div className="flex items-center gap-2">
                <Package className="w-5 h-5" />
                <span>Orders</span>
              </div>
              {open ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
            {open && (
              <div className="pl-8 mt-2 flex flex-col gap-2 text-sm">
               
               {navItems.map((a, b) =>{
                return (
                  <button onClick={() => setActiveTab(a) }  key={b} className={` ${activeTab === a ? "border-orange-400 border-l-4 bg-orange-200" : "border-transparent"}`}>{a}</button>
                )
               } ) } 
              </div>
            )}
          </div>

          {/* Reviews */}
          <button className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100">
            <Star className="w-5 h-5" />
            <span>Your Reviews</span>
          </button>

          {/* Coupons & Offers */}
          <button className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100">
            <Gift className="w-5 h-5" />
            <span>Coupons & Offers</span>
          </button>

          {/* Security */}
          <button className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100">
            <Shield className="w-5 h-5" />
            <span>Account Security</span>
          </button>

          {/* Payment Methods */}
          <button className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100">
            <CreditCard className="w-5 h-5" />
            <span>Payment Methods</span>
          </button>
        </nav>
      </aside>
    </>
  );
};

export default AccountSidebar;
/*{/* Mobile toggle button }
      <div className="md:hidden p-4 flex justify-between  items-center border-b">
        <h2 className="font-bold text-lg">My Account</h2>
        <button
          className="p-2 border rounded-lg"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <Menu className="w-5 h-5" />
        </button>
      </div> */