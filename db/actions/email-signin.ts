"use server";

import { LoginSchema } from "@/types/login-schema";
import { createSafeActionClient } from "next-safe-action";
import { db } from "..";
import { users } from "../schema";
import { eq } from "drizzle-orm";
import {
  generateEmailVerificationToken,
  generateTwoFactorToken,
  getTwoFactorTokenByEmail,
} from "./token";
import { sendTwoFaCodeEmail, sendVerificationEmail } from "./email";
import { signIn } from "@/auth/config";
import { AuthError } from "next-auth";
import { twoFaTokens } from "../schema";

const actionClient = createSafeActionClient();

export const emailSignIn = actionClient
  .schema(LoginSchema)
  .action(async ({ parsedInput: { email, password, twofacode } }) => {
    try {
      // console.log(email, password, twofacode);

      const existingUser = await db.query.users.findFirst({
        where: eq(users.email, email),
      });

      if (existingUser?.email !== email) {
        return { error: "User not found" };
      }

      if (!existingUser.emailVerified) {
        const verificationToken = await generateEmailVerificationToken(
          existingUser.email
        );

        await sendVerificationEmail(
          verificationToken[0].email,
          verificationToken[0].token
        );

        return { success: "Confirmation email sent" };
      }

      if (existingUser.twoFactorEnabled && existingUser.email) {
        if (twofacode) {
          const twoFactorCode = await getTwoFactorTokenByEmail(
            existingUser.email
          );

          if (!twoFactorCode) return { error: "Invalid Token" };

          if (twoFactorCode.token != twofacode)
            return { error: "Invalid Token" };

          const hasExpired = new Date(twoFactorCode.expires) < new Date();

          if (hasExpired) return { error: "Code has expired" };

          await db
            .delete(twoFaTokens)
            .where(eq(twoFaTokens.id, twoFactorCode.id));
        } else {
          // generate 2FA tokens
          const twoFaCodeGenerated = await generateTwoFactorToken(
            existingUser.email
          );
          if (!twoFaCodeGenerated) return { error: "No 2FA code" };

          await sendTwoFaCodeEmail(
            twoFaCodeGenerated[0].email,
            twoFaCodeGenerated[0].token
          );

          return { twoFactor: "2FA Token Send" };
        }
      }

      await signIn("credentials", {
        email,
        password,
        redirectTo: "/",
      });
    } catch (error) {
      console.log(error);
      if (error instanceof AuthError) {
        switch (error.type) {
          case "CredentialsSignin":
            return { error: "Email or Password Incorrect" };
          case "AccessDenied":
            return { error: error.message };
          case "OAuthSignInError":
            return { error: error.message };
          default:
            return { error: "Something went wrong" };
        }
      }

      throw error;
    }
  });
