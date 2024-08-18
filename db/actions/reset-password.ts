"use server";

import { ResetPasswordSchema } from "@/types/reset-password-schema";
import { createSafeActionClient } from "next-safe-action";
import { users } from "../schema";
import { db } from "..";
import { eq } from "drizzle-orm";
import { generatePasswordResetToken } from "./token";
import { sendPasswordResetEmail } from "./emai";

const actionClient = createSafeActionClient();

export const resetPassword = actionClient
  .schema(ResetPasswordSchema)
  .action(async ({ parsedInput: { email } }) => {
    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    if (!existingUser) return { error: "User not found" };

    const resetPasswordToken = await generatePasswordResetToken(email);

    if (!resetPasswordToken) return { error: "Token not generated" };

    sendPasswordResetEmail(
      resetPasswordToken[0].email,
      resetPasswordToken[0].token
    );

    return { success: "Reset Password email send" };
  });
