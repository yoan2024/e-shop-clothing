// Productos.tsx

import { useState } from "react";
import { useProducts } from "../context/ContextProducts";
import { getDoc, setDoc, doc } from "firebase/firestore";
import { db } from "../firebase/firebase-config";
import LogicProduct from "./LogicProduct";

/**
 * This component displays all the products available in the database.
 * Admins can edit or delete any product from this panel.
 */
const Productos = () => {
  // Accessing products from context
  const { products, setProducts } = useProducts();

  // Local state for toggling edit modal and tracking current product
  const [showAllProducts, setShowAllProducts] = useState(false);
  const [editar, setEditar] = useState(false);
  const [productEditing, setProductEditing] = useState({});

  console.log("Current products", products);

  /**
   * Deletes a product from the Firestore and moves it to a deleted collection
   * @param {string} id - ID of the product to delete
   */
  const handleEliminarProduct = async (id) => {
    try {
      const refProductos = doc(db, "productos", "productos1088272651");
      const snapshot = await getDoc(refProductos);
      const productosData = snapshot.data();
      const allProducts = productosData.productos;

      // Find and filter the product to delete
      const productToDelete = products.find((p) => p.id === id);
      const updatedProducts = allProducts.filter((p) => p.id !== id);

      // Update Firestore with the new product list
      await setDoc(refProductos, { productos: updatedProducts });
      setProducts(updatedProducts);

      // Save deleted product in 'productosEliminados' collection
      const refDeleted = doc(db, "productosEliminados", "PE");
      const deletedSnapshot = await getDoc(refDeleted);

      if (deletedSnapshot.exists()) {
        const deletedData = deletedSnapshot.data();
        const updatedDeleted = [...deletedData.PE, productToDelete];
        await setDoc(refDeleted, { PE: updatedDeleted });
        console.log("Product deleted successfully (merged with existing)");
      } else {
        await setDoc(refDeleted, { PE: [productToDelete] });
        console.log("Product deleted successfully (new document)");
      }

      console.log(
        "Everything completed successfully",
        updatedProducts,
        "Deleted product:",
        productToDelete
      );
    } catch (e) {
      console.log("Error occurred while deleting product:", e);
    }
  };

  /**
   * Opens the LogicProduct form with the selected product
   */
  const handleEditar = (product) => {
    setEditar(true);
    setProductEditing(product);
  };

  if (!products) return <li>Loading...</li>;

  return (
    <>
      <div className="flex flex-row justify-center   flex-wrap  gap-4 relative">
        {products.map((product, index) => (
          <div
            key={index}
            className="w-52 max-md:w-28  h-auto flex flex-col items-center text-center transition-transform duration-300 transform hover:scale-105 hover:shadow-lg border rounded-xl p-3 cursor-pointer bg-white"
          >
            {/* Product image */}
            <div className="bg-white w-full h-40 max-md:h-20   flex items-center justify-center overflow-hidden rounded-md">
              <img
                src={product.image}
                alt={product.title}
                className="max-h-full max-w-full transition-transform duration-300 transform hover:scale-110"
              />
            </div>

            {/* Product title */}
            <div className="mt-2 text-sm font-medium line-clamp-2 h-10">
              {product.title}
            </div>

            {/* Product price */}
            <div className="text-lg font-bold text-green-600">
              ${product.price}
            </div>

            {/* Extra admin info */}
            <div className="text-xs text-gray-500">ID: {product.id}</div>
            {product.category && (
              <div className="text-xs text-gray-500">
                Category: {product.category}
              </div>
            )}

            {/* Action buttons */}
            <div className="flex max-md:flex-col  gap-2 mt-2">
              <button
                className="px-2 py-1 text-sm text-white bg-blue-500 rounded hover:bg-blue-600"
                onClick={() => handleEditar(product)}
              >
                Edit
              </button>
              <button
                className="px-2 py-1 text-sm text-white bg-red-500 rounded hover:bg-red-600"
                onClick={() => handleEliminarProduct(product.id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit modal */}
      {editar && (
        <LogicProduct
          onClose={() => setEditar(false)}
          p={productEditing}
          logica={"editar"}
        />
      )}
    </>
  );
};

export default Productos;
