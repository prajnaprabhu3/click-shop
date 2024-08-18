"use server";

import { LoginSchema } from "@/types/login-schema";
import { createSafeActionClient } from "next-safe-action";
import { db } from "..";
import { users } from "../schema";
import { eq } from "drizzle-orm";

const actionClient = createSafeActionClient();

export const emailSignIn = actionClient
  .schema(LoginSchema)
  .action(async ({ parsedInput: { email, password, twofacode } }) => {
    // console.log(email, password, twofacode);

    //check if the user in the database
    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    // return error message when user not found
    if (existingUser?.email !== email) {
      return { error: "User not found" };
    }

    // handle when email not verified
    // if(!existingUser.emailVerified){
    // handle by sending email verification
    // }

    // check if 2FA is true

    return { email };
  });
