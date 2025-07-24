// MainPedidos.tsx

import { useEffect, useState } from "react";
import { collection, query, orderBy, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebase-config";
import ModalDetailsPedido from "./ModalDetailsPedido.jsx";

const MainPedidos = () => {
  // State to hold all fetched orders
  const [pedidos, setPedidos] = useState([]);

  // Controls the visibility of the modal
  const [onClose, setOnClose] = useState(false);

  // Holds the currently selected order for viewing/editing
  const [pd, setpd] = useState(null);

  // Fetch all orders from Firestore on component mount
  useEffect(() => {
    async function fetchOrders() {
      try {
        const refdoc = collection(db, "todosPedidos");
        const organizardocs = query(refdoc, orderBy("fechaPedido", "desc"));
        const getdocs = await getDocs(organizardocs);
        let peds = [];

        if (getdocs.empty) {
          console.log("No documents found in todosPedidos collection.");
        }

        getdocs.forEach((doc) => {
          const data = doc.data();
          console.log("Fetched order:", data);
          peds.push(data);
        });

        console.log("Final orders array:", peds);
        setPedidos(peds);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    }

    fetchOrders();
  }, []);

  // Handles the click event to open the order detail modal
  const handleClickDetails = (p) => {
    setpd(p);
    setOnClose(true);
  };

  return (
    <div className="w-4/5 flex flex-col items-center">
      {pedidos.length > 0 ? (
        <>
          <div className="text-center mt-7 text-4xl">ORDERS</div>
          <div>
            <table className="text-xl text-center">
              <thead className="bg-slate-300">
                <tr>
                  <th>Order ID</th>
                  <th>Client</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Total</th>
                  <th>Payment</th>
                  <th>Shipping</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody className="bg-slate-200">
                {pedidos.map((p, index) => (
                  <tr
                    key={index}
                    onClick={() => handleClickDetails(p)}
                    className="cursor-pointer"
                  >
                    <td className="border-2 p-1 border-solid border-black">
                      {p.idPedido}
                    </td>
                    <td className="border-2 p-1 border-solid border-black">
                      {p.nombre}
                    </td>
                    <td className="border-2 p-1 border-solid border-black">
                      {p.fechaPedido}
                    </td>
                    <td className="border-2 p-1 border-solid border-black">
                      {p.estado}
                    </td>
                    <td className="border-2 p-1 border-solid border-black">
                      {p.totalPagado}
                    </td>
                    <td className="border-2 p-1 border-solid border-black">
                      {p.metodoPago}
                    </td>
                    <td className="border-2 p-1 border-solid border-black">
                      {p.envio || "Preparing"}
                    </td>
                    <td className="border-2 p-1 border-solid border-black">
                      Edit/View
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Modal component for order details */}
            {onClose && pd && (
              <ModalDetailsPedido
                onclose={() => setOnClose(false)}
                setpd={setpd}
                p={pd}
                setpedidos={setPedidos}
              />
            )}
          </div>
        </>
      ) : (
        <div className="text-5xl">Oops, there are no orders yet</div>
      )}
    </div>
  );
};

export default MainPedidos;
