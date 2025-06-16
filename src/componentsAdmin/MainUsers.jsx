import { collection, orderBy } from "firebase/firestore";
import { query } from "firebase/firestore";
import { db } from "../firebase/firebase-config";
import { useEffect, useState } from "react";
import { getDocs } from "firebase/firestore";
const MainUsers = () => {
  const [usuarios, setUsuarios] = useState([]);

  useEffect(() => {
    async function getUsusarios() {
      try {
        const refusers = query(
          collection(db, "usuarios"),
          orderBy("createAt", "desc")
        );

        const getdocs = await getDocs(refusers);
        console.log();
        if (!getdocs.empty) {
          let users = [];

          getdocs.forEach((d) => {
            users.push(d.data());
          });
          console.log("users antes de ponerlos en setUsers =", users);
          setUsuarios(users);
        } else {
          console.log("no se incontraron documentos/ususarios en DB");
        }
      } catch (e) {
        console.log("error:", e);
      }
    }

    getUsusarios();
  }, []);

  console.log("usersssssssssssssssssssssss", usuarios);
  return (
    <div className="w-4/5 flex flex-row overflow-x-auto justify-center">
      <div className="min-w-full max-w-full">
        <table className="text-xl text-center">
          <thead className="bg-slate-300">
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role {"(USER/ADMIN)"}</th>
              <th>Estatus {"ACTIVE/BANNED"} </th>
            </tr>
          </thead>
          <tbody className="bg-slate-200 ">
            {usuarios.map((u) => {
              return (
                <tr className="cursor-pointer">
                  <td className="border-2 p-1 border-solid border-black">
                    {u.name}{" "}
                  </td>
                  <td className="border-2 p-1 border-solid border-black">
                    {u.correo}{" "}
                  </td>
                  <td className="border-2 p-1 border-solid border-black">
                    {u.rol}
                  </td>
                  <td className="border-2 p-1 border-solid border-black">
                    {u.estatus}{" "}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MainUsers;
