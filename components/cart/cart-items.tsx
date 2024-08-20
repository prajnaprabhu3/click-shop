"use client";

import { useCartStore } from "@/store/cart-store";
import { useEffect, useMemo } from "react";
import Lottie from "lottie-react";
import emptyState from "@/public/empty-cart.json";

import CartItem from "./cart-item";
import Link from "next/link";
import { motion } from "framer-motion";

export default function CartItems() {
  const { cart, addToCart, removeFromCart } = useCartStore();

  const totalPrice = useMemo(() => {
    return cart.reduce((acc, item) => {
      return acc + item.price! * item.variant.quantity;
    }, 0);
  }, [cart]);

  useEffect(() => {}, [cart]);

  if (cart.length === 0) {
    return (
      <div className="flex-col w-full flex items-center justify-center">
        <motion.div
          animate={{ opacity: 1 }}
          initial={{ opacity: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <h2 className="text-2xl text-muted-foreground text-center">
            Oops! Your cart is empty,{" "}
            <Link className="text-primary" href={"/"}>
              Shop?
            </Link>
          </h2>
          <Lottie className="h-80" animationData={emptyState} />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-8">
      {cart.map((item) => (
        <CartItem key={item.variant.variantID} {...item} />
      ))}
    </div>
  );
}
