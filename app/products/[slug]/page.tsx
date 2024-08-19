import { eq } from "drizzle-orm";

import formatPrice from "@/lib/format-price";
import { db } from "@/db";
import { productVariants } from "@/db/schema";
import ProductType from "@/components/products/product-type-animation";
import ProductVariantChoose from "@/components/products/product-variant-choose";
import ProductCarousel from "@/components/products/product-carousel";
import { Button } from "@/components/ui/button";
import { RiShoppingBag3Line } from "react-icons/ri";
import { Truck } from "lucide-react";
import AddToCart from "@/components/cart/add-to-cart";

export const revalidate = 60;

export async function generateStaticParams() {
  const data = await db.query.productVariants.findMany({
    with: {
      variantImages: true,
      variantTags: true,
      product: true,
    },
    orderBy: (productVariants, { desc }) => [desc(productVariants.id)],
  });
  if (data) {
    const slugID = data.map((variant) => ({ slug: variant.id.toString() }));
    return slugID;
  }
  return [];
}

export default async function Page({ params }: { params: { slug: string } }) {
  const variant = await db.query.productVariants.findFirst({
    where: eq(productVariants.id, Number(params.slug)),
    with: {
      product: {
        with: {
          productVariants: {
            with: { variantImages: true, variantTags: true },
          },
        },
      },
    },
  });

  if (variant) {
    return (
      <main className="grid grid-cols-2 gap-x-2 h-screen  p-20 my-10">
        <div>
          <ProductCarousel variants={variant.product.productVariants} />
        </div>

        {/* product details  */}
        <div className="w-[580px] flex flex-col  p-4 px-20 justify-between h-[590px]">
          <div>
            <div className="flex items-center ">
              <h3 className="text-2xl font-medium">{variant.product.title} </h3>
              <h3 className="text-2xl font-medium">
                - {variant.productType} variant
              </h3>
            </div>
            <p
              className="text-sm text-muted-foreground font-normal"
              dangerouslySetInnerHTML={{
                __html: `${variant.product.description.substring(0, 40)}`,
              }}
            ></p>
          </div>

          {/* price  */}
          <div>
            <h4 className="font-medium">Price</h4>
            <p className="text-3xl font-semibold">
              {formatPrice(variant.product.price)}
            </p>
          </div>

          {/* colors  */}
          <div>
            <h4 className="font-medium">Colors</h4>
            <div className="flex items-center gap-x-2 my-2">
              {variant.product.productVariants.map((prodVariant) => (
                <ProductVariantChoose
                  key={prodVariant.id}
                  productID={variant.productID}
                  productType={prodVariant.productType}
                  id={prodVariant.id}
                  color={prodVariant.color}
                  price={variant.product.price}
                  title={variant.product.title}
                  image={prodVariant.variantImages[0].url}
                />
              ))}
            </div>
          </div>

          <AddToCart />
        </div>
      </main>
    );
  }
}
