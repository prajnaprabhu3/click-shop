"use client";

import { Session } from "next-auth";
import { signOut } from "next-auth/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogOut, Settings, TruckIcon } from "lucide-react";
import { useRouter } from "next/navigation";

export const ProfileButton = ({ user }: Session) => {
  const router = useRouter();
  if (user) {
    return (
      <div>
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger>
            <Avatar>
              <AvatarImage
                src={"https://avatars.githubusercontent.com/u/36730035?v=4"}
              />
              <AvatarFallback>{user.name?.charAt(0)}</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-40" align="end">
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => router.push("/dashboard/orders")}
              className="group cursor-pointer transition-all duration-500 ease-in-out"
            >
              <TruckIcon
                size={14}
                className="mr-2 group-hover:translate-x-1 transition-all duration-300 ease-in-out"
              />
              My Orders
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => router.push("/dashboard/settings")}
              className="group cursor-pointer transition-all duration-500 ease-in-out"
            >
              <Settings
                size={14}
                className="mr-2 group-hover:rotate-180 transition-all duration-300 ease-in-out"
              />
              Settings
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer transition-all duration-500 ease-in-out">
              <div className="group flex items-center">Theme Toggle</div>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => signOut()}
              className="group py-2 text-sm font-medium cursor-pointer transition-all duration-500 focus:bg-destructive/30"
            >
              <LogOut
                size={14}
                className="mr-2 group-hover:scale-90 transition-all duration-300 ease-in-out"
              />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    );
  }
};
