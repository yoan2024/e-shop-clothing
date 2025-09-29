// --- PerfilUsuario page:
// This component displays and allows editing of the logged-in user's personal information,
// such as full name, email, phone number, address, and profile picture.
// It also shows a list of active orders and the user's order history.
// All data is fetched from Firebase Firestore, and changes are saved in real time.

// --- React imports ---
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// --- Context imports ---
import { useUser } from "../../context/User";
import { useCar } from "../../context/Car";
import { useImage } from "../../context/Image";
import { useOrders } from "../../context/OrdersProvider";

// --- Firebase Firestore imports ---
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

// --- Auth imports ---
import { logout } from "../../firebase/authService";

// --- UI imports ---
import ClipLoader from "react-spinners/ClipLoader";
import Table from "../../component/Table";
import InputUser from "../../component/InputUser";
import ProfilePhotoUpdater from "../../component/ProfilePhotoUpdater";

// --- Main component --- 
const UserProfile = () => {
  // --- Hooks from custom context providers --- 
  const { url, setUrl } = useImage();
  const { cart, setCart } = useCar();
  const { user, setUser } = useUser();
  const { orders, setOrders, orderHistory, setOrderHistory } = useOrders();
  const navigate = useNavigate();

  // --- State variables for user data and UI control ---
  const [name, setName] = useState("");
  const [cName, setCName] = useState(false);
  const [email, setEmail] = useState("");
  const [cEmail, setCEmail] = useState(false);
  const [phone, setPhone] = useState("");
  const [cPhone, setCPhone] = useState(false);
  const [address, setAddress] = useState("");
  const [cAddress, setCAddress] = useState(false);
  const [disable, setDisable] = useState([]); // --- State to track which fields are being edited ---
  const [showHP, setShowHP] = useState(false); // --- State to toggle order history visibility ---

  // --- Load user data and orders from Firebase when the user changes or the component mounts ---
  useEffect(() => {
    if (!user) return;

    // --- Fetch user profile and orders ---
    async function fetchUserDataAndOrders() {
      if (user) {
        const iduser = user.uid;
        const userDocRef = doc(db, "users", iduser);
        const userDocSnap = await getDoc(userDocRef);

        // --- Set user profile info ---
        if (userDocSnap.exists()) {
          const data = userDocSnap.data();
          setUrl(data.image || data.imageDefault);
          setName(data.name);
          setEmail(data.email);
          setPhone(data.phone);
          setAddress(data.address);
        }

        // --- Fetch active orders ---
        const currentOrdersQuery = query(
          collection(db, "allOrders"),
          where("userId", "==", iduser),
          where("status", "in", ["Pending", "On the way"]),
          orderBy("orderDate", "desc")
        );
        const currentOrdersSnap = await getDocs(currentOrdersQuery);

        if (!currentOrdersSnap.empty) { 
          let p = [];
          currentOrdersSnap.forEach((d) => {
            const data = d.data();
            p.push(data);
          });
          
          setOrders(p);
        }

        // --- Fetch order history ---
        const historyOrdersQuery = query(
          collection(db, "allOrders"),
          where("userId", "==", iduser),
          where("status", "in", ["Delivered", "Cancelled"]),
          orderBy("orderDate", "desc")
        );
        const historyOrdersSnap = await getDocs(historyOrdersQuery);

        // --- Set orders history ---
        if (!historyOrdersSnap.empty) {
          let pH = [];
          historyOrdersSnap.forEach((d) => {
            const data = d.data();
            pH.push(data);
          });
          setOrderHistory(pH);
        }
      }
    }

    // --- Real-time listener for user's orders ---
    const ref = query(
      collection(db, "allOrders"),
      where("userId", "==", user.uid),
      orderBy("ordersDate", "desc")
    );

    const unsubscribe = onSnapshot(ref, (snapshot) => {
      const orders = snapshot.docs.map((doc) => ({
        ...doc.data(),
      }));
      const actuales = orders.filter((p) => p.status !== "Delivered");
      const historical = orders.filter((p) => p.status === "Delivered");

      setOrders(actuales);
      setOrderHistory(historical);
    });

    fetchUserDataAndOrders();
    return () => unsubscribe(); // --- Clean up listener on unmount ---
  }, [user]);

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

      if (field === "name") orderData.nombre = name;
      if (field === "phone") orderData.phone = phone;
      if (field === "email") orderData.email = email;
      if (field === "address") orderData.address = address;

      await setDoc(orderRef, orderData); // --- Save changes in each order ---
    });

    // --- Disable editing ---
    setDisable((prev) => prev.filter((f) => f !== field));
    if (field === "name") setCName(false);
    if (field === "phone") setCPhone(false);
    if (field === "email") setCEmail(false);
    if (field === "address") setCAddress(false);
  };

  console.log("orders", orders)

  return (
    <div className="bg-slate-300 min-h-screen flex flex-col overflow-hidden ">
      {user ? (
        <>
          {/* --- Section: User profile info and picture --- */}
          <section className="flex flex-row justify-center items-start">
            <div className="flex flex-col items-center">
              <section className="mt-2  items-center  flex flex-col  gap-5 ">
                <div className="text-3xl font-medium text-center">
                  PERSONAL INFORMATION
                </div>
                <div className="flex flex-row mt-5 justify-center ">
                  <ProfilePhotoUpdater />
                </div>

                {/* --- Editable input fields --- */}
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
              </section>

              {/* --- Logout button --- */}
              <button
                className="mt-5 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
                onClick={() => {
                  logout();
                  navigate("/");
                }}
              >
                Sign out
              </button>
            </div>
          </section>

          {/* --- Current orders table --- */}
          <Table label={"Orders"} ped={orders} />

          {/* --- Toggle order history --- */}
          <div className="flex flex-row justify-center mb-5">
            <button
              className="mt-5 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
              onClick={() => setShowHP(!showHP)}
            >
              {!showHP ? "Show Order History" : "Close Order History"}
            </button>
          </div>

          {/* --- Displays historical orders if 'showHP' is true --- */}
          {showHP && <Table label={"Order history"} ped={orderHistory} />}
        </>
      ) : (
        // --- Loading spinner while user data is fetched ---
        <div className="flex flex-row justify-center items-center h-screen ">
          <ClipLoader color="#36d7b7" size={50} />
        </div>
      )}
    </div>
  );
};

export default UserProfile;
