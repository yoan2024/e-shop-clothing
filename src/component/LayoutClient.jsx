// --- React imports ---
import { useEffect, useState } from "react";
import {
  Routes,
  Route,
  useNavigate,
  useLocation,
} from "react-router-dom";

// --- Contexts ---
import { useUser } from "../context/User";
import { useCar } from "../context/Car";
import UserProfileProvider from "../context/userProfileProvider";

// --- Firebase ---
import {
  collection,
  doc,
  getDoc,
  setDoc,
  addDoc,
  onSnapshot,
} from "firebase/firestore";
import { auth, db } from "../firebase/firebase-config";
import { logout } from "../firebase/authService";
import { onAuthStateChanged } from "firebase/auth";

// --- Pages & Components ---
import Home from "../page/client/Home";
import PaymentSuccess from "./PaymentSuccess";
import Header from "./Header";
import Footer from "./Footer";
import ProductDetails from "../page/client/ProductDetails";
import Catalog from "../page/client/Catalog";
import Login from "../page/client/Login";
import SignUp from "../page/client/Sign_up";
import UserProfile from "../page/client/logicaClient";
import Favorites from "../page/client/Favoritess";

const LayoutClient = () => {
  // Context state
  const { car, setCar } = useCar();
  const { user } = useUser();

  // Local state
  const [quantities, setQuantities] = useState({});
  const [total, setTotal] = useState(0);
  const [toggleCart, setToggleCart] = useState(false);
  const [paid, setPaid] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const hiddenRoutes = ["/sign_up", "/login_in"];

  // 🔁 Fetch user cart from Firestore when user or cart changes
  useEffect(() => {
    if (!user) return;

    const fetchCart = async () => {
      const cartRef = doc(db, "Car", user.uid);
      const cartSnapshot = await getDoc(cartRef);

      if (cartSnapshot.exists()) {
        const cartItems = cartSnapshot.data().car || [];
        let updatedQuantities = {};
        let updatedTotal = 0;

        cartItems.forEach(({ id, quantity, total }) => {
          updatedQuantities[id] = quantity;
          updatedTotal += total;
        });

        setQuantities(updatedQuantities);
        setTotal(Number(updatedTotal).toFixed(2));
      } else {
        setTotal(0);
      }
    };

    // 🔐 Watch user for force logout
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const userDocRef = doc(db, "users", user.uid);
        onSnapshot(userDocRef, (docSnap) => {
          if (docSnap.exists() && docSnap.data().forceLogout === true) {
            logout(auth);
            navigate("/login_in");
          }
        });
      }
    });

    fetchCart();
    return () => unsubscribe();
  }, [user, car, navigate]);

  // ➕ Change item quantity
  const handleQuantityChange = async (id, quantity) => {
    if (!user) return;

    const ref = doc(db, "Car", user.uid);
    const docSnap = await getDoc(ref);

    if (docSnap.exists()) {
      const updatedItems = docSnap.data().car.map((item) =>
        item.id === id
          ? { ...item, quantity, total: item.price * quantity }
          : item
      );
      await setDoc(ref, { car: updatedItems });
      setCar(updatedItems);
      setQuantities((prev) => ({ ...prev, [id]: quantity }));
    }
  };

  // ❌ Remove item from cart
  const handleRemoveItem = async (id) => {
    if (!user) return;

    const ref = doc(db, "Car", user.uid);
    const docSnap = await getDoc(ref);

    if (docSnap.exists()) {
      const filteredItems = docSnap.data().car.filter((item) => item.id !== id);
      await setDoc(ref, { car: filteredItems });
      setCar(filteredItems);
    }
  };

  // 🧾 Generate unique order ID
  const generateOrderID = () => {
    const now = new Date();
    return `ORD-${now.getTime()}`;
  };

  // ✅ Handle checkout
  const handleCheckout = async () => {
    if (!user || car.length === 0) return;

    const orderId = generateOrderID();
    const orderDate = new Date().toLocaleDateString();
    const refUser = doc(db, "users", user.uid);
    const userSnap = await getDoc(refUser);

    if (!userSnap.exists()) return;

    const userData = userSnap.data();

    const order = {
      orderId,
      orderDate,
      orderedItems: car,
      paymentMethod: "Credit Card",
      shippingStatus: "🚚 Processing",
      email: userData.email,
      name: userData.name,
      phone: userData.phone,
      address: userData.address,
      role: userData.rol,
      userId: user.uid,
      totalPaid: total,
      status: "Pending",
    };

    await addDoc(collection(db, "allOrders"), order);
    await setDoc(doc(db, "Car", user.uid), { car: [] });

    setCar([]);
    setPaid(true);
  };

  return (
   <>
    <div className="min-w-fit">
        {/* Header */}
      {!hiddenRoutes.includes(location.pathname) && (
        <Header toggle={toggleCart} setToggle={setToggleCart} />
      )}

      {/* Shopping Cart Drawer */}
      {toggleCart && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-end z-50">
          <div className="bg-white p-4 w-full max-w-md h-full overflow-y-auto">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">Shopping Bag</h2>
              <button onClick={() => setToggleCart(false)}>X</button>
            </div>

            <div className="mt-4">
              {car.map((item, idx) => (
                <div key={idx} className="flex gap-4 mb-4">
                  <img
                    src={item.image}
                    alt=""
                    className="w-24 h-24 object-cover"
                  />
                  <div className="flex-1">
                    <p className="font-semibold line-clamp-2">{item.title}</p>
                    <select
                      className="border mt-2"
                      value={quantities[item.id] || 1}
                      onChange={(e) =>
                        handleQuantityChange(item.id, Number(e.target.value))
                      }
                    >
                      {[...Array(10)].map((_, i) => (
                        <option key={i + 1} value={i + 1}>
                          {i + 1}
                        </option>
                      ))}
                    </select>
                    <p className="text-gray-500">${item.price} USD per unit</p>
                    <p className="font-bold">${item.total}</p>
                  </div>
                  <button onClick={() => handleRemoveItem(item.id)}>🗑️</button>
                </div>
              ))}
            </div>

            {/* Cart Summary and Checkout */}
            <div className="border-t pt-4 mt-4">
              <p>Subtotal: ${total}</p>
              <p>Discount: $0</p>
              <p className="font-bold">Total: ${total}</p>
              <button
                className="bg-green-500 text-white px-4 py-2 rounded mt-2"
                onClick={handleCheckout}
              >
                PAY
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Payment Confirmation */}
      {paid && <PaymentSuccess onClose={() => setPaid(false)} />}

      {/* Routes */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/userProfile" element={<UserProfile />} />
        <Route path="/catalog/:category" element={<Catalog />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/sign_up" element={<SignUp />} />
        <Route path="/login_in" element={<Login />} />
      </Routes>

      {/* Footer */}
      {!hiddenRoutes.includes(location.pathname) && <Footer />}
    </div>
 </>
  );
};

export default LayoutClient;
