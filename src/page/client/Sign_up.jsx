// --- Sign_up page:
// --- Handles user sign-up with Firebase authentication. --- //

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


  // --- State for error -- //
  const [error, setError] = useState("")

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
      if(e.code === "auth/email-already-in-use"){
        setError("credentials already in use")
      }
      console.log("error:", e);
    }
  };

  return (
    <div className="min-h-screen w-full bg-amber-500 relative flex items-center justify-center px-4 py-10">
<div className="flex flex-wrap sm:flex-nowrap items-center justify-center gap-10 max-w-5xl w-full">
        {/* --- Logo section --- */}
        <div className="max-sm:mt-7">
          <div className="text-6xl font-bold text-white">Trendora</div>
        </div>

        {/* --- Form container --- */}
        <div className="bg-white p-8  rounded-lg shadow-lg">
          <form onSubmit={handleSubmit} className="flex flex-col mb-5 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Name
              </label>
            
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
              
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border rounded-md"
                required
              />
            </div>

         
            <button
              type="submit"
              className="bg-amber-500 text-white px-4 py-2 rounded hover:bg-amber-600"
            >
              Sign Up
            </button>
          </form>

          {/* --- Link to login page if user already has an account --- */}
          <span >
            Already have an account?{" "}
            <a
              className="hover:text-blue-600  border-b-2 border-black"
              href="/login_in"
            >
              Login in here
            </a>
          </span>
          <div className="text-red-500 text-center">{error}</div>
        </div>

        {/* --- Decorative image in bottom corner --- */}
        <div className="w-96 h-60 sm:absolute sm:bottom-0 sm:left-0">
          <img
            src="/images/personC.png"
            alt="person"
            className="w-full h-full object-contain"
          />
        </div>
      </div>
    </div>
  );
};

export default Sign_up;
