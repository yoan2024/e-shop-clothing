/**
 * MainUsers Component
 * --------------------
 * This admin panel view displays a table with all users registered in the Firestore database.
 * When clicking on a user row, a modal opens showing the user's detailed info and edit options.
 */

import { useEffect, useState } from "react";
import { collection, query, orderBy, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebase-config";
import ModalUserDetail from "./ModalUserDetail";

const MainUsers = () => {
  // State for the list of all users fetched from Firestore
  const [users, setUsers] = useState([]);

  // Modal visibility state
  const [onShowModal, setOnShowModal] = useState(false);

  // Stores the currently selected user for detailed view in the modal
  const [selectedUser, setSelectedUser] = useState({});

  // Fetch users from Firestore when the component mounts
  useEffect(() => {
    async function fetchUsers() {
      try {
        const ref = query(
          collection(db, "users"),
          orderBy("createAt", "desc") // Newest users first
        );
        const snapshot = await getDocs(ref);

        if (!snapshot.empty) {
          const userList = snapshot.docs.map((doc) => doc.data());
          setUsers(userList);
        } else {
          console.log("No user documents found in Firestore.");
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    }

    fetchUsers();
  }, []);

  return (
    <div className="w-4/5 flex flex-row overflow-x-auto justify-center">
      <div className="min-w-full max-w-full flex flex-col items-center">
        {/* Table displaying user data */}
        <table className="text-xl text-center">
          <thead className="bg-slate-300">
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role (USER / ADMIN)</th>
              <th>Status (ACTIVE / BANNED)</th>
            </tr>
          </thead>
          <tbody className="bg-slate-200">
            {users.map((user, index) => (
              <tr
                key={index}
                className="cursor-pointer"
                onClick={() => {
                  setSelectedUser(user);
                  setOnShowModal(true);
                }}
              >
                <td className="border-2 p-1 border-black">{user.name}</td>
                <td className="border-2 p-1 border-black">{user.email}</td>
                <td className="border-2 p-1 border-black">{user.rol}</td>
                <td className="border-2 p-1 border-black">{user.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal with user details (edit/view) */}
      {onShowModal && (
        <ModalUserDetail
          user={selectedUser}
          setu={setSelectedUser}
          onclose={() => setOnShowModal(false)}
        />
      )}
    </div>
  );
};

export default MainUsers;
