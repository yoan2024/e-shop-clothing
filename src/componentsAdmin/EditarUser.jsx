import { useState } from "react";
import {
  query,
  setDoc,
  where,
  collection,
  doc,
  getDocs,
  getDoc,
} from "firebase/firestore";
import { db } from "../firebase/firebase-config";

/**
 * EditarUser component
 * 
 * This component shows a button that opens a modal allowing the admin
 * to update a user's name, email, and role in the Firestore database.
 */
const EditarUser = ({ user, setu }) => {
  const [isOpen, setIsOpen] = useState(false); // Modal visibility
  const [nombre, setNombre] = useState(user.name);
  const [correo, setCorreo] = useState(user.correo);
  const [rol, setRol] = useState(user.rol);
  const [saving, setSaving] = useState(false);

  // Handles user data update in Firestore
  const handleGuardarCambios = async (e) => {
    e.preventDefault();
    setSaving(true);

    if (!nombre || !correo) return;

    try {
      // 1. Update user info in "usuarios" collection
      const userRef = doc(db, "usuarios", user.idUser);
      const snapshot = await getDoc(userRef);
      let userData = snapshot.data();

      userData = { ...userData, name: nombre, correo, rol };
      await setDoc(userRef, userData);
      setu(userData); // Update local user state

      // 2. Update all related documents in "todosPedidos"
      const pedidosQuery = query(
        collection(db, "todosPedidos"),
        where("iduser", "==", user.idUser)
      );
      const pedidosSnapshot = await getDocs(pedidosQuery);

      if (!pedidosSnapshot.empty) {
        pedidosSnapshot.forEach(async (docSnap) => {
          const pedidoData = docSnap.data();
          const pedidoRef = doc(db, "todosPedidos", docSnap.id);

          await setDoc(pedidoRef, {
            ...pedidoData,
            nombre,
            correo,
            rol,
          });
        });
        console.log("User and related orders updated successfully");
      } else {
        console.log("No related documents found in 'todosPedidos'");
      }

      // Close modal and reset saving state
      setSaving(false);
      setIsOpen(false);
    } catch (error) {
      console.log("Error updating user:", error);
    }
  };

  return (
    <section>
      <h2 className="text-xl font-semibold mb-2 text-slate-700">
        🛠️ Edit User
      </h2>

      {/* Button to open edit modal */}
      <button
        className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg"
        onClick={() => setIsOpen(true)}
      >
        Edit User
      </button>

      {/* Modal for editing user */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white rounded-2xl shadow-2xl h-3/6 w-full max-w-xs flex flex-col justify-center relative">
            
            {/* Close button */}
            <div
              className="absolute top-2 right-2 border-2 p-1 hover:bg-slate-600 cursor-pointer border-black rounded-full"
              onClick={() => {
                setIsOpen(false);
                setNombre("");
                setCorreo("");
                setRol("");
              }}
            >
              X
            </div>

            {/* Edit form */}
            <form
              onSubmit={handleGuardarCambios}
              className="p-4 flex flex-col gap-4"
            >
              <label>
                Change name:
                <input
                  type="text"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  placeholder="Name"
                  className="border-2 border-black rounded-xl w-full mt-1"
                />
              </label>

              <label>
                Change email:
                <input
                  type="email"
                  value={correo}
                  onChange={(e) => setCorreo(e.target.value)}
                  placeholder="Email"
                  className="border-2 border-black rounded-xl w-full mt-1"
                />
              </label>

              <label>
                Change role:
                <select
                  value={rol}
                  onChange={(e) => setRol(e.target.value)}
                  className="border-2 border-black w-full mt-1"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </label>

              <button
                type="submit"
                disabled={saving}
                className="bg-green-600 text-white rounded-xl py-2 mt-2"
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};

export default EditarUser;
