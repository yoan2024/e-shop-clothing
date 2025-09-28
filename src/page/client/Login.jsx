/**
 * Login Page
 * - Fully responsive layout
 * - Firebase authentication
 * - Mobile-friendly design
 */

import React, { useState } from "react";
import { login } from "../../firebase/authService";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault();
    

    try {
      await login(email, password);
      navigate("/");
      
    } catch (e) {
      
    const errorCode = e.code;
    const errorMessage = e.message;
    if (errorCode === "auth/invalid-credential") {
      setError("The credentials are not valid");
    } else if (errorCode === "auth/user-not-found") {
      setError("User not found");

    } else if (errorCode === "auth/wrong-password") {
      setError("Incorrect password");
    } else {
      console.log("error:", errorMessage);
    }
    }
  };

  return (
    <div className="min-h-screen w-full bg-amber-500 flex items-center justify-center px-4 py-10">
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-10 max-w-5xl w-full">
        
        {/* Logo */}
        <div className="text-5xl sm:text-6xl font-bold text-white text-center sm:text-left">
          Trendora
        </div>

        {/* Login Form */}
        <div className="bg-white p-6 sm:p-8 rounded-lg shadow-lg  w-full sm:w-[400px]">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 mb-4">
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
              Login
            </button>
          </form>

          <span className="text-sm text-center block">
            Don’t have an account yet?{" "}
            <a
              className="hover:text-blue-600 border-b-2 border-black"
              href="/sign_up"
            >
              Sign up here
            </a>
          </span>

          <div className="text-red-500 text-center">{error}</div>
        </div>

        {/* Image */}
        <div className="w-40 sm:w-60 h-auto sm:absolute sm:bottom-0 sm:left-0">
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

export default Login;
