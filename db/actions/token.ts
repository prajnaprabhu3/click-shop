"use server";

import { eq } from "drizzle-orm";
import { db } from "..";
import { resetPasswordTokens, users, verificationTokens } from "../schema";

export const verifyToken = async (token: string) => {
  const existingToken = await getVerificationTokenByEmail(token);

  if (!existingToken) {
    return { error: "Token not found!" };
  }

  const hasExpired = new Date(existingToken.expires) < new Date();
  if (hasExpired) {
    return { error: "Token has expired" };
  }

  const existingUser = await db.query.users.findFirst({
    where: eq(users.email, existingToken.email),
  });

  if (!existingUser) {
    return { error: "Email does not exist" };
  }

  await db.update(users).set({
    emailVerified: new Date(),
    email: existingToken.email,
  });

  await db
    .delete(verificationTokens)
    .where(eq(verificationTokens.id, existingToken.id));

  return { success: "Email Verified" };
};

const getVerificationTokenByEmail = async (email: string) => {
  try {
    const verificationToken = await db.query.verificationTokens.findFirst({
      where: eq(verificationTokens.token, email),
    });

    return verificationToken;
  } catch (err) {
    return null;
  }
};

export const generateEmailVerificationToken = async (email: string) => {
  const token = crypto.randomUUID();
  const expires = new Date(new Date().getTime() + 3600 * 1000);

  const existingToken = await getVerificationTokenByEmail(email);

  if (existingToken) {
    await db
      .delete(verificationTokens)
      .where(eq(verificationTokens.id, existingToken.id));
  }

  const verificationToken = await db
    .insert(verificationTokens)
    .values({
      email,
      token,
      expires,
    })
    .returning();

  return verificationToken;
};

export const getPasswordResetTokenByToken = async (token: string) => {
  try {
    const resetPasswordToken = await db.query.resetPasswordTokens.findFirst({
      where: eq(resetPasswordTokens.token, token),
    });

    return resetPasswordToken;
  } catch (error) {
    return null;
  }
};

export const generatePasswordResetToken = async (email: string) => {
  try {
    const token = crypto.randomUUID();

    const expires = new Date(new Date().getTime() + 3600 * 1000);

    const existingToken = await getPasswordResetTokenByEmail(email);

    // if token exist then delete it
    if (existingToken) {
      await db
        .delete(resetPasswordTokens)
        .where(eq(resetPasswordTokens.id, existingToken.id));
    }

    const resetPasswordToken = await db
      .insert(resetPasswordTokens)
      .values({ email, token, expires })
      .returning();

    return resetPasswordToken;
  } catch (error) {
    console.log(error);
  }
};

export const getPasswordResetTokenByEmail = async (email: string) => {
  try {
    const passwordResetToken = await db.query.resetPasswordTokens.findFirst({
      where: eq(resetPasswordTokens.email, email),
    });

    return passwordResetToken;
  } catch (error) {
    console.log(error);
  }
};
