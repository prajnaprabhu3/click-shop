"use client";

import formatPrice from "@/lib/format-price";
import { VariantsWithProduct } from "@/lib/infer-type-variants";
import { CartItem as CardItemType, useCartStore } from "@/store/cart-store";
import { MinusCircle, PlusCircle, X } from "lucide-react";
import Image from "next/image";

export default function CartItem({
  name,
  image,
  id,
  variant,
  price,
}: CardItemType) {
  const { addToCart, removeFromCart, removeItemCompletely } = useCartStore();
  return (
    <div className="flex gap-x-8 border rounded-lg p-3 w-[650px] justify-between relative">
      <div className="flex items-center gap-x-10">
        <Image
          className="rounded-lg"
          src={image}
          width="130"
          height="130"
          alt="image"
        />

        <div className="flex flex-col gap-y-3">
          <div>
            {/* product title  */}
            <h2 className="font-semibold text-base">{name}</h2>

            {/* product variant  */}
            {/* <p className="text-muted-foreground text-sm font-normal">
              Blue Tote Bag
            </p> */}

            {/* product description  */}
            {/* <p className="text-muted-foreground text-xs font-light">
              This is my product description
              
            </p> */}
          </div>

          {/* quantity change option  */}
          <div>
            <div className="flex items-center justify-between w-14">
              <MinusCircle
                onClick={() => {
                  removeFromCart({
                    name,
                    image,
                    id,
                    price,
                    variant: {
                      quantity: 1,
                      variantID: variant.variantID,
                    },
                  });
                }}
                className="cursor-pointer hover:text-muted-foreground duration-300 transition-colors"
                size={14}
              />
              <p className="text-sm font-semibold">{variant.quantity}</p>
              <PlusCircle
                className="cursor-pointer hover:text-muted-foreground duration-300 transition-colors"
                onClick={() => {
                  addToCart({
                    name,
                    image,
                    id,
                    price,
                    variant: {
                      quantity: 1,
                      variantID: variant.variantID,
                    },
                  });
                }}
                size={14}
              />
            </div>
          </div>

          {/* price  */}
          <h4 className="font-semibold text-sm">{formatPrice(price)}</h4>
        </div>
      </div>

      <X
        onClick={() => {
          removeItemCompletely({
            name,
            image,
            id,
            price,
            variant: {
              quantity: variant.quantity,
              variantID: variant.variantID,
            },
          });
        }}
        size={16}
        className="top-1.5 right-2 absolute cursor-pointer"
      />
    </div>
  );
}
