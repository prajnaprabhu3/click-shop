"use client";

import { LoginSchema } from "@/types/login-schema";
import {
  Form,
  FormItem,
  FormLabel,
  FormField,
  FormControl,
  FormDescription,
  FormMessage,
} from "../ui/form";
import { AuthCard } from "./auth-card";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

import { useAction } from "next-safe-action/hooks";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { FormSuccess } from "./form-success";
import { FormError } from "./form-error";
import { ResetPasswordSchema } from "@/types/reset-password-schema";
import { resetPassword } from "@/db/actions/reset-password";

export default function ResetPasswordForm() {
  const form = useForm<z.infer<typeof ResetPasswordSchema>>({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const [error, setError] = useState("");
  const [success, setSucccess] = useState("");

  const { execute, status, result } = useAction(resetPassword, {
    onSuccess(data) {
      if (data.data?.error) {
        setError(error);
      }
      if (data.data?.success) {
        setSucccess(data.data.success);
      }
    },
  });

  const onSubmit = (values: z.infer<typeof ResetPasswordSchema>) => {
    // console.log(values, "My Values");
    execute(values);
  };

  return (
    <AuthCard
      cardTitle="Forgot your password?"
      navigationOptionPath="/auth/login"
      navigationOptionLabel="Back to login"
      showSocials
    >
      <div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div>
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your Email"
                        disabled={status === "executing"}
                        {...field}
                        type="email"
                        autoComplete="email"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              ></FormField>

              <FormSuccess message={success} />
              <FormError message={error} />
            </div>
            <Button
              type="submit"
              className={cn(
                "w-full my-2",
                status === "executing" ? "animate-pulse" : ""
              )}
            >
              Send Email
            </Button>
          </form>
        </Form>
      </div>
    </AuthCard>
  );
}
