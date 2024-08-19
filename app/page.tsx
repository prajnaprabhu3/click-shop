import Navbar from "@/components/navigation/navbar";
import Products from "@/components/products/products";
import { db } from "@/db";

export default async function Home() {
  const data = await db.query.productVariants.findMany({
    with: {
      variantImages: true,
      variantTags: true,
      product: true,
    },
    orderBy: (productVariants, { desc }) => [desc(productVariants.id)],
  });

  return (
    <main className="">
      <Navbar />

      <div className="my-10 py-10">
        <Products variants={data} />
      </div>
    </main>
  );
}
