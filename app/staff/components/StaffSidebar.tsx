"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { 
  LayoutDashboard, ClipboardList, BookOpen, LogOut, Menu, X, ChevronRight, Settings 
} from "lucide-react";

export default function StaffSidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => setIsOpen(false), [pathname]);

  const menuItems = [
    { label: "Overview", icon: <LayoutDashboard size={18} />, path: "/staff" },
    { label: "Active Requests", icon: <ClipboardList size={18} />, path: "/staff/requests" },
    { label: "History Log", icon: <BookOpen size={18} />, path: "/staff/request-status" },
  ];

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/auth/logout", { method: "POST" });
      if (res.ok) { router.push("/"); router.refresh(); }
    } catch (err) { console.error(err); }
  };

  return (
    <>
      {/* BURGER BUTTON */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-[60] p-3 rounded-2xl bg-[#0f172a] text-white shadow-xl border border-white/10"
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* OVERLAY */}
      {isOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[50] lg:hidden" onClick={() => setIsOpen(false)} />
      )}

      <aside className={`
        fixed top-0 left-0 z-[55] h-screen w-64 bg-[#0f172a] border-r border-slate-800 flex flex-col transition-transform duration-300
        ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}>
        {/* LOGO */}
        <div className="p-8 flex flex-col items-center border-b border-slate-800/50">
          <div className="w-16 h-16 bg-white/5 rounded-2xl p-2 border border-white/10 mb-3">
            <img src="/login-card-bg.png" alt="Logo" className="w-full h-full object-contain" />
          </div>
          <h2 className="text-white text-[11px] font-black tracking-[0.25em] uppercase text-center">Staff Control</h2>
        </div>

        {/* NAV */}
        <nav className="flex-1 px-4 py-6 space-y-1">
          {menuItems.map((item) => {
            const active = pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => router.push(item.path)}
                className={`w-full flex items-center justify-between p-3 rounded-xl transition-all
                  ${active ? "bg-indigo-600 text-white shadow-lg shadow-indigo-900/20" : "text-slate-400 hover:bg-white/5 hover:text-white"}`}
              >
                <div className="flex items-center gap-3">
                  {item.icon}
                  <span className="text-sm font-semibold">{item.label}</span>
                </div>
              </button>
            );
          })}
        </nav>

        {/* LOGOUT */}
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