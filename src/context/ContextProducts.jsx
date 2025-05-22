import { createContext, useContext, useEffect, useState } from "react";

const Context = createContext();

const UserProvider = ({ children }) => {
  const [products, setProducts] = useState();

  useEffect(() => {
    async function usarFecht() {
      const data = await fetch("https://fakestoreapi.com/products")
        .then((response) => response.json())
        .then((data) => {
          setProducts(data);
          console.log(data);
        });
    }

    usarFecht();
  }, []);

  return (
    <Context.Provider value={{ products, setProducts }}>
      {children}
    </Context.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(Context);
  if (!context) {
    throw new Error("no se puede usar el useProducts fuera del provider");
  }
  return context;
};

export default UserProvider;
