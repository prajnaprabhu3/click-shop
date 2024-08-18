import * as z from "zod";

export const SettingSchema = z
  .object({
    name: z.optional(z.string()),
    image: z.optional(z.string()),
    twoFaEnabled: z.optional(z.boolean()),
    email: z.optional(z.string().email()),
    password: z.optional(
      z.string().min(6, {
        message: "Password should be minimum of 6 character",
      })
    ),
    newPassword: z.optional(
      z.string().min(6, {
        message: "Password should be minimum of 6 character",
      })
    ),
  })
  .refine(
    (data) => {
      if (data.password && !data.newPassword) {
        return false;
      }

      return true;
    },
    { message: "New Password is required", path: ["newPassword"] }
  );
