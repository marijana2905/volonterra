import { getSessionCookie } from 'better-auth/cookies';
import { NextRequest, NextResponse } from 'next/server';

const protectedRoutes = ['/dashboard'];

export async function proxy(request: NextRequest) {
  const { nextUrl } = request;
  const sessionCookie = getSessionCookie(request);

  const res = NextResponse.next();

  const isLoggedIn = !!sessionCookie;

  // Ako je greskom na nekoj login/register ruti a vec je logovan, preusmeri ga na pocetnu stranicu
  const isOnAuthRoute = nextUrl.pathname.startsWith('/auth');
  if (isOnAuthRoute && isLoggedIn) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // Ako je na nekoj ruti koja zahteva autentifikaciju a nije logovan, preusmeri ga na login stranicu
  const isOnProtectedRoute = protectedRoutes.some((route) => {
    return nextUrl.pathname.startsWith(route);
  });
  if (isOnProtectedRoute && !isLoggedIn) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  return res;
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
