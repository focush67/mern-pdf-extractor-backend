import { z } from "zod";

export const registerSchema = z
  .object({
    username: z.string().min(6, "Username must at-least be 6 characters long"),
    password: z
      .string()
      .min(10, "Password must be at-least 10 characters long"),
    confirmPassword: z.string().nullable(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type RegisterType = z.infer<typeof registerSchema>;
