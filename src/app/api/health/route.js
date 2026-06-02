import { jsonSuccess } from "@/lib/api/response";

export async function GET() {
  return jsonSuccess({
    status: "ok",
    timestamp: new Date().toISOString(),
  });
}
