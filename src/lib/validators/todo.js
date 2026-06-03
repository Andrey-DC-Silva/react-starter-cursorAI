import { z } from "zod";

export const createTodoSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Título obrigatório")
    .max(200, "Título muito longo"),
});

export const updateTodoSchema = z
  .object({
    title: z.string().trim().min(1).max(200).optional(),
    completed: z.boolean().optional(),
  })
  .refine((data) => data.title !== undefined || data.completed !== undefined, {
    message: "Informe title ou completed",
  });

export function formatZodError(error) {
  const firstIssue = error.issues[0];
  return firstIssue?.message ?? "Dados inválidos";
}
