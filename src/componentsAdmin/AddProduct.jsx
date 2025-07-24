// Importing the component that contains the main logic for handling product forms
import LogicProduct from "./LogicProduct";

// AddProduct is a wrapper component used to add a new product.
// It delegates the main functionality to LogicProduct with the prop "logica" set to "agregar".
const AddProduct = ({ onClose }) => {
  return (
    <>
      {/* Rendering LogicProduct in "add" mode with empty product data */}
      <LogicProduct onClose={onClose} p={""} logica="agregar" />
    </>
  );
};

export default AddProduct;
