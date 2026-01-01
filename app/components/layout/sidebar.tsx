'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/app/store/useAuthStore';
import { 
  LayoutDashboard, 
  Ticket, 
  LogOut, 
  ShieldAlert, 
  MessageSquare,
  FileText
} from 'lucide-react';
import { cn } from '@/app/lib/utils';
import { Button } from '@/app/components/ui/button';

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { role, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  // Menu untuk CS
  const csLinks = [
    { href: '/cs/dashboard', label: 'Ticket Queue', icon: LayoutDashboard },
    // CS bisa lihat tiket aktif mereka, mungkin nanti kita buat halaman detail
  ];

  // Menu untuk User
  const userLinks = [
    { href: '/user/dashboard', label: 'My Tickets', icon: Ticket },
    // { href: '/user/create', label: 'New Ticket', icon: PlusCircle }, // Bisa ditaruh di dashboard aja
  ];

  // Menu untuk Auditor
  const auditorLinks = [
    { href: '/auditor/logs', label: 'Audit Logs', icon: FileText },
  ];

  let links: any[] = [];
  if (role === 'CS') links = csLinks;
  else if (role === 'USER') links = userLinks;
  else if (role === 'AUDITOR') links = auditorLinks;

  return (
    <div className="flex h-screen w-64 flex-col bg-slate-900 text-white">
      <div className="flex h-16 items-center justify-center border-b border-slate-800 font-bold tracking-wider">
        ZTA HELPDESK
      </div>
      
      <div className="flex-1 py-6 px-3 space-y-1">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = pathname.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center px-4 py-3 text-sm font-medium rounded-md transition-colors",
                isActive 
                  ? "bg-blue-600 text-white" 
                  : "text-slate-400 hover:bg-slate-800 hover:text-white"
              )}
            >
              <Icon className="mr-3 h-5 w-5" />
              {link.label}
            </Link>
          );
        })}
      </div>

      <div className="p-4 border-t border-slate-800">
        <div className="mb-4 px-2">
           <p className="text-xs text-slate-500 uppercase font-bold">Logged in as</p>
           <p className="text-sm font-medium text-blue-400">{role}</p>
        </div>
        <Button 
          variant="ghost" 
          className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-slate-800"
          onClick={handleLogout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </div>
    </div>
  );
}