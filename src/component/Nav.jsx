// components/Nav.jsx

// React hooks
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRef } from "react";
import { useCar } from "../context/Car";
import { useUserProfile } from "../context/userProfileProvider";
// Custom context hooks
import { useUser } from "../context/User";
import { useImage } from "../context/Image";

import { logout } from "../firebase/authService";
import ClipLoader from "react-spinners/ClipLoader";
import UserProfile from "../page/client/logicaClient";

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
  const [nCar, setNCar] = useState(0)
  const navigate = useNavigate();
  const [open, setOpen] = useState(false); // Controls avatar dropdown visibility
  const [profile, setProfile] = useState({})
  const drownMenu = useRef() 
  const userAvatar = useRef() 
  const {userProfile} = useUserProfile()
  const {car, setCar} = useCar()

console.log("perfiluser", userProfile)
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

useEffect(() => {
  if(car){
const n = car.length
setNCar(n)
  }
},[car])



useEffect(() => {
  setProfile(userProfile)
},[userProfile])

  // Logs out the user and redirects to home
  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // Handles navigation to different sections
  const handleClick = (section) => {
    switch (section) {
      case "LOGIN":
        navigate("/login_in")
        break
      case "SIGN":
        navigate("/sign_up")
        break
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
      case "CATALOG":
        navigate("/catalog/all");
        break;
      default:
        break;
    }
  };

  // Do not render the navbar if user is not logged in
  if (!user){
    return <div className="flex-row flex justify-end gap-2 mt-5">
      
        <div className="bg-orange-400 p-2 rounded-2xl cursor-pointer hover:text-white" onClick={() => handleClick("LOGIN")}>
          Login in
        </div>
        <div className="bg-orange-400 p-2 rounded-2xl cursor-pointer hover:text-white" onClick={() => handleClick("SIGN")}>Sign up</div>
      
    </div>
  };
   

 
  return (
    <nav className="relative">
      <div className="flex w-11/12 max-sm:w-full mt-3  justify-between items-center">
        {/* Navigation links */}
        <div className="flex flex-row gap-2 max-sm:hidden text-xl">
          <div
            className="cursor-pointer  font-bold"
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
         <div
            className="p-2 cursor-pointer hidden max-sm:flex mt-2 rounded-lg bg-red-100 font-semibold w-fit self-center"
            onClick={() => handleClick("CATALOG")}
          >
            View catalog
          </div>
        {/* User profile, shopping bag, and favorites icons */}
        <div className="flex flex-row  items-center gap-4">
          {/* Avatar button */}
          <div className="relative flex gap-2 text-xs  font-semibold hover:bg-slate-100 p-2 rounded-full cursor-pointer flex-row mt-2" onClick={() => setOpen(!open)} onMouseEnter={() => {setOpen(true) } } onMouseLeave={() => setOpen(false)}>
            <button ref={userAvatar}
              
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
            <div className="flex flex-col"><span>Orders and</span><span></span> Account</div>
            {/* Dropdown panel */}
            {open && (
              <div ref={drownMenu}   className={`absolute top-[85%] right-[-50%] mt-2 w-64 bg-white border 
              rounded-xl shadow-xl p-4 z-50 transition-all duration-300 ease-in-out
              ${open ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 -translate-y-2 pointer-events-none"}
              `}>
                <div className="flex items-center gap-3 mb-4">
                  <img
                    src={url}
                    alt="Avatar"
                    className="w-12 h-12 rounded-full"
                  />
                  <div>
                    <p className="font-semibold text-lg">{userProfile.name} </p>
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
                    View Profile and Orders
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
          <div className="w-5 h-5  relative cursor-pointer" onClick={() => settog(!tog)}>
            <img src="/images/bolsa.png" alt="Bag" className="w-full h-full" />
            <span className="top-2 w-5 left-2 h-5 text-center  bg-green-200 text-black rounded-full absolute">{nCar} </span>
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
