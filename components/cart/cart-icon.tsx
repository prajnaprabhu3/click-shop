"use client";

import { useCartStore } from "@/store/cart-store";
import { AnimatePresence, motion } from "framer-motion";
import { ShoppingCart } from "lucide-react";
import Link from "next/link";

export default function CartIcon() {
  const { cart } = useCartStore();
  return (
    <Link href={"/cart"} className="relative px-2 cursor-pointer">
      <AnimatePresence>
        {cart.length > 0 && (
          <motion.span
            animate={{ scale: 1, opacity: 1 }}
            initial={{ opacity: 0, scale: 0 }}
            exit={{ scale: 0 }}
            className="absolute flex items-center justify-center -top-[5px] -right-0.5 w-[19px] h-[19px] dark:bg-primary bg-primary/90 text-white text-xs font-bold rounded-full"
          >
            {cart.reduce((sum, item) => sum + item.variant.quantity, 0)}
          </motion.span>
        )}
      </AnimatePresence>
      <ShoppingCart />
    </Link>
  );
}
