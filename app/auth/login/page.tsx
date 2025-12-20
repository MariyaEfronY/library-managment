"use client";

import { useState } from "react";
import { Eye, EyeOff, LogIn } from "lucide-react";

export default function LoginPage() {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

 // Replace your existing handleLogin logic with this fix:
const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();
  setError("");
  setSuccess("");
  setIsLoading(true);

  try {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      // FIX: Your API uses 'message', but frontend looks for 'error'
      setError(data.message || "Login failed"); 
      setIsLoading(false);
      return;
    }

    setSuccess("Login successful!");
    // The token is now in a HttpOnly cookie, so we don't need to manually store it 
    localStorage.setItem("user", JSON.stringify(data.user));
    
    setTimeout(() => {
      if (data.user.role === "student") window.location.href = "/student";
      else if (data.user.role === "staff") window.location.href = "/staff";
      else window.location.href = "/admin";
    }, 1000);
  } catch (err) {
    setError("Something went wrong");
    setIsLoading(false);
  }
};
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50 p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full mb-4 shadow-lg">
            <LogIn className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome Back</h1>
          <p className="text-gray-500 text-sm">Sign in to access your account</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl">
              <p className="text-red-600 text-sm text-center font-medium">{error}</p>
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-100 rounded-xl">
              <p className="text-green-600 text-sm text-center font-medium">{success}</p>
            </div>
          )}

          <form className="space-y-6" onSubmit={handleLogin}>
            {/* ID Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Roll Number / Staff ID / Admin ID
              </label>
              <div className="relative group">
                <input
                  type="text"
                  placeholder="Enter your ID"
                  value={id}
                  onChange={(e) => setId(e.target.value)}
                  required
                  className="w-full px-4 py-3.5 bg-gray-50 border-2 border-gray-200 
                           rounded-xl focus:outline-none focus:border-blue-500 
                           focus:ring-2 focus:ring-blue-200 transition-all duration-300
                           placeholder:text-gray-400 text-gray-700
                           group-hover:border-gray-300"
                />
                <div className="absolute inset-0 rounded-xl ring-0 ring-blue-200 group-focus-within:ring-4 transition-all duration-300 pointer-events-none"></div>
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative group">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3.5 bg-gray-50 border-2 border-gray-200 
                           rounded-xl focus:outline-none focus:border-blue-500 
                           focus:ring-2 focus:ring-blue-200 transition-all duration-300
                           placeholder:text-gray-400 text-gray-700 pr-12
                           group-hover:border-gray-300"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 
                           text-gray-400 hover:text-gray-600 transition-colors p-1.5
                           hover:bg-gray-100 rounded-lg"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
                <div className="absolute inset-0 rounded-xl ring-0 ring-blue-200 group-focus-within:ring-4 transition-all duration-300 pointer-events-none"></div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 
                       text-white py-3.5 px-4 rounded-xl font-semibold 
                       hover:from-blue-700 hover:to-indigo-700 
                       focus:outline-none focus:ring-4 focus:ring-blue-200
                       transition-all duration-300 transform hover:-translate-y-0.5
                       disabled:opacity-70 disabled:cursor-not-allowed 
                       disabled:hover:transform-none shadow-lg hover:shadow-xl
                       flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Signing in...
                </>
              ) : (
                <>
                  <LogIn className="h-5 w-5" />
                  Login
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-gray-100 text-center">
            <p className="text-gray-600 text-sm">
              Don't have an account?{" "}
              <a
                href="/auth/register"
                className="text-blue-600 hover:text-blue-800 font-semibold 
                         hover:underline transition-colors"
              >
                Register here
              </a>
            </p>
          </div>
        </div>

        {/* Demo Hint */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-400">
            Use your ID and password to login
          </p>
        </div>
      </div>
    </div>
  );
}