"use client";

import { useState, useRef, useEffect } from "react";
import { Eye, EyeOff, LockKeyhole, User, Loader2, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const logoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!logoRef.current) return;
    const animation = logoRef.current.animate(
      [
        { transform: "scale(1)" },
        { transform: "scale(1.05)" },
        { transform: "scale(1)" },
      ],
      { duration: 4000, iterations: Infinity, easing: "ease-in-out" }
    );
    return () => animation.cancel();
  }, []);

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
      setError("Network error. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f0f2f5] p-4 sm:p-6 font-sans">
      <div className="w-full max-w-[950px] flex flex-col md:flex-row bg-white rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] overflow-hidden min-h-[550px] border border-white">

        {/* LEFT BRAND PANEL */}
        <div className="hidden md:flex md:w-[45%] bg-[#0f172a] relative items-center justify-center p-12 overflow-hidden">
          <div className="absolute top-[-10%] right-[-10%] w-64 h-64 bg-indigo-600/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-[-10%] left-[-10%] w-64 h-64 bg-blue-600/10 rounded-full blur-3xl"></div>

          <div className="relative z-10 flex flex-col items-center text-center">
            <div ref={logoRef} className="mb-8">
              <div className="p-1 rounded-[2.5rem] bg-gradient-to-tr from-indigo-500 to-blue-400 shadow-2xl shadow-indigo-500/30">
                <div className="bg-slate-900/40 backdrop-blur-xl rounded-[2.3rem] p-8 border border-white/10">
                  <img
                    src="/login-card-bg.png"
                    alt="Logo"
                    className="w-32 h-32 object-contain filter drop-shadow-2xl"
                  />
                </div>
              </div>
            </div>
            <h2 className="text-white text-3xl font-bold tracking-tight mb-2">Smart Library</h2>
            <p className="text-slate-400 text-lg font-medium tracking-widest uppercase opacity-80">SJC</p>
            <div className="mt-12 h-1 w-12 bg-indigo-500 rounded-full"></div>
          </div>
        </div>

        {/* RIGHT FORM PANEL */}
        <div className="w-full md:w-[55%] flex flex-col justify-center p-8 sm:p-16 bg-white">
          <div className="mb-10 text-left">
            <div className="md:hidden flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">SL</span>
              </div>
              <span className="text-slate-900 font-bold text-xl tracking-tight">Smart Library</span>
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Welcome Back</h1>
            <p className="text-slate-500 mt-2 font-medium">Please enter your details to sign in.</p>
          </div>

          {error && (
            <div className="mb-6 flex items-center gap-3 rounded-xl bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-600 animate-in fade-in slide-in-from-top-2">
              <span className="w-1.5 h-1.5 rounded-full bg-red-600"></span>
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            {/* USER ID */}
            <div className="space-y-2">
              <label className="block text-sm font-bold text-slate-700 ml-1">User ID</label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors pointer-events-none">
                  <User size={20} strokeWidth={2.5} />
                </div>
                <input
                  type="text"
                  value={id}
                  onChange={(e) => setId(e.target.value)}
                  required
                  placeholder="Enter your ID"
                  className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 font-medium placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 focus:bg-white transition-all shadow-sm"
                />
              </div>
            </div>

            {/* PASSWORD */}
            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <label className="text-sm font-bold text-slate-700">Password</label>
                {/* ✅ Removed size="sm" invalid prop */}
                <Link href="/auth/forgot-password" className="text-xs font-bold text-indigo-600 hover:text-indigo-700 transition-colors">
                  Forgot Password?
                </Link>
              </div>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors pointer-events-none">
                  <LockKeyhole size={20} strokeWidth={2.5} />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full pl-12 pr-12 py-4 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 font-medium placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 focus:bg-white transition-all shadow-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={20} strokeWidth={2.5} /> : <Eye size={20} strokeWidth={2.5} />}
                </button>
              </div>
            </div>

            {/* SUBMIT BUTTON */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-2xl shadow-xl shadow-indigo-200 transition-all active:scale-[0.98] disabled:opacity-70 disabled:active:scale-100 flex items-center justify-center gap-2 group"
            >
              {isLoading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <>
                  Sign In
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <p className="mt-10 text-center text-slate-500 text-sm font-medium">
            Accessing for the first time? <span className="text-indigo-600 font-bold cursor-help hover:underline">Contact Admin</span>
          </p>
        </div>
      </div>
    </div>
  );
}