import { NextResponse } from "next/server";

export function jsonSuccess(data, status = 200) {
  return NextResponse.json({ success: true, data }, { status });
}

export function jsonError(message, status = 400, code = "BAD_REQUEST") {
  return NextResponse.json(
    { success: false, error: { code, message } },
    { status },
  );
}

export function jsonFromGuardResult(result) {
  if (result.error === "UNAUTHORIZED") {
    return jsonError("Não autenticado", 401, "UNAUTHORIZED");
  }
  if (result.error === "FORBIDDEN") {
    return jsonError("Acesso negado", 403, "FORBIDDEN");
  }
  return null;
}
