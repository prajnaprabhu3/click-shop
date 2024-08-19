"use client";

import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";

export default function LogoutButton() {
  return (
    <div className="flex items-center gap-1 p-2 rounded hover:px-4 duration-300 cursor-pointer hover:text-destructive/80">
      <LogOut size={16} onClick={() => signOut()} className="hover:scale-75" />
      <p className="text-sm ">Log out</p>
    </div>
  );
}
