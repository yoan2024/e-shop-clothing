import {
  collection,
  deleteDoc,
  orderBy,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../firebase/firebase-config";
import { getDocs } from "firebase/firestore";
import ChangeRol from "./ChangeRol";
import { doc } from "firebase/firestore";

const estadosOrdenes = [
  "All",
  "Preparando",
  "No enviado",
  "Repartidor asignado",
  "En camino",
  "En zona de entrega",
  "Intento fallido",
  "Reprogramado",
  "Entregado",
  "Devuelto",
];

const ModalUserDetail = ({ user, onclose, setu }) => {
  const [changeRol, setChangeRol] = useState(false);
  const [selected, setSelected] = useState("All");
  const [orders, setOrders] = useState([]);

  const [pop, setPop] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [textPop, setTextPop] = useState("");

  useEffect(() => {
    async function getPedidos() {
      try {
        const refdoc = query(
          collection(db, "todosPedidos"),
          where("correo", "==", user.correo)
        );

        console.log("user correo: ", user.correo);
        const getrefdoc = await getDocs(refdoc);
        console.log("getdocccccccc", getrefdoc);
        if (!getrefdoc.empty) {
          let peds = [];
          getrefdoc.forEach((d) => {
            peds.push(d.data());
          });
          const filteredOrders =
            selected === "All"
              ? peds
              : peds.filter((order) => order.envio === selected);
          setOrders(filteredOrders);
        } else {
          console.log("hubo un problema no se incontraron documentos");
        }
      } catch (e) {
        console.log("eeror: ", e);
      }
    }

    getPedidos();
  }, [selected]);

  console.log("currnet orders", orders);
  const handlebanner = () => {
    setTextPop("bannear");
    setPop(true);
  };

  const handledelete = () => {
    setTextPop("borrar");
    setPop(true);
  };

  const handleAction = async () => {
    setGuardando(true);
    try {
      const refdoc = query(
        collection(db, "usuarios"),
        where("correo", "==", user.correo)
      );

      console.log("user correo: ", user.correo);
      const getrefdoc = await getDocs(refdoc);
      console.log("getdocccccccc", getrefdoc);
      if (!getrefdoc.empty) {
        let us = [];
        let iddoc;
        getrefdoc.forEach((d) => {
          iddoc = d.id;
          us.push(d.data());
        });

        if (textPop === "bannear") {
          let updateuser = { ...us[0], estatus: "Banned" };

          await setDoc(doc(db, "usuarios", iddoc), {
            ...updateuser,
          });

          console.log("ususario update correctamente", updateuser);
          setTimeout(() => {
            setPop(false);
          }, 300);
          setTextPop("");
        } else if (textPop === "borrar") {
          await deleteDoc(doc(db, "usuarios", iddoc));
          console.log("ussuario borrado correctamente");
          setTimeout(() => {
            setPop(false);
          }, 300);
          setTextPop("");
        }
      } else {
        console.log("hubo un problema no se incontraron documentos");
      }
    } catch (e) {
      console.log("eeror: ", e);
    }
  };
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-2xl   shadow-2xl p-6 h-5/6 w-full max-w-xl   animate-fade-in-up relative overflow-y-hidden overflow-y-scroll">
        {/* Botón cerrar */}
        <button
          className="absolute top-3 right-3 text-gray-600 hover:text-black text-2xl font-bold"
          onClick={onclose}
        >
          ×
        </button>

        {/* Cliente */}
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2 text-slate-700">
            🧑 User Detail view
          </h2>
          <div className="w-40 h-40">
            <img
              src="/images/default-profile-picture.jpg"
              alt=""
              className="w-full h-full"
            />
          </div>
          <div className="space-y-1 text-gray-600">
            <div>
              <strong>Nombre: </strong>
              {user.name}
            </div>
            <div>
              <strong>Email: </strong>
              {user.correo}
            </div>
            <div>
              <strong>Teléfono: </strong>
              {user.telefono}
            </div>
            <div>
              <strong>Dirección: </strong>
              {user.direction}
            </div>
          </div>
        </section>

        {/* Pedido */}
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2 text-slate-700">
            🛒 Pedido
          </h2>

          {orders.length > 0 ? (
            <>
              <div className="flex flex-row items-start max-sm:flex-col gap-2">
                <div>Filtrar por estado: </div>
                <select
                  name=""
                  id=""
                  value={selected}
                  onChange={(e) => setSelected(e.target.value)}
                  className="border-2 border-solid border-black"
                >
                  {estadosOrdenes.map((o) => {
                    return <option value={o}>{o}</option>;
                  })}
                </select>
              </div>
              <br />
              <table>
                <thead>
                  <tr className="bg-gray-500">
                    <th className="border-2 border-solid border-black">
                      Order ID
                    </th>
                    <th className="border-2 border-solid border-black">User</th>
                    <th className="border-2 border-solid border-black">
                      Status
                    </th>
                    <th className="border-2 border-solid border-black">
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((o) => {
                    return (
                      <tr className="bg-slate-300">
                        <td className="border-r border-2 border-solid border-black">
                          {o.idPedido}
                        </td>
                        <td className="border-r border-2 border-solid border-black">
                          {o.nombre}
                        </td>
                        <td className="border-r border-2 border-solid border-black">
                          {o.envio}
                        </td>
                        <td className="border-r border-2 border-solid border-black">
                          ${o.totalPagado}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </>
          ) : (
            <div>ESTE USUARIO NO HA ECHO NINGUN PEDIDO.</div>
          )}
        </section>

        {/* Envío */}
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2 text-slate-700">
            BANEAR/ELIMINAR/CHANGE ROL
          </h2>
          <div className="space-y-1 items-center gap-2 text-gray-600 max-sm:flex-col flex flex-row">
            <div
              className="bg-red-400 text-white cursor-pointer rounded-2xl p-3 hover:bg-red-500"
              onClick={handlebanner}
            >
              <buttom>Banner</buttom>
            </div>
            <div
              className="bg-red-600 text-white cursor-pointer hover:bg-red-700 rounded-2xl p-3"
              onClick={handledelete}
            >
              <button>Delete</button>
            </div>
            <div
              className="bg-green-400 text-white cursor-pointer hover:bg-green-500 rounded-2xl p-3"
              onClick={() => setChangeRol(true)}
            >
              <button>Change rol</button>
            </div>
          </div>
          {changeRol && (
            <ChangeRol
              setu={setu}
              u={user}
              setchangerol={() => setChangeRol(false)}
            />
          )}
        </section>

        {/* Cambiar estado (placeholder) */}
        <section>
          <h2 className="text-xl font-semibold mb-2 text-slate-700">
            🛠️ Acciones
          </h2>
          <div>
            {/* Aquí puedes añadir botones o selects para cambiar el estado del pedido */}
            <button className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg">
              Cambiar estado del pedido
            </button>
          </div>
        </section>
      </div>
      {pop && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-2xl flex flex-col justify-center relative shadow-2xl   h-2/6 w-full max-w-xs ">
            <div
              className="absolute cursor-pointer top-0 left-0 hover:bg-slate-600 p-1 w-fit"
              onClick={() => {
                setTextPop("");
                setPop(false);
              }}
            >
              X
            </div>
            <div className="flex flex-col items-center gap-5">
              <div className="text-center text-2xl">
                Estas seguro de que quieres {textPop} esta persona?
              </div>
              {guardando ? (
                <button className="bg-slate-700 p-3 rounded-2xl">
                  Guardando Cambios.....
                </button>
              ) : (
                <button
                  className="bg-red-700 p-3 rounded-2xl"
                  onClick={() => handleAction()}
                >
                  Si {textPop}{" "}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ModalUserDetail;
