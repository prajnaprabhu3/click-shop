import { auth } from "@/auth/config";
import LoginForm from "@/components/auth/login-form";
import { redirect } from "next/navigation";
import { toast } from "sonner";

export default async function Login() {
  const sesstion = await auth();

  if (sesstion) {
    return redirect("/");
  }

  return (
    <div className="flex items-center justify-center h-screen">
      <LoginForm />
    </div>
  );
}
