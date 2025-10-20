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
const Table = ({  ped }) => {

  

  return (
    <section className="flex flex-col items-center ">
      {/* Loop through each order (pedido) */}
      <div className="overflow-x-auto max-w-full">
        {ped.map((p, index) => {
          return (
            <table
              key={index}
              className="border-solid table-auto border-2 min-w-full  border-slate-900 mb-5"
            >
              {/* ===== Table Head ===== */}
              <thead>
                <tr>
                  <th className="border-solid border-2 border-slate-900">
                    {p.orderId}
                  </th>
                  <th className="border-solid border-2 border-slate-900">
                    {p.orderDate}
                  </th>
                  <th className="border-solid border-2 border-slate-900">ITEM</th>
                  <th className="border-solid border-2 border-slate-900">NAME</th>
                  <th className="border-solid border-2 border-slate-900">QUANTITY</th>
                  <th className="border-solid border-2 border-slate-900 ">TOTAL</th>
                  <th className="border-solid border-2 border-slate-900">STATUS</th>
                  <th className="border-solid border-2 border-slate-900">SHIPPING</th>
                </tr>
              </thead>

              {/* ===== Table Body ===== */}
              <tbody>
                {/* Render the list of ordered items using BodyTableP component */}
                <BodyTableP itemspedidos={p.orderedItems} status={p.status} shippingStatus={p.shippingStatus}/>

                {/* Footer row with summary and status info */}
              <tr>
  <td colSpan="8" className="h-4"></td>
               </tr>
              <tr>
  <td colSpan="8" className="h-4"></td>
               </tr>
              <tr className="mt-5">
                 
                  <th className="bg-black/50 ">Total</th>
                  <th></th>
                  <th></th>
                  <th></th>
                  <th></th>

                  {/* Total amount paid */}
                  <th className="bg-black/50 ">
                    ${p.totalPaid} USD
                  </th>

   {/* Order status with dynamic background color */}
              <th
                
                  className={
                    p.status === "Pendiente"
                      ? "bg-red-200"
                      : p.status === "En camino"
                      ? "bg-blue-200"
                      : "bg-green-200"
                  }>
                
                  {p.status}
                
              </th>

                  {/* Shipping information with animation */}
                  <th className="p-2 animate-pulse">{p.shippingStatus}</th>
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
