import { useEffect, useState } from "react";
import { useUser } from "../../context/User";
import ClipLoader from "react-spinners/ClipLoader";
import { useCarrito } from "../../context/Carrito";
import { useNavigate } from "react-router-dom";
import { db } from "../../firebase/firebase-config";
import Table from "../../component/Table";
import { doc } from "firebase/firestore";
import { getDoc } from "firebase/firestore";
import { setDoc } from "firebase/firestore";
import InputUser from "../../component/InputUser";
import { useImage } from "../../context/Image";

import ProfilePhotoUpdater from "../../component/ProfilePhotoUpdater";
import { logout } from "../../firebase/authService";
import { usePedidos } from "../../context/PedidosProvider";
import BodyTableP from "../../component/BodyTableP";

{
  /*
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
                  <div className="">{name} </div>
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
            )}*/
}

const PerfilUsuario = () => {
  const { url, setUrl } = useImage();
  const { carrito, setCarrito } = useCarrito();
  const navigate = useNavigate();
  const { pedidos, setPedidos, historialPedidos, setHistorialPedidos } =
    usePedidos();
  const { user, setUser } = useUser();
  const [name, setName] = useState("");
  const [cName, setCName] = useState(false);
  const [showHP, setShowHP] = useState(false);
  const [email, setEmail] = useState("");
  const [cEmail, setCEmail] = useState(false);

  const [telefono, setTelefono] = useState("");
  const [cTelefono, setCTelefono] = useState(false);
  const [direction, setDirection] = useState("");
  const [cDirection, setCDirection] = useState(false);
  const [disable, setDisable] = useState([]);

  useEffect(() => {
    async function name(params) {
      if (user) {
        const iduser = user.uid;
        const refdoc = doc(db, "usuarios", iduser);
        const getdoc = await getDoc(refdoc);
        if (getdoc.exists()) {
          const dada = getdoc.data();
          const userdata = dada.user;
          console.log("dataaaaaa", userdata);
          const imagen = userdata.image || userdata.imageDefault;
          setUrl(imagen);
          setName(userdata.name);
          setEmail(userdata.correo);
          setTelefono(userdata.telefono);
          setDirection(userdata.direction);
        } else {
          console.log("no existe un usuario actual please sign in or login in");
        }

        const refped = doc(db, "pedidos", iduser);
        const getpeds = await getDoc(refped);
        if (getpeds.exists()) {
          const getdataped = getpeds.data();
          const datapedidos = getdataped.pedidos;
          const datahistorialpedidos = getdataped.historialPedidos;
          setPedidos(datapedidos);
          setHistorialPedidos(datahistorialpedidos);
        }
      }
    }
    name();
  }, [user]);

  const handleClick = (e) => {
    if (e === "name") {
      setDisable((prev) => [...prev, "name"]);
    } else if (e === "telefono") {
      setDisable((prev) => [...prev, "telefono"]);
    } else if (e === "email") {
      setDisable((prev) => [...prev, "email"]);
    } else if (e === "direction") {
      setDisable((prev) => [...prev, "direction"]);
    }
  };

  const handleGuardar = async (e) => {
    if (e === "name") {
      setCName(true);
    } else if (e === "telefono") {
      setCTelefono(true);
    } else if (e === "email") {
      setCEmail(true);
    } else if (e === "direction") {
      setCDirection(true);
    }

    let newDisables;
    let newData;
    const iduser = user.uid;
    const refdata = doc(db, "usuarios", iduser);
    const getdata = await getDoc(refdata);
    if (getdata.exists()) {
      const datauser = getdata.data();
      newData = datauser.user;
    } else {
      console.log("ususario no existe en base de datos");
      return;
    }

    if (e === "name") {
      newData = { ...newData, name };
      newDisables = [...disable].filter((i) => i !== "name");
    } else if (e === "telefono") {
      newData = { ...newData, telefono };
      newDisables = [...disable].filter((i) => i !== "telefono");
    } else if (e === "email") {
      newData = { ...newData, email };
      newDisables = [...disable].filter((i) => i !== "email");
    } else if (e === "direction") {
      newData = { ...newData, direction };
      newDisables = [...disable].filter((i) => i !== "direction");
    }
    setDoc(refdata, {
      user: newData,
    });
    setDisable(newDisables);

    if (e === "name") {
      setCName(false);
    } else if (e === "telefono") {
      setCTelefono(false);
    } else if (e === "email") {
      setCEmail(false);
    } else if (e === "direction") {
      setCDirection(false);
    }
  };
  console.log("mostar p", pedidos, "mostrar hp", historialPedidos);
  return (
    <div className="bg-slate-300 min-h-screen flex flex-col">
      {name ? (
        <>
          <section className="flex flex-row justify-center items-start">
            <div className="flex flex-col items-center">
              <section className="mt-2  items-center  flex flex-col  gap-5 ">
                <div className="text-3xl font-medium text-center">
                  INFORMACION PERSONAL
                </div>
                <div className="flex flex-row mt-5 justify-center ">
                  <ProfilePhotoUpdater />
                  {/* */}
                </div>
                <InputUser
                  disable={disable}
                  ref={"name"}
                  texto={"Nombre Completo"}
                  value={name}
                  guardando={cName}
                  handleclick={handleClick}
                  setstate={setName}
                  handleguardar={handleGuardar}
                />

                <InputUser
                  disable={disable}
                  guardando={cEmail}
                  texto={"Email"}
                  ref={"email"}
                  value={email}
                  handleclick={handleClick}
                  setstate={setEmail}
                  handleguardar={handleGuardar}
                />
                <InputUser
                  disable={disable}
                  ref={"telefono"}
                  value={telefono}
                  handleclick={handleClick}
                  setstate={setTelefono}
                  guardando={cTelefono}
                  texto={"Telefono"}
                  handleguardar={handleGuardar}
                />

                <InputUser
                  disable={disable}
                  ref={"direction"}
                  texto={"Direction"}
                  value={direction}
                  guardando={cDirection}
                  handleclick={handleClick}
                  setstate={setDirection}
                  handleguardar={handleGuardar}
                />
              </section>
              <button
                className="mt-5 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
                onClick={() => {
                  logout();
                  navigate("/");
                }}
              >
                Cerrar sesión
              </button>
            </div>
          </section>
          <Table label={"Pedidos"} ped={pedidos} />
          <div className="flex flex-row justify-center mb-5">
            <button
              className="mt-5 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
              onClick={() => setShowHP(!showHP)}
            >
              {!showHP
                ? "Mostrar Historial Pedidos"
                : "Cerrar Historial Pedidos"}
            </button>
          </div>
          {showHP && (
            <Table label={"Historial Pedidos"} ped={historialPedidos} />
          )}
        </>
      ) : (
        <div className="flex flex-row justify-center items-center h-screen ">
          <ClipLoader color="#36d7b7" size={50} />
        </div>
      )}
    </div>
  );
};

export default PerfilUsuario;
