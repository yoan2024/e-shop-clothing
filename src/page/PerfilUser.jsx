import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { useUser } from "../context/User";
import { FaPencilAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useCarrito } from "../context/Carrito";
import ProfilePhotoUpdater from "../component/ProfilePhotoUpdater";

const PerfilUsuario = () => {
  const { carrito, setCarrito } = useCarrito();
  const navigate = useNavigate();
  const { usuario, setUsuario } = useUser();
  const pedidosRef = useRef < HTMLDivElement > null;
  const location = useLocation();

  //
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [telefono, setTelefono] = useState("");
  const [direction, setDirections] = useState("");
  const [disable, setDisable] = useState([]);

  const handleClick = (e) => {
    if (e === "name") {
      setDisable(["name"]);
    } else if (e === "telefono") {
      setDisable(["telefono"]);
    } else if (e === "email") {
      setDisable((prev) => [...prev, "email"]);
    }
  };

  const handleGuardar = (e) => {
    if (e === "name") {
      const newDisables = [...disable].filter((i) => i !== "name");
      setDisable(newDisables);
    }
  };

  return (
    <div className="bg-slate-300 min-h-screen flex flex-row justify-center items-start">
      <div className="flex flex-col items-center">
        <section className="mt-2  flex flex-col items-start gap-5 ">
          <div className="text-3xl font-medium text-center">
            INFORMACION PERSONAL
          </div>
          <div className="flex flex-row mt-5 justify-center">
            <ProfilePhotoUpdater />
            {/* <div className="w-48 h-48">
              <img
                src="/images/perfilFake/avatar.png"
                alt=""
                className="w-full h-full cursor-pointer hover:bg-white/50  rounded-full"
              />
            </div>*/}
          </div>
          {disable.includes("name") && (
            <div className="flex justify-center items-center felx-row gap-2">
              <div>
                <label htmlFor="name">name: </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="rounded-xl"
                />
              </div>
              <div>
                <button
                  className=" p-1 rounded-xl bg-red-700"
                  onClick={() => handleGuardar("name")}
                >
                  guardar
                </button>
              </div>
            </div>
          )}

          {!disable.includes("name") && (
            <div className="flex flex-row gap-2 items-center">
              <div className=" ">Nombre Completo :</div>
              <div className="flex flex-row items-center gap-2">
                <div className="">Yoan sebastian </div>
                <div
                  className="w-6 h-6  group"
                  onClick={() => handleClick("name")}
                >
                  <FaPencilAlt className="w-full h-full cursor-pointer" />
                  <div className="w-fit bottom-full text-sm text-blue-300 transition-opacity opacity-0 duration-200 group-hover:opacity-100 ">
                    Editar
                  </div>
                </div>
              </div>
            </div>
          )}

          {disable.includes("email") && (
            <div className="flex justify-center items-center felx-row gap-2">
              <div>
                <label htmlFor="email">email:</label>
                <input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="rounded-xl"
                />
              </div>
              <div>
                <button
                  className=" p-1 rounded-xl bg-red-700"
                  onClick={() => handleGuardar("email")}
                >
                  guardar
                </button>
              </div>
            </div>
          )}
          {!disable.includes("email") && (
            <div className="flex flex-row  gap-2 items-center">
              <div className=" ">Correo :</div>
              <div className="flex flex-row items-center gap-2">
                <div className="">"Yoan@gmail.com</div>
                <div
                  className="w-6 h-6  group"
                  onClick={() => handleClick("email")}
                >
                  <FaPencilAlt className="w-full h-full cursor-pointer" />
                  <div className="w-fit bottom-full text-sm text-blue-300 transition-opacity opacity-0 duration-200 group-hover:opacity-100 ">
                    Editar
                  </div>
                </div>
              </div>
            </div>
          )}
          {disable.includes("telefono") && (
            <div className="flex justify-center items-center felx-row gap-2">
              <div>
                <label htmlFor="telefono">telefono:</label>
                <input
                  type="text"
                  value={telefono}
                  onChange={(e) => setTelefono(e.target.value)}
                  className="rounded-xl"
                />
              </div>
              <div>
                <button
                  className=" p-1 rounded-xl bg-red-700"
                  onClick={() => handleGuardar("telefono")}
                >
                  guardar
                </button>
              </div>
            </div>
          )}
          {!disable.includes("telefono") && (
            <div className="flex flex-row  gap-2 items-center">
              <div className=" ">Telefono :</div>
              <div className="flex flex-row items-center gap-2">
                <div className="">
                  {/* {currentUser.telefono
                    ? "Sin con firmar"
                    : currentUser.telefono}{" "}*/}
                  sin confirmar
                </div>
                <div
                  className="w-6 h-6  group"
                  onClick={() => handleClick("telefono")}
                >
                  <FaPencilAlt className="w-full h-full cursor-pointer" />
                  <div className="w-fit bottom-full text-sm text-blue-300 transition-opacity opacity-0 duration-200 group-hover:opacity-100 ">
                    Editar
                  </div>
                </div>
              </div>
            </div>
          )}
          {disable.includes("direction") && (
            <div className="flex justify-center items-center felx-row gap-2">
              <div>
                <label htmlFor="direction">Direction</label>
                <input
                  type="text"
                  value={direction}
                  onChange={(e) => setDirections(e.target.value)}
                  className="rounded-xl"
                />
              </div>
              <div>
                <button
                  className=" p-1 rounded-xl bg-red-700"
                  onClick={() => handleGuardar("direction")}
                >
                  guardar
                </button>
              </div>
            </div>
          )}
          {!disable.includes("direction") && (
            <div className="flex flex-row  gap-2 items-center">
              <div className=" ">Dirrecion de envio principal :</div>
              <div className="flex flex-row items-center gap-2">
                <div className="">
                  {/*  {currentUser.direction
                    ? "Sin confirmar"
                    : currentUser.direction}{" "}*/}
                  sin confirmar
                </div>
                <div
                  className="w-6 h-6  group"
                  onClick={() => handleClick("direction")}
                >
                  <FaPencilAlt className="w-full h-full cursor-pointer" />
                  <div className="w-fit bottom-full text-sm text-blue-300 transition-opacity opacity-0 duration-200 group-hover:opacity-100 ">
                    Editar
                  </div>
                </div>
              </div>
            </div>
          )}
        </section>

        <button className="mt-5 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded">
          Cerrar sesión
        </button>
      </div>
    </div>
  );
};

export default PerfilUsuario;
