import { cookies } from "next/headers";
import {
  ACCESS_TOKEN_COOKIE,
  TOKEN_COOKIE_OPTIONS,
} from "@/lib/auth/constants";
import { signAccessToken, verifyAccessToken } from "@/lib/auth/jwt";
import { findUserById } from "@/lib/auth/user-repository";

export function buildTokenPayload(user) {
  return {
    sub: user.id,
    email: user.email,
    role: user.role,
  };
}

export async function setAccessTokenCookie(user) {
  const token = await signAccessToken(buildTokenPayload(user));
  const cookieStore = await cookies();
  cookieStore.set(ACCESS_TOKEN_COOKIE, token, {
    ...TOKEN_COOKIE_OPTIONS,
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function clearAccessTokenCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(ACCESS_TOKEN_COOKIE);
}

export async function getTokenFromCookies() {
  const cookieStore = await cookies();
  return cookieStore.get(ACCESS_TOKEN_COOKIE)?.value ?? null;
}

export async function getCurrentUser() {
  const token = await getTokenFromCookies();
  if (!token) {
    return null;
  }

  try {
    const payload = await verifyAccessToken(token);
    const userId = payload.sub;

    if (!userId || typeof userId !== "string") {
      return null;
    }

    return findUserById(userId);
  } catch {
    return null;
  }
}

export async function getTokenPayloadFromRequest(request) {
  const token =
    request.cookies.get(ACCESS_TOKEN_COOKIE)?.value ??
    extractBearerToken(request);

  if (!token) {
    return null;
  }

  try {
    return await verifyAccessToken(token);
  } catch {
    return null;
  }
}

function extractBearerToken(request) {
  const authorization = request.headers.get("authorization");
  if (!authorization?.startsWith("Bearer ")) {
    return null;
  }
  return authorization.slice(7);
}
