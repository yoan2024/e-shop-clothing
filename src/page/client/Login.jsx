import React, { useState } from "react";
// --- Import login function from Firebase authentication service --- //
import { login } from "../../firebase/authService";
// --- Import hook for navigation between pages --- //
import { useNavigate } from "react-router-dom";

const Login = () => {
  // --- Hook to navigate programmatically --- //
  const navigate = useNavigate();

  // --- State to store user's email and password --- //
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // --- Handles form submission --- //
  const handleSubmit = async (e) => {
    e.preventDefault();

    // --- Redirect to home page after login --- //
    navigate("/");

    try {
      // --- Attempt to login with email and password --- //
      await login(email, password);
    } catch (e) {
      // --- Log any login errors to the console --- //
      console.log(e);
    }
  };

  return (
    <div className="w-full px-0 min-h-screen min-w-96">
      <div className="bg-amber-500 min-h-screen relative max-sm:flex-col flex justify-center items-center gap-10">
        {/* --- Logo section --- */}
        <div className="max-sm:mt-7">
          <div className="text-6xl font-bold text-white">Trendora</div>
        </div>

        <div className="bg-white p-8 rounded-lg shadow-lg">
          {/* --- Login form --- */}
          <form onSubmit={handleSubmit} className="flex mb-5 flex-col gap-4">
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

          {/* --- Link to registration page --- */}
          <span>
            Don’t have an account yet?{" "}
            <a
              className="hover:text-blue-600 border-b-2 border-black"
              href="/sign_up"
            >
              Sign up here
            </a>
          </span>
        </div>

        {/* --- Image at the bottom left corner --- */}
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

export default Login;
