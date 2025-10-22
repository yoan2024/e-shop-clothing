import { useEffect, useState } from "react";
import { useOrders } from "../../context/OrdersProvider";
import Table from "../Table";

const navItems = [
  "All",
  "Processing",
  "On the way",
  "Delivered",
  "Returned",
  "Cancelled",
];

export const Orders = ({ activeTab, setActiveTab }) => {
  const [search, setSearch] = useState("");
  const [ordersTab, setOrdersTab] = useState([]);
  const { orders, orderHistory } = useOrders();

  console.log("ordenes", orders, "historyyy", orderHistory)

  console.log("ordertav", ordersTab)
  // 🔹 Filter orders by tab and search input
  const filterByTabOrder = () => {
    const allOrders = [...orders, ...orderHistory];
    let filtered = [];
console.log("activetab", activeTab)
    // 🔸 Filter by current tab
    switch (activeTab) {
      case "All":
        filtered = allOrders;
        break;
      case "Processing":
        filtered = allOrders.filter((o) => o.status === "Processing");
        break;
      case "On the way":
        filtered = allOrders.filter((o) => o.status === "On the way");
        break;
      case "Delivered":
        filtered = allOrders.filter((o) => o.status === "Delivered");
        break;
      case "Returned":
        console.log("entro aca en reurned")
        filtered = allOrders.filter((o) => o.status === "Returned");
        break;
      case "Cancelled":
        filtered = allOrders.filter((o) => o.status === "Cancelled");
        break;
      default:
        filtered = [];
        break;
    }

    // 🔸 Filter by search term (order ID, item name, payment method, etc.)
    if (search.trim() !== "") {
      const searchTerm = search.toLowerCase().trim();

      filtered = filtered.filter((o) => {
        // ✅ 1. Match by orderId (outside orderedItems)
        const matchByOrderId = o.orderId?.toLowerCase().includes(searchTerm);

        // ✅ 2. Match inside orderedItems (title or product ID)
        const matchByItem =
          o.orderedItems?.some(
            (item) =>
              item.title?.toLowerCase().includes(searchTerm) ||
              item.id?.toString().toLowerCase().includes(searchTerm)
          ) || false;

        // ✅ 3. Match by payment method
        const matchByPayment = o.paymentMethod
          ?.toLowerCase()
          .includes(searchTerm);

        // ✅ Return true if any match
        return matchByOrderId || matchByItem || matchByPayment;
      });
    }

    setOrdersTab(filtered);
  };

  // 🔹 Run filter whenever tab, search, or orders change
  useEffect(() => {
    filterByTabOrder();
  }, [activeTab, search, orders, orderHistory]);

  return (
    <section className="flex flex-col min-h-screen items-center w-full py-4">
      {/* 🔸 Navigation bar */}
      <nav className="flex mb-4 flex-row w-full max-2xl:flex-col">
        <div className="flex flex-wrap">
          {navItems.map((item) => (
            <div
              key={item}
              onClick={() => setActiveTab(item)}
              className={`cursor-pointer border-b-2 px-4 py-2 transition-all ${
                activeTab === item
                  ? "border-black font-semibold"
                  : "border-transparent text-gray-600 hover:text-black hover:border-gray-300"
              }`}
            >
              {item}
            </div>
          ))}
        </div>

        {/* 🔸 Search bar */}
        <div className="mt-2 md:mt-6 w-full px-4">
          <input
            type="text"
            placeholder="Search by ID, item, payment, or user"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full p-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-black transition"
          />
        </div>
      </nav>

      {/* 🔸 Orders table */}
      <Table ped={ordersTab} />
    </section>
  );
};
