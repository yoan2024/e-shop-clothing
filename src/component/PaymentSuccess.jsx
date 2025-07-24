import { useEffect } from "react";
import { CheckCircle } from "lucide-react";

const PaymentSuccess = ({ onClose }) => {
  // Cierra el popup después de 3 segundos
  useEffect(() => {
  
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm text-center animate-fade-in-up">
        <CheckCircle className="text-green-500 w-16 h-16 mx-auto mb-4" />
        <h2 className="text-xl font-semibold mb-2">
          ¡Pago realizado con éxito!
        </h2>
        <p className="text-gray-600">
          Gracias por tu compra. Te enviaremos una confirmación por email.
        </p>
      </div>
    </div>
  );
};

export default PaymentSuccess;
