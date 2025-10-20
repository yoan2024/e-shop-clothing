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
 
import AccountSidebar from "../../component/page-logicaClient/AsidebarLogicaClient";
import { Profile_info } from "../../component/page-logicaClient/profile_info";
import { Orders } from "../../component/page-logicaClient/Orders";

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

 
    ///estado para controlar las ordenes que el ususrio seleciona
    const [activeTab, setActiveTab] = useState("All");

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


console.log(name, email, address, phone)
  return (
    <div className="min-h-screen flex flex-row lg:w-4/5     m-auto   py-3">
      
      <AccountSidebar  activeTab={activeTab} setActiveTab={setActiveTab}/>
      {user ? (
        <>
      {/*       <Profile_info name={name} email={email} address={address} phone={phone} setName={setName} setPhone={setPhone} setAddress={setAddress} setEmail={setEmail}/>
*/}<Orders activeTab={activeTab} setActiveTab={setActiveTab}/>  
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
