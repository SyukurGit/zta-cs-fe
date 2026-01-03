// app/(auth)/user-login/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/app/store/useAuthStore';
import api from '@/app/lib/axios';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Card, CardContent, CardHeader } from '@/app/components/ui/card';
import { AlertCircle, UserCheck } from 'lucide-react';
import Link from 'next/link';

export default function UserLoginPage() {
  const router = useRouter();
  const { login } = useAuthStore();
  
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const res = await api.post('/login', formData);
      const { token, role } = res.data;

      // --- LOGIC PENGECEKAN ROLE KHUSUS USER ---
      if (role !== 'USER') {
        setError('Portal ini khusus User. Staff silakan login di halaman Staff.');
        setIsLoading(false);
        return;
      }

      // Simpan Cookie untuk Middleware
      document.cookie = `token=${token}; path=/; max-age=86400; SameSite=Strict`;
      document.cookie = `role=${role}; path=/; max-age=86400; SameSite=Strict`;

      // Simpan State Global
      login(token, role);

      // Redirect ke User Dashboard
      router.push('/user/dashboard');

    } catch (err: any) {
      setError(err.response?.data?.error || 'Gagal login. Cek email/password.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-50 p-4">
      <Card className="w-full max-w-md border-t-4 border-t-blue-500 shadow-lg">
        <CardHeader className="text-center">
          <div className="mx-auto mb-2 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
             <UserCheck size={24} />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">User Helpdesk</h1>
          <p className="text-sm text-slate-500">Masuk untuk membuat tiket bantuan</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm flex items-center gap-2">
                <AlertCircle size={16} />
                {error}
              </div>
            )}
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Email User</label>
              <Input 
                type="email" 
                placeholder="user@gmail.com"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                required
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Password</label>
              <Input 
                type="password" 
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                required
              />
            </div>

            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={isLoading}>
              {isLoading ? 'Masuk...' : 'Masuk sebagai User'}
            </Button>

            <div className="text-center text-xs text-slate-400 mt-4">
               Staff atau CS? <Link href="/login" className="text-blue-600 underline">Login di sini</Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}