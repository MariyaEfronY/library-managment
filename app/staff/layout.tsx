import StaffSidebar from "./components/StaffSidebar";

export default function StaffLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-screen overflow-hidden bg-gray-100">
      <div className="flex h-full">
        {/* Sidebar (NO SCROLL) */}
        <aside className="hidden lg:block w-64 shrink-0">
          <StaffSidebar />
        </aside>

        {/* Page Content (ONLY THIS SCROLLS) */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
