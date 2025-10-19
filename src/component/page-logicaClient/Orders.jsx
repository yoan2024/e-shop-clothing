import { useState } from "react";

const ordersData = [
  { id: "001", status: "Processing" },
  { id: "002", status: "Shipped" },
  { id: "003", status: "Delivered" },
  { id: "004", status: "Returns" },
  { id: "005", status: "Processing" },
];

const navItems = ["All", "Processing", "Shipped", "Delivered", "Returns"];

export const Orders = () => {
  const [activeTab, setActiveTab] = useState("All");
  const [search, setSearch] = useState("");

  // Filtrar pedidos según tab activo y búsqueda
  const filteredOrders = ordersData.filter(
    (order) =>
      (activeTab === "All" || order.status === activeTab) &&
      order.id.includes(search)
  );

  return (
    <section className="flex flex-col min-h-screen p-4 w-full ">
      {/* Navbar */}
      <nav className="flex mb-4 flex-row max-2xl:flex-col ">
        <div className="flex  flex-wrap">
            {navItems.map((item) => (
          <div
            key={item}
            onClick={() => setActiveTab(item)}
            className={`cursor-pointer px-4 py-2 text-center md:text-left border-b-2 md:border-b-0 md:border-l-4 md:pl-4 ${
              activeTab === item
                ? "border-black font-semibold"
                : "border-transparent text-gray-600 hover:text-black hover:border-gray-300"
            } transition-all`}
          >
            {item}
          </div>
        ))}

        </div>
        {/* Barra de búsqueda */}
        <div className="mt-2 md:mt-6 w-full px-4">
          <input
            type="text"
            placeholder="Search by Order ID"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full p-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-black transition"
          />
        </div>
      </nav>

      {/* Contenedor de pedidos */}
      <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredOrders.length === 0 ? (
          <div className="col-span-full text-center text-gray-500">
            No orders found
          </div>
        ) : (
          filteredOrders.map((order) => (
            <div
              key={order.id}
              className="p-4 border rounded-lg shadow hover:shadow-md transition cursor-pointer"
            >
              <h3 className="font-semibold">Order ID: {order.id}</h3>
              <p>Status: {order.status}</p>
            </div>
          ))
        )}
      </div>
    </section>
  );
};
