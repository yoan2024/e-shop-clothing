import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "../page/client/Home";

import Header from "./Header";
import ProductDetails from "../page/client/ProductDetails";
import Catalogo from "../page/client/Catalogo";
import { updateDoc } from "firebase/firestore";
import Footer from "./Footer";
import Login from "../page/client/Login";
import Sign_up from "../page/client/Sign_up";
import { useLocation } from "react-router-dom";
import { useUser } from "../context/User";
import PerfilUser from "../page/client/PerfilUser";
import { useCarrito } from "../context/Carrito";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/firebase-config";

import { setDoc } from "firebase/firestore";
import Favoritess from "../page/client/Favoritess";

const LayoutClient = () => {
  const { carrito, setCarrito } = useCarrito();

  const { user, setUser } = useUser();
  const [subTotal, setSubtotal] = useState(0);

  const [descuento, setDescuento] = useState(0);
  const [total, setTotal] = useState(0);
  const [toggle, setToggle] = useState(false);
  const [pagado, setPagado] = useState(false);
  const [cantidades, setCantidades] = useState({});

  useEffect(() => {
    const getCantidades = async () => {
      if (user) {
        const usuario = user.uid;
        const refDoc = doc(db, "Carrito", usuario);
        const getDocument = await getDoc(refDoc);
        if (getDocument.exists()) {
          const data = getDocument.data();
          const arrayItems = data.carrito;

          let objet = {};
          let total = 0;

          for (let index in arrayItems) {
            let id = arrayItems[index].id;
            let cantidadd = arrayItems[index].cantidad;
            total += arrayItems[index].total;
            objet[id] = cantidadd;
          }
          setTotal(total.toFixed(2));
          setCantidades(objet);
        }
      } else {
      }
    };

    getCantidades();
  }, [user, carrito]);

  const location = useLocation();

  const urls = ["/sign_up", "/login_in"];

  const includesUrls = urls.includes(location.pathname);

  async function handleCantidades(id, cantidad) {
    const idUser = user.uid;
    const prevCantidades = { ...cantidades, [id]: cantidad };
    const refDocument = doc(db, "Carrito", idUser);
    const getDocument = await getDoc(refDocument);
    if (getDocument.exists()) {
      const data = getDocument.data();
      const itemsCars = data.carrito;
      const newDocCarrito = itemsCars.map((i) => {
        if (id === i.id) {
          return { ...i, cantidad, total: cantidad * i.price };
        }
        return i;
      });

      setDoc(doc(db, "Carrito", idUser), {
        carrito: newDocCarrito,
      });
      setCarrito(newDocCarrito);
    }
    setCantidades(prevCantidades);
  }

  async function handleEliminarItem(id) {
    const userId = user.uid;
    const refData = doc(db, "Carrito", userId);
    const data = await getDoc(refData);
    if (data.exists()) {
      const getData = data.data();
      const getCars = getData.carrito;
      const eliminarItem = getCars.filter((i) => i.id !== id);
      setDoc(doc(db, "Carrito", userId), {
        carrito: eliminarItem,
      });
      setCarrito(eliminarItem);
    }
  }

  function generarID() {
    const fecha = new Date();

    const año = fecha.getFullYear();
    const mes = fecha.getMonth();
    const dia = fecha.getDay();
    const hora = fecha.getHours();
    const minuto = fecha.getMinutes();
    const segundo = fecha.getSeconds();
    const milisegundo = fecha.getMilliseconds();

    const pedid =
      `${año}` +
      `${mes}` +
      `${dia}` +
      `${hora}` +
      `${minuto}` +
      `${segundo}` +
      `${segundo}` +
      `${milisegundo}`;
    console.log(`PED-${pedid}`);
    return `PED-${pedid}`;
  }

  async function handlePagar() {
    if (!carrito) return;

    const idPed = generarID();
    const fechaPed = new Date().toLocaleDateString();
    const iduser = user.uid;
    const refdoc = doc(db, "pedidos", iduser);
    const getdoc = await getDoc(refdoc);

    const refuser = doc(db, "usuarios", iduser);
    const getuser = await getDoc(refuser);
    const datauserget = getuser.data();
    const datauser = datauserget.user;
    const itemsNew = carrito.map((i) => {
      return { ...i, estado: "Pendiente" };
    });
    const ped = {
      idPedido: idPed,
      fechaPedido: fechaPed,
      itemsPedido: itemsNew,
      totalPagado: total,
      estado: "Pendiente",
      direction: datauser.direction,
      telefono: datauser.telefono,
      nombre: datauser.name,
    };

    if (getdoc.exists()) {
      const currentP = getdoc.data();
      const currentPedidos = currentP.pedidos;
      console.log(currentPedidos, "cureenenne pedidos");
      await updateDoc(refdoc, {
        pedidos: [...currentPedidos, ped],
      });
    } else {
      setDoc(refdoc, {
        pedidos: [ped],
        historialPedidos: [],
      });
    }

    const refcarrito = doc(db, "Carrito", iduser);
    setDoc(refcarrito, {
      carrito: [],
    });
    setCarrito([]);
    setPagado(true);
  }
  console.log("current carrito", carrito);

  return (
    <>
      <Header togle={toggle} settogle={setToggle} />
      {/*SHOW ITEMS DEL CARRITO*/}

      {toggle && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="max-h-screen bg-white flex flex-row fixed max-w-md top-0  right-0 p-3">
            <div className="rounded-2xl w-full flex flex-col justify-between ">
              <div className="text-slate-600  flex flex-col p-4 gap-9 text-2xl">
                <div
                  className="cursor-pointer "
                  onClick={() => setToggle(!toggle)}
                >
                  X
                </div>
                <div className="font-bold">Shopping Bag</div>
              </div>
              {/*AQUI VAN LOS ITEMS DEL CARRITO*/}
              <div className=" overflow-hidden px-3 flex flex-col gap-10 overflow-y-scroll">
                {carrito.map((p, index) => {
                  return (
                    <React.Fragment key={index}>
                      <div className="flex flex-row gap-2 items-center justify-between  min-h-40">
                        <div className="w-28 h-32 bg-red-400">
                          {" "}
                          <img
                            src={p.image}
                            alt=""
                            className="w-full h-full"
                          />{" "}
                        </div>
                        <div className=" flex flex-col justify-between max-w-40 min-h-32">
                          <div className="line-clamp-2 ">{p.title}</div>
                          <div className="flex flex-col gap-2 ">
                            {" "}
                            <div className="mt-4">
                              <select
                                name=""
                                id=""
                                value={cantidades[p.id] || 1}
                                className="bordr-solid border-r-slate-500 border-2"
                                onChange={(e) =>
                                  handleCantidades(p.id, Number(e.target.value))
                                }
                              >
                                <option value="1">1</option>
                                <option value="2">2</option>
                                <option value="3">3</option>
                                <option value="4">4</option>
                                <option value="5">5</option>
                                <option value="6">6</option>
                              </select>
                              {/*aqui va un drop show for show opctions for cantidad  1 to 10*/}{" "}
                            </div>
                            <div className="text-slate-400">
                              ${p.price} USD for unit{" "}
                            </div>
                          </div>
                          <div className="font-bold">${p.total}</div>
                        </div>
                        <div
                          className="text-2xl cursor-pointer"
                          onClick={() => handleEliminarItem(p.id)}
                        >
                          🗑️
                        </div>
                      </div>
                    </React.Fragment>
                  );
                })}
              </div>
              <div className="text-slate-900 border-t-2 border-slate-200 flex flex-col p-6 gap-5 ">
                <div className="flex text-xl flex-row justify-between">
                  <div>subtotal: </div>
                  <div>$ {total} </div>
                </div>
                <div className="flex text-xl flex-row justify-between">
                  <div>descuento: </div>
                  <div>$ {descuento} </div>
                </div>
                <div className="flex flex-row text-2xl justify-between">
                  <div>Total:</div>
                  <div>${total} </div>
                </div>
                <div className="self-end">
                  <button
                    className="bg-green-400 rounded-2xl font-bold text-xl  py-2 px-1"
                    onClick={() => handlePagar()}
                  >
                    PAGAR
                  </button>
                </div>
              </div>
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
      {!includesUrls && <Footer />}
    </>
  );
};

export default LayoutClient;
