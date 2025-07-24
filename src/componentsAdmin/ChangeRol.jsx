// This component allows the admin to change a user's role (between "admin" and "user").
// It retrieves the user from Firestore based on their email, updates the role, and saves the new data back.

import React, { useEffect, useState } from "react";
import { db } from "../firebase/firebase-config";
import { collection, setDoc, where, doc, query, getDocs } from "firebase/firestore";

const ChangeRol = ({ setchangerol, u, setu }) => {
  // Stores the current role of the user
  const [role, setRole] = useState(u.rol);

  // Tracks the role selected by the admin to change to
  const [rolChange, setRolChange] = useState(u.rol);

  // State to show "saving" status
  const [guardando, setGuardando] = useState(false);

  // State to show success message after saving
  const [guardado, setGuardado] = useState(false);

  // Function to save the new role in Firestore
  const handleguardarrole = async () => {
    setGuardado(false);
    setGuardando(true);

    try {
      // Find the user by email in Firestore
      const refdoc = query(collection(db, "usuarios"), where("correo", "==", u.correo));
      const getdoc = await getDocs(refdoc);

      const user = [];
      let iddoc;

      getdoc.forEach((D) => {
        iddoc = D.id;
        user.push(D.data());
      });

      // Update the role field
      const updatedUser = user.map((us) => ({ ...us, rol: rolChange }))[0];
      const refuser = doc(db, "usuarios", iddoc);

      // Save the updated user data
      await setDoc(refuser, updatedUser);

      // Update local states with the new data
      setRole(updatedUser.rol);
      setu(updatedUser);
      setGuardando(false);
      setGuardado(true);
    } catch (e) {
      console.log("Error updating role:", e);
    }
  };

  // After successful save, hide the success message after 800ms
  useEffect(() => {
    if (guardado) {
      setTimeout(() => {
        setGuardado(false);
      }, 800);
    }
  }, [guardado]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex flex-row justify-center items-center z-50">
      <div className="bg-white flex flex-col justify-between max-w-xl w-80 h-2/6 relative">
        {/* Close button */}
        <div
          className="absolute p-2 hover:bg-slate-500 top-0 cursor-pointer left-0"
          onClick={setchangerol}
        >
          X
        </div>

        {/* Modal content */}
        <div>
          <div className="text-center font-bold">CHANGE ROLE</div>
          <div className="flex flex-col justify-between gap-5 items-center">
            <div className="flex flex-row gap-2">
              <div>Current role: </div>
              <div>{role}</div>
            </div>

            {/* Role selector buttons */}
            <div className="flex gap-2 flex-row">
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
              <button
                className={
                  rolChange === "user"
                    ? `p-3 bg-red-600`
                    : "bg-slate-400 p-3 hover:bg-slate-600"
                }
                onClick={() => setRolChange("user")}
              >
                user
              </button>
            </div>
          </div>
        </div>

        {/* Save status messages */}
        {guardando ? (
          <li className="text-slate-600 font-bold animate-pulse">Saving changes...</li>
        ) : guardado ? (
          <div className="bg-green-600 font-bold">Saved successfully ✅</div>
        ) : (
          <button
            className="bg-green-700 w-fit m-auto rounded-2xl p-2"
            onClick={handleguardarrole}
          >
            Save
          </button>
        )}
      </div>
    </div>
  );
};

export default ChangeRol;
