import { auth } from "@/auth"
import { NextResponse } from "next/server"

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  
  // Check if they are on the dashboard OR a lesson page
  const isDashboard = req.nextUrl.pathname.startsWith('/dashboard');
  const isLesson = req.nextUrl.pathname.includes('/lessons');

  // If they are trying to access protected routes but aren't logged in
  if ((isDashboard || isLesson) && !isLoggedIn) {
    // Redirect to the default Auth.js sign-in page
    return NextResponse.redirect(new URL('/api/auth/signin', req.nextUrl));
  }
  
  return NextResponse.next();
})

// This tells Next.js to run this middleware on all pages
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}