import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css"; // <-- this is important!
import App from "./App.jsx";
import UserProvider from "./context/User.jsx";
import UserProviderProductos from "./context/ContextProducts.jsx";
import CarritoProvider from "./context/Carrito.jsx";
import PedidosProvider from "./context/PedidosProvider.jsx";
import FavoritesProvider from "./context/Favorites.jsx";
import LikedProvider from "./context/Liked.jsx";

import ImageProvider from "./context/Image.jsx";
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <PedidosProvider>
      <ImageProvider>
        <LikedProvider>
          <FavoritesProvider>
            <CarritoProvider>
              <UserProviderProductos>
                <UserProvider>
                  <App />
                </UserProvider>
              </UserProviderProductos>
            </CarritoProvider>
          </FavoritesProvider>
        </LikedProvider>
      </ImageProvider>
    </PedidosProvider>
  </StrictMode>
);
