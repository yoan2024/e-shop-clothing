import {
  doc,
  where,
  onSnapshot,
  collection,
  getDocs,
  query,
  orderBy,
  getDoc,
  setDoc,
} from "firebase/firestore";
import { db } from "../../firebase/firebase-config";
import InputUser from "../InputUser";
import { logout } from "../../firebase/authService";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import ProfilePhotoUploader from "../ProfilePhotoUpdater";
import { useUser } from "../../context/User";


export const Profile_info = ({name, email, phone, address, setName, setEmail, setPhone, setAddress}) => {
 const navigate = useNavigate();
 const {user, setUser} = useUser()

  const [cName, setCName] = useState(false);
  const [cEmail, setCEmail] = useState(false);
  const [cPhone, setCPhone] = useState(false);
  const [cAddress, setCAddress] = useState(false);
  const [disable, setDisable] = useState([]); // --- State to track which fields are being edited ---

  // --- Enable editing for a specific input field ---
  const handleClick = (field) => {
    setDisable((previos) => [...previos, field]);
  };

  // --- Save updated user data and propagate changes to related orders ---
  const handleSave = async (field) => {
    // --- Show the loading spinner for the saving field ---
    if (field === "name") setCName(true);
    if (field === "phone") setCPhone(true);
    if (field === "email") setCEmail(true);
    if (field === "address") setCAddress(true);

    const iduser = user.uid;
    const userDocRef = doc(db, "users", iduser);
    const userSnap = await getDoc(userDocRef);
    if (!userSnap.exists()) return;

    let newData = userSnap.data();

    // --- Update only the selected field ---
    if (field === "name") newData.name = name;
    if (field === "phone") newData.phone = phone;
    if (field === "email") newData.email = email;
    if (field === "address") newData.address = address;
    await setDoc(userDocRef, newData); // --- Save changes to user profile ---

    // --- Update the field in all user orders ---
    const ordersQuery = query(
      collection(db, "allOrders"),
      where("userId", "==", iduser)
    );
    const ordersSnap = await getDocs(ordersQuery);

    ordersSnap.forEach(async (docSnap) => {
      const orderData = docSnap.data();
      const orderRef = doc(db, "allOrders", docSnap.id);
      if (!orderData) return;

      if (field === "name") orderData.name = name
      if (field === "phone") orderData.phone =  phone
      if (field === "email") orderData.email =  email
      if (field === "address") orderData.address =  address

      await setDoc(orderRef, orderData); // --- Save changes in each order ---
    });

    // --- Disable editing ---
    setDisable((prev) => prev.filter((f) => f !== field));
    if (field === "name") setCName(false);
    if (field === "phone") setCPhone(false);
    if (field === "email") setCEmail(false);
    if (field === "address") setCAddress(false);
  };
    return <>
    {/* --- Section: User profile info and picture --- */}
          <section className="flex flex-row justify-center  w-full items-start">
            <div className="flex flex-col items-center">
              
              <section className="mt-2  items-center  flex flex-col gap-5 ">
                
                <div className="flex flex-row mt-5 justify-center ">
                  <ProfilePhotoUploader />
                </div>

                {/* --- Editable input fields --- */}
                <div>
                  <InputUser
                  disable={disable}
                  field={"name"}
                  texto={"Full Name"}
                  value={name}
                  saving={cName}
                  handleclick={handleClick}
                  setstate={setName}
                  handlesave={() => handleSave("name")}
                />
                <InputUser
                  disable={disable}
                  saving={cEmail}
                  texto={"Email"}
                  field={"email"}
                  value={email}
                  handleclick={handleClick}
                  setstate={setEmail}
                  handlesave={() => handleSave("email")}
                />
                <InputUser
                  disable={disable}
                  field={"phone"}
                  value={phone}
                  handleclick={handleClick}
                  setstate={setPhone}
                  saving={cPhone}
                  texto={"Phone"}
                  handlesave={() => handleSave("phone")}
                />
                <InputUser
                  disable={disable}
                  field={"address"}
                  texto={"Address"}
                  value={address}
                  saving={cAddress}
                  handleclick={handleClick}
                  setstate={setAddress}
                  handlesave={() => handleSave("address")}
                />
                </div>
              </section>
            </div>
          </section>
    </>
}