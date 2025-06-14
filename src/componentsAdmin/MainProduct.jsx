import { useState } from "react";
import { useProducts } from "../context/ContextProducts";
import { getDoc, setDoc } from "firebase/firestore";
import { db } from "../firebase/firebase-config";
import { doc } from "firebase/firestore";
import EditarProduct from "./EditarProduct";

const MainProduct = () => {
  const { products, setProducts } = useProducts();
  const [showAllProducts, setShowAllProducts] = useState(false);
  const [editar, setEditar] = useState(false);
  const [productEditing, setProductEditing] = useState({});
  console.log("current products", products);

  const handleEliminarProduct = async (id) => {
    try {
      const refproductos = doc(db, "productos", "productos1088272651");
      const getproductos = await getDoc(refproductos);
      const productos = getproductos.data();
      const p = productos.productos;
      const producto_eliminar = products.find((p) => p.id === id);
      const eliminarP = p.filter((p) => p.id !== id);
      setDoc(refproductos, {
        productos: eliminarP,
      });
      setProducts(eliminarP);

      const refdoc = doc(db, "productosEliminados", "PE");

      const getdoc = await getDoc(refdoc);
      if (getdoc.exists()) {
        const doc = getdoc.data();
        const PE = doc.PE;
        setDoc(refproductos, {
          PE: [...PE, producto_eliminar],
        });
        console.log("Se elimino correctamente el producto");
      } else {
        setDoc(refdoc, {
          PE: [producto_eliminar],
        });
        console.log("Se elimino correctamente el productoen else");
      }
    } catch (e) {
      console.log("error encontrado", e);
    }

    console.log(
      "todod salio corectamente",
      eliminarP,
      "productos eliminado",
      producto_eliminar
    );
  };

  const handleEditar = (p) => {
    setEditar(true);
    setProductEditing(p);
  };

  return (
    <div className="w-4/5">
      <main>
        <section>
          <div className="flex flex-row justify-center flex-wrap gap-4">
            {products.map((p) => {
              return (
                <div
                  key={p.id}
                  className="w-52 h-auto flex flex-col items-center text-center transition-transform duration-300 transform hover:scale-105 hover:shadow-lg border rounded-xl p-3 cursor-pointer bg-white"
                >
                  <div className="bg-white w-full h-40 flex items-center justify-center overflow-hidden rounded-md">
                    <img
                      src={p.image}
                      alt={p.title}
                      className="max-h-full max-w-full transition-transform duration-300 transform hover:scale-110"
                    />
                  </div>

                  <div className="mt-2 text-sm font-medium line-clamp-2 h-10">
                    {p.title}
                  </div>

                  <div className="text-lg font-bold text-green-600">
                    ${p.price}
                  </div>

                  {/* Extra info para admins */}
                  <div className="text-xs text-gray-500">ID: {p.id}</div>
                  {p.category && (
                    <div className="text-xs text-gray-500">
                      Categoría: {p.category}
                    </div>
                  )}

                  {/* Botones */}
                  <div className="flex gap-2 mt-2">
                    <button
                      className="px-2 py-1 text-sm text-white bg-blue-500 rounded hover:bg-blue-600"
                      onClick={() => handleEditar(p)}
                    >
                      Editar
                    </button>
                    <button
                      className="px-2 py-1 text-sm text-white bg-red-500 rounded hover:bg-red-600"
                      onClick={() => handleEliminarProduct(p.id)}
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
          {editar && (
            <EditarProduct
              onClose={() => setEditar(false)}
              p={productEditing}
            />
          )}
        </section>
      </main>
    </div>
  );
};

export default MainProduct;
