"use client";

import { motion } from "framer-motion";
import { SquareMousePointer } from "lucide-react";
import Link from "next/link";

export default function Logo() {
  return (
    <motion.div whileTap={{ scale: 0.9 }}>
      <Link href={"/"} className="flex items-center gap-x-2">
        <SquareMousePointer size={18} />
        <h4 className="text-base font-medium">Click Shop</h4>
      </Link>
    </motion.div>
  );
}
