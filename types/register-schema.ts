import * as z from "zod";

export const RegisterSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6, {
    message: "Password must be at leat 6 characters long",
  }),
  name: z
    .string()
    .min(3, { message: "Please add a name of atlast 3 characters" }),
});
