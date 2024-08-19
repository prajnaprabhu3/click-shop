import { auth } from "@/auth/config";
import RegisterForm from "@/components/auth/register-form";
import { redirect } from "next/navigation";

export default async function Register() {
  const sesstion = await auth();

  if (sesstion) {
    return redirect("/");
  }
  return (
    <div className="flex items-center justify-center h-screen">
      <RegisterForm />
    </div>
  );
}
