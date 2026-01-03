'use client';

import { Button } from '@/app/components/ui/button';
import { Card, CardContent } from '@/app/components/ui/card';
import { Wallet, ShieldCheck, Zap } from 'lucide-react';

export default function DompetkuPage() {
  return (
   <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
  {/* HEADER */}
  <header className="flex items-center justify-between px-8 py-6 max-w-7xl mx-auto">
    <div className="flex items-center gap-2 text-slate-800 font-bold text-lg">
      <Wallet className="h-6 w-6 text-blue-600" />
      Dompetku
    </div>

    <a href="/user-login">
      <Button className="px-6">Login</Button>
    </a>
  </header>



      {/* HERO */}
      <section className="max-w-7xl mx-auto px-8 py-20 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 leading-tight">
            Kelola Keuangan Digitalmu
            <span className="text-blue-600"> Lebih Aman</span>
          </h1>
          <p className="mt-6 text-slate-600 text-lg">
            Dompetku adalah dompet digital modern untuk transaksi cepat,
            aman, dan transparan. Semua kebutuhan finansialmu dalam satu
            aplikasi.
          </p>
          <div className="mt-8 flex gap-4">
            <a href="/user-login">
              <Button className="px-8 py-6 text-base">Login</Button>
            </a>
            <a href="/user-login">
              <Button variant="outline" className="px-8 py-6 text-base">Pelajari Lebih Lanjut</Button>
            </a>
          </div>
        </div>

        {/* HERO CARD */}
        <Card className="shadow-lg border-0">
          <CardContent className="p-8">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Saldo Aktif</span>
                <ShieldCheck className="text-green-600" />
              </div>
              <div className="text-3xl font-bold text-slate-900">Rp 12.450.000</div>
              <div className="h-px bg-slate-200" />
              <div className="flex justify-between text-sm text-slate-600">
                <span>Transaksi Hari Ini</span>
                <span className="font-semibold text-slate-800">18</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* FEATURES */}
      <section className="bg-slate-50 py-20">
        <div className="max-w-7xl mx-auto px-8">
          <h2 className="text-3xl font-bold text-center text-slate-900">
            Kenapa Dompetku?
          </h2>

          <div className="mt-12 grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Zap className="text-blue-600" />}
              title="Transaksi Cepat"
              desc="Proses instan tanpa ribet, kapan pun dan di mana pun."
            />
            <FeatureCard
              icon={<ShieldCheck className="text-green-600" />}
              title="Keamanan Tinggi"
              desc="Sistem keamanan berlapis untuk melindungi saldomu."
            />
            <FeatureCard
              icon={<Wallet className="text-purple-600" />}
              title="Satu Dompet"
              desc="Bayar, transfer, dan kelola semuanya dari satu tempat."
            />
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-10 text-center text-sm text-slate-500">
        © {new Date().getFullYear()} Dompetku. All rights reserved.
      </footer>
    </main>
  );
}

function FeatureCard({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border">
      <div className="mb-4">{icon}</div>
      <h3 className="font-semibold text-lg text-slate-800">{title}</h3>
      <p className="mt-2 text-slate-600 text-sm">{desc}</p>
    </div>
  );
}
