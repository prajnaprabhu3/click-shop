import { AvatarImage } from "@radix-ui/react-avatar";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { auth } from "@/auth/config";

export default async function DashboardProfileButton() {
  const session = await auth();
  return (
    <div className="flex items-center justify-between py-2 gap-x-2">
      <Avatar className="rounded-lg">
        <AvatarImage src={session?.user.image} />
        <AvatarFallback>{session?.user.name?.charAt(0)}</AvatarFallback>
      </Avatar>

      <div className="flex flex-col">
        <h4 className="text-sm">{session?.user.name}</h4>
        <p className="text-[10px] text-gray-600 font-semibold">
          {session?.user.email}
        </p>
      </div>
    </div>
  );
}
