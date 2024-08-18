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

  const onSubmit = (values: z.infer<typeof LoginSchema>) => {
    console.log(values, "My Values");
  };

  return (
    <AuthCard
      cardTitle="Welcome Back!"
      navigationOptionLabel="Don't have one? Crete an account"
      navigationOptionPath="/auth/register"
      showSocials
    >
      <div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-y-2 items-start">
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

              <Button className="px-0" size={"sm"} variant={"link"} asChild>
                <Link href="/auth/reset-password">Forgot Password</Link>
              </Button>
            </div>
            <Button type="submit" className="w-full my-2">
              Login
            </Button>
          </form>

          <FormSuccess message="This is a success message" />
          <FormError message="This is a error message" />
        </Form>
      </div>
    </AuthCard>
  );
}
