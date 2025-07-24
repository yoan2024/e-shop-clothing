// components/Nav.jsx

// React hooks
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRef } from "react";

// Custom context hooks
import { useUser } from "../context/User";
import { useImage } from "../context/Image";

import { logout } from "../firebase/authService";
import ClipLoader from "react-spinners/ClipLoader";

/**
 * Nav Component
 *
 * This is the main navigation bar of the app, shown only when a user is logged in.
 * It allows navigating through product categories, profile, favorites, and logout.
 * It also shows the user avatar and a dropdown menu with profile and logout options.
 *
 * Props:
 * - tog (boolean): Controls the visibility of the shopping cart.
 * - settog (function): Function to toggle the shopping cart view.
 */

const Nav = ({ tog, settog }) => {
  const { url } = useImage();
  const { user, setUser } = useUser();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false); // Controls avatar dropdown visibility

  const drownMenu = useRef() 
  const userAvatar = useRef() 

useEffect(() => {

 const handleClickOutSite = (e) => {

// Close the dropdown menu only if the user clicks outside the dropdown menu and not on the user's avatar icon in the navbar
  if(drownMenu.current && !drownMenu.current.contains(e.target) && !userAvatar.current.contains(e.target)){
    setOpen(false)
  }
 }
document.addEventListener("mousedown", handleClickOutSite)
  return () => {
   document.removeEventListener("mousedown", handleClickOutSite)
  }
},[])


  // Logs out the user and redirects to home
  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // Handles navigation to different sections
  const handleClick = (section) => {
    switch (section) {
      case "MAN":
        navigate("/catalog/men");
        break;
      case "WOMEN":
        navigate("/catalog/women");
        break;
      case "JEWELERY":
        navigate("/catalog/jewelery");
        break;
      case "ELECTRONICS":
        navigate("/catalog/electronics");
        break;
      case "HOME":
        navigate("/");
        break;
      case "PROFILE":
        navigate("/userProfile");
        break;
      case "heart":
        navigate("/favorites");
        break;
      default:
        break;
    }
  };

  // Do not render the navbar if user is not logged in
  if (!user) return null;

  return (
    <nav>
      <div className="flex w-11/12 justify-between items-center">
        {/* Navigation links */}
        <div className="flex flex-row gap-2 text-xl">
          <div
            className="cursor-pointer font-bold"
            onClick={() => handleClick("HOME")}
          >
            HOME
          </div>
          <div className="cursor-pointer" onClick={() => handleClick("MAN")}>
            MAN
          </div>
          <div className="cursor-pointer" onClick={() => handleClick("WOMEN")}>
            WOMAN
          </div>
          <div
            className="cursor-pointer"
            onClick={() => handleClick("JEWELERY")}
          >
            JEWELERY
          </div>
          <div
            className="cursor-pointer"
            onClick={() => handleClick("ELECTRONICS")}
          >
            ELECTRONICS
          </div>
        </div>

        {/* User profile, shopping bag, and favorites icons */}
        <div className="flex flex-row items-center gap-4">
          {/* Avatar button */}
          <div className="relative mt-2">
            <button ref={userAvatar}
              onClick={() => setOpen(!open)}
              className="focus:outline-none"
            >
              {url ? (
                <img
                  src={url}
                  alt="User avatar"
                  className="w-8 h-8 rounded-full border border-gray-300"
                />
              ) : (
                <ClipLoader
                  color="#36d7b7"
                  className="w-8 h-8 rounded-full border border-gray-300"
                />
              )}
            </button>

            {/* Dropdown panel */}
            {open && (
              <div ref={drownMenu} className="absolute right-0 mt-2 w-64 bg-white border rounded-xl shadow-xl p-4 z-50">
                <div className="flex items-center gap-3 mb-4">
                  <img
                    src={url}
                    alt="Avatar"
                    className="w-12 h-12 rounded-full"
                  />
                  <div>
                    <p className="font-semibold text-lg">{user.name}</p>
                    <p className="text-sm text-gray-500">{user.email}</p>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => {
                      navigate("/userProfile");
                      setOpen(false);
                    }}
                    className="text-left px-4 py-2 rounded-md hover:bg-gray-100"
                  >
                    View Profile
                  </button>
                  <button
                    onClick={handleLogout}
                    className="text-left px-4 py-2 rounded-md hover:bg-red-100 text-red-600"
                  >
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Shopping bag icon */}
          <div className="w-5 h-5 cursor-pointer" onClick={() => settog(!tog)}>
            <img src="/images/bolsa.png" alt="Bag" className="w-full h-full" />
          </div>

          {/* Favorites icon */}
          <div
            className="w-5 h-5 cursor-pointer"
            onClick={() => handleClick("heart")}
          >
            <img
              src="/images/heart.png"
              alt="Favorites"
              className="w-full h-full"
            />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Nav;
