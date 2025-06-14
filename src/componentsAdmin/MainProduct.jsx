import Productos from "./Productos";
import AddProduct from "./AddProduct";
import { useState } from "react";
const MainProduct = () => {
  const [add, setAdd] = useState(false);
  return (
    <div className="w-4/5">
      <main>
        {!add && (
          <div
            className="fixed top-0 cursor-pointer bg-green-500 p-3 rounded-2xl z-10"
            onClick={() => setAdd(true)}
          >
            +Add Product
          </div>
        )}
        <section>
          <Productos />
        </section>
        <section>{add && <AddProduct onClose={() => setAdd(false)} />}</section>
      </main>
    </div>
  );
};

export default MainProduct;

{
  /*  if (file && file.size > 2 * 1024 * 1024) { // 2 MB
    alert("La imagen es demasiado grande. Máximo 2 MB.");
    return;
  }
*/
}
