import { z } from "zod";

const emailSchema = z.string().email("E-mail inválido");
const passwordSchema = z
  .string()
  .min(8, "A senha deve ter no mínimo 8 caracteres")
  .max(72, "A senha deve ter no máximo 72 caracteres");
const nameSchema = z.string().min(2, "Nome muito curto").max(120).optional().nullable();
const roleSchema = z.enum(["USER", "ADMIN"]);

export const updateProfileSchema = z.object({
  email: emailSchema.optional(),
  name: nameSchema,
  password: passwordSchema.optional(),
});

export const adminCreateUserSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  name: nameSchema,
  role: roleSchema.default("USER"),
});

export const adminUpdateUserSchema = z.object({
  email: emailSchema.optional(),
  name: nameSchema,
  password: passwordSchema.optional(),
  role: roleSchema.optional(),
});

export function formatZodError(error) {
  const firstIssue = error.issues[0];
  return firstIssue?.message ?? "Dados inválidos";
}
