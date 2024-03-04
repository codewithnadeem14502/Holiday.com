import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAppContext } from "../contexts/AppContext";
import { FaBars, FaTimes } from "react-icons/fa";

interface HeaderProps {}

const Header: React.FC<HeaderProps> = () => {
  const { isLoggedIn } = useAppContext();
  const [showMenu, setShowMenu] = useState(false);

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  const handleSignOut = () => {
    // Your sign out logic here
    console.log("Signing out...");
  };

  return (
    <div className="bg-blue-800 py-6">
      <div className="container mx-auto flex justify-between items-center px-2">
        <span className="text-3xl text-white font-bold tracking-tight">
          <Link to="/">Holidays.com</Link>
        </span>
        <div className="md:hidden ">
          {showMenu ? (
            <FaTimes
              className="text-red-500  text-2xl cursor-pointer absolute top-6 right-6"
              onClick={toggleMenu}
            />
          ) : (
            <FaBars
              className="text-white text-2xl cursor-pointer"
              onClick={toggleMenu}
            />
          )}
        </div>
        <div className={`md:hidden ${showMenu ? "block" : "hidden"}`}>
          <div className="bg-blue-800 py-2 mt-5 ">
            <Link
              to="/my-booking"
              className="block text-white px-3 py-2 font-bold hover:bg-gray-100 hover:text-blue-600"
              onClick={toggleMenu}
            >
              My Bookings
            </Link>
            <Link
              to="/my-hotels"
              className="block text-white px-3 py-2 font-bold hover:bg-gray-100 hover:text-blue-600"
              onClick={toggleMenu}
            >
              My Hotels
            </Link>
            {isLoggedIn ? (
              <button
                onClick={() => {
                  handleSignOut();
                  toggleMenu();
                }}
                className="block bg-white text-blue-600 px-3 py-2 font-bold rounded-lg hover:bg-gray-100"
              >
                Sign Out
              </button>
            ) : (
              <Link
                to="/sign-in"
                className="block bg-white text-blue-600 px-3 py-2 font-bold rounded-lg hover:bg-gray-100"
                onClick={toggleMenu}
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
        <div className="hidden md:flex space-x-2">
          {isLoggedIn ? (
            <>
              <Link
                to="/my-booking"
                className="flex items-center text-white px-3 font-bold rounded-lg hover:bg-gray-100 hover:text-blue-600"
              >
                My Bookings{" "}
              </Link>{" "}
              <Link
                to="/my-hotels"
                className="flex items-center text-white px-3 font-bold rounded-lg hover:bg-gray-100 hover:text-blue-600"
              >
                My Hotels
              </Link>
              <button
                onClick={handleSignOut}
                className="flex bg-white items-center text-blue-600 px-3 font-bold rounded-lg hover:bg-gray-100"
              >
                Sign Out
              </button>
            </>
          ) : (
            <Link
              to="/sign-in"
              className="flex bg-white items-center text-blue-600 px-3 font-bold rounded-lg hover:bg-gray-100"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;
