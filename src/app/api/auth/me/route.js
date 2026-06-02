import { jsonError, jsonSuccess } from "@/lib/api/response";
import { requireAuth } from "@/lib/auth/guards";

export async function GET(request) {
  const guardResult = await requireAuth(request);
  if (guardResult.error) {
    return jsonError("Não autenticado", guardResult.status, guardResult.error);
  }

  return jsonSuccess({ user: guardResult.user });
}
