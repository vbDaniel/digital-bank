import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token"); // ou o nome do seu cookie de auth
  const { pathname } = request.nextUrl;

  // Se não autenticado e não está na página de auth, redireciona para /auth
  if (!token && pathname !== "/auth") {
    return NextResponse.redirect(new URL("/auth", request.url));
  }

  // Se autenticado e está na página de auth, redireciona para /dashboard
  if (token && pathname === "/auth") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Se autenticado e está no root, redireciona para /dashboard
  if (token && pathname === "/") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Se não autenticado e está no root, redireciona para /auth
  if (!token && pathname === "/") {
    return NextResponse.redirect(new URL("/auth", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|public|api/auth).*)"],
};
