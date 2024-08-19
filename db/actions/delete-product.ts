"use server";

import { ProductSchema } from "@/types/product-schema";
import { createSafeActionClient } from "next-safe-action";
import { db } from "..";
import { products } from "../schema";
import { eq } from "drizzle-orm";
import * as z from "zod";
import { revalidatePath } from "next/cache";

const actionClient = createSafeActionClient();

export const deleteProduct = actionClient
  .schema(z.object({ id: z.number() }))
  .action(async ({ parsedInput: { id } }) => {
    try {
      const data = await db
        .delete(products)
        .where(eq(products.id, id))
        .returning();

      revalidatePath("/dashboard/products");
      return { success: `Product ${data[0].title} has been deleted` };
    } catch (error) {
      return { error: "Product Deletion Failed" };
    }
  });
