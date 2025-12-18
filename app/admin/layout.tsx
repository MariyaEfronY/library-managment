import Sidebar from "./components/Sidebar";
import Header from "./components/Header";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-slate-100">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="p-6 flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
