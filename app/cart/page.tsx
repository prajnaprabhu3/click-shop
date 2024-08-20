import CartBilling from "@/components/cart/cart-billing";
import CartItems from "@/components/cart/cart-items";

export default function Cart() {
  return (
    <div className="md:p-20 px-3 py-14 md:px-28">
      <div className="flex flex-col w-full md:flex-row items-start justify-between">
        <CartItems />

        {/* billing  */}
        <CartBilling />
      </div>
    </div>
  );
}
