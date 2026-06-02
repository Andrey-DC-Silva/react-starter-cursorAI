import { NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { ACCESS_TOKEN_COOKIE } from "@/lib/auth/constants";

function getSecretKey() {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    return null;
  }
  return new TextEncoder().encode(secret);
}

async function verifyToken(token) {
  const secret = getSecretKey();
  if (!secret) {
    return null;
  }

  try {
    const { payload } = await jwtVerify(token, secret);
    return payload;
  } catch {
    return null;
  }
}

export async function middleware(request) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(ACCESS_TOKEN_COOKIE)?.value;
  const payload = token ? await verifyToken(token) : null;
  const isAuthenticated = Boolean(payload?.sub);
  const isAdmin = payload?.role === "ADMIN";

  const isAdminPage = pathname.startsWith("/admin");
  const isAdminApi = pathname.startsWith("/api/admin");
  const isAuthPage =
    pathname === "/login" || pathname === "/register";

  if ((isAdminPage || isAdminApi) && !isAuthenticated) {
    if (isAdminApi) {
      return NextResponse.json(
        { success: false, error: { code: "UNAUTHORIZED", message: "Não autenticado" } },
        { status: 401 },
      );
    }
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if ((isAdminPage || isAdminApi) && !isAdmin) {
    if (isAdminApi) {
      return NextResponse.json(
        { success: false, error: { code: "FORBIDDEN", message: "Acesso negado" } },
        { status: 403 },
      );
    }
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (isAuthPage && isAuthenticated) {
    return NextResponse.redirect(
      new URL(isAdmin ? "/admin" : "/", request.url),
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*", "/login", "/register"],
};
