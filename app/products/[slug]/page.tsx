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
      <main className="grid grid-cols-1 md:grid-cols-2 gap-x-2 h-screen  p-20 my-10">
        <div>
          <ProductCarousel variants={variant.product.productVariants} />
        </div>

        {/* product details  */}
        <div className="w-full md:w-[580px] flex flex-col gap-y-6 md:gap-y-0 md:p-4 md:px-20 justify-between md:h-[590px] my-10 md:my-0 py-4 md:py-0">
          <div>
            <div className="flex flex-col items-start ">
              <h3 className="text-xl md:text-2xl font-medium">
                {variant.product.title}
              </h3>
              <p className="text-base text-muted-foreground font-normal my-1">
                {variant.productType} variant
              </p>
            </div>
            <p
              className="text-sm text-muted-foreground font-normal my-2"
              dangerouslySetInnerHTML={{
                __html: `${variant.product.description}`,
              }}
            ></p>
          </div>

          {/* price  */}
          <div>
            <h4 className="font-medium">Price</h4>
            <p className="text-2xl md:text-3xl font-semibold">
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
