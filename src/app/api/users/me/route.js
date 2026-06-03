import { jsonError, jsonFromGuardResult, jsonSuccess } from "@/lib/api/response";
import { requireAuth } from "@/lib/auth/guards";
import { clearAccessTokenCookie } from "@/lib/auth/session";
import { deleteUser, updateUser } from "@/lib/auth/user-repository";
import { formatZodError, updateProfileSchema } from "@/lib/validators/user";

export async function GET(request) {
  const guardResult = await requireAuth(request);
  const guardError = jsonFromGuardResult(guardResult);
  if (guardError) {
    return guardError;
  }

  return jsonSuccess({ user: guardResult.user });
}

export async function PATCH(request) {
  const guardResult = await requireAuth(request);
  const guardError = jsonFromGuardResult(guardResult);
  if (guardError) {
    return guardError;
  }

  try {
    const body = await request.json();
    const parsed = updateProfileSchema.safeParse(body);

    if (!parsed.success) {
      return jsonError(formatZodError(parsed.error), 400, "VALIDATION_ERROR");
    }

    const { password, ...rest } = parsed.data;
    const result = await updateUser(
      guardResult.user.id,
      { ...rest, ...(password ? { password } : {}) },
      { isAdmin: false },
    );

    if (result.error === "NOT_FOUND") {
      return jsonError("Usuário não encontrado", 404, "NOT_FOUND");
    }
    if (result.error === "EMAIL_EXISTS") {
      return jsonError("E-mail já cadastrado", 409, "EMAIL_EXISTS");
    }

    return jsonSuccess({ user: result.user });
  } catch (error) {
    console.error("[PATCH /api/users/me]", error);
    return jsonError("Erro interno do servidor", 500, "INTERNAL_ERROR");
  }
}

export async function DELETE(request) {
  const guardResult = await requireAuth(request);
  const guardError = jsonFromGuardResult(guardResult);
  if (guardError) {
    return guardError;
  }

  const result = await deleteUser(guardResult.user.id);

  if (result.error === "NOT_FOUND") {
    return jsonError("Usuário não encontrado", 404, "NOT_FOUND");
  }
  if (result.error === "LAST_ADMIN") {
    return jsonError(
      "Não é possível remover o último administrador",
      400,
      "LAST_ADMIN",
    );
  }

  await clearAccessTokenCookie();
  return jsonSuccess({ message: "Conta removida" });
}
