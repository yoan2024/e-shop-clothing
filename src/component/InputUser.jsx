import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaPencilAlt } from "react-icons/fa";

// 🔹 Constants for validation
const MAX_LENGTH = 50;
const PHONE_REGEX = /^3\d{9}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const InputUser = ({
  disable,
  field,
  saving,
  value,
  setstate,
  handlesave,
  handleclick,
  texto,
  user,
}) => {
  const isEditing = disable.includes(field);

  // UI + validation
  const [hoverX, setHoverX] = useState(false);
  const [error, setError] = useState("");

  // Simulated phone verification states
  const [showModal, setShowModal] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [generatedCode, setGeneratedCode] = useState(null);
  const [isVerified, setIsVerified] = useState(false);
  const [sendingCode, setSendingCode] = useState(false);
  const [sendCooldown, setSendCooldown] = useState(0); // seconds left until resend allowed

  // VALIDATION for each field when user edits
  useEffect(() => {
    if (!isEditing) return;

    const trimmed = (value || "").toString().trim();
    if (!trimmed) {
      setError("This field cannot be empty.");
      return;
    }

    if (trimmed.length > MAX_LENGTH) {
      setError(`Maximum ${MAX_LENGTH} characters allowed.`);
      return;
    }

    switch (field) {
      case "name":
        setError(/^[a-zA-ZÀ-ÿ\s]+$/.test(trimmed) ? "" : "Name can only contain letters.");
        break;
      case "email":
        setError(EMAIL_REGEX.test(trimmed) ? "" : "Invalid email format.");
        break;
      case "address":
        setError(trimmed.length < 5 ? "Address too short." : "");
        break;
      case "phone":
        setError(PHONE_REGEX.test(trimmed) ? "" : "Invalid Colombian phone (starts with 3, 10 digits).");
        break;
      default:
        setError("");
    }
  }, [value, field, isEditing]);

  // Cooldown timer for resend (simple)
  useEffect(() => {
    if (sendCooldown <= 0) return;
    const t = setTimeout(() => setSendCooldown((c) => Math.max(0, c - 1)), 1000);
    return () => clearTimeout(t);
  }, [sendCooldown]);

  // SIMULATED: send code (generate local code and "send" it)
  const handleSendCode = () => {
    if (error) return;

    setSendingCode(true);

    // generate 6-digit code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedCode(code);

    // simulate async sending
    setTimeout(() => {
      setSendingCode(false);
      setShowModal(true);
      setSendCooldown(30); // 30s cooldown to resend
      // For development: show in console & alert (replace later with real SMS)
      console.log(`📱 Simulated SMS to +57${value}: ${code}`);
      // eslint-disable-next-line no-alert
      alert(`Simulated verification code sent to +57${value}: ${code}`);
    }, 900);
  };

  // SIMULATED: verify entered code
  const handleVerifyCode = () => {
    if (!generatedCode) {
      // nothing sent
      // eslint-disable-next-line no-alert
      alert("No code was sent. Please request a verification code first.");
      return;
    }
    if (verificationCode === generatedCode) {
      setIsVerified(true);
      setShowModal(false);
      setGeneratedCode(null);
      setVerificationCode("");
      // Optionally call handlesave to persist phone immediately
      if (typeof handlesave === "function") {
        handlesave(); // call the parent save handler to persist the phone
      }
      // eslint-disable-next-line no-alert
      alert("✅ Phone number successfully verified (simulated).");
    } else {
      // eslint-disable-next-line no-alert
      alert("❌ Incorrect code. Try again.");
    }
  };

  // Handler for Save button in the form
  const handleSaveClick = () => {
    if (field === "phone" && !isVerified) {
      handleSendCode();
      return;
    }
    // for other fields or verified phone, run the provided save handler
    handlesave();
  };

  return (
    <div className="mb-6">
      <div className="flex flex-row justify-between gap-5">
        {/* LABEL + VIEW */}
        <div className="flex flex-col justify-center">
          <label htmlFor={field} className="block text-sm font-medium text-gray-700 mb-1">
            {texto}
          </label>
          {!isEditing && (
            <div className="text-gray-800 text-sm">
              {field === "phone" && isVerified ? `${value} (verified)` : value || "Not specified"}
            </div>
          )}
        </div>

        {/* EDIT MODE */}
        {isEditing ? (
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full sm:w-auto">
            <div
              className="relative w-full sm:w-80"
              onMouseEnter={() => setHoverX(true)}
              onMouseLeave={() => setHoverX(false)}
            >
              <input
                id={field}
                type={field === "email" ? "email" : field === "phone" ? "tel" : "text"}
                value={value}
                onChange={(e) => {
                  // reset verified flag if phone value changes
                  if (field === "phone") setIsVerified(false);
                  setstate(e.target.value);
                }}
                minLength={field === "phone" ? 10 : 2}
                maxLength={MAX_LENGTH}
                className={`w-full px-4 py-2 border rounded-md shadow-sm transition-all duration-200 placeholder-gray-400 ${
                  error
                    ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                    : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                }`}
                placeholder={`Enter your ${texto.toLowerCase()}`}
              />

              {hoverX && value && (
                <span
                  className="absolute right-3 top-2 text-xs px-2 py-0.5 bg-gray-600 text-white rounded-full cursor-pointer"
                  onClick={() => {
                    setstate("");
                    if (field === "phone") setIsVerified(false);
                  }}
                >
                  x
                </span>
              )}
              {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
            </div>

            {/* Save / Verify Button */}
            {saving ? (
              <span className="text-sm text-gray-600 font-semibold">Saving...</span>
            ) : (
              <button
                onClick={handleSaveClick}
                disabled={!!error || sendingCode || (field === "phone" && sendCooldown > 0 && !showModal)}
                className={`px-4 py-2 rounded-md text-sm font-medium shadow-sm transition duration-200 ${
                  error || sendingCode
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                }`}
              >
                {field === "phone" && !isVerified
                  ? sendingCode
                    ? "Sending..."
                    : showModal
                    ? "Enter code"
                    : sendCooldown > 0
                    ? `Resend (${sendCooldown}s)`
                    : "Verify Phone"
                  : "Save"}
              </button>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <div
              onClick={() => handleclick(field)}
              className="relative group cursor-pointer text-gray-500 hover:text-blue-600 transition"
            >
              {value === "" || value === "unconfirmed" ? (
                <span className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition duration-200 text-sm font-medium shadow-sm">
                  Add
                </span>
              ) : (
                <>
                  <FaPencilAlt className="w-4 h-4" />
                  <div className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                    Edit
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {/* VERIFICATION MODAL (SIMULATED) */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-lg shadow-xl p-6 w-96"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
            >
              <h2 className="text-lg font-semibold mb-3">Phone Verification</h2>
              <p className="text-sm text-gray-600 mb-4">
                Enter the 6-digit code sent to your phone number (simulated).
              </p>

              <input
                type="text"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                maxLength={6}
                placeholder="Enter code"
                className="w-full border border-gray-300 rounded-md px-4 py-2 mb-4 focus:ring-blue-500 focus:border-blue-500"
              />

              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-600">
                  {sendCooldown > 0 ? `You can resend in ${sendCooldown}s` : "Didn't receive it?"}
                </div>

                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => {
                      setShowModal(false);
                      setVerificationCode("");
                    }}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                  >
                    Cancel
                  </button>

                  <button
                    onClick={handleVerifyCode}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Confirm
                  </button>
                </div>
              </div>

              <div className="mt-3 flex justify-between">
                <button
                  onClick={() => {
                    if (sendCooldown > 0) return;
                    handleSendCode();
                  }}
                  className={`text-xs underline ${sendCooldown > 0 ? "text-gray-400 cursor-not-allowed" : "text-blue-600"}`}
                >
                  {sendCooldown > 0 ? `Resend available in ${sendCooldown}s` : "Resend code"}
                </button>

                <div className="text-xs text-gray-500">This is a simulated flow.</div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default InputUser;
