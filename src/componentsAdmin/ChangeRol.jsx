import React, { useEffect, useState } from "react";
import { db } from "../firebase/firebase-config";
import { collection, setDoc, where } from "firebase/firestore";
import { doc } from "firebase/firestore";
import { query } from "firebase/firestore";
import { getDocs } from "firebase/firestore";

const ChangeRol = ({ setchangerol, u, setu }) => {
  const [role, setRole] = useState(u.rol);
  const [rolChange, setRolChange] = useState(u.rol);
  const [guardando, setGuardando] = useState(false);
  const [guardado, setGuardado] = useState(false);
  const handleguardarrole = async () => {
    setGuardado(false);
    setGuardando(true);

    try {
      const refdoc = query(
        collection(db, "usuarios"),
        where("correo", "==", u.correo)
      );
      const getdoc = await getDocs(refdoc);
      const user = [];
      let iddoc;
      getdoc.forEach((D) => {
        iddoc = D.id;
        user.push(D.data());
      });
      const organizar = user.map((us) => {
        return { ...us, rol: rolChange };
      });
      const refuser = doc(db, "usuarios", iddoc);
      const newUser = { ...organizar[0] };
      console.log("objectooooooo", newUser);
      await setDoc(refuser, {
        ...newUser,
      });
      console.log("guardado con exito.....");
      console.log("roleeeeeeeeeeeeeeeee act", newUser.rol);
      setRole(newUser.rol);
      setu(newUser);
      setGuardando(false);
      setGuardado(true);
    } catch (e) {
      console.log("eeror", e);
    }
  };

  useEffect(() => {
    if (guardado) {
      setTimeout(() => {
        setGuardado(false);
      }, 800);
    }
  }, [guardado]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex flex-row justify-center items-center z-50">
      <div className="bg-white  flex flex-col justify-between   max-w-xl w-80 h-2/6  relative">
        <div
          className="absolute p-2 hover:bg-slate-500 top-0 left-0"
          onClick={setchangerol}
        >
          X
        </div>
        <div>
          <div className="text-center font-bold ">CAMBIAR ROLE</div>
          <div className="flex flex-col justify-between gap-5 items-center">
            <div className="flex flex-row gap-2">
              <div>Current rol: </div>
              <div>{role} </div>
            </div>
            <div className=" flex gap-2 flex-row">
              <div>
                <button
                  className={
                    rolChange === "admin"
                      ? `p-3 bg-red-600`
                      : "bg-slate-400 p-3 hover:bg-slate-600"
                  }
                  onClick={() => setRolChange("admin")}
                >
                  admin
                </button>
              </div>
              <div>
                <button
                  className={
                    rolChange === "user"
                      ? `p-3 bg-red-600 `
                      : "bg-slate-400 p-3 hover:bg-slate-600"
                  }
                  onClick={() => setRolChange("user")}
                >
                  user
                </button>
              </div>
            </div>
          </div>
        </div>
        {guardando ? (
          <li className="text-slate-600 font-bold animate-pulse">
            Guardando Cambios...
          </li>
        ) : guardado ? (
          <div className="bg-green-600 font-bold">Guardado con exito ✅</div>
        ) : (
          <button
            className="bg-green-700 w-fit m-auto rounded-2xl p-2"
            onClick={handleguardarrole}
          >
            Guardar
          </button>
        )}
      </div>
    </div>
  );
};

export default ChangeRol;
