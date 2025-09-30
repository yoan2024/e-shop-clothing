// MainPedidos.tsx

import { useEffect, useState } from "react";
import { collection, query, orderBy, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebase-config";
import ModalDetailsPedido from "./ModalDetailsPedido.jsx";
import { Bars3Icon } from '@heroicons/react/24/solid';

const MainPedidos = () => {
  // State to hold all fetched orders
  const [orders, setOrders] = useState([]);

  // Controls the visibility of the modal
  const [onClose, setOnClose] = useState(false);

  // Holds the currently selected order for viewing/editing
  const [pd, setpd] = useState(null);

  // Fetch all orders from Firestore on component mount
  useEffect(() => {
    async function fetchOrders() {
      try {
        const refdoc = collection(db, "allOrders");
        const orderdocs = query(refdoc, orderBy("orderDate", "desc"));
        const getdocs = await getDocs(orderdocs);
        let peds = [];

        if (getdocs.empty) {
          console.log("No documents found in allOrders collection.");
        }

        getdocs.forEach((doc) => {
          const data = doc.data();
      
          peds.push(data);
        });

        
        setOrders(peds);
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
    <div className="max-lg:w-auto  flex flex-col  lg:ml-3">
      {orders.length > 0 ? (
        <>
         
          <div className="text-center mt-7 mb-7  font-serif text-4xl">ORDERS</div>
          <div className="w-full">
            <table className="text-xl  text-center">
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
                {orders.map((p, index) => (
                  <tr
                    key={index}
                    onClick={() => handleClickDetails(p)}
                    className="cursor-pointer"
                  >
                    <td className="border-2 p-1 border-solid border-black">
                      {p.orderId}
                    </td>
                    <td className="border-2 p-1 border-solid border-black">
                      {p.name}
                    </td>
                    <td className="border-2 p-1 border-solid border-black">
                      {p.orderDate}
                    </td>
                    <td className="border-2 p-1 border-solid border-black">
                      {p.status}
                    </td>
                    <td className="border-2 p-1 border-solid border-black">
                      {p.totalPaid}
                    </td>
                    <td className="border-2 p-1 border-solid border-black">
                      {p.paymentMethod}
                    </td>
                    <td className="border-2 p-1 border-solid border-black">
                      { p.shippingStatus || "Preparing"}
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
                setorders={setOrders}
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
