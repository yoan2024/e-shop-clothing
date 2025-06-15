import UserProvider from "./context/User.jsx";
import UserProviderProductos from "./context/ContextProducts.jsx";
import CarritoProvider from "./context/Carrito.jsx";
import PedidosProvider from "./context/PedidosProvider.jsx";
import FavoritesProvider from "./context/Favorites.jsx";
import LikedProvider from "./context/Liked.jsx";
import ImageProvider from "./context/Image.jsx";
import { useUser } from "./context/User.jsx";
import { useProducts } from "./context/ContextProducts.jsx";
import AppwithRoutes from "./routes/AppwithRoutes.jsx";
const App = () => {
  return (
    <PedidosProvider>
      <ImageProvider>
        <LikedProvider>
          <FavoritesProvider>
            <CarritoProvider>
              <UserProviderProductos>
                <UserProvider>
                  <AppwithRoutes />
                </UserProvider>
              </UserProviderProductos>
            </CarritoProvider>
          </FavoritesProvider>
        </LikedProvider>
      </ImageProvider>
    </PedidosProvider>
  );
};

export default App;
