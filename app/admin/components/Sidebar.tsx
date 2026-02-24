"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  BookOpen,
  BookPlus,
  LogOut,
  ChevronLeft,
  Menu,
  X,
  Users2,
  Clock,
  BarChart3,
  ShieldCheck,
  User as UserIcon,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [user, setUser] = useState<{ name: string; email: string; role: string } | null>(null);

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch("/api/auth/me");
        const data = await res.json();
        // Adjusting based on common API structures
        if (data.success || data.name) {
          setUser(data.user || data);
        }
      } catch (err) {
        console.error("Header user fetch failed", err);
      }
    }
    fetchUser();
  }, []);

  const navItems = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Create Book", href: "/admin/create-book", icon: BookPlus },
    { name: "Books Requests", href: "/admin/requests", icon: BookOpen },
    { name: "Manage Users", href: "/admin/users", icon: Users2 },
    { name: "System Logs", href: "/admin/fetch-all-data", icon: ShieldCheck },
    { name: "Time Entry", href: "/admin/enter-mark", icon: Clock },
    { name: "Library Analytics", href: "/admin/library-visitores", icon: BarChart3 },
  ];

  return (
    <>
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white shadow-2xl"
      >
        {mobileOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      <aside
        className={`fixed lg:sticky top-0 left-0 h-screen ${collapsed ? "w-24" : "w-72"} bg-[#0B0F1A] border-r border-slate-800/60 text-slate-300 flex flex-col transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] z-40 ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
      >
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-20">
          <div className="absolute -top-24 -left-24 w-64 h-64 bg-indigo-600 rounded-full blur-[100px]" />
          <div className="absolute bottom-0 right-0 w-48 h-48 bg-blue-600 rounded-full blur-[80px]" />
        </div>

        {/* Brand Header */}
        <div className={`relative p-8 flex items-center gap-4 ${collapsed && "justify-center px-0"}`}>
          <div className="relative flex items-center justify-center group">
            <div className="w-11 h-11 bg-slate-900 rounded-xl flex items-center justify-center border border-slate-800 shadow-inner group-hover:border-indigo-500/50 transition-colors">
              <img src="/login-card-bg.png" alt="Logo" className="w-7 h-7 object-contain transition-transform duration-500 group-hover:scale-110" />
            </div>
          </div>
          {!collapsed && (
            <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>
              <h1 className="text-sm font-black tracking-tight text-white uppercase">Smart Library</h1>
              <p className="text-[9px] font-black text-indigo-500 uppercase tracking-[0.2em]">Management Suite</p>
            </motion.div>
          )}
        </div>

        {/* Navigation Section */}
        <nav className="flex-1 px-4 py-4 space-y-1 relative overflow-y-auto custom-scrollbar">
          {navItems.map((item) => {
            const active = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`group relative flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-300 ${active ? "text-white" : "hover:text-white hover:bg-white/5 text-slate-400"} ${collapsed && "justify-center px-0"}`}
              >
                {active && <motion.div layoutId="sidebar-active" className="absolute inset-0 bg-gradient-to-r from-indigo-600/10 to-transparent border-l-[3px] border-indigo-500 rounded-2xl" transition={{ type: "spring", stiffness: 300, damping: 30 }} />}
                <div className={`relative z-10 p-2.5 rounded-xl transition-all duration-500 ${active ? "bg-indigo-600 text-white shadow-[0_0_20px_rgba(79,70,229,0.3)]" : "bg-slate-800/40 group-hover:bg-slate-800 group-hover:scale-110"}`}>
                  <Icon size={18} strokeWidth={active ? 2.5 : 2} />
                </div>
                {!collapsed && <span className={`relative z-10 text-xs font-black uppercase tracking-widest transition-all ${active ? "opacity-100" : "opacity-60 group-hover:opacity-100"}`}>{item.name}</span>}
              </Link>
            );
          })}
        </nav>

        <button onClick={() => setCollapsed(!collapsed)} className="hidden lg:flex absolute -right-3 top-24 bg-slate-900 border border-slate-700 p-1.5 rounded-full text-slate-400 hover:text-white transition-all shadow-xl z-50 hover:scale-110 active:scale-90">
          <ChevronLeft className={`w-3.5 h-3.5 transition-transform duration-500 ${collapsed ? "rotate-180" : ""}`} />
        </button>

        {/* --- USER PROFILE & FOOTER AREA --- */}
        <div className="p-4 space-y-3 mt-auto relative z-10">
          {/* User Info Card */}
          <div className={`flex items-center gap-3 p-3 bg-slate-800/20 border border-slate-800/40 rounded-2xl transition-all ${collapsed ? "justify-center" : ""}`}>
            <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0">
              {user?.name ? (
                <span className="text-sm font-black uppercase">{user.name.charAt(0)}</span>
              ) : (
                <UserIcon size={18} />
              )}
            </div>

            {!collapsed && (
              <div className="overflow-hidden">
                <p className="text-[10px] font-black text-white truncate uppercase tracking-wider">
                  {user?.name || "Loading..."}
                </p>
                <p className="text-[9px] font-bold text-slate-500 truncate uppercase tracking-tighter">
                  {user?.role || "Administrator"}
                </p>
              </div>
            )}
          </div>

          {/* Logout Button */}
          <div className="bg-slate-800/20 border border-slate-800/40 rounded-[2rem] p-1.5">
            <button
              onClick={async () => {
                const res = await fetch("/api/auth/logout", { method: "POST" });
                if (res.ok) router.push("/auth/login");
              }}
              className="group flex items-center justify-center gap-3 py-3.5 rounded-[1.5rem] w-full bg-rose-500/5 hover:bg-rose-500 text-rose-500 hover:text-white transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]"
            >
              <LogOut size={16} className="group-hover:-translate-x-1 transition-transform" />
              {!collapsed && <span className="text-[10px] font-black uppercase tracking-[0.2em]">Logout</span>}
            </button>
          </div>
        </div>
      </aside>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 backdrop-blur-md z-30 lg:hidden" onClick={() => setMobileOpen(false)} />
        )}
      </AnimatePresence>
    </>
  );
}