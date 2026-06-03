import { jsonError, jsonSuccess } from "@/lib/api/response";
import { setAccessTokenCookie } from "@/lib/auth/session";
import { createUser } from "@/lib/auth/user-repository";
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
    const result = await createUser({ email, password, name });

    if (result.error === "EMAIL_EXISTS") {
      return jsonError("E-mail já cadastrado", 409, "EMAIL_EXISTS");
    }

    await setAccessTokenCookie(result.user);

    return jsonSuccess({ user: result.user }, 201);
  } catch (error) {
    console.error("[POST /api/auth/register]", error);
    return jsonError("Erro interno do servidor", 500, "INTERNAL_ERROR");
  }
}
