"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  BookOpen,
  BookPlus,
  LogOut,
  Shield,
  ChevronRight,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Sidebar() {
  const router = useRouter(); 
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    { name: "Dashboard", href: "/admin", icon: <LayoutDashboard className="w-5 h-5" /> },
    { name: "Create Book", href: "/admin/create-book", icon: <BookPlus className="w-5 h-5" /> },
    { name: "Books Requests", href: "/admin/requests", icon: <BookOpen className="w-5 h-5" /> },
  ];

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="lg:hidden fixed top-3 right-4 z-50 p-2 rounded-lg bg-slate-800 text-white"
      >
        {mobileOpen ? <X /> : <Menu />}
      </button>

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:relative
          ${collapsed ? "w-20" : "w-64"}
          h-full
          bg-gradient-to-b from-slate-900 to-slate-800
          text-white
          flex flex-col
          overflow-hidden
          transition-all duration-300
          z-40
          ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        {/* Collapse button */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-8 hidden lg:flex
                     bg-slate-700 p-1.5 rounded-full border border-slate-800"
        >
          <ChevronRight
            className={`transition-transform ${collapsed ? "rotate-180" : ""}`}
          />
        </button>

        {/* Header */}
        <div className={`p-6 flex items-center gap-3 ${collapsed && "justify-center"}`}>
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
            <Shield />
          </div>
          {!collapsed && (
            <div>
              <h1 className="text-lg font-bold">Admin Panel</h1>
              <p className="text-xs text-slate-400">Administrator</p>
            </div>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 space-y-1">
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`
                  flex items-center gap-3 px-3 py-2.5 rounded-xl
                  transition
                  ${active
                    ? "bg-blue-600/20 border-l-4 border-blue-500"
                    : "hover:bg-slate-800/60"}
                  ${collapsed && "justify-center"}
                `}
              >
                <div
                  className={`p-2 rounded-lg ${
                    active ? "bg-blue-500" : "bg-slate-800/60"
                  }`}
                >
                  {item.icon}
                </div>
                {!collapsed && <span className="text-sm font-medium">{item.name}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-slate-700">
          <button
  onClick={async () => {
    try {
      // 1. Call the logout API you created earlier
      const res = await fetch("/api/auth/logout", {
        method: "POST",
      });

      if (res.ok) {
        // 2. Redirect to login page
        router.push("/auth/login");
      } else {
        console.error("Logout failed on server");
      }
    } catch (error) {
      console.error("Logout error:", error);
    }
  }}
  className="flex items-center justify-center space-x-3 p-3 rounded-xl w-full
             bg-gradient-to-r from-red-500/20 to-red-600/20
             hover:from-red-500/30 hover:to-red-600/30 transition "
>
  <LogOut size={20} />
  <span className="font-medium">Logout</span>
</button>
        </div>
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}
    </>
  );
}
