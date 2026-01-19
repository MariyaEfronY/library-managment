import StaffSidebar from "./components/StaffSidebar";

export default function StaffLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#f8fafc]">
      {/* Sidebar */}
      <StaffSidebar />

      {/* Page Content */}
      <main
        className="
          transition-all
          lg:ml-64   /* ⬅️ reserves space for sidebar */
          min-h-screen
          overflow-y-auto
        "
      >
        {/* Mobile top spacing for burger/menu */}
        <div className="lg:hidden h-16" />

        <div className="p-4 sm:p-8 lg:p-10">
          {children}
        </div>
      </main>
    </div>
  );
}
