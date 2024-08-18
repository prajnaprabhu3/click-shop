"use server";

import { LoginSchema } from "@/types/login-schema";
import { createSafeActionClient } from "next-safe-action";
import { db } from "..";
import { users } from "../schema";
import { eq } from "drizzle-orm";

import { signIn } from "@/auth/config";
import { AuthError } from "next-auth";
import { generateEmailVerificationToken } from "./token";
import { sendVerificationEmail } from "./emai";

const actionClient = createSafeActionClient();

export const emailSignIn = actionClient
  .schema(LoginSchema)
  .action(async ({ parsedInput: { email, password, twofacode } }) => {
    try {
      // console.log(email, password, twofacode);

      console.log("after exisitngUser");
      const existingUser = await db.query.users.findFirst({
        where: eq(users.email, email),
      });

      console.log("after exisitngUser");
      if (existingUser?.email !== email) {
        return { error: "User not found" };
      }

      if (!existingUser.emailVerified) {
        const verificationToken = await generateEmailVerificationToken(
          existingUser.email
        );

        console.log("before sending email");
        await sendVerificationEmail(
          verificationToken[0].email,
          verificationToken[0].token
        );

        return { success: "Confirmation email sent" };
      }

      // check if 2FA is true - TODO

      await signIn("credentials", {
        email,
        password,
        redirectTo: "/",
      });
    } catch (error) {
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
