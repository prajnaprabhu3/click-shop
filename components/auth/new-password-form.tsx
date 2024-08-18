"use client";

import {
  Form,
  FormItem,
  FormLabel,
  FormField,
  FormControl,
  FormMessage,
} from "../ui/form";
import { AuthCard } from "./auth-card";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

import { useAction } from "next-safe-action/hooks";
import { newPassword } from "@/db/actions/new-password";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { FormSuccess } from "./form-success";
import { FormError } from "./form-error";
import { NewPasswordSchema } from "@/types/new-password-schema";
import { useSearchParams } from "next/navigation";

export default function NewPasswordForm() {
  const form = useForm<z.infer<typeof NewPasswordSchema>>({
    resolver: zodResolver(NewPasswordSchema),
    defaultValues: {
      password: "",
      token: "",
    },
  });

  const [error, setError] = useState("");
  const [success, setSucccess] = useState("");

  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const { execute, status, result } = useAction(newPassword, {
    onSuccess(data) {
      console.log(data, "onSuccess new-password-form");
      if (data.data?.error) {
        setError(error);
      }
      if (data.data?.success) {
        setSucccess(data.data.success);
      }
    },
  });

  const onSubmit = (values: z.infer<typeof NewPasswordSchema>) => {
    // console.log(values, "values within new-password"); // working
    execute({ password: values.password, token });
  };

  return (
    <AuthCard
      cardTitle="Enter new password"
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
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your Password"
                        {...field}
                        type="password"
                        autoComplete="current-password"
                      />
                    </FormControl>
                    {/* <FormDescription>
                    This is your public display name.
                  </FormDescription> */}
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
              Reset Password
            </Button>
          </form>
        </Form>
      </div>
    </AuthCard>
  );
}
