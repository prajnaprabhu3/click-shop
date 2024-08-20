import { auth } from "@/auth/config";
import { redirect } from "next/navigation";

export default async function Checkout() {
  const session = await auth();

  if (!session) redirect("/auth/login");

  return <h4>Checkout</h4>;
}
