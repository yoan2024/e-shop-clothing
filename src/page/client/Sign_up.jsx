import React, { useState } from "react";
// --- Import signup function from Firebase auth service --- //
import { signup } from "../../firebase/authService";
// --- Import useNavigate hook to redirect user after signup --- //
import { useNavigate } from "react-router-dom";

const Sign_up = () => {
  // --- Initialize navigation hook --- //
  const navegate = useNavigate();

  // --- State for user's email --- //
  const [email, setEmail] = useState("");

  // --- State for user's password --- //
  const [password, setPassword] = useState("");

  // --- State for user's name --- //
  const [name, setName] = useState("");

  // --- Handles form submission --- //
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // --- Calls the signup function with user inputs --- //
      const registrar = await signup(email, password, name);

      // --- Redirect user to homepage after successful signup --- //
      navegate("/");
    } catch (e) {
      // --- Logs any error that occurs during signup --- //
      console.log("hubo un error", e);
    }
  };

  return (
    <div className="w-full px-0  bg-yellow-500  min-w-96">
      <div className="bg-amber-500 min-h-screen  relative max-sm:flex-col  flex justify-center items-center gap-10">
        {/* --- Logo section --- */}
        <div className="max-sm:mt-7">
          <div className="text-6xl font-bold text-white">Trendora</div>
        </div>

        {/* --- Form container --- */}
        <div className="bg-white p-8  rounded-lg shadow-lg">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Name
              </label>
              {/* --- Input for name --- */}
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 border rounded-md"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              {/* --- Input for email --- */}
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border rounded-md"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Password
              </label>
              {/* --- Input for password --- */}
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border rounded-md"
                required
              />
            </div>

            {/* --- Submit button --- */}
            <button
              type="submit"
              className="bg-amber-500 text-white px-4 py-2 rounded hover:bg-amber-600"
            >
              Sign Up
            </button>
          </form>

          {/* --- Link to login page if user already has an account --- */}
          <span>
            Ya tienes cuenta?{" "}
            <a
              className="hover:text-blue-600  border-b-2 border-black"
              href="/login_in"
            >
              Login in here
            </a>
          </span>
        </div>

        {/* --- Decorative image in bottom corner --- */}
        <div className="w-96 h-60 sm:absolute sm:bottom-0 sm:left-0">
          <img
            src="/images/personaC.png"
            alt="persona"
            className="w-full h-full object-contain"
          />
        </div>
      </div>
    </div>
  );
};

export default Sign_up;
