import { useState } from "react";
import { db } from "../firebase/firebase-config";
import { collection, where } from "firebase/firestore";
import { query } from "firebase/firestore";
import { getDocs } from "firebase/firestore";
import { getDoc } from "firebase/firestore";
import { doc } from "firebase/firestore";
import { orderBy } from "firebase/firestore";
import { setDoc } from "firebase/firestore";

{
  /**/
}

const CambiarEstado = ({ onclose, pedido, setPedidos, setpd }) => {
  const [envio, setEnvio] = useState(pedido.envio);
  const [estado, setEstado] = useState(pedido.estado);

  const handleGuardar = async () => {
    const iduser = pedido.iduser;
    const refdoc = query(
      collection(db, "todosPedidos"),
      where("idPedido", "==", pedido.idPedido)
    );
    const getdoc = await getDocs(refdoc);

    let p = {};
    let iddoc;
    getdoc.forEach((d) => {
      if (d.exists()) {
        const data = d.data();
        p = data;
        iddoc = d.id;
      } else {
        console.log("el documento no existe");
      }
    });
    const refuserpedido = doc(db, "todosPedidos", iddoc);

    console.log("pedido antes de guargarrr", p);
    const pedidoActualizado = { ...p, envio, estado };
    setpd(pedidoActualizado);
    await setDoc(refuserpedido, pedidoActualizado);
    console.log("actuaizado con exito en todos pedidos");

    const refdocument = collection(db, "todosPedidos");
    const organizardocs = query(refdocument, orderBy("fechaPedido", "desc"));
    let peds = [];
    const getdocs = await getDocs(organizardocs);
    getdocs.forEach((d) => {
      const data = d.data();
      console.log("dataaaaaaa de un pedido", data);
      peds.push(data);
    });

    console.log("pedidos justo ante de actualizarlo", peds);
    setPedidos(peds);

    console.log("pedidos acyualizados estate correctamente");
    onclose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex flex-row  justify-center items-center">
      <div className="bg-white rounded-2xl    shadow-2xl p-6 h-4/6 w-full max-w-xs   animate-fade-in-up relative flex flex-col justify-center">
        <div
          className="absolute top-0 right-0 p-2 cursor-pointer hover:bg-slate-400 "
          onClick={onclose}
        >
          X
        </div>

        <div className="flex flex-col  justify-center items-center gap-3 h-full">
          <div className="flex flex-row justify-center">
            <div className="text-xl flex-1">Cambiar estado de envio</div>
            <select
              name="envio"
              value={envio}
              onChange={(e) => {
                setEnvio(e.target.value);
                console.log("valuess", e.target.value);
              }}
              id=""
              className="border-2 flex-1 border-solid  border-black"
            >
              <option value="Preparando">Preparando</option>
              <option value="No enviado">No enviado</option>
              <option value="Repartidor Asignado">Repartidor Asignado</option>
              <option value="En camino">En camino</option>
              <option value="En zona de entrega">En zona de entrega</option>
              <option value="Intento fallido">Intento fallido</option>
              <option value="Reprogramado">Reprogramado</option>
              <option value="Entregado">Entregado</option>
              <option value="Devuelto">Devuelto</option>
            </select>
          </div>
          <div className="flex flex-row justify-center">
            <div className="text-xl flex-1">Cambiar estado de pedido</div>
            <select
              value={estado}
              name="estado"
              onChange={(e) => setEstado(e.target.value)}
              id=""
              className="border-2 flex-1  border-solid  border-black"
            >
              <option value="Pendiente">Pendiente</option>
              <option value="En camino">En camino</option>
              <option value="Entregado">Entregado</option>
              <option value="Cancelado">Cancelado</option>
            </select>
          </div>
          <div></div>
        </div>
        <button
          className="p-2 bg-green-400 w-fit m-auto rounded-xl"
          onClick={handleGuardar}
        >
          Guardar
        </button>
      </div>
    </div>
  );
};

export default CambiarEstado;
<select
  name=""
  id=""
  className="border-2 border-solid flex-1  border-black"
></select>;
