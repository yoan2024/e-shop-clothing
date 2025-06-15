import React, { useState } from "react";
import CambiarEstado from "./CambiarEstado";

const ModalDetailsPedido = ({ onclose, p, setpedidos }) => {
  const [estado, setEstado] = useState("");
  const [envio, setEnvio] = useState("");
  const [showES, setShowED] = useState(false);
  const handleEditarEstado = () => {};

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-2xl   shadow-2xl p-6 h-5/6 w-full max-w-xl   animate-fade-in-up relative overflow-y-hidden overflow-y-scroll">
        {/* Botón cerrar */}
        <button
          onClick={onclose}
          className="absolute top-3 right-3 text-gray-600 hover:text-black text-2xl font-bold"
        >
          ×
        </button>

        {/* Cliente */}
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2 text-slate-700">
            🧑 Cliente
          </h2>
          <div className="space-y-1 text-gray-600">
            <div>
              <strong>Nombre:</strong> {p.nombre}
            </div>
            <div>
              <strong>Email:</strong> {p.correo}
            </div>
            <div>
              <strong>Teléfono:</strong> {p.telefono}
            </div>
            <div>
              <strong>Dirección:</strong> {p.direction}
            </div>
          </div>
        </section>

        {/* Pedido */}
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2 text-slate-700">
            🛒 Pedido
          </h2>
          <ul className="space-y-4">
            {p.itemsPedido.map((item, index) => (
              <li key={index} className="border rounded-md p-3 bg-slate-50">
                <div>
                  <strong>Producto:</strong> {item.title}
                </div>
                <div>
                  <strong>Cantidad:</strong> {item.cantidad}
                </div>
                <div>
                  <strong>Precio unitario:</strong> ${item.price}
                </div>
                <div>
                  <strong>Subtotal:</strong> ${item.total}
                </div>
              </li>
            ))}
          </ul>
        </section>

        {/* Envío */}
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2 text-slate-700">
            🚚 Envío
          </h2>
          <div className="space-y-1 text-gray-600">
            <div>
              <strong>Dirección:</strong> {p.direction}
            </div>
            <div>
              <strong>Estado del envío:</strong> {p.estado}
            </div>
          </div>
        </section>

        {/* Cambiar estado (placeholder) */}
        <section>
          <h2 className="text-xl font-semibold mb-2 text-slate-700">
            🛠️ Acciones
          </h2>
          <div>
            {/* Aquí puedes añadir botones o selects para cambiar el estado del pedido */}
            <button
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg"
              onClick={() => setShowED(true)}
            >
              Cambiar estado del pedido
            </button>
          </div>
        </section>
      </div>
      {showES && (
        <CambiarEstado
          onclose={() => setShowED(false)}
          pedido={p}
          setPedidos={setpedidos}
        />
      )}
    </div>
  );
};

export default ModalDetailsPedido;
