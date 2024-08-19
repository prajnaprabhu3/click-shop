import CartBilling from "@/components/cart/cart-billing";
import CartItems from "@/components/cart/cart-items";

export default function Cart() {
  return (
    <div className="p-20 px-28">
      <div className="flex justify-between">
        <CartItems />

        {/* billing  */}
        <CartBilling />
      </div>
    </div>
  );
}
