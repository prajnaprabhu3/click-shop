import { auth } from "@/auth/config";
import ProductForm from "@/components/products/product-form";
import { redirect } from "next/navigation";

export default async function AddProduct() {
  const session = await auth();

  if (session?.user.role !== "admin") return redirect("/dashboard/settings");

  return (
    <div className="flex items-center justify-center h-screen">
      <ProductForm />
    </div>
  );
}
