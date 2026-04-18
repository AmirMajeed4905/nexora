import { NextRequest, NextResponse } from "next/server";

export function proxy(request: NextRequest) {
  const token = request.cookies.get("refreshToken")?.value;
  const { pathname } = request.nextUrl;

  const protectedRoutes = [ "/wishlist", "/checkout", "/orders"];
  const adminRoutes = ["/admin"];
  const authRoutes = ["/login", "/register"];

  // Protected route + no token → login
  if (protectedRoutes.some((route) => pathname.startsWith(route)) && !token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Admin + no token → login
  if (adminRoutes.some((route) => pathname.startsWith(route)) && !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Already logged in → home (auth pages)
  if (authRoutes.some((route) => pathname === route) && token) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/cart", "/wishlist", "/checkout", "/orders/:path*", "/admin/:path*", "/account/:path*", "/login", "/register"],
};
