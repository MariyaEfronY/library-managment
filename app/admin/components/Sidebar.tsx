"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  BookOpen,
  BookPlus,
  LogOut,
  Library,
  ChevronLeft,
  Menu,
  X,
  Users2,
  Database,
  Settings,
} from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Create Book", href: "/admin/create-book", icon: BookPlus },
    { name: "Books Requests", href: "/admin/requests", icon: BookOpen },
    { name: "Users", href: "/admin/users", icon: Users2 },
    { name: "System Data", href: "/admin/fetch-all-data", icon: Database },
  ];

  return (
    <>
      {/* Mobile Toggle Trigger */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white shadow-2xl"
      >
        {mobileOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Sidebar Container */}
      <aside
        className={`
          fixed lg:sticky top-0 left-0 h-screen
          ${collapsed ? "w-24" : "w-72"}
          bg-[#0B0F1A] border-r border-slate-800/60
          text-slate-300 flex flex-col
          transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]
          z-40
          ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        {/* Advanced Background Glows */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-20">
          <div className="absolute -top-24 -left-24 w-64 h-64 bg-indigo-600 rounded-full blur-[100px]" />
          <div className="absolute bottom-0 right-0 w-48 h-48 bg-blue-600 rounded-full blur-[80px]" />
        </div>

        {/* Brand Header */}
        <div className={`relative p-8 flex items-center gap-4 ${collapsed && "justify-center px-0"}`}>
          <div className="relative flex items-center justify-center">
            {/* The Container with solid background */}
            <div className="w-11 h-11 bg-slate-900 rounded-xl flex items-center justify-center border border-slate-800 shadow-inner">

              {/* The Logo Image */}
              <img
                src="/login-card-bg.png"
                alt="Smart Library Logo"
                className="w-8 h-8 object-contain transition-transform duration-300 group-hover:scale-105"
                onError={(e) => {
                  // Fallback styling if image fails to load
                  e.currentTarget.style.display = 'none';
                }}
              />

            </div>
          </div>

          {!collapsed && (
            <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>
              <h1 className="text-lg font-black tracking-tight text-white">Smart Library</h1>
              <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">Core Engine</p>
            </motion.div>
          )}
        </div>

        {/* Navigation Section */}
        <nav className="flex-1 px-4 py-4 space-y-2 relative overflow-y-auto custom-scrollbar">
          {navItems.map((item) => {
            const active = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`
                  group relative flex items-center gap-4 px-4 py-3.5 rounded-2xl
                  transition-all duration-300
                  ${active ? "text-white" : "hover:text-white hover:bg-white/5"}
                  ${collapsed && "justify-center px-0"}
                `}
              >
                {/* Active Indicator (Framer Motion) */}
                {active && (
                  <motion.div
                    layoutId="sidebar-active"
                    className="absolute inset-0 bg-gradient-to-r from-indigo-600/20 to-transparent border-l-2 border-indigo-500 rounded-2xl"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}

                <div className={`
                    relative z-10 p-2 rounded-xl transition-all duration-300
                    ${active ? "bg-indigo-600 text-white shadow-[0_0_20px_rgba(79,70,229,0.4)]" : "bg-slate-800/40 text-slate-400 group-hover:bg-slate-700"}
                `}>
                  <Icon size={20} />
                </div>

                {!collapsed && (
                  <span className={`relative z-10 text-sm font-bold tracking-wide transition-all ${active ? "opacity-100" : "opacity-70 group-hover:opacity-100"}`}>
                    {item.name}
                  </span>
                )}

                {/* Tooltip for Collapsed State */}
                {collapsed && (
                  <div className="absolute left-full ml-4 px-3 py-1.5 bg-slate-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50 border border-slate-700">
                    {item.name}
                  </div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Toggle (Floating) */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="hidden lg:flex absolute -right-3 top-24 bg-slate-900 border border-slate-700 p-1.5 rounded-full text-slate-400 hover:text-white transition-all shadow-xl z-50 hover:scale-110"
        >
          <ChevronLeft className={`w-4 h-4 transition-transform duration-500 ${collapsed ? "rotate-180" : ""}`} />
        </button>

        {/* Footer Area */}
        <div className="p-4 mt-auto">
          <div className="bg-slate-800/30 border border-slate-800/50 rounded-[2rem] p-2">
            <button
              onClick={async () => {
                const res = await fetch("/api/auth/logout", { method: "POST" });
                if (res.ok) router.push("/auth/login");
              }}
              className="group flex items-center justify-center gap-3 py-4 rounded-[1.5rem] w-full
               bg-gradient-to-r from-rose-500/10 to-rose-600/10 hover:from-rose-500 hover:to-rose-600
               text-rose-500 hover:text-white transition-all duration-500 ease-out shadow-lg hover:shadow-rose-500/20"
            >
              <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" />
              {!collapsed && <span className="text-xs font-black uppercase tracking-widest">Sign Out</span>}
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Glass Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 lg:hidden"
            onClick={() => setMobileOpen(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
}