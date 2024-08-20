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
import { LogOut, Moon, Settings, Sun, TruckIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { useState } from "react";

export const ProfileButton = ({ user }: Session) => {
  const router = useRouter();
  const { theme, setTheme } = useTheme();

  const [currentTheme, setCurrentTheme] = useState("");
  if (user) {
    return (
      <div>
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger>
            <Avatar>
              <AvatarImage src={user.image} />
              <AvatarFallback>{user.name?.charAt(0)}</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-40" align="end">
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
            <DropdownMenuItem
              onClick={() =>
                theme === "light" ? setTheme("dark") : setTheme("light")
              }
              className="cursor-pointer transition-all duration-500 ease-in-out group"
            >
              <div className="group flex items-center">
                {theme === "light" ? (
                  <Moon size={14} className="mr-2 group-hover:scale-90" />
                ) : (
                  <Sun size={14} className="mr-2 group-hover:scale-90" />
                )}

                {theme === "light" ? "Dark" : "Light"}
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => signOut()}
              className="group py-2 text-sm font-medium cursor-pointer transition-all duration-500 focus:bg-destructive/30 dark:focus:bg-destructive/80"
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
