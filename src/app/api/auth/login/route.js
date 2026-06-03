import { jsonError, jsonSuccess } from "@/lib/api/response";
import { setAccessTokenCookie } from "@/lib/auth/session";
import { authenticateUser } from "@/lib/auth/user-repository";
import { formatZodError, loginSchema } from "@/lib/validators/auth";

export async function POST(request) {
  try {
    const body = await request.json();
    const parsed = loginSchema.safeParse(body);

    if (!parsed.success) {
      return jsonError(formatZodError(parsed.error), 400, "VALIDATION_ERROR");
    }

    const { email, password } = parsed.data;
    const user = await authenticateUser(email, password);

    if (!user) {
      return jsonError("Credenciais inválidas", 401, "INVALID_CREDENTIALS");
    }

    await setAccessTokenCookie(user);

    return jsonSuccess({ user });
  } catch (error) {
    console.error("[POST /api/auth/login]", error);
    return jsonError("Erro interno do servidor", 500, "INTERNAL_ERROR");
  }
}
