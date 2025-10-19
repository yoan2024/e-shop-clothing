import UserProvider from "./context/User.jsx";
import UserProviderProductos from "./context/ContextProducts.jsx";
import CarProvider from "./context/Car.jsx";
import OrdersProvider from "./context/OrdersProvider.jsx";
import FavoritesProvider from "./context/Favorites.jsx";
import LikedProvider from "./context/Liked.jsx";
import ImageProvider from "./context/Image.jsx";
import UserProfileProvider from "./context/userProfileProvider.jsx";


import AppwithRoutes from "./routes/AppwithRoutes.jsx";

const App = () => {
  return (
    <UserProfileProvider >
    <OrdersProvider>
      <ImageProvider>
        <LikedProvider>
          <FavoritesProvider>
            <CarProvider>
              <UserProviderProductos>
                <UserProvider>
                  <AppwithRoutes />
                </UserProvider>
              </UserProviderProductos>
            </CarProvider>
          </FavoritesProvider>
        </LikedProvider>
      </ImageProvider>
    </OrdersProvider>
    </UserProfileProvider>
  );
};

export default App;
