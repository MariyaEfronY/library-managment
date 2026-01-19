import StaffSidebar from "./components/StaffSidebar";

export default function StaffLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-screen overflow-hidden bg-[#f8fafc]">
      <div className="flex h-full relative">
        
        {/* SIDEBAR COMPONENT 
            We remove the 'hidden' wrapper so that the mobile 
            burger button inside StaffSidebar stays visible.
        */}
        <StaffSidebar />

        {/* PAGE CONTENT */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-10">
          {/* This spacer ensures content doesn't get hidden under 
              the mobile menu button on small screens 
          */}
          <div className="lg:hidden h-14" /> 
          
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}