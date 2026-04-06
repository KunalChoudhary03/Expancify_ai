import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import API_URL from "../config/api";

const Register = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState({
    firstName: "",
    lastName: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await axios.post(
        `${API_URL}/api/auth/register`,
        { email, password, username, fullName },
        { withCredentials: true }
      );

      setSuccess("Registration Successful! Redirecting to login...");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Registration failed. Please try again.";
      setError(errorMsg);
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 relative px-4">
      <button
        onClick={() => navigate("/")}
        className="absolute top-6 left-6 text-gray-400 hover:text-white transition text-2xl"
      >
        ←
      </button>

      <div className="bg-gray-800 shadow-2xl rounded-2xl p-8 w-full max-w-md border border-gray-700 animate-in fade-in duration-500">
        {/* Header */}
        <div className="mb-8 animate-in fade-in slide-in-from-top duration-500 delay-100">
          <h2 className="text-3xl font-bold text-white mb-2">Create Account</h2>
          <p className="text-gray-400">Start managing your expenses today</p>
        </div>

        {/* Success Message */}
        {success && (
          <div className="app-alert app-alert-success mb-6 animate-in fade-in duration-300" role="status">
            ✓ {success} Let's get you logged in!
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="app-alert app-alert-error mb-6 animate-in fade-in shake duration-300" role="alert">
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          {/* Username Field */}
          <div className="animate-in fade-in slide-in-from-left duration-500 delay-150">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="john_doe"
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200 hover:border-gray-500"
              required
              disabled={loading}
            />
          </div>

          {/* Full Name Fields */}
          <div className="grid grid-cols-2 gap-3 animate-in fade-in slide-in-from-left duration-500 delay-200">
            {/* First Name Field */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                First Name
              </label>
              <input
                type="text"
                value={fullName.firstName}
                onChange={(e) =>
                  setFullName({ ...fullName, firstName: e.target.value })
                }
                placeholder="John"
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200 hover:border-gray-500"
                required
                disabled={loading}
              />
            </div>

            {/* Last Name Field */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Last Name
              </label>
              <input
                type="text"
                value={fullName.lastName}
                onChange={(e) =>
                  setFullName({ ...fullName, lastName: e.target.value })
                }
                placeholder="Doe"
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200 hover:border-gray-500"
                required
                disabled={loading}
              />
            </div>
          </div>

          {/* Email Field */}
          <div className="animate-in fade-in slide-in-from-left duration-500 delay-250">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="john@example.com"
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200 hover:border-gray-500"
              required
              disabled={loading}
            />
          </div>

          {/* Password Field */}
          <div className="animate-in fade-in slide-in-from-left duration-500 delay-300">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200 hover:border-gray-500"
              required
              disabled={loading}
            />
            <p className="text-xs text-gray-500 mt-1">At least 8 characters recommended</p>
          </div>

          {/* Register Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-500 hover:shadow-lg hover:shadow-indigo-500/50 hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 mt-6 animate-in fade-in slide-in-from-bottom duration-500 delay-350"
          >
            {loading ? "Creating account..." : "Create Account"}
          </button>

          {/* Divider */}
          <div className="relative my-6 animate-in fade-in duration-500 delay-400">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-700"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gray-800 text-gray-400">Already registered?</span>
            </div>
          </div>

          {/* Login Link */}
          <p className="text-center text-gray-400 animate-in fade-in delay-500">
            Already have an account?{" "}
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="text-indigo-400 hover:text-indigo-300 font-semibold transition-all duration-300 hover:underline"
            >
              Login here
            </button>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;