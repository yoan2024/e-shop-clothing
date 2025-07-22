import React, { useState } from "react";
import { login } from "../../firebase/authService";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    navigate("/");
    try {
      await login(email, password);
      
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div className="w-full px-0 min-h-screen     min-w-96">
      <div className="bg-amber-500 min-h-screen relative max-sm:flex-col flex justify-center items-center gap-10">
        <div className="max-sm:mt-7">
          <div className="text-6xl font-bold  text-white">Trendora</div>
        </div>

        <div className="bg-white p-8  rounded-lg shadow-lg">
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
          <span>
            No tienes cuenta yep?{" "}
            <a
              className="hover:text-blue-600  border-b-2 border-black"
              href="/sign_up"
            >
              Sign up here
            </a>
          </span>
        </div>
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

export default Login;
