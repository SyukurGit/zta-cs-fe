'use client';

import Link from "next/link";
import { Button } from "@/app/components/ui/button";
import { Card, CardContent, CardHeader } from "@/app/components/ui/card";
import { Plus } from "lucide-react";

export default function UserDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            My Tickets
          </h1>
          <p className="text-slate-500">
            Kelola tiket support Anda di sini.
          </p>
        </div>

        <Link href="/user/create">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Create New Ticket
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader className="font-semibold border-b">History</CardHeader>
        <CardContent className="p-0">
          <div className="p-8 text-center text-slate-500">
            Anda belum membuat tiket apapun.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
