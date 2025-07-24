// --- React imports ---
import { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";

// --- Context imports ---
import { useUser } from "../context/User";
import { useCar } from "../context/Car";

// --- Firebase Firestore imports ---
import { collection, doc, getDoc, setDoc, addDoc } from "firebase/firestore";
import { db } from "../firebase/firebase-config";


// --- UI Components ---
import Home from "../page/client/Home";
import PaymentSuccess from "./PaymentSuccess";
import Header from "./Header";
import Footer from "./Footer";
import ProductDetails from "../page/client/ProductDetails";
import Catalog from "../page/client/Catalog";
import Login from "../page/client/Login";
import SignUp from "../page/client/Sign_up";
import UserProfile from "../page/client/UserProfile";
import Favorites from "../page/client/Favoritess";

// --- Main Layout Component ---
const LayoutClient = () => {
  // Context state
  const { car, setCar } = useCar(); // Shopping cart context
  const { user } = useUser();       // Authenticated user context

  // Local component state
  const [quantities, setQuantities] = useState({});
  const [total, setTotal] = useState(0);
  const [toggle, setToggle] = useState(false); // Toggle for shopping bag view
  const [paid, setPaid] = useState(false);     // State to show success payment screen

  const location = useLocation();

  // Routes where Header and Footer should be hidden
  const hiddenRoutes = ["/sign_up", "/login_in"];

  /**
   * Fetch cart data from Firestore when user or cart changes.
   * Updates quantities and total price locally.
   */
  useEffect(() => {
    if (!user) return;

    const fetchCart = async () => {
      const cartRef = doc(db, "Car", user.uid); // Firestore cart reference
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
      }
    };

    fetchCart();
  }, [user, car]);

  /**
   * Handles changing the quantity of an item in the cart.
   * Updates Firestore and local state.
   */
  const handleQuantityChange = async (id, quantity) => {
    if (!user) return;

    const ref = doc(db, "Car", user.uid);
    const docSnap = await getDoc(ref);

    if (docSnap.exists()) {
      const items = docSnap.data().car.map((item) =>
        item.id === id
          ? { ...item, quantity: quantity, total: item.price * quantity }
          : item
      );
      await setDoc(ref, { car: items });
      setCar(items);
      setQuantities((prev) => ({ ...prev, [id]: quantity }));
    }
  };

  /**
   * Removes an item from the shopping cart in Firestore and state.
   */
  const handleRemoveItem = async (id) => {
    if (!user) return;

    const ref = doc(db, "Car", user.uid);
    const docSnap = await getDoc(ref);

    if (docSnap.exists()) {
      const filtered = docSnap.data().car.filter((item) => item.id !== id);
      await setDoc(ref, { car: filtered });
      setCar(filtered);
    }
  };

  /**
   * Generates a unique order ID based on current date and time.
   */
  const generateOrderID = () => {
    const now = new Date();
    return `ORD-${now.getFullYear()}${now.getMonth()}${now.getDate()}${now.getHours()}${now.getMinutes()}${now.getSeconds()}${now.getMilliseconds()}`;
  };

  /**
   * Handles the checkout process:
   * - Saves the order in Firestore
   * - Clears the cart
   * - Shows payment success component
   */
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
      paymentMethod: "Credit Card",
      orderDate,
      shippingStatus: "Processing",
      orderedItems: car,
      email: userData.email,
      totalPaid: total,
      status: "Pending",
      role: userData.rol,
      address: userData.address,
      phone: userData.phone,
      name: userData.name,
      userId: user.uid,
    };

    await addDoc(collection(db, "allOrders"), order);
    await setDoc(doc(db, "Car", user.uid), { car: [] });
    setCar([]);
    setPaid(true);
  };

  return (
    <>
      {/* Header - hidden on login and signup pages */}
      {!hiddenRoutes.includes(location.pathname) && (
        <Header toggle={toggle} setToggle={setToggle} />
      )}

      {/* Shopping Cart Drawer */}
      {toggle && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-end z-50">
          <div className="bg-white p-4 w-full max-w-md h-full overflow-y-auto">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">Shopping Bag</h2>
              <button onClick={() => setToggle(false)}>X</button>
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

            {/* Cart Summary and Payment Button */}
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

      {/* Payment Confirmation Component */}
      {paid && <PaymentSuccess onClose={() => setPaid(false)} />}

      {/* Main Routes */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/userProfile" element={<UserProfile />} />
        <Route path="/catalog/:category" element={<Catalog />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/sign_up" element={<SignUp />} />
        <Route path="/login_in" element={<Login />} />
      </Routes>

      {/* Footer - also hidden on login/signup pages */}
      {!hiddenRoutes.includes(location.pathname) && <Footer />}
    </>
  );
};

export default LayoutClient;
