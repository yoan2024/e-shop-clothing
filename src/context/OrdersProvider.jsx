import { useContext, createContext, useState } from "react";

const Context = createContext();

const OrdersProvider = ({ children }) => {
  const [ orders, setOrders] = useState([]);
  const [orderHistory, setOrderHistory] = useState([]);
  return (
    <Context.Provider
      value={{ orders, setOrders, orderHistory, setOrderHistory }}
    >
      {children}
    </Context.Provider>
  );
};

export function useOrders() {
  const context = useContext(Context);
  if (!context) {
    throw new Error(
      "You cannot use useOrders because it is out of context."
    );
  }
  return context;
}

export default OrdersProvider;
