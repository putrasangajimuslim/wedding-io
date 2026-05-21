import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { decryptData } from '@/lib/crypto'; // Import fungsi dari file luar

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Ambil cookie 'auth'
  const authCookie = request.cookies.get("auth")?.value;
  
  // Dekripsi data user
  const userData = authCookie ? decryptData(authCookie) : null;

  // 1. PROTEKSI ROUTE ADMIN
  if (pathname.startsWith('/admin')) {
    if (!userData) {
      return NextResponse.redirect(new URL('/auth', request.url));
    }
    if (userData.role?.toLowerCase() !== 'admin') {
      return NextResponse.rewrite(new URL('/forbidden', request.url));
    }
  }

  // 2. PROTEKSI ROUTE CLIENT
  if (pathname.startsWith('/client')) {
    if (!userData) {
      return NextResponse.redirect(new URL('/auth', request.url));
    }
    if (userData.role?.toLowerCase() !== 'client') {
      return NextResponse.rewrite(new URL('/forbidden', request.url));
    }
  }

  // 3. LOGIC LOGIN BYPASS
  // Jika sudah login, jangan biarkan masuk ke halaman login lagi
  if (pathname === '/auth' && userData) {
    const role = userData.role?.toLowerCase();
    const dashboard = role === 'admin' ? '/admin/dashboard' : '/client/dashboard';
    return NextResponse.redirect(new URL(dashboard, request.url));
  }

  return NextResponse.next();
}

// Menentukan rute mana saja yang diproses middleware
export const config = {
  matcher: ['/admin/:path*', '/client/:path*', '/auth'],
};