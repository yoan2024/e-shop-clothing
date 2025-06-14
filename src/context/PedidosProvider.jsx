import { useContext, createContext, useState } from "react";

const Context = createContext();

const PedidosProvider = ({ children }) => {
  const [pedidos, setPedidos] = useState([]);
  const [historialPedidos, setHistorialPedidos] = useState([]);
  return (
    <Context.Provider
      value={{ pedidos, setPedidos, historialPedidos, setHistorialPedidos }}
    >
      {children}
    </Context.Provider>
  );
};

export function usePedidos() {
  const context = useContext(Context);
  if (!context) {
    throw new Error(
      "no se puede usar usePedidos por que esta fuera de contexto"
    );
  }
  return context;
}

export default PedidosProvider;
