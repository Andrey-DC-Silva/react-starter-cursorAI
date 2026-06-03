import { jsonError, jsonFromGuardResult, jsonSuccess } from "@/lib/api/response";
import { requireAuth } from "@/lib/auth/guards";
import { deleteTodo, updateTodo } from "@/lib/todos/todo-repository";
import { formatZodError, updateTodoSchema } from "@/lib/validators/todo";

export async function PATCH(request, { params }) {
  const guardResult = await requireAuth(request);
  const guardError = jsonFromGuardResult(guardResult);
  if (guardError) {
    return guardError;
  }

  try {
    const { id } = await params;
    const body = await request.json();
    const parsed = updateTodoSchema.safeParse(body);

    if (!parsed.success) {
      return jsonError(formatZodError(parsed.error), 400, "VALIDATION_ERROR");
    }

    const todo = await updateTodo(guardResult.user.id, id, parsed.data);
    if (!todo) {
      return jsonError("Tarefa não encontrada", 404, "NOT_FOUND");
    }

    return jsonSuccess({ todo });
  } catch (error) {
    console.error("[PATCH /api/todos/[id]]", error);
    return jsonError("Erro interno do servidor", 500, "INTERNAL_ERROR");
  }
}

export async function DELETE(request, { params }) {
  const guardResult = await requireAuth(request);
  const guardError = jsonFromGuardResult(guardResult);
  if (guardError) {
    return guardError;
  }

  try {
    const { id } = await params;
    const deleted = await deleteTodo(guardResult.user.id, id);

    if (!deleted) {
      return jsonError("Tarefa não encontrada", 404, "NOT_FOUND");
    }

    return jsonSuccess({ message: "Tarefa removida" });
  } catch (error) {
    console.error("[DELETE /api/todos/[id]]", error);
    return jsonError("Erro interno do servidor", 500, "INTERNAL_ERROR");
  }
}
