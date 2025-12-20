"use client";

import { useState, useEffect } from "react";
import {
  Home,
  BookOpen,
  Clock,
  LogOut,
  Menu,
  X,
  ChevronRight,
} from "lucide-react";
import { useRouter, usePathname } from "next/navigation";

export default function StudentSidebar() {
  const router = useRouter();
  const pathname = usePathname();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (
        isMobileMenuOpen &&
        !target.closest(".sidebar") &&
        !target.closest(".mobile-menu-button")
      ) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [isMobileMenuOpen]);

  const menuItems = [
    { id: 1, label: "Dashboard", icon: <Home size={20} />, path: "/student" },
    { id: 2, label: "Books", icon: <BookOpen size={20} />, path: "/student/requests" },
    { id: 3, label: "Requests Status", icon: <Clock size={20} />, path: "/student/request-status" },
  ];

  const handleNavigation = (path: string) => {
    router.push(path);          // ✅ REAL NAVIGATION
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="mobile-menu-button lg:hidden fixed top-4 left-4 z-50 p-3 rounded-lg
                   bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg"
      >
        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile Overlay */}
      <div
        className={`
          lg:hidden fixed inset-0 bg-black z-40 transition-opacity duration-300
          ${isMobileMenuOpen ? "opacity-50" : "opacity-0 pointer-events-none"}
        `}
        onClick={() => setIsMobileMenuOpen(false)}
      />

      {/* Sidebar */}
      <aside
        className={`
          sidebar fixed top-0 left-0 z-40
          w-64 h-screen
          bg-gradient-to-b from-indigo-700 to-purple-800 text-white
          flex flex-col overflow-hidden
          transition-transform duration-300 ease-in-out
          ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        {/* Header */}
        <div className="p-6 border-b border-indigo-600/50">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
              <BookOpen size={28} />
            </div>
            <div>
              <h2 className="text-xl font-bold">Student Panel</h2>
              <p className="text-sm text-indigo-200">Library Access</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 mt-4 overflow-y-auto">
          {menuItems.map((item) => {
            const isActive = pathname === item.path;

            return (
              <button
                key={item.id}
                onClick={() => handleNavigation(item.path)}
                className={`
                  flex items-center justify-between w-full p-3 rounded-xl
                  transition-all duration-200 group
                  ${isActive
                    ? "bg-white/20 shadow-lg"
                    : "hover:bg-white/10"}
                `}
              >
                <div className="flex items-center space-x-3">
                  <div
                    className={`
                      p-2 rounded-lg
                      ${isActive
                        ? "bg-white text-indigo-700"
                        : "bg-white/10 text-white group-hover:bg-white/20"}
                    `}
                  >
                    {item.icon}
                  </div>
                  <span className="font-medium">{item.label}</span>
                </div>

                <ChevronRight
                  size={18}
                  className={`transition-transform duration-200
                    ${isActive ? "rotate-90 text-white" : "text-white/50"}`}
                />
              </button>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-indigo-600/50 mt-auto">
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
        // 3. Optional: refresh to clear any cached data in the layout
        router.refresh();
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
    </>
  );
}
