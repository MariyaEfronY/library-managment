"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  BookOpen, 
  BookPlus, 
  Settings, 
  LogOut, 
  Users,
  BarChart3,
  Bell,
  Shield,
  ChevronRight,
  Menu,
  X
} from "lucide-react";
import { useState } from "react";

export default function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    {
      name: "Dashboard",
      href: "/admin",
      icon: <LayoutDashboard className="w-5 h-5" />,
      badge: null,
    },
    {
      name: "Create Book",
      href: "/admin/create-book",
      icon: <BookPlus className="w-5 h-5" />,
      badge: null,
    },
    {
      name: " Books Requests",
      href: "/admin/requests",
      icon: <BookOpen className="w-5 h-5" />,
      badge: null,
    },
    // {
    //   name: "Users",
    //   href: "/admin/users",
    //   icon: <Users className="w-5 h-5" />,
    //   badge: 3,
    // },
    // {
    //   name: "Analytics",
    //   href: "/admin/analytics",
    //   icon: <BarChart3 className="w-5 h-5" />,
    //   badge: null,
    // },
    // {
    //   name: "Notifications",
    //   href: "/admin/notifications",
    //   icon: <Bell className="w-5 h-5" />,
    //   badge: 5,
    // },
    // {
    //   name: "Security",
    //   href: "/admin/security",
    //   icon: <Shield className="w-5 h-5" />,
    //   badge: null,
    // },
    // {
    //   name: "Settings",
    //   href: "/admin/settings",
    //   icon: <Settings className="w-5 h-5" />,
    //   badge: null,
    // },
  ];

  const handleLogout = () => {
    // Add logout logic here
    console.log("Logging out...");
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-slate-800 text-white shadow-lg"
      >
        {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:static
          ${collapsed ? "w-20" : "w-64"}
          bg-gradient-to-b from-slate-900 to-slate-800
          text-white h-screen p-6 flex flex-col
          transition-all duration-300 ease-in-out
          z-40
          ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        {/* Collapse Button */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-8 bg-slate-700 hover:bg-slate-600 
                   p-1.5 rounded-full border-2 border-slate-800 shadow-lg
                   hidden lg:flex items-center justify-center"
        >
          <ChevronRight
            className={`w-4 h-4 transition-transform duration-300 ${
              collapsed ? "rotate-180" : ""
            }`}
          />
        </button>

        {/* Header */}
        <div className={`flex items-center gap-3 mb-8 ${collapsed ? "justify-center" : ""}`}>
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
            <Shield className="w-6 h-6" />
          </div>
          {!collapsed && (
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Admin Panel
              </h1>
              <p className="text-xs text-slate-400">Administrator</p>
            </div>
          )}
        </div>

        
        {/* Navigation */}
        <nav className="flex-1 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`
                  flex items-center gap-3 px-3 py-2.5 rounded-xl
                  transition-all duration-200 group relative
                  ${isActive 
                    ? "bg-gradient-to-r from-blue-600/20 to-purple-600/20 border-l-4 border-blue-500" 
                    : "hover:bg-slate-800/50 hover:border-l-4 hover:border-slate-600"
                  }
                  ${collapsed ? "justify-center px-2" : ""}
                `}
                onClick={() => setMobileOpen(false)}
              >
                <div className={`
                  p-2 rounded-lg transition-colors
                  ${isActive 
                    ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white" 
                    : "bg-slate-800/50 text-slate-400 group-hover:text-white"
                  }
                `}>
                  {item.icon}
                </div>
                
                {!collapsed && (
                  <>
                    <span className="flex-1 font-medium text-sm">{item.name}</span>
                    {item.badge !== null && (
                      <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                        {item.badge}
                      </span>
                    )}
                  </>
                )}

                {/* Tooltip for collapsed state */}
                {collapsed && (
                  <div className="absolute left-full ml-4 px-2 py-1 bg-slate-800 text-white text-sm rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                    {item.name}
                    {item.badge !== null && (
                      <span className="ml-2 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                        {item.badge}
                      </span>
                    )}
                  </div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer Actions */}
        <div className={`mt-auto pt-6 border-t border-slate-700 ${collapsed ? "flex flex-col items-center" : "space-y-2"}`}>
          <button
            onClick={handleLogout}
            className={`
              flex items-center gap-3 px-3 py-2.5 rounded-xl
              bg-slate-800/50 hover:bg-red-600/20 hover:text-red-400
              transition-all duration-200 group w-full
              ${collapsed ? "justify-center px-2" : ""}
            `}
          >
            <LogOut className="w-5 h-5 text-red-400" />
            {!collapsed && (
              <span className="font-medium text-sm">Logout</span>
            )}
            {collapsed && (
              <div className="absolute left-full ml-4 px-2 py-1 bg-slate-800 text-white text-sm rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                Logout
              </div>
            )}
          </button>

          {!collapsed && (
            <div className="text-xs text-slate-500 text-center pt-2">
              <p>v2.1.0 • © 2024</p>
            </div>
          )}
        </div>
      </aside>

      {/* Overlay for mobile */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}
    </>
  );
}