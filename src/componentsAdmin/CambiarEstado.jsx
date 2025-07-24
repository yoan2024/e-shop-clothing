import { useState } from "react";
import { db } from "../firebase/firebase-config";
import {
  collection,
  where,
  query,
  getDocs,
  doc,
  orderBy,
  setDoc,
} from "firebase/firestore";

/**
 * Component to change the shipping and order status of a specific order.
 * It retrieves the order from Firestore, updates it, and refreshes the full list.
 */
const CambiarEstado = ({ onclose, pedido, setPedidos, setpd }) => {
  // Local state for shipping and order status
  const [shippingStatus, setShippingStatus] = useState(pedido.envio);
  const [orderStatus, setOrderStatus] = useState(pedido.estado);

  /**
   * Handle saving the updated shipping and order status to Firestore.
   */
  const handleSave = async () => {
    const userId = pedido.iduser;

    // Find the matching order document by its ID
    const refQuery = query(
      collection(db, "todosPedidos"),
      where("idPedido", "==", pedido.idPedido)
    );
    const snapshot = await getDocs(refQuery);

    let updatedOrder = {};
    let docId;

    snapshot.forEach((docSnap) => {
      if (docSnap.exists()) {
        updatedOrder = docSnap.data();
        docId = docSnap.id;
      } else {
        console.log("Document not found");
      }
    });

    const orderRef = doc(db, "todosPedidos", docId);

    // Merge and save the updated order
    const newOrder = { ...updatedOrder, envio: shippingStatus, estado: orderStatus };
    setpd(newOrder);
    await setDoc(orderRef, newOrder);
    console.log("Order successfully updated in Firestore");

    // Refresh full orders list after update
    const allOrdersRef = collection(db, "todosPedidos");
    const orderedQuery = query(allOrdersRef, orderBy("fechaPedido", "desc"));
    const allOrdersSnap = await getDocs(orderedQuery);

    const ordersArray = [];
    allOrdersSnap.forEach((d) => {
      ordersArray.push(d.data());
    });

    setPedidos(ordersArray);
    console.log("Orders updated in state successfully");

    // Close modal
    onclose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white rounded-2xl shadow-2xl p-6 h-4/6 w-full max-w-xs animate-fade-in-up relative flex flex-col justify-center">
        {/* Close button */}
        <div
          className="absolute top-0 right-0 p-2 cursor-pointer hover:bg-slate-400"
          onClick={onclose}
        >
          X
        </div>

        {/* Dropdown selectors */}
        <div className="flex flex-col justify-center items-center gap-3 h-full">
          {/* Shipping status selector */}
          <div className="flex flex-row justify-center w-full gap-2">
            <div className="text-xl flex-1">Shipping status</div>
            <select
              name="shippingStatus"
              value={shippingStatus}
              onChange={(e) => setShippingStatus(e.target.value)}
              className="border-2 border-solid border-black flex-1"
            >
              <option value="Preparando">Preparing</option>
              <option value="No enviado">Not shipped</option>
              <option value="Repartidor Asignado">Courier assigned</option>
              <option value="En camino">On the way</option>
              <option value="En zona de entrega">In delivery zone</option>
              <option value="Intento fallido">Failed attempt</option>
              <option value="Reprogramado">Rescheduled</option>
              <option value="Entregado">Delivered</option>
              <option value="Devuelto">Returned</option>
            </select>
          </div>

          {/* Order status selector */}
          <div className="flex flex-row justify-center w-full gap-2">
            <div className="text-xl flex-1">Order status</div>
            <select
              name="orderStatus"
              value={orderStatus}
              onChange={(e) => setOrderStatus(e.target.value)}
              className="border-2 border-solid border-black flex-1"
            >
              <option value="Pendiente">Pending</option>
              <option value="En camino">On the way</option>
              <option value="Entregado">Delivered</option>
              <option value="Cancelado">Cancelled</option>
            </select>
          </div>
        </div>

        {/* Save button */}
        <button
          className="p-2 bg-green-400 w-fit m-auto mt-6 rounded-xl hover:bg-green-500 transition"
          onClick={handleSave}
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default CambiarEstado;
