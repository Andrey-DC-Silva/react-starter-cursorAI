import { jsonSuccess } from "@/lib/api/response";
import { clearAccessTokenCookie } from "@/lib/auth/session";

export async function POST() {
  await clearAccessTokenCookie();
  return jsonSuccess({ message: "Sessão encerrada" });
}
