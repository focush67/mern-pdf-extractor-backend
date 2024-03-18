import { z } from "zod";

export const loginSchema = z.object({
  username: z.string().min(6, "Username must at-least be 6 characters long"),
  password: z.string().min(10, "Password must be at-least 10 characters long"),
});

export type LoginType = z.infer<typeof loginSchema>;
