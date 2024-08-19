"use client";

import { VariantsWithProduct } from "@/lib/infer-type-variants";
import Link from "next/link";
import Image from "next/image";
import { Badge } from "../ui/badge";

import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import formatPrice from "@/lib/format-price";
import { FiShoppingBag } from "react-icons/fi";

type ProductTypes = {
  variants: VariantsWithProduct[];
};

export default function Products({ variants }: ProductTypes) {
  const params = useSearchParams();
  const paramTag = params.get("tag");

  const filtered = useMemo(() => {
    if (paramTag && variants) {
      return variants.filter((variant) =>
        variant.variantTags.some((tag) => tag.tag === paramTag)
      );
    }
    return variants;
  }, [paramTag]);

  return (
    <main className="px-10 mx-20 grid grid-cols-1 md:grid-cols-2 gap-12 lg:grid-cols-3">
      {filtered.map((variant) => (
        <div className="py-2 flex flex-col gap-y-1 w-800 p-2" key={variant.id}>
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

          <div className="flex justify-between">
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

          <div className="my-2 flex items-center justify-between">
            {/* price  */}
            <p className="font-medium">{formatPrice(variant.product.price)}</p>

            {/* add to cart  */}
            <FiShoppingBag className="mr-3 mb-3" size={20} />
          </div>
        </div>
      ))}
    </main>
  );
}
