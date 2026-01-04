// app/(auth)/reset-password/[token]/page.tsx
'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import api from '@/app/lib/axios';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { KeyRound, CheckCircle, AlertTriangle } from 'lucide-react';

export default function ResetPasswordPage() {
  const params = useParams();
  const router = useRouter();
  const token = params.token as string;

  const [passwords, setPasswords] = useState({ new: '', confirm: '' });
  const [status, setStatus] = useState<'IDLE' | 'LOADING' | 'SUCCESS' | 'ERROR'>('IDLE');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwords.new !== passwords.confirm) {
      setErrorMessage("Password tidak cocok.");
      setStatus('ERROR');
      return;
    }

    setStatus('LOADING');
    setErrorMessage('');

    try {
      // Panggil endpoint baru yang kita buat tadi
      await api.post('/reset-password', {
        token: token,
        new_password: passwords.new
      });
      setStatus('SUCCESS');
      
      // Redirect ke login setelah 3 detik
      setTimeout(() => router.push('/user-login'), 3000);
      
    } catch (err: any) {
      setStatus('ERROR');
      setErrorMessage(err.response?.data?.error || "Token kadaluarsa atau tidak valid.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center border-b bg-white pb-6">
          <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-2">
            <KeyRound className="text-blue-600" size={24} />
          </div>
          <CardTitle className="text-xl text-slate-800">Setel Password Baru</CardTitle>
          <p className="text-sm text-slate-500">Masukkan password baru untuk akun Anda.</p>
        </CardHeader>

        <CardContent className="p-6">
          {status === 'SUCCESS' ? (
            <div className="text-center space-y-4 py-4">
              <CheckCircle className="mx-auto text-green-500 h-16 w-16" />
              <h3 className="text-lg font-bold text-slate-800">Berhasil!</h3>
              <p className="text-slate-600">Password Anda telah diperbarui. Mengalihkan ke halaman login...</p>
              <Button className="w-full" onClick={() => router.push('/user-login')}>
                Login Sekarang
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {status === 'ERROR' && (
                <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm flex items-center gap-2">
                  <AlertTriangle size={16} /> {errorMessage}
                </div>
              )}

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Password Baru</label>
                <Input 
                  type="password" 
                  placeholder="Minimal 6 karakter"
                  value={passwords.new}
                  onChange={(e) => setPasswords({...passwords, new: e.target.value})}
                  required
                  minLength={6}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Konfirmasi Password</label>
                <Input 
                  type="password" 
                  placeholder="Ulangi password baru"
                  value={passwords.confirm}
                  onChange={(e) => setPasswords({...passwords, confirm: e.target.value})}
                  required
                  minLength={6}
                />
              </div>

              <Button 
                type="submit" 
                className="w-full bg-slate-900 hover:bg-slate-800"
                isLoading={status === 'LOADING'}
              >
                Simpan Password Baru
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}