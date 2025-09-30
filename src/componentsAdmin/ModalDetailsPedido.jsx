import React, { useState } from "react";
import CambiarEstado from "./CambiarEstado";

const ModalDetailsPedido = ({ onclose, p, setorders, setpd }) => {
  const [status, setStatus] = useState("");
  const [shipping, setShipping] = useState("");
  const [showES, setShowED] = useState(false);

  const handleEditarEstado = () => {
    // Placeholder for future logic
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center  justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-2xl shadow-2xl p-6  max-lg:h-auto w-full max-w-xl animate-fade-in-up relative overflow-y-scroll">
        {/* Close button */}
        <button
          onClick={onclose}
          className="absolute top-3 right-3 text-gray-600 hover:text-black text-2xl font-bold"
        >
          ×
        </button>

        {/* Client Info */}
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2 text-slate-700">
            🧑 Client
          </h2>
          <div className="space-y-1 text-gray-600">
            <div>
              <strong>Name:</strong> {p.name}
            </div>
            <div>
              <strong>Email:</strong> {p.email}
            </div>
            <div>
              <strong>Phone:</strong> {p.phone}
            </div>
            <div>
              <strong>Address:</strong> {p.address}
            </div>
          </div>
        </section>

        {/* Order Items */}
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2 text-slate-700">
            🛒 Order
          </h2>
          <ul className="space-y-4">
            {p.orderedItems.map((item, index) => (
              <li key={index} className="border rounded-md p-3 bg-slate-50">
                <div>
                  <strong>Product:</strong> {item.title}
                </div>
                <div>
                  <strong>Quantity:</strong> {item.quantity}
                </div>
                <div>
                  <strong>Unit price:</strong> ${item.price}
                </div>
                <div>
                  <strong>Subtotal:</strong> ${item.total}
                </div>
              </li>
            ))}
          </ul>
        </section>

        {/* Shipping Info */}
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2 text-slate-700">
            🚚 Shipping
          </h2>
          <div className="space-y-1 text-gray-600">
            <div>
              <strong>Address:</strong> {p.address}
            </div>
            <div>
              <strong>Shipping status:</strong> {p.status}
            </div>
          </div>
        </section>

        {/* Actions */}
        <section>
          <h2 className="text-xl font-semibold mb-2 text-slate-700">
            🛠️ Actions
          </h2>
          <div>
            <button
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg"
              onClick={() => setShowED(true)}
            >
              Change order status
            </button>
          </div>
        </section>
      </div>

      {/* Change status modal */}
      {showES && (
        <CambiarEstado
          onclose={() => setShowED(false)}
          order={p}
          setpd={setpd}
          setorders={setorders}
        />
      )}
    </div>
  );
};

export default ModalDetailsPedido;
