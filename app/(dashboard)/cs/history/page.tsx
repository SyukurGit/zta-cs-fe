'use client';

import api from "@/app/lib/axios";
import { Ticket } from "@/types";
import { Card, CardContent } from "@/app/components/ui/card";
import { History, CheckCircle, Calendar } from "lucide-react";
import { useQuery } from '@tanstack/react-query';

export default function CSHistoryPage() {
  
  // Fetch History (Tiket CLOSED milik CS ini)
  const { data: tickets = [], isLoading } = useQuery<Ticket[]>({
    queryKey: ['tickets', 'history'],
    queryFn: async () => {
        // Backend harus punya endpoint ini: Return tickets where cs_id = me AND status = 'CLOSED'
        // Jika belum ada, buat handler Backend-nya.
        const res = await api.get('/api/cs/tickets/history');
        return res.data || [];
    },
  });

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center gap-3 border-b pb-4">
        <div className="p-2 bg-green-100 rounded-lg">
          <History className="h-6 w-6 text-green-700" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Resolution History</h1>
          <p className="text-slate-500 text-sm">Daftar laporan yang telah Anda selesaikan.</p>
        </div>
      </div>

      {isLoading ? (
         <div className="space-y-3">
            {[1,2,3].map(i => <Card key={i} className="animate-pulse h-16 bg-slate-50" />)}
         </div>
      ) : tickets.length === 0 ? (
         <div className="p-12 text-center text-slate-400 bg-slate-50 rounded-lg border border-dashed">
            Belum ada riwayat penyelesaian tiket.
         </div>
      ) : (
         <div className="space-y-3">
           {tickets.map((ticket) => (
             <Card key={ticket.ID} className="bg-slate-50/50 hover:bg-white transition-colors">
               <CardContent className="p-4 flex items-center justify-between">
                 <div className="flex items-center gap-4">
                    <div className="bg-green-100 text-green-700 p-2 rounded-full">
                       <CheckCircle size={20} />
                    </div>
                    <div>
                       <h3 className="font-semibold text-slate-700 line-through decoration-slate-400 decoration-2">
                          {ticket.Subject}
                       </h3>
                       <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                          <span className="font-mono">#{ticket.ID}</span>
                          <span>•</span>
                          <span>User: {ticket.User?.Email}</span>
                       </div>
                    </div>
                 </div>
                 
                 <div className="text-right text-xs text-slate-400 flex items-center gap-1">
                    <Calendar size={12} />
                    {new Date(ticket.CreatedAt).toLocaleDateString()}
                 </div>
               </CardContent>
             </Card>
           ))}
         </div>
      )}
    </div>
  );
}