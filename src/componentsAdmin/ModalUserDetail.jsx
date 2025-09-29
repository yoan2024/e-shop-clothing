import {
  collection,
  deleteDoc,
  getDoc,
  orderBy,
  query,
  setDoc,
  where,
  doc,
  getDocs,updateDoc
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { useImage } from "../context/Image";
import { db } from "../firebase/firebase-config";
import ChangeRol from "./ChangeRol";
import EditarUser from "./EditarUser";



// List of all possible order statuses to filter orders by
const orderStatuses = [
  "All",
  "Preparing",
  "Not shipped",
  "Processing",
  "Courier assigned",
  "On the way",
  "In delivery zone",
  "Failed attempt",
  "Rescheduled",
  "Delivered",
  "Returned",
];


// Main component to display a modal with user details and admin actions
const ModalUserDetail = ({ user, onclose, setu, users, setusers }) => {
  // States
  const [changeRol, setChangeRol] = useState(false);
  const [selected, setSelected] = useState("All");
  const [orders, setOrders] = useState([]);
  const { url, setUrl } = useImage(); // Context (not used in UI here)
  const [pop, setPop] = useState(false);
  const [saving, setSaving] = useState(false);
  const [confirmationAction, setConfirmationAction] = useState("");

  // Fetch orders based on selected filter
  useEffect(() => {
    async function fetchOrders() {
      try {
        const ref = query(
          collection(db, "allOrders"),
          where("email", "==", user.email)
        );
        const snap = await getDocs(ref);
        if (!snap.empty) {
          let allOrders = [];
          snap.forEach((doc) => allOrders.push(doc.data()));

          const filtered =
            selected === "All"
              ? allOrders
              : allOrders.filter((o) => o.shippingStatus === selected);

          setOrders(filtered);
        }
      } catch (error) {
        console.log("Error fetching orders: ", error);
      }
    }

    fetchOrders();
  }, [selected]);

  // Handlers to open confirmation popups
  const handleBan = () => {
    setConfirmationAction("ban");
    setPop(true);
  };

  const handleDelete = () => {
    setConfirmationAction("delete");
    setPop(true);
  };

  // Handle confirmed ban/delete action
  const handleAction = async () => {
    setSaving(true);
    try {
        
      const ref = doc(db, "users", user.userId);
      const snap = await getDoc(ref);

      if (confirmationAction === "ban") {
        const updated = { ...snap.data(), status: "Banned" };
        await setDoc(ref, updated);
      } else if (confirmationAction === "delete") {
        console.log("user", user)
        await updateDoc(doc(db, "users", user.userId), {
        forceLogout: true,
      });
     await deleteDoc(ref);
     const ordersRef = collection(db, "allOrders");
     const q = query(ordersRef, where("userId", "==", user.userId));
     const querySnapshot = await getDocs(q);
     querySnapshot.forEach( async (d) => {
      const iddoc = d.id
      const refdoc = doc(db, "allOrders", iddoc)
      await deleteDoc(refdoc)
     })

          const kordersRef = collection(db, "users");
     const k = query(kordersRef, where("userId", "!=", user.userId));
     const kquerySnapShot = await getDocs(k);
     let newUsers = []
     kquerySnapShot.forEach((D) => {
      const data = D.data()
      console.log("datas", data)
      newUsers.push(data)
     })
     console.log("usuarios en este moento", newUsers)
     setusers(newUsers)
      }

      setTimeout(() => {
        setPop(false);
        setSaving(false);
        setConfirmationAction("");
      }, 300);
    } catch (error) {
      console.log("Error updating user: ", error);
    }
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-2xl shadow-2xl p-6 h-5/6 w-full max-w-xl animate-fade-in-up relative overflow-y-auto">

        {/* Close modal button */}
        <button
          className="absolute top-3 right-3 text-gray-600 hover:text-black text-2xl font-bold"
          onClick={onclose}
        >
          ×
        </button>

        {/* User details */}
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2 text-slate-700">
            🧑 User Detail View
          </h2>
          <div className="w-40 h-40 overflow-hidden rounded-2xl">
            <img
              src={user.image || user.imageDefault}
              alt="User Profile"
              className="object-cover"
            />
          </div>
          <div className="space-y-1 text-gray-600">
            <div><strong>Name: </strong>{user.name}</div>
            <div><strong>Email: </strong>{user.email}</div>
            <div><strong>Phone: </strong>{user.phone}</div>
            <div><strong>Address: </strong>{user.address}</div>
          </div>
        </section>

        {/* Orders table */}
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2 text-slate-700">
            🛒 Orders
          </h2>
          <div className="flex flex-row items-start max-sm:flex-col gap-2">
            <div>Filter by status: </div>
            <select
              value={selected}
              onChange={(e) => setSelected(e.target.value)}
              className="border-2 border-solid border-black"
            >
              {orderStatuses.map((status, index) => (
                <option key={index} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>
          <br />
          {orders.length > 0 ? (
            <table>
              <thead>
                <tr className="bg-gray-500">
                  <th className="border-2 border-black">Order ID</th>
                  <th className="border-2 border-black">User</th>
                  <th className="border-2 border-black">Status</th>
                  <th className="border-2 border-black">Total</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order, index) => (
                  <tr key={index} className="bg-slate-300">
                    <td className="border-r border-2 border-black">{order.orderId}</td>
                    <td className="border-r border-2 border-black">{order.name}</td>
                    <td className="border-r border-2 border-black">{order.shippingStatus}</td>
                    <td className="border-r border-2 border-black">${order.totalPaid}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div>No orders found for this user or status.</div>
          )}
        </section>

        {/* Admin actions: Ban, Delete, Change Role */}
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2 text-slate-700">
            🔧 Ban / Delete / Change Role
          </h2>
          <div className="flex flex-row gap-2 max-sm:flex-col text-gray-600">
            <div
              className="bg-red-400 text-white cursor-pointer rounded-2xl p-3 hover:bg-red-500"
              onClick={handleBan}
            >
              <button>Ban</button>
            </div>
            <div
              className="bg-red-600 text-white cursor-pointer hover:bg-red-700 rounded-2xl p-3"
              onClick={handleDelete}
            >
              <button>Delete</button>
            </div>
            <div
              className="bg-green-400 text-white cursor-pointer hover:bg-green-500 rounded-2xl p-3"
              onClick={() => setChangeRol(true)}
            >
              <button>Change Role</button>
            </div>
          </div>

          {/* Role change modal */}
          {changeRol && (
            <ChangeRol
              setu={setu}
              u={user}
              setchangerol={() => setChangeRol(false)}
            />
          )}
        </section>

        {/* Edit user form */}
        <EditarUser user={user} setu={setu} />

        {/* Confirmation pop-up */}
        {pop && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-xl p-6 text-center shadow-lg">
              <p>Are you sure you want to {confirmationAction} this user?</p>
              <div className="flex justify-center gap-4 mt-4">
                <button
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                  onClick={handleAction}
                >
                  {saving ? "Processing..." : "Yes, continue"}
                </button>
                <button
                  className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
                  onClick={() => {
                    setPop(false);
                    setConfirmationAction("");
                    setSaving(false);
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ModalUserDetail;
