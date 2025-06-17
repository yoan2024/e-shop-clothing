import {
  collection,
  deleteDoc,
  getDoc,
  orderBy,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { useImage } from "../context/Image";
import { db } from "../firebase/firebase-config";
import { getDocs } from "firebase/firestore";
import ChangeRol from "./ChangeRol";
import { doc } from "firebase/firestore";
import EditarUser from "./EditarUser";

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
  const { url, setUrl } = useImage();
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

        const getrefdoc = await getDocs(refdoc);
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
        }
      } catch (e) {
        console.log("eeror: ", e);
      }
    }

    getPedidos();
  }, [selected]);

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
      const refdoc = doc(db, "usuarios", user.idUser);
      const getdoc = await getDoc(refdoc);

      if (textPop === "bannear") {
        let updateuser = { ...getdoc.data(), estatus: "Banned" };
        await setDoc(refdoc, updateuser);
        setTimeout(() => {
          setPop(false);
          setGuardando(false);
        }, 300);
        setTextPop("");
      } else if (textPop === "borrar") {
        await deleteDoc(refdoc);
        setTimeout(() => {
          setPop(false);
          setGuardando(false);
        }, 300);
        setTextPop("");
      }
    } catch (e) {
      console.log("eeror: ", e);
    }
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-2xl shadow-2xl p-6 h-5/6 w-full max-w-xl animate-fade-in-up relative overflow-y-auto">
        <button
          className="absolute top-3 right-3 text-gray-600 hover:text-black text-2xl font-bold"
          onClick={onclose}
        >
          ×
        </button>

        {/* Detalles del usuario */}
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2 text-slate-700">
            🧑 User Detail view
          </h2>
          <div className="w-40 h-40 overflow-hidden rounded-2xl">
            <img
              src={user.image || user.imageDefault}
              alt=""
              className="object-cover"
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

        {/* Pedidos */}
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2 text-slate-700">
            🛒 Pedido
          </h2>
          <div className="flex flex-row items-start max-sm:flex-col gap-2">
            <div>Filtrar por estado: </div>
            <select
              value={selected}
              onChange={(e) => setSelected(e.target.value)}
              className="border-2 border-solid border-black"
            >
              {estadosOrdenes.map((o, i) => (
                <option key={i} value={o}>
                  {o}
                </option>
              ))}
            </select>
          </div>
          <br />
          {orders.length > 0 ? (
            <table>
              <thead>
                <tr className="bg-gray-500">
                  <th className="border-2 border-solid border-black">
                    Order ID
                  </th>
                  <th className="border-2 border-solid border-black">User</th>
                  <th className="border-2 border-solid border-black">Status</th>
                  <th className="border-2 border-solid border-black">Total</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o, i) => (
                  <tr key={i} className="bg-slate-300">
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
                ))}
              </tbody>
            </table>
          ) : (
            <div>
              ESTE USUARIO NO HA HECHO NINGÚN PEDIDO O EN ESTE ESTADO NO HAY
              PEDIDOS.
            </div>
          )}
        </section>

        {/* Acciones */}
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2 text-slate-700">
            BANEAR / ELIMINAR / CAMBIAR ROL
          </h2>
          <div className="space-y-1 items-center gap-2 text-gray-600 max-sm:flex-col flex flex-row">
            <div
              className="bg-red-400 text-white cursor-pointer rounded-2xl p-3 hover:bg-red-500"
              onClick={handlebanner}
            >
              <button>Banear</button>
            </div>
            <div
              className="bg-red-600 text-white cursor-pointer hover:bg-red-700 rounded-2xl p-3"
              onClick={handledelete}
            >
              <button>Eliminar</button>
            </div>
            <div
              className="bg-green-400 text-white cursor-pointer hover:bg-green-500 rounded-2xl p-3"
              onClick={() => setChangeRol(true)}
            >
              <button>Cambiar rol</button>
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

        {/* Editar datos */}
        <EditarUser user={user} setu={setu} />

        {/* Confirmación de acción */}
        {pop && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-xl p-6 text-center shadow-lg">
              <p>¿Estás seguro de que deseas {textPop} este usuario?</p>
              <div className="flex justify-center gap-4 mt-4">
                <button
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                  onClick={handleAction}
                >
                  {guardando ? "Procesando..." : "Sí, continuar"}
                </button>
                <button
                  className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
                  onClick={() => {
                    setPop(false);
                    setTextPop("");
                    setGuardando(false);
                  }}
                >
                  Cancelar
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
