"use server";

import { createSafeActionClient } from "next-safe-action";
import { db } from "..";
import {
  productVariants,
  products,
  variantImages,
  variantTags,
} from "../schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { ProductVariantSchema } from "@/types/product-variant-schema";

const actionClient = createSafeActionClient();

export const createVariant = actionClient
  .schema(ProductVariantSchema)
  .action(
    async ({
      parsedInput: {
        id,
        productID,
        color,
        editMode,
        productType,
        tags,
        variantImages: newImages,
      },
    }) => {
      try {
        if (editMode && id) {
          const editVariant = await db
            .update(productVariants)
            .set({ color, productType, updated: new Date() })
            .where(eq(productVariants.id, id))
            .returning();
          await db
            .delete(variantTags)
            .where(eq(variantTags.variantID, editVariant[0].id));
          await db.insert(variantTags).values(
            tags.map((tag) => ({
              tag,
              variantID: editVariant[0].id,
            }))
          );
          await db
            .delete(variantImages)
            .where(eq(variantImages.variantID, editVariant[0].id));
          await db.insert(variantImages).values(
            newImages.map((img, idx) => ({
              name: img.name,
              size: img.size,
              url: img.url,
              variantID: editVariant[0].id,
              order: idx,
            }))
          );
          revalidatePath("/dashboard/products");
          return { success: `Edited ${productType}` };
        }
        if (!editMode) {
          const newVariant = await db
            .insert(productVariants)
            .values({
              color,
              productType,
              productID,
            })
            .returning();
          const product = await db.query.products.findFirst({
            where: eq(products.id, productID),
          });
          await db.insert(variantTags).values(
            tags.map((tag) => ({
              tag,
              variantID: newVariant[0].id,
            }))
          );
          await db.insert(variantImages).values(
            newImages.map((img, idx) => ({
              name: img.name,
              size: img.size,
              url: img.url,
              variantID: newVariant[0].id,
              order: idx,
            }))
          );
          revalidatePath("/dashboard/products");
          return { success: `Added ${productType} variant` };
        }
      } catch (error) {
        return { error: "Failed to create variant" };
      }
    }
  );
