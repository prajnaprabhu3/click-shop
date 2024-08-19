import { columns } from "@/components/products/columns";
import { DataTable } from "@/components/products/data-table";
import { db } from "@/db";
import { products } from "@/db/schema";
import React from "react";

export default async function Products() {
  const products = await db.query.products.findMany({
    with: {
      productVariants: { with: { variantImages: true, variantTags: true } },
    },
    orderBy: (products, { desc }) => [desc(products.id)],
  });

  if (!products) throw new Error("No products found");

  if (!products) throw new Error("No Products found!");

  const data = products.map((product) => {
    if (product.productVariants.length === 0) {
      return {
        id: product.id,
        title: product.title,
        price: product.price,
        image: "https://avatars.githubusercontent.com/u/25721272?v=4",
        variants: [],
      };
    }
    const image = product.productVariants[0].variantImages[0].url;
    return {
      id: product.id,
      title: product.title,
      price: product.price,
      variants: product.productVariants,
      image,
    };
  });

  if (!data) throw new Error("No data found");
  return <DataTable columns={columns} data={data} />;
}
