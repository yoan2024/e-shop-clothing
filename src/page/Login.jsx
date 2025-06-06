import React, { useState } from "react";
import { login } from "../firebase/authService";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(email, password);
    navigate("/");
    try {
      login(email, password);
      console.log("login con exito");
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div className="bg-amber-500 min-h-screen relative flex justify-center items-center gap-10">
      <div className="w-96 h-60 absolute bottom-0 left-0">
        <img
          src="/images/personaC.png"
          alt="persona"
          className="w-full h-full object-contain"
        />
      </div>

      <div>
        <div className="text-6xl font-bold text-white">Trendora</div>
      </div>

      <div className="bg-white p-8 rounded-lg shadow-lg">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
      </div>
    </div>
  );
};

export default Login;
