// components/PaymentSuccess.jsx

/**
 * This component displays a temporary success popup after a payment is completed.
 * It automatically disappears after 3 seconds and shows a success message.
 */

import { useEffect } from "react";
import { CheckCircle } from "lucide-react";

const PaymentSuccess = ({ onClose }) => {
  // Automatically closes the popup after 3 seconds
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm text-center animate-fade-in-up">
        <CheckCircle className="text-green-500 w-16 h-16 mx-auto mb-4" />
        <h2 className="text-xl font-semibold mb-2">
          Payment Successful!
        </h2>
        <p className="text-gray-600">
          Thank you for your purchase. A confirmation email will be sent to you shortly.
        </p>
      </div>
    </div>
  );
};

export default PaymentSuccess;
