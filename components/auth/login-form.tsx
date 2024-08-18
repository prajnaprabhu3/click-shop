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

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";

export default function LoginForm() {
  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
      // twofacode: "",
    },
  });

  const [error, setError] = useState("");
  const [success, setSucccess] = useState("");
  const [show2FA, setShow2FA] = useState(false);

  const { execute, status, result } = useAction(emailSignIn, {
    onSuccess(data) {
      if (data.data?.error) {
        setError(data.data.error);
      }
      if (data.data?.success) {
        setSucccess(data.data.success);
      }
      if (data.data?.twoFactor) {
        setShow2FA(true);
      }
    },
  });

  const onSubmit = (values: z.infer<typeof LoginSchema>) => {
    // console.log(values, "My Values");
    execute(values);
  };

  if (show2FA) {
    return (
      <AuthCard
        cardTitle="Welcome Back!"
        navigationOptionPath="/auth/register"
        navigationOptionLabel="Crete a new account"
        showSocials={false}
        customClass="border-none"
      >
        <div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="flex flex-col ju gap-y-2 items-start">
                {/* 2fa code field  */}

                <FormField
                  control={form.control}
                  name="twofacode"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>2FA Code</FormLabel>
                      <FormControl>
                        <InputOTP
                          disabled={status === "executing"}
                          {...field}
                          maxLength={6}
                        >
                          <InputOTPGroup>
                            <InputOTPSlot index={0} />
                            <InputOTPSlot index={1} />
                            <InputOTPSlot index={2} />
                            <InputOTPSlot index={3} />
                            <InputOTPSlot index={4} />
                            <InputOTPSlot index={5} />
                          </InputOTPGroup>
                        </InputOTP>
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                ></FormField>

                {/* other fields  */}
                {!show2FA && (
                  <>
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem className="w-full">
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
                        <FormItem className="w-full">
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
                  </>
                )}

                <FormSuccess message={success} />
                <FormError message={error} />

                <Button className="px-0" size={"sm"} variant={"link"} asChild>
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
                {show2FA ? "Verify" : "Login"}
              </Button>
            </form>
          </Form>
        </div>
      </AuthCard>
    );
  }
  return (
    <AuthCard
      cardTitle="Welcome Back!"
      navigationOptionPath="/auth/register"
      navigationOptionLabel="Crete a new account"
      showSocials
      customClass="border-none"
    >
      <div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="flex flex-col ju gap-y-2 items-start">
              {/* 2fa code field  */}

              {/* other fields  */}

              <>
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="w-full">
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
                    <FormItem className="w-full">
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
              </>

              <FormSuccess message={success} />
              <FormError message={error} />

              <Button className="px-0" size={"sm"} variant={"link"} asChild>
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
              {show2FA ? "Verify" : "Login"}
            </Button>
          </form>
        </Form>
      </div>
    </AuthCard>
  );
}
