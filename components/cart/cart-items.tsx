"use client";

import {
  Table,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
  TableHeader,
} from "@/components/ui/table";
import { useCartStore } from "@/store/cart-store";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo } from "react";
import formatPrice from "@/lib/format-price";
import Image from "next/image";
import { MinusCircle, PlusCircle } from "lucide-react";
import Lottie from "lottie-react";
import emptyState from "@/public/empty-cart.json";

import { createId } from "@paralleldrive/cuid2";
import { Button } from "../ui/button";
import CartItem from "./cart-item";
import Link from "next/link";

export default function CartItems() {
  const { cart, addToCart, removeFromCart } = useCartStore();

  const totalPrice = useMemo(() => {
    return cart.reduce((acc, item) => {
      return acc + item.price! * item.variant.quantity;
    }, 0);
  }, [cart]);

  useEffect(() => {
    console.log(cart, "cart length within cart-item");
  }, [cart]);

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
    // <motion.div className="flex flex-col items-center w-full bg-green-200 h-screen">

    // <motion.div className="flex items-center justify-center relative my-4 overflow-hidden">
    //   <span className="text-md">Total: $</span>
    //   <AnimatePresence mode="popLayout">
    //     {priceInLetters.map((letter, i) => (
    //       <motion.div key={letter.id}>
    //         <motion.span
    //           initial={{ y: 20 }}
    //           animate={{ y: 0 }}
    //           exit={{ y: -20 }}
    //           transition={{ delay: i * 0.15 }}
    //           className="text-md inline-block"
    //         >
    //           {letter.letter}
    //         </motion.span>
    //       </motion.div>
    //     ))}
    //   </AnimatePresence>
    // </motion.div>
    //   <Button
    //     // onClick={() => {
    //     //   setCheckoutProgress("payment-page");
    //     // }}
    //     className="max-w-md w-full"
    //     disabled={cart.length === 0}
    //   >
    //     Checkout
    //   </Button>
    // </motion.div>
    <div className="grid grid-cols-1 gap-8">
      {cart.map((item) => (
        <CartItem key={item.variant.variantID} {...item} />
      ))}
    </div>
  );
}
