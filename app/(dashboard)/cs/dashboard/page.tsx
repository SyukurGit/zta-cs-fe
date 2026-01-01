'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/app/lib/axios";
import { Ticket } from "@/types";
import { Button } from "@/app/components/ui/button";
import { Card, CardContent } from "@/app/components/ui/card";
import { AlertCircle, CheckCircle2, Clock, User as UserIcon } from "lucide-react";

export default function CSDashboard() {
  const router = useRouter();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isClaiming, setIsClaiming] = useState<number | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      setIsLoading(true);
      const res = await api.get('/api/cs/tickets/open');
      setTickets(res.data || []);
    } catch (err) {
      console.error(err);
      setError("Gagal memuat antrian tiket.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClaim = async (ticketId: number) => {
    setIsClaiming(ticketId);
    setError("");

    try {
      await api.post(`/api/cs/tickets/${ticketId}/claim`);
      router.push(`/cs/dashboard/ticket/${ticketId}`);
    } catch (err: any) {
      const msg = err.response?.data?.error || "Gagal mengambil tiket.";
      setError(msg);
      setIsClaiming(null);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Ticket Queue</h1>
          <p className="text-slate-500">
            Klaim tiket untuk mulai menangani user
          </p>
        </div>
        <Button
          variant="outline"
          onClick={fetchTickets}
          disabled={isLoading}
        >
          Refresh
        </Button>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-2 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-red-600">
          <AlertCircle size={18} />
          <span className="text-sm">{error}</span>
        </div>
      )}

      {/* Loading Skeleton */}
      {isLoading ? (
        <div className="space-y-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6 flex items-center justify-between">
                <div className="space-y-3 w-full">
                  <div className="h-4 w-20 bg-slate-200 rounded" />
                  <div className="h-5 w-2/3 bg-slate-200 rounded" />
                  <div className="h-3 w-1/3 bg-slate-200 rounded" />
                </div>
                <div className="h-10 w-28 bg-slate-200 rounded" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : tickets.length === 0 ? (
        /* Empty State */
        <Card className="border-dashed bg-slate-50">
          <CardContent className="flex flex-col items-center py-14 text-center">
            <CheckCircle2 className="h-10 w-10 text-green-500 mb-3" />
            <p className="font-semibold text-slate-700">
              Antrian kosong
            </p>
            <p className="text-sm text-slate-500">
              Tidak ada tiket OPEN saat ini
            </p>
          </CardContent>
        </Card>
      ) : (
        /* Ticket List */
        <div className="space-y-4">
          {tickets.map((ticket) => (
            <Card
              key={ticket.ID}
              className="group relative overflow-hidden border-l-4 border-l-blue-500 hover:shadow-lg transition-all"
            >
              <CardContent className="p-6 flex items-center justify-between gap-6">
                
                {/* Info */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono bg-slate-100 px-2 py-0.5 rounded">
                      #{ticket.ID}
                    </span>
                    <h3 className="text-lg font-semibold text-slate-900">
                      {ticket.Subject}
                    </h3>
                  </div>

                  <div className="flex items-center gap-6 text-sm text-slate-500">
                    <div className="flex items-center gap-1">
                      <UserIcon size={14} />
                      <span>{ticket.User?.Email || "Unknown User"}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock size={14} />
                      <span>
                        {new Date(ticket.CreatedAt).toLocaleString("id-ID")}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Action */}
                <Button
                  onClick={() => handleClaim(ticket.ID)}
                  disabled={isClaiming === ticket.ID}
                  isLoading={isClaiming === ticket.ID}
                  className="min-w-30"
                >
                  Claim
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
