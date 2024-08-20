"use client";

import { useCartStore } from "@/store/cart-store";
import { Button } from "../ui/button";
import { useMemo, useState } from "react";
import formatPrice from "@/lib/format-price";
import { createId } from "@paralleldrive/cuid2";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { BadgePercent, PartyPopper, TicketPercent } from "lucide-react";

export default function CartBilling() {
  const { cart } = useCartStore();
  const [applyCoupon, setApplyCoupon] = useState(false);
  const [totalSaving, setTotalSaving] = useState(0);

  const totalPrice = useMemo(() => {
    return cart.reduce((acc, item) => {
      return acc + item.price! * item.variant.quantity;
    }, 0);
  }, [cart]);

  const totalPriceAfterEverything = useMemo(() => {
    const shippingCharge = totalPrice > 2000 ? 0 : 150;
    const discountCharge = applyCoupon ? 0.1 * totalPrice : 0;
    setTotalSaving(discountCharge + shippingCharge);
    return totalPrice - discountCharge + shippingCharge;
  }, [cart, applyCoupon]);

  const priceInLetters = useMemo(() => {
    return [...totalPrice.toFixed(2).toString()].map((letter) => {
      return { letter, id: createId() };
    });
  }, [totalPrice]);

  const router = useRouter();

  return (
    <div className="w-full md:w-fit">
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

          {!applyCoupon && cart.length > 0 ? (
            <div className="flex items-center justify-between">
              <h4 className="text-sm">
                Discount Available{" "}
                <span className="text-primary text-sm font-semibold">10%</span>
              </h4>

              <Button
                onClick={() => setApplyCoupon(true)}
                variant={"link"}
                className="px-0 text-sm transition-all duration-200 hover:no-underline hover:scale-90"
              >
                <BadgePercent size={15} strokeWidth={2.5} className="mr-1" />
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
          onClick={() => router.push("/checkout")}
          disabled={cart.length === 0}
          className="my-2 px-2 w-full"
        >
          Place Order
        </Button>
      </div>

      {totalSaving > 0 && cart.length > 0 && (
        <p className="flex items-center gap-x-3 py-3 my-1 md:my-3 bg-green-100 dark:bg-green-900/90 text-green-700 dark:text-green-300 text-sm rounded px-4">
          <PartyPopper size={18} />
          You are saving
          <span className="font-bold text-xs">{formatPrice(totalSaving)}</span>
          on this order!
        </p>
      )}
    </div>
  );
}
