import * as z from "zod";

export const ProductSchema = z.object({
  id: z.number().optional(),
  title: z
    .string()
    .min(3, { message: "Title should be minimum 3 character of length" }),
  description: z.string().min(20, {
    message: "Description should be minimum of 20 characrers",
  }),
  price: z.coerce
    .number({ invalid_type_error: "Price must be a number" })
    .positive({ message: "Price should be a positive number" }),
});
