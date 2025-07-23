import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { collection, doc, getDoc, setDoc, addDoc } from "firebase/firestore";
import { db } from "../firebase/firebase-config";
import { useCar } from "../context/Car";
import { useUser } from "../context/User";

import Home from "../page/client/Home";
import PaymentSuccess from "./PagadoConexito";
import Header from "./Header";
import Footer from "./Footer";
import ProductDetails from "../page/client/ProductDetails";
import Catalog from "../page/client/Catalog";
import Login from "../page/client/Login";
import SignUp from "../page/client/Sign_up";
import UserProfile from "../page/client/UserProfile";
import Favorites from "../page/client/Favoritess";

const LayoutClient = () => {
  const { car, setCar } = useCar();
  const { user } = useUser();
  const [quantities, setQuantities] = useState({});
  const [total, setTotal] = useState(0);
  const [toggle, setToggle] = useState(false);
  const [paid, setPaid] = useState(false);

  const location = useLocation();
  const hiddenRoutes = ["/sign_up", "/login_in"];

  useEffect(() => {
    if (!user) return;

    const fetchCart = async () => {
      const refDoc = doc(db, "Carrito", user.uid);
      const docSnap = await getDoc(refDoc);

      if (docSnap.exists()) {
        const items = docSnap.data().carrito || [];
        let newQuantities = {},
          newTotal = 0;

        items.forEach(({ id, cantidad, total }) => {
          newQuantities[id] = cantidad;
          newTotal += total;
        });

        setQuantities(newQuantities);
        setTotal(Number(newTotal).toFixed(2));
      }
    };

    fetchCart();
  }, [user, car]);

  const handleQuantityChange = async (id, quantity) => {
    if (!user) return;

    const ref = doc(db, "Carrito", user.uid);
    const docSnap = await getDoc(ref);

    if (docSnap.exists()) {
      const items = docSnap.data().carrito.map((item) =>
        item.id === id
          ? { ...item, cantidad: quantity, total: item.price * quantity }
          : item
      );
      await setDoc(ref, { carrito: items });
      setCar(items);
      setQuantities((prev) => ({ ...prev, [id]: quantity }));
    }
  };

  const handleRemoveItem = async (id) => {
    if (!user) return;

    const ref = doc(db, "Carrito", user.uid);
    const docSnap = await getDoc(ref);

    if (docSnap.exists()) {
      const filtered = docSnap.data().carrito.filter((item) => item.id !== id);
      await setDoc(ref, { carrito: filtered });
      setCar(filtered);
    }
  };

  const generateOrderID = () => {
    const now = new Date();
    return `ORD-${now.getFullYear()}${now.getMonth()}${now.getDate()}${now.getHours()}${now.getMinutes()}${now.getSeconds()}${now.getMilliseconds()}`;
  };

  const handleCheckout = async () => {
    if (!user || car.length === 0) return;

    const orderId = generateOrderID();
    const orderDate = new Date().toLocaleDateString();
    const refUser = doc(db, "usuarios", user.uid);
    const userSnap = await getDoc(refUser);

    if (!userSnap.exists()) return;

    const userData = userSnap.data();

    const order = {
      orderId,
      paymentMethod: "Credit Card",
      orderDate,
      shippingStatus: "Processing",
      orderedItems: car,
      email: userData.correo,
      totalPaid: total,
      status: "Pending",
      role: userData.rol,
      address: userData.direction,
      phone: userData.telefono,
      name: userData.name,
      userId: user.uid,
    };

    await addDoc(collection(db, "todosPedidos"), order);
    await setDoc(doc(db, "Carrito", user.uid), { carrito: [] });
    setCar([]);
    setPaid(true);
  };

  return (
    <>
      {!hiddenRoutes.includes(location.pathname) && (
        <Header toggle={toggle} setToggle={setToggle} />
      )}

      {toggle && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-end z-50">
          <div className="bg-white p-4 w-full max-w-md h-full overflow-y-auto">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">Shopping Bag</h2>
              <button onClick={() => setToggle(false)}>X</button>
            </div>

            <div className="mt-4">
              {car.map((item, idx) => (
                <div key={idx} className="flex gap-4 mb-4">
                  <img
                    src={item.image}
                    alt=""
                    className="w-24 h-24 object-cover"
                  />
                  <div className="flex-1">
                    <p className="font-semibold line-clamp-2">{item.title}</p>
                    <select
                      className="border mt-2"
                      value={quantities[item.id] || 1}
                      onChange={(e) =>
                        handleQuantityChange(item.id, Number(e.target.value))
                      }
                    >
                      {[...Array(10)].map((_, i) => (
                        <option key={i + 1} value={i + 1}>
                          {i + 1}
                        </option>
                      ))}
                    </select>
                    <p className="text-gray-500">${item.price} USD per unit</p>
                    <p className="font-bold">${item.total}</p>
                  </div>
                  <button onClick={() => handleRemoveItem(item.id)}>
                    🗑️
                  </button>
                </div>
              ))}
            </div>

            <div className="border-t pt-4 mt-4">
              <p>Subtotal: ${total}</p>
              <p>Discount: $0</p>
              <p className="font-bold">Total: ${total}</p>
              <button
                className="bg-green-500 text-white px-4 py-2 rounded mt-2"
                onClick={handleCheckout}
              >
                PAY
              </button>
            </div>
          </div>
        </div>
      )}

      {paid && <PaymentSuccess onClose={() => setPaid(false)} />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/userProfile" element={<UserProfile />} />
        <Route path="/catalog/:category" element={<Catalog />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/sign_up" element={<SignUp />} />
        <Route path="/login_in" element={<Login />} />
      </Routes>

      {!hiddenRoutes.includes(location.pathname) && <Footer />}
    </>
  );
};

export default LayoutClient;
