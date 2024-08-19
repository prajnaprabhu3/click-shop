"use server";
import { createSafeActionClient } from "next-safe-action";
import * as z from "zod";
import { db } from "..";
import { productVariants } from "../schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

const actionClient = createSafeActionClient();

export const deleteVariant = actionClient
  .schema(z.object({ id: z.number() }))
  .action(async ({ parsedInput: { id } }) => {
    try {
      const deletedVariant = await db
        .delete(productVariants)
        .where(eq(productVariants.id, id))
        .returning();
      revalidatePath("dashboard/products");
      return { success: `Deleted ${deletedVariant[0].productType}` };
    } catch (error) {
      return { error: "Product variant deletion failed" };
    }
  });
