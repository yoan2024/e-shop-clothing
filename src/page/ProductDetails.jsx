import { useParams } from "react-router-dom";
import { useProducts } from "../context/ContextProducts";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

import ClipLoader from "react-spinners/ClipLoader";
import { StarRating } from "../component/Starts";
import { FavoriteButton } from "../component/Heart";
import Modal from "../component/Modal";
import { useUser } from "../context/User";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../firebase/firebase-config";
import { addDoc, collection } from "firebase/firestore";
import { updateDoc } from "firebase/firestore";
import { deleteField } from "firebase/firestore";
import { getDoc } from "firebase/firestore";
import { useCarrito } from "../context/Carrito";
import { useLocation } from "react-router-dom";
import { useFavorite } from "../context/Favorites";
import { useLiked } from "../context/Liked";
const ProductDetails = () => {
  const { favorites, setFavorites } = useFavorite();
  const { carrito, setCarrito } = useCarrito();
  const { user, setUser } = useUser();
  const { id } = useParams();
  const { products, setProducts } = useProducts();
  const [product, setProduct] = useState(null);
  const [similarProducts, setSimilarProducts] = useState([]);
  const { liked, setLiked } = useLiked();
  const [isSearch, setIsSearch] = useState(false);

  const location = useLocation();

  useEffect(() => {
    if (!products) return;
    async function getProduct(params) {
      if (products.length > 0) {
        console.log("entro aca en el useefecttttt");
        const currentProduct = products.find((p) => p.id === Number(id));
        setProduct(currentProduct);

        const iduser = user.uid;

        const refdata = doc(db, "favorites", iduser);
        const getdata = await getDoc(refdata);
        console.log("collllllllllllll", getdata);
        if (getdata.exists()) {
          const f = getdata.data();
          const d = f.favorites;
          console.log("current id produt", id);
          const findI = d.find((i) => i.id === Number(id));
          console.log(
            "se incontro el itemssssssssssssssssssssssssssssssssssssssssssssssss",
            findI
          );
          if (findI) {
            setLiked(true);
          } else if (!findI) {
            setLiked(false);
            console.log(
              "actualizado a false correctamente el liked en product details",
              false
            );
          }
        }
        if (isSearch && currentProduct) {
          const similars = products
            .filter(
              (p) =>
                p.id !== currentProduct.id &&
                p.category === currentProduct.category
            )
            .slice(0, 4); // mostramos solo 4 similares
          setSimilarProducts(similars);
        } else {
          setSimilarProducts([]);
        }
      }
    }

    getProduct();
  }, [id, products]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const url = new URLSearchParams(location.search).get("from") === "search";
    if (url) {
      setIsSearch(true);
    } else {
      setIsSearch(false);
    }
  }, [location.search]);

  const handleAddToCart = async () => {
    if (!user) {
      setShowModal(true);
      return;
    }

    try {
      const uid = await user.uid;
      const refDocument = doc(db, "Carrito", uid);
      const getDocument = await getDoc(refDocument);
      if (getDocument.exists()) {
        const data = getDocument.data();
        const carritosAll = data.carrito;
        console.log("carrito current del firestorage", carritosAll);
        console.log("esta es los current carritos", data);
        const findItem = carritosAll.find((i) => i.id === product.id);
        console.log("Se incontro el item", findItem);
        if (findItem) {
          const cars = carritosAll.map((i) => {
            if (i.id === product.id && i.cantidad <= 6) {
              const cant = i.cantidad + 1;
              return { ...i, cantidad: cant, total: cant * i.price };
            }
            return i;
          });

          setDoc(doc(db, "Carrito", uid), {
            carrito: cars,
          });
          setCarrito(cars);
          return;
        }

        const newItem = { ...product, cantidad: 1, total: product.price };
        const currenCars = [...carritosAll, newItem];
        setDoc(doc(db, "Carrito", uid), {
          carrito: currenCars,
        });
        setCarrito(currenCars);
      } else {
        const item = { ...product, cantidad: 1, total: product.price };
        console.log("entro en el else", product.price);

        try {
          setDoc(doc(db, "Carrito", uid), {
            carrito: [item],
          });
          setCarrito([item]);
        } catch (e) {
          console.log(
            "hubo un eeror al intentar agregar iten al caarrito e ¿n firestorage",
            e
          );
        }
      }
    } catch (e) {
      console.log("hubo un error al principio del try", e);
    }
  };

  <ClipLoader />;
  console.log("ccuren liked en page detailsproduct", liked);
  if (!product)
    return (
      <div className="w-full mt-14  min-h-screen flex flex-row justify-center items-center p-2">
        <ClipLoader />
      </div>
    );
  return (
    <>
      <div className="w-full mt-20 flex flex-row justify-center min-h-screen p-2">
        <main className="flex flex-col">
          <div className="flex  w-10/12 flex-col p-4  sm:flex-row">
            <section className=" max-sm:w-full flex flex-row justify-center items-center sm:w-2/4 relative ">
              <div>
                <img
                  src={product.image}
                  alt={product.title}
                  className="max-sm:w-80 max-sm:h-80 sm:w-96 sm:h-96"
                />
              </div>

              <div className="absolute top-5 right-5 max-sm:right-0">
                <FavoriteButton
                  liked={liked}
                  setLiked={setLiked}
                  id={product.id}
                />
              </div>
            </section>
            <section className="flex flex-col  items-center  max-sm:w-full gap-10  sm:w-2/4 ">
              <div className="text-center md:text-3xl text-2xl">
                {product.title}
              </div>
              <div className="flex mt-4 flex-row justify-between  w-full items-center  border-b-2 border-dashed border-gray-500 h-32">
                <div className="font-bold">PRICE: ${product.price} USD</div>
                <div className="flex flex-row gap-1 items-center">
                  <div>
                    <span className="text-slate-600">
                      total reviews {product.rating.count}{" "}
                    </span>{" "}
                  </div>
                  {product.rating.rate}
                  <StarRating rating={product.rating.rate} />{" "}
                </div>
              </div>

              <div>
                <div>Description: </div>
                <div className="text-slate-600">{product.description} </div>
              </div>
              <div className="w-full flex flex-row justify-between">
                <Link
                  className="bg-black text-white font-bold rounded-lg w-52 text-center p-5 max-lg:w-32"
                  onClick={handleAddToCart}
                >
                  Add To Cart
                </Link>
                <Link className="border-solid border-slate-400 border-2   font-bold rounded-lg max-lg:w-32 w-52 text-center p-5 ">
                  Checkout Now
                </Link>
              </div>
            </section>
          </div>
          {isSearch && similarProducts.length > 0 && (
            <section className="w-full px-4 py-8">
              <h2 className="text-2xl font-bold mb-4">Productos similares</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                {similarProducts.map((item) => (
                  <div key={item.id} className="border rounded p-4">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-40 "
                    />
                    <div className="mt-2 font-semibold">{item.title}</div>
                    <div className="text-gray-600">${item.price}</div>
                    <Link
                      to={`/product/${item.id}?from=search`}
                      className="text-blue-500 underline"
                    >
                      Ver más
                    </Link>
                  </div>
                ))}
              </div>
            </section>
          )}
        </main>
      </div>
      <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
        <h2 className="text-xl font-semibold">¡Necesitas iniciar sesión!</h2>
        <p className="mt-2">
          Por favor inicia sesión o regístrate para agregar productos al
          carrito.
        </p>
        <div className="mt-4 flex justify-center gap-4">
          <a
            href="/login_in"
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            Iniciar sesión
          </a>
          <a
            href="/sign_up"
            className="px-4 py-2 bg-gray-400 text-white rounded"
          >
            Registrarse
          </a>
        </div>
      </Modal>
    </>
  );
};

export default ProductDetails;
