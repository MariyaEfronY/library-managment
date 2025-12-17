import StaffSidebar from "./components/StaffSidebar";

export default function StaffLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen overflow-hidden bg-gray-100">
      {/* Sidebar */}
      <StaffSidebar />

      {/* Main content */}
      <main className="flex-1 overflow-y-auto p-6 lg:ml-64">
        {children}
      </main>
    </div>
  );
}
