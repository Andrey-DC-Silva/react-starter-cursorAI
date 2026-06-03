import { jsonError, jsonFromGuardResult, jsonSuccess } from "@/lib/api/response";
import { requireAuth } from "@/lib/auth/guards";
import { createTodo, listTodosByUserId } from "@/lib/todos/todo-repository";
import { createTodoSchema, formatZodError } from "@/lib/validators/todo";

export async function GET(request) {
  const guardResult = await requireAuth(request);
  const guardError = jsonFromGuardResult(guardResult);
  if (guardError) {
    return guardError;
  }

  const todos = await listTodosByUserId(guardResult.user.id);
  return jsonSuccess({ todos });
}

export async function POST(request) {
  const guardResult = await requireAuth(request);
  const guardError = jsonFromGuardResult(guardResult);
  if (guardError) {
    return guardError;
  }

  try {
    const body = await request.json();
    const parsed = createTodoSchema.safeParse(body);

    if (!parsed.success) {
      return jsonError(formatZodError(parsed.error), 400, "VALIDATION_ERROR");
    }

    const todo = await createTodo(guardResult.user.id, parsed.data.title);
    return jsonSuccess({ todo }, 201);
  } catch (error) {
    console.error("[POST /api/todos]", error);
    return jsonError("Erro interno do servidor", 500, "INTERNAL_ERROR");
  }
}
