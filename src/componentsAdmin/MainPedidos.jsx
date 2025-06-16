import { db } from "../firebase/firebase-config";
import { query } from "firebase/firestore";
import { collection } from "firebase/firestore";
import { orderBy } from "firebase/firestore";
import { useEffect, useState } from "react";
import ModalDetailsPedido from "./ModalDetailsPedido.jsx";
import { getDocs } from "firebase/firestore";

const MainPedidos = () => {
  const [pedidos, setPedidos] = useState([]);
  const [onClose, setOnClose] = useState(false);
  const [pd, setpd] = useState(null);

  useEffect(() => {
    async function name(params) {
      try {
        const refdoc = collection(db, "todosPedidos");
        const organizardocs = query(refdoc, orderBy("fechaPedido", "desc"));
        let peds = [];
        const getdocs = await getDocs(organizardocs);
        if (getdocs.empty) {
          console.log("Documento sin nada en useefct");
        }
        getdocs.forEach((d) => {
          console.log("dataaaaaaaaaaaaaaaaaaaaaaaaa", d.data());
        });
        getdocs.forEach((d) => {
          const data = d.data();
          console.log("dataaaaaaa de un pedido", data);
          peds.push(data);
        });
        console.log("pedios en useefect", peds);
        setPedidos(peds);
      } catch (e) {
        console.log("Eror", e);
      }
    }
    name();
  }, []);

  const handleClickDetails = (p) => {
    setpd(p);
    setOnClose(true);
  };
  console.log("curent pedidos", pedidos);
  return (
    <div className="w-4/5 flex flex-col items-center">
      {pedidos.length > 0 ? (
        <>
          <div className="text-center mt-7 text-4xl">PEDIDOS</div>
          <div>
            <table className="text-xl text-center">
              <thead className="bg-slate-300">
                <tr>
                  <th>Pedido ID</th>
                  <th>Cliente</th>
                  <th>Fecha</th>
                  <th>estado</th>
                  <th>Total</th>
                  <th>Pago</th>
                  <th>Envio</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody className="bg-slate-200">
                {pedidos.map((p, index) => {
                  return (
                    <tr
                      key={index}
                      onClick={() => handleClickDetails(p)}
                      className="cursor-pointer"
                    >
                      <td className="border-2 p-1 border-solid cursor-pointer border-black">
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
                        {p.metodoPago}{" "}
                      </td>
                      <td className="border-2 p-1 border-solid border-black">
                        {p.envio || "preparando"}
                      </td>
                      <td className="border-2 p-1 border-solid border-black">
                        Editar/Ver
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
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
        <div className="text-5xl">Ups No hay pedidos haun</div>
      )}
    </div>
  );
};

export default MainPedidos;
