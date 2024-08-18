"use server";

import { eq } from "drizzle-orm";
import { db } from "..";
import {
  resetPasswordTokens,
  twoFaTokens,
  users,
  verificationTokens,
} from "../schema";
import crypto from "crypto";

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

// function to get 2FA token using email
export const getTwoFactorTokenByEmail = async (email: string) => {
  try {
    const twoFactorToken = await db.query.twoFaTokens.findFirst({
      where: eq(twoFaTokens.email, email),
    });

    return twoFactorToken;
  } catch (error) {
    console.log(error);
  }
};

// function to get 2FA token using token
export const getTwoFactorTokenByToken = async (token: string) => {
  try {
    const twoFactorToken = await db.query.twoFaTokens.findFirst({
      where: eq(twoFaTokens.token, token),
    });

    return twoFactorToken;
  } catch (error) {
    return null;
  }
};

// function to generate 2FA token
export const generateTwoFactorToken = async (email: string) => {
  try {
    const token = crypto.randomInt(100_000, 1_000_000).toString();

    const expires = new Date(new Date().getTime() + 3600 * 1000);

    const existingToken = await getTwoFactorTokenByEmail(email);

    if (existingToken) {
      await db.delete(twoFaTokens).where(eq(twoFaTokens.id, existingToken.id));
    }

    const twoFactorToken = await db
      .insert(twoFaTokens)
      .values({ email, token, expires })
      .returning();

    return twoFactorToken;
  } catch (error) {
    console.log(error);
  }
};
