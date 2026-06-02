import { z } from "zod";

export const registerSchema = z.object({
  email: z.string().email("E-mail inválido"),
  password: z
    .string()
    .min(8, "A senha deve ter no mínimo 8 caracteres")
    .max(72, "A senha deve ter no máximo 72 caracteres"),
  name: z.string().min(2, "Nome muito curto").max(120).optional(),
});

export const loginSchema = z.object({
  email: z.string().email("E-mail inválido"),
  password: z.string().min(1, "Senha obrigatória"),
});

export function formatZodError(error) {
  const firstIssue = error.issues[0];
  return firstIssue?.message ?? "Dados inválidos";
}
