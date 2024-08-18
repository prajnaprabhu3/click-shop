"use server";

import { auth } from "@/auth/config";
import { createSafeActionClient } from "next-safe-action";
import { db } from "..";
import { eq } from "drizzle-orm";
import { users } from "../schema";
import bcrypt from "bcrypt";
import { revalidatePath } from "next/cache";
import { SettingSchema } from "@/types/settings-schema";

const actionClient = createSafeActionClient();

export const updateSettings = actionClient
  .schema(SettingSchema)
  .action(async ({ parsedInput: values }) => {
    const user = await auth();

    if (!user) return { error: "User not found" };

    const dbUser = await db.query.users.findFirst({
      where: eq(users.id, user.user.id),
    });

    if (!dbUser) return { error: "User does not exist" };

    if (user.user.isOAuth) {
      (values.email = undefined),
        (values.password = undefined),
        (values.newPassword = undefined);
      values.twoFaEnabled = undefined;
    }

    //
    if (values.password && values.newPassword && dbUser.password) {
      const passwordMatch = await bcrypt.compare(
        values.password,
        dbUser.password
      );

      if (!passwordMatch) return { error: "Password not correct" };

      const samePassword = await bcrypt.compare(
        values.newPassword,
        dbUser.password
      );

      if (samePassword)
        return { error: "Entered password is same as old password" };

      const hashedPassword = await bcrypt.hash(values.newPassword, 10);
      values.password = hashedPassword;
      values.newPassword = undefined;
    }

    const updateUser = await db
      .update(users)
      .set({
        twoFactorEnabled: values.twoFaEnabled,
        name: values.name,
        email: values.email,
        password: values.password,
        image: values.image,
      })
      .where(eq(users.id, dbUser.id));

    revalidatePath("/dashboard/settings");

    return { success: "User Details Updated Successfully" };
  });
