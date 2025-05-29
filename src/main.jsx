import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css"; // <-- this is important!
import App from "./App.jsx";
import UserProvider from "./context/User.jsx";
import UserProviderProductos from "./context/ContextProducts.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <UserProviderProductos>
      <UserProvider>
        <App />
      </UserProvider>
    </UserProviderProductos>
  </StrictMode>
);
