import { getTokenPayloadFromRequest } from "@/lib/auth/session";
import { findUserById } from "@/lib/auth/user-repository";

export async function requireAuth(request) {
  const payload = await getTokenPayloadFromRequest(request);

  if (!payload?.sub || typeof payload.sub !== "string") {
    return { error: "UNAUTHORIZED", status: 401 };
  }

  const user = await findUserById(payload.sub);

  if (!user) {
    return { error: "UNAUTHORIZED", status: 401 };
  }

  return { user };
}

export async function requireAdmin(request) {
  const result = await requireAuth(request);

  if (result.error) {
    return result;
  }

  if (result.user.role !== "ADMIN") {
    return { error: "FORBIDDEN", status: 403 };
  }

  return result;
}
