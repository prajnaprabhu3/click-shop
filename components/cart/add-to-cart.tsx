"use client";

import { useCartStore } from "@/store/cart-store";
import { useState } from "react";
import { Button } from "../ui/button";
import { Minus, Plus } from "lucide-react";
import { toast } from "sonner";
import { redirect, useSearchParams } from "next/navigation";
import { RiShoppingBag3Line } from "react-icons/ri";

export default function AddToCart() {
  const { addToCart } = useCartStore();
  const [quantity, setQuantity] = useState(1);
  const params = useSearchParams();
  const id = Number(params.get("id"));
  const productID = Number(params.get("productID"));
  const title = params.get("title");
  const type = params.get("type");
  const price = Number(params.get("price"));
  const image = params.get("image");

  if (!id || !productID || !title || !type || !price || !image) {
    toast.error("Product not found");
    return redirect("/");
  }
  return (
    <>
      <div className="flex items-center gap-4 justify-stretch">
        <Button
          onClick={() => {
            if (quantity > 1) {
              setQuantity(quantity - 1);
            }
          }}
          variant={"secondary"}
          className="text-primary"
        >
          <Minus size={18} strokeWidth={3} />
        </Button>
        <Button variant={"secondary"} className="flex-1">
          Quantity: {quantity}
        </Button>
        <Button
          onClick={() => {
            setQuantity(quantity + 1);
          }}
          variant={"secondary"}
          className="text-primary"
        >
          <Plus size={18} strokeWidth={3} />
        </Button>
      </div>
      <Button
        className="flex items-center gap-x-2"
        onClick={() => {
          toast.success(`Added ${title + " " + type} to your cart!`);
          addToCart({
            id: productID,
            variant: { variantID: id, quantity },
            name: title + " " + type,
            price,
            image,
          });
        }}
      >
        <RiShoppingBag3Line size={16} /> Add to Cart
      </Button>
    </>
  );
}
