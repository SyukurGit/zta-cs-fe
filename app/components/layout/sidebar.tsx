'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/app/store/useAuthStore';
import { 
  LayoutDashboard, 
  Ticket, 
  LogOut, 
  ShieldCheck, 
  FileText,
  UserCheck,
  Inbox,       // Icon untuk Queue
  Briefcase,   // Icon untuk Workspace
  History      // Icon untuk History
} from 'lucide-react';
import { cn } from '@/app/lib/utils';
import { Button } from '@/app/components/ui/button';

interface MenuItem {
  href: string;
  label: string;
  icon: React.ElementType;
}

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { role, logout } = useAuthStore();

  const handleLogout = () => {
    const redirectUrl = role === 'USER' ? '/user-login' : '/login';
    document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    document.cookie = 'role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    logout();
    router.push(redirectUrl);
  };

  const menuItems: Record<string, MenuItem[]> = {
    CS: [
      { href: '/cs/dashboard', label: 'Ticket Queue', icon: Inbox },
      { href: '/cs/my-tickets', label: 'My Workspace', icon: Briefcase },
      { href: '/cs/history', label: 'Resolution History', icon: History },
    ],
    USER: [
      { href: '/user/dashboard', label: 'My Tickets', icon: Ticket },
    ],
    AUDITOR: [
      { href: '/auditor/logs', label: 'Audit Logs', icon: FileText },
    ],
  };

  const links = role ? menuItems[role] || [] : [];
  
  const roleLabel = role === 'CS' ? 'Customer Service' 
                  : role === 'AUDITOR' ? 'System Auditor' 
                  : 'End User';
  const RoleIcon = role === 'USER' ? UserCheck : ShieldCheck;

  return (
    <div className="flex h-screen w-64 flex-col bg-slate-950 text-slate-300 shadow-xl border-r border-slate-800">
      <div className="flex h-16 items-center px-6 border-b border-slate-800 bg-slate-900/50">
        <div className="font-bold tracking-wider text-white flex items-center gap-2">
           <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
           ZTA HELPDESK
        </div>
      </div>
      
      <div className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = pathname.startsWith(link.href);
          
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 group",
                isActive 
                  ? "bg-blue-600/10 text-blue-400 border border-blue-600/20" 
                  : "hover:bg-slate-800 hover:text-white"
              )}
            >
              <Icon className={cn(
                "mr-3 h-5 w-5 transition-colors",
                isActive ? "text-blue-500" : "text-slate-500 group-hover:text-white"
              )} />
              {link.label}
            </Link>
          );
        })}
      </div>

      <div className="p-4 border-t border-slate-800 bg-slate-900/30">
        <div className="flex items-center gap-3 mb-4 px-2">
           <div className="w-8 h-8 rounded bg-slate-800 flex items-center justify-center text-slate-400 border border-slate-700">
              <RoleIcon size={16} />
           </div>
           <div className="overflow-hidden">
             <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wide">Logged in as</p>
             <p className="text-sm font-medium text-slate-200 truncate">{roleLabel}</p>
           </div>
        </div>

        <Button 
          variant="outline" 
          className="w-full justify-start text-red-400 border-slate-700 hover:bg-red-950/30 hover:text-red-300 hover:border-red-900 transition-colors"
          onClick={handleLogout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sign Out
        </Button>
      </div>
    </div>
  );
}