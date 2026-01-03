'use client';

import { useRouter } from "next/navigation";
import api from "@/app/lib/axios";
import { Ticket } from "@/types";
import { Button } from "@/app/components/ui/button";
import { Card, CardContent } from "@/app/components/ui/card";
import { AlertCircle, CheckCircle2, Clock, User as UserIcon, Inbox } from "lucide-react";
import { useQuery, useMutation } from '@tanstack/react-query';

export default function CSPoolPage() {
  const router = useRouter();

  // Fetch Tiket OPEN (Antrian)
  const { data: tickets = [], isLoading, isError, refetch } = useQuery<Ticket[]>({
    queryKey: ['tickets', 'open'],
    queryFn: async () => {
      const res = await api.get('/api/cs/tickets/open');
      return res.data || [];
    },
    refetchInterval: 5000,
  });

  // Action Claim
  const claimMutation = useMutation({
    mutationFn: async (ticketId: number) => {
      await api.post(`/api/cs/tickets/${ticketId}/claim`);
      return ticketId;
    },
    onSuccess: (ticketId) => {
      router.push(`/cs/my-tickets/ticket/${ticketId}`);
    },
    onError: (err: any) => {
      alert(err.response?.data?.error || "Gagal klaim tiket.");
      refetch();
    }
  });

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center gap-3 border-b pb-4">
        <div className="p-2 bg-slate-100 rounded-lg">
          <Inbox className="h-6 w-6 text-slate-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Ticket Pool</h1>
          <p className="text-slate-500 text-sm">Kolam antrian tiket publik. Ambil tiket untuk mulai bekerja.</p>
        </div>
      </div>

      {isError && (
        <div className="bg-red-50 text-red-600 p-3 rounded-md flex gap-2 items-center">
           <AlertCircle size={16} /> Gagal memuat antrian.
        </div>
      )}

      {isLoading ? (
        <div className="space-y-3">
          {[1,2,3].map(i => <Card key={i} className="animate-pulse h-24 bg-slate-50" />)}
        </div>
      ) : tickets.length === 0 ? (
        <div className="text-center py-12 bg-slate-50 rounded-lg border border-dashed">
          <CheckCircle2 className="mx-auto h-10 w-10 text-green-500 mb-2" />
          <h3 className="font-semibold text-slate-900">Kolam Kosong!</h3>
          <p className="text-slate-500">Tidak ada tiket antrian saat ini.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {tickets.map((ticket) => (
            <Card key={ticket.ID} className="group hover:border-blue-400 transition-all border-l-4 border-l-slate-300">
              <CardContent className="p-5 flex items-center justify-between">
                <div>
                   <div className="flex items-center gap-2 mb-1">
                      <span className="bg-slate-100 text-slate-600 text-xs font-mono px-2 py-0.5 rounded">#{ticket.ID}</span>
                      <h3 className="font-semibold text-lg text-slate-900">{ticket.Subject}</h3>
                   </div>
                   <div className="flex gap-4 text-sm text-slate-500">
                      <span className="flex items-center gap-1"><UserIcon size={12}/> {ticket.User?.Email}</span>
                      <span className="flex items-center gap-1"><Clock size={12}/> {new Date(ticket.CreatedAt).toLocaleString()}</span>
                   </div>
                </div>
                <Button 
                   onClick={() => claimMutation.mutate(ticket.ID)}
                   disabled={claimMutation.isPending}
                   className="bg-slate-900 hover:bg-slate-800"
                >
                  {claimMutation.isPending ? 'Claiming...' : 'Claim Ticket'}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}