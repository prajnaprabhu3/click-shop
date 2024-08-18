import * as z from "zod";

export const LoginSchema = z.object({
  email: z.string().email({
    message: "Invalid Email Adress",
  }),
  password: z.string().min(3, {
    message: "Enter Minimum of 3 characters",
  }),
  twofacode: z.optional(z.string()),
});
