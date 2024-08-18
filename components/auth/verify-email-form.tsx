"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { AuthCard } from "./auth-card";
import { FormSuccess } from "./form-success";
import { FormError } from "./form-error";
import { verifyToken } from "@/db/actions/token";

export default function VerifyEmailForm() {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const token = useSearchParams().get("token");
  const router = useRouter();

  const handleEmailVerification = useCallback(() => {
    if (success || error) return;

    if (!token) setError("No token found");

    verifyToken(token!).then((data) => {
      if (data.error) setError(data.error);
      if (data.success) setSuccess(data.success);
      router.push("/auth/login");
    });
  }, []);

  useEffect(() => {
    handleEmailVerification();
  }, []);

  return (
    <AuthCard
      cardTitle="Verify your account"
      navigationOptionLabel="Back to Login"
      navigationOptionPath="/auth/login"
    >
      <div className="flex items-center flex-col justify-center w-ful">
        <p> {!success || !error ? "Verifying email..." : null}</p>
        <FormSuccess message={success} />
        <FormError message={error} />
      </div>
    </AuthCard>
  );
}
