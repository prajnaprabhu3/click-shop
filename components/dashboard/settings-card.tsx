"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Session } from "next-auth";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { Switch } from "@/components/ui/switch";
import { FormSuccess } from "@/components/auth/form-success";
import { FormError } from "@/components/auth/form-error";
import { useState } from "react";
import { useAction } from "next-safe-action/hooks";
import { SettingSchema } from "@/types/settings-schema";
import { updateSettings } from "@/db/actions/settings";

type SettingsCardProp = {
  session: Session;
};

export default function SettingsCard(session: SettingsCardProp) {
  console.log(session);
  const form = useForm<z.infer<typeof SettingSchema>>({
    resolver: zodResolver(SettingSchema),
    defaultValues: {
      name: session.session.user?.name!,
      email: session.session.user?.email!,
      image: session.session.user.image || undefined,
      password: undefined,
      newPassword: undefined,
      twoFaEnabled: session.session.user.twoFaEnabled || undefined,
    },
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [avatarUploading, setAvatarUploading] = useState(false);

  const { execute, status } = useAction(updateSettings, {
    onSuccess(data) {
      if (data.data?.success) setSuccess(data.data.success);
      if (data.data?.error) setSuccess(data.data.error);
    },
    onError(error) {
      setError("Something went wrong");
    },
  });

  const onSubmit = (values: z.infer<typeof SettingSchema>) => {
    execute(values);
  };

  return (
    <Card className="border-none w-[700px]">
      <CardHeader>
        <CardTitle>Your Settings</CardTitle>
        <CardDescription>Update yout account settings</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* name  */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="name"
                      disabled={status === "executing"}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* image  */}
            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Profile Image</FormLabel>
                  <div className="flex">
                    {!form.getValues("image") && (
                      <div className="font-bold">
                        {session.session.user?.name?.charAt(0).toUpperCase()}
                      </div>
                    )}

                    {form.getValues("image") && (
                      <Image
                        alt="profile-image"
                        className="rounded-full"
                        src={form.getValues("image")!}
                        width={42}
                        height={42}
                      />
                    )}
                  </div>
                  <FormControl>
                    <Input
                      placeholder="User Image"
                      type="hidden"
                      disabled={
                        status === "executing" || session.session.user.isOAuth
                      }
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* password  */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter Password"
                      disabled={
                        status === "executing" || session.session.user.isOAuth
                      }
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* newPassword  */}
            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Update Password</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter New Password"
                      disabled={
                        status === "executing" || session.session.user.isOAuth
                      }
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="twoFaEnabled"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center gap-x-3">
                    <FormLabel>Enable 2FA?</FormLabel>
                    <FormControl>
                      <Switch
                        disabled={
                          status === "executing" ||
                          session.session.user.isOAuth === true // change, we want this witch to be disabed for an OAuth login
                        }
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </div>
                  <FormDescription>
                    Enable Two Facor for you account to be secure!
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormSuccess message={success} />
            <FormError message={error} />
            <Button
              typeof="submit"
              disabled={status === "executing" || avatarUploading}
              type="submit"
            >
              Update Your Details
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
