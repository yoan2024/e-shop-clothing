import { useState } from "react";
import { query, setDoc, where } from "firebase/firestore";
import { collection } from "firebase/firestore";
import { db } from "../firebase/firebase-config";
import { doc } from "firebase/firestore";
import { getDocs } from "firebase/firestore";
import { getDoc } from "firebase/firestore";

const EditarUser = ({ user, setu }) => {
  const [pop, setPop] = useState(false);
  const [nombre, setNombre] = useState(user.name);
  const [correo, setCorreo] = useState(user.correo);
  const [guardando, setGuardando] = useState(false);
  const [rol, setRol] = useState(user.rol);

  const handleGuardarCambios = async (e) => {
    setGuardando(true);
    e.preventDefault();
    if (nombre && correo) {
      try {
        console.log("asegurandome de datos", nombre, correo, rol, user.idUser);
        /*actualizando collecion de usuarios*/

        const refusuario = doc(db, "usuarios", user.idUser);
        const getref = await getDoc(refusuario);
        let data = getref.data();

        data = { ...data, name: nombre, correo: correo, rol: rol };
        console.log("data en este momentoooooooooooooooooooooooooooooo", data);
        await setDoc(refusuario, {
          ...data,
        });

        setu(data);

        console.log("updateuserrr", data);
        console.log("usuario actualizado con exito");

        /*actualizando collecion de todosPedidos*/
        const reftodospedidos = query(
          collection(db, "todosPedidos"),
          where("iduser", "==", user.idUser)
        );
        const getreftodospedidos = await getDocs(reftodospedidos);
        if (!getreftodospedidos.empty) {
          async function ActualizarTodoPedido(D) {
            let iddoc = D.id;

            let data = D.data();

            await setDoc(doc(db, "todosPedidos", iddoc), {
              ...data,
              nombre: nombre,
              correo: correo,
              rol: rol,
            });
          }
          getreftodospedidos.forEach((D) => {
            ActualizarTodoPedido(D);
          });
          console.log("todo actualizado correctamente");
          setGuardando(false);
          setPop(false);
        } else {
          console.log("no se incontrarondocs");
        }
      } catch (e) {
        console.log("errror", e);
      }
    }
  };
  return (
    <section>
      <h2 className="text-xl font-semibold mb-2 text-slate-700">
        🛠️ Editar usuario
      </h2>
      <div>
        {/* Aquí puedes añadir botones o selects para cambiar el estado del pedido */}
        <button
          className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg"
          onClick={() => setPop(true)}
        >
          Editar user
        </button>
      </div>

      {pop && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex flex-row justify-center items-center">
          <div className="bg-white rounded-2xl flex flex-col justify-center relative shadow-2xl   h-3/6 w-full max-w-xs ">
            <div
              className="absolute top-2 right-2 border-2 p-1 hover:bg-slate-600 cursor-pointer border-solid border-black rounded-full "
              onClick={() => {
                setPop(false);
                setNombre("");
                setCorreo("");
                setRol("");
              }}
            >
              X
            </div>
            <div className="p-2">
              <form
                onSubmit={handleGuardarCambios}
                className="flex flex-col gap-4"
              >
                <div>Cambiar nombre:</div>
                <input
                  className="border-2 border-solid border-black rounded-xl"
                  type="text"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  placeholder="Nombre"
                />
                <div>Cambiar email:</div>

                <input
                  className="border-2 border-solid border-black rounded-xl"
                  type="email"
                  value={correo}
                  onChange={(e) => setCorreo(e.target.value)}
                  placeholder="Correo"
                />

                <div>Cambiar rol:</div>
                <select
                  className="border-2 border-solid border-black"
                  value={rol}
                  onChange={(e) => setRol(e.target.value)}
                >
                  <option value="user">Usuario</option>
                  <option value="admin">Administrador</option>
                </select>

                <button
                  disabled={guardando === true}
                  type="submit"
                  className="bg-green-600"
                >
                  {guardando ? "Guardando...." : "Guardar cambios"}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default EditarUser;
