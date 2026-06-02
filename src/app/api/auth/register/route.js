import { jsonError, jsonSuccess } from "@/lib/api/response";
import { hashPassword } from "@/lib/auth/password";
import { setAccessTokenCookie } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";
import { sanitizeUser } from "@/lib/user";
import {
  formatZodError,
  registerSchema,
} from "@/lib/validators/auth";

export async function POST(request) {
  try {
    const body = await request.json();
    const parsed = registerSchema.safeParse(body);

    if (!parsed.success) {
      return jsonError(formatZodError(parsed.error), 400, "VALIDATION_ERROR");
    }

    const { email, password, name } = parsed.data;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return jsonError("E-mail já cadastrado", 409, "EMAIL_EXISTS");
    }

    const hashedPassword = await hashPassword(password);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name: name ?? null,
        role: "USER",
      },
    });

    await setAccessTokenCookie(user);

    return jsonSuccess({ user: sanitizeUser(user) }, 201);
  } catch (error) {
    console.error("[POST /api/auth/register]", error);
    return jsonError("Erro interno do servidor", 500, "INTERNAL_ERROR");
  }
}
