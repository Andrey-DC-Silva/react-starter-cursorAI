import { jsonError, jsonSuccess } from "@/lib/api/response";
import { verifyPassword } from "@/lib/auth/password";
import { setAccessTokenCookie } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";
import { sanitizeUser } from "@/lib/user";
import { formatZodError, loginSchema } from "@/lib/validators/auth";

export async function POST(request) {
  try {
    const body = await request.json();
    const parsed = loginSchema.safeParse(body);

    if (!parsed.success) {
      return jsonError(formatZodError(parsed.error), 400, "VALIDATION_ERROR");
    }

    const { email, password } = parsed.data;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return jsonError("Credenciais inválidas", 401, "INVALID_CREDENTIALS");
    }

    const isValidPassword = await verifyPassword(password, user.password);
    if (!isValidPassword) {
      return jsonError("Credenciais inválidas", 401, "INVALID_CREDENTIALS");
    }

    await setAccessTokenCookie(user);

    return jsonSuccess({ user: sanitizeUser(user) });
  } catch (error) {
    console.error("[POST /api/auth/login]", error);
    return jsonError("Erro interno do servidor", 500, "INTERNAL_ERROR");
  }
}
