import { z } from "zod";

export const userEditSchema = z.object({
  name: z.string().min(2, "O nome deve ter pelo menos 2 caracteres"),
  phone: z
    .string()
    .regex(/^\d{10,11}$/, "Telefone inválido. Use apenas números com DDD"),
});

export type UserEditFormValues = z.infer<typeof userEditSchema>;
