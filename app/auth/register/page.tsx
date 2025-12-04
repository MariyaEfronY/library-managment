"use client";

import { useState } from "react";
import { UserPlus, Eye, EyeOff } from "lucide-react";

export default function RegisterPage() {
  const [role, setRole] = useState("student");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rollNumber, setRollNumber] = useState("");
  const [staffId, setStaffId] = useState("");
  const [adminId, setAdminId] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsLoading(true);

    const body: any = { name, email, password, role };
    if (role === "student") body.rollNumber = rollNumber;
    if (role === "staff") body.staffId = staffId;
    if (role === "admin") body.adminId = adminId;

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Registration failed");
        setIsLoading(false);
        return;
      }

      setSuccess("Registration successful! Redirecting to login...");
      setTimeout(() => (window.location.href = "/auth/login"), 2000);
    } catch (err) {
      setError("Something went wrong");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-green-50 p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-600 to-emerald-600 rounded-full mb-4 shadow-lg">
            <UserPlus className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Create Account</h1>
          <p className="text-gray-500 text-sm">Join our platform as a student, staff, or admin</p>
        </div>

        {/* Register Card */}
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

          <form className="space-y-5" onSubmit={handleRegister}>
            {/* Full Name Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <div className="relative group">
                <input
                  type="text"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full px-4 py-3.5 bg-gray-50 border-2 border-gray-200 
                           rounded-xl focus:outline-none focus:border-green-500 
                           focus:ring-2 focus:ring-green-200 transition-all duration-300
                           placeholder:text-gray-400 text-gray-700
                           group-hover:border-gray-300"
                />
                <div className="absolute inset-0 rounded-xl ring-0 ring-green-200 group-focus-within:ring-4 transition-all duration-300 pointer-events-none"></div>
              </div>
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative group">
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3.5 bg-gray-50 border-2 border-gray-200 
                           rounded-xl focus:outline-none focus:border-green-500 
                           focus:ring-2 focus:ring-green-200 transition-all duration-300
                           placeholder:text-gray-400 text-gray-700
                           group-hover:border-gray-300"
                />
                <div className="absolute inset-0 rounded-xl ring-0 ring-green-200 group-focus-within:ring-4 transition-all duration-300 pointer-events-none"></div>
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
                  placeholder="Create a password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3.5 bg-gray-50 border-2 border-gray-200 
                           rounded-xl focus:outline-none focus:border-green-500 
                           focus:ring-2 focus:ring-green-200 transition-all duration-300
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
                <div className="absolute inset-0 rounded-xl ring-0 ring-green-200 group-focus-within:ring-4 transition-all duration-300 pointer-events-none"></div>
              </div>
            </div>

            {/* Role Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Role
              </label>
              <div className="relative group">
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full px-4 py-3.5 bg-gray-50 border-2 border-gray-200 
                           rounded-xl focus:outline-none focus:border-green-500 
                           focus:ring-2 focus:ring-green-200 transition-all duration-300
                           text-gray-700 appearance-none
                           group-hover:border-gray-300"
                >
                  <option value="student">Student</option>
                  <option value="staff">Staff</option>
                  <option value="admin">Admin</option>
                </select>
                <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
                <div className="absolute inset-0 rounded-xl ring-0 ring-green-200 group-focus-within:ring-4 transition-all duration-300 pointer-events-none"></div>
              </div>
            </div>

            {/* Conditional Fields */}
            {role === "student" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Roll Number
                </label>
                <div className="relative group">
                  <input
                    type="text"
                    placeholder="Enter roll number"
                    value={rollNumber}
                    onChange={(e) => setRollNumber(e.target.value)}
                    required
                    className="w-full px-4 py-3.5 bg-gray-50 border-2 border-gray-200 
                             rounded-xl focus:outline-none focus:border-green-500 
                             focus:ring-2 focus:ring-green-200 transition-all duration-300
                             placeholder:text-gray-400 text-gray-700
                             group-hover:border-gray-300"
                  />
                  <div className="absolute inset-0 rounded-xl ring-0 ring-green-200 group-focus-within:ring-4 transition-all duration-300 pointer-events-none"></div>
                </div>
              </div>
            )}

            {role === "staff" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Staff ID
                </label>
                <div className="relative group">
                  <input
                    type="text"
                    placeholder="Enter staff ID"
                    value={staffId}
                    onChange={(e) => setStaffId(e.target.value)}
                    required
                    className="w-full px-4 py-3.5 bg-gray-50 border-2 border-gray-200 
                             rounded-xl focus:outline-none focus:border-green-500 
                             focus:ring-2 focus:ring-green-200 transition-all duration-300
                             placeholder:text-gray-400 text-gray-700
                             group-hover:border-gray-300"
                  />
                  <div className="absolute inset-0 rounded-xl ring-0 ring-green-200 group-focus-within:ring-4 transition-all duration-300 pointer-events-none"></div>
                </div>
              </div>
            )}

            {role === "admin" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Admin ID
                </label>
                <div className="relative group">
                  <input
                    type="text"
                    placeholder="Enter admin ID"
                    value={adminId}
                    onChange={(e) => setAdminId(e.target.value)}
                    required
                    className="w-full px-4 py-3.5 bg-gray-50 border-2 border-gray-200 
                             rounded-xl focus:outline-none focus:border-green-500 
                             focus:ring-2 focus:ring-green-200 transition-all duration-300
                             placeholder:text-gray-400 text-gray-700
                             group-hover:border-gray-300"
                  />
                  <div className="absolute inset-0 rounded-xl ring-0 ring-green-200 group-focus-within:ring-4 transition-all duration-300 pointer-events-none"></div>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 
                       text-white py-3.5 px-4 rounded-xl font-semibold 
                       hover:from-green-700 hover:to-emerald-700 
                       focus:outline-none focus:ring-4 focus:ring-green-200
                       transition-all duration-300 transform hover:-translate-y-0.5
                       disabled:opacity-70 disabled:cursor-not-allowed 
                       disabled:hover:transform-none shadow-lg hover:shadow-xl
                       flex items-center justify-center gap-2 mt-6"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Creating Account...
                </>
              ) : (
                <>
                  <UserPlus className="h-5 w-5" />
                  Register
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-gray-100 text-center">
            <p className="text-gray-600 text-sm">
              Already have an account?{" "}
              <a
                href="/auth/login"
                className="text-blue-600 hover:text-blue-800 font-semibold 
                         hover:underline transition-colors"
              >
                Login here
              </a>
            </p>
          </div>
        </div>

        {/* Note */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-400">
            Choose your role and fill in the required information
          </p>
        </div>
      </div>
    </div>
  );
}