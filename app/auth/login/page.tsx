"use client";

import { useState, useRef, useEffect } from "react";
import { Eye, EyeOff, LockKeyhole, User, ArrowRight } from "lucide-react";
import Link from "next/link";
import { motion, useSpring, useTransform, AnimatePresence } from "framer-motion";
import LogoLoader from "../../components/LogoLoader"; // Ensure path is correct

// Helper component for the rolling number effect
function Counter({ value }: { value: number }) {
  const spring = useSpring(0, { mass: 0.8, stiffness: 75, damping: 15 });
  const display = useTransform(spring, (current) => Math.round(current).toLocaleString());

  useEffect(() => {
    spring.set(value);
  }, [value, spring]);

  return <motion.span>{display}</motion.span>;
}

export default function LoginPage() {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isPageReady, setIsPageReady] = useState(false); // Controls initial loading
  const [visitorCount, setVisitorCount] = useState<number | null>(null);

  const logoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const initPage = async () => {
      try {
        const res = await fetch("/api/visitores", { method: "POST" });
        const data = await res.json();
        setVisitorCount(data.total);
      } catch (err) {
        console.error("Visitor tracking sync failed");
      } finally {
        // Small delay so the LogoLoader isn't too jittery on fast connections
        setTimeout(() => setIsPageReady(true), 1200);
      }
    };
    initPage();

    if (!logoRef.current) return;
    const animation = logoRef.current.animate(
      [{ transform: "scale(1)" }, { transform: "scale(1.03)" }, { transform: "scale(1)" }],
      { duration: 5000, iterations: Infinity, easing: "ease-in-out" }
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

      // We stay in "isLoading" state so the LogoLoader stays visible during redirect
      setTimeout(() => {
        window.location.href =
          data.user.role === "student" ? "/student" : data.user.role === "staff" ? "/staff" : "/admin";
      }, 1000);
    } catch {
      setError("Network connection failed.");
      setIsLoading(false);
    }
  };

  return (
    <>
      <AnimatePresence mode="wait">
        {/* Show LogoLoader if page isn't ready OR if we are currently logging in (and no error) */}
        {(!isPageReady || (isLoading && !error)) && (
          <motion.div
            key="loader"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100]"
          >
            <LogoLoader />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main UI - Only visible when page is ready */}
      <div className={`min-h-screen flex items-center justify-center bg-[#f0f2f5] p-4 font-sans text-slate-900 transition-opacity duration-500 ${isPageReady ? "opacity-100" : "opacity-0"}`}>
        <div className="w-full max-w-[950px] flex flex-col md:flex-row bg-white rounded-[2.5rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] overflow-hidden min-h-[600px] border border-white">

          {/* --- LEFT BRAND PANEL --- */}
          <div className="hidden md:flex md:w-[45%] bg-[#0f172a] relative items-center justify-center p-12 overflow-hidden">
            <div className="absolute top-[-10%] right-[-10%] w-64 h-64 bg-indigo-600/20 rounded-full blur-3xl"></div>
            <div className="absolute bottom-[-10%] left-[-10%] w-64 h-64 bg-blue-600/10 rounded-full blur-3xl"></div>

            <div className="relative z-10 flex flex-col items-center text-center">
              <div ref={logoRef} className="mb-8">
                <div className="p-1 rounded-[2.5rem] bg-gradient-to-tr from-indigo-500 to-blue-400 shadow-2xl shadow-indigo-500/30">
                  <div className="bg-slate-900/40 backdrop-blur-xl rounded-[2.3rem] p-8 border border-white/10">
                    <img src="/login-card-bg.png" alt="Logo" className="w-32 h-32 object-contain filter drop-shadow-2xl" />
                  </div>
                </div>
              </div>
              <h2 className="text-white text-3xl font-black tracking-tight mb-2 italic">Smart Library</h2>
              <p className="text-slate-400 text-sm font-black tracking-[0.3em] uppercase opacity-60">SJC Systems</p>
            </div>
          </div>

          {/* --- RIGHT FORM PANEL --- */}
          <div className="w-full md:w-[55%] flex flex-col justify-center p-8 sm:p-16 bg-white">
            <div className="mb-10 text-left">
              <h1 className="text-3xl font-black text-slate-900 tracking-tight">Portal Login</h1>
              <p className="text-slate-500 mt-2 font-medium">Verify your identity to continue.</p>
            </div>

            {error && (
              <div className="mb-6 flex items-center gap-3 rounded-2xl bg-red-50 border border-red-100 px-4 py-3 text-xs font-bold text-red-600">
                <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse"></span>
                {error}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-5">
              <div className="space-y-2">
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Identity ID</label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-600 transition-colors">
                    <User size={18} strokeWidth={3} />
                  </div>
                  <input
                    type="text"
                    value={id}
                    onChange={(e) => setId(e.target.value)}
                    required
                    placeholder="Register No.."
                    className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 border border-slate-200 font-bold focus:outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 transition-all shadow-sm"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center px-1">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Secret Key</label>
                  <Link href="/auth/forgot-password" title="Recover Password" className="text-[10px] font-black text-indigo-600 uppercase tracking-tighter hover:text-indigo-800 transition-colors">
                    Forgot password
                  </Link>
                </div>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-600 transition-colors">
                    <LockKeyhole size={18} strokeWidth={3} />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="••••••••"
                    className="w-full pl-12 pr-12 py-4 rounded-2xl bg-slate-50 border border-slate-200 font-bold focus:outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 transition-all shadow-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-600 transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} strokeWidth={3} /> : <Eye size={18} strokeWidth={3} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-slate-900 hover:bg-indigo-600 text-white font-black py-4 rounded-2xl shadow-xl shadow-slate-200 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3 group mt-4"
              >
                Login <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </form>

            {/* --- VISITOR WIDGET --- */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="mt-10 pt-8 border-t border-slate-50 flex items-center justify-between"
            >
              <div className="flex items-center gap-5">
                <div className="relative flex items-center justify-center">
                  <span className="animate-ping absolute inline-flex h-4 w-4 rounded-full bg-indigo-400/20 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-600 shadow-[0_0_8px_rgba(79,70,229,0.4)]"></span>
                </div>

                <div className="text-3xl font-black text-slate-900 tabular-nums tracking-tighter">
                  {visitorCount !== null ? (
                    <Counter value={visitorCount} />
                  ) : (
                    <span className="opacity-10">000</span>
                  )}
                </div>
              </div>

              <div className="w-32 h-12 relative overflow-hidden">
                <svg viewBox="0 0 100 40" className="w-full h-full drop-shadow-[0_4px_8px_rgba(99,102,241,0.1)]">
                  <defs>
                    <linearGradient id="liquidFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#6366f1" stopOpacity="0.15" />
                      <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <motion.path
                    d="M0 35 Q 15 15, 30 25 T 60 10 T 100 20 V 40 H 0 Z"
                    fill="url(#liquidFill)"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1.5 }}
                  />
                  <motion.path
                    d="M0 35 Q 15 15, 30 25 T 60 10 T 100 20"
                    fill="none"
                    stroke="#6366f1"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      repeatType: "mirror",
                      ease: "easeInOut"
                    }}
                  />
                </svg>
              </div>
            </motion.div>

            <p className="mt-8 text-center text-slate-500 text-[11px] font-medium uppercase tracking-widest">
              First time access? <span className="text-indigo-600 font-bold cursor-help hover:underline">Contact Admin</span>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}