// components/Modal.jsx

/**
 * Modal Component
 * 
 * This component renders a modal dialog overlay when `isOpen` is true.
 * It's commonly used to show alerts, confirmations, or user actions like login prompts.
 * 
 * Props:
 * - isOpen (boolean): Controls the visibility of the modal.
 * - onClose (function): Function to call when closing the modal.
 * - children : Content to display inside the modal (title, message, buttons, etc).
 */

const Modal = ({ isOpen, onClose, children }) => {
  // If modal is not open, do not render anything
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      {/* Modal container */}
      <div className="bg-white p-6 rounded shadow-md w-[90%] max-w-md text-center">
        {/* Content passed from parent component (title, message, buttons...) */}
        {children}

        {/* Close button */}
        <button
          onClick={onClose}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default Modal;
