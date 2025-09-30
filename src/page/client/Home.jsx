// -- Home page: 
// --- This component is the main homepage that displays trending and relevant products,
// along with a call-to-action to visit the product catalog --- //







// --- Import required components and navigation hook --- //
import Tendenciaa from "../../component/Tendencita";
import ProductsShow from "../../component/ProductsShow";
import { useNavigate } from "react-router-dom";

const Home = () => {
  // --- Initialize navigation --- //
  const navegation = useNavigate();

  return (
    <div className="w-full mt-14 min-h-screen p-2">
      
      {/* --- Header section with a title --- */}
      <div className="text-center">
        <div className="text-2xl">Top most relevant products</div>
      </div>

      {/* --- Displays trending products (most relevant ones) --- */}
      <Tendenciaa />

      {/* --- Displays categorized relevant products for men, women, jewelry, and electronics --- */}
      <ProductsShow />

      {/* --- Info section about product quality and link to catalog --- */}
      <div className="mt-20 border-t-2 border-slate-200 border-solid">
        <div className="flex flex-col items-center gap-4">
          <div className="text-center font-light text-2xl bg-slate-100">
            High-quality products at the best price, because we care about giving
            excellent service to our customers. We also help you save with discounts
            and offers. For more information, you can view the catalog here.
          </div>

          {/* --- Button that navigates to the full catalog page --- */}
          <div
            className="p-2 my-20   cursor-pointer rounded-lg bg-red-100 font-semibold w-fit self-center"
            onClick={() => navegation("/catalog/all")}
          >
            View catalog
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
