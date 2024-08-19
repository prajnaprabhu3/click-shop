"use client";

import { useCartStore } from "@/store/cart-store";
import { Button } from "../ui/button";
import { useMemo, useState } from "react";
import formatPrice from "@/lib/format-price";
import { createId } from "@paralleldrive/cuid2";
import { useRouter } from "next/navigation";

export default function CartBilling() {
  const { cart } = useCartStore();
  const [applyCoupon, setApplyCoupon] = useState(false);

  const totalPrice = useMemo(() => {
    return cart.reduce((acc, item) => {
      return acc + item.price! * item.variant.quantity;
    }, 0);
  }, [cart]);

  const totalPriceAfterEverything = useMemo(() => {
    const shippingCharge = totalPrice > 2000 ? 0 : 150;
    const discountCharge = applyCoupon ? 0.1 * totalPrice : 0;
    return totalPrice - discountCharge + shippingCharge;
  }, [cart, applyCoupon]);

  const priceInLetters = useMemo(() => {
    return [...totalPrice.toFixed(2).toString()].map((letter) => {
      return { letter, id: createId() };
    });
  }, [totalPrice]);

  const router = useRouter();

  return (
    <div className="bg-primary/10 w-full md:w-[500px] rounded-lg p-8 h-fit my-8 md:my-0">
      <h4 className="font-medium">
        Price Details (
        {cart.reduce((sum, item) => sum + item.variant.quantity, 0)} Items)
      </h4>

      <div className="mt-4 py-2 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h4 className="text-sm">Total MRP</h4>
          <h4 className="text-sm">{formatPrice(totalPrice)}</h4>
        </div>

        {!applyCoupon ? (
          <div className="flex items-center justify-between">
            <h4 className="text-sm">
              Discount Available{" "}
              <span className="text-primary text-sm font-semibold">10%</span>
            </h4>
            <Button
              onClick={() => setApplyCoupon(true)}
              variant={"outline"}
              className="py-1 text-xs h-5 border border-zinc-400"
            >
              Apply
            </Button>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <h4 className="text-sm">Discount on MRP</h4>
            <h4 className="text-sm">{formatPrice(totalPrice * 0.1)}</h4>
          </div>
        )}

        <div className="flex items-center justify-between">
          <h4 className="text-sm">Shipping Carge</h4>
          <h4 className="text-sm">
            {totalPrice > 2000 ? formatPrice(0) : formatPrice(150)}
          </h4>
        </div>
      </div>

      <hr />

      <div className="my-4 flex items-center justify-between">
        <h3 className="text-base font-semibold">Total Amount</h3>
        <h3 className="text-base font-semibold">
          {formatPrice(totalPriceAfterEverything)}
        </h3>
      </div>

      <Button
        onClick={() => router.push("/payment")}
        disabled={cart.length === 0}
        className="my-6 w-full"
      >
        Place Order
      </Button>
    </div>
  );
}
