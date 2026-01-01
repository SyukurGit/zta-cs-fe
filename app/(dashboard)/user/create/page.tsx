'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/app/lib/axios';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { ArrowLeft, TicketPlus } from 'lucide-react';
import Link from 'next/link';

export default function CreateTicketPage() {
  const router = useRouter();
  const [subject, setSubject] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // POST /api/user/tickets
      const res = await api.post('/api/user/tickets', { subject });
      
      // Backend return JSON object tiket, kita butuh ID-nya
      const newTicketId = res.data.ID;
      
      // Redirect langsung ke ruang chat tiket tersebut
      router.push(`/user/ticket/${newTicketId}`);
    } catch (err) {
      console.error("Gagal buat tiket:", err);
      alert("Gagal membuat tiket. Coba lagi.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Link href="/user/dashboard" className="flex items-center text-slate-500 hover:text-slate-900 transition-colors">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Dashboard
      </Link>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 text-blue-700 rounded-lg">
              <TicketPlus size={24} />
            </div>
            <CardTitle>Buat Tiket Baru</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Subjek Masalah
              </label>
              <Input 
                placeholder="Contoh: Saya tidak bisa reset password..." 
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                required
                autoFocus
              />
              <p className="text-[0.8rem] text-slate-500">
                Jelaskan masalah Anda secara singkat. Detail bisa dibahas di chat nanti.
              </p>
            </div>
            
            <div className="flex justify-end pt-4">
              <Button type="submit" isLoading={isLoading}>
                Submit Ticket
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}