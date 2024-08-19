"use client";

import { VariantsWithProduct } from "@/lib/infer-type-variants";
import Link from "next/link";
import Image from "next/image";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import formatPrice from "@/lib/format-price";
import { FiShoppingBag } from "react-icons/fi";
import { toast } from "sonner";
import { useCartStore } from "@/store/cart-store";

type ProductTypes = {
  variants: VariantsWithProduct[];
};

export default function Products({ variants }: ProductTypes) {
  const params = useSearchParams();
  const paramTag = params.get("tag");
  const [quantity, setQuantity] = useState(1);
  const { cart, addToCart } = useCartStore();

  return (
    <main className="px-10 mx-20 grid grid-cols-1 md:grid-cols-2 gap-12 lg:grid-cols-3">
      {variants.map((variant) => (
        <div
          className="py-2 flex flex-col gap-y-1 w-800 p-2 border rounded-lg"
          key={variant.id}
        >
          <Link
            href={`/products/${variant.id}?id=${variant.id}&productID=${variant.productID}&price=${variant.product.price}&title=${variant.product.title}&type=${variant.productType}&image=${variant.variantImages[0].url}`}
          >
            <Image
              className="rounded-md pb-2"
              src={variant.variantImages[0].url}
              width={380}
              height={430}
              alt={variant.product.title}
              loading="lazy"
            />
          </Link>

          <div className="flex justify-between px-2">
            <div className="font-medium">
              <h2>{variant.product.title}</h2>
              <p
                className="text-sm text-muted-foreground font-normal"
                dangerouslySetInnerHTML={{
                  __html: `${variant.product.description.substring(0, 40)}`,
                }}
              ></p>
              {/* <p className="text-sm text-muted-foreground">
                {variant.productType}
              </p> */}
            </div>
          </div>

          <div className="my-2 flex items-center justify-between px-2">
            {/* price  */}
            <p className="font-medium">{formatPrice(variant.product.price)}</p>

            {/* add to cart  */}
            <FiShoppingBag
              onClick={() => {
                toast.success(`Added to cart`);
                addToCart({
                  id: variant.productID,
                  variant: { variantID: variant.id, quantity },
                  name: variant.product.title + " " + variant.productType,
                  price: variant.product.price,
                  image: variant.variantImages[0].url,
                });
              }}
              className="mr-3 cursor-pointer"
              size={20}
            />
          </div>
        </div>
      ))}
    </main>
  );
}
