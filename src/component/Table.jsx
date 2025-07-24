// Table.jsx

// ==============================
// This component renders a list of order tables.
// Each order (`ped`) contains metadata and a list of ordered items.
// It delegates the rendering of items to the <BodyTableP /> component.
// ==============================

// ===== Imports =====
import { useEffect } from "react";
import BodyTableP from "./BodyTableP"; // Component responsible for rendering order items

// ===== Component =====
const Table = ({ label, ped }) => {
  return (
    <section className="flex flex-col items-center mt-32">
      {/* Section title */}
      <div className="text-3xl mb-10 font-bold">{label}</div>

      {/* Loop through each order (pedido) */}
      <div>
        {ped.map((p, index) => {
          return (
            <table
              key={index}
              className="border-solid border-2 border-slate-900 mb-5"
            >
              {/* ===== Table Head ===== */}
              <thead>
                <tr>
                  <th className="border-solid border-2 border-slate-900">
                    {p.idPedido}
                  </th>
                  <th className="border-solid border-2 border-slate-900">
                    {p.fechaPedido}
                  </th>
                  <th className="border-solid border-2 border-slate-900">ITEM</th>
                  <th className="border-solid border-2 border-slate-900">NAME</th>
                  <th className="border-solid border-2 border-slate-900">QUANTITY</th>
                  <th className="border-solid border-2 border-slate-900">TOTAL</th>
                  <th className="border-solid border-2 border-slate-900">STATUS</th>
                  <th className="border-solid border-2 border-slate-900">SHIPPING</th>
                </tr>
              </thead>

              {/* ===== Table Body ===== */}
              <tbody>
                {/* Render the list of ordered items using BodyTableP component */}
                <BodyTableP itemspedidos={p.itemsPedido} />

                {/* Footer row with summary and status info */}
                <tr>
                  <th className="bg-slate-800">Total</th>
                  <th></th>
                  <th></th>
                  <th></th>
                  <th></th>

                  {/* Total amount paid */}
                  <th className="bg-slate-700 p-2">
                    ${p.totalPagado} USD
                  </th>

                  {/* Dynamic background color depending on the status */}
                  <th
                    className={
                      p.estado === "Pendiente"
                        ? "bg-yellow-300 p-2"
                        : p.estado === "En camino"
                        ? "bg-blue-400 p-2"
                        : p.estado === "Entregado"
                        ? "bg-green-300 p-2"
                        : "bg-red-300"
                    }
                  >
                    {p.estado}
                  </th>

                  {/* Shipping information with animation */}
                  <th className="p-2 animate-pulse">{p.envio}</th>
                </tr>
              </tbody>
            </table>
          );
        })}
      </div>
    </section>
  );
};

// ===== Export =====
export default Table;
