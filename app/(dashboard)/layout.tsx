import { Sidebar } from '@/app/components/layout/sidebar';


export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Sidebar Statis */}
      <Sidebar />
      
      {/* Konten Dinamis (Page) */}
      <main className="flex-1 overflow-y-auto p-8">
        {children}
      </main>
    </div>
  );
}