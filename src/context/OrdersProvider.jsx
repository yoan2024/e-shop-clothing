import { createContext, useContext, useState } from "react";

// 1. Create context for orders and order history
const Context = createContext();

// 2. Provider component to share order data globally
const OrdersProvider = ({ children }) => {
  // State to store current orders
  const [orders, setOrders] = useState([]);

  // State to store past order history
  const [orderHistory, setOrderHistory] = useState([]);

  return (
    <Context.Provider
      value={{
        orders,
        setOrders,
        orderHistory,
        setOrderHistory
      }}
    >
      {children}
    </Context.Provider>
  );
};

// 3. Custom hook to access the Orders context
export function useOrders() {
  const context = useContext(Context);

  // Throw an error if hook is used outside of its Provider
  if (!context) {
    throw new Error(
      "useOrders must be used within an OrdersProvider."
    );
  }

  return context;
}



export default OrdersProvider;
