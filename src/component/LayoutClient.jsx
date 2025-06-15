import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import {
  collection,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase/firebase-config";
import { useCarrito } from "../context/Carrito";
import { useUser } from "../context/User";

import Home from "../page/client/Home";
import PagadoConexito from "./PagadoConexito";
import Header from "./Header";
import Footer from "./Footer";
import ProductDetails from "../page/client/ProductDetails";
import Catalogo from "../page/client/Catalogo";
import Login from "../page/client/Login";
import Sign_up from "../page/client/Sign_up";
import PerfilUser from "../page/client/PerfilUser";
import Favoritess from "../page/client/Favoritess";

const LayoutClient = () => {
  const { carrito, setCarrito } = useCarrito();
  const { user } = useUser();
  const [cantidades, setCantidades] = useState({});
  const [total, setTotal] = useState(0);
  const [toggle, setToggle] = useState(false);
  const [pagado, setPagado] = useState(false);

  const location = useLocation();
  const hiddenRoutes = ["/sign_up", "/login_in"];

  useEffect(() => {
    if (!user) return;

    const fetchCarrito = async () => {
      const refDoc = doc(db, "Carrito", user.uid);
      const docSnap = await getDoc(refDoc);

      if (docSnap.exists()) {
        const items = docSnap.data().carrito || [];
        let newCantidades = {},
          newTotal = 0;

        items.forEach(({ id, cantidad, total }) => {
          newCantidades[id] = cantidad;
          newTotal += total;
        });

        setCantidades(newCantidades);
        setTotal(newTotal.toFixed(2));
      }
    };

    fetchCarrito();
  }, [user, carrito]);

  const handleCantidad = async (id, cantidad) => {
    if (!user) return;

    const ref = doc(db, "Carrito", user.uid);
    const docSnap = await getDoc(ref);

    if (docSnap.exists()) {
      const items = docSnap
        .data()
        .carrito.map((item) =>
          item.id === id
            ? { ...item, cantidad, total: item.price * cantidad }
            : item
        );
      await setDoc(ref, { carrito: items });
      setCarrito(items);
      setCantidades((prev) => ({ ...prev, [id]: cantidad }));
    }
  };

  const handleEliminarItem = async (id) => {
    if (!user) return;

    const ref = doc(db, "Carrito", user.uid);
    const docSnap = await getDoc(ref);

    if (docSnap.exists()) {
      const filtered = docSnap.data().carrito.filter((item) => item.id !== id);
      await setDoc(ref, { carrito: filtered });
      setCarrito(filtered);
    }
  };

  const generarID = () => {
    const now = new Date();
    return `PED-${now.getFullYear()}${now.getMonth()}${now.getDate()}${now.getHours()}${now.getMinutes()}${now.getSeconds()}${now.getMilliseconds()}`;
  };

  const handlePagar = async () => {
    if (!user || carrito.length === 0) return;

    const idPedido = generarID();
    const fechaPedido = new Date().toLocaleDateString();
    const refUser = doc(db, "usuarios", user.uid);
    const userSnap = await getDoc(refUser);

    if (!userSnap.exists()) return;

    const userData = userSnap.data().user;
    const items = carrito.map((p) => ({ ...p, estado: "Pendiente" }));

    const pedido = {
      idPedido,
      metodoPago: "Cart Credit",
      fechaPedido,
      envio: "preparando",
      itemsPedido: items,
      correo: userData.correo,
      totalPagado: total,
      estado: "Pendiente",
      direction: userData.direction,
      telefono: userData.telefono,
      nombre: userData.name,
      iduser: user.uid,
    };

    const refPedidos = doc(db, "pedidos", user.uid);
    const pedidosSnap = await getDoc(refPedidos);

    if (pedidosSnap.exists()) {
      const prevPedidos = pedidosSnap.data().pedidos || [];
      await updateDoc(refPedidos, { pedidos: [...prevPedidos, pedido] });
    } else {
      await setDoc(refPedidos, { pedidos: [pedido], historialPedidos: [] });
    }

    await addDoc(collection(db, "todosPedidos"), pedido);

    await setDoc(doc(db, "Carrito", user.uid), { carrito: [] });
    setCarrito([]);
    setPagado(true);
  };

  return (
    <>
      <Header togle={toggle} settogle={setToggle} />

      {toggle && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-end z-50">
          <div className="bg-white p-4 w-full max-w-md h-full overflow-y-auto">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">Shopping Bag</h2>
              <button onClick={() => setToggle(false)}>X</button>
            </div>

            <div className="mt-4">
              {carrito.map((item, idx) => (
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
                      value={cantidades[item.id] || 1}
                      onChange={(e) =>
                        handleCantidad(item.id, Number(e.target.value))
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
                  <button onClick={() => handleEliminarItem(item.id)}>
                    🗑️
                  </button>
                </div>
              ))}
            </div>

            <div className="border-t pt-4 mt-4">
              <p>Subtotal: ${total}</p>
              <p>Descuento: $0</p>
              <p className="font-bold">Total: ${total}</p>
              <button
                className="bg-green-500 text-white px-4 py-2 rounded mt-2"
                onClick={handlePagar}
              >
                PAGAR
              </button>
            </div>
          </div>
        </div>
      )}

      {pagado && <PagadoConexito onClose={() => setPagado(false)} />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/favorites" element={<Favoritess />} />
        <Route path="/perfilUser" element={<PerfilUser />} />
        <Route path="/catalogo/:category" element={<Catalogo />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/sign_up" element={<Sign_up />} />
        <Route path="/login_in" element={<Login />} />
      </Routes>

      {!hiddenRoutes.includes(location.pathname) && <Footer />}
    </>
  );
};

export default LayoutClient;
