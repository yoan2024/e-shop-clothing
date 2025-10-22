// components/AccountSidebar.jsx
import { useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  Package,
  User,
  Star,
  Gift,
  Shield,
  CreditCard,
  MapPin,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
const orderTabs = ["All", "Processing", "On the way", "Delivered", "Returned", "Cancelled"];

const AccountSidebar = ({
  activeTab,
  setActiveTab,
  activeComponent,
  setActiveComponent,
}) => {
  const [openOrders, setOpenOrders] = useState(false);
  const navigate = useNavigate();
  return (
    <aside className="bg-white border-r min-w-fit w-full md:w-64 p-4 flex flex-col gap-2 shadow-sm">
      <nav className="flex flex-col gap-2">
        {/* 🔹 Personal Information */}
        <button
          onClick={() => setActiveComponent("profile")}
          className={`flex items-center gap-2 p-2 rounded-lg transition-all ${
            activeComponent === "profile"
              ? "bg-gray-100 font-semibold"
              : "hover:bg-gray-100"
          }`}
        >
          <User className="w-5 h-5" />
          <span>Personal Information</span>
        </button>

        {/* 🔹 Orders Dropdown */}
        <div>
          <button
            onClick={() => {
              setActiveComponent("orders");
              setOpenOrders(!openOrders);
            }}
            className={`flex justify-between items-center w-full p-2 rounded-lg transition-all ${
              activeComponent === "orders"
                ? "bg-gray-100 font-semibold"
                : "hover:bg-gray-100"
            }`}
          >
            <div className="flex items-center gap-2">
              <Package className="w-5 h-5" />
              <span>Orders</span>
            </div>
            {openOrders ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>

          {/* 🔸 Orders Submenu */}
          {openOrders && (
            <div className="pl-8 mt-2 flex flex-col gap-2 text-sm">
              {orderTabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`text-left py-1 px-2 rounded-md transition-all ${
                    activeTab === tab
                      ? "border-l-4 border-orange-400 bg-orange-100 text-black font-medium"
                      : "text-gray-600 hover:text-black hover:bg-gray-50"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* 🔹 Reviews */}
        <button
          onClick={() => setActiveComponent("reviews")}
          className={`flex items-center gap-2 p-2 rounded-lg transition-all ${
            activeComponent === "reviews"
              ? "bg-gray-100 font-semibold"
              : "hover:bg-gray-100"
          }`}
        >
          <Star className="w-5 h-5" />
          <span>Your Reviews</span>
        </button>

        {/* 🔹 Coupons & Offers */}
        <button
          onClick={() => setActiveComponent("coupons")}
          className={`flex items-center gap-2 p-2 rounded-lg transition-all ${
            activeComponent === "coupons"
              ? "bg-gray-100 font-semibold"
              : "hover:bg-gray-100"
          }`}
        >
          <Gift className="w-5 h-5" />
          <span>Coupons & Offers</span>
        </button>

        {/* 🔹 Account Security */}
        <button
          onClick={() => setActiveComponent("security")}
          className={`flex items-center gap-2 p-2 rounded-lg transition-all ${
            activeComponent === "security"
              ? "bg-gray-100 font-semibold"
              : "hover:bg-gray-100"
          }`}
        >
          <Shield className="w-5 h-5" />
          <span>Account Security</span>
        </button>

        {/* 🔹 Payment Methods */}
        <button
          onClick={() => setActiveComponent("payment")}
          className={`flex items-center gap-2 p-2 rounded-lg transition-all ${
            activeComponent === "payment"
              ? "bg-gray-100 font-semibold"
              : "hover:bg-gray-100"
          }`}
        >
          <CreditCard className="w-5 h-5" />
          <span>Payment Methods</span>
        </button>

        {/* 🔹 Addresses */}
        <button
          onClick={() => setActiveComponent("addresses")}
          className={`flex items-center gap-2 p-2 rounded-lg transition-all ${
            activeComponent === "addresses"
              ? "bg-gray-100 font-semibold"
              : "hover:bg-gray-100"
          }`}
        >
          <MapPin className="w-5 h-5" />
          <span>Saved Addresses</span>
        </button>
      </nav>
    </aside>
  );
};

export default AccountSidebar;
