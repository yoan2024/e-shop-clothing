import { useEffect, useState } from "react";
import { useParams, useLocation, Link } from "react-router-dom";
import { doc, getDoc, setDoc } from "firebase/firestore";
import ClipLoader from "react-spinners/ClipLoader";

import { db } from "../../firebase/firebase-config";
import { useProducts } from "../../context/ContextProducts";
import { useUser } from "../../context/User";
import { useCar } from "../../context/Car";
import { useFavorite } from "../../context/Favorites";
import { useLiked } from "../../context/Liked";

import { StarRating } from "../../component/Starts";
import { FavoriteButton } from "../../component/Heart";
import Modal from "../../component/Modal";

const ProductDetails = () => {
  // Contexts
  const { products } = useProducts();
  const { user } = useUser();
  const { car, setCar } = useCar();
  const { liked, setLiked } = useLiked();
  const { id } = useParams();
  const { favorites, setFavorites } = useFavorite();

  // States
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isFromSearch, setIsFromSearch] = useState(false);

  const location = useLocation();

  // Detect if user arrived from search
  useEffect(() => {
    const isSearchResult = new URLSearchParams(location.search).get("from") === "search";
    setIsFromSearch(isSearchResult);
  }, [location.search]);

  // Fetch current product and update liked state
  useEffect(() => {
    if (!products || products.length === 0) return;

    const selectedProduct = products.find((p) => p.id === Number(id));
    if (!selectedProduct) return;

    setProduct(selectedProduct);

    const fetchLikedState = async () => {
      if (!user) return;

      const favDocRef = doc(db, "favorites", user.uid);
      const snapshot = await getDoc(favDocRef);

      if (snapshot.exists()) {
        const data = snapshot.data();
        const favList = Array.isArray(data.favorites) ? data.favorites : [];
        const isFav = favList.some((item) => item.id === Number(id));
        setLiked(isFav);
      }
    };

    fetchLikedState();

    // Set related products
    if (isFromSearch) {
      const related = products
        .filter(
          (p) =>
            p.id !== selectedProduct.id && p.category === selectedProduct.category
        )
        .slice(0, 4);
      setRelatedProducts(related);
    } else {
      setRelatedProducts([]);
    }
  }, [id, products]);

  // Handle adding product to cart
  const handleAddToCart = async () => {
    if (!user) {
      setShowLoginModal(true);
      return;
    }

    try {
      const userId = user.uid;
      const cartDocRef = doc(db, "Car", userId);
      const cartSnapshot = await getDoc(cartDocRef);

      // If cart exists
      if (cartSnapshot.exists()) {
        const cartData = cartSnapshot.data().car || [];
        const existingItem = cartData.find((item) => item.id === product.id);

        if (existingItem) {
          const updatedCart = cartData.map((item) => {
            if (item.id === product.id && item.quantity <= 6) {
              const newQty = item.quantity + 1;
              return { ...item, quantity: newQty, total: newQty * item.price };
            }
            return item;
          });

          await setDoc(cartDocRef, { car: updatedCart });
          setCar(updatedCart);
          return;
        }

        const newItem = { ...product, quantity: 1, total: product.price };
        const updatedCart = [...cartData, newItem];

        await setDoc(cartDocRef, { car: updatedCart });
        setCar(updatedCart);
      } else {
        const newCartItem = { ...product, quantity: 1, total: product.price };
        await setDoc(cartDocRef, { car: [newCartItem] });
        setCar([newCartItem]);
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };

  // Loading spinner while fetching product
  if (!product) {
    return (
      <div className="w-full mt-14 min-h-screen flex justify-center items-center p-2">
        <ClipLoader />
      </div>
    );
  }

  return (
    <>
      <div className="w-full mt-20 min-h-screen flex justify-center items-center p-2">
        <main className="flex flex-col">
          <div className="flex w-10/12 flex-col p-4 sm:flex-row">
            {/* Product Image and Favorite Button */}
            <section className="max-sm:w-full flex justify-center items-center sm:w-2/4 relative">
              <img
                src={product.image}
                alt={product.title}
                className="max-sm:w-80 max-sm:h-80 sm:w-96 sm:h-96"
              />
              <div className="absolute top-5 right-5 max-sm:right-0">
                <FavoriteButton liked={liked} setLiked={setLiked} id={product.id} />
              </div>
            </section>

            {/* Product Info */}
            <section className="flex flex-col items-center max-sm:w-full gap-10 sm:w-2/4">
              <h1 className="text-center text-2xl md:text-3xl">{product.title}</h1>

              <div className="flex flex-row justify-between w-full items-center border-b-2 border-dashed border-gray-500 h-32">
                <div className="font-bold">Price: ${product.price} USD</div>
                <div className="flex gap-1 items-center">
                  <span className="text-slate-600">
                    Reviews: {product.rating.count}
                  </span>
                  {product.rating.rate}
                  <StarRating rating={product.rating.rate} />
                </div>
              </div>

              <div>
                <h3>Description:</h3>
                <p className="text-slate-600">{product.description}</p>
              </div>

              {/* Buttons */}
              <div className="w-full flex flex-row justify-between gap-2">
                <button
                  onClick={handleAddToCart}
                  className="bg-black text-white font-bold rounded-lg flex-1 max-sm:w-36 max-sm:h-16 md:w-32 md:h-24"
                >
                  Add To Cart
                </button>
                <Link
                  to="/checkout"
                  className="bg-white text-black font-bold border-2 border-black rounded-lg flex-1 max-sm:w-36 max-sm:h-16 md:w-32 md:h-24 flex items-center justify-center"
                >
                  Checkout Now
                </Link>
              </div>
            </section>
          </div>

          {/* Related products */}
          {isFromSearch && relatedProducts.length > 0 && (
            <section className="w-full px-4 py-8">
              <h2 className="text-2xl font-bold mb-4">Related Products</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                {relatedProducts.map((item) => (
                  <div key={item.id} className="border rounded p-4">
                    <img src={item.image} alt={item.title} className="w-full h-40" />
                    <div className="mt-2 font-semibold">{item.title}</div>
                    <div className="text-gray-600">${item.price}</div>
                    <Link
                      to={`/product/${item.id}?from=search`}
                      className="text-blue-500 underline"
                    >
                      View More
                    </Link>
                  </div>
                ))}
              </div>
            </section>
          )}
        </main>
      </div>

      {/* Login Modal */}
      <Modal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)}>
        <h2 className="text-xl font-semibold">You need to log in!</h2>
        <p className="mt-2">
          Please log in or register to add products to your cart.
        </p>
        <div className="mt-4 flex justify-center gap-4">
          <a href="/login_in" className="px-4 py-2 bg-blue-500 text-white rounded">
            Log In
          </a>
          <a href="/sign_up" className="px-4 py-2 bg-gray-400 text-white rounded">
            Register
          </a>
        </div>
      </Modal>
    </>
  );
};

export default ProductDetails;
