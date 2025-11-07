import { z } from "zod";

export const registerSchema = z.object({
  email: z.string().email().max(254),
  password: z.string().min(10).max(128),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const favoritesSchema = z.object({ seedId: z.string().length(24) });