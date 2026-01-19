"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { 
  Home, BookOpen, Clock, LogOut, Menu, X, ChevronRight, Layout 
} from "lucide-react";

export default function StudentSidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  // Close menu on navigation (Mobile)
  useEffect(() => setIsOpen(false), [pathname]);

  const menuItems = [
    { label: "Dashboard", icon: <Layout size={18} />, path: "/student" },
    { label: "Browse Books", icon: <BookOpen size={18} />, path: "/student/requests" },
    { label: "My Requests", icon: <Clock size={18} />, path: "/student/request-status" },
  ];

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/auth/logout", { method: "POST" });
      if (res.ok) { router.push("/"); router.refresh(); }
    } catch (err) { console.error(err); }
  };

  return (
    <>
      {/* ADVANCED BURGER BUTTON */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-[60] p-3 rounded-2xl bg-[#0f172a] text-white shadow-xl border border-white/10 active:scale-90 transition-all"
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* BLUR OVERLAY */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-[50] lg:hidden animate-in fade-in duration-300"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* SIDEBAR CONTAINER */}
      <aside className={`
        fixed top-0 left-0 z-[55] h-screen w-64 
        bg-[#0f172a] border-r border-slate-800 flex flex-col
        transition-all duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}>
        {/* LOGO SECTION */}
        <div className="p-8 flex flex-col items-center">
          <div className="w-16 h-16 bg-white/5 rounded-2xl p-2 border border-white/10 shadow-2xl mb-4 group hover:border-indigo-500/50 transition-colors">
            <img src="/login-card-bg.png" alt="Logo" className="w-full h-full object-contain" />
          </div>
          <div className="text-center">
            <h2 className="text-white text-xs font-bold tracking-[0.2em] uppercase">Student Hub</h2>
            <div className="h-1 w-8 bg-indigo-500 mx-auto mt-2 rounded-full" />
          </div>
        </div>

        {/* NAVIGATION */}
        <nav className="flex-1 px-4 space-y-2 mt-4">
          {menuItems.map((item) => {
            const active = pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => router.push(item.path)}
                className={`w-full flex items-center justify-between p-3.5 rounded-xl transition-all group
                  ${active ? "bg-indigo-600/10 text-white" : "text-slate-400 hover:bg-white/5 hover:text-white"}`}
              >
                <div className="flex items-center gap-3">
                  <span className={`${active ? "text-indigo-400" : "text-slate-500 group-hover:text-slate-300"}`}>
                    {item.icon}
                  </span>
                  <span className="text-sm font-semibold">{item.label}</span>
                </div>
                {active && <ChevronRight size={14} className="text-indigo-400" />}
              </button>
            );
          })}
        </nav>

        {/* FOOTER / LOGOUT */}
        <div className="p-4 bg-slate-900/50 border-t border-slate-800">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-3 py-3 rounded-xl bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500 hover:text-white transition-all font-bold text-xs"
          >
            <LogOut size={16} /> SIGN OUT
          </button>
        </div>
      </aside>
    </>
  );
}