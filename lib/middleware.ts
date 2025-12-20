import { NextResponse, NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // 1. Get the token from cookies
  const token = request.cookies.get('token')?.value;
  const { pathname } = request.nextUrl;

  // 2. Define protected paths
  const isProtectedRoute = 
    pathname.startsWith('/admin') || 
    pathname.startsWith('/student') || 
    pathname.startsWith('/staff');

  // 3. Logic: If no token and trying to access protected area -> Login
  if (!token && isProtectedRoute) {
    const loginUrl = new URL('/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  // 4. Logic: If logged in and trying to go to login page -> Home/Dashboard
  if (token && pathname === '/login') {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

// Limit the middleware to only run on these paths for better performance
export const config = {
  matcher: [
    '/admin/:path*', 
    '/student/:path*', 
    '/staff/:path*', 
    '/login'
  ],
};