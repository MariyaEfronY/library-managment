"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ClipboardList,
  BookOpen,
  LogOut,
  Menu,
  X,
  ChevronRight,
  User
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import LogoLoader from "../../../app/components/LogoLoader";

export default function StaffSidebar() {
  const router = useRouter();
  const pathname = usePathname();

  const [isOpen, setIsOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => setIsOpen(false), [pathname]);

  /* FETCH USER */
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/auth/me");
        const data = await res.json();
        if (data.success) setUser(data.user);
      } catch (err) {
        console.error("Sidebar user fetch error:", err);
      }
    };
    fetchUser();
  }, []);

  const menuItems = [
    { label: "Dashboard", icon: LayoutDashboard, path: "/staff" },
    { label: "Active Requests", icon: ClipboardList, path: "/staff/requests" },
    { label: "Request History", icon: BookOpen, path: "/staff/request-status" },
  ];

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      const res = await fetch("/api/auth/logout", { method: "POST" });
      await new Promise((resolve) => setTimeout(resolve, 1500));
      if (res.ok) {
        router.push("/");
        router.refresh();
      } else {
        setIsLoggingOut(false);
      }
    } catch (err) {
      console.error(err);
      setIsLoggingOut(false);
    }
  };

  return (
    <>
      {/* LOGOUT LOADER OVERLAY */}
      <AnimatePresence>
        {isLoggingOut && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-[#020617]/80 backdrop-blur-md"
          >
            <LogoLoader />
          </motion.div>
        )}
      </AnimatePresence>

      {/* MOBILE HAMBURGER BUTTON */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-[#0f172a]/80 backdrop-blur-md border-b border-white/5 z-[50] px-4 flex items-center">
        <button
          onClick={() => setIsOpen(true)}
          className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 active:scale-95 transition-transform"
        >
          <Menu size={24} />
        </button>

      </div>

      {/* MOBILE OVERLAY */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-[55] lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* SIDEBAR ASIDE */}
      <aside
        className={`fixed top-0 left-0 z-[60] h-screen w-72 bg-[#0f172a] border-r border-white/5 flex flex-col transition-all duration-500 cubic-bezier(0.4, 0, 0.2, 1)
        ${isOpen ? "translate-x-0 shadow-[20px_0_60px_-15px_rgba(0,0,0,0.5)]" : "-translate-x-full lg:translate-x-0"}`}
      >
        {/* CLOSE BUTTON (MOBILE ONLY) */}
        <button
          onClick={() => setIsOpen(false)}
          className="lg:hidden absolute top-6 right-6 p-2 text-slate-400 hover:text-white"
        >
          <X size={20} />
        </button>

        {/* BRANDING SECTION */}
        <div className="p-8 pt-10">
          {/* BRANDING SECTION - CENTERED & ENLARGED */}
          <div className="p-10 flex flex-col items-center justify-center">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              whileHover={{
                rotate: [0, -8, 8, 0],
                scale: 1.05,
                transition: { duration: 0.4 }
              }}
              className="relative w-24 h-24 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-[2rem] p-1 shadow-2xl shadow-indigo-500/40 mb-6"
            >
              {/* Inner Glass Container */}
              <div className="w-full h-full bg-[#0f172a] rounded-[1.8rem] flex items-center justify-center overflow-hidden border border-white/10">
                <img
                  src="/login-card-bg.png"
                  alt="Logo"
                  className="w-16 h-16 object-contain"
                />
              </div>

              {/* Ambient Glow Background */}
              <motion.div
                animate={{
                  opacity: [0.2, 0.4, 0.2],
                  scale: [1, 1.1, 1]
                }}
                transition={{ duration: 4, repeat: Infinity }}
                className="absolute inset-0 bg-indigo-500 blur-2xl -z-10 rounded-full"
              />
            </motion.div>

            {/* TEXT LABELS - CENTERED */}
            <div className="text-center">
              <h2 className="text-white text-xl font-extrabold tracking-tight">
                Staff <span className="text-indigo-400">Portal</span>
              </h2>
              <div className="flex items-center justify-center gap-2 mt-1">
                <div className="h-[1px] w-4 bg-slate-700" />

                <div className="h-[1px] w-4 bg-slate-700" />
              </div>
            </div>
          </div>

        </div>

        {/* USER PROFILE CARD */}
        <div className="px-6 mb-8">
          <div className="relative overflow-hidden p-4 rounded-2xl bg-white/[0.03] border border-white/5 group transition-all hover:bg-white/[0.05]">
            <div className="flex items-center gap-3 relative z-10">
              <div className="w-10 h-10 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                <User size={20} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-bold text-sm truncate uppercase tracking-wide">
                  {user?.name || "Authenticating..."}
                </p>
                <p className="text-[10px] text-indigo-400 font-mono">
                  {user?.staffId || "0000"}
                </p>
              </div>
            </div>
            {/* Animated Background Decor */}
            <div className="absolute -right-4 -bottom-4 w-16 h-16 bg-indigo-600/10 blur-2xl rounded-full" />
          </div>
        </div>

        {/* NAVIGATION LINKS */}
        <nav className="flex-1 px-4 space-y-2 overflow-y-auto custom-scrollbar">
          {menuItems.map((item) => {
            const active = pathname === item.path;
            const Icon = item.icon;

            return (
              <motion.button
                key={item.path}
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => router.push(item.path)}
                className={`relative w-full flex items-center justify-between p-3.5 rounded-xl transition-all group
                ${active
                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-900/40"
                    : "text-slate-400 hover:text-slate-200"
                  }`}
              >
                <div className="flex items-center gap-3.5 relative z-10">
                  <Icon size={20} className={active ? "text-white" : "group-hover:text-indigo-400 transition-colors"} />
                  <span className="text-sm font-semibold tracking-wide">{item.label}</span>
                </div>

                {active && (
                  <motion.div
                    layoutId="activeGlow"
                    className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent rounded-xl pointer-events-none"
                  />
                )}

                {active ? (
                  <ChevronRight size={14} className="opacity-50" />
                ) : (
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-700 group-hover:bg-indigo-500 transition-colors" />
                )}
              </motion.button>
            );
          })}
        </nav>

        {/* SIGN OUT SECTION */}
        <div className="p-6 mt-auto">
          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="group w-full relative flex items-center justify-center gap-3 py-4 rounded-2xl bg-red-500/5 text-red-400 border border-red-500/10 hover:bg-red-500 hover:text-white transition-all duration-300 font-bold text-xs tracking-widest disabled:opacity-50 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-orange-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            <span className="relative z-10 flex items-center gap-2">
              <LogOut size={16} className={isLoggingOut ? "animate-pulse" : "group-hover:-translate-x-1 transition-transform"} />
              {isLoggingOut ? "PROCESSING..." : "SECURE SIGN OUT"}
            </span>
          </button>
        </div>
      </aside>
    </>
  );
}