"use client";

import { useState, useRef, useEffect } from "react";
import { Eye, EyeOff, LockKeyhole, User } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const logoRef = useRef<HTMLDivElement>(null);

  // ✅ Zoom in / zoom out animation (SAFE)
  useEffect(() => {
    if (!logoRef.current) return;

    const animation = logoRef.current.animate(
      [
        { transform: "scale(1)" },
        { transform: "scale(1.08)" },
        { transform: "scale(1)" },
      ],
      {
        duration: 3500,
        iterations: Infinity,
        easing: "ease-in-out",
      }
    );

    return () => animation.cancel();
  }, []);

  // ✅ Login handler (correct scope)
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Invalid credentials");
        setIsLoading(false);
        return;
      }

      localStorage.setItem("user", JSON.stringify(data.user));

      setTimeout(() => {
        window.location.href =
          data.user.role === "student"
            ? "/student"
            : data.user.role === "staff"
              ? "/staff"
              : "/admin";
      }, 800);
    } catch {
      setError("Network error");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] px-2 sm:px-4">
      <div
        className="
          w-full max-w-[800px]
          flex flex-row
          bg-white
          rounded-xl sm:rounded-2xl
          shadow-[0_12px_32px_rgba(0,0,0,0.05)]
          overflow-hidden
          border border-slate-100
          min-h-[300px] sm:min-h-[350px]
        "
      >
        {/* LEFT BRAND PANEL */}
        <div className="w-[28%] sm:w-[45%] bg-gradient-to-br from-[#1e293b] to-[#0f172a] flex items-center justify-center relative">
          <div className="absolute inset-0 bg-blue-500/5"></div>

          <div className="relative z-10 flex flex-col items-center">
            {/* LOGO WITH ZOOM ANIMATION */}
            <div
              ref={logoRef}
              className="
                relative
                p-[3px]
                rounded-2xl sm:rounded-3xl
                bg-gradient-to-br from-indigo-500/60 via-blue-500/40 to-cyan-400/40
                shadow-[0_0_40px_rgba(99,102,241,0.35)]
              "
            >
              <div
                className="
                  rounded-xl sm:rounded-2xl
                  bg-white/5
                  backdrop-blur-md
                  border border-white/20
                  p-3 sm:p-6
                  flex items-center justify-center
                "
              >
                <img
                  src="/login-card-bg.png"
                  alt="Logo"
                  className="w-10 h-10 sm:w-44 sm:h-44 object-contain drop-shadow-xl"
                />
              </div>
            </div>

            {/* DESKTOP TEXT ONLY */}
            <div className="hidden sm:block text-center mt-6">
              <h2 className="text-white text-xl font-semibold tracking-wide">
                Smart Library
              </h2>
              <p className="text-slate-400 text-sm mt-1 tracking-widest">
                SJC
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT FORM PANEL */}
        <div className="w-[72%] sm:w-[55%] flex flex-col justify-center px-4 py-5 sm:px-14 sm:py-14 bg-white">
          <div className="mb-4 sm:mb-10">
            <h1 className="text-lg sm:text-3xl font-bold text-slate-900">
              Welcome Back
            </h1>
            <p className="hidden sm:block text-slate-500 mt-1 text-sm">
              Enter your credentials to continue
            </p>
          </div>

          {error && (
            <div className="mb-3 rounded-md bg-red-50 px-3 py-2 text-xs sm:text-sm text-red-600">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-3 sm:space-y-6">
            {/* USER ID */}
            <div>
              <label className="block text-[10px] sm:text-[13px] font-semibold text-slate-700 mb-1">
                User ID
              </label>
              <div className="relative">
                <User
                  size={14}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="text"
                  value={id}
                  onChange={(e) => setId(e.target.value)}
                  required
                  placeholder="ID"
                  className="text-gray-950 w-full pl-9 pr-3 py-2 sm:py-3 rounded-lg sm:rounded-xl
                             bg-slate-50 border border-slate-200 text-xs sm:text-sm
                             focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500"
                />
              </div>
            </div>

            {/* PASSWORD */}
            <div>
              <label className="block text-[10px] sm:text-[13px] font-semibold text-slate-700 mb-1">
                Password
              </label>
              <div className="relative">
                <LockKeyhole
                  size={14}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••"
                  className="text-gray-950 w-full pl-9 pr-9 py-2 sm:py-3 rounded-lg sm:rounded-xl
                             bg-slate-50 border border-slate-200 text-xs sm:text-sm
                             focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500"
                />
                <div className="flex justify-end mt-2">
                  <Link
                    href="/auth/forgot-password"
                    className="text-sm text-blue-600 hover:underline"
                  >
                    Forgot Password?
                  </Link>
                </div>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                >
                  {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>

            {/* BUTTON */}
            <button
              type="submit"
              disabled={isLoading}
              className="
                w-full bg-indigo-600 hover:bg-indigo-700
                text-white font-semibold
                py-2.5 sm:py-4
                rounded-lg sm:rounded-xl
                text-xs sm:text-base
                shadow-md shadow-indigo-200
                transition active:scale-[0.97]
                disabled:opacity-70
              "
            >
              {isLoading ? "Checking..." : "Sign In"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
