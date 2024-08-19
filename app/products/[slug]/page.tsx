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
      // <main>
      //   <section className="flex flex-col lg:flex-row gap-4 lg:gap-12">
      //     <div className="flex-1">
      //       <ProductCarousel variants={variant.product.productVariants} />
      //     </div>
      //     <div className="flex  flex-col flex-1">
      //       <h2 className="text-2xl font-bold">{variant?.product.title}</h2>
      //       <div>
      //         <ProductType variants={variant.product.productVariants} />
      //       </div>

      //       <p className="text-2xl font-medium py-2">
      //         {formatPrice(variant.product.price)}
      //       </p>
      //       <div
      //         dangerouslySetInnerHTML={{ __html: variant.product.description }}
      //       ></div>
      //       <p className="text-secondary-foreground font-medium my-2">
      //         Available Colors
      //       </p>
      //       <div className="flex gap-4 ">
      // {variant.product.productVariants.map((prodVariant) => (
      //   <ProductVariantChoose
      //     key={prodVariant.id}
      //     productID={variant.productID}
      //     productType={prodVariant.productType}
      //     id={prodVariant.id}
      //     color={prodVariant.color}
      //     price={variant.product.price}
      //     title={variant.product.title}
      //     image={prodVariant.variantImages[0].url}
      //   />
      // ))}
      //       </div>
      //     </div>
      //   </section>
      // </main>
      <main className="grid grid-cols-2 gap-x-2 h-screen  p-20 my-10">
        <div>
          <ProductCarousel variants={variant.product.productVariants} />
        </div>

        {/* product details  */}
        <div className="w-[580px] flex flex-col  p-4 px-20 justify-between h-[590px]">
          <div>
            <h3 className="text-2xl font-medium">{variant.product.title}</h3>
            <p
              className="text-sm text-muted-foreground font-normal"
              dangerouslySetInnerHTML={{
                __html: `${variant.product.description.substring(0, 40)}`,
              }}
            ></p>
          </div>
          {/* price  */}
          <p className="text-3xl font-semibold">
            {formatPrice(variant.product.price)}
          </p>

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
          {/* add to cart functionality */}

          <div className="w-full">
            <Button className="flex items-center gap-x-2 w-full">
              <RiShoppingBag3Line size={16} /> Add to Cart
            </Button>

            <p className="flex items-center gap-x-2 mt-4 font-normal font-sm">
              <Truck size={18} strokeWidth={2.5} />
              Free shipping over 2000
            </p>
          </div>
        </div>
      </main>
    );
  }
}
