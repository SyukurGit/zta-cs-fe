'use client';

import { useRouter } from "next/navigation";
import api from "@/app/lib/axios";
import { Ticket } from "@/types"; // Pastikan interface Ticket ada
import { Card, CardContent } from "@/app/components/ui/card";
import { Briefcase, ArrowRight, Clock, User } from "lucide-react";
import { useQuery } from '@tanstack/react-query';

export default function CSMyWorkspacePage() {
  const router = useRouter();

  // Fetch Tiket Saya (IN_PROGRESS)
  const { data: tickets = [], isLoading } = useQuery<Ticket[]>({
    queryKey: ['tickets', 'mine'],
    queryFn: async () => {
      // Pastikan backend endpoint ini sudah ada (lihat diskusi sebelumnya)
      const res = await api.get('/api/cs/tickets/mine');
      return res.data || [];
    },
    refetchInterval: 10000,
  });

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center gap-3 border-b pb-4">
        <div className="p-2 bg-blue-100 rounded-lg">
          <Briefcase className="h-6 w-6 text-blue-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">My Workspace</h1>
          <p className="text-slate-500 text-sm">Tiket aktif yang sedang Anda tangani.</p>
        </div>
      </div>

      {isLoading ? (
         <div className="grid md:grid-cols-2 gap-4">
            {[1,2].map(i => <Card key={i} className="animate-pulse h-40 bg-slate-50" />)}
         </div>
      ) : tickets.length === 0 ? (
         <div className="p-8 text-center text-slate-500 bg-slate-50 rounded-lg border border-dashed">
            Anda tidak memiliki tiket aktif. Silakan ambil dari <span className="font-semibold text-slate-700">Ticket Queue</span>.
         </div>
      ) : (
         <div className="grid gap-4 md:grid-cols-2">
           {tickets.map((ticket) => (
             <Card 
               key={ticket.ID} 
               className="cursor-pointer hover:shadow-lg hover:border-blue-400 transition-all border-t-4 border-t-blue-500"
               onClick={() => router.push(`/cs/my-tickets/ticket/${ticket.ID}`)}
             >
               <CardContent className="p-6">
                 <div className="flex justify-between items-start mb-4">
                    <span className="font-mono text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded">#{ticket.ID}</span>
                    <span className="flex h-2 w-2 relative">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                    </span>
                 </div>
                 
                 <h3 className="font-bold text-lg text-slate-900 mb-2 line-clamp-1">{ticket.Subject}</h3>
                 
                 <div className="text-sm text-slate-500 space-y-1 mb-4">
                    <div className="flex items-center gap-2"><User size={14} /> {ticket.User?.Email}</div>
                    <div className="flex items-center gap-2"><Clock size={14} /> {new Date(ticket.CreatedAt).toLocaleString()}</div>
                 </div>

                 <div className="pt-4 border-t flex justify-end text-blue-600 font-semibold text-sm items-center gap-1 group">
                    Lanjut Chat <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                 </div>
               </CardContent>
             </Card>
           ))}
         </div>
      )}
    </div>
  );
}