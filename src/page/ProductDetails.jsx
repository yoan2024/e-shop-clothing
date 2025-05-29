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

const ProductDetails = () => {
  const { user, setUser } = useUser();
  const { products, setProducts } = useProducts();
  const [product, setProduct] = useState(null);
  const { id } = useParams();
  useEffect(() => {
    async function foundProdut(params) {
      let produ = await products;
      if (produ) {
        const finProduct = await produ.find((p) => p.id === Number(id));
        setProduct(finProduct);
      }
    }
    foundProdut();
  }, [products]);
  const [showModal, setShowModal] = useState(false);

  const handleAddToCart = async () => {
    if (!user) {
      setShowModal(true);
      return;
    }

    try {
      const ids = await user.uid;
      const citiesRef = collection(db, "carrito");

      await setDoc(doc(citiesRef, ids), { product });
    } catch (e) {
      console.log(e);
    }
  };

  <ClipLoader />;
  console.log(product);

  if (!product)
    return (
      <div className="w-full mt-14  min-h-screen flex flex-row justify-center items-center p-2">
        <ClipLoader />
      </div>
    );
  return (
    <>
      <div className="w-full mt-20 flex flex-row justify-center min-h-screen p-2">
        <main className="flex  w-10/12 flex-col p-4  sm:flex-row">
          <section className=" max-sm:w-full flex flex-row justify-center items-center sm:w-2/4 relative ">
            <div>
              <img
                src={product.image}
                alt={product.title}
                className="max-sm:w-80 max-sm:h-80 sm:w-96 sm:h-96"
              />
            </div>

            <div className="absolute top-5 right-5 max-sm:right-0">
              <FavoriteButton />
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
          </section>{" "}
          <section></section>
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
