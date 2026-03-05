"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  LayoutDashboard,
  BookOpen,
  History,
  Activity,
  LogOut,
  Menu,
  X,
  ChevronRight,
  User as UserIcon
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import LogoLoader from "../../../app/components/LogoLoader"; // Verify this path

export default function StudentSidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false); // Loader State
  const [user, setUser] = useState<{ name: string; rollNumber: string } | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsOpen(false);
    fetch("/api/auth/me")
      .then(res => res.json())
      .then(data => { if (data.success) setUser(data.user); });
  }, [pathname]);

  const menuItems = [
    { label: "Overview", icon: LayoutDashboard, path: "/student" },
    { label: "Book Catalog", icon: BookOpen, path: "/student/requests" },
    { label: "My Requests", icon: History, path: "/student/request-status" },
    { label: "Visit Logs", icon: Activity, path: "/student/lib-activity" },
  ];

  const handleLogout = async () => {
    setIsLoggingOut(true); // 1. Start Animation

    try {
      const res = await fetch("/api/auth/logout", { method: "POST" });

      // 2. Artificial delay (1.5s) to let the LogoLoader play smoothly
      await new Promise(resolve => setTimeout(resolve, 1500));

      if (res.ok) {
        router.push("/");
        router.refresh();
      } else {
        setIsLoggingOut(false);
      }
    } catch (error) {
      console.error("Logout failed", error);
      setIsLoggingOut(false);
    }
  };

  return (
    <>
      {/* --- LOGO LOADER OVERLAY --- */}
      <AnimatePresence>
        {isLoggingOut && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] pointer-events-auto"
          >
            <LogoLoader />
          </motion.div>
        )}
      </AnimatePresence>

      {/* MOBILE TRIGGER */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-5 left-5 z-[70] p-3 rounded-2xl bg-[#0B0F1A] text-white shadow-2xl border border-slate-800 active:scale-95 transition-transform"
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* MOBILE OVERLAY */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-[50] lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* SIDEBAR */}
      <aside className={`
        fixed top-0 left-0 z-[60] h-screen w-72 
        bg-[#0B0F1A] border-r border-slate-800/50 flex flex-col
        transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]
        ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}>

        {/* DECORATIVE GLOW */}
        <div className="absolute top-0 left-0 w-full h-64 bg-indigo-600/5 blur-[100px] pointer-events-none" />

        {/* LOGO SECTION */}
        <div className="relative p-10 flex flex-col items-center">
          <div className="relative group cursor-pointer">
            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
            <div className="relative w-16 h-16 bg-[#161B29] rounded-2xl p-3 border border-slate-700/50 flex items-center justify-center">
              <img src="/login-card-bg.png" alt="Logo" className="w-full h-full object-contain" />
            </div>
          </div>
          <div className="mt-5 text-center">
            <h2 className="text-white text-[10px] font-black tracking-[0.3em] uppercase opacity-80">
              SJC
            </h2>
          </div>
        </div>

        {/* NAVIGATION */}
        <nav className="flex-1 px-6 space-y-1.5 mt-4 overflow-y-auto custom-scrollbar">
          {menuItems.map((item) => {
            const active = pathname === item.path;
            const Icon = item.icon;

            return (
              <button
                key={item.path}
                onClick={() => router.push(item.path)}
                className={`relative w-full flex items-center justify-between p-3.5 rounded-xl transition-all duration-300 group
                  ${active ? "text-white" : "text-slate-500 hover:text-slate-200"}`}
              >
                {active && (
                  <motion.div
                    layoutId="active-pill"
                    className="absolute inset-0 bg-indigo-600/10 border-l-2 border-indigo-500 rounded-xl"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}

                <div className="relative z-10 flex items-center gap-4">
                  <div className={`p-2 rounded-lg transition-colors duration-300 ${active ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20" : "bg-slate-800/40 group-hover:bg-slate-800"}`}>
                    <Icon size={18} strokeWidth={active ? 2.5 : 2} />
                  </div>
                  <span className={`text-xs font-black uppercase tracking-widest transition-opacity ${active ? "opacity-100" : "opacity-60 group-hover:opacity-100"}`}>
                    {item.label}
                  </span>
                </div>

                {active && <ChevronRight size={14} className="relative z-10 text-indigo-500" />}
              </button>
            );
          })}
        </nav>

        {/* USER PROFILE & LOGOUT */}
        <div className="p-6 mt-auto space-y-4">
          <div className="flex items-center gap-3 p-3 bg-slate-900/40 border border-slate-800/50 rounded-2xl">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/10 flex items-center justify-center text-indigo-400 border border-indigo-500/20">
              <UserIcon size={18} />
            </div>
            <div className="overflow-hidden">
              <p className="text-[10px] font-black text-white truncate uppercase tracking-wider">
                {user?.name || "Loading..."}
              </p>
              <p className="text-[9px] font-bold text-slate-500 truncate uppercase">
                {user?.rollNumber || "ID: ---"}
              </p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="w-full flex items-center justify-center gap-3 py-3.5 rounded-2xl bg-rose-500/5 text-rose-500 border border-rose-500/10 hover:bg-rose-500 hover:text-white transition-all duration-500 ease-out font-black text-[10px] uppercase tracking-[0.2em] disabled:opacity-50"
          >
            <LogOut size={16} /> {isLoggingOut ? "Processing..." : "Logout"}
          </button>
        </div>
      </aside>
    </>
  );
}