// MainProduct.tsx

// Importing required components and hooks
import Productos from "./Productos";
import AddProduct from "./AddProduct";
import { useState } from "react";

/**
 * This component renders the main product administration view.
 * It displays a button to add a product, the list of products,
 * and conditionally shows the AddProduct form.
 */
const MainProduct = () => {
  // Local state to toggle AddProduct component visibility
  const [add, setAdd] = useState(false);

  return (
    <div className="w-4/5">
      <main>
        {/* Add Product button is only shown if add === false */}
        {!add && (
          <div
            className="fixed top-0 cursor-pointer bg-green-500 p-3 rounded-2xl z-10"
            onClick={() => setAdd(true)}
          >
            +Add Product
          </div>
        )}

        {/* Section to display list of products */}
        <section>
          <Productos />
        </section>

        {/* Conditional rendering of AddProduct form */}
        <section>
          {add && <AddProduct onClose={() => setAdd(false)} />}
        </section>
      </main>
    </div>
  );
};

export default MainProduct;


