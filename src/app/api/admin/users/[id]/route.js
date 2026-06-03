import { jsonError, jsonFromGuardResult, jsonSuccess } from "@/lib/api/response";
import { requireAdmin } from "@/lib/auth/guards";
import { deleteUser, findUserById, updateUser } from "@/lib/auth/user-repository";
import { adminUpdateUserSchema, formatZodError } from "@/lib/validators/user";

export async function GET(request, { params }) {
  const guardResult = await requireAdmin(request);
  const guardError = jsonFromGuardResult(guardResult);
  if (guardError) {
    return guardError;
  }

  const { id } = await params;
  const user = await findUserById(id);

  if (!user) {
    return jsonError("Usuário não encontrado", 404, "NOT_FOUND");
  }

  return jsonSuccess({ user });
}

export async function PATCH(request, { params }) {
  const guardResult = await requireAdmin(request);
  const guardError = jsonFromGuardResult(guardResult);
  if (guardError) {
    return guardError;
  }

  try {
    const { id } = await params;
    const body = await request.json();
    const parsed = adminUpdateUserSchema.safeParse(body);

    if (!parsed.success) {
      return jsonError(formatZodError(parsed.error), 400, "VALIDATION_ERROR");
    }

    const { password, ...rest } = parsed.data;
    const result = await updateUser(
      id,
      { ...rest, ...(password ? { password } : {}) },
      { isAdmin: true },
    );

    if (result.error === "NOT_FOUND") {
      return jsonError("Usuário não encontrado", 404, "NOT_FOUND");
    }
    if (result.error === "EMAIL_EXISTS") {
      return jsonError("E-mail já cadastrado", 409, "EMAIL_EXISTS");
    }
    if (result.error === "LAST_ADMIN") {
      return jsonError(
        "Não é possível remover o último administrador",
        400,
        "LAST_ADMIN",
      );
    }

    return jsonSuccess({ user: result.user });
  } catch (error) {
    console.error("[PATCH /api/admin/users/[id]]", error);
    return jsonError("Erro interno do servidor", 500, "INTERNAL_ERROR");
  }
}

export async function DELETE(request, { params }) {
  const guardResult = await requireAdmin(request);
  const guardError = jsonFromGuardResult(guardResult);
  if (guardError) {
    return guardError;
  }

  const { id } = await params;

  if (id === guardResult.user.id) {
    return jsonError(
      "Use o perfil para excluir sua própria conta",
      400,
      "SELF_DELETE",
    );
  }

  const result = await deleteUser(id);

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

  return jsonSuccess({ message: "Usuário removido" });
}
