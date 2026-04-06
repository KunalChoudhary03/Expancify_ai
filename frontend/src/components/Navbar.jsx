import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import API_URL from "../config/api";

const Navbar = () => {
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(() => Boolean(localStorage.getItem("token")));
  const [username, setUsername] = useState(() => localStorage.getItem("username") || "");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  useEffect(() => {
    checkAuthStatus();
    const handleAuthChanged = () => {
      checkAuthStatus();
    };

    const handleStorageChange = (event) => {
      if (event.key === "token" || event.key === "username") {
        checkAuthStatus();
      }
    };

    window.addEventListener("auth-changed", handleAuthChanged);
    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("auth-changed", handleAuthChanged);
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem("token");
      
      if (token) {
        setIsLoggedIn(true);

        const cachedUsername = localStorage.getItem("username");
        if (cachedUsername) {
          setUsername(cachedUsername);
        }

        const response = await axios.get(
          `${API_URL}/api/auth/profile`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        
        setIsLoggedIn(true);
        const profileUsername = response.data.user.username || response.data.user.fullName || "";
        setUsername(profileUsername);
        localStorage.setItem("username", profileUsername);
      } else {
        setIsLoggedIn(false);
        setUsername("");
      }
    } catch (err) {
      console.log(err);
      setIsLoggedIn(false);
      setUsername("");
      localStorage.removeItem("token");
      localStorage.removeItem("username");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    setIsLoggedIn(false);
    setUsername("");
    setMobileMenuOpen(false);
    window.dispatchEvent(new Event("auth-changed"));
    navigate("/login");
  };

  const handleNavigation = (path) => {
    navigate(path);
    setMobileMenuOpen(false);
  };

  return (
    <nav className="w-full fixed top-0 left-0 z-50 shadow-md 
                    bg-white text-black 
                    dark:bg-black dark:text-white transition">
      
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        
        {/* Logo */}
        <div className="text-2xl font-bold text-indigo-600 cursor-pointer"
             onClick={() => navigate("/")}
             >
          Expansify
        </div>

        {/* Navigation Links - Desktop */}
        <ul className="hidden md:flex space-x-8 font-medium items-center">
          <li  onClick={() => navigate("/")} className="hover:text-indigo-600 cursor-pointer transition">
            Home
          </li>
          
          {/* Dashboard - Special Highlight */}
          <li 
            onClick={()=>navigate("/dashboard")} 
            className="bg-linear-to-r from-indigo-600 via-purple-600 to-indigo-600 text-white px-5 py-2.5 rounded-full font-semibold cursor-pointer transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/50 hover:scale-110 relative overflow-hidden group"
          >
            <span className="relative z-10 flex items-center gap-2">
              <span className="text-lg">✨</span>
              AI Dashboard
            </span>
            <div className="absolute inset-0 bg-linear-to-r from-purple-600 via-indigo-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </li>
          <li 
            onClick={()=>navigate("/circle/create")} 
            className="bg-linear-to-r from-indigo-600 via-purple-600 to-indigo-600 text-white px-5 py-2.5 rounded-full font-semibold cursor-pointer transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/50 hover:scale-110 relative overflow-hidden group"
          >
            <span className="relative z-10 flex items-center gap-2">
              <span className="text-lg"></span>
              Create Circle
            </span>
            <div className="absolute inset-0 bg-linear-to-r from-purple-600 via-indigo-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </li>
          <li 
            onClick={()=>navigate("/circle/list")} 
            className="bg-slate-900 text-white px-4 py-2 rounded-full font-semibold cursor-pointer border border-slate-700 hover:border-indigo-500 transition"
          >
            My Circles
          </li>
            <li onClick={()=>navigate("/features")} className="hover:text-indigo-600 cursor-pointer transition">
            Features
          </li>
          <li onClick={()=>navigate("/contact")} className="hover:text-indigo-600 cursor-pointer transition">
            Contact
          </li>
        </ul>

        {/* Right Side Buttons - Desktop */}
        <div className="hidden md:flex min-w-[280px] items-center justify-end space-x-4">
          {isLoggedIn ? (
              <div className="flex min-w-[280px] items-center justify-end gap-4">
                <div className="flex min-w-[140px] items-center gap-2 bg-indigo-100 dark:bg-indigo-900 px-4 py-2 rounded-lg">
                  <span className="text-lg">👤</span>
                  <span className="font-semibold text-indigo-600 dark:text-indigo-300 truncate max-w-[90px]">
                    {username}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="min-w-[92px] px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                >
                  Logout
                </button>
              </div>
            ) : (
              <>
                <button
                  onClick={() => navigate("/login")}
                  className="min-w-[92px] px-4 py-2 border border-indigo-600 text-indigo-600 rounded-lg hover:bg-indigo-50 dark:hover:bg-zinc-800 transition"
                >
                  Login
                </button>

                <button
                  onClick={() => navigate("/register")}
                  className="min-w-[92px] px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                >
                  Sign Up
                </button>
              </>
            )}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center gap-3">
          <button
            onClick={() => navigate("/dashboard")}
            className="bg-linear-to-r from-indigo-600 to-purple-600 text-white px-3 py-2 rounded-full font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/50 hover:scale-105 flex items-center gap-1"
          >
            <span>✨</span>
            <span className="text-sm">AI</span>
          </button>

          {/* Hamburger Menu */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="px-3 py-2 text-2xl hover:text-indigo-600 transition"
          >
            ☰
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-gray-100 dark:bg-gray-900 border-t border-gray-300 dark:border-gray-700 animate-in fade-in slide-in-from-top duration-200">
          <div className="px-6 py-4 space-y-3">
            {/* Navigation Links */}
            <button
              onClick={() => handleNavigation("/")}
              className="block w-full text-left px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition font-medium"
            >
              Home
            </button>

            <button
              onClick={() => handleNavigation("/features")}
              className="block w-full text-left px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition font-medium"
            >
              Features
            </button>

            <button
              onClick={() => handleNavigation("/contact")}
              className="block w-full text-left px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition font-medium"
            >
              Contact
            </button>

            <button
              onClick={() => handleNavigation("/circle/create")}
              className="block w-full text-left px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition font-medium"
            >
              Create Circle
            </button>
            <button
              onClick={() => handleNavigation("/circle/list")}
              className="block w-full text-left px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition font-medium"
            >
              My Circles
            </button>

            {isLoggedIn && (
              <button
                onClick={() => handleNavigation("/admin")}
                className="block w-full text-left px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition font-medium"
              >
                Admin
              </button>
            )}

            {/* Divider */}
            <div className="border-t border-gray-300 dark:border-gray-700 my-2"></div>

            {/* Auth Buttons */}
            {isLoggedIn ? (
                <>
                  <div className="px-3 py-2 bg-indigo-100 dark:bg-indigo-900 rounded-lg">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Logged in as</p>
                    <p className="font-semibold text-indigo-600 dark:text-indigo-300">{username}</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="block w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition font-medium"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => handleNavigation("/login")}
                    className="block w-full border-2 border-indigo-600 text-indigo-600 py-2 rounded-lg hover:bg-indigo-50 dark:hover:bg-gray-800 transition font-medium"
                  >
                    Login
                  </button>

                  <button
                    onClick={() => handleNavigation("/register")}
                    className="block w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition font-medium"
                  >
                    Sign Up
                  </button>
                </>
              )
            }
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;