'use client';

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import api from "@/app/lib/axios";
import { Ticket } from "@/types"; // Pastikan tipe ini ada di types/index.ts
import { Button } from "@/app/components/ui/button";
import { Card, CardContent, CardHeader } from "@/app/components/ui/card";
import { Plus, Ticket as TicketIcon, Clock, ChevronRight, AlertCircle } from "lucide-react";
import { cn } from "@/app/lib/utils";

export default function UserDashboard() {
  
  // 1. Fetch data tiket menggunakan React Query
  // Asumsi Endpoint: GET /api/user/tickets (List tiket milik user yg login)
  // Jika endpoint ini belum ada di backend, harap dibuatkan.
  const { data: tickets = [], isLoading, isError, refetch } = useQuery<Ticket[]>({
    queryKey: ['user-tickets'],
    queryFn: async () => {
      const res = await api.get('/api/user/tickets');
      return res.data || [];
    },
  });

  // Helper untuk warna status agar lebih informatif
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'OPEN': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'IN_PROGRESS': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'CLOSED': return 'bg-slate-100 text-slate-600 border-slate-200';
      case 'LOCKED': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-slate-100 text-slate-600';
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            My Tickets
          </h1>
          <p className="text-slate-500 mt-1">
            Kelola dan pantau status tiket support Anda.
          </p>
        </div>

        <Link href="/user/create">
          <Button className="shadow-md bg-blue-600 hover:bg-blue-700">
            <Plus className="mr-2 h-4 w-4" />
            Create New Ticket
          </Button>
        </Link>
      </div>

      {/* CONTENT AREA */}
      <div className="space-y-4">
        
        {/* State: ERROR */}
        {isError && (
          <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-lg flex items-center justify-between gap-3">
             <div className="flex items-center gap-2">
                <AlertCircle size={20} />
                <p>Gagal memuat tiket Anda. Backend mungkin belum siap.</p>
             </div>
             <Button variant="outline" onClick={() => refetch()} className="border-red-200 hover:bg-red-100 text-red-700 text-sm px-3 py-1">
                Coba Lagi
             </Button>
          </div>
        )}

        {/* State: LOADING (Skeleton) */}
        {isLoading && (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="animate-pulse border-none shadow-sm">
                <CardContent className="p-6 h-24 bg-slate-100 rounded-lg" />
              </Card>
            ))}
          </div>
        )}

        {/* State: EMPTY (Tidak ada tiket) */}
        {!isLoading && !isError && tickets.length === 0 && (
           <Card className="border-dashed border-2 bg-slate-50/50">
             <CardContent className="flex flex-col items-center justify-center py-16 text-center">
               <div className="bg-white p-4 rounded-full shadow-sm mb-4">
                 <TicketIcon className="h-8 w-8 text-slate-400" />
               </div>
               <h3 className="font-semibold text-slate-900 text-lg">Belum ada tiket</h3>
               <p className="text-slate-500 max-w-sm mt-1 mb-6">
                 Anda belum pernah membuat laporan masalah. Jika ada kendala, buat tiket baru sekarang.
               </p>
               <Link href="/user/create">
                 <Button variant="outline">Buat Tiket Pertama</Button>
               </Link>
             </CardContent>
           </Card>
        )}

        {/* State: LIST (Ada tiket) */}
        {!isLoading && tickets.length > 0 && (
          <div className="grid gap-4">
            {tickets.map((ticket) => (
              <Link key={ticket.ID} href={`/user/ticket/${ticket.ID}`}>
                <Card className="group hover:shadow-md transition-all border-l-4 border-l-blue-500 cursor-pointer">
                  <CardContent className="p-5 flex items-center justify-between">
                    
                    {/* Info Kiri */}
                    <div className="space-y-1">
                      <div className="flex items-center gap-3">
                         <span className="font-mono text-xs text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                           #{ticket.ID}
                         </span>
                         <span className={cn(
                           "text-[10px] font-bold px-2 py-0.5 rounded border uppercase tracking-wider",
                           getStatusColor(ticket.Status)
                         )}>
                           {ticket.Status}
                         </span>
                      </div>
                      <h3 className="font-semibold text-lg text-slate-900 group-hover:text-blue-600 transition-colors">
                        {ticket.Subject}
                      </h3>
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <Clock size={12} />
                        <span>Dibuat: {new Date(ticket.CreatedAt).toLocaleString('id-ID')}</span>
                      </div>
                    </div>

                    {/* Icon Aksi Kanan */}
                    <div className="text-slate-300 group-hover:text-blue-500 transition-colors">
                      <ChevronRight size={20} />
                    </div>

                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}