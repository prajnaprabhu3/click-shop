import { auth } from "@/auth/config";
import SettingsCard from "@/components/dashboard/settings-card";
import { redirect } from "next/navigation";

export default async function Settings() {
  const session = await auth();

  if (!session) redirect("/");

  if (session) {
    return <SettingsCard session={session} />;
  }
}
