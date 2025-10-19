import React, { useState } from "react";
import { auth } from "../../firebase/firebase-config";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";

export default function PhoneLogin() {
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [confirmationResult, setConfirmationResult] = useState(null);


  const sendCode = async () => {
    try {
     
      window.recaptchaVerifier = new RecaptchaVerifier(
        "recaptcha-container",
        { size: "invisible" },
        auth
      );

      const appVerifier = window.recaptchaVerifier;
      const fullPhone = "+57" + phone; 

      const result = await signInWithPhoneNumber(auth, fullPhone, appVerifier);
      setConfirmationResult(result);
      alert("📲 SMS sent successfully!");
    } catch (error) {
      console.error(error);
      alert("❌ Error sending code: " + error.message);
    }
  };

  // Step 2: Verificar código
  const verifyCode = async () => {
    try {
      await confirmationResult.confirm(code);
      alert("✅ Phone verified successfully!");
    } catch (error) {
      alert("❌ Wrong code!");
    }
  };

  return (
    <div>
      <h2>Login with phone</h2>
      <input
        type="text"
        placeholder="Phone number (e.g. 3001234567)"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />
      <button onClick={sendCode}>Send Code</button>

      <div id="recaptcha-container"></div>

      {confirmationResult && (
        <>
          <input
            type="text"
            placeholder="Enter verification code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
          <button onClick={verifyCode}>Verify Code</button>
        </>
      )}
    </div>
  );
}
