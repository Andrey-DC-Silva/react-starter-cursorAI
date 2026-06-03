import { jsonError, jsonFromGuardResult, jsonSuccess } from "@/lib/api/response";
import { requireAdmin } from "@/lib/auth/guards";
import { createUser, listUsers } from "@/lib/auth/user-repository";
import { adminCreateUserSchema, formatZodError } from "@/lib/validators/user";

export async function GET(request) {
  const guardResult = await requireAdmin(request);
  const guardError = jsonFromGuardResult(guardResult);
  if (guardError) {
    return guardError;
  }

  const users = await listUsers();
  return jsonSuccess({ users });
}

export async function POST(request) {
  const guardResult = await requireAdmin(request);
  const guardError = jsonFromGuardResult(guardResult);
  if (guardError) {
    return guardError;
  }

  try {
    const body = await request.json();
    const parsed = adminCreateUserSchema.safeParse(body);

    if (!parsed.success) {
      return jsonError(formatZodError(parsed.error), 400, "VALIDATION_ERROR");
    }

    const result = await createUser(parsed.data);

    if (result.error === "EMAIL_EXISTS") {
      return jsonError("E-mail já cadastrado", 409, "EMAIL_EXISTS");
    }

    return jsonSuccess({ user: result.user }, 201);
  } catch (error) {
    console.error("[POST /api/admin/users]", error);
    return jsonError("Erro interno do servidor", 500, "INTERNAL_ERROR");
  }
}
