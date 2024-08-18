"use server";

import getBaseURL from "@/lib/base-url";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const domain = getBaseURL();

export const sendVerificationEmail = async (email: string, token: string) => {
  const confirmLink = `${domain}/auth/verify-email?token=${token}`;
  const { data, error } = await resend.emails.send({
    from: "Prajna <onboarding@resend.dev>",
    to: email,
    subject: "Click Shop - Confirmation Email",
    html: `<p>Click to <a href='${confirmLink}'>confirm your email</a></p>`,
  });

  if (error) return error;
  if (data) return error;
};

export const sendPasswordResetEmail = async (email: string, token: string) => {
  const confirmLink = `${domain}/auth/new-password?token=${token}`;
  const { data, error } = await resend.emails.send({
    from: "Prajna <onboarding@resend.dev>",
    to: email,
    subject: "Click Shop - Confirmation Email",
    html: `<p>Click to <a href='${confirmLink}'>reset your password</a></p>`,
  });

  if (error) return error;
  if (data) return error;
};

export const sendTwoFaCodeEmail = async (email: string, token: string) => {
  const { data, error } = await resend.emails.send({
    from: "Prajna <onboarding@resend.dev>",
    to: email,
    subject: "Click Shop - 2FA Code",
    html: `<p>Your Confirmation Code: ${token}</p>`,
  });

  if (error) return error;
  if (data) return error;
};
