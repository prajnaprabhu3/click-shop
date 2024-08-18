import * as z from "zod";

export const NewPasswordSchema = z.object({
  password: z
    .string()
    .min(6, { message: "Password should be minimum of 6 characters" }),
  token: z.string().nullable().optional(),
});
