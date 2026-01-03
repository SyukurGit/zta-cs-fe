// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const role = request.cookies.get('role')?.value;
  
  const { pathname } = request.nextUrl;

  // 1. Proteksi: Jika BELUM Login
  if (!token) {
    // Izinkan akses ke Login CS, Login User, dan Verify
    if (pathname.startsWith('/login') || pathname.startsWith('/user-login') || pathname.startsWith('/verify')) {
      return NextResponse.next();
    }
    // Kalau user biasa coba akses dashboard, lempar ke user-login
    if (pathname.startsWith('/user')) {
         return NextResponse.redirect(new URL('/user-login', request.url));
    }
    // Default lempar ke login staff
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // 2. Jika SUDAH Login (Redirect kalau coba buka halaman login lagi)
  if (pathname.startsWith('/login') || pathname.startsWith('/user-login')) {
    if (role === 'CS') return NextResponse.redirect(new URL('/cs/dashboard', request.url));
    if (role === 'USER') return NextResponse.redirect(new URL('/user/dashboard', request.url));
    if (role === 'AUDITOR') return NextResponse.redirect(new URL('/auditor/logs', request.url));
  }

  // 3. Role-Based Access Control (Sama seperti sebelumnya)
  if (pathname.startsWith('/cs') && role !== 'CS') {
    return NextResponse.redirect(new URL('/login', request.url)); 
  }

  if (pathname.startsWith('/auditor') && role !== 'AUDITOR') {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (pathname.startsWith('/user') && !pathname.startsWith('/user-login') && role !== 'USER') {
    // Cegah CS/Auditor masuk dashboard user
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/cs/:path*',
    '/user/:path*',    // Ini menangkap /user/dashboard
    '/user-login',     // Tambahkan ini agar middleware juga memantau halaman login user
    '/auditor/:path*',
    '/login',
  ],
};