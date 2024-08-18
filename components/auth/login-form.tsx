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
import Link from "next/link";

import { useAction } from "next-safe-action/hooks";
import { emailSignIn } from "@/db/actions/email-signin";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { FormSuccess } from "./form-success";
import { FormError } from "./form-error";

export default function LoginForm() {
  const form = useForm({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const [error, setError] = useState("");
  const [success, setSucccess] = useState("");

  const { execute, status, result } = useAction(emailSignIn, {
    onSuccess(data) {
      if (data.data?.error) {
        setError(error);
      }
      if (data.data?.success) {
        setSucccess(data.data.success);
      }
    },
  });

  const onSubmit = (values: z.infer<typeof LoginSchema>) => {
    // console.log(values, "My Values");
    execute(values);
  };

  return (
    <AuthCard
      cardTitle="Welcome Back!"
      navigationOptionPath="/auth/register"
      navigationOptionLabel="Crete a new account"
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
                        placeholder="Enter your email"
                        {...field}
                        type="email"
                        autoComplete="email"
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              ></FormField>

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

                    <FormMessage />
                  </FormItem>
                )}
              ></FormField>

              <FormSuccess message={success} />
              <FormError message={error} />

              <Button size={"sm"} variant={"link"} asChild>
                <Link href="/auth/reset-password">Forgot Password</Link>
              </Button>
            </div>
            <Button
              type="submit"
              className={cn(
                "w-full my-2",
                status === "executing" ? "animate-pulse" : ""
              )}
            >
              Login
            </Button>
          </form>
        </Form>
      </div>
    </AuthCard>
  );
}
